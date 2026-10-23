// Sobrevivendo ao Horror — parte 2: poderes e trilhas de combatente e especialista.
const {P,T}=require('./h');
module.exports={
poderes:[
 P('combatente','Caminho para Forca','Ao usar sacrifício numa perseguição, 1 PE para dar +2d20 no total aos outros; ao chamar atenção numa cena de furtividade, 1 PE para reduzir em –2 a visibilidade dos aliados próximos.'),
 P('combatente','Ciente das Cicatrizes','Ao procurar pistas ligadas a armas ou ferimentos (necropsia, identificar arma amaldiçoada), usa Luta ou Pontaria no lugar da perícia.','treinado em Luta ou Pontaria'),
 P('combatente','Correria Desesperada','+3m de deslocamento e +1d20 em perícias para fugir numa perseguição.','',[{alvo:'deslocamento',valor:3}]),
 P('combatente','Engolir o Choro','Não sofre penalidades de condições em testes para fugir e em Furtividade.'),
 P('combatente','Instinto de Fuga','No início de uma perseguição (ou semelhante), +2 em todos os testes de perícia na cena.','treinado em Intuição'),
 P('combatente','Apego Angustiado','Não fica inconsciente por estar morrendo, mas perde 2 de Sanidade a cada rodada que termina morrendo e consciente.'),
 P('combatente','Mochileiro','+5 espaços de carga e pode usar uma vestimenta adicional.','Vig 2',[{alvo:'carga',valor:5}]),
 P('combatente','Paranoia Defensiva','Uma vez por cena, uma rodada e 3 PE: você e cada aliado presente escolhem +5 na Defesa contra o próximo ataque ou +5 em um teste de perícia até o fim da cena.'),
 P('combatente','Sacrificar os Joelhos','Uma vez por perseguição, ao usar esforço extra, 2 PE para passar automaticamente.','treinado em Atletismo'),
 P('combatente','Sem Tempo, Irmão','Uma vez por cena de investigação, ao facilitar a investigação, passa automaticamente, mas o mestre rola um evento de investigação a mais.'),
 P('combatente','Valentão','Usa Força no lugar de Presença em Intimidação. Uma vez por cena, 1 PE para assustar com Intimidação como ação livre.'),
 P('especialista','Esconderijo Desesperado','Sem –1d20 em Furtividade por se mover no deslocamento normal. Em cenas de furtividade, esconder-se reduz a visibilidade em –2.'),
 P('especialista','Especialista Diletante','Aprende um poder de outra classe (exceto de trilha ou paranormal) cujos pré-requisitos cumpra.','NEX 30%'),
 P('especialista','Flashback','Escolha uma origem que não seja a sua: recebe o poder dela.'),
 P('especialista','Leitura Fria','Uma vez por interlúdio, após observar um NPC, faça três perguntas pessoais sobre ele; cada uma não respondida dá 2 PE temporários até o fim da missão. Uma vez por pessoa.','treinado em Intuição'),
 P('especialista','Acolher o Terror','Pode se entregar ao medo uma vez adicional por sessão.'),
 P('especialista','Contatos Oportunos','Ação de interlúdio: recebe um aliado de um tipo à escolha até o fim da missão (um por vez).','treinado em Crime',[],{aliado:'escolha'}),
 P('especialista','Mãos Firmes','Em Furtividade para se esconder ou agir discretamente com um objeto, 2 PE para +1d20.','treinado em Furtividade'),
 P('especialista','Disfarce Sutil','1 PE para se disfarçar com Enganação como ação completa e sem kit (com kit, +5).','Pre 2, treinado em Enganação'),
 P('especialista','Plano de Fuga','Usa Intelecto no lugar de Força para criar obstáculos numa perseguição; uma vez por cena, 2 PE para ter sucesso sem teste.'),
 P('especialista','Remoer Memórias','Uma vez por cena, num teste de perícia de Intelecto ou Presença, 2 PE para substituí-lo por um teste de Intelecto com DT 15.','Int 1'),
 P('especialista','Resistir à Pressão','Uma vez por cena de investigação, 5 PE: a urgência aumenta em 1 rodada e nela todos recebem +2 em testes de perícia.','treinado em Investigação'),
],
trilhas:[
 T('agente_secreto','Agente Secreto','combatente','Agente de governo cedido à Ordem, que conta com habilidade, determinação e um sorriso carismático.',[
  ['Carteirada','Treinado em Diplomacia ou Enganação (ou +2 se já for). A cada missão recebe documentos com privilégios jurídicos (acesso, porte de armas, jurisdição).'],
  ['O Sorriso','+2 em Diplomacia e Enganação; ao falhar numa delas, 2 PE para rolar de novo uma vez. Uma vez por cena, Diplomacia para acalmar a si mesmo.',[{alvo:'per:diplomacia',valor:2},{alvo:'per:enganacao',valor:2}]],
  ['Método Investigativo','A urgência das investigações em que está aumenta em 1 rodada. Quando o mestre rola evento de investigação, 2 PE (+2 por uso na cena) para torná-lo "sem evento".'],
  ['Multifacetado','Uma vez por cena, gaste 5 de Sanidade (só volta no fim da missão) para receber as habilidades até NEX 65% de uma trilha de combatente ou especialista até o fim da cena (não repete trilha na missão).']]),
 T('cacador','Caçador','combatente','Reúne informações para caçar o que espreita na escuridão.',[
  ['Rastrear o Paranormal','Treinado em Sobrevivência (ou +2). Usa Sobrevivência no lugar de Ocultismo para identificar criaturas e de Investigação e Percepção para rastros e pistas paranormais.'],
  ['Estudar Fraquezas','Ação de interlúdio com uma pista ligada a um ser: recebe uma informação útil e +1 em testes contra ele até o fim da missão por pista.'],
  ['Atacar das Sombras','Sem –1d20 em Furtividade por mover-se no deslocamento normal; atacando com arma silenciosa, a penalidade em Furtividade cai para –1d20. Visibilidade inicial 1 ponto menor.'],
  ['Estudar a Presa','Ao Estudar Fraquezas de criatura ou cultista, define o tipo como presa: +1d20 em perícias, +1 na margem e no multiplicador de crítico e RD 5 contra ele. Uma presa por vez.']]),
 T('monstruoso','Monstruoso','combatente','Deforma o próprio corpo para que uma entidade o invada. Usa a progressão de NEX & Experiência. Em NEX 75% fica permanentemente perturbado e é banido da Ordem; em 99%, SAN 1.',[
  ['Ser Amaldiçoado','Treinado em Ocultismo (ou +2). Escolha um elemento e faça uma etapa ritualística diária (senão sofre fome e sede). Feita, até o fim do dia: Sangue (RD balístico e Sangue 5, faro, Vigor no dano de contra-ataque; –1d20 em Ciências e Intuição), Morte (RD perfuração e Morte 5, imune a fadiga, soma Força aos PV; –1d20 em Diplomacia e Enganação), Conhecimento (RD balístico e Conhecimento 5, visão no escuro, Int na Defesa; –1d20 em Atletismo e Acrobacia) ou Energia (RD corte, eletricidade, fogo e Energia 5, Agi na RD do bloqueio; –1d20 em Investigação e Percepção).'],
  ['Ser Macabro','A RD vira 10 e a penalidade –2d20. Sangue: usa Força para PE e cura 1d8 PV por PE gasto (ação de movimento). Morte: +1d20 em Intimidação, usa Vigor para PE, morre só após 4 turnos morrendo. Conhecimento: +1 Int, usa Int para Enganação e PE. Energia: usa Agi para PE; ao acertar corpo a corpo, PE (até Agi) para +1d6 de Energia cada.'],
  ['Ser Assustador','A RD vira 15 e a Presença cai 1 permanentemente. Sangue: 50% contra críticos e furtivos e mordida 1d8 (1 PE para ataque extra). Morte: Vigor DT 15 para levantar com 1 PV ao morrer; recupera 2 PE em críticos e abates. Conhecimento: troca uma perícia treinada por dados de bônus iguais ao Int. Energia: RD também a químico; drena PE de fontes elétricas.'],
  ['Ser Aterrorizante','Os efeitos ficam permanentes, a RD vira 20 e você conta como criatura paranormal. Sangue: –1 Int, +1 For, mordida cura 5 PV, aprende Forma Monstruosa. Morte: –1 Pre, +1 Vig, imune a Morte e imortal (exceto por fogo ou Energia), aprende Fim Inevitável. Conhecimento: –1 For, +1 Int, percepção às cegas e um ritual de Conhecimento de 4º círculo. Energia: –1 For, +1 Agi, flutua com 12m, aprende Deflagração de Energia.']]),
 T('bibliotecario','Bibliotecário','especialista','Seu vasto conhecimento é a solução para situações desesperadoras.',[
  ['Conhecimento Prático','Em testes de perícia (exceto Luta e Pontaria), 2 PE para usar Intelecto. Com Conhecimento Aplicado, custa –1 PE.'],
  ['Leitor Contumaz','Os dados da ação ler viram 1d8 e valem para qualquer perícia; ao usar um, 2 PE para +1 dado.',[],{lerDado:'1d8',lerQualquer:true}],
  ['Rato de Biblioteca','Num lugar cheio de livros, alguns minutos (ou uma rodada de investigação) dão os benefícios de ler ou revisar caso. Uma vez por cena.'],
  ['A Força do Saber','+1 em Intelecto e soma o Intelecto aos PE totais. Uma perícia passa a usar Intelecto.',[],{attrBonus:{INT:1},peSomaAttr:'INT'}]]),
 T('perseverante','Perseverante','especialista','O último sobrevivente do filme de terror, que nunca desiste.',[
  ['Soluções Improvisadas','2 PE para rolar de novo um dado de um teste recém-feito e ficar com o melhor (uma vez por teste).'],
  ['Fuga Obstinada','+1d20 em perícias para fugir; como presa numa perseguição, aguenta até 4 falhas.'],
  ['Determinação Inquestionável','Uma vez por cena, 5 PE e ação padrão para remover uma condição de medo, mental ou de paralisia.'],
  ['Só Mais um Passo...','Uma vez por rodada, dano que o levaria a 0 PV o deixa com 1 PV ao gastar 5 PE (não contra dano massivo).']]),
 T('muambeiro','Muambeiro','especialista','Produz ou encontra o item certo para cada ocasião.',[
  ['Mascate','Treinado em Profissão (armeiro, engenheiro ou químico) e +5 de carga. Itens improvisados têm DT –10.',[{alvo:'carga',valor:5}]],
  ['Fabricação Própria','Fabrica itens mundanos na metade do tempo.'],
  ['Laboratório de Campo','Treinado em outra dessas Profissões (ou +5). Pode fabricar e consertar itens paranormais (três ações de interlúdio).'],
  ['Achado Conveniente','Ação completa e 5 PE: "produz" um item de até categoria III (exceto paranormal) que funciona até o fim da cena.']]),
],
};
