// Servidor do Dossiê Paranormal: serve o app e guarda contas, fichas, homebrew, configurações e imagens em SQLite.
// Sem dependências: usa apenas módulos do Node.js 22.13+ (node:sqlite).
'use strict';
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {DatabaseSync}=require('node:sqlite');

const PORT=+process.env.PORT||3000;
const RAIZ=path.resolve(__dirname,'..');
const DB_PATH=path.resolve(process.env.DB_PATH||path.join(__dirname,'dados','dossie.db'));
const PERMITIR_CADASTRO=process.env.PERMITIR_CADASTRO!=='0';
const COOKIE_SECURE=process.env.COOKIE_SECURE==='1';
const MAX_JSON=2*1024*1024, MAX_IMG=8*1024*1024, MAX_DOCS=1000;
const SESSAO_DIAS=30;
const TIPOS_IMG={'image/png':1,'image/jpeg':1,'image/gif':1,'image/webp':1};

/* ---------------- banco ---------------- */
fs.mkdirSync(path.dirname(DB_PATH),{recursive:true});
const db=new DatabaseSync(DB_PATH);
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS usuarios(id TEXT PRIMARY KEY, usuario TEXT UNIQUE NOT NULL COLLATE NOCASE, hash TEXT NOT NULL, sal TEXT NOT NULL, criado INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS sessoes(token TEXT PRIMARY KEY, usuario_id TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE, expira INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS docs(usuario_id TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE, doc_id TEXT NOT NULL, dados TEXT NOT NULL, atualizado INTEGER NOT NULL, PRIMARY KEY(usuario_id,doc_id));
CREATE TABLE IF NOT EXISTS mesas(id TEXT PRIMARY KEY, nome TEXT NOT NULL, codigo TEXT UNIQUE NOT NULL, mestre_id TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE, criado INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS mesa_membros(mesa_id TEXT NOT NULL REFERENCES mesas(id) ON DELETE CASCADE, usuario_id TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE, papel TEXT NOT NULL, entrou INTEGER NOT NULL, PRIMARY KEY(mesa_id,usuario_id));
CREATE TABLE IF NOT EXISTS mesa_eventos(id INTEGER PRIMARY KEY AUTOINCREMENT, mesa_id TEXT NOT NULL REFERENCES mesas(id) ON DELETE CASCADE, usuario_id TEXT NOT NULL, criado INTEGER NOT NULL, dados TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS imagens(id TEXT PRIMARY KEY, usuario_id TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE, tipo TEXT NOT NULL, dados BLOB NOT NULL, criado INTEGER NOT NULL);`);
const Q={
  usuarioPorNome:db.prepare('SELECT * FROM usuarios WHERE usuario=?'),
  criarUsuario:db.prepare('INSERT INTO usuarios(id,usuario,hash,sal,criado) VALUES(?,?,?,?,?)'),
  criarSessao:db.prepare('INSERT INTO sessoes(token,usuario_id,expira) VALUES(?,?,?)'),
  sessao:db.prepare('SELECT u.id,u.usuario FROM sessoes s JOIN usuarios u ON u.id=s.usuario_id WHERE s.token=? AND s.expira>?'),
  apagarSessao:db.prepare('DELETE FROM sessoes WHERE token=?'),
  limparSessoes:db.prepare('DELETE FROM sessoes WHERE expira<=?'),
  listarDocs:db.prepare('SELECT doc_id,dados FROM docs WHERE usuario_id=?'),
  contarDocs:db.prepare('SELECT COUNT(*) n FROM docs WHERE usuario_id=?'),
  existeDoc:db.prepare('SELECT 1 FROM docs WHERE usuario_id=? AND doc_id=?'),
  gravarDoc:db.prepare('INSERT INTO docs(usuario_id,doc_id,dados,atualizado) VALUES(?,?,?,?) ON CONFLICT(usuario_id,doc_id) DO UPDATE SET dados=excluded.dados, atualizado=excluded.atualizado'),
  apagarDoc:db.prepare('DELETE FROM docs WHERE usuario_id=? AND doc_id=?'),
  gravarImg:db.prepare('INSERT INTO imagens(id,usuario_id,tipo,dados,criado) VALUES(?,?,?,?,?)'),
  imagem:db.prepare('SELECT tipo,dados FROM imagens WHERE id=?'),
  criarMesa:db.prepare('INSERT INTO mesas(id,nome,codigo,mestre_id,criado) VALUES(?,?,?,?,?)'),
  mesaPorCodigo:db.prepare('SELECT * FROM mesas WHERE codigo=?'),
  mesa:db.prepare('SELECT * FROM mesas WHERE id=?'),
  apagarMesa:db.prepare('DELETE FROM mesas WHERE id=?'),
  addMembro:db.prepare('INSERT OR IGNORE INTO mesa_membros(mesa_id,usuario_id,papel,entrou) VALUES(?,?,?,?)'),
  tirarMembro:db.prepare("DELETE FROM mesa_membros WHERE mesa_id=? AND usuario_id=? AND papel<>'mestre'"),
  papel:db.prepare('SELECT papel FROM mesa_membros WHERE mesa_id=? AND usuario_id=?'),
  minhasMesas:db.prepare(`SELECT m.id,m.nome,m.codigo,mm.papel,u.usuario mestre FROM mesa_membros mm JOIN mesas m ON m.id=mm.mesa_id JOIN usuarios u ON u.id=m.mestre_id WHERE mm.usuario_id=? ORDER BY m.criado`),
  membros:db.prepare(`SELECT u.usuario,mm.papel FROM mesa_membros mm JOIN usuarios u ON u.id=mm.usuario_id WHERE mm.mesa_id=? ORDER BY mm.entrou`),
  fichasDaMesa:db.prepare(`SELECT u.usuario,d.dados,d.atualizado FROM mesa_membros mm JOIN docs d ON d.usuario_id=mm.usuario_id JOIN usuarios u ON u.id=mm.usuario_id
    WHERE mm.mesa_id=? AND d.doc_id LIKE 'f-%' AND json_extract(d.dados,'$.ficha.mesa')=?`),
  addEvento:db.prepare('INSERT INTO mesa_eventos(mesa_id,usuario_id,criado,dados) VALUES(?,?,?,?)'),
  podarEventos:db.prepare('DELETE FROM mesa_eventos WHERE mesa_id=? AND id NOT IN (SELECT id FROM mesa_eventos WHERE mesa_id=? ORDER BY id DESC LIMIT 200)'),
  eventos:db.prepare(`SELECT e.id,e.criado,e.dados,u.usuario FROM mesa_eventos e JOIN usuarios u ON u.id=e.usuario_id WHERE e.mesa_id=? AND e.id>? ORDER BY e.id DESC LIMIT 50`),
};
setInterval(()=>Q.limparSessoes.run(Date.now()),3600e3).unref();

/* ---------------- senhas e sessões ---------------- */
const hashSenha=(senha,sal)=>crypto.scryptSync(senha,sal,64).toString('hex');
function confere(senha,u){const a=Buffer.from(hashSenha(senha,u.sal),'hex'),b=Buffer.from(u.hash,'hex');return a.length===b.length&&crypto.timingSafeEqual(a,b)}
function lerCookie(req,nome){const c=req.headers.cookie||'';for(const p of c.split(';')){const [k,...v]=p.trim().split('=');if(k===nome)return decodeURIComponent(v.join('='))}return null}
function usuarioDe(req){const t=lerCookie(req,'sessao');if(!t)return null;return Q.sessao.get(t,Date.now())||null}
function abrirSessao(res,usuarioId){
  const token=crypto.randomBytes(32).toString('hex');Q.criarSessao.run(token,usuarioId,Date.now()+SESSAO_DIAS*864e5);
  res.setHeader('Set-Cookie',`sessao=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSAO_DIAS*86400}${COOKIE_SECURE?'; Secure':''}`);
}
// Limite simples de tentativas de login/cadastro por IP (10 por minuto).
const tentativas=new Map();
function excedeu(req){const ip=req.socket.remoteAddress||'?';const agora=Date.now();const l=(tentativas.get(ip)||[]).filter(t=>agora-t<60e3);l.push(agora);tentativas.set(ip,l);return l.length>10}

/* ---------------- utilidades HTTP ---------------- */
function enviar(res,status,corpo,tipo='application/json; charset=utf-8',extra={}){
  const buf=Buffer.isBuffer(corpo)?corpo:Buffer.from(typeof corpo==='string'?corpo:JSON.stringify(corpo));
  res.writeHead(status,{'Content-Type':tipo,'Content-Length':buf.length,'X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin',...extra});res.end(buf);
}
const erro=(res,status,msg)=>enviar(res,status,{erro:msg});
function lerCorpo(req,max){return new Promise((ok,falha)=>{const partes=[];let n=0;
  req.on('data',c=>{n+=c.length;if(n>max){falha(Object.assign(new Error('grande'),{status:413}));req.destroy()}else partes.push(c)});
  req.on('end',()=>ok(Buffer.concat(partes)));req.on('error',falha)})}
async function lerJSON(req){const b=await lerCorpo(req,MAX_JSON);try{return JSON.parse(b.toString('utf8')||'null')}catch(e){throw Object.assign(new Error('json'),{status:400})}}

/* ---------------- arquivos do app ---------------- */
const MIME={'.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8'};
let paginaCache=null;
function pagina(){ // o index.html é um fragmento (formato de artifact); aqui ganha o esqueleto de documento
  if(paginaCache&&process.env.NODE_ENV==='production')return paginaCache;
  const corpo=fs.readFileSync(path.join(RAIZ,'index.html'),'utf8').replace(/^<meta charset="utf-8">\s*/,'');
  return paginaCache=`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0}</style></head><body>${corpo}</body></html>`;
}
function servirArquivo(res,url){
  const rel=path.normalize(decodeURIComponent(url)).replace(/^([/\\])+/,'');
  if(!/^(js[/\\][\w.-]+\.js|data[/\\]dados\.json)$/.test(rel))return erro(res,404,'Não encontrado');
  const arq=path.join(RAIZ,rel);
  fs.readFile(arq,(e,buf)=>{if(e)return erro(res,404,'Não encontrado');enviar(res,200,buf,MIME[path.extname(arq)]||'application/octet-stream',{'Cache-Control':'no-cache'})});
}

/* ---------------- rotas ---------------- */
const ID_DOC=/^[A-Za-z0-9_\-:.]{1,120}$/;
async function rotear(req,res){
  const url=new URL(req.url,'http://x');const p=url.pathname;const m=req.method;
  if(m==='GET'&&(p==='/'||p==='/index.html'))return enviar(res,200,pagina(),'text/html; charset=utf-8',{'Cache-Control':'no-cache'});
  if(m==='GET'&&(p.startsWith('/js/')||p.startsWith('/data/')))return servirArquivo(res,p);
  if(m==='GET'&&p.startsWith('/_blob/')){const id=p.slice(7);if(!/^[a-f0-9]{32}$/.test(id))return erro(res,404,'Não encontrado');
    const img=Q.imagem.get(id);if(!img)return erro(res,404,'Não encontrado');
    return enviar(res,200,Buffer.from(img.dados),img.tipo,{'Cache-Control':'private, max-age=31536000, immutable'})}
  if(!p.startsWith('/api/'))return erro(res,404,'Não encontrado');
  // Proteção contra requisições de outros sites: exige o cabeçalho que só o app envia.
  if(m!=='GET'&&req.headers['x-dossie']!=='1')return erro(res,403,'Requisição recusada');

  if(p==='/api/eu'&&m==='GET'){const u=usuarioDe(req);return enviar(res,200,{usuario:u?u.usuario:null,cadastro:PERMITIR_CADASTRO})}
  if((p==='/api/entrar'||p==='/api/cadastrar')&&m==='POST'){
    if(excedeu(req))return erro(res,429,'Muitas tentativas. Espere um minuto.');
    const b=await lerJSON(req)||{};const usuario=String(b.usuario||'').trim(),senha=String(b.senha||'');
    if(!/^[\p{L}\p{N}_.-]{3,32}$/u.test(usuario))return erro(res,400,'Nome de usuário: 3 a 32 letras, números, ponto, hífen ou sublinhado.');
    if(senha.length<6||senha.length>200)return erro(res,400,'A senha precisa ter pelo menos 6 caracteres.');
    let u=Q.usuarioPorNome.get(usuario);
    if(p==='/api/cadastrar'){
      if(!PERMITIR_CADASTRO)return erro(res,403,'Novos cadastros estão desligados neste servidor.');
      if(u)return erro(res,409,'Esse nome de usuário já existe.');
      const sal=crypto.randomBytes(16).toString('hex');const id=crypto.randomUUID();
      Q.criarUsuario.run(id,usuario,hashSenha(senha,sal),sal,Date.now());u={id,usuario};
    }else if(!u||!confere(senha,u))return erro(res,401,'Usuário ou senha incorretos.');
    abrirSessao(res,u.id);return enviar(res,200,{usuario:u.usuario});
  }
  if(p==='/api/sair'&&m==='POST'){const t=lerCookie(req,'sessao');if(t)Q.apagarSessao.run(t);
    return enviar(res,200,{ok:true},undefined,{'Set-Cookie':`sessao=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${COOKIE_SECURE?'; Secure':''}`})}

  const u=usuarioDe(req);if(!u)return erro(res,401,'Não autenticado');
  if(p==='/api/docs'&&m==='GET'){const out={};for(const r of Q.listarDocs.all(u.id)){try{out[r.doc_id]=JSON.parse(r.dados)}catch(e){}}return enviar(res,200,out)}
  const md=p.match(/^\/api\/docs\/([^/]+)$/);
  if(md){const id=decodeURIComponent(md[1]);if(!ID_DOC.test(id))return erro(res,400,'Identificador inválido');
    if(m==='PUT'){const dados=await lerJSON(req);if(!dados||typeof dados!=='object'||Array.isArray(dados))return erro(res,400,'Documento inválido');
      if(!Q.existeDoc.get(u.id,id)&&Q.contarDocs.get(u.id).n>=MAX_DOCS)return erro(res,507,'Limite de documentos da conta atingido.');
      Q.gravarDoc.run(u.id,id,JSON.stringify(dados),Date.now());return enviar(res,200,{ok:true})}
    if(m==='DELETE'){Q.apagarDoc.run(u.id,id);return enviar(res,200,{ok:true})}}
  if(p==='/api/imagens'&&m==='POST'){const tipo=String(req.headers['content-type']||'').split(';')[0].trim();
    if(!TIPOS_IMG[tipo])return erro(res,415,'Use PNG, JPG, GIF ou WebP.');
    const buf=await lerCorpo(req,MAX_IMG);if(!buf.length)return erro(res,400,'Arquivo vazio');
    const id=crypto.randomBytes(16).toString('hex');Q.gravarImg.run(id,u.id,tipo,buf,Date.now());
    return enviar(res,200,{id,url:'/_blob/'+id,sizeBytes:buf.length,contentType:tipo})}
  if(p.startsWith('/api/mesas'))return rotasMesa(req,res,u,p,m,url);
  return erro(res,404,'Não encontrado');
}

/* ---------------- campanhas (mesas compartilhadas) ----------------
   O mestre cria a campanha e passa o código. Jogadores entram com o código e escolhem,
   ficha por ficha, quais ligar à campanha. Só o mestre lê as fichas ligadas; jogadores
   continuam vendo apenas as próprias. Avisos de rituais vão dos jogadores para o mestre. */
const ALFA='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const novoCodigo=()=>Array.from(crypto.randomBytes(6),b=>ALFA[b%ALFA.length]).join('');
async function rotasMesa(req,res,u,p,m,url){
  if(p==='/api/mesas'&&m==='GET')return enviar(res,200,Q.minhasMesas.all(u.id).map(x=>({id:x.id,nome:x.nome,papel:x.papel,mestre:x.mestre,codigo:x.papel==='mestre'?x.codigo:undefined})));
  if(p==='/api/mesas'&&m==='POST'){const b=await lerJSON(req)||{};const nome=String(b.nome||'').trim().slice(0,80);if(!nome)return erro(res,400,'Dê um nome para a campanha.');
    if(Q.minhasMesas.all(u.id).filter(x=>x.papel==='mestre').length>=20)return erro(res,400,'Limite de 20 campanhas como mestre.');
    const id=crypto.randomUUID();let codigo=novoCodigo();while(Q.mesaPorCodigo.get(codigo))codigo=novoCodigo();
    Q.criarMesa.run(id,nome,codigo,u.id,Date.now());Q.addMembro.run(id,u.id,'mestre',Date.now());
    return enviar(res,200,{id,nome,codigo,papel:'mestre',mestre:u.usuario})}
  if(p==='/api/mesas/entrar'&&m==='POST'){if(excedeu(req))return erro(res,429,'Muitas tentativas. Espere um minuto.');
    const b=await lerJSON(req)||{};const mesa=Q.mesaPorCodigo.get(String(b.codigo||'').trim().toUpperCase());if(!mesa)return erro(res,404,'Código não encontrado.');
    Q.addMembro.run(mesa.id,u.id,'jogador',Date.now());const pap=Q.papel.get(mesa.id,u.id).papel;
    return enviar(res,200,{id:mesa.id,nome:mesa.nome,papel:pap})}
  const mm=p.match(/^\/api\/mesas\/([\w-]{1,64})(\/[a-z]+)?$/);if(!mm)return erro(res,404,'Não encontrado');
  const mesa=Q.mesa.get(mm[1]);const pap=mesa&&Q.papel.get(mesa.id,u.id);if(!mesa||!pap)return erro(res,404,'Campanha não encontrada.');
  const mestre=pap.papel==='mestre';const sub=mm[2]||'';
  if(sub===''&&m==='DELETE'){if(!mestre)return erro(res,403,'Só o mestre pode excluir a campanha.');Q.apagarMesa.run(mesa.id);return enviar(res,200,{ok:true})}
  if(sub==='/sair'&&m==='POST'){if(mestre)return erro(res,400,'O mestre não sai da própria campanha; exclua-a se quiser.');Q.tirarMembro.run(mesa.id,u.id);return enviar(res,200,{ok:true})}
  if(sub==='/fichas'&&m==='GET'){if(!mestre)return erro(res,403,'Só o mestre vê as fichas da campanha.');
    const fichas=[];for(const r of Q.fichasDaMesa.all(mesa.id,mesa.id)){try{fichas.push({usuario:r.usuario,atualizado:r.atualizado,ficha:JSON.parse(r.dados).ficha})}catch(e){}}
    return enviar(res,200,{membros:Q.membros.all(mesa.id),fichas})}
  if(sub==='/eventos'&&m==='POST'){const b=await lerJSON(req);if(!b||typeof b!=='object')return erro(res,400,'Aviso inválido');const txt=JSON.stringify(b);if(txt.length>8000)return erro(res,413,'Aviso grande demais.');
    Q.addEvento.run(mesa.id,u.id,Date.now(),txt);Q.podarEventos.run(mesa.id,mesa.id);return enviar(res,200,{ok:true})}
  if(sub==='/eventos'&&m==='GET'){if(!mestre)return erro(res,403,'Só o mestre vê os avisos.');const depois=+url.searchParams.get('depois')||0;
    return enviar(res,200,Q.eventos.all(mesa.id,depois).map(e=>({id:e.id,criado:e.criado,usuario:e.usuario,...JSON.parse(e.dados)})))}
  return erro(res,404,'Não encontrado');
}

http.createServer((req,res)=>{rotear(req,res).catch(e=>{if(!res.headersSent)erro(res,e.status||500,e.status===413?'Arquivo grande demais.':e.status===400?'Requisição inválida.':'Erro interno.');if(!e.status)console.error(e)})})
  .listen(PORT,()=>console.log(`Dossiê Paranormal em http://localhost:${PORT} · banco: ${DB_PATH}`));
