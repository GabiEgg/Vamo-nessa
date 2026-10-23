// Sobrevivendo ao Horror — parte 3: ocultista, classe Sobrevivente e poderes gerais.
const {P,T}=require('./h');
// Poder geral que treina uma perícia (ou dá +2 se já treinado)
const G=(nome,per,desc,prereq,x={})=>P('geral',nome,desc,prereq,x.mods||[],{treinaOu2:per,...x});
module.exports={
poderes:[
 P('ocultista','Minha Dor me Impulsiona','Em Acrobacia, Atletismo ou Furtividade, 1 PE para +1d6, desde que tenha pelo menos 5 de dano sofrido.','Vig 2'),
 P('ocultista','Nos Olhos do Monstro','Numa cena com criatura paranormal, uma rodada e 3 PE encarando-a: +5 em testes contra ela (exceto ataques) até o fim da cena.'),
 P('ocultista','Olhar Sinistro','Usa Presença no lugar de Intelecto em Ocultismo e pode usar Ocultismo para coagir.','Pre 1'),
 P('ocultista','Deixe os Sussurros Guiarem','Uma vez por cena, 2 PE e uma rodada: +2 em perícias de investigação até o fim da cena, mas perde 1 SAN a cada falha em perícia.'),
 P('ocultista','Sentido Premonitório','3 PE (+1 PE por rodada para manter, fora de combate): vê o futuro próximo — quando a urgência acaba, eventos de investigação e ações de inimigos em furtividade e perseguição.'),
 P('ocultista','Domínio Esotérico','Ao lançar um ritual, combina os efeitos de até dois catalisadores ritualísticos diferentes.','Int 3'),
 P('ocultista','Estalos Macabros','Ao distrair (furtividade) ou fintar, 1 PE para usar Ocultismo; contra pessoas ou animais, +5. Sem efeito em combate.'),
 P('ocultista','Sincronia Paranormal','Ação padrão e 2 PE (+1 PE por rodada): conexão com aliados em alcance médio com quem já sobreviveu ao paranormal; a cada rodada distribui dados de bônus iguais à sua Presença para testes de Intelecto ou Presença deles.','Pre 2'),
 P('ocultista','Traçado Conjuratório','1 PE e ação completa: símbolo de 1,5m no chão até o fim da cena; dentro dele, +2 em Ocultismo e resistência e +2 na DT dos seus rituais.'),
 // Poderes gerais (qualquer classe)
 G('Acrobático','acrobacia','Treinado em Acrobacia (ou +2). Terreno difícil não reduz seu deslocamento nem impede investidas.','Agi 2'),
 G('Ás do Volante','pilotagem','Treinado em Pilotagem (ou +2). Uma vez por rodada, Pilotagem contra a DT do ataque ou efeito para evitar dano ao veículo que pilota.','Agi 2'),
 G('Atlético','atletismo','Treinado em Atletismo (ou +2) e +3m de deslocamento.','For 2',{mods:[{alvo:'deslocamento',valor:3}]}),
 P('geral','Atraente','+5 em Artes, Diplomacia, Enganação e Intimidação contra pessoas que possam se sentir atraídas por você.','Pre 2'),
 G('Dedos Ágeis','crime','Treinado em Crime (ou +2). Arromba com ação padrão, furta com ação livre (uma vez por rodada) e sabota com ação completa.','Agi 2'),
 G('Detector de Mentiras','intuicao','Treinado em Intuição (ou +2). Outros sofrem –10 em Enganação para mentir para você.','Pre 2'),
 G('Especialista em Emergências','medicina','Treinado em Medicina (ou +2). Aplica cicatrizantes e medicamentos com ação de movimento e saca um deles como ação livre uma vez por rodada.','Int 2'),
 P('geral','Estigmado','Pode converter dano mental de efeitos de medo em perda de PV.'),
 P('geral','Foco em Perícia','Escolha uma perícia (exceto Luta e Pontaria): rola +1d20 nela. Repetível para outras perícias.','treinado na perícia',[],{repetivel:true,escolheDadoPericia:1}),
 P('geral','Inventário Organizado','Soma Intelecto ao limite de carga; itens de 0,5 espaço ocupam 0,25.','Int 2',[],{cargaInt:true}),
 G('Informado','atualidades','Treinado em Atualidades (ou +2). Pode usar Atualidades em testes envolvendo informações, com aprovação do mestre.','Int 2'),
 G('Interrogador','intimidacao','Treinado em Intimidação (ou +2). Coage com ação padrão, uma vez por cena por pessoa.','For 2'),
 G('Mentiroso Nato','enganacao','Treinado em Enganação (ou +2). Penalidade por mentiras implausíveis cai para –1d20.','Pre 2'),
 G('Observador','investigacao','Treinado em Investigação (ou +2) e soma Intelecto em Intuição.','Int 2',{somaAttrPer:{intuicao:'INT'}}),
 G('Pai de Pet','adestramento','Treinado em Adestramento (ou +2). Seu animal de estimação é um aliado que dá +2 em duas perícias (exceto Luta e Pontaria).','Pre 2',{aliado:'pet'}),
 G('Palavras de Devoção','religiao','Treinado em Religião (ou +2). Uma vez por cena, 3 PE e ação completa: oração que dá resistência mental 5 até o fim da cena a até o dobro da sua Presença em pessoas.','Pre 2'),
 P('geral','Parceiro','Você tem um parceiro fiel: um aliado de um tipo à escolha que obedece às suas ordens.','treinado em Diplomacia, NEX 30%',[],{aliado:'escolha'}),
 G('Pensamento Tático','tatica','Treinado em Tática (ou +2). Ao analisar terreno com sucesso, você e aliados em alcance médio ganham uma ação de movimento na primeira rodada do próximo combate ali (no mesmo dia).','Int 2'),
 G('Personalidade Esotérica','ocultismo','+3 PE e treinado em Ocultismo (ou +2).','Int 2',{mods:[{alvo:'pe',valor:3}]}),
 G('Persuasivo','diplomacia','Treinado em Diplomacia (ou +2). A penalidade por pedidos custosos ou perigosos na persuasão diminui em 5.','Pre 2'),
 G('Pesquisador Científico','ciencias','Treinado em Ciências (ou +2). Usa Ciências no lugar de Ocultismo e Sobrevivência para identificar criaturas e animais.','Int 2'),
 G('Proativo','iniciativa','Treinado em Iniciativa (ou +2). Rolando 19 ou 20 em algum dado de Iniciativa, ganha uma ação padrão extra no primeiro turno.','Agi 2'),
 P('geral','Provisões de Emergência','Uma vez por missão, ação de interlúdio para recuperar seu esconderijo: novos equipamentos como numa nova preparação de missão.'),
 P('geral','Racionalidade Inflexível','Usa Intelecto no lugar de Presença em Vontade e para calcular PE.','Int 3',[],{peAttr:'INT',perAttr:{vontade:'INT'}}),
 G('Rato de Computador','tecnologia','Treinado em Tecnologia (ou +2). Hackeia, localiza arquivo ou opera dispositivo com ação completa; uma vez por investigação, com computador, procura pistas com Tecnologia sem gastar rodada.','Int 2'),
 G('Resposta Rápida','reflexos','Treinado em Reflexos (ou +2). Ao falhar em Percepção para não ficar desprevenido, 2 PE para rolar de novo com Reflexos.','Agi 2'),
 G('Talentoso','artes','Treinado em Artes (ou +2). Ao impressionar com Artes, o bônus aumenta em +1 a cada 5 acima da DT.','Pre 2'),
 G('Teimosia Obstinada','vontade','Treinado em Vontade (ou +2). Contra condição mental ou mudança de atitude, 2 PE para +5 em Vontade.','Pre 2'),
 G('Tenacidade','fortitude','Treinado em Fortitude (ou +2). Morrendo mas consciente, Fortitude (DT 20 +10 por teste anterior na cena) como ação livre para encerrar a condição.','Vig 2'),
 G('Sentidos Aguçados','percepcao','Treinado em Percepção (ou +2). Não fica desprevenido contra inimigos que não vê; ao errar por camuflagem, rola de novo a chance de falha.','Pre 2'),
 G('Sobrevivencialista','sobrevivencia','Treinado em Sobrevivência (ou +2). +2 para resistir a clima; terreno difícil natural não reduz seu deslocamento.','Int 2'),
 G('Sorrateiro','furtividade','Treinado em Furtividade (ou +2). Sem penalidade por se mover normalmente furtivo nem por seguir alguém em ambientes sem esconderijo.','Agi 2'),
 P('geral','Vitalidade Reforçada','+1 PV por 5% de NEX e +2 em Fortitude.','Vig 2',[{alvo:'pvNex',valor:1},{alvo:'per:fortitude',valor:2}]),
 P('geral','Vontade Inabalável','+1 PE a cada 10% de NEX e +2 em Vontade.','Pre 2',[{alvo:'pePor10',valor:1},{alvo:'per:vontade',valor:2}]),
],
tornarGeral:['com_artista_marcial','esp_artista_marcial','com_combater_com_duas_armas','com_saque_rapido','com_tiro_certeiro'],
trilhas:[
 T('exorcista','Exorcista','ocultista','Com a fé como escudo e as palavras como espada, enfrenta o paranormal.',[
  ['Revelação do Mal','Treinado em Religião (ou +2). Usa Religião no lugar de Investigação, Percepção e Ocultismo para seres, rastros e pistas paranormais.'],
  ['Poder da Fé','Veterano em Religião (ou +1d20 se já for). Ao falhar numa resistência, 2 PE para repetir com Religião (fica com o novo).'],
  ['Parareligiosidade','Ao conjurar, +2 PE para somar o efeito de um catalisador ritualístico à escolha.'],
  ['Chagas da Resistência','Quando a Sanidade iria a 0, gaste 10 PV para ficar com SAN 1.']]),
 T('possuido','Possuído','ocultista','O Outro Lado o escolheu e cresce em seu interior.',[
  ['Poder Não Desejado','Todo poder de ocultista vira Transcender. Ganha pontos de possessão (3 + 2 por Transcender): gaste até sua Presença por turno, cada um cura 10 PV ou 2 PE. Recupera 1 por dormir.',[],{possessao:true}],
  ['As Sombras Dentro de Mim','Recupera 2 PP por dormir. 2 PE: +1d20 em Acrobacia, Atletismo e Furtividade por uma rodada (e visibilidade sobe 1 a menos).'],
  ['Ele Me Ensina','Escolha transcender ou receber o primeiro poder de outra trilha de ocultista.'],
  ['Tornamo-nos Um','Conforme a afinidade: Sangue (6 PE: cura 50 PV e perícias físicas e Intimidação viram +35), Morte (6 PE: turno extra no fim da rodada), Conhecimento (6 PE: um poder qualquer até o fim da cena, com custo em SAN) ou Energia (6 PE: teleporte em alcance médio).']]),
 T('parapsicologo','Parapsicólogo','ocultista','Estuda o paranormal para curar a mente. Exige treino em Profissão (psicólogo).',[
  ['Terapia','Usa Profissão (psicólogo) como Diplomacia. Uma vez por rodada, quando você ou aliado em alcance curto falha em resistência contra dano mental, 2 PE para trocar pelo teste de Profissão (psicólogo). Se já tiver, custa –1 PE e +2 em Profissão.'],
  ['Palavras-chave','Ao acalmar alguém, gaste PE até seu limite: cada um devolve 1 de Sanidade (ou 1 PD).'],
  ['Reprogramação Mental','5 PE e ação de interlúdio (de ambos): uma pessoa voluntária recebe um poder geral, da própria classe ou o primeiro de outra trilha até o próximo interlúdio.'],
  ['A Sanidade Está Lá Fora','Ação de movimento e 5 PE: remove todas as condições de medo ou mentais de uma pessoa adjacente.']]),
 T('durao','Durão','sobrevivente','Resistente, defende a si e aos outros.',[
  ['Durão','+4 PV; no 3º estágio, +2 PV.',[{alvo:'pv',valor:4}],{nex:2}],
  ['Pancada Forte','Ao atacar, 1 PE para +1d20 no ataque.',[],{nex:4}]]),
 T('esperto','Esperto','sobrevivente','Equipado com conhecimento, inteligência e persuasão.',[
  ['Esperto','Treinado em uma perícia adicional.',[],{nex:2}],
  ['Entendido','Escolha duas perícias treinadas (exceto Luta e Pontaria): 1 PE para +1d4 nelas.',[],{nex:4}]]),
 T('esoterico','Esotérico','sobrevivente','Ligado a aspectos espirituais, com um sexto sentido para o paranormal.',[
  ['Esotérico','Ação padrão e 1 PE: sente energias paranormais em alcance curto.',[],{nex:2}],
  ['Iniciado','Aprende um ritual de 1º círculo.',[],{nex:4}]]),
],
classes:[
 {id:'sobrevivente',nome:'Sobrevivente',pvBase:8,pvNex:2,peBase:2,peNex:1,sanBase:8,sanNex:2,periciasFixas:[],periciasEscolha:'',periciasLivres:1,grau:0,ritInicial:0,ritNex:0,
  estagios:true,limitePE:1,proficiencias:'Armas simples.',desc:'Pessoa comum em meio ao horror, mais fraca que agentes treinados. Evolui por estágios (1 a 5) em vez de NEX. Começa com 3 pontos de atributo.',
  habilidades:[
   {nex:1,nome:'Empenho',desc:'Ao fazer um teste de perícia, gaste 1 PE para receber +2.'},
   {nex:2,nome:'Trilha',desc:'Escolha Durão, Esperto ou Esotérico e receba a primeira habilidade; a segunda vem no estágio 4.'},
   {nex:3,nome:'Aumento de Atributo',desc:'+1 em um atributo (máximo 3).'},
   {nex:5,nome:'Cicatrizado',desc:'Escolha um perigo paranormal já enfrentado: –1d20 em resistência contra ele. Uma vez por sessão, como reação, sacrifique 1 PV permanente para ignorar dano mental ou gasto de PE, ou 1 PE permanente para reduzir dano físico à metade.'}]},
],
};
