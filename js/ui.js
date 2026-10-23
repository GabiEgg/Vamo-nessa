/* ============================== RENDER ============================== */
const D20='<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 21 7v10l-9 5-9-5V7z"/><path d="M12 2 7.5 14h9L12 2zM3 7l4.5 7M21 7l-4.5 7M7.5 14 12 22l4.5-8"/></svg>';
const TABS=[['dossie','Dossiê'],['pericias','Perícias'],['habilidades','Habilidades'],['rituais','Rituais'],['inventario','Inventário'],['aliados','Aliados & NPCs'],['interludio','Interlúdio'],['bonus','Bônus'],['notas','Notas']];
let _rendering=false;
function render(){
  if(!D)return;if(_rendering){setTimeout(render,0);return}_rendering=true;try{renderNow()}finally{_rendering=false}
}
function renderNow(){
  const navs=[['ficha','Fichas'],...(S.conta&&S.conta.usuario?[['campanha','Campanha']]:[]),['mesa','Mesa'],['hb','Homebrew'],['guia','Guia']];
  document.getElementById('nav').innerHTML=navs.map(([k,l])=>`<button class="btn" aria-pressed="${S.view===k}" data-act="view" data-v="${k}">${l}${k==='hb'&&hbCount()?` <span class="badge hb">${hbCount()}</span>`:''}${k==='mesa'?` <span class="badge">${D.fontes.filter(x=>fonteOn(x.id)).length+pacotesHB().filter(pacoteOn).length}</span>`:''}</button>`).join('')+(S.conta?(S.conta.usuario?`<button class="btn" data-act="contaMenu" title="Conta no servidor">${h(S.conta.usuario)}</button>`:`<button class="btn acc" data-act="contaMenu">Entrar</button>`):'');
  const app=document.getElementById('app');
  app.innerHTML=S.view==='hb'?renderHB():S.view==='mesa'?renderMesa():S.view==='guia'?renderGuia():S.view==='campanha'?renderCampanha():renderFichas();
  if(S.view==='ficha'&&S.tab==='dossie')drawStar();
}
function renderFichas(){
  const list=Object.values(S.fichas).sort((a,b)=>(b.atualizado||0)-(a.atualizado||0));
  const side=`<aside class="side"><h3>Agentes</h3><div class="agents">${list.map(f=>{const c=byId('classes',f.classe);
    return `<button class="agent" data-act="sel" data-id="${f.id}" aria-current="${f.id===S.active}"><b data-d="nome-${f.id}">${h(f.nome||'Sem nome')}</b><small>${c?h(c.nome):'Sem classe'} · ${c&&c.estagios?'Estágio '+(f.estagio||1):'NEX '+f.nex+'%'}${f._exemplo?' · exemplo':''}</small></button>`}).join('')}</div>
    <div class="row"><button class="btn pri" data-act="nova">+ Nova ficha</button><button class="btn" data-act="importar">Importar</button></div>
    <div class="row"><button class="btn sm ghost" data-act="backup">Exportar backup completo</button></div></aside>`;
  const f=F();
  if(!f)return `<div class="layout">${side}<div class="empty">Nenhuma ficha ainda. Clique em <b>Nova ficha</b> para registrar seu primeiro agente.</div></div>`;
  const r=calc(f);
  const panes={dossie:paneDossie,pericias:panePericias,habilidades:paneHab,rituais:paneRit,inventario:paneInv,aliados:paneAliados,interludio:paneInterludio,bonus:paneBonus,notas:paneNotas};
  const nb=(f.bonus||[]).length;const na=(f.aliados||[]).length;
  const banner=f._alheia?`<div class="alheia"><span>Ficha de <b>${h(f._dono)}</b> · somente leitura (mudanças aqui não são salvas)</span><button class="btn sm" data-act="voltarCampanha">Voltar para a campanha</button></div>`:'';
  return `<div class="layout">${side}<section class="sheet">${banner}
    <div class="sheet-head"><div class="name"><span class="eyebrow">Agente da Ordem · ${h(r.patente.nome)}${r.det?' · Determinação':''}</span><input id="f-nome" data-f="nome" value="${h(f.nome)}" aria-label="Nome do agente"></div>
      <span class="stamp">${r.est?'Estágio '+(f.estagio||1):'NEX '+f.nex+'%'}</span>
      <div class="row">${S.confirm==='del'?`<span class="confirm">Excluir esta ficha? <button class="btn sm danger" data-act="delOk">Excluir</button><button class="btn sm" data-act="cancel">Cancelar</button></span>`:
       `<button class="btn sm" data-act="dup">Duplicar</button><button class="btn sm" data-act="exportF">Exportar</button><button class="btn sm danger" data-act="del">Excluir</button>`}</div></div>
    ${vitalsStrip(f,r)}
    <div class="tabs" role="tablist">${TABS.map(([k,l])=>`<button class="tab" role="tab" aria-selected="${S.tab===k}" data-act="tab" data-v="${k}">${l}${k==='bonus'&&nb?` <span class="badge ${r.ef.naoAcumula.length?'warnb':'acc'}" ${r.ef.naoAcumula.length?'title="Há efeitos de rituais que não acumulam"':''}>${nb}${r.ef.naoAcumula.length?' !':''}</span>`:''}${k==='aliados'&&na?` <span class="badge">${na}</span>`:''}</button>`).join('')}</div>
    <div class="pane">${f.classe||['notas','aliados'].includes(S.tab)||S.tab==='dossie'?panes[S.tab](f,r):`<div class="empty">Escolha uma classe no Dossiê para liberar esta aba.</div>`}</div></section></div>`;
}

/* ---------- Faixa de estado (sempre visível) ---------- */
function vitalsStrip(f,r){
  if(!f.classe)return '';
  const one=(k,lbl,col)=>{const cur=r[k],max=r[k+'Max'],tmp=k==='san'?0:r[k+'Temp'];const pct=max?Math.max(0,Math.min(100,cur/max*100)):0;
    return `<div class="vit" style="--c:var(--${col})"><div class="vit-h"><b>${lbl}</b><span class="vnum"><span data-d="${k}">${cur}</span>/<span data-d="${k}Max">${max}</span></span>${tmp?`<span class="tmpb" title="Pontos temporários: gastos primeiro, somem no fim da cena">+${tmp} temp.</span>`:''}</div>
     <div class="bar"><i data-bar="${k}" style="width:${pct}%"></i>${tmp?`<i class="tb" style="width:${Math.min(100,tmp/Math.max(1,max)*100)}%"></i>`:''}</div>
     <div class="vit-in"><input class="inp" data-dmg="${k}" placeholder="−15, +8, =20, -2d6" aria-label="Alterar ${lbl}: digite −15 para perder, +8 para recuperar" inputmode="text">
      <button class="btn sm" data-act="dmgGo" data-k="${k}">Aplicar</button>
      ${k!=='san'?`<label class="tmpin" title="Pontos temporários">temp <input class="inp num" type="number" min="0" data-f="${k}Temp" data-num data-r value="${tmp||''}" placeholder="0" aria-label="${lbl} temporários"></label>`:''}
      ${k==='pe'&&r.det?`<button class="btn sm ghost" data-act="dmgMental" title="Dano mental: pode causar perturbado/enlouquecendo">mental</button>`:''}</div></div>`};
  const conds=[...r.conds.entries()];
  const contador=(id,lbl)=>r.conds.has(id)?`<span class="chip warn">${lbl}: <button class="mini" data-act="cont" data-id="${id}" data-d="-1" aria-label="Menos">−</button> ${(f.contadores||{})[id]||0}/3 turnos <button class="mini" data-act="cont" data-id="${id}" data-d="1" aria-label="Mais">+</button></span>`:'';
  const danoT=conds.filter(([id,x])=>x.c.danoTurno);
  return `<div class="strip">
   <div class="vits">${one('pv','PV','pv')}${one('pe',r.det?'PD':'PE','pe')}${r.det?'':one('san','SAN','san')}</div>
   <div class="conds"><span class="eyebrow">Condições</span>
    ${conds.length?conds.map(([id,x])=>`<span class="cond ${x.orig?'inc':''}" title="${h(x.c.desc)}">${h(x.c.nome)}${x.orig?` <small>${x.orig==='auto'?'auto':'por '+h(x.orig)}</small>`:`${x.c.escolheAttr?condAttrSel(f,id):''}${x.c.agrava?` <button class="mini" data-act="condUp" data-id="${id}" title="Piorar para ${h((byId('condicoes',x.c.agrava)||{}).nome||'')}" aria-label="Piorar">↑</button>`:''} <button class="mini" data-act="condOff" data-id="${id}" aria-label="Remover ${h(x.c.nome)}">✕</button>`}</span>`).join(''):'<span class="hint">Nenhuma</span>'}
    <button class="btn sm" data-act="condModal">+ Condição</button>
    ${contador('morrendo','Morrendo')}${contador('enlouquecendo','Enlouquecendo')}
    ${danoT.map(([id,x])=>`<button class="btn sm" data-act="danoTurno" data-id="${id}">Início do turno: ${h(x.c.nome)} (−${x.c.danoTurno})</button>`).join('')}
    ${r.conds.has('perturbado')||r.conds.has('enlouquecendo')?`<button class="btn sm" data-act="insanidade">Rolar insanidade</button>`:''}
    ${regraOn('medo')&&(r.det?r.pe<=0:r.san<=0)?`<button class="btn sm" data-act="medo">Efeito de medo (2d10)</button>`:''}
    <span class="sp"></span>
    ${regraOn('mascaras')?`<label class="row" style="gap:4px;font-size:12px"><input type="checkbox" data-act="forma" ${f.formaSuprema?'checked':''}> Forma suprema</label>`:''}
    <button class="btn sm ghost" data-act="fimCena" title="Zera pontos temporários, contadores e bônus de cena">Fim de cena</button>
   </div></div>`;
}

function condAttrSel(f,id){const i=f.condicoes.findIndex(c=>c.id===id);return ` <select class="mini-sel" data-f="condicoes.${i}.attr" data-r aria-label="Atributo afetado">${ATTR.map(a=>opt(a,a,f.condicoes[i].attr)).join('')}</select>`}
/* ---------- Dossiê ---------- */
function paneDossie(f,r){
  const classes=cat('classes'),origens=cat('origens');const geral=regraOn('trilha_geral');
  const trilhas=cat('trilhas').filter(t=>t.classe===f.classe||(geral&&t.classes&&t.classes.includes(f.classe)));
  const o=r.o;const prog=r.est?`${fld('Estágio',`<select class="inp" data-f="estagio" data-num data-r>${[1,2,3,4,5].map(n=>opt(n,n,f.estagio)).join('')}</select>`)}`:
    fld('NEX',`<select class="inp" id="f-nex" data-f="nex" data-num data-r>${NEX_LIST.map(n=>opt(n,n+'%',f.nex)).join('')}</select>`)+(r.nivelSep?fld('Nível de experiência',`<select class="inp" data-f="nivel" data-num data-r>${Array.from({length:20},(_,i)=>opt(i+1,i+1,f.nivel)).join('')}</select>`):'');
  const desv=regraOn('idade')?`<div class="sec"><div class="sec-h"><h2>Idade</h2></div><div class="grid g3">
     ${fld('Faixa etária',`<select class="inp" data-f="faixa" data-r>${Object.entries(FAIXAS).map(([k,v])=>opt(k,v,f.faixa)).join('')}</select>`)}</div>
     ${FAIXA_DESV[f.faixa]?`<p class="hint">Escolha ${FAIXA_DESV[f.faixa]} desvantagem(ns) (${(f.desvantagens||[]).length} escolhida(s)).</p><div class="checks">${D.desvantagensIdade.map(dv=>`<label title="${h(dv.desc)}"><input type="checkbox" data-act="desv" data-id="${dv.id}" ${(f.desvantagens||[]).includes(dv.id)?'checked':''}> ${h(dv.nome)}</label>`).join('')}</div>`:''}</div>`:'';
  const alerts=[...r.alertas];
  if(r.attr.usado>r.attr.max)alerts.push(`Pontos de atributo acima do permitido (${r.attr.usado}/${r.attr.max}).`);
  if(r.poderes.usado>r.poderes.max)alerts.push(`Mais poderes do que o NEX permite (${r.poderes.usado}/${r.poderes.max}).`);
  if(r.rit.max&&r.rit.usado>r.rit.max)alerts.push(`Mais rituais do que o limite (${r.rit.usado}/${r.rit.max}).`);
  return `
  ${alerts.length?`<div class="alert">${alerts.map(a=>`<p>${h(a)}</p>`).join('')}</div>`:''}
  <div class="sec"><div class="sec-h"><h2>Identificação</h2></div>
   <div class="grid g4">
    ${fld('Jogador',inp('jogador',f.jogador))}${fld('Conceito',inp('conceito',f.conceito))}${fld('Idade',inp('idade',f.idade))}
    ${prog}
    ${fld('Origem',`<select class="inp" id="f-origem" data-f="origem" data-r>${opt('','Escolha…',f.origem)}${grupoFonte(origens,f.origem)}</select>`)}
    ${o&&o.opcoes?fld('Variante da origem',`<select class="inp" data-f="origemOpcao" data-num data-r>${o.opcoes.map((x,i)=>opt(i,x.nome,f.origemOpcao)).join('')}</select>`):''}
    ${o&&o.escolhePericiaBonus?fld('Perícia do poder',`<select class="inp" data-f="origemEscolha" data-r>${opt('','Escolha…',f.origemEscolha)}${pericias().filter(p=>o.escolhePericiaBonus.attrs.includes(p.attr)).map(p=>opt(p.id,p.nome,f.origemEscolha)).join('')}</select>`):''}
    ${fld('Classe',`<select class="inp" id="f-classe" data-f="classe" data-r>${opt('','Escolha…',f.classe)}${grupoFonte(classes,f.classe)}</select>`)}
    ${fld('Trilha',`<select class="inp" id="f-trilha" data-f="trilha" data-r ${!r.est&&f.nex<10?'disabled':''}>${opt('',!r.est&&f.nex<10?'Disponível em NEX 10%':'Escolha…',f.trilha)}${grupoFonte(trilhas,f.trilha)}</select>`)}
    ${r.t&&r.t.elementoEscolha?fld('Elemento da trilha',`<select class="inp" data-f="trilhaElemento" data-r>${opt('','Escolha…',f.trilhaElemento)}${['sangue','morte','conhecimento','energia'].map(k=>opt(k,ELEM[k],f.trilhaElemento)).join('')}</select>`):''}
    ${fld('Afinidade',`<select class="inp" data-f="afinidade" data-r ${!r.est&&f.nex<50?'title="Afinidade é escolhida em NEX 50%"':''}>${Object.entries(ELEM).filter(([k])=>k!=='medo').map(([k,v])=>opt(k,v,f.afinidade)).join('')}</select>`)}
    ${S.conta&&S.conta.usuario&&!f._alheia?fld('Campanha',`<select class="inp" data-f="mesa" data-r>${opt('','Nenhuma (só eu vejo)',f.mesa||'')}${(S.mesas||[]).map(m=>opt(m.id,m.nome+(m.papel==='mestre'?' (você é o mestre)':' · mestre '+m.mestre),f.mesa||'')).join('')}</select>`):''}
    ${fld('Pontos de prestígio',numInp('pp',f.pp,'min="0"'))}
    ${fld('Patente',`<div class="inp ro" data-d="patente">${h(r.patente.nome)} · crédito ${h(r.patente.credito)}</div>`)}
   </div>
   ${o?`<p class="hint"><b>${h(o.poderNome)}:</b> ${h(o.poderDesc)} ${fonteBadge(o)}</p>`:''}</div>
  ${desv}
  <div class="top-split">
   <div class="sec"><div class="sec-h"><h2>Atributos</h2></div>
    <div class="star" id="star"></div>
    <p class="attr-note">Pontos gastos <b class="${r.attr.usado>r.attr.max?'bad':''}">${r.attr.usado}/${r.attr.max}</b> · reduzir um atributo a 0 dá +1 ponto${regraOn('atributos_negativos')?' · atributos negativos permitidos':''}</p></div>
   <div class="sec"><div class="sec-h"><h2>Números</h2></div>
    <div class="statline">
     <div class="stat"><b data-d="defesa">${r.defesa}</b><span>Defesa</span></div>
     <div class="stat"><b data-d="desloc">${r.desloc}m</b><span>Deslocamento</span></div>
     <div class="stat"><b data-d="peLim">${r.peLim}</b><span>${r.det?'PD':'PE'} por turno</span></div>
     <div class="stat"><b data-d="dt">${r.dt}</b><span>DT de rituais</span></div>
     <div class="stat"><b data-d="carga">${r.esp}/${r.carga}</b><span>Carga</span></div>
     <div class="stat"><b>${r.lv}</b><span>${r.est?'Estágio':'Nível'}</span></div>
    </div>
    ${r.rd.length?`<p class="hint"><b>Resistências:</b> ${r.rd.map(h).join(' · ')}</p>`:''}
    ${r.peAttr!=='PRE'||r.dtAttr!=='PRE'?`<p class="hint">${r.det?'PD':'PE'} calculados com ${ATTR_NOME[r.peAttr]}${r.dtAttr!=='PRE'?` · DT de rituais com ${ATTR_NOME[r.dtAttr]}`:''}${r.trilhaElemento?' (elemento da trilha: '+ELEM[r.trilhaElemento]+')':''}.</p>`:''}
    ${r.nTrans?`<p class="hint">Transcender ${r.nTrans}× · −${r.nTrans*((r.det?(D.extras.classesExtra[f.classe]||{}).pdNex:r.c.sanNex)||0)} ${r.det?'PD':'SAN'} máximos aplicados automaticamente.</p>`:''}
    ${+f.sanPerm?`<p class="hint">Perda permanente: −${f.sanPerm} ${r.det?'PD':'SAN'} <button class="btn sm ghost" data-act="zeraPerm">zerar</button></p>`:''}
    <div class="row"><button class="btn sm" data-act="descanso">Recuperar tudo</button><button class="btn sm ghost" data-act="fimMissao">Fim de missão</button></div>
   </div>
  </div>
  ${modsPanel(f,r)}`;
}
function grupoFonte(list,sel){
  const g={};list.forEach(x=>{const k=x._hb?'★ '+(x.pacote||'Minha mesa'):FONTE(x.fonte).nome;(g[k]=g[k]||[]).push(x)});
  return Object.entries(g).map(([k,v])=>`<optgroup label="${h(k)}">${v.map(x=>opt(x.id,x.nome,sel)).join('')}</optgroup>`).join('');
}
function modAlvos(){return [['pv','PV'],['pvNex','PV por nível'],['pe','PE / PD'],['peNex','PE por nível'],['san','SAN'],['sanNex','SAN por nível'],
  ['defesa','Defesa'],['deslocamento','Deslocamento (m)'],['carga','Espaços de carga'],['peLimite','Limite de PE por turno'],['dtRitual','DT de rituais'],['resist','Testes de resistência']]
  .concat(pericias().map(p=>['per:'+p.id,'Perícia: '+p.nome]))}
const alvoNome=a=>(modAlvos().find(x=>x[0]===a)||[a,a==='pvBase'?'PV iniciais':a==='pvPor10'?'PV a cada 10% NEX':a==='pePor10'?'PE a cada 10% NEX':a==='carga_pen'?'Perícias de carga':a])[1];
function modsPanel(f,r){
  const auto=r.mods.filter(m=>m.fonte!=='Manual');
  return `<div class="sec"><div class="sec-h"><h2>Modificadores automáticos</h2><div class="row"><button class="btn sm" data-act="modAdd">+ Bônus permanente manual</button></div></div>
   ${auto.length?`<div class="chips">${auto.map(m=>`<span class="chip">${h(m.fonte)}: ${sgn(m.valor)} ${h(alvoNome(m.alvo))}</span>`).join('')}</div>`:'<p class="hint">Origens, trilhas, poderes, aliados e itens equipados com efeitos numéricos aparecem aqui e já entram nos cálculos.</p>'}
   ${f.mods.map((m,i)=>modRow('f',i,m)).join('')}</div>`;
}
function modRow(scope,i,m){const at=scope==='f'?'f':'h';return `<div class="modrow"><select class="inp" data-${at}="mods.${i}.alvo" data-r>${modAlvos().map(([k,l])=>opt(k,l,m.alvo)).join('')}</select>
  <input class="inp num" type="number" data-${at}="mods.${i}.valor" data-num value="${h(m.valor)}" aria-label="Valor"><button class="btn sm ghost danger" data-act="modDel" data-scope="${scope}" data-i="${i}" aria-label="Remover">✕</button></div>`}
function drawStar(){
  const el=document.getElementById('star');const f=F();if(!el||!f)return;const r=calc(f);
  const pos={AGI:-90,INT:-18,VIG:54,PRE:126,FOR:198};const R=38;
  const pt=a=>[50+R*Math.cos(a*Math.PI/180),50+R*Math.sin(a*Math.PI/180)];
  const path=['AGI','VIG','FOR','INT','PRE','AGI'].map((k,i)=>(i?'L':'M')+pt(pos[k]).join(' ')).join(' ');
  el.innerHTML=`<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="${R}" fill="none" stroke="currentColor" stroke-width=".6"/><path d="${path}" fill="none" stroke="currentColor" stroke-width=".6"/></svg>`+
   ATTR.map(a=>{const [x,y]=pt(pos[a]);const ef=r.A[a]-f.atributos[a];return `<div class="attr" style="left:${x}%;top:${y}%"><div class="disc" title="${ATTR_NOME[a]}">${f.atributos[a]}${ef?`<sup>${sgn(ef)}</sup>`:''}</div><span class="lbl">${a}</span>
    <div class="pm"><button data-act="attr" data-a="${a}" data-d="-1" aria-label="Reduzir ${ATTR_NOME[a]}">−</button><button data-act="attr" data-a="${a}" data-d="1" aria-label="Aumentar ${ATTR_NOME[a]}">+</button></div></div>`}).join('');
}

/* ---------- Perícias ---------- */
function panePericias(f,r){
  const grupos=escolhasClasse(r.c);const P=pericias();
  const chip=(l,o)=>`<span class="chip ${o.max&&o.usado>o.max?'over':o.max&&o.usado===o.max?'ok':''}">${l} ${o.usado}/${o.max}</span>`;
  return `<div class="sec"><div class="sec-h"><h2>Treinamento</h2></div>
   <div class="chips">${chip('Treinadas à escolha',r.trein)}${f.nex>=35?chip('Veterano',r.vet):'<span class="chip">Veterano a partir de NEX 35%</span>'}${f.nex>=70?chip('Experiente',r.exp):''}</div>
   ${grupos.length?`<div class="grid">${grupos.map((g,i)=>`<div class="row"><span class="hint">Classe, escolha uma:</span>${g.map(id=>`<button class="btn sm" aria-pressed="${f.escolhas[i]===id}" data-act="escolha" data-i="${i}" data-id="${id}">${h(perNome(id))}</button>`).join('')}</div>`).join('')}</div>`:''}
   <p class="hint">Clique no dado para rolar: atributo em d20 (fica com o maior) + bônus. Condições somam ou tiram dados automaticamente; abaixo de 1 dado, rola 2 (ou mais) e fica com o pior. Bônus de interlúdio (Ler, Exercitar) aparecem no resultado para você somar.</p></div>
  <div class="tbl-wrap"><table><thead><tr><th></th><th>Perícia</th><th>Dados</th><th>Grau</th><th>Outros</th><th style="text-align:right">Total</th></tr></thead><tbody>
  ${P.map(p=>{const x=r.per[p.id];return `<tr class="${x.grau?'tr':''}"><td style="width:36px"><button class="roll" data-act="rollPer" data-id="${p.id}" aria-label="Rolar ${h(p.nome)}">${D20}</button></td>
   <td>${h(p.nome)} <span class="badge">${x.attr}</span>${p.somenteTreinada?' <span class="badge" title="Somente treinada">T</span>':''}${p.carga?' <span class="badge" title="Penalidade de carga">C</span>':''}${x.auto?` <span class="badge acc">${x.auto}</span>`:''}${x.extra2?` <span class="badge acc" title="Já era treinado: +2">+${x.extra2}</span>`:''}${p._hb?' <span class="badge hb">homebrew</span>':''}</td>
   <td class="dice ${x.dm<0?'neg':x.dm>0?'pos':''}" title="${x.dm?`Atributo ${x.base} ${sgn(x.dm)} dado(s) de condições/bônus`:''}">${x.dados<1?(2-x.dados)+'d20↓':x.dados+'d20'}</td>
   <td><select class="inp" data-f="pericias.${p.id}" data-num data-r aria-label="Grau em ${h(p.nome)}">${Object.entries(GRAU).map(([v,l])=>opt(v,l+' (+'+v+')',x.grau)).join('')}</select></td>
   <td style="width:72px"><input class="inp num" type="number" data-f="outros.${p.id}" data-num value="${h(f.outros[p.id]??'')}" placeholder="0" aria-label="Outros bônus em ${h(p.nome)}"></td>
   <td class="tot" data-d="per-${p.id}">${sgn(x.bonus)}</td></tr>`}).join('')}
  </tbody></table></div>`;
}

/* ---------- Habilidades ---------- */
function paneHab(f,r){
  const c=r.c,o=r.o,t=r.t;
  const card=(nome,desc,extra='',locked=false,badge='')=>`<div class="card ${locked?'locked':''}"><h4>${h(nome)} ${badge}</h4>${extra}${desc?`<p>${h(desc)}</p>`:''}</div>`;
  const marcos=r.est?[1,2,3,4,5]:NEX_LIST;
  return `<div class="sec"><div class="sec-h"><h2>Progressão</h2><span class="hint">${r.est?'Estágio':'Nível'} ${r.lv}</span></div>
   <div class="timeline"><div class="tl" style="grid-template-columns:repeat(${marcos.length},minmax(62px,1fr));min-width:${marcos.length*64}px">${marcos.map(n=>{const ev=r.est?[]:[...(MARCOS[n]||[])];
     (c&&c.habilidades||[]).filter(x=>+x.nex===n&&(r.est||n!==5)).forEach(x=>ev.push(x.nome));(t&&t.habilidades||[]).filter(x=>+x.nex===n).forEach(x=>{const i=ev.indexOf('Trilha');if(i>=0)ev.splice(i,1);ev.push(x.nome)});
     const p=r.prog;return `<div class="${n<=p?'done':''} ${n===p?'now':''}"><b>${r.est?'E'+n:n+'%'}</b>${ev.map(e=>`<span>${h(e)}</span>`).join('')}</div>`}).join('')}</div></div></div>
  <div class="sec"><div class="sec-h"><h2>Origem e classe</h2></div>
   <div class="cards">
    ${o?card(o.poderNome||'Poder de origem',o.poderDesc,`<div class="meta">Origem: ${h(o.nome)} · Perícias: ${r.og.per.map(perNome).join(', ')||'à escolha'}${o.periciasNota?' '+h(o.periciasNota):''}</div>`,false,fonteBadge(o)):'<div class="empty">Escolha uma origem no Dossiê.</div>'}
    ${c?(c.habilidades||[]).map(x=>card(x.nome,x.desc,`<div class="meta">${h(c.nome)} · ${r.est?'Estágio '+x.nex:'NEX '+x.nex+'%'}</div>`,+x.nex>r.prog)).join('')+card('Proficiências',c.proficiencias,`<div class="meta">${h(c.nome)}</div>`):''}
   </div></div>
  <div class="sec"><div class="sec-h"><h2>Trilha${t?': '+h(t.nome):''}</h2>${t?fonteBadge(t):''}</div>
   ${t?`${t.desc?`<p class="hint">${h(t.desc)}</p>`:''}<div class="cards">${(t.habilidades||[]).map(x=>card(x.nome,x.desc,`<div class="meta">${r.est?'Estágio '+x.nex:'NEX '+x.nex+'%'}${(x.mods||[]).length?' · '+x.mods.map(m=>sgn(+m.valor)+' '+alvoNome(m.alvo)).join(', '):''}</div>`,+x.nex>r.prog)).join('')}</div>`
     :`<div class="empty">${!r.est&&f.nex<10?'A trilha é escolhida em NEX 10%.':'Escolha uma trilha no Dossiê.'}</div>`}</div>
  <div class="sec"><div class="sec-h"><h2>Poderes</h2><span class="chip ${r.poderes.usado>r.poderes.max?'over':''}">Poderes ${r.poderes.usado}/${r.poderes.max}</span>
    <div class="row"><button class="btn acc sm" data-act="pick" data-type="poderes">+ Poder</button><button class="btn sm" data-act="pick" data-type="transcender" title="Recebe um poder paranormal e perde a Sanidade deste NEX">+ Transcender</button></div></div>
   ${f.poderes.length?`<div class="cards">${f.poderes.map(p=>poderCard(p,f,r)).join('')}</div>`
     :'<div class="empty">Nenhum poder ainda. Poderes chegam em NEX 15%, 30%, 45%, 60%, 75% e 90%. Para um poder paranormal, use “Transcender”: a perda de Sanidade (ou de PD) é aplicada sozinha.</div>'}</div>`;
}
function tipoPoderNome(t){if(t==='geral')return 'Poder geral';if(t==='paranormal')return 'Poder paranormal';const c=byId('classes',t);return c?'Poder de '+c.nome:t}
function poderCard(p,f,r){
  const d=byId('poderes',p.ref);if(!d)return `<div class="card"><h4>Poder indisponível <span class="row"><button class="btn sm ghost danger" data-act="rmPoder" data-id="${p.uid}">Remover</button></span></h4><p class="hint">A fonte deste poder está desligada na aba Mesa ou ele foi removido.</p></div>`;
  const afin=f.afinidade&&d.elemento===f.afinidade;const sanN=r.det?((D.extras.classesExtra[f.classe]||{}).pdNex||0):(r.c?+r.c.sanNex:0);
  const precisaEscolha=d.treinaOu2==='pericia'||d.escolheDadoPericia||d.escolheElemento;
  return `<div class="card ${d.elemento?'el el-'+d.elemento:''}"><h4>${h(d.nome)} ${elBadge(d.elemento)} ${fonteBadge(d)}<span class="row"><button class="btn sm ghost danger" data-act="rmPoder" data-id="${p.uid}" aria-label="Remover ${h(d.nome)}">✕</button></span></h4>
   <div class="meta"><span>${h(tipoPoderNome(d.tipo))}</span>${d.prereq?`<span>Pré-req.: ${h(d.prereq)}</span>`:''}${(d.mods||[]).map(m=>`<span>${sgn(+m.valor)} ${h(alvoNome(m.alvo))}</span>`).join('')}</div>
   ${d.desc?`<p>${h(d.desc)}</p>`:''}${d.afinidade?`<p class="${afin?'afin':'hint'}"><b>Afinidade${afin?' (ativa)':''}:</b> ${h(d.afinidade)}</p>`:''}
   ${precisaEscolha?`<label class="fld"><span>Escolha</span><select class="inp" data-pod="${p.uid}" data-k="escolha">${opt('','—',p.escolha)}${d.escolheElemento?Object.entries(ELEM).filter(([k])=>k&&k!=='medo').map(([k,v])=>opt(k,v,p.escolha)).join(''):pericias().map(x=>opt(x.id,x.nome,p.escolha)).join('')}</select></label>`:''}
   ${d.tipo==='paranormal'?`<div class="row" style="font-size:12px"><label class="row" style="gap:4px"><input type="checkbox" data-pod="${p.uid}" data-k="transcender" ${p.transcender?'checked':''}> Via Transcender (−${sanN} ${r.det?'PD':'SAN'})</label>
     ${regraOn('transcender_itens')?`<label class="row" style="gap:4px"><input type="checkbox" data-pod="${p.uid}" data-k="viaItem" ${p.viaItem?'checked':''}> Via item amaldiçoado (sem custo)</label>`:''}
     <label class="row" style="gap:4px"><input type="checkbox" data-pod="${p.uid}" data-k="extra" ${p.extra?'checked':''}> Não conta no limite</label></div>`
     :`<label class="row" style="gap:4px;font-size:12px"><input type="checkbox" data-pod="${p.uid}" data-k="extra" ${p.extra?'checked':''}> Não conta no limite (veio da origem, trilha etc.)</label>`}
   ${d.acao?`<div class="row"><button class="btn sm acc" data-act="usarPoder" data-id="${p.uid}">Usar${d.acao.pe?` (−${d.acao.pe} ${r.det?'PD':'PE'})`:''}${d.acao.pvTemp?' → PV temporários '+h(d.acao.pvTemp):''}${d.acao.cura?' → cura '+h(d.acao.cura):''}</button></div>`:''}</div>`;
}

/* ---------- Rituais ---------- */
function paneRit(f,r){
  const rits=f.rituais.map(id=>byId('rituais',id)||{id,nome:'Ritual indisponível',_gone:true});
  return `<div class="sec"><div class="sec-h"><h2>Rituais</h2>
    <span class="chip">DT ${r.dt}</span><span class="chip">Até o ${r.circ}º círculo</span>${r.rit.max?`<span class="chip ${r.rit.usado>r.rit.max?'over':''}">Conhecidos ${r.rit.usado}/${r.rit.max}</span>`:''}
    <div class="row"><button class="btn acc sm" data-act="pick" data-type="rituais">+ Aprender ritual</button></div></div>
   <p class="hint">“Conjurar” desconta ${r.det?'PD':'PE'} (incluindo penalidades de condições) e, se ligado na Mesa, faz sozinho o teste do Custo do Paranormal (Ocultismo DT 20 + custo) e aplica a perda de ${r.det?'PD':'Sanidade'}. Rituais de Medo sempre cobram Sanidade. Efeitos em você mesmo vão para a aba Bônus.</p>
   ${(f.retidos||[]).length?`<div class="chips">${f.retidos.map((x,i)=>`<span class="chip warn">Retendo ${h((byId('rituais',x.rit)||{}).nome||'ritual')} · ${x.pe} ${r.det?'PD':'PE'} presos <button class="mini" data-act="soltarRet" data-i="${i}">soltar</button></span>`).join('')}</div>`:''}
   ${rits.length?ritFiltros(rits)+ritGrupos(rits,r):'<div class="empty">Nenhum ritual aprendido. Ocultistas começam com 3 rituais de 1º círculo; outras classes aprendem com o poder Aprender Ritual.</div>'}</div>`;
}
const ORD_EL=['sangue','morte','conhecimento','energia','medo',''];
const ordEl=e=>{const i=ORD_EL.indexOf(e||'');return i<0?9:i};
const elsDe=x=>(x.elementos||[x.elemento]).filter(Boolean);
/* Chips de filtro por elemento (S.filtroRit) */
function ritFiltros(rits){const els=[...new Set(rits.flatMap(x=>x._gone?[]:(elsDe(x).length?elsDe(x):[''])))].sort((a,b)=>ordEl(a)-ordEl(b));
  if(els.length<2)return '';const cur=S.filtroRit||'';
  return `<div class="chips filtros" role="group" aria-label="Filtrar por elemento"><button class="btn sm" aria-pressed="${!cur}" data-act="filtroRit" data-v="">Todos</button>${els.map(e=>`<button class="btn sm el el-${e||'x'}" aria-pressed="${cur===(e||'_')}" data-act="filtroRit" data-v="${e||'_'}">${e?ELEM[e]:'Varia'}</button>`).join('')}</div>`}
function ritGrupos(rits,r){
  const cur=S.filtroRit||'';const vis=rits.filter(x=>x._gone||!cur||(cur==='_'?!elsDe(x).length:elsDe(x).includes(cur)));
  const porC={};vis.forEach(x=>(porC[x._gone?0:+x.circulo]=porC[x._gone?0:+x.circulo]||[]).push(x));
  return Object.keys(porC).map(Number).sort((a,b)=>(a||9)-(b||9)).map(c=>{const l=porC[c].sort((a,b)=>ordEl(a.elemento)-ordEl(b.elemento)||String(a.nome).localeCompare(b.nome));
    return `<div class="grp-h"><h3>${c?c+'º círculo':'Indisponíveis'}</h3><span class="hint">${c?CUSTO_CIRC[c]+' '+(r.det?'PD':'PE')+' · ':''}${l.length} ritua${l.length>1?'is':'l'}</span></div>
     <div class="cards">${l.map(x=>x._gone?`<div class="card"><h4>${h(x.nome)}<span class="row"><button class="btn sm ghost danger" data-act="rmRit" data-id="${h(x.id)}">Remover</button></span></h4><p class="hint">A fonte deste ritual está desligada na Mesa.</p></div>`:ritCard(x,r)).join('')}</div>`}).join('')||'<p class="hint">Nenhum ritual desse elemento.</p>';
}
function ritCard(x,r){const custo=CUSTO_CIRC[+x.circulo]||0;const el=(x.elementos||[x.elemento]).filter(Boolean);
  return `<div class="card el el-${x.elemento||'x'}"><h4>${h(x.nome)} ${el.map(elBadge).join('')||'<span class="badge">Varia</span>'} ${fonteBadge(x)}<span class="row"><button class="btn sm ghost danger" data-act="rmRit" data-id="${x.id}" aria-label="Esquecer ${h(x.nome)}">✕</button></span></h4>
   <div class="meta"><span>${x.circulo}º círculo</span><span>${custo} ${r.det?'PD':'PE'}</span>${['execucao','alcance','alvo','duracao','resistencia'].filter(k=>x[k]).map(k=>`<span>${h(x[k])}</span>`).join('')}</div>
   ${x.desc?`<p>${h(x.desc)}</p>`:''}${x.discente?`<p><b>Discente:</b> ${h(x.discente)}</p>`:''}${x.verdadeiro?`<p><b>Verdadeiro:</b> ${h(x.verdadeiro)}</p>`:''}
   <div class="row"><button class="btn sm acc" data-act="castModal" data-id="${x.id}">Conjurar…</button>${x.dano?`<button class="btn sm" data-act="ritDano" data-id="${x.id}">Dano ${h(x.dano)}</button>`:''}</div></div>`}

/* ---------- Inventário ---------- */
function paneInv(f,r){
  const lim=r.patente.lim;
  return `<div class="sec"><div class="sec-h"><h2>Inventário</h2><div class="row"><button class="btn acc sm" data-act="pick" data-type="itens">+ Do catálogo</button><button class="btn sm" data-act="itemNovo">+ Item personalizado</button></div></div>
   <div class="cap"><div class="bar" style="color:${r.sobrecarga?'var(--warn)':'var(--ink)'}"><i style="width:${Math.min(100,r.esp/Math.max(1,r.carga)*100)}%"></i></div>
    <div class="chips"><span class="chip ${r.sobrecarga?'over':''}">Espaços ${r.esp}/${r.carga}${r.sobrecarga?' · sobrecarregado: −5 Defesa, −3m, −5 em perícias de carga':''}</span>
    ${[1,2,3,4].map(k=>`<span class="chip ${r.catUso[k-1]>(lim[k-1]??0)?'over':''}">Cat. ${CAT_NOME[k]} ${r.catUso[k-1]}/${lim[k-1]??0}</span>`).join('')}<span class="chip">${h(r.patente.nome)} · crédito ${h(r.patente.credito)}</span></div>
    <p class="hint">Modificações e maldições sobem a categoria sozinhas (modificação +I; primeira maldição +II, as seguintes +I). ${S.assets?'Clique em “Imagem” para anexar uma foto ou arte ao item.':''}</p></div>
   ${f.inventario.length?invGrupos(f,r):'<div class="empty">Mochila vazia. Adicione itens do catálogo ou crie um item personalizado.</div>'}</div>`;
}
const ORD_TIPO=Object.keys(TIPO_ITEM);
function invGrupos(f,r){
  const g={};f.inventario.forEach((it,i)=>(g[it.tipo]=g[it.tipo]||[]).push([it,i]));
  const tipos=Object.keys(g).sort((a,b)=>(ORD_TIPO.indexOf(a)+99)%99-(ORD_TIPO.indexOf(b)+99)%99);const cur=S.filtroInv||'';
  const chips=tipos.length>1?`<div class="chips filtros" role="group" aria-label="Filtrar por tipo"><button class="btn sm" aria-pressed="${!cur}" data-act="filtroInv" data-v="">Todos</button>${tipos.map(t=>`<button class="btn sm" aria-pressed="${cur===t}" data-act="filtroInv" data-v="${h(t)}">${TIPO_ITEM[t]||h(t)} (${g[t].length})</button>`).join('')}</div>`:'';
  return chips+tipos.filter(t=>!cur||cur===t||!g[cur]).map(t=>`<div class="grp-h"><h3>${TIPO_ITEM[t]||h(t)}</h3><span class="hint">${g[t].reduce((s,[it])=>s+espItem(it)*(+it.qtd||1),0)} esp.</span></div>
    <div class="items">${g[t].map(([it,i])=>itemRow(it,i,f,r)).join('')}</div>`).join('');
}
const imgDe=it=>it.img||(it.ref&&S.cfg.imgs[it.ref])||'';
function itemRow(it,i,f,r){const open=S.open[it.uid];const arma=it.tipo==='arma';const b=`inventario.${i}.`;
  const ai=arma?armaInfo(it,r,f):null;const ms=modsDoItem(it);const ci=catItem(it);const img=imgDe(it);
  const usavel=it.consumivel||it.acao||it.cura;
  const equip=['protecao','acessorio','paranormal','amaldicoado','operacional','arma'].includes(it.tipo)||it.equipavel;
  return `<div class="item ${it.equipado?'eq':''} ${it.elemento?'el el-'+it.elemento:''}"><div class="item-row">
   ${img?`<img class="thumb" src="/_blob/${h(img)}" alt="" loading="lazy">`:''}
   <span class="nm">${h(it.nome)}${(+it.qtd||1)>1?` ×${it.qtd}`:''}</span><span class="badge">${TIPO_ITEM[it.tipo]||h(it.tipo)}</span>${elBadge(it.elemento)}<span class="badge ${ci>+it.cat?'acc':''}">Cat. ${CAT_NOME[ci]||ci}</span><span class="badge">${espItem(it)*(+it.qtd||1)} esp.</span>${fonteBadge(it)}
   ${arma?`<span class="meta">${h(danoExpr(ai,false))} · ${ai.margem<20?ai.margem+'/':''}x${ai.mult} · ${ALCANCE[it.alcance]||h(it.alcance||'')}</span><button class="btn sm" data-act="atk" data-i="${i}">${D20} ${ai.per==='luta'?'Luta':'Pontaria'} ${sgn(ai.atk)}</button><button class="btn sm" data-act="dmg" data-i="${i}">Dano</button>`:''}
   ${it.tipo==='protecao'?`<span class="meta">Defesa +${+it.defesa||0}</span>`:''}
   ${it.tipo==='acessorio'&&it.bonusPericia?`<span class="meta">${typeof it.bonusPericia==='number'?(it.pericia?`+${it.bonusPericia+ms.reduce((a,mm)=>a+(+(mm.efeitos||{}).bonusPericia||0),0)} em ${h(perNome(it.pericia))}`:'escolha a perícia em Detalhes'):''}${it.equipado?'':' (equipe para valer)'}</span>`:''}
   ${regraOn('contagem_municao')&&(it.tipo==='municao'||it.municao)?`<span class="meta">Munição <input class="inp num sm" type="number" data-f="${b}balas" data-num value="${it.balas??20}" style="width:56px"></span>`:''}
   ${usavel?`<button class="btn sm acc" data-act="usarItem" data-i="${i}">Usar</button>`:''}
   ${equip?`<label class="row" style="gap:4px;font-size:12px"><input type="checkbox" data-f="${b}equipado" data-r ${it.equipado?'checked':''}> ${it.tipo==='arma'?'Empunhada':'Equipado'}</label>`:''}
   <button class="btn sm ghost" data-act="toggle" data-id="${it.uid}">${open?'Fechar':'Detalhes'}</button><button class="btn sm ghost danger" data-act="rmItem" data-i="${i}" aria-label="Remover ${h(it.nome)}">✕</button></div>
   ${ms.length?`<div class="chips">${ms.map((m,k)=>`<span class="chip ${m.maldicao?'curse':''}" title="${h(m.desc)}">${m.maldicao?'Maldição: ':''}${h(m.nome)} <button class="mini" data-act="rmMod" data-i="${i}" data-k="${k}" aria-label="Remover">✕</button></span>`).join('')}</div>`:''}
   ${open?`${it.desc?`<p class="hint" style="margin:0">${h(it.desc)}</p>`:''}<div class="grid g4">
    ${fld('Nome',inp(b+'nome',it.nome))}${fld('Tipo',`<select class="inp" data-f="${b}tipo" data-r>${Object.entries(TIPO_ITEM).map(([k,v])=>opt(k,v,it.tipo)).join('')}</select>`)}
    ${fld('Categoria base',`<select class="inp" data-f="${b}cat" data-num data-r>${CAT_NOME.slice(0,5).map((n,k)=>opt(k,n,it.cat)).join('')}</select>`)}${fld('Espaços',numInp(b+'esp',it.esp))}
    ${fld('Quantidade',numInp(b+'qtd',it.qtd))}
    ${arma?fld('Dano',inp(b+'dano',it.dano))+fld('Crítico',inp(b+'critico',it.critico))+fld('Alcance',`<select class="inp" data-f="${b}alcance" data-r>${opt('','—',it.alcance)}${Object.entries(ALCANCE).map(([k,v])=>opt(k,v,it.alcance)).join('')}</select>`)+fld('Forma',`<select class="inp" data-f="${b}forma" data-r>${[['corpo','Corpo a corpo'],['fogo','Arma de fogo'],['disparo','Disparo']].map(([k,v])=>opt(k,v,it.forma)).join('')}</select>`)+fld('Tipo de dano',inp(b+'tipoDano',it.tipoDano))+fld('Bônus de ataque',numInp(b+'atkBonus',it.atkBonus||0)):''}
    ${it.tipo==='protecao'?fld('Defesa',numInp(b+'defesa',it.defesa)):''}
    ${it.escolhePericia?fld('Perícia beneficiada',`<select class="inp" data-f="${b}pericia" data-r>${opt('','Escolha…',it.pericia)}${pericias().filter(p=>p.id!=='luta'&&p.id!=='pontaria').map(p=>opt(p.id,p.nome,it.pericia)).join('')}</select>`):''}
    ${ms.some(mm=>mm.id==='mod_funcao_adicional_acessorio')?fld('Perícia da Função Adicional (+2)',`<select class="inp" data-f="${b}periciaExtra" data-r>${opt('','Escolha…',it.periciaExtra)}${pericias().filter(p=>p.id!=='luta'&&p.id!=='pontaria').map(p=>opt(p.id,p.nome,it.periciaExtra)).join('')}</select>`):''}
    ${fld('Elemento',`<select class="inp" data-f="${b}elemento" data-r>${Object.entries(ELEM).map(([k,v])=>opt(k,v,it.elemento||'')).join('')}</select>`)}
    ${fld('Notas',`<textarea class="inp" data-f="${b}notas" style="min-height:44px">${h(it.notas||'')}</textarea>`,'span2')}</div>
    <div class="row"><button class="btn sm" data-act="pickMod" data-i="${i}">+ Modificação / maldição</button>
     ${S.assets?`<button class="btn sm" data-act="imgUp" data-i="${i}">${img?'Trocar imagem':'Imagem'}</button>${img?`<button class="btn sm ghost" data-act="imgRm" data-i="${i}">Tirar imagem</button>`:''}${it.ref?`<label class="row" style="gap:4px;font-size:12px"><input type="checkbox" data-act="imgTodos" data-i="${i}" ${it.ref&&S.cfg.imgs[it.ref]?'checked':''} ${img?'':'disabled'}> Usar esta imagem em todo “${h(it.nome)}”</label>`:''}`:'<span class="hint">Imagens: disponível para quem pode editar este artifact.</span>'}</div>
    ${img?`<img class="bigimg" src="/_blob/${h(img)}" alt="Imagem de ${h(it.nome)}">`:''}`:''}</div>`}

/* ---------- Aliados & NPCs ---------- */
function paneAliados(f,r){
  const al=f.aliados||[];
  return `<div class="sec"><div class="sec-h"><h2>Aliados & NPCs</h2><div class="row"><button class="btn acc sm" data-act="pick" data-type="aliados">+ Aliado do catálogo</button><button class="btn sm" data-act="npcNovo">+ NPC personalizado</button></div></div>
   <p class="hint">Marque um aliado como <b>ativo</b> para somar o bônus dele à ficha (perícias treinadas, dados extras, deslocamento). NPCs têm PV próprios com o mesmo campo de dano: digite −10 e aperte Enter.</p>
   ${al.length?`<div class="cards">${al.map((a,i)=>npcCard(a,i,f,r)).join('')}</div>`:'<div class="empty">Nenhum aliado ou NPC. Adicione um do catálogo (Acólito, Socorrista, Mascarados, Pássaros…) ou crie um NPC do zero.</div>'}</div>`;
}
function npcCard(a,i,f,r){const d=a.ref?byId('aliados',a.ref):null;const b=`aliados.${i}.`;const open=S.open[a.uid];
  const be=d&&d.bonusEf||{};
  return `<div class="card npc ${a.ativo?'on':''}"><h4>${a.img?`<img class="thumb" src="/_blob/${h(a.img)}" alt="">`:''}<input class="inp ttl" data-f="${b}nome" value="${h(a.nome)}" aria-label="Nome">${d?fonteBadge(d):'<span class="badge">NPC</span>'}
    <span class="row"><button class="btn sm ghost" data-act="toggle" data-id="${a.uid}">${open?'Fechar':'Editar'}</button><button class="btn sm ghost danger" data-act="rmNpc" data-i="${i}" aria-label="Remover">✕</button></span></h4>
   ${d?`<label class="row" style="gap:6px;font-size:13px"><input type="checkbox" data-f="${b}ativo" data-r ${a.ativo?'checked':''}> Ativo (bônus aplicado)</label>
     <p><b>Bônus:</b> ${h(d.bonus)}</p><p><b>Habilidade:</b> ${h(d.habilidade)}</p>
     ${be.treinaEscolha?`<div class="row">${Array.from({length:be.treinaEscolha},(_,k)=>`<select class="inp" style="width:auto" data-f="${b}escolhas.${k}" data-r>${opt('','Perícia…',(a.escolhas||[])[k])}${pericias().filter(p=>!['luta','pontaria'].includes(p.id)).map(p=>opt(p.id,p.nome,(a.escolhas||[])[k])).join('')}</select>`).join('')}</div>`:''}
     <div class="row">${d.habPE||d.habDado||d.habCura?`<button class="btn sm acc" data-act="habAliado" data-i="${i}">Usar habilidade${d.habPE?` (−${d.habPE} ${r.det?'PD':'PE'})`:''}${d.habDado?' · '+h(d.habDado):''}${d.habCura?' · cura '+h(d.habCura):''}</button>`:''}</div>`:''}
   ${!d||open?`<div class="grid g3">${fld('Papel / descrição',inp(b+'desc',a.desc||''),'span2')}${fld('Defesa',numInp(b+'defesa',a.defesa))}
     ${fld('PV máx.',numInp(b+'pvMax',a.pvMax))}${fld('Ataque (bônus)',numInp(b+'atk',a.atk))}${fld('Dano',inp(b+'dano',a.dano||''))}
     ${fld('Notas',`<textarea class="inp" data-f="${b}notas" rows="2">${h(a.notas||'')}</textarea>`,'span2')}</div>
     ${S.assets?`<div class="row"><button class="btn sm" data-act="npcImg" data-i="${i}">${a.img?'Trocar retrato':'Retrato'}</button></div>`:''}`:''}
   ${+a.pvMax?`<div class="vit" style="--c:var(--pv)"><div class="vit-h"><b>PV</b><span class="vnum">${a.pv??a.pvMax}/${a.pvMax}</span></div><div class="bar"><i style="width:${Math.max(0,Math.min(100,(a.pv??a.pvMax)/a.pvMax*100))}%"></i></div>
     <div class="vit-in"><input class="inp" data-npcdmg="${i}" placeholder="−10 ou +5" aria-label="Alterar PV do NPC"><button class="btn sm" data-act="npcDmgGo" data-i="${i}">Aplicar</button></div></div>`:''}
   ${a.atk||a.dano?`<div class="row">${a.atk!=null&&a.atk!==''?`<button class="btn sm" data-act="npcAtk" data-i="${i}">${D20} Ataque ${sgn(+a.atk||0)}</button>`:''}${a.dano?`<button class="btn sm" data-act="npcDano" data-i="${i}">Dano ${h(a.dano)}</button>`:''}</div>`:''}
  </div>`}

/* ---------- Interlúdio ---------- */
function acoesInterludio(f,r){
  const base=clone(D.interludio);
  const tem=id=>r.flags.some(x=>x.id===id);
  const extra=[];
  if(r.flags.some(x=>x.interludioAcao==='meditar'))extra.push({id:'meditar',nome:'Meditação',desc:'Recupera PE igual ao dobro do limite de PE (Meditação Ocultista).',opcoes:[['precaria','Precária',.5],['normal','Normal',1],['confortavel','Confortável',1.5],['luxuosa','Luxuosa',2]].map(([id,nome,m])=>({id,nome,desc:'×'+m,efeito:{meditar:m}}))});
  if(r.flags.some(x=>x.interludioAcao==='ensaiar'))extra.push({id:'ensaiar',nome:'Ensaiar combate',desc:'+1 na margem de ameaça (+2 em NEX 40%, +3 em 65%, +4 em 99%) até o próximo interlúdio.'});
  r.pods.forEach(({p,d})=>{if(d.interludio)extra.push({id:'pod_'+d.id,nome:d.nome,desc:d.desc,pe:d.interludio.pe})});
  f.inventario.forEach((it,i)=>{if(it.interludioPE)extra.push({id:'item_'+it.uid,nome:'Usar '+it.nome,desc:it.desc,itemIdx:i})});
  if(regraOn('aprendizado_campo'))extra.push({id:'estudar',nome:'Estudar ritual (aprendizado em campo)',desc:'Ocultismo DT 20/25/30/35 conforme o círculo. Se passar, escolha o ritual na aba Rituais.'});
  if(regraOn('transcender_itens'))extra.push({id:'transc_item',nome:'Transcender com item',desc:'Responda à entidade e receba um poder paranormal do elemento do item (sem perda de Sanidade). Escolha o poder em Habilidades.'});
  if(regraOn('folgas'))extra.push({id:'folga',nome:'Folga (entre missões)',desc:'Relacionamento, trabalho, lazer (+2 ou +5 PE máximos na próxima missão) ou busca pessoal.'});
  extra.push({id:'outra',nome:'Outra ação',desc:'Qualquer ação narrativa (anote no campo de texto).'});
  return base.concat(extra);
}
function paneInterludio(f,r){
  const acoes=acoesInterludio(f,r);const I=f.interludio||(f.interludio={acoes:[],participantes:0});
  const livre=id=>(id==='exercitar'&&r.flags.some(x=>x.exercitarGratis))||(id==='alimentar'&&r.flags.some(x=>x.alimentarGratis));
  const usadas=I.acoes.filter(a=>!livre(a.id)).length;const max=+S.cfg.acoesInterludio||2;
  const escolhida=id=>I.acoes.find(a=>a.id===id);
  const ativos=(f.bonus||[]).filter(b=>b.tipo==='dado');
  return `<div class="sec"><div class="sec-h"><h2>Interlúdio</h2><span class="chip ${usadas>max?'over':usadas===max?'ok':''}">Ações ${usadas}/${max}</span>
     <div class="row"><button class="btn acc" data-act="interConcluir" ${I.acoes.length?'':'disabled'}>Concluir interlúdio</button></div></div>
   <p class="hint">Escolha as ações e as opções; ao concluir, o app recupera PV, ${r.det?'PD':'PE e Sanidade'} pelo limite de ${r.det?'PD':'PE'} (${r.peLim}), cria os bônus de Ler e Exercitar na aba Bônus e encerra bônus que duravam até o próximo interlúdio.${r.det?' Com Determinação, dormir recupera só PV e relaxar recupera PD.':''}</p>
   <div class="cards">${acoes.map(a=>{const e=escolhida(a.id);return `<div class="card act ${e?'on':''}"><h4>${h(a.nome)}${livre(a.id)?' <span class="badge acc">sem gastar ação</span>':''}${a.pe?` <span class="badge">${a.pe} PE</span>`:''}
      <span class="row"><button class="btn sm ${e?'pri':''}" data-act="interToggle" data-id="${a.id}">${e?'Escolhida':'Escolher'}</button></span></h4><p>${h(a.desc||'')}</p>
      ${a.opcoes&&e?`<div class="row">${a.opcoes.map(o=>`<button class="btn sm" aria-pressed="${e.opcao===o.id}" data-act="interOpt" data-id="${a.id}" data-o="${o.id}" title="${h(o.desc)}">${h(o.nome)}</button>`).join('')}</div>`:''}
      ${e&&(a.id==='outra'||a.id==='revisar'||a.id==='manutencao')?`<input class="inp" data-inter="${a.id}" value="${h(e.nota||'')}" placeholder="Anotação">`:''}
      ${e&&a.id==='relaxar'?`<label class="fld"><span>Outros personagens relaxando junto</span><input class="inp num" type="number" min="0" data-f="interludio.participantes" data-num value="${I.participantes||0}"></label>`:''}
     </div>`}).join('')}</div></div>
   <div class="sec"><div class="sec-h"><h2>Bônus de interlúdio guardados</h2></div>
    ${ativos.length?`<div class="chips">${ativos.map(b=>`<span class="chip ok">${h(b.nome)}: ${b.usos}× ${h(b.valor)}${b.attrs?' ('+b.attrs.join('/')+')':''}</span>`).join('')}</div>`:'<p class="hint">Nada guardado. Ler e Exercitar-se criam dados de bônus que ficam até o fim da missão.</p>'}</div>
   <div class="sec"><div class="sec-h"><h2>Registro</h2></div>
    ${(f.interludios||[]).length?`<div class="log">${f.interludios.slice().reverse().map(x=>`<div><b>${new Date(x.data).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})}</b> ${h(x.txt)}</div>`).join('')}</div>`:'<p class="hint">Os interlúdios concluídos ficam registrados aqui.</p>'}</div>`;
}

/* ---------- Bônus ---------- */
function paneBonus(f,r){
  const bs=f.bonus||[];const grp=k=>bs.filter(b=>b.tipo===k);
  const durSel=(i,v)=>`<select class="inp sm" data-f="bonus.${i}.dur" data-r aria-label="Duração">${Object.entries(DUR).map(([k,l])=>opt(k,l,v)).join('')}</select>`;
  const idx=b=>bs.indexOf(b);
  const efTxt=e=>Object.entries(e||{}).map(([k,v])=>k==='attr'?'':k==='valor'?`+${v} ${e.attr}`:k==='pericia'?`+${v.valor} ${perNome(v.id)}`:k==='dadosPer'?Object.entries(v).map(([p,n])=>`+${n}d20 ${perNome(p)}`).join(', '):`${k} ${typeof v==='object'?JSON.stringify(v):v}`).filter(Boolean).join(' · ');
  const lembretes=[];
  r.pods.forEach(({p,d})=>{if(d.acao)lembretes.push(`<button class="btn sm" data-act="usarPoder" data-id="${p.uid}">${h(d.nome)}</button>`)});
  return `<div class="sec"><div class="sec-h"><h2>Bônus ativos</h2><div class="row"><button class="btn sm" data-act="bonusNovo">+ Bônus temporário</button><button class="btn sm ghost" data-act="fimCena">Fim de cena</button><button class="btn sm ghost" data-act="fimMissao">Fim de missão</button></div></div>
   <p class="hint">Um lembrete de tudo que está valendo agora. Bônus numéricos já entram nas contas; dados de bônus (como +1d6 de Ler) aparecem no resultado das rolagens para você somar com um clique.</p></div>
  <div class="sec"><div class="sec-h"><h2>Dados de bônus</h2></div>
   ${grp('dado').length?`<div class="cards">${grp('dado').map(b=>`<div class="card"><h4>${h(b.nome)} <span class="badge acc">${b.usos}× ${h(b.valor)}</span><span class="row"><button class="btn sm ghost danger" data-act="rmBonus" data-id="${b.uid}">✕</button></span></h4>
      <div class="meta"><span>${b.qualquer?'Qualquer perícia':b.attrs?'Testes de '+b.attrs.join(', '):'Qualquer teste'}</span>${b.max?`<span>Máximo ${b.max} (${r.A[b.max]})</span>`:''}<span>${DUR[b.dur]||''}</span></div>
      <div class="row"><button class="btn sm acc" data-act="useBonus" data-id="${b.uid}" ${b.usos>0?'':'disabled'}>Rolar ${h(b.valor)} e gastar</button><button class="btn sm" data-act="bonusUsos" data-id="${b.uid}" data-d="-1">−</button><button class="btn sm" data-act="bonusUsos" data-id="${b.uid}" data-d="1">+</button></div></div>`).join('')}</div>`:'<p class="hint">Nenhum. Ler (+1d6 em Int/Pre, até seu Intelecto) e Exercitar-se (+1d6 em Agi/For/Vig, até seu Vigor) vêm do Interlúdio.</p>'}</div>
  <div class="sec"><div class="sec-h"><h2>Efeitos de rituais e itens</h2></div>
   ${r.ef.naoAcumula.length?`<div class="alert"><p><b>Não acumulam:</b> rituais que dão bônus ao mesmo alvo (o agente ou a arma) na mesma coisa não se somam; vale só o maior. “+X em todos os testes” conta como a mesma coisa que “+X no ataque” ou numa perícia. Bônus em alvos diferentes (Arma Atroz na arma + Ódio Incontrolável no agente) ou em coisas diferentes (margem, Defesa, dano em dados) continuam somando, assim como equipamentos e poderes.</p>${r.ef.naoAcumula.map(z=>`<p>• ${h(nomeStat(z.stat))}: vale ${h(valStat(z.stat,z.vale.v))} de <b>${h(z.vale.nome)}</b>; ${h(valStat(z.stat,z.ignorado.v))} de ${h(z.ignorado.nome)} ignorado.</p>`).join('')}</div>`:''}
   ${grp('efeito').length?`<div class="cards">${grp('efeito').map(b=>`<div class="card"><h4>${h(b.nome)}<span class="row"><button class="btn sm ghost danger" data-act="rmBonus" data-id="${b.uid}">✕</button></span></h4>
      <div class="meta"><span>${h(efTxt(b.ef))}</span></div>${(()=>{const ig=r.ef.naoAcumula.filter(z=>z.ignorado.nome===b.nome);return ig.length?`<p class="warnline">Não acumula em ${ig.map(z=>h(nomeStat(z.stat))).join(', ')} (vale ${ig.map(z=>h(z.vale.nome)).join(', ')}).</p>`:''})()}${b.ef&&b.ef.attr&&String(b.ef.attr).includes('|')?`<div class="row">${String(b.ef.attr).split('|').map(a=>`<button class="btn sm" aria-pressed="${(b.attrEscolhido||String(b.ef.attr).split('|')[0])===a}" data-act="efAttr" data-id="${b.uid}" data-a="${a}">${a}</button>`).join('')}</div>`:''}${durSel(idx(b),b.dur)}</div>`).join('')}</div>`:'<p class="hint">Rituais conjurados em você mesmo (Armadura de Sangue, Aprimorar Físico…) aparecem aqui e somam na ficha até o fim da cena.</p>'}</div>
  <div class="sec"><div class="sec-h"><h2>Bônus fixos temporários</h2></div>
   ${grp('fixo').length?grp('fixo').map(b=>{const i=idx(b);return `<div class="modrow" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr) 70px minmax(0,1fr) auto"><input class="inp" data-f="bonus.${i}.nome" value="${h(b.nome)}" aria-label="Nome"><select class="inp" data-f="bonus.${i}.alvo" data-r>${modAlvos().map(([k,l])=>opt(k,l,b.alvo)).join('')}</select><input class="inp num" type="number" data-f="bonus.${i}.valor" data-num data-r value="${h(b.valor)}"> ${durSel(i,b.dur)}<button class="btn sm ghost danger" data-act="rmBonus" data-id="${b.uid}">✕</button></div>`}).join(''):'<p class="hint">Use “+ Bônus temporário” para algo como “+2 Defesa até o fim da cena”.</p>'}</div>
  <div class="sec"><div class="sec-h"><h2>Também valendo</h2></div>
   <div class="chips">${[...r.conds.values()].filter(x=>Object.keys(x.c.efeitos||{}).length).map(x=>`<span class="chip warn" title="${h(x.c.desc)}">${h(x.c.nome)}</span>`).join('')}
   ${r.aliados.map(({d})=>`<span class="chip ok">${h(d.nome)}: ${h(d.bonus)}</span>`).join('')}
   ${f.formaSuprema?'<span class="chip ok">Forma suprema: +20 PV, +10 PE, +10 Defesa, +5 testes e DT</span>':''}
   ${f.inventario.filter(i=>i.equipado&&(i.bonusPericia||i.rd)).map(i=>`<span class="chip">${h(i.nome)}${i.bonusPericia?': '+(typeof i.bonusPericia==='number'?`+${i.bonusPericia} ${perNome(i.pericia||'?')}`:Object.entries(i.bonusPericia).map(([k,v])=>`+${v} ${perNome(k)}`).join(', ')):''}</span>`).join('')}</div>
   ${lembretes.length?`<p class="hint">Poderes com uso rápido: ${lembretes.join(' ')}</p>`:''}</div>`;
}
function paneNotas(f){
  const ta=(k,l)=>fld(l,`<textarea class="inp" data-f="${k}" rows="5">${h(f[k])}</textarea>`);
  return `<div class="grid g2">${ta('historia','História')}${ta('aparencia','Aparência')}${ta('personalidade','Personalidade')}${ta('anotacoes','Anotações da missão')}</div>`;
}

/* ============================== MESA (fontes e regras) ============================== */
function renderMesa(){
  const t=S.mesaTab;const tabs=[['fontes','Livros e suplementos'],['regras','Regras opcionais'],['auto','Automação']];
  let body='';
  if(t==='fontes'){
    const pk=pacotesHB();
    body=`<p class="hint">Ligue os livros e suplementos usados na sua mesa. Origens, classes, trilhas, poderes, rituais, itens, aliados e regras de cada um só aparecem quando ele está ligado. Vale para todas as fichas.</p>
     <div class="toggles">${D.fontes.map(x=>tgl(`fonte-${x.id}`,x.nome,x.desc,fonteOn(x.id),x.fixa?'disabled':`data-act="tglFonte" data-id="${x.id}"`,x.sigla,contaFonte(x.id))).join('')}</div>
     <div class="sec-h" style="margin-top:8px"><h2>Pacotes de homebrew</h2></div>
     ${pk.length?`<div class="toggles">${pk.map(p=>tgl('pk-'+slug(p),p,'Conteúdo criado na aba Homebrew.',pacoteOn(p),`data-act="tglPacote" data-id="${h(p)}"`,'★',HB_TYPES.reduce((s,[k])=>s+(S.hb[k]||[]).filter(x=>(x.pacote||'Minha mesa')===p).length,0))).join('')}</div>`:'<p class="hint">Você ainda não criou homebrew. Na aba Homebrew, cada criação pertence a um pacote com nome; os pacotes aparecem aqui para ligar e desligar.</p>'}`;
  }else if(t==='regras'){
    const grupos={};D.regras.forEach(x=>{if(!fonteOn(x.fonte))return;(grupos[x.fonte]=grupos[x.fonte]||[]).push(x)});
    body=`<p class="hint">Regras marcadas como “sempre” são novos usos de perícia que só listamos para referência. As demais mudam cálculos ou liberam botões quando ligadas (por exemplo, Determinação troca PE e Sanidade por PD).</p>`+
     Object.entries(grupos).map(([fid,list])=>`<div class="sec-h" style="margin-top:6px"><h2>${h(FONTE(fid).nome)}</h2></div><div class="toggles">${list.map(x=>x.sempre?tgl('r-'+x.id,x.nome,x.desc,true,'disabled','sempre'):
       tgl('r-'+x.id,x.nome,x.desc,regraOn(x.id),`data-act="tglRegra" data-id="${x.id}"`,x.efeito?'automático':'referência',x.requer?'Complementa: '+regraRotulo(x.requer):'')).join('')}</div>`).join('');
  }else{
    const a=S.cfg.auto;
    body=`<div class="toggles">
     ${tgl('a-cp','Custo do Paranormal automático','Ao conjurar, rola Ocultismo (DT 20 + custo) e desconta a Sanidade (ou PD) perdida, incluindo a perda permanente ao falhar por 5 ou mais.',a.custoParanormal,'data-act="tglAuto" data-id="custoParanormal"')}
     ${tgl('a-tr','Transcender automático','Poderes paranormais escolhidos com “Transcender” reduzem a Sanidade máxima (ou os PD) do agente.',a.transcender,'data-act="tglAuto" data-id="transcender"')}
     ${tgl('a-ml','Lembrete do preço das maldições','Ao rolar um teste do atributo ligado a um item amaldiçoado equipado, mostra um botão para descontar 2 de Sanidade por maldição se falhar.',a.maldicao,'data-act="tglAuto" data-id="maldicao"')}
     ${tgl('a-dm','Aviso de dano massivo','Ao perder metade ou mais dos PV de uma vez, lembra do teste de Fortitude.',a.massivo,'data-act="tglAuto" data-id="massivo"')}
    </div>
    <div class="grid g4" style="margin-top:10px">${fld('Ações por interlúdio',`<input class="inp num" type="number" min="1" max="6" data-cfg="acoesInterludio" value="${+S.cfg.acoesInterludio||2}">`)}</div>`;
  }
  return `<div class="sheet"><div class="sheet-head"><div class="name"><span class="eyebrow">Configuração da campanha</span><h2 class="bigh">Mesa</h2></div></div>
   <div class="tabs" role="tablist">${tabs.map(([k,l])=>`<button class="tab" role="tab" aria-selected="${t===k}" data-act="mesaTab" data-v="${k}">${l}</button>`).join('')}</div>
   <div class="pane">${body}</div></div>`;
}
function regraRotulo(id){const y=D.regras.find(z=>z.id===id);return y?`${y.nome} (${FONTE(y.fonte).sigla})`:id}
function contaFonte(id){const n=['origens','trilhas','poderes','rituais','itens'].reduce((s,k)=>s+(D[k]||[]).filter(x=>x.fonte===id).length,0);return n+' itens'}
function tgl(id,nome,desc,on,attrs,tag='',extra=''){
  return `<label class="tgl ${on?'on':''}" for="${id}"><input type="checkbox" id="${id}" ${on?'checked':''} ${attrs}><span class="sw" aria-hidden="true"></span><span class="tx"><span class="tl-h"><b>${h(nome)}</b>${tag?` <span class="badge">${h(tag)}</span>`:''}${extra?` <span class="badge acc">${h(extra)}</span>`:''}</span><small>${h(desc)}</small></span></label>`}
