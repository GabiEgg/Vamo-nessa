// Helpers compactos para escrever os dados das fontes.
const slug=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
const NEX4=[10,40,65,99];
// Origem: id, nome, 'per1,per2', nome do poder, descrição, modificadores, extras
const O=(id,nome,per,poderNome,poderDesc,mods=[],x={})=>({id,nome,pericias:per?per.split(','):[],poderNome,poderDesc,mods,...x});
// Poder: tipo (classe|geral|paranormal), nome, descrição, pré-requisito, modificadores, extras
const P=(tipo,nome,desc,prereq='',mods=[],x={})=>({id:(x.id||tipo.slice(0,3)+'_'+slug(nome)),nome,tipo,elemento:x.elemento||'',prereq,desc,mods,...x});
// Poder paranormal: elemento, nome, descrição, afinidade, pré-requisito, mods, extras
const PP=(elemento,nome,desc,afinidade='',prereq='',mods=[],x={})=>({id:'par_'+slug(nome),nome,tipo:'paranormal',elemento,prereq,desc,afinidade,mods,...x});
// Trilha: id, nome, classe, descrição, [ [nome, desc, mods, extras], ... ] em NEX 10/40/65/99
const T=(id,nome,classe,desc,habs,x={})=>({id,nome,classe,desc,habilidades:habs.map((h,i)=>({nex:h[3]&&h[3].nex||NEX4[i],nome:h[0],desc:h[1],mods:h[2]||[],...(h[3]||{})})),...x});
// Ritual: nome, elemento, círculo, execução, alcance, alvo, duração, resistência, desc, discente, verdadeiro
const R=(nome,elemento,circulo,execucao,alcance,alvo,duracao,resistencia,desc,discente='',verdadeiro='',x={})=>({id:'rit_'+slug(nome),nome,elemento,circulo,execucao,alcance,alvo,duracao,resistencia,desc,discente,verdadeiro,...x});
// Item: tipo, nome, categoria, espaços, extras
const I=(tipo,nome,cat,esp,x={})=>({id:'it_'+slug(nome)+(x.idSuf||''),nome,tipo,cat,esp,dano:'',critico:'',alcance:'',tipoDano:'',proficiencia:'',defesa:0,desc:'',mods:[],...x});
module.exports={slug,O,P,PP,T,R,I};
