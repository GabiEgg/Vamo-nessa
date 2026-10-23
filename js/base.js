/* ============================== CONSTANTES ============================== */
const ATTR=['AGI','FOR','INT','PRE','VIG'];
const ATTR_NOME={AGI:'Agilidade',FOR:'Força',INT:'Intelecto',PRE:'Presença',VIG:'Vigor'};
const NEX_LIST=[5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,99];
const nivelNex=n=>n>=99?20:Math.max(1,Math.round(n/5));
const ELEM={'':'Nenhum',sangue:'Sangue',morte:'Morte',conhecimento:'Conhecimento',energia:'Energia',medo:'Medo'};
const GRAU={0:'Destreinado',5:'Treinado',10:'Veterano',15:'Experiente'};
const CUSTO_CIRC=[0,1,3,6,10];
const PATENTES=[
  {id:'recruta',nome:'Recruta',pp:0,lim:[2,0,0,0],credito:'Baixo'},
  {id:'operador',nome:'Operador',pp:20,lim:[3,1,0,0],credito:'Médio'},
  {id:'especial',nome:'Agente especial',pp:50,lim:[3,2,1,0],credito:'Médio'},
  {id:'oficial',nome:'Oficial de operações',pp:100,lim:[3,3,2,1],credito:'Alto'},
  {id:'elite',nome:'Agente de elite',pp:200,lim:[3,3,3,2],credito:'Ilimitado'}];
const LIM_PD_PATENTE=[1,3,6,10,15];
const CAT_NOME=['0','I','II','III','IV','V','VI'];
const ALCANCE={corpo:'Corpo a corpo',curto:'Curto',medio:'Médio',longo:'Longo',extremo:'Extremo'};
const TIPO_ITEM={arma:'Arma',municao:'Munição',protecao:'Proteção',acessorio:'Acessório',explosivo:'Explosivo',operacional:'Operacional',medicamento:'Medicamento',paranormal:'Paranormal',amaldicoado:'Amaldiçoado',geral:'Geral'};
const TIPO_COND={medo:'Medo',mental:'Mental',paralisia:'Paralisia',sentidos:'Sentidos',fadiga:'Fadiga','':'Outras'};
const DUR={cena:'Até o fim da cena',interludio:'Até o próximo interlúdio',missao:'Até o fim da missão',perm:'Permanente'};
const FAIXAS={crianca:'Criança',adolescente:'Adolescente',jovem:'Jovem',adulto:'Adulto',maduro:'Maduro',idoso:'Idoso'};
const FAIXA_DESV={adulto:1,maduro:2,idoso:3};
const MARCOS={5:['Habilidades iniciais'],10:['Trilha'],15:['Poder'],20:['+1 atributo'],25:['2º círculo'],30:['Poder'],35:['Grau veterano'],
 40:['Trilha'],45:['Poder'],50:['+1 atributo','Versatilidade','Afinidade'],55:['3º círculo'],60:['Poder'],65:['Trilha'],70:['Grau experiente'],
 75:['Poder'],80:['+1 atributo'],85:['4º círculo'],90:['Poder'],95:['+1 atributo'],99:['Trilha']};
const poderesPermitidos=nex=>[15,30,45,60,75,90].filter(x=>x<=nex).length;
const aumentosAttr=nex=>[20,50,80,95].filter(x=>x<=nex).length;
const circuloMax=nex=>nex>=85?4:nex>=55?3:nex>=25?2:1;

/* ============================== UTIL ============================== */
const slug=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const h=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const opt=(v,l,sel)=>`<option value="${h(v)}" ${String(v)===String(sel)?'selected':''}>${h(l)}</option>`;
const sgn=n=>(n>=0?'+':'')+n;
const clone=o=>JSON.parse(JSON.stringify(o));
function getPath(o,p){return p.split('.').reduce((a,k)=>a==null?a:a[k],o)}
function setPath(o,p,v){const ks=p.split('.');let a=o;ks.slice(0,-1).forEach(k=>{if(a[k]==null||typeof a[k]!=='object')a[k]={};a=a[k]});a[ks[ks.length-1]]=v}
let toastT;function toast(msg,ms=3600){let el=document.querySelector('.toast');if(!el){el=document.createElement('div');el.className='toast';el.setAttribute('role','status');document.body.appendChild(el)}el.textContent=msg;el.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>el.hidden=true,ms)}
const fld=(label,inner,cls='')=>`<label class="fld ${cls}"><span>${label}</span>${inner}</label>`;
const inp=(path,val,extra='')=>`<input class="inp" data-f="${path}" value="${h(val)}" ${extra}>`;
const numInp=(path,val,extra='')=>`<input class="inp num" type="number" inputmode="numeric" data-f="${path}" data-num value="${h(val??'')}" ${extra}>`;
const elBadge=e=>e?`<span class="badge el el-${e}">${ELEM[e]||h(e)}</span>`:'';
const rnd=n=>1+Math.floor(Math.random()*n);
/* Avalia expressões de dados como "2d6+3", "PRE*10", "1d8+VIG". */
function rollExpr(expr,A={}){
  let s=String(expr||'').replace(/\s/g,'').toUpperCase();
  s=s.replace(/(AGI|FOR|INT|PRE|VIG)/g,m=>String(A[m]??0));
  let total=0;const parts=[];const re=/([+-]?)(\d*)D(\d+)|([+-]?)(\d+)(?:\*(\d+))?/g;let m;
  while((m=re.exec(s))){
    if(m[3]){const q=+(m[2]||1),fc=+m[3],sg=m[1]==='-'?-1:1;const rr=Array.from({length:q},()=>rnd(fc));total+=sg*rr.reduce((a,b)=>a+b,0);parts.push(`${m[1]||''}${q}d${fc}[${rr.join(',')}]`)}
    else if(m[5]){const sg=m[4]==='-'?-1:1;const v=+m[5]*(m[6]?+m[6]:1);total+=sg*v;parts.push(`${m[4]||(parts.length?'+':'')}${m[5]}${m[6]?'×'+m[6]:''}`)}
  }
  return {total,txt:parts.join(' ')};
}

/* ============================== DADOS ============================== */
let D=null; // conteúdo de data/dados.json
const FONTE=id=>(D&&D.fontes.find(f=>f.id===id))||{id,sigla:id,nome:id};

/* ============================== ESTADO ============================== */
const HB_TYPES=[['origens','Origens'],['classes','Classes'],['trilhas','Trilhas'],['poderes','Poderes'],['rituais','Rituais'],['itens','Itens'],['modificacoes','Modificações'],['aliados','Aliados'],['condicoes','Condições'],['pericias','Perícias']];
const emptyHB=()=>Object.fromEntries(HB_TYPES.map(([k])=>[k,[]]));
const cfgPadrao=()=>({fontes:{core:true},pacotes:{},regras:{},auto:{custoParanormal:true,transcender:true,maldicao:true,massivo:true},acoesInterludio:2,imgs:{}});
const S={conta:null,mesas:[],mesaAberta:null,mesaDados:null,mesaEventos:[],alheia:null,fichas:{},hb:emptyHB(),cfg:cfgPadrao(),active:null,view:'ficha',tab:'dossie',hbType:'origens',hbSel:null,hbQ:'',open:{},confirm:null,rolls:[],assets:null,mesaTab:'fontes'};

function fonteOn(id){return id==='core'||!!S.cfg.fontes[id]}
function pacoteOn(p){return S.cfg.pacotes[p||'Minha mesa']!==false}
function regraDisp(id){const r=D&&D.regras.find(x=>x.id===id);return !!r&&fonteOn(r.fonte)}
function regraOn(id){return !!S.cfg.regras[id]&&regraDisp(id)}
function efeitoRegra(k){return D.regras.some(r=>regraOn(r.id)&&r.efeito&&r.efeito[k])}
const pacotesHB=()=>{const s=new Set();HB_TYPES.forEach(([k])=>(S.hb[k]||[]).forEach(x=>s.add(x.pacote||'Minha mesa')));return [...s]};

/* Catálogo: conteúdo das fontes ativas + homebrew dos pacotes ativos (homebrew com mesmo id substitui). */
const _catCache={};let _catKey='';
function cat(type){
  const key=JSON.stringify([S.cfg.fontes,S.cfg.pacotes,S.cfg.regras])+'|'+S._hbv;
  if(key!==_catKey){for(const k in _catCache)delete _catCache[k];_catKey=key}
  if(_catCache[type])return _catCache[type];
  const base=(D[type]||[]).filter(x=>fonteOn(x.fonte)&&(!x.regra||regraOn(x.regra)));
  const hb=(S.hb[type]||[]).filter(x=>pacoteOn(x.pacote));const over=new Set(hb.map(x=>x.id));
  const out=base.filter(x=>!over.has(x.id)).concat(hb.map(x=>({...x,_hb:true,_override:(D[type]||[]).some(b=>b.id===x.id)})));
  return _catCache[type]=out;
}
S._hbv=0;
function byId(type,id){if(!id)return null;return cat(type).find(x=>x.id===id)||(S.hb[type]||[]).find(x=>x.id===id)||(D[type]||[]).find(x=>x.id===id)||null}
const pericias=()=>cat('pericias');
const perNome=id=>(pericias().find(p=>p.id===id)||{}).nome||id;
const fonteBadge=x=>x._hb?`<span class="badge hb" title="Homebrew · ${h(x.pacote||'Minha mesa')}">${h(x.pacote||'homebrew')}</span>`:(x.fonte&&x.fonte!=='core'?`<span class="badge src" title="${h(FONTE(x.fonte).nome)}">${h(FONTE(x.fonte).sigla)}</span>`:'');

/* ============================== FICHA ============================== */
function novaFicha(){return {id:uid(),v:2,nome:'Novo agente',jogador:'',conceito:'',idade:'',faixa:'jovem',desvantagens:[],origem:'',origemOpcao:0,origemEscolha:'',classe:'',trilha:'',
  nex:5,estagio:1,nivel:1,pp:0,afinidade:'',atributos:{AGI:1,FOR:1,INT:1,PRE:1,VIG:1},pericias:{},outros:{},escolhas:[],poderes:[],rituais:[],inventario:[],mods:[],
  pv:null,pe:null,san:null,pvTemp:0,peTemp:0,sanPerm:0,condicoes:[],contadores:{},bonus:[],aliados:[],retidos:[],formaSuprema:false,
  interludio:{acoes:[],participantes:0},interludios:[],historia:'',aparencia:'',personalidade:'',anotacoes:'',atualizado:Date.now()}}
const V1_PODER={g_transcender:'ger_transcender',g_treinamento:'ger_treinamento_em_pericia',p_aprender_ritual:'par_aprender_ritual',p_anatomia:'par_anatomia_insana',p_arma_sangue:'par_arma_de_sangue',
 p_sangue_ferro:'par_sangue_de_ferro',p_sangue_fervente:'par_sangue_fervente',p_sangue_vivo:'par_sangue_vivo',p_encarar_morte:'par_encarar_a_morte',p_escapar_morte:'par_escapar_da_morte',
 p_potencial_aprimorado:'par_potencial_aprimorado',p_potencial_reaproveitado:'par_potencial_reaproveitado',p_surto_temporal:'par_surto_temporal',p_expansao:'par_expansao_de_conhecimento',
 p_percepcao_par:'par_percepcao_paranormal',p_precognicao:'par_precognicao',p_sensitivo:'par_sensitivo',p_visao_oculto:'par_visao_do_oculto',p_afortunado:'par_afortunado',
 p_campo_protetor:'par_campo_protetor',p_causalidade:'par_causalidade_fortuita',p_golpe_sorte:'par_golpe_de_sorte',p_manipular_entropia:'par_manipular_entropia'};
/* Atualiza fichas da versão 1 (ids antigos) e preenche campos novos. */
function migrar(f){
  const n={...novaFicha(),...f};
  if(!f.v){
    n.poderes=(f.poderes||[]).map(p=>({...p,ref:V1_PODER[p.ref]||p.ref}));
    n.rituais=(f.rituais||[]).map(id=>id.startsWith('r_')?'rit_'+id.slice(2):id);
    n.inventario=(f.inventario||[]).map(i=>({...i,ref:i.ref&&i.ref.startsWith('i_')?'it_'+i.ref.slice(2):i.ref}));
    n.v=2;
  }
  n.poderes.forEach(p=>{if(!p.uid)p.uid=uid();const d=(D.poderes||[]).find(x=>x.id===p.ref);if(d&&d.tipo==='paranormal'&&p.transcender==null)p.transcender=true});
  n.inventario.forEach(i=>{if(!i.uid)i.uid=uid();if(!i.modsAplicadas)i.modsAplicadas=[]});
  return n;
}
function exemplo(){const f=novaFicha();Object.assign(f,{nome:'Lia Moreira',conceito:'Ficha de exemplo — edite à vontade ou exclua',idade:'27',
  origem:'investigador',classe:'especialista',trilha:'infiltrador',nex:20,pp:20,atributos:{AGI:3,FOR:1,INT:2,PRE:2,VIG:1},
  pericias:{furtividade:5,crime:5,enganacao:5,intuicao:5,tecnologia:5,pontaria:5,reflexos:5,ocultismo:5,iniciativa:5},
  poderes:[{uid:uid(),ref:'esp_ninja_urbano'}],historia:'Jornalista investigativa que encontrou um símbolo estranho nos arquivos de uma prefeitura do interior. A Ordem a recrutou antes que o Outro Lado a encontrasse.'});
  ['it_pistola','it_balas_curtas','it_protecao_leve'].forEach(id=>{const it=itemFrom(byId('itens',id));if(it){if(it.tipo==='protecao')it.equipado=true;f.inventario.push(it)}});
  f.poderes=f.poderes.filter(p=>byId('poderes',p.ref));f._exemplo=true;return f}
function itemFrom(c){if(!c)return null;const {_hb,_override,fonte,...rest}=c;return {...clone(rest),uid:uid(),ref:c.id,fonte,qtd:1,equipado:false,notas:'',modsAplicadas:[]}}
const F=()=>S.alheia||S.fichas[S.active];

/* ============================== PERSISTÊNCIA ============================== */
const LKEY='dossie-paranormal-v1';
const Store={mode:'local',col:null,timers:{},chains:{},
  loadLocal(){try{return JSON.parse(localStorage.getItem(LKEY)||'null')}catch(e){return null}},
  saveLocal(){try{localStorage.setItem(LKEY,JSON.stringify({fichas:realFichas(),hb:S.hb,cfg:S.cfg,active:S.active}))}catch(e){}},
  touch(docId){this.saveLocal();if(this.mode!=='db')return;clearTimeout(this.timers[docId]);this.timers[docId]=setTimeout(()=>this.flush(docId),700)},
  flush(docId){this.chains[docId]=(this.chains[docId]||Promise.resolve()).then(()=>this.write(docId)).catch(()=>{})},
  async write(docId,tent=0){
    if(this.mode!=='db')return;const ref=this.col.doc(docId);
    try{
      if(docId==='homebrew')await ref.set({hb:S.hb});
      else if(docId==='config')await ref.set({cfg:S.cfg});
      else{const f=S.fichas[docId.slice(2)];if(!f||f._exemplo)await ref.delete();else await ref.set({ficha:f});}
      setStatus('db');
    }catch(e){
      if(e&&e.code==='unavailable'&&tent<1){await new Promise(r=>setTimeout(r,800+Math.random()*800));return this.write(docId,tent+1)}
      if(e&&e.code==='quota_exceeded'){toast('Espaço da conta cheio. Exclua fichas antigas ou exporte um backup.');setStatus('err');return}
      if(e&&e.code==='nao_autenticado'){this.mode='local';S.conta&&(S.conta.usuario=null);setStatus('local');toast('Sua sessão expirou. Entre de novo para continuar salvando no servidor.');render();return}
      this.mode='local';setStatus('local');toast('Não foi possível salvar na conta. Seus dados continuam salvos neste navegador.');
    }
  },
  /* Liga o armazenamento remoto: banco do claude.ai (artifact) ou a API do servidor próprio. */
  async connect(){
    try{
      if(window.claude&&window.claude.use){
        const [db,user]=await Promise.all([window.claude.use('db'),window.claude.use('user')]);
        if(db&&user){const id=await user.id();if(id){await this.carregar(db.collection('data/users/'+id));return}}
      }
      if(location.protocol.startsWith('http')&&!(window.claude&&window.claude.use)){
        let eu=null,st=0;try{eu=await Api.req('GET','/api/eu')}catch(e){st=e.status||0;eu=e.dados||null}
        if(eu&&eu.usuario){S.conta={servidor:true,usuario:eu.usuario,cadastro:eu.cadastro};S.assets=Api.assets;await this.carregar(Api.colecao());carregarMesas();return}
        if(eu&&'usuario' in eu||st===401){S.conta={servidor:true,usuario:null,cadastro:eu?eu.cadastro!==false:true};render()}
      }
    }catch(e){setStatus('local')}
  },
  async carregar(col){
    this.col=col;
    const snap=await this.col.get();
    const remote={};let remoteHB=null,remoteCfg=null;
    snap.docs.forEach(d=>{const v=d.data()||{};if(d.id==='homebrew')remoteHB=v.hb;else if(d.id==='config')remoteCfg=v.cfg;else if(d.id.startsWith('f-')&&v.ficha)remote[v.ficha.id]=v.ficha});
    this.mode='db';
    if(Object.keys(remote).length||remoteHB||remoteCfg){
      if(Object.keys(remote).length){S.fichas={};for(const k in remote)S.fichas[k]=migrar(remote[k])}
      if(remoteHB){S.hb={...emptyHB(),...remoteHB};S._hbv++}
      if(remoteCfg)S.cfg={...cfgPadrao(),...remoteCfg,auto:{...cfgPadrao().auto,...(remoteCfg.auto||{})}};
      if(!S.fichas[S.active])S.active=Object.keys(S.fichas)[0]||null;
      if(!S.active){const e=exemplo();S.fichas[e.id]=e;S.active=e.id}
      this.saveLocal();
    }else{
      Object.keys(realFichas()).forEach(k=>this.flush('f-'+k));
      if(hbCount())this.flush('homebrew');this.flush('config');
    }
    setStatus('db');render();
  }};
/* Cliente da API do servidor próprio (server/server.js). */
const Api={
  async req(metodo,url,corpo,tipo){
    const headers={'X-Dossie':'1'};let body;
    if(corpo!==undefined){if(tipo){headers['Content-Type']=tipo;body=corpo}else{headers['Content-Type']='application/json';body=JSON.stringify(corpo)}}
    let r;try{r=await fetch(url,{method:metodo,credentials:'same-origin',headers,body})}catch(e){throw Object.assign(new Error('Sem conexão com o servidor.'),{status:0,code:'unavailable'})}
    let j=null;try{j=await r.json()}catch(e){}
    if(!r.ok)throw Object.assign(new Error((j&&j.erro)||'Falha no servidor.'),{status:r.status,dados:j,
      code:r.status===507?'quota_exceeded':r.status===413?'too_large':r.status===415?'unsupported_type':r.status>=500?'unavailable':r.status===401?'nao_autenticado':'api'});
    return j;
  },
  colecao(){const url=id=>'/api/docs/'+encodeURIComponent(id);
    return {doc:id=>({set:d=>Api.req('PUT',url(id),d),delete:()=>Api.req('DELETE',url(id))}),
      get:async()=>{const o=await Api.req('GET','/api/docs');return {docs:Object.entries(o||{}).map(([id,v])=>({id,data:()=>v}))}}}},
  assets:{upload:file=>Api.req('POST','/api/imagens',file,file.type||'application/octet-stream')},
};
function realFichas(){const o={};for(const k in S.fichas)if(!S.fichas[k]._exemplo)o[k]=S.fichas[k];return o}
const hbCount=()=>HB_TYPES.reduce((s,[k])=>s+(S.hb[k]||[]).length,0);
function setStatus(m){const el=document.getElementById('status');if(!el)return;el.className='status '+(m==='db'?'db':m==='err'?'err':'');
  el.querySelector('span').textContent=m==='db'?(S.conta&&S.conta.usuario?'Salvo no servidor':'Salvo na sua conta'):m==='err'?'Falha ao salvar':'Salvo neste navegador'}
function saveF(f=F()){if(!f||f._alheia)return;if(f._exemplo)delete f._exemplo;f.atualizado=Date.now();Store.touch('f-'+f.id)}
function saveHB(){S._hbv++;Store.touch('homebrew')}
function saveCfg(){Store.touch('config')}
