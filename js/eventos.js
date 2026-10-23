/* ============================== EVENTOS ============================== */
function curaPV(f,expr,fonte){const r=calc(f);const x=rollExpr(expr,r.A);const v=Math.max(0,x.total);f.pv=Math.min(r.pvMax,r.pv+v);if(f.pv>0&&f.contadores)delete f.contadores.morrendo;return `${fonte}: +${f.pv-r.pv} PV${x.txt.includes('d')?' ('+x.txt+')':''}`}
function darTemp(f,k,expr,fonte){const r=calc(f);const x=rollExpr(expr,r.A);const v=Math.max(0,x.total);const tk=k+'Temp';const antes=+f[tk]||0;f[tk]=Math.max(antes,v);
  return `${fonte}: ${v} ${k==='pv'?'PV':r.det?'PD':'PE'} temporários${x.txt.includes('d')?' ('+x.txt+')':''}${antes>v?' (os atuais eram maiores; não acumulam)':''}`}
function upload(onDone){
  if(!S.assets){toast('Envio de imagens indisponível nesta visualização.');return}
  const fi=document.createElement('input');fi.type='file';fi.accept='image/png,image/jpeg,image/gif,image/webp';
  fi.onchange=async()=>{const file=fi.files[0];if(!file)return;toast('Enviando imagem…');
    try{const res=await S.assets.upload(file);onDone(res.id);toast('Imagem anexada.')}
    catch(e){toast(e&&e.code==='too_large'?'Imagem grande demais (máx. 20 MB).':e&&e.code==='unsupported_type'?'Use PNG, JPG, GIF ou WebP.':e&&e.code==='quota_or_state'?'Espaço de imagens cheio.':'Não foi possível enviar a imagem.')}};
  fi.click();
}
function concluirInterludio(f){
  const r=calc(f);const I=f.interludio;const lim=r.peLim;const out=[];const nm=r.det?'PD':'PE';
  const livre=id=>(id==='exercitar'&&r.flags.some(x=>x.exercitarGratis))||(id==='alimentar'&&r.flags.some(x=>x.alimentarGratis));
  const usadas=I.acoes.filter(a=>!livre(a.id)).length;if(usadas>(+S.cfg.acoesInterludio||2))out.push(`Atenção: ${usadas} ações (limite ${S.cfg.acoesInterludio||2}).`);
  f.bonus=(f.bonus||[]).filter(b=>b.dur!=='interludio');
  const acoes=acoesInterludio(f,r);const get=id=>I.acoes.find(a=>a.id===id);
  const optMult=(id,k)=>{const a=get(id);const def=acoes.find(x=>x.id===id);const o=def&&def.opcoes&&def.opcoes.find(x=>x.id===(a&&a.opcao))||(def&&def.opcoes||[]).find(x=>x.id==='normal');return o?(o.efeito||{})[k]:1};
  const passos=[0.5,1,2,3,4];const sobe=(m,n)=>passos[Math.max(0,Math.min(4,passos.indexOf(m)+n))]??m;
  const prato=(get('alimentar')||{}).opcao;let pv=0,pe=0,san=0,peTemp=0;
  if(get('alimentar'))out.push('Alimentou-se'+(prato?` (prato ${prato})`:''));
  if(get('dormir')){let m=optMult('dormir','dormir');
    if(r.flags.some(x=>x.descansoPior))m=sobe(m,-1);
    if(r.flags.some(x=>x.dormirD100)){const d=rnd(100);if(d<=50){m=sobe(m,-9);const s=rnd(4);san+=-s;out.push(`Terrores noturnos (${d}): descanso precário, −${s} SAN; escolha um poder ou ritual para usar uma vez.`)}else{pe+=2;out.push(`Bons sonhos (${d}): +2 ${nm}.`)}}
    pv+=Math.floor(lim*sobe(m,prato==='nutritivo'?1:0));if(!r.det)pe+=Math.floor(lim*sobe(m,prato==='energetico'?1:0));
    out.push(`Dormiu (×${m})`)}
  if(get('relaxar')){const m=optMult('relaxar','relaxar');const v=Math.floor(lim*m)+(+I.participantes||0);
    if(r.det){pe+=v;if(prato==='favorito')peTemp=2}else san+=v+(prato==='favorito'?2:0);out.push(`Relaxou (×${m})`)}
  if(get('meditar')){const m=optMult('meditar','meditar');pe+=Math.floor(2*lim*m);out.push('Meditou')}
  if(get('exercitar')){const dado=(r.flags.find(x=>x.exercitarDado)||{}).exercitarDado||'1d6';out.push(addBonusDado(f,{chave:'exercitar',nome:'Exercício',valor:dado,attrs:['AGI','FOR','VIG'],max:'VIG',dur:'missao'},r))}
  if(get('ler')){const fl=r.flags.find(x=>x.lerDado)||{};out.push(addBonusDado(f,{chave:'ler',nome:'Leitura',valor:fl.lerDado||'1d6',attrs:fl.lerQualquer?null:['INT','PRE'],qualquer:!!fl.lerQualquer,max:'INT',dur:'missao'},r))}
  if(prato==='rapido'){(f.bonus=f.bonus||[]).push({uid:uid(),tipo:'dado',nome:'Prato rápido (revisar caso)',valor:'+5',usos:1,dur:'interludio'})}
  if(get('ensaiar')){const k=f.nex>=99?4:f.nex>=65?3:f.nex>=40?2:1;f.bonus.push({uid:uid(),tipo:'efeito',ritual:false,nome:'Ensaio',ef:{margem:k},dur:'interludio'});out.push(`Ensaiou: +${k} na margem de ameaça`)}
  I.acoes.forEach(a=>{
    if(a.id.startsWith('pod_')){const d=byId('poderes',a.id.slice(4));if(d){const c=(d.interludio||{}).pe||0;if(c){pe-=c}f.bonus.push({uid:uid(),tipo:'efeito',ritual:false,nome:d.nome,ef:{},dur:'interludio'});out.push(`${d.nome}${c?` (−${c} ${nm})`:''}`)}}
    if(a.id.startsWith('item_')){const it=f.inventario.find(x=>'item_'+x.uid===a.id);if(it){const x=rollExpr(it.interludioPE,r.A);pe+=x.total;out.push(`${it.nome}: +${x.total} ${nm}`);it.qtd=(+it.qtd||1)-1;if(it.qtd<=0)f.inventario=f.inventario.filter(y=>y!==it)}}
    if(['revisar','manutencao','outra','estudar','transc_item','folga'].includes(a.id)){const def=acoes.find(x=>x.id===a.id);out.push((def?def.nome:a.id)+(a.nota?': '+a.nota:''))}
  });
  const cur=calc(f);
  if(pv)f.pv=Math.min(cur.pvMax,cur.pv+pv);if(pe)f.pe=Math.max(0,Math.min(cur.peMax,cur.pe+pe));if(san&&!cur.det)f.san=Math.max(0,Math.min(cur.sanMax,cur.san+san));if(peTemp)f.peTemp=Math.max(+f.peTemp||0,peTemp);
  const ganhos=[pv&&`+${f.pv-cur.pv} PV`,pe&&`${sgn(f.pe-cur.pe)} ${nm}`,san&&!cur.det&&`${sgn(f.san-cur.san)} SAN`,peTemp&&`+${peTemp} PD temporários`].filter(Boolean);
  const txt=out.map(x=>String(x).replace(/\.+$/,'')).join('. ')+(ganhos.length?'. Resultado: '+ganhos.join(', '):'')+'.';
  (f.interludios=f.interludios||[]).push({data:Date.now(),txt});f.interludios=f.interludios.slice(-30);
  f.interludio={acoes:[],participantes:0};saveF(f);toast(txt,6000);
}
function conjurar(f,id){
  const x=byId('rituais',id);const sel=document.querySelector('input[name="forma"]:checked')||{};const forma=sel.value||'n';
  const base=+((sel.dataset||{}).c)||CUSTO_CIRC[+x.circulo]||0;
  const val=nm=>(document.querySelector(`input[name="${nm}"]:checked`)||{}).value||'';
  const alvo=val('alvo')||'outro';const alvoNome=(document.getElementById('cast-alvo-nome')||{}).value||'';
  const marcado=idc=>{const el=document.getElementById(idc);return !!(el&&el.checked)};
  const r0=calc(f);const total=gastarPE(f,base,x.nome);if(total===false)return false;
  const nf=forma==='d'?' (discente)':forma==='v'?' (verdadeiro)':'';
  const msgs=[`${x.nome}${nf}: −${total} ${r0.det?'PD':'PE'}, DT ${r0.dt}`];
  if(x.elemento==='medo'){const perm=forma==='v'?3:forma==='d'?2:1;perderSan(f,total,perm);msgs.push(`Medo: −${total} ${r0.det?'PD':'SAN'} e −${perm} permanente`)}
  else if(marcado('cast-cp')){const p=r0.per.ocultismo;const roll=rollTest(`Custo do Paranormal (DT ${20+total})`,p.dados,p.bonus);
    if(roll.v<20+total){const perm=roll.v<=15+total?1:0;perderSan(f,total,perm);msgs.push(`Falhou no Custo do Paranormal: −${total} ${r0.det?'PD':'SAN'}${perm?' e −1 permanente':''}`)}else msgs.push('Passou no Custo do Paranormal')}
  const ef=forma==='v'?(x.efV||x.efD||x.ef):forma==='d'?(x.efD||x.ef):x.ef;
  const npcI=alvo.startsWith('npc:')?+alvo.slice(4):-1;const npc=npcI>=0?(f.aliados||[])[npcI]:null;
  const rolar=marcado('cast-rolar');
  if(alvo==='eu'&&ef){const e={...ef};
    if(e.pvTemp){msgs.push(darTemp(f,'pv',e.pvTemp,x.nome));delete e.pvTemp}
    if(e.cura){msgs.push(curaPV(f,e.cura,x.nome));delete e.cura}
    if(Object.keys(e).filter(k=>k!=='pvTempTipo').length)(f.bonus=f.bonus||[]).push({uid:uid(),tipo:'efeito',ritual:true,alvoEf:/arma|muni/i.test(x.alvo||'')?'arma':'agente',nome:x.nome+nf,ef:e,dur:'cena'});
    const sob=calc(f).ef.naoAcumula.filter(z=>z.ignorado.nome===x.nome+nf||z.vale.nome===x.nome+nf);
    if(sob.length)msgs.push('Não acumula com outro ritual: '+sob.map(z=>`${nomeStat(z.stat)} (vale ${valStat(z.stat,z.vale.v)} de ${z.vale.nome})`).join(', '))}
  if(marcado('cast-ret')){(f.retidos=f.retidos||[]).push({rit:id,pe:total});perderSan(f,1);msgs.push('Ritual retido (−1 SAN)')}
  const dano=forma==='v'?(x.danoV||x.danoD||x.dano):forma==='d'?(x.danoD||x.dano):x.dano;
  // Dano e cura só são rolados se a pessoa pedir; senão ficam como lembrete para rolar na mesa.
  if(rolar&&dano){const v=rollDano(`${x.nome}: dano${x.tipoDano?' de '+x.tipoDano:''}`,dano,r0.A);
    if(npc&&+npc.pvMax&&v!=null){npc.pv=(npc.pv??+npc.pvMax)-v;msgs.push(`${npc.nome}: −${v} PV (${npc.pv}/${npc.pvMax})`)}}
  if(rolar&&npc&&ef&&ef.cura&&+npc.pvMax){const c=rollExpr(ef.cura,r0.A).total;npc.pv=Math.min(+npc.pvMax,(npc.pv??+npc.pvMax)+c);msgs.push(`${npc.nome}: +${c} PV`)}
  // Resumo do que o mestre precisa rolar ou decidir.
  const quem=alvo==='eu'?f.nome+' (em si)':npc?npc.nome:(alvoNome||'alvo escolhido pelo mestre');
  const efeito=forma==='v'?x.verdadeiro:forma==='d'?x.discente:x.desc;
  const aviso={tipo:'ritual',agente:f.nome,ritual:x.nome+nf,elemento:x.elemento||'',alvo:quem,dt:r0.dt,resistencia:x.resistencia||'',efeito:efeito||'',
    dano:dano?dano+(x.tipoDano?' de '+x.tipoDano:''):'',alcance:x.alcance||'',duracao:x.duracao||''};
  if(alvo!=='eu')pushRoll({t:`Para o mestre: ${x.nome}${nf} → ${quem}`,v:'DT '+r0.dt,d:avisoTexto(aviso)});
  if(alvo!=='eu'&&marcado('cast-avisar')&&f.mesa&&S.conta&&S.conta.usuario)
    Api.req('POST','/api/mesas/'+encodeURIComponent(f.mesa)+'/eventos',aviso).then(()=>toast('O mestre foi avisado.')).catch(e=>toast('Não foi possível avisar o mestre: '+e.message));
  saveF(f);toast(msgs.join(' · '),6000);return true;
}
/* Texto curto do que o mestre rola: teste de resistência, DT e efeito. */
function avisoTexto(a){return [a.resistencia&&!/^\s*(—|-)?\s*$/.test(a.resistencia)?`${a.alvo}: teste de ${a.resistencia} contra DT ${a.dt}`:`${a.alvo}: sem teste de resistência`,
  a.dano?`Dano: ${a.dano}`:'',a.efeito?`Efeito: ${a.efeito}`:''].filter(Boolean).join(' · ')}
function usarItem(f,i){
  const it=f.inventario[i];const r=calc(f);const msgs=[];const a=it.acao||{};
  if(it.cura)msgs.push(curaPV(f,it.cura,it.nome));
  if(a.pvTemp)msgs.push(darTemp(f,'pv',a.pvTemp,it.nome));
  if(a.peTemp)msgs.push(darTemp(f,'pe',a.peTemp,it.nome));
  if(a.pe){const x=rollExpr(a.pe,r.A);const c=calc(f);f.pe=Math.min(c.peMax,c.pe+x.total);msgs.push(`${it.nome}: +${x.total} ${r.det?'PD':'PE'}`)}
  if(it.interludioPE){const x=rollExpr(it.interludioPE,r.A);const c=calc(f);f.pe=Math.min(c.peMax,c.pe+x.total);msgs.push(`${it.nome}: +${x.total} ${r.det?'PD':'PE'}`)}
  if(!msgs.length)msgs.push(`${it.nome} usado.`);
  if(it.consumivel||it.cura){it.qtd=(+it.qtd||1)-1;if(it.qtd<=0){f.inventario.splice(i,1);msgs.push('(acabou)')}}
  saveF(f);toast(msgs.join(' · '),5000);
}

document.addEventListener('click',e=>{
  const t=e.target.closest('[data-act]');if(!t)return;const a=t.dataset.act;
  if(a==='closeModal'){if(t.classList.contains('modal')&&e.target!==t)return;closeModal();return}
  if(t.tagName==='INPUT')return; /* checkboxes com data-act são tratados no change */
  const f=F();const ds=t.dataset;
  switch(a){
   case 'view':S.view=ds.v;S.confirm=null;S.alheia=null;if(ds.v==='campanha')carregarMesas();break;
   case 'contaMenu':contaModal();return;
   case 'mesaCriar':{const n=document.getElementById('mesa-nome').value.trim();if(!n){toast('Dê um nome para a campanha.');return}
     Api.req('POST','/api/mesas',{nome:n}).then(m=>{toast(`Campanha criada. Código para os jogadores: ${m.codigo}`,8000);return carregarMesas().then(()=>abrirMesa(m.id))}).catch(e=>toast(e.message));return}
   case 'mesaEntrar':{const c=document.getElementById('mesa-codigo').value.trim();if(!c)return;
     Api.req('POST','/api/mesas/entrar',{codigo:c}).then(m=>{toast(`Você entrou em “${m.nome}”. Ligue suas fichas a ela no Dossiê.`,6000);carregarMesas()}).catch(e=>toast(e.message));return}
   case 'mesaAbrir':abrirMesa(ds.id);return;
   case 'mesaAtualizar':atualizarMesa(true).then(render);return;
   case 'mesaCopiar':navigator.clipboard.writeText(ds.v).then(()=>toast('Código copiado.'),()=>toast('Código: '+ds.v));return;
   case 'mesaDel':S.confirm='mesaDel:'+ds.id;break;
   case 'mesaExcluir':Api.req('DELETE','/api/mesas/'+encodeURIComponent(ds.id)).then(()=>{S.confirm=null;if(S.mesaAberta===ds.id)S.mesaAberta=null;toast('Campanha excluída.');carregarMesas()}).catch(e=>toast(e.message));return;
   case 'mesaSair':Api.req('POST','/api/mesas/'+encodeURIComponent(ds.id)+'/sair').then(()=>{toast('Você saiu da campanha.');carregarMesas()}).catch(e=>toast(e.message));return;
   case 'verFicha':{const x=S.mesaDados.fichas[+ds.i];const fa=migrar(clone(x.ficha));fa._alheia=true;fa._dono=x.usuario;S.alheia=fa;S.view='ficha';S.tab='dossie';break}
   case 'voltarCampanha':S.alheia=null;S.view='campanha';break;
   case 'sair':Api.req('POST','/api/sair').catch(()=>{}).finally(()=>{try{localStorage.removeItem(LKEY)}catch(e){}location.reload()});return;
   case 'tab':S.tab=ds.v;S.confirm=null;break;
   case 'mesaTab':S.mesaTab=ds.v;break;
   case 'sel':S.alheia=null;S.active=ds.id;S.confirm=null;Store.saveLocal();break;
   case 'nova':{S.alheia=null;const n=novaFicha();S.fichas[n.id]=n;S.active=n.id;S.tab='dossie';S.view='ficha';saveF(n);break}
   case 'dup':{const n=clone(f);n.id=uid();n.nome=f.nome+' (cópia)';delete n._exemplo;S.fichas[n.id]=n;S.active=n.id;saveF(n);break}
   case 'del':S.confirm='del';break;
   case 'delOk':{const id=f.id;delete S.fichas[id];Store.touch('f-'+id);S.active=Object.keys(S.fichas)[0]||null;S.confirm=null;break}
   case 'cancel':S.confirm=null;break;
   case 'exportF':showExport('Exportar ficha',slug(f.nome||'ficha')+'.json',{tipo:'ficha',versao:2,ficha:(({_exemplo,...x})=>x)(f),homebrew:hbUsadoPor(f)});return;
   case 'backup':showExport('Backup completo','dossie-paranormal-backup.json',{tipo:'backup',versao:2,fichas:realFichas(),homebrew:S.hb,cfg:S.cfg});return;
   case 'exportHB':showExport('Pacotes de homebrew','homebrew-ordem.json',{tipo:'homebrew',versao:2,homebrew:S.hb});return;
   case 'importar':showImport();return;
   case 'attr':{const r=calc(f);const v=f.atributos[ds.a]+(+ds.d);const min=regraOn('atributos_negativos')?-3:0;
     if(v<min||v>r.attr.teto){toast(`Atributos vão de ${min} a ${r.attr.teto}.`);return}f.atributos[ds.a]=v;saveF();break}
   case 'descanso':f.pv=f.pe=f.san=null;f.condicoes=(f.condicoes||[]).filter(x=>!['morrendo','enlouquecendo','perturbado'].includes(x.id));f.contadores={};saveF();break;
   case 'fimCena':fimDeCena(f);toast('Fim de cena: temporários, contadores e bônus de cena encerrados.');break;
   case 'fimMissao':fimDeMissao(f);toast('Fim de missão: bônus de missão (Ler, Exercitar…) encerrados.');break;
   case 'zeraPerm':f.sanPerm=0;saveF();break;
   case 'escolha':f.escolhas[+ds.i]=f.escolhas[+ds.i]===ds.id?null:ds.id;saveF();break;
   case 'rollPer':{const r=calc(f);const p=pericias().find(x=>x.id===ds.id);const x=r.per[p.id];rollTest(`${f.nome}: ${p.nome}${x.bloq?' (exige treino)':''}`,x.dados,x.bonus,{attr:x.attr});return}
   case 'atk':{const it=f.inventario[+ds.i];const r=calc(f);const ai=armaInfo(it,r,f);rollTest(`Ataque: ${it.nome} (${ai.per==='luta'?'Luta':'Pontaria'}) · crítico ${ai.margem}/x${ai.mult}`,ai.dados,ai.atk,{attr:r.per[ai.per].attr,margem:ai.margem,arma:+ds.i});return}
   case 'dmg':{const it=f.inventario[+ds.i];const r=calc(f);rollDano(`Dano: ${it.nome}${it.tipoDano?' ('+it.tipoDano+')':''}`,danoExpr(armaInfo(it,r,f),false),r.A);return}
   case 'rollAct':{const roll=S.rolls[0];const ac=roll&&roll.acts[+ds.k];if(!ac)return;
     if(ac.a==='useBonus'){const b=(f.bonus||[]).find(x=>x.uid===ac.id);if(!b||b.usos<1)return;const x=rollExpr(b.valor);b.usos--;roll.v+=x.total;roll.d+=` + ${b.nome} ${x.txt}`;roll.acts.splice(+ds.k,1);saveF();renderRolls();if(S.tab==='bonus'||S.tab==='interludio')render();return}
     if(ac.a==='precoMald'){perderSan(f,2*ac.n);roll.acts.splice(+ds.k,1);saveF();toast(`Preço da maldição: −${2*ac.n} ${calc(f).det?'PD':'SAN'}.`);break}
     if(ac.a==='dmgFrom'){const it=f.inventario[ac.i];if(!it)return;const r=calc(f);rollDano(`${ac.crit?'Crítico':'Dano'}: ${it.nome}`,danoExpr(armaInfo(it,r,f),ac.crit),r.A);return}
     return}
   case 'clearRolls':S.rolls=[];renderRolls();return;
   case 'rollsTgl':S.rollsAbertos=!S.rollsAbertos;renderRolls();return;
   case 'modAdd':f.mods.push({alvo:'defesa',valor:1});saveF();break;
   case 'modDel':if(ds.scope==='f'){f.mods.splice(+ds.i,1);saveF()}else{hbCur().mods.splice(+ds.i,1);saveHB()}break;
   case 'pick':openPick(ds.type);return;
   case 'pickMod':openPick('mods',+ds.i);return;
   case 'pickF':pickState[ds.k]=ds.v;renderPick();return;
   case 'filtroRit':S.filtroRit=ds.v;break;
   case 'filtroInv':S.filtroInv=ds.v;break;
   case 'pickAdd':{const ty=pickState.type,id=ds.id;let nome='';
     if(ty==='poderes'||ty==='transcender'){const d=byId('poderes',id);if(d.id==='ger_transcender'){openPick('transcender');return}
       if(f.poderes.some(p=>p.ref===id)&&!d.repetivel){toast('Este poder já está na ficha.');return}
       f.poderes.push({uid:uid(),ref:id,transcender:d.tipo==='paranormal'&&S.cfg.auto.transcender});nome=d.nome;
       if(d.aliado)toast('Este poder concede um aliado: adicione-o na aba Aliados & NPCs.')}
     else if(ty==='rituais'){if(f.rituais.includes(id))return;f.rituais.push(id);nome=byId('rituais',id).nome}
     else if(ty==='aliados'){const d=byId('aliados',id);(f.aliados=f.aliados||[]).push({uid:uid(),ref:id,nome:d.nome,ativo:true,escolhas:[]});nome=d.nome}
     else if(ty==='mods'){const it=f.inventario[pickState.ctx];(it.modsAplicadas=it.modsAplicadas||[]).push(id);nome=byId('modificacoes',id).nome;closeModal();saveF();toast('Aplicado: '+nome);break}
     else{const it=itemFrom(byId('itens',id));f.inventario.push(it);nome=it.nome}
     saveF();toast('Adicionado: '+nome);renderPick();render();return}
   case 'rmPoder':f.poderes=f.poderes.filter(p=>p.uid!==ds.id);saveF();break;
   case 'usarPoder':{const p=f.poderes.find(x=>x.uid===ds.id);const d=byId('poderes',p.ref);const ac=d.acao||{};const msgs=[];
     if(ac.pe&&!isNaN(+ac.pe)){if(gastarPE(f,+ac.pe,d.nome)===false)return}
     if(ac.pvTemp)msgs.push(darTemp(f,'pv',ac.pvTemp,d.nome));if(ac.peTemp)msgs.push(darTemp(f,'pe',ac.peTemp,d.nome));if(ac.cura)msgs.push(curaPV(f,ac.cura,d.nome));
     saveF();toast(msgs.join(' · ')||d.nome+' usado.');break}
   case 'rmRit':f.rituais=f.rituais.filter(x=>x!==ds.id);saveF();break;
   case 'castModal':castModal(ds.id);return;
   case 'castGo':if(conjurar(f,ds.id))closeModal();break;
   case 'ritDano':{const x=byId('rituais',ds.id);rollDano(`${x.nome}: dano`,x.dano,calc(f).A);return}
   case 'soltarRet':f.retidos.splice(+ds.i,1);saveF();toast('Ritual solto: o máximo volta, o atual não.');break;
   case 'itemNovo':{const it={uid:uid(),ref:null,nome:'Item novo',tipo:'geral',cat:0,esp:1,qtd:1,equipado:false,dano:'',critico:'',alcance:'',tipoDano:'',defesa:0,notas:'',mods:[],modsAplicadas:[]};f.inventario.push(it);S.open[it.uid]=true;saveF();break}
   case 'rmItem':f.inventario.splice(+ds.i,1);saveF();break;
   case 'rmMod':f.inventario[+ds.i].modsAplicadas.splice(+ds.k,1);saveF();break;
   case 'usarItem':usarItem(f,+ds.i);break;
   case 'toggle':S.open[ds.id]=!S.open[ds.id];break;
   case 'imgUp':{const it=f.inventario[+ds.i];upload(id=>{it.img=id;if(it.ref&&S.cfg.imgs[it.ref]){S.cfg.imgs[it.ref]=id;saveCfg()}saveF();render()});return}
   case 'imgRm':{const it=f.inventario[+ds.i];it.img='';if(it.ref&&S.cfg.imgs[it.ref]){delete S.cfg.imgs[it.ref];saveCfg()}saveF();break}
   case 'npcNovo':{const n={uid:uid(),nome:'NPC',desc:'',pvMax:10,pv:null,defesa:10,atk:'',dano:'',notas:''};(f.aliados=f.aliados||[]).push(n);S.open[n.uid]=true;saveF();break}
   case 'rmNpc':f.aliados.splice(+ds.i,1);saveF();break;
   case 'npcImg':{const n=f.aliados[+ds.i];upload(id=>{n.img=id;saveF();render()});return}
   case 'habAliado':{const n=f.aliados[+ds.i];const d=byId('aliados',n.ref);const msgs=[];if(d.habPE&&gastarPE(f,+d.habPE,d.nome)===false)return;
     if(d.habDado)rollDano(`${d.nome}: ${d.habilidade.split(':')[0]}`,d.habDado);if(d.habCura)msgs.push(curaPV(f,d.habCura,d.nome));
     saveF();toast(msgs.join(' · ')||`${d.nome}: habilidade usada${d.habPE?` (−${d.habPE} PE)`:''}.`);break}
   case 'npcDmgGo':{const el=document.querySelector(`[data-npcdmg="${ds.i}"]`);npcDelta(f,+ds.i,el&&el.value);break}
   case 'npcAtk':{const n=f.aliados[+ds.i];rollTest(`${n.nome}: ataque`,1,+n.atk||0);return}
   case 'npcDano':{const n=f.aliados[+ds.i];rollDano(`${n.nome}: dano`,n.dano);return}
   case 'interToggle':{const I=f.interludio;const i=I.acoes.findIndex(x=>x.id===ds.id);if(i>=0)I.acoes.splice(i,1);else{const def=acoesInterludio(f,calc(f)).find(x=>x.id===ds.id);I.acoes.push({id:ds.id,opcao:def&&def.opcoes?(def.opcoes.find(o=>o.id==='normal')||def.opcoes[0]).id:null})}saveF();break}
   case 'interOpt':{const x=f.interludio.acoes.find(y=>y.id===ds.id);if(x)x.opcao=ds.o;saveF();break}
   case 'interConcluir':concluirInterludio(f);break;
   case 'bonusNovo':(f.bonus=f.bonus||[]).push({uid:uid(),tipo:'fixo',nome:'Bônus',alvo:'defesa',valor:2,dur:'cena'});saveF();break;
   case 'rmBonus':f.bonus=f.bonus.filter(b=>b.uid!==ds.id);saveF();break;
   case 'useBonus':{const b=f.bonus.find(x=>x.uid===ds.id);if(!b||b.usos<1)return;b.usos--;rollDano(`${b.nome} (restam ${b.usos})`,b.valor);saveF();break}
   case 'bonusUsos':{const b=f.bonus.find(x=>x.uid===ds.id);b.usos=Math.max(0,(+b.usos||0)+(+ds.d));saveF();break}
   case 'efAttr':{const b=f.bonus.find(x=>x.uid===ds.id);b.attrEscolhido=ds.a;saveF();break}
   case 'dmgGo':{const el=document.querySelector(`[data-dmg="${ds.k}"]`);if(!el||!el.value.trim())return;aplicarDelta(f,ds.k,el.value);break}
   case 'dmgMental':{const el=document.querySelector('[data-dmg="pe"]');if(!el||!el.value.trim()){toast('Digite o dano mental no campo de PD.');return}aplicarDelta(f,'pe',el.value,{mental:true,ignoraTemp:true});break}
   case 'cont':{const c=f.contadores=f.contadores||{};c[ds.id]=Math.max(0,(c[ds.id]||0)+(+ds.d));if(c[ds.id]>=3)toast(ds.id==='morrendo'?'Três turnos morrendo: o agente morre.':'Três turnos enlouquecendo: o agente fica insano.',6000);
     if(ds.id==='morrendo'&&c[ds.id]===2&&regraOn('lesoes'))toast('Lesões: Vigor DT 10 ou perde 1 ponto de atributo permanente.');saveF();break}
   case 'danoTurno':{const c=byId('condicoes',ds.id);aplicarDelta(f,'pv','-'+c.danoTurno);break}
   case 'insanidade':{const n=rnd(20);const txt=D.insanidade[n-1]||'';pushRoll({t:'Efeito de insanidade',v:n,d:txt});return}
   case 'medo':{const c=f.contadores=f.contadores||{};const a1=rnd(10),a2=rnd(10);const tot=Math.min(20,a1+a2+(c.medo||0));c.medo=(c.medo||0)+1;
     const ef=D.efeitosMedo.find(x=>x[0]===Math.max(2,tot));pushRoll({t:`Efeito de medo: ${ef[1]}`,v:tot,d:`2d10 [${a1}, ${a2}]${c.medo>1?' +'+(c.medo-1):''} · ${ef[2]}`});
     if(ef[3])addCond(f,ef[3]);saveF();break}
   case 'condModal':condModal();return;
   case 'condTgl':{const i=(f.condicoes||[]).findIndex(x=>x.id===ds.id);if(i>=0)f.condicoes.splice(i,1);else{const c=byId('condicoes',ds.id);addCond(f,ds.id,c.escolheAttr?{attr:'AGI'}:{})}saveF();condModal();render();return}
   case 'condOff':f.condicoes=f.condicoes.filter(x=>x.id!==ds.id);saveF();break;
   case 'condUp':{const c=byId('condicoes',ds.id);f.condicoes=f.condicoes.filter(x=>x.id!==ds.id);addCond(f,c.agrava);saveF();toast(`${c.nome} piorou para ${(byId('condicoes',c.agrava)||{}).nome||c.agrava}.`);break}
   case 'hbType':S.hbType=ds.v;S.hbSel=null;S.confirm=null;break;
   case 'hbSel':S.hbSel=ds.id;S.confirm=null;break;
   case 'hbNew':{const pk=(S.hb[S.hbType]||[]).slice(-1)[0];const x={id:'hb_'+uid(),nome:'',pacote:(pk&&pk.pacote)||pacotesHB()[0]||'Minha mesa',...clone(HB_DEFAULT[S.hbType])};if(S.hbType==='trilhas')x.classe=(F()&&F().classe)||'';S.hb[S.hbType].push(x);S.hbSel=x.id;saveHB();break}
   case 'hbOverride':case 'hbClone':{const b=D[S.hbType].find(x=>x.id===ds.id);const {fonte,...x}=clone(b);x.pacote=pacotesHB()[0]||'Minha mesa';if(a==='hbClone'){x.id='hb_'+uid();x.nome=b.nome+' (variante)'}S.hb[S.hbType].push(x);S.hbSel=x.id;saveHB();break}
   case 'hbDel':S.confirm='hbDel';break;
   case 'hbDelOk':{const id=S.hbSel;S.hb[S.hbType]=S.hb[S.hbType].filter(x=>x.id!==id);S.hbSel=(D[S.hbType]||[]).some(b=>b.id===id)?id:null;S.confirm=null;saveHB();break}
   case 'hbModAdd':{const x=hbCur();(x.mods=x.mods||[]).push({alvo:'defesa',valor:1});saveHB();break}
   case 'hbHabAdd':{const x=hbCur();(x.habilidades=x.habilidades||[]).push({nex:10,nome:'',desc:''});saveHB();break}
   case 'hbHabDel':hbCur().habilidades.splice(+ds.i,1);saveHB();break;
   default:return;
  }
  render();
});
function npcDelta(f,i,txt){const n=f.aliados[i];const s=String(txt||'').trim();if(!s)return;let modo='-',corpo=s;if(/^[=+\-]/.test(s)){modo=s[0];corpo=s.slice(1)}
  const v=Math.max(0,rollExpr(corpo).total);const cur=n.pv??+n.pvMax;n.pv=modo==='='?v:modo==='+'?Math.min(+n.pvMax,cur+v):cur-v;saveF();render();toast(`${n.nome}: ${n.pv}/${n.pvMax} PV`)}
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.id==='pick-q'){pickState.q=t.value;renderPick();return}
  if(t.id==='hb-q'){S.hbQ=t.value;render();const el=document.getElementById('hb-q');el.focus();el.setSelectionRange(t.value.length,t.value.length);return}
  if(t.dataset.inter){const x=F().interludio.acoes.find(y=>y.id===t.dataset.inter);if(x){x.nota=t.value;saveF()}return}
  if(t.dataset.f!=null&&!t.hasAttribute('data-r')&&t.type!=='checkbox'){bindF(t);refresh()}
  else if(t.dataset.h!=null&&!t.hasAttribute('data-r')&&t.type!=='checkbox'){bindH(t);if(t.dataset.h==='nome'){const n=document.querySelector('[data-d="hbNome"]');if(n)n.textContent=t.value||'Sem nome';const b=document.querySelector(`[data-act="hbSel"][aria-current="true"] span`);if(b)b.textContent=t.value||'Sem nome'}}
});
document.addEventListener('change',e=>{
  const t=e.target;const f=F();const ds=t.dataset;
  if(t.id==='pick-all'){pickState.all=t.checked;renderPick();return}
  if(t.type==='checkbox'&&ds.act){
    switch(ds.act){
     case 'tglFonte':S.cfg.fontes[ds.id]=t.checked;saveCfg();break;
     case 'tglPacote':S.cfg.pacotes[ds.id]=t.checked;saveCfg();break;
     case 'tglRegra':{S.cfg.regras[ds.id]=t.checked;const rg=D.regras.find(x=>x.id===ds.id);
       if(t.checked&&rg&&rg.requer&&!regraOn(rg.requer)){const base=D.regras.find(x=>x.id===rg.requer);
         if(base&&fonteOn(base.fonte)){S.cfg.regras[rg.requer]=true;toast(`${base.nome} também foi ligada, porque esta regra a complementa.`)}
         else if(base)toast(`Esta regra complementa “${base.nome}”, de ${FONTE(base.fonte).nome}. Ligue esse suplemento para usar as duas juntas.`,6000)}
       saveCfg();break}
     case 'tglAuto':S.cfg.auto[ds.id]=t.checked;saveCfg();break;
     case 'desv':{const l=f.desvantagens=f.desvantagens||[];const i=l.indexOf(ds.id);if(i>=0)l.splice(i,1);else l.push(ds.id);saveF();break}
     case 'forma':{f.formaSuprema=t.checked;if(t.checked){perderSan(f,6);const r=calc(f);f.pv=Math.min(r.pvMax,(f.pv??r.pvMax)+20);f.pe=Math.min(r.peMax,(f.pe??r.peMax)+10);toast('Forma suprema: −6 SAN, +20 PV, +10 PE, +10 Defesa.')}
       else{const r=calc(f);if((f.pv??r.pvMax)<=20){f.pv=0;toast('Forma suprema desfeita: ficou com 0 PV e morrendo.')}else if(f.pv!=null)f.pv-=20;if(f.pe!=null)f.pe=Math.max(0,f.pe-10)}saveF();break}
     case 'imgTodos':{const it=f.inventario[+ds.i];if(t.checked&&it.img)S.cfg.imgs[it.ref]=it.img;else delete S.cfg.imgs[it.ref];saveCfg();break}
     case 'hbPer':{const x=hbCur();const arr=x[ds.k]=x[ds.k]||[];const i=arr.indexOf(ds.id);if(i>=0)arr.splice(i,1);else arr.push(ds.id);saveHB();return}
     default:return;
    }
    render();return;
  }
  if(ds.pod){const p=f.poderes.find(x=>x.uid===ds.pod);if(p){p[ds.k]=t.type==='checkbox'?t.checked:t.value;saveF();render()}return}
  if(ds.cfg){S.cfg[ds.cfg]=+t.value||2;saveCfg();return}
  if(ds.f!=null&&(t.hasAttribute('data-r')||t.type==='checkbox')){bindF(t);
    if(ds.f==='classe'){f.trilha='';f.escolhas=[]}
    if(ds.f==='origem'){f.origemOpcao=0;f.origemEscolha=''}
    render()}
  else if(ds.h!=null&&(t.hasAttribute('data-r')||t.type==='checkbox')){bindH(t);render()}
  else if(ds.h==='pacote')render();
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&document.getElementById('modal').innerHTML){closeModal();return}
  const t=e.target;if(e.key!=='Enter')return;
  if(t.dataset&&t.dataset.dmg){e.preventDefault();aplicarDelta(F(),t.dataset.dmg,t.value);render();const el=document.querySelector(`[data-dmg="${t.dataset.dmg}"]`);if(el)el.focus()}
  else if(t.dataset&&t.dataset.npcdmg){e.preventDefault();npcDelta(F(),+t.dataset.npcdmg,t.value)}
});
function readVal(t){if(t.type==='checkbox')return t.checked;if(t.hasAttribute('data-num')){if(t.value==='')return t.dataset.f&&/^(outros|pv$|pe$|san$)/.test(t.dataset.f)?null:0;return +t.value}return t.value}
function bindF(t){const f=F();if(!f)return;const v=readVal(t);const p=t.dataset.f;
  if(/^outros\./.test(p)&&v==null)delete f.outros[p.slice(7)];else setPath(f,p,v);saveF()}
function bindH(t){const x=hbCur();if(!x)return;setPath(x,t.dataset.h,readVal(t));saveHB()}
function refresh(){
  const f=F();if(!f||S.view!=='ficha')return;const r=calc(f);const set=(k,v)=>document.querySelectorAll(`[data-d="${k}"]`).forEach(el=>el.textContent=v);
  set('nome-'+f.id,f.nome||'Sem nome');['defesa','peLim','dt'].forEach(k=>set(k,r[k]));set('desloc',r.desloc+'m');set('carga',r.esp+'/'+r.carga);
  ['pv','pe','san'].forEach(k=>{set(k,r[k]);set(k+'Max',r[k+'Max']);const b=document.querySelector(`[data-bar="${k}"]`);if(b)b.style.width=(r[k+'Max']?Math.max(0,Math.min(100,r[k]/r[k+'Max']*100)):0)+'%'});
  set('patente',`${r.patente.nome} · crédito ${r.patente.credito}`);
  Object.entries(r.per).forEach(([id,x])=>set('per-'+id,sgn(x.bonus)));
}

/* ============================== INÍCIO ============================== */
(async function init(){
  const app=document.getElementById('app');
  try{const res=await fetch('data/dados.json');if(!res.ok)throw new Error(res.status);D=await res.json()}
  catch(e){app.innerHTML='<div class="empty">Não foi possível carregar o conteúdo dos livros. Recarregue a página.</div>';return}
  const saved=Store.loadLocal();
  if(saved){for(const k in saved.fichas||{})S.fichas[k]=migrar(saved.fichas[k]);S.hb={...emptyHB(),...(saved.hb||{})};
    if(saved.cfg)S.cfg={...cfgPadrao(),...saved.cfg,auto:{...cfgPadrao().auto,...(saved.cfg.auto||{})}};S.active=saved.active}
  if(!Object.keys(S.fichas).length){const e=exemplo();S.fichas[e.id]=e;S.active=e.id}
  if(!S.fichas[S.active])S.active=Object.keys(S.fichas)[0];
  render();renderRolls();
  Store.connect();
  try{if(window.claude&&window.claude.use){const as=await window.claude.use('assets');if(as){S.assets=as;render()}}}catch(e){}
})();
