/* ============================== HOMEBREW ============================== */
const MOD_APLICA={arma:'Qualquer arma',corpo:'Arma corpo a corpo',fogo:'Arma de fogo ou disparo',municao:'Munição',protecao:'Proteção',acessorio:'Acessório',granada:'Granada',medicamento:'Medicamento'};
const HB_SCHEMA={
 origens:[['nome','Nome'],['pericias','Perícias treinadas','perlist'],['poderNome','Nome do poder'],['poderDesc','Descrição do poder','area'],['mods','Modificadores','mods']],
 classes:[['nome','Nome'],['desc','Descrição','area'],['pvBase','PV iniciais (+VIG)','num'],['pvNex','PV por NEX (+VIG)','num'],['peBase','PE iniciais (+PRE)','num'],['peNex','PE por NEX (+PRE)','num'],
   ['sanBase','SAN inicial','num'],['sanNex','SAN por NEX','num'],['periciasFixas','Perícias fixas','perlist'],['periciasEscolha','Escolhas de perícia (ex.: Luta|Pontaria; Fortitude|Reflexos)'],
   ['periciasLivres','Perícias livres (+INT)','num'],['grau','Graus de treinamento em NEX 35/70 (+INT)','num'],['ritInicial','Rituais iniciais','num'],['ritNex','Rituais por NEX','num'],['proficiencias','Proficiências','area'],['habilidades','Habilidades de classe','habs']],
 trilhas:[['nome','Nome'],['classe','Classe','classe'],['desc','Descrição','area'],['habilidades','Habilidades da trilha','habs']],
 poderes:[['nome','Nome'],['tipo','Tipo','tipoPoder'],['elemento','Elemento','elem'],['prereq','Pré-requisitos'],['desc','Descrição','area'],['afinidade','Com afinidade (opcional)','area'],['mods','Modificadores','mods']],
 rituais:[['nome','Nome'],['elemento','Elemento','elem'],['circulo','Círculo','circ'],['execucao','Execução'],['alcance','Alcance'],['alvo','Alvo / área'],['duracao','Duração'],['resistencia','Resistência'],['desc','Efeito','area'],['discente','Discente (custo extra e efeito)','area'],['verdadeiro','Verdadeiro (custo extra e efeito)','area'],['dano','Dano (ex.: 3d6)'],['danoD','Dano discente'],['danoV','Dano verdadeiro'],['tipoDano','Tipo de dano']],
 itens:[['nome','Nome'],['tipo','Tipo','tipoItem'],['cat','Categoria','cat'],['esp','Espaços','num'],['elemento','Elemento (itens amaldiçoados)','elem'],['dano','Dano (ex.: 2d6+2)'],['critico','Crítico (ex.: 19/x3)'],['alcance','Alcance','alc'],['forma','Forma (corpo, fogo, disparo)'],['tipoDano','Tipo de dano'],['proficiencia','Proficiência'],['defesa','Bônus de Defesa','num'],['desc','Descrição','area'],['mods','Modificadores (quando equipado)','mods']],
 modificacoes:[['nome','Nome'],['aplica','Aplica-se a','aplica'],['maldicao','É uma maldição','bool'],['elemento','Elemento da maldição','elem'],['desc','Efeito','area']],
 aliados:[['nome','Nome'],['desc','Descrição','area'],['bonus','Bônus (texto)','area'],['habilidade','Habilidade (texto)','area'],['habPE','Custo da habilidade (PE)','num'],['habDado','Dado da habilidade (ex.: 1d8)'],['habCura','Cura da habilidade (ex.: 1d8+1)']],
 condicoes:[['nome','Nome'],['tipo','Tipo','tipoCond'],['desc','Descrição','area'],['efeitos.defesa','Modificador de Defesa','num'],['efeitos.dados.todos','Dados em todos os testes (ex.: −1)','num'],['efeitos.custoPE','PE extra por habilidade','num'],['danoTurno','Dano no início do turno (ex.: 1d6)']],
 pericias:[['nome','Nome'],['attr','Atributo','attr'],['somenteTreinada','Somente treinada','bool'],['carga','Sofre penalidade de carga','bool']]};
const HB_DEFAULT={origens:{pericias:[],poderNome:'',poderDesc:'',mods:[]},classes:{pvBase:16,pvNex:3,peBase:3,peNex:3,sanBase:16,sanNex:4,periciasFixas:[],periciasEscolha:'',periciasLivres:4,grau:3,ritInicial:0,ritNex:0,proficiencias:'',desc:'',habilidades:[]},
 trilhas:{classe:'',desc:'',habilidades:[{nex:10,nome:'',desc:''},{nex:40,nome:'',desc:''},{nex:65,nome:'',desc:''},{nex:99,nome:'',desc:''}]},poderes:{tipo:'geral',elemento:'',prereq:'',desc:'',afinidade:'',mods:[]},
 rituais:{elemento:'',circulo:1,execucao:'Padrão',alcance:'',alvo:'',duracao:'',resistencia:'',desc:'',discente:'',verdadeiro:''},itens:{tipo:'geral',cat:0,esp:1,dano:'',critico:'',alcance:'',tipoDano:'',proficiencia:'',defesa:0,desc:'',mods:[]},
 modificacoes:{aplica:'arma',maldicao:false,elemento:'',desc:'',efeitos:{}},aliados:{desc:'',bonus:'',habilidade:'',habPE:1},condicoes:{tipo:'',desc:'',efeitos:{}},pericias:{attr:'INT',somenteTreinada:false,carga:false}};
const HB_NOVO={origens:'origem',classes:'classe',trilhas:'trilha',poderes:'poder',rituais:'ritual',itens:'item',modificacoes:'modificação',aliados:'aliado',condicoes:'condição',pericias:'perícia'};
const hbCur=()=>S.hbSel&&(S.hb[S.hbType]||[]).find(x=>x.id===S.hbSel);

function renderHB(){
  const t=S.hbType;const hbl=S.hb[t]||[];const q=slug(S.hbQ);
  const baseAll=(D[t]||[]).filter(b=>!hbl.some(x=>x.id===b.id));const base=q?baseAll.filter(x=>slug(x.nome).includes(q)):baseAll;
  const cur=hbCur();const baseSel=!cur&&S.hbSel&&(D[t]||[]).find(b=>b.id===S.hbSel);
  const grupos={};base.slice(0,400).forEach(x=>(grupos[x.fonte]=grupos[x.fonte]||[]).push(x));
  return `<div class="sheet"><div class="sheet-head"><div class="name"><span class="eyebrow">Conteúdo da sua mesa</span><h2 class="bigh">Homebrew</h2></div>
   <div class="row"><button class="btn sm" data-act="exportHB">Exportar pacotes</button><button class="btn sm" data-act="importar">Importar pacote</button></div></div>
   <div class="tabs" role="tablist">${HB_TYPES.map(([k,l])=>`<button class="tab" role="tab" aria-selected="${t===k}" data-act="hbType" data-v="${k}">${l}${(S.hb[k]||[]).length?` (${S.hb[k].length})`:''}</button>`).join('')}</div>
   <div class="pane"><div class="hb-layout"><div class="sec">
     <button class="btn pri" data-act="hbNew">+ Criar ${HB_NOVO[t]}</button>
     <input class="inp" id="hb-q" placeholder="Buscar no catálogo…" value="${h(S.hbQ)}">
     <div class="hb-list"><div class="grp">Seu homebrew</div>${hbl.length?hbl.map(x=>`<button data-act="hbSel" data-id="${h(x.id)}" aria-current="${S.hbSel===x.id}"><span>${h(x.nome||'Sem nome')}</span><span class="badge ${pacoteOn(x.pacote)?'hb':''}">${h(x.pacote||'Minha mesa')}</span>${(D[t]||[]).some(b=>b.id===x.id)?'<span class="badge acc">ajuste</span>':''}</button>`).join(''):'<p class="hint" style="padding:4px 8px;margin:0">Nada criado ainda.</p>'}
      ${Object.entries(grupos).map(([fid,list])=>`<div class="grp">${h(FONTE(fid).sigla)}${fonteOn(fid)?'':' · desligado'}</div>${list.map(x=>`<button data-act="hbSel" data-id="${h(x.id)}" aria-current="${S.hbSel===x.id}"><span>${h(x.nome)}</span></button>`).join('')}`).join('')}</div></div>
    <div class="sec">${cur?hbForm(t,cur):baseSel?hbBaseView(t,baseSel):`<div class="empty">Crie um conteúdo novo ou selecione algo do catálogo para ver e ajustar.<br>Tudo que você cria fica num <b>pacote</b> com nome, que pode ser ligado e desligado na aba Mesa e exportado para outras pessoas.</div>`}</div>
   </div></div></div>`;
}
function hbBaseView(t,x){
  const lines=HB_SCHEMA[t].map(([k,l])=>{let v=getPath(x,k);if(v==null||v===''||(Array.isArray(v)&&!v.length))return '';
    if(k==='habilidades')v=v.map(hh=>`${hh.nex}: ${hh.nome}${hh.desc?' — '+hh.desc:''}`).join('\n');else if(k==='mods')v=v.map(m=>sgn(+m.valor)+' '+alvoNome(m.alvo)).join(', ');
    else if(k==='pericias'||k==='periciasFixas')v=v.map(perNome).join(', ');else if(k==='elemento')v=ELEM[v];else if(k==='classe')v=(byId('classes',v)||{}).nome||v;
    else if(typeof v==='boolean')v=v?'Sim':'Não';else if(typeof v==='object')v=JSON.stringify(v);
    return `<div class="fld"><span>${h(l)}</span><div style="white-space:pre-wrap">${h(v)}</div></div>`}).join('');
  return `<div class="sec-h"><h2>${h(x.nome)}</h2>${fonteBadge(x)||'<span class="badge">livro base</span>'}<div class="row"><button class="btn acc sm" data-act="hbOverride" data-id="${h(x.id)}">Ajustar para minha mesa</button><button class="btn sm" data-act="hbClone" data-id="${h(x.id)}">Usar como modelo</button></div></div>
   <div class="grid">${lines}</div><p class="hint">“Ajustar” cria uma versão sua que substitui esta nas fichas (enquanto o pacote estiver ligado). “Usar como modelo” cria um conteúdo novo a partir dela.</p>`;
}
function hbForm(t,x){
  const isOver=(D[t]||[]).some(b=>b.id===x.id);const pk=pacotesHB();
  const fields=HB_SCHEMA[t].map(([k,l,ty])=>{const v=getPath(x,k);const id=`hb-${k.replace(/\./g,'-')}`;
    switch(ty){
     case 'area':return fld(l,`<textarea class="inp" id="${id}" data-h="${k}" rows="3">${h(v)}</textarea>`,'span2');
     case 'num':return fld(l,`<input class="inp num" id="${id}" type="number" data-h="${k}" data-num value="${h(v??'')}">`);
     case 'bool':return `<label class="row" style="font-size:13px"><input type="checkbox" id="${id}" data-h="${k}" ${v?'checked':''}> ${h(l)}</label>`;
     case 'elem':return fld(l,`<select class="inp" id="${id}" data-h="${k}" data-r>${Object.entries(ELEM).map(([a,b])=>opt(a,a?b:'Nenhum / varia',v)).join('')}</select>`);
     case 'circ':return fld(l,`<select class="inp" id="${id}" data-h="${k}" data-num data-r>${[1,2,3,4].map(n=>opt(n,n+'º ('+CUSTO_CIRC[n]+' PE)',v)).join('')}</select>`);
     case 'cat':return fld(l,`<select class="inp" id="${id}" data-h="${k}" data-num data-r>${CAT_NOME.slice(0,5).map((n,i)=>opt(i,n,v)).join('')}</select>`);
     case 'attr':return fld(l,`<select class="inp" id="${id}" data-h="${k}" data-r>${ATTR.map(a=>opt(a,ATTR_NOME[a],v)).join('')}</select>`);
     case 'alc':return fld(l,`<select class="inp" id="${id}" data-h="${k}" data-r>${opt('','—',v)}${Object.entries(ALCANCE).map(([a,b])=>opt(a,b,v)).join('')}</select>`);
     case 'aplica':return fld(l,`<select class="inp" id="${id}" data-h="${k}" data-r>${Object.entries(MOD_APLICA).map(([a,b])=>opt(a,b,v)).join('')}</select>`);
     case 'tipoCond':return fld(l,`<select class="inp" id="${id}" data-h="${k}" data-r>${Object.entries(TIPO_COND).map(([a,b])=>opt(a,b,v)).join('')}</select>`);
     case 'tipoItem':return fld(l,`<select class="inp" id="${id}" data-h="${k}" data-r>${Object.entries(TIPO_ITEM).map(([a,b])=>opt(a,b,v)).join('')}</select>`);
     case 'classe':return fld(l,`<select class="inp" id="${id}" data-h="${k}" data-r>${opt('','Escolha…',v)}${cat('classes').map(c=>opt(c.id,c.nome,v)).join('')}</select>`);
     case 'tipoPoder':return fld(l,`<select class="inp" id="${id}" data-h="${k}" data-r>${opt('geral','Geral (qualquer classe)',v)}${opt('paranormal','Paranormal',v)}${cat('classes').map(c=>opt(c.id,'Classe: '+c.nome,v)).join('')}</select>`);
     case 'perlist':return `<div class="fld span2"><span>${h(l)}</span><div class="checks">${pericias().map(p=>`<label><input type="checkbox" data-act="hbPer" data-k="${k}" data-id="${p.id}" ${(v||[]).includes(p.id)?'checked':''}> ${h(p.nome)}</label>`).join('')}</div></div>`;
     case 'mods':return `<div class="fld span2"><span>${h(l)}</span><div class="grid" style="gap:6px">${(v||[]).map((m,i)=>modRow('h',i,m)).join('')}<div><button class="btn sm" data-act="hbModAdd">+ Modificador</button> <span class="hint">Somados automaticamente na ficha (ex.: +2 Defesa, +1 PV por nível).</span></div></div></div>`;
     case 'habs':return `<div class="fld span2"><span>${h(l)}</span><div class="grid" style="gap:6px">${(v||[]).map((hh,i)=>`<div class="subrow"><input class="inp num" type="number" data-h="${k}.${i}.nex" data-num value="${h(hh.nex)}" aria-label="NEX"><input class="inp" data-h="${k}.${i}.nome" value="${h(hh.nome)}" placeholder="Nome da habilidade"><button class="btn sm ghost danger" data-act="hbHabDel" data-i="${i}" aria-label="Remover">✕</button><textarea class="inp full" data-h="${k}.${i}.desc" rows="2" placeholder="Descrição">${h(hh.desc)}</textarea></div>`).join('')}<div><button class="btn sm" data-act="hbHabAdd">+ Habilidade</button> <span class="hint">O primeiro campo é o NEX (%) em que ela é liberada.</span></div></div></div>`;
     default:return fld(l,`<input class="inp" id="${id}" data-h="${k}" value="${h(v??'')}">`);
    }}).join('');
  return `<div class="sec-h"><h2 data-d="hbNome">${h(x.nome||'Sem nome')}</h2>${isOver?'<span class="badge acc">ajuste de conteúdo oficial</span>':'<span class="badge hb">homebrew</span>'}
    <div class="row">${S.confirm==='hbDel'?`<span class="confirm">${isOver?'Restaurar o original?':'Excluir?'} <button class="btn sm danger" data-act="hbDelOk">${isOver?'Restaurar':'Excluir'}</button><button class="btn sm" data-act="cancel">Cancelar</button></span>`:`<button class="btn sm danger" data-act="hbDel">${isOver?'Restaurar original':'Excluir'}</button>`}</div></div>
   <div class="grid g2">${fld('Pacote (nome do homebrew)',`<input class="inp" data-h="pacote" list="pk-list" value="${h(x.pacote||'Minha mesa')}"><datalist id="pk-list">${pk.map(p=>`<option value="${h(p)}">`).join('')}</datalist>`)}${fields}</div>
   <p class="hint">Salvo automaticamente. O pacote aparece na aba Mesa, onde pode ser ligado ou desligado para todas as fichas.</p>`;
}

/* ============================== GUIA ============================== */
function renderGuia(){
  const s=(t,body)=>`<div class="sec"><div class="sec-h"><h2>${t}</h2></div>${body}</div>`;
  return `<div class="sheet"><div class="sheet-head"><div class="name"><span class="eyebrow">Como usar</span><h2 class="bigh">Guia</h2></div></div><div class="pane guia">
  ${s('Começando',`<ol><li>Na aba <b>Mesa</b>, ligue os livros e suplementos da sua campanha (Sobrevivendo ao Horror e cada Arquivo Secreto aparecem pelo nome) e as regras opcionais que vocês usam.</li>
   <li>Em <b>Fichas</b>, crie um agente e preencha o Dossiê: origem, classe, NEX, trilha e atributos (botões + e − na estrela).</li>
   <li>Perícias, Habilidades, Rituais e Inventário calculam bônus sozinhos. Clique no dado (${D20}) para rolar.</li></ol>`)}
  ${s('Vida, esforço e sanidade',`<p>A faixa de estado no topo da ficha está sempre visível. No campo de cada barra, digite e aperte <b>Enter</b>:</p>
   <ul><li><code>-15</code> ou só <code>15</code> perde 15 · <code>+8</code> recupera 8 · <code>=20</code> define o valor · <code>-2d6</code> rola o dano para você.</li>
   <li>Os pontos <b>temporários</b> (campo “temp”) são gastos primeiro e somem no <b>Fim de cena</b>.</li>
   <li>Chegar a 0 PV marca <i>morrendo</i>; abaixo de metade da Sanidade, <i>perturbado</i>; com 0, <i>enlouquecendo</i>. Use os contadores de turno.</li></ul>`)}
  ${s('Condições',`<p>“+ Condição” liga e desliga qualquer condição. Penalidades em dados, Defesa e deslocamento entram nas contas na hora; condições que incluem outras (agarrado → desprevenido e imóvel) ligam as demais; ficar abalado duas vezes vira apavorado. Em chamas e sangrando ganham um botão de dano no início do turno.</p>`)}
  ${s('Mudanças automáticas',`<ul><li><b>Transcender:</b> ao adicionar um poder paranormal por “+ Transcender”, a Sanidade máxima daquele NEX é retirada (ou os PD, com Determinação). Desmarque se o poder veio de outra fonte.</li>
   <li><b>Conjurar:</b> desconta PE, aplica penalidades de condições e faz o teste do Custo do Paranormal; rituais de Medo sempre cobram Sanidade.</li>
   <li><b>Itens amaldiçoados:</b> modificações e maldições sobem a categoria, e o resultado de testes ligados a elas oferece o preço da maldição.</li>
   <li><b>Aliados ativos</b> somam bônus de perícia e dados. Afinidade ativa os efeitos extras dos poderes do mesmo elemento.</li></ul>`)}
  ${s('Interlúdio e Bônus',`<p>Na aba <b>Interlúdio</b>, escolha as ações (dormir, alimentar-se, exercitar, ler, relaxar…) e as opções de cada uma, depois clique em <b>Concluir interlúdio</b>. O app recupera PV, PE e Sanidade pela condição de descanso e guarda bônus como +1d6 de Ler. Poderes que criam novas ações (Meditação Ocultista, Ensaio, Sintonização) aparecem ali.</p>
   <p>A aba <b>Bônus</b> lembra tudo que está valendo: dados de interlúdio (com botão para rolar e gastar), efeitos de rituais em você, bônus temporários que você criar, aliados e itens. Os dados guardados também aparecem no resultado de cada rolagem compatível.</p>`)}
  ${s('Rituais em outros personagens',`<p>Em “Conjurar…”, escolha o alvo: você, um aliado/NPC da sua ficha ou um inimigo. Fora de você, aparece o cartão <b>Para o mestre</b> com a DT, o teste de resistência e o efeito. O dano só é rolado pelo app se você marcar “Rolar o dano para mim”; deixe desmarcado para rolar os dados na mesa.</p>`)}
  ${s('Campanha (servidor próprio)',`<ol><li>Disponível quando o app roda no servidor com login. O mestre abre <b>Campanha</b>, cria uma e passa o código.</li>
   <li>Cada jogador entra com o código e, no Dossiê de cada agente, escolhe a campanha no campo <b>Campanha</b>.</li>
   <li>Só o mestre vê as fichas ligadas (somente leitura), com PV, PE, Sanidade e condições, e recebe os avisos de rituais com DT e teste de resistência. Jogadores continuam vendo só as próprias fichas.</li></ol>`)}
  ${s('Aliados e NPCs',`<p>Adicione aliados do catálogo (Acólito, Mascarados, Pássaros, animais…) ou crie NPCs com PV, Defesa, ataque e dano. NPCs aceitam o mesmo campo de dano rápido.</p>`)}
  ${s('Homebrew',`<ol><li>Na aba <b>Homebrew</b>, escolha o tipo (origem, classe, trilha, poder, ritual, item, modificação, aliado, condição, perícia) e clique em <b>Criar</b>.</li>
   <li>Dê um nome de <b>pacote</b> (ex.: “Campanha do Ricardo”). Cada pacote vira um interruptor na aba Mesa.</li>
   <li>Use <b>Modificadores</b> para que o conteúdo mude números da ficha (+2 Defesa, +1 PV por nível, +5 em Furtividade).</li>
   <li>Para mudar algo oficial, selecione-o no catálogo e clique em <b>Ajustar para minha mesa</b>: sua versão substitui a original enquanto o pacote estiver ligado.</li>
   <li><b>Exportar pacotes</b> gera um arquivo que outra pessoa importa em “Importar”.</li></ol>`)}
  ${s('Imagens',`<p>Quem pode editar este artifact pode anexar uma imagem a qualquer item (em Detalhes) ou retrato a NPCs. Marque “usar em todo item com esse nome” para que todas as fichas mostrem a mesma imagem.</p>`)}
  ${s('Seus dados',`<p>As fichas ficam salvas na sua conta (ou neste navegador, se a conta não estiver disponível). Use “Exportar backup completo” de vez em quando.</p>`)}
  <p class="hint">Os textos de regras são resumos para consulta rápida. Para o texto completo, consulte os livros.</p></div></div>`;
}

/* ============================== MODAIS ============================== */
let pickState={type:null,q:'',all:false,ctx:null};
function openPick(type,ctx=null){pickState={type,q:'',all:false,ctx};renderPick()}
function modal(titulo,body,extraHead=''){
  document.getElementById('modal').innerHTML=`<div class="modal" data-act="closeModal"><div class="modal-box" role="dialog" aria-modal="true" aria-label="${h(titulo)}">
   <div class="modal-h"><h3>${h(titulo)}</h3>${extraHead}<button class="btn sm" data-act="closeModal">Fechar</button></div>${body}</div></div>`;
}
function renderPick(){
  const f=F();const r=calc(f);const {type,q,all,ctx}=pickState;const qq=slug(q);
  let list,src=type;
  if(type==='transcender'){src='poderes';list=cat('poderes').filter(p=>p.tipo==='paranormal')}
  else if(type==='mods'){src='modificacoes';const it=f.inventario[ctx];list=cat('modificacoes').filter(m=>all||aplicaMod(m,it))}
  else list=cat(type);
  if(type==='poderes'&&!all){const tg=new Set(D.extras.tornarGeral||[]);list=list.filter(p=>p.tipo==='geral'||p.tipo===f.classe||(tg.has(p.id)&&fonteOn('sah')))}
  if(type==='rituais'&&!all)list=list.filter(x=>+x.circulo<=r.circ&&(!x.trilha||true));
  if(qq)list=list.filter(x=>slug(x.nome+' '+(x.desc||'')+' '+(x.poderDesc||'')+' '+(x.bonus||'')).includes(qq));
  // filtros por círculo/elemento (rituais) e tipo (itens)
  const elsX=x=>(x.elementos||[x.elemento]).filter(Boolean);
  if(type==='rituais'){const base=list;list=list.filter(x=>(!pickState.fc||+x.circulo===+pickState.fc)&&(!pickState.fe||(pickState.fe==='_'?!elsX(x).length:elsX(x).includes(pickState.fe))));pickState._base=base}
  if(type==='itens'){pickState._base=list;list=list.filter(x=>!pickState.ft||x.tipo===pickState.ft)}
  const has=x=>(src==='poderes')?f.poderes.some(p=>p.ref===x.id)&&!x.repetivel:type==='rituais'?f.rituais.includes(x.id):type==='aliados'?(f.aliados||[]).some(a=>a.ref===x.id):false;
  const titulo={poderes:'Adicionar poder',transcender:'Transcender: poder paranormal',rituais:'Aprender ritual',itens:'Adicionar item',aliados:'Adicionar aliado',mods:'Modificação ou maldição'}[type];
  const filtroL={poderes:'Mostrar poderes de outras classes',rituais:'Mostrar círculos acima do permitido',mods:'Mostrar todas'}[type]||'';
  const sub=x=>src==='poderes'?`${tipoPoderNome(x.tipo)}${x.prereq?' · '+x.prereq:''}`:type==='rituais'?`${x.circulo}º círculo · ${CUSTO_CIRC[x.circulo]} PE`:type==='aliados'?`Bônus: ${x.bonus}`:type==='mods'?`${MOD_APLICA[x.aplica]||x.aplica}${x.maldicao?' · maldição (+II/+I categoria)':' · +I categoria'}`:`${TIPO_ITEM[x.tipo]||x.tipo} · Cat. ${CAT_NOME[x.cat]} · ${x.esp} esp.${x.dano?' · '+x.dano+' '+(x.critico||''):''}${x.defesa?' · Defesa +'+x.defesa:''}`;
  const ordenar=(a,b)=>String(a.nome).localeCompare(b.nome,'pt');
  let grupo=null;
  if(type==='rituais'){grupo=x=>[+x.circulo,x.circulo+'º círculo · '+CUSTO_CIRC[x.circulo]+' PE'];list=list.slice().sort((a,b)=>+a.circulo-+b.circulo||ordEl(a.elemento)-ordEl(b.elemento)||ordenar(a,b))}
  else if(type==='itens'){grupo=x=>[(ORD_TIPO.indexOf(x.tipo)+99)%99,TIPO_ITEM[x.tipo]||x.tipo];list=list.slice().sort((a,b)=>grupo(a)[0]-grupo(b)[0]||+a.cat-+b.cat||ordenar(a,b))}
  else if(type==='transcender'){grupo=x=>[ordEl(x.elemento),x.elemento?ELEM[x.elemento]:'Qualquer elemento'];list=list.slice().sort((a,b)=>ordEl(a.elemento)-ordEl(b.elemento)||ordenar(a,b))}
  else if(src==='poderes'){const ord=t=>t===f.classe?0:t==='geral'?1:t==='paranormal'?3:2;grupo=x=>[ord(x.tipo),tipoPoderNome(x.tipo)];list=list.slice().sort((a,b)=>ord(a.tipo)-ord(b.tipo)||String(a.tipo).localeCompare(b.tipo)||ordenar(a,b))}
  const lim=list.slice(0,300);
  const filtros=type==='rituais'?`<div class="chips filtros" style="padding:0 14px"><span class="eyebrow">Círculo</span>${['',1,2,3,4].map(c=>`<button class="btn sm" aria-pressed="${String(pickState.fc||'')===String(c)}" data-act="pickF" data-k="fc" data-v="${c}">${c?c+'º':'Todos'}</button>`).join('')}
     <span class="eyebrow" style="margin-left:8px">Elemento</span>${['','sangue','morte','conhecimento','energia','medo','_'].map(e=>`<button class="btn sm ${e&&e!=='_'?'el el-'+e:''}" aria-pressed="${(pickState.fe||'')===e}" data-act="pickF" data-k="fe" data-v="${e}">${e===''?'Todos':e==='_'?'Varia':ELEM[e]}</button>`).join('')}</div>`
   :type==='itens'?`<div class="chips filtros" style="padding:0 14px"><button class="btn sm" aria-pressed="${!pickState.ft}" data-act="pickF" data-k="ft" data-v="">Todos</button>${ORD_TIPO.filter(t=>(pickState._base||[]).some(x=>x.tipo===t)).map(t=>`<button class="btn sm" aria-pressed="${pickState.ft===t}" data-act="pickF" data-k="ft" data-v="${t}">${TIPO_ITEM[t]}</button>`).join('')}</div>`:'';
  let ultimo=null;
  const cab=x=>{if(!grupo)return '';const [k,l]=grupo(x);const key=k+'|'+l;if(key===ultimo)return '';ultimo=key;return `<div class="grp">${h(l)}</div>`};
  modal(titulo,`<div class="modal-h" style="padding-top:8px"><input class="inp" id="pick-q" placeholder="Buscar…" value="${h(q)}" style="flex:1 1 200px">${filtroL?`<label class="row" style="font-size:12px;gap:4px"><input type="checkbox" id="pick-all" ${all?'checked':''}> ${filtroL}</label>`:''}</div>
   ${type==='transcender'?`<p class="hint" style="padding:0 14px">O poder entra marcado como Transcender: −${r.det?((D.extras.classesExtra[f.classe]||{}).pdNex||0)+' PD':(r.c?r.c.sanNex:0)+' SAN'} máximos.</p>`:''}
   ${filtros}
   <div class="modal-b">${lim.length?lim.map(x=>cab(x)+`<button class="pick ${has(x)?'has':''}" data-act="pickAdd" data-id="${h(x.id)}"><b>${h(x.nome)} ${elBadge(x.elemento)} ${fonteBadge(x)}${has(x)?' <span class="badge">já adicionado</span>':''}</b><span class="meta">${h(sub(x))}</span>${x.desc?`<p>${h(x.desc)}</p>`:''}${x.afinidade?`<p><i>Afinidade:</i> ${h(x.afinidade)}</p>`:''}</button>`).join('')+(list.length>300?`<p class="hint">Mostrando 300 de ${list.length}. Refine a busca.</p>`:''):'<div class="empty">Nada encontrado. Verifique as fontes ligadas na aba Mesa ou crie o que falta em Homebrew.</div>'}</div>`);
  const qi=document.getElementById('pick-q');qi.focus();qi.setSelectionRange(q.length,q.length);
}
function condModal(){
  const f=F();const r=calc(f);const g={};cat('condicoes').filter(c=>!c.auto).forEach(c=>(g[c.tipo||'']=g[c.tipo||'']||[]).push(c));
  modal('Condições',`<div class="modal-b"><p class="hint" style="margin:0">Clique para ligar ou desligar. Condições automáticas (machucado, morrendo, perturbado, enlouquecendo) seguem PV e Sanidade.</p>
   ${Object.entries(TIPO_COND).filter(([k])=>g[k]).map(([k,l])=>`<div class="grp">${h(l)}</div><div class="condgrid">${g[k].map(c=>{const on=(f.condicoes||[]).some(x=>x.id===c.id);const inc=!on&&r.conds.has(c.id);
     return `<button class="condbtn ${on?'on':''}" data-act="condTgl" data-id="${c.id}" aria-pressed="${on}" title="${h(c.desc)}"><b>${h(c.nome)}</b>${inc?' <small>(já incluída)</small>':''}<span>${h(c.desc)}</span></button>`}).join('')}</div>`).join('')}</div>`);
}
function castModal(id){
  const f=F();const r=calc(f);const x=byId('rituais',id);const custo=CUSTO_CIRC[+x.circulo]||0;
  const dis=x.discente?(String(x.discente).match(/\+(\d+)\s*PE/)||[])[1]:null;const ver=x.verdadeiro?(String(x.verdadeiro).match(/\+(\d+)\s*PE/)||[])[1]:null;
  const temEf=x.ef||x.efD||x.efV;const pode=n=>{const m=String(n==='d'?x.discente:x.verdadeiro).match(/Requer (\d)º/);return !m||+m[1]<=r.circ};
  modal('Conjurar '+x.nome,`<div class="modal-b">
   <div class="meta"><span>${x.circulo}º círculo</span><span>DT ${r.dt}</span>${x.duracao?`<span>${h(x.duracao)}</span>`:''}</div>
   <div class="row" role="radiogroup" aria-label="Forma">${[['n','Normal',custo],dis&&['d','Discente',custo+ +dis],ver&&['v','Verdadeiro',custo+ +ver]].filter(Boolean).map(([k,l,c],i)=>`<label class="btn sm"><input type="radio" name="forma" value="${k}" data-c="${c}" ${i?'':'checked'} ${k!=='n'&&!pode(k)?'disabled':''}> ${l} · ${c+r.custoExtra} ${r.det?'PD':'PE'}</label>`).join('')}</div>
   ${r.custoExtra?`<p class="hint">Inclui +${r.custoExtra} por condição (alquebrado).</p>`:''}
   <fieldset class="alvos"><legend class="eyebrow">Alvo</legend>
    ${temEf||/pessoal|voc[eê]/i.test(x.alvo||'')?`<label><input type="radio" name="alvo" value="eu" ${temEf?'checked':''}> Em mim${temEf?' (o efeito vai para a aba Bônus)':''}</label>`:''}
    ${(f.aliados||[]).map((a,i)=>`<label><input type="radio" name="alvo" value="npc:${i}"> ${h(a.nome)}${+a.pvMax?` <span class="hint">(${a.pv??a.pvMax}/${a.pvMax} PV)</span>`:''}</label>`).join('')}
    <label><input type="radio" name="alvo" value="outro" ${temEf?'':'checked'}> Inimigo ou outro personagem <input class="inp sm" id="cast-alvo-nome" placeholder="nome (opcional)" style="width:min(200px,100%)"></label>
   </fieldset>
   ${x.dano||(x.ef&&x.ef.cura)?`<label class="row" style="gap:6px"><input type="checkbox" id="cast-rolar"> Rolar o ${x.dano?'dano':'efeito'} para mim (${h(x.dano||x.ef.cura)}${x.danoD?' / discente '+h(x.danoD):''}${x.danoV?' / verdadeiro '+h(x.danoV):''}) — deixe desmarcado para rolar na mesa</label>`:''}
   <p class="hint" style="margin:0">Fora de você, o app mostra um cartão “Para o mestre” com a DT ${r.dt}${x.resistencia?', o teste de '+h(x.resistencia):''} e o efeito.</p>
   ${f.mesa&&S.conta&&S.conta.usuario?`<label class="row" style="gap:6px"><input type="checkbox" id="cast-avisar" checked> Avisar o mestre da campanha</label>`:''}
   ${x.elemento!=='medo'?`<label class="row" style="gap:6px"><input type="checkbox" id="cast-cp" ${S.cfg.auto.custoParanormal?'checked':''}> Fazer o teste do Custo do Paranormal (Ocultismo DT 20 + custo)</label>`:`<p class="hint">Ritual de Medo: perde Sanidade igual ao custo e 1 (discente 2, verdadeiro 3) permanente.</p>`}
   ${regraOn('reter_ritual')&&/cena/i.test(x.duracao||'')?`<label class="row" style="gap:6px"><input type="checkbox" id="cast-ret"> Reter ritual (PE ficam presos; perde 1 SAN)</label>`:''}
   <div class="row"><button class="btn acc" data-act="castGo" data-id="${x.id}">Conjurar</button></div></div>`);
}
async function showExport(titulo,nome,obj){
  const txt=JSON.stringify(obj,null,2);let dl=null;try{if(window.claude&&window.claude.use)dl=await window.claude.use('downloads')}catch(e){dl=null}
  modal(titulo,`<div class="modal-b"><p class="hint" style="margin:0">Guarde ou compartilhe este texto. Ele pode ser colado em “Importar” em qualquer navegador.</p><textarea class="inp" id="exp-txt" rows="16" style="font-family:var(--f-mono);font-size:12px" readonly>${h(txt)}</textarea></div>`,
   `${dl?`<button class="btn acc sm" id="dl-btn">Baixar .json</button>`:''}<button class="btn sm" id="cp-btn">Copiar</button>`);
  document.getElementById('cp-btn').onclick=()=>{const ta=document.getElementById('exp-txt');navigator.clipboard.writeText(txt).then(()=>toast('Copiado.'),()=>{ta.select();toast('Selecionado. Use Ctrl+C para copiar.')})};
  const db=document.getElementById('dl-btn');if(db)db.onclick=()=>dl.save({filename:nome,data:txt}).then(()=>toast('Arquivo salvo.'),e=>{if(e&&e.code!=='declined')toast('Não foi possível baixar. Use Copiar.')});
}
function showImport(){
  modal('Importar',`<div class="modal-b"><p class="hint" style="margin:0">Aceita uma ficha, um pacote de homebrew ou um backup completo exportados por este app (versão antiga também).</p>
   <input type="file" id="imp-file" accept=".json,application/json"><textarea class="inp" id="imp-txt" rows="10" placeholder="…ou cole o JSON aqui" style="font-family:var(--f-mono);font-size:12px"></textarea>
   <div class="row"><button class="btn pri" id="imp-go">Importar</button><span class="hint" id="imp-msg"></span></div></div>`);
  document.getElementById('imp-file').onchange=e=>{const file=e.target.files[0];if(!file)return;const rd=new FileReader();rd.onload=()=>{document.getElementById('imp-txt').value=rd.result};rd.readAsText(file)};
  document.getElementById('imp-go').onclick=()=>{try{const msg=importar(JSON.parse(document.getElementById('imp-txt').value));closeModal();render();toast(msg)}catch(e){document.getElementById('imp-msg').textContent='Não reconheci esse conteúdo. Confira se o JSON está completo.'}};
}
function contaModal(){
  const c=S.conta;
  if(c.usuario){modal('Conta',`<div class="modal-b"><p style="margin:0">Conectado como <b>${h(c.usuario)}</b>. Fichas, homebrew, configurações da mesa e imagens ficam salvos no servidor.</p>
    <div class="row"><button class="btn danger" data-act="sair">Sair desta conta</button></div><p class="hint" style="margin:0">Ao sair, a cópia guardada neste navegador é apagada (bom para computadores compartilhados).</p></div>`);return}
  modal('Entrar',`<form class="modal-b" id="login-form" autocomplete="on">
    <p class="hint" style="margin:0">Entre para salvar suas fichas no servidor e abri-las em qualquer aparelho.${c.cadastro?' Ainda não tem conta? Escolha um nome e uma senha e clique em “Criar conta”: as fichas deste navegador vão junto para a conta nova.':''}</p>
    ${fld('Usuário','<input class="inp" id="lg-u" name="username" autocomplete="username" required minlength="3" maxlength="32">')}
    ${fld('Senha','<input class="inp" id="lg-s" name="password" type="password" autocomplete="current-password" required minlength="6">')}
    <div class="row"><button class="btn pri" type="submit" data-modo="entrar">Entrar</button>${c.cadastro?'<button class="btn" type="submit" data-modo="cadastrar">Criar conta</button>':''}<span class="hint" id="lg-msg" role="alert"></span></div></form>`);
  const form=document.getElementById('login-form');document.getElementById('lg-u').focus();
  form.addEventListener('submit',async e=>{e.preventDefault();const modo=(e.submitter&&e.submitter.dataset.modo)||'entrar';const msg=document.getElementById('lg-msg');msg.textContent='…';
    try{const r=await Api.req('POST','/api/'+modo,{usuario:document.getElementById('lg-u').value,senha:document.getElementById('lg-s').value});
      S.conta.usuario=r.usuario;S.assets=Api.assets;closeModal();await Store.carregar(Api.colecao());carregarMesas();toast(modo==='cadastrar'?'Conta criada. Suas fichas agora ficam no servidor.':'Bem-vindo de volta, '+r.usuario+'.')}
    catch(err){msg.textContent=err.message}});
}
function closeModal(){document.getElementById('modal').innerHTML=''}
function importar(o){
  const mergeHB=hb=>{let n=0;HB_TYPES.forEach(([k])=>(hb[k]||[]).forEach(x=>{if(!x||!x.id)return;const arr=S.hb[k]=S.hb[k]||[];const i=arr.findIndex(y=>y.id===x.id);if(i>=0)arr[i]=x;else arr.push(x);n++}));saveHB();return n};
  const addF=f=>{if(!f||!f.atributos)throw 0;const nf=migrar(f);delete nf._exemplo;S.fichas[nf.id]=nf;S.active=nf.id;Store.touch('f-'+nf.id)};
  if(o.tipo==='ficha'){addF(o.ficha);const n=o.homebrew?mergeHB(o.homebrew):0;S.view='ficha';return `Ficha importada${n?` com ${n} itens de homebrew`:''}.`}
  if(o.tipo==='homebrew'){const n=mergeHB(o.homebrew);return `${n} itens de homebrew importados. Confira os pacotes na aba Mesa.`}
  if(o.tipo==='backup'){Object.values(o.fichas||{}).forEach(addF);const n=mergeHB(o.homebrew||{});if(o.cfg){S.cfg={...cfgPadrao(),...o.cfg};saveCfg()}S.view='ficha';return `Backup restaurado: ${Object.keys(o.fichas||{}).length} fichas e ${n} itens de homebrew.`}
  if(o.atributos){addF(o);return 'Ficha importada.'}
  throw 0;
}
function hbUsadoPor(f){const out=emptyHB();const push=(k,id)=>{const x=(S.hb[k]||[]).find(y=>y.id===id);if(x&&!out[k].includes(x))out[k].push(x)};
  push('origens',f.origem);push('classes',f.classe);push('trilhas',f.trilha);f.poderes.forEach(p=>push('poderes',p.ref));f.rituais.forEach(id=>push('rituais',id));
  f.inventario.forEach(i=>{push('itens',i.ref);(i.modsAplicadas||[]).forEach(m=>push('modificacoes',m))});(f.aliados||[]).forEach(a=>push('aliados',a.ref));(f.condicoes||[]).forEach(c=>push('condicoes',c.id));
  (S.hb.pericias||[]).forEach(p=>out.pericias.push(p));return out}
