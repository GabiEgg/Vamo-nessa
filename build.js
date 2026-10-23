// Junta os módulos de src/ em data/dados.json, marcando a fonte de cada entrada.
const fs=require('fs'),path=require('path');
const R=f=>require('./src/'+f);
const FONTES=[
 {id:'core',sigla:'OPRPG',nome:'Ordem Paranormal RPG — Livro de Regras',desc:'Livro básico (v1.3). Sempre ativo.',fixa:true,arquivos:['core1','core2','core3','core4','core5','core6','core7','core8']},
 {id:'sah',sigla:'SaH',nome:'Sobrevivendo ao Horror',desc:'Origens, trilhas, classe Sobrevivente, equipamentos, rituais e regras opcionais (Determinação, medo, patentes…).',arquivos:['sah1','sah2','sah3','sah4','sah5','sah6']},
 {id:'as01',sigla:'AS#01',nome:'Arquivos Secretos #01 — Agatha e os Transtornados',desc:'Ritos & Maldições: origens, Maledictólogo, Transcender com Itens, Reter Ritual.',arquivos:['as01']},
 {id:'as02',sigla:'AS#02',nome:'Arquivos Secretos #02 — Hexatombe: os Mascarados',desc:'Poderes e itens dos Mascarados e agentes, aliados, As Máscaras.',arquivos:['as02']},
 {id:'as03',sigla:'AS#03',nome:'Arquivos Secretos #03 — Hexatombe: o fim',desc:'Poderes de sacrifício, trilha Performático, aliados, veículos operacionais, animais.',arquivos:['as03']},
 {id:'as04',sigla:'AS#04',nome:'Arquivos Secretos #04 — Complexo 0413',desc:'Origens, Granadeiro Blaster, ritual Backup, granadas e hacking.',arquivos:['as04']},
 {id:'as05',sigla:'AS#05',nome:'Arquivos Secretos #05 — Transmissão',desc:'Origens, Criptologista do Oculto, poderes de Transmissão, novas regalias.',arquivos:['as05']},
 {id:'as06',sigla:'AS#06',nome:'Arquivos Secretos #06 — Indústrias Panacea',desc:'Origens Panacea, medicamentos, doenças, venenos, evolução modular.',arquivos:['as06']},
 {id:'as07',sigla:'AS#07',nome:'Arquivos Secretos #07 — Ritos Fúnebres',desc:'Origens, Vampirismo, Monstruoso para especialista e ocultista, regras debaixo d’água.',arquivos:['as07']},
 {id:'as09',sigla:'AS#09',nome:'Arquivos Secretos #09 — Hell Hunters',desc:'Origens, Incursor, Piloto de Drone, armamento e regras de perigo.',arquivos:['as09']},
];
const PERICIAS=[
 ['acrobacia','Acrobacia','AGI',0,1],['adestramento','Adestramento','PRE',1,0],['artes','Artes','PRE',1,0],['atletismo','Atletismo','FOR',0,0],
 ['atualidades','Atualidades','INT',0,0],['ciencias','Ciências','INT',1,0],['crime','Crime','AGI',1,1],['diplomacia','Diplomacia','PRE',0,0],
 ['enganacao','Enganação','PRE',0,0],['fortitude','Fortitude','VIG',0,0],['furtividade','Furtividade','AGI',0,1],['iniciativa','Iniciativa','AGI',0,0],
 ['intimidacao','Intimidação','PRE',0,0],['intuicao','Intuição','PRE',0,0],['investigacao','Investigação','INT',0,0],['luta','Luta','FOR',0,0],
 ['medicina','Medicina','INT',0,0],['ocultismo','Ocultismo','INT',1,0],['percepcao','Percepção','PRE',0,0],['pilotagem','Pilotagem','AGI',1,0],
 ['pontaria','Pontaria','AGI',0,0],['profissao','Profissão','INT',1,0],['reflexos','Reflexos','AGI',0,0],['religiao','Religião','PRE',1,0],
 ['sobrevivencia','Sobrevivência','INT',0,0],['tatica','Tática','INT',1,0],['tecnologia','Tecnologia','INT',1,0],['vontade','Vontade','PRE',0,0]
].map(([id,nome,attr,t,c])=>({id,nome,attr,somenteTreinada:!!t,carga:!!c,fonte:'core'}));

const out={versao:2,fontes:FONTES.map(({arquivos,...f})=>f),pericias:PERICIAS};
const LISTAS=['origens','classes','trilhas','poderes','rituais','itens','modificacoes','aliados','condicoes','regras','interludio','insanidade','efeitosMedo','visoesMedo','desvantagensIdade','doencas','venenos'];
LISTAS.forEach(k=>out[k]=[]);
out.extras={};
const ids={};let dup=0;
for(const F of FONTES){
 for(const arq of F.arquivos){
  const m=R(arq);
  for(const [k,v] of Object.entries(m)){
   if(Array.isArray(v)){
    if(!out[k])out[k]=[];
    v.forEach(x=>{
     if(x&&typeof x==='object'&&!Array.isArray(x)){
      const e={...x,fonte:F.id};
      if(e.id){const key=k+':'+e.id;if(ids[key]){e.id=e.id+'__'+F.id;dup++}ids[k+':'+e.id]=1}
      out[k].push(e);
     }else out[k].push(x);
    });
   }else{out.extras[k]={...(out.extras[k]||{}),...v}}
  }
 }
}
// Trilhas Monstruoso: o elemento escolhido troca o atributo de PE (e de DT, no ocultista) e altera atributos.
const EL4=(a,b,c,d)=>({sangue:a,morte:b,conhecimento:c,energia:d});
const PE_EL=EL4('FOR','VIG','INT','AGI');
const UM=EL4({FOR:1},{VIG:1},{INT:1},{AGI:1});
const AJUSTES={
 monstruoso:[{},{peAttrElem:PE_EL,attrElem:EL4({},{},{INT:1},{})},{attrBonus:{PRE:-1}},{attrElem:EL4({INT:-1,FOR:1},{PRE:-1,VIG:1},{FOR:-1,INT:1},{FOR:-1,AGI:1})}],
 monstruoso_especialista:[{peAttrElem:PE_EL},{},{attrBonus:{PRE:-1},attrElem:UM},{attrBonus:{PRE:-1},attrElem:UM}],
 monstruoso_ocultista:[{peAttrElem:PE_EL,dtAttrElem:PE_EL,attrElem:UM},{},{attrBonus:{PRE:-1}},{attrBonus:{PRE:-1},attrElem:UM}],
};
out.trilhas.forEach(t=>{const aj=AJUSTES[t.id];if(!aj)return;t.elementoEscolha=true;t.habilidades.forEach((h,i)=>Object.assign(h,aj[i]||{}))});
// tornarGeral é lista de ids (SaH): guarda como extra
out.extras.tornarGeral=out.tornarGeral;delete out.tornarGeral;
fs.mkdirSync(path.join(__dirname,'data'),{recursive:true});
const txt=JSON.stringify(out);
fs.writeFileSync(path.join(__dirname,'data','dados.json'),txt);
console.log('ok',(txt.length/1024).toFixed(0)+'KB','dups',dup,Object.fromEntries(Object.entries(out).filter(([k,v])=>Array.isArray(v)).map(([k,v])=>[k,v.length])));
