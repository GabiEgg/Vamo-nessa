/* ============================== CAMPANHA (servidor) ==============================
   Só existe quando o app roda no servidor próprio com login. O mestre cria a campanha e
   passa o código; cada jogador liga as fichas que quiser. Só o mestre vê as fichas ligadas. */
async function carregarMesas(){
  if(!(S.conta&&S.conta.usuario))return;
  try{S.mesas=await Api.req('GET','/api/mesas')}catch(e){S.mesas=[]}
  render();
}
const mesaAtual=()=>(S.mesas||[]).find(m=>m.id===S.mesaAberta);
async function abrirMesa(id){
  S.mesaAberta=id;S.mesaDados=null;S.mesaEventos=[];S.mesaUltimo=0;render();
  await atualizarMesa(true);
}
async function atualizarMesa(fichasTambem){
  const m=mesaAtual();if(!m||m.papel!=='mestre')return;let mudou=false;
  try{
    if(fichasTambem||!S.mesaDados){const d=await Api.req('GET',`/api/mesas/${encodeURIComponent(m.id)}/fichas`);const k=JSON.stringify(d);if(k!==S._mesaKey){S._mesaKey=k;S.mesaDados=d;mudou=true}}
    const ev=await Api.req('GET',`/api/mesas/${encodeURIComponent(m.id)}/eventos?depois=${S.mesaUltimo||0}`);
    if(ev.length){S.mesaEventos=ev.concat(S.mesaEventos||[]).slice(0,50);S.mesaUltimo=ev[0].id;mudou=true;
      if(S._mesaPrimeira)toast(`Novo aviso: ${ev[0].agente||ev[0].usuario} usou ${ev[0].ritual||'um ritual'}.`)}
    S._mesaPrimeira=true;
  }catch(e){if(e.status===404){S.mesaAberta=null;mudou=true}}
  if(mudou&&S.view==='campanha'&&!document.activeElement.closest('.camp-form'))render();
}
/* Atualiza sozinho a cada 6 s enquanto o mestre está com a campanha aberta (fichas a cada 30 s). */
let _tickMesa=0;
setInterval(()=>{if(S.view==='campanha'&&S.mesaAberta&&document.visibilityState==='visible'){_tickMesa++;atualizarMesa(_tickMesa%5===0)}},6000);

function renderCampanha(){
  const ms=S.mesas||[];const m=mesaAtual();
  const lista=ms.length?`<div class="cards">${ms.map(x=>`<div class="card ${x.id===S.mesaAberta?'on-camp':''}"><h4>${h(x.nome)} <span class="badge ${x.papel==='mestre'?'acc':''}">${x.papel==='mestre'?'Mestre':'Jogador'}</span></h4>
     <div class="meta"><span>Mestre: ${h(x.mestre)}</span>${x.codigo?`<span>Código: <b class="codigo">${h(x.codigo)}</b></span>`:''}</div>
     <div class="row">${x.papel==='mestre'?`<button class="btn sm ${x.id===S.mesaAberta?'pri':'acc'}" data-act="mesaAbrir" data-id="${h(x.id)}">${x.id===S.mesaAberta?'Aberta':'Abrir painel'}</button>
       <button class="btn sm" data-act="mesaCopiar" data-v="${h(x.codigo)}">Copiar código</button>
       ${S.confirm==='mesaDel:'+x.id?`<span class="confirm">Excluir a campanha? <button class="btn sm danger" data-act="mesaExcluir" data-id="${h(x.id)}">Excluir</button><button class="btn sm" data-act="cancel">Cancelar</button></span>`:`<button class="btn sm ghost danger" data-act="mesaDel" data-id="${h(x.id)}">Excluir</button>`}`
      :`<span class="hint">Ligue suas fichas a esta campanha no Dossiê de cada agente.</span><button class="btn sm ghost danger" data-act="mesaSair" data-id="${h(x.id)}">Sair</button>`}</div></div>`).join('')}</div>`
    :'<p class="hint">Você ainda não está em nenhuma campanha.</p>';
  const forms=`<div class="grid g2 camp-form">
     <div class="card"><h4>Sou o mestre</h4><p>Crie a campanha e passe o código para os jogadores.</p><div class="row"><input class="inp" id="mesa-nome" placeholder="Nome da campanha" maxlength="80" style="flex:1 1 160px"><button class="btn acc" data-act="mesaCriar">Criar</button></div></div>
     <div class="card"><h4>Sou jogador</h4><p>Digite o código que o mestre passou.</p><div class="row"><input class="inp" id="mesa-codigo" placeholder="Código (ex.: K7Q2PM)" maxlength="12" style="flex:1 1 160px;text-transform:uppercase"><button class="btn acc" data-act="mesaEntrar">Entrar</button></div></div></div>`;
  return `<div class="sheet"><div class="sheet-head"><div class="name"><span class="eyebrow">Mesa compartilhada</span><h2 class="bigh">Campanha</h2></div></div>
   <div class="pane"><div class="sec"><div class="sec-h"><h2>Suas campanhas</h2></div>${lista}${forms}
    <p class="hint">Jogadores só veem as próprias fichas. O mestre vê as fichas que cada jogador ligar à campanha, em modo somente leitura, e recebe os avisos de rituais.</p></div>
   ${m&&m.papel==='mestre'?painelMestre(m):''}</div></div>`;
}
function painelMestre(m){
  const d=S.mesaDados;if(!d)return `<div class="sec"><div class="sec-h"><h2>${h(m.nome)}</h2></div><p class="hint">Carregando…</p></div>`;
  const jog=d.membros.filter(x=>x.papel!=='mestre');
  const cards=d.fichas.map((x,i)=>{const f=migrar(clone(x.ficha));let r;try{r=calc(f)}catch(e){r=null}const c=r&&r.c;
    const bar=(k,l,col)=>r&&r[k+'Max']?`<div class="mini-vit" style="--c:var(--${col})"><span>${l} ${r[k]}/${r[k+'Max']}</span><div class="bar"><i style="width:${Math.max(0,Math.min(100,r[k]/r[k+'Max']*100))}%"></i></div></div>`:'';
    const conds=r?[...r.conds.values()].map(z=>z.c.nome):[];
    return `<div class="card"><h4>${h(f.nome)} <span class="badge">${h(x.usuario)}</span></h4>
      <div class="meta"><span>${c?h(c.nome):'Sem classe'}</span><span>${c&&c.estagios?'Estágio '+f.estagio:'NEX '+f.nex+'%'}</span>${r?`<span>Defesa ${r.defesa}</span><span>DT ${r.dt}</span>`:''}</div>
      ${r?bar('pv','PV','pv')+bar('pe',r.det?'PD':'PE','pe')+(r.det?'':bar('san','SAN','san')):''}
      ${conds.length?`<div class="chips">${conds.map(n=>`<span class="cond">${h(n)}</span>`).join('')}</div>`:''}
      <div class="row"><button class="btn sm" data-act="verFicha" data-i="${i}">Ver ficha</button><span class="hint">atualizada ${new Date(x.atualizado).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</span></div></div>`}).join('');
  const avisos=(S.mesaEventos||[]).map(e=>`<div class="aviso"><div class="meta"><span>${new Date(e.criado).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</span><span>${h(e.agente||e.usuario)}</span>${e.elemento?elBadge(e.elemento):''}</div>
     <b>${h(e.ritual||'Ritual')} → ${h(e.alvo||'')}</b><span class="dt">DT ${h(e.dt)}</span><p>${h(avisoTexto(e))}</p>${e.alcance||e.duracao?`<p class="hint">${[e.alcance&&'Alcance '+e.alcance,e.duracao&&'Duração '+e.duracao].filter(Boolean).map(h).join(' · ')}</p>`:''}</div>`).join('');
  return `<div class="sec"><div class="sec-h"><h2>${h(m.nome)}</h2><span class="hint">Código ${h(m.codigo)} · ${jog.length} jogador${jog.length===1?'':'es'}</span><div class="row"><button class="btn sm" data-act="mesaAtualizar">Atualizar</button></div></div>
    <div class="camp-grid"><div class="sec"><h3 class="eyebrow">Agentes</h3>${cards?`<div class="cards">${cards}</div>`:`<div class="empty">Nenhuma ficha ligada ainda. ${jog.length?'Peça aos jogadores para escolher esta campanha no Dossiê de cada agente.':'Passe o código <b>'+h(m.codigo)+'</b> para os jogadores.'}</div>`}</div>
    <div class="sec"><h3 class="eyebrow">Avisos de rituais</h3>${avisos?`<div class="avisos">${avisos}</div>`:'<p class="hint">Quando um jogador conjurar um ritual em alguém, aparece aqui o que rolar: teste de resistência, DT e efeito.</p>'}</div></div></div>`;
}
