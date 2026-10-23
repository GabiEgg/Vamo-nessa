// Arquivos Secretos 09 — Hell Hunters.
const {O,P,T,I}=require('./h');
module.exports={
origens:[
 O('hell_hunters','Treinado pela Hell Hunters','','Resistência do Treinamento','Escolha Luta e Fortitude (+2 PV em NEX 5% e +1 PV a cada 10% de NEX) ou Pontaria e Reflexos (+1 PE em NEX 5% e +1 PE a cada 10% de NEX).',[],{opcoes:[
   {nome:'Luta e Fortitude',pericias:['luta','fortitude'],mods:[{alvo:'pv',valor:2},{alvo:'pvPor10',valor:1}]},
   {nome:'Pontaria e Reflexos',pericias:['pontaria','reflexos'],mods:[{alvo:'pe',valor:1},{alvo:'pePor10',valor:1}]}]}),
 O('veterano_conflito','Veterano de Conflito Armado','luta,pontaria','Full Metal Jacket','Ao testar Luta ou Pontaria com alguma penalidade, gaste 2 PE para ignorá-la nesse teste.'),
],
poderes:[
 P('combatente','Municiador Ambulante','Nova ação de interlúdio, municiar: prepara 1d6 pacotes de munição por ponto de Intelecto, que não ocupam espaço.','Int 2'),
 P('combatente','Ripostar Ousado','Ao ser alvo de ataque corpo a corpo (antes do resultado), gaste a reação de defesa e 2 PE: +5 na Defesa contra ele e, se errar, contra-ataca com +5.','Agi 2, treinado em Luta'),
 P('combatente','Tática de Abordagem','Nova ação de interlúdio: propõe um plano contra uma ameaça futura e testa Tática (DT 10): 1 dado de tática (d6), +1 a cada 5 acima da DT. Os dados dão +1d6 em teste, dano ou cura, para você ou aliados do plano, até o próximo interlúdio.','Int 1, veterano em Tática'),
 P('combatente','Tiro Intuitivo','Ao atacar à distância sem mirar, 2 PE para +2 na margem de ameaça desse ataque.','veterano em Pontaria'),
],
trilhas:[
 T('incursor','Incursor','combatente','Treinado para invadir complexos e neutralizar ameaças entre paredes e escombros, com precisão e velocidade.',[
  ['CQB','Treinado em Pontaria (ou Luta, se já for; ou +2 nas duas, se já for em ambas). Gaste 1 PE para anular a penalidade de –5 em Pontaria contra alvo em corpo a corpo.'],
  ['Entrada Explosiva','+5 em testes para implantar ou usar explosivos. 1 PE para implantar mina antipessoal ou carga de arrombamento com ação de movimento.'],
  ['Proteger Reféns','A até 3m de um refém protegido, reação e 2 PE para se tornar o alvo de um efeito negativo no lugar dele; se for dano, +2 PE para reduzi-lo à metade. Até três reféns.'],
  ['Alvo-prioritário','O mestre informa o VD de inimigos à vista. 5 PE para marcar um alvo-prioritário: com VD 200 ou menos, qualquer dano seu o reduz a 0 PV; acima disso, +5 na margem de ameaça contra ele.']]),
 T('piloto_drone','Piloto de Drone','especialista','Expert em drones de todo tipo, transformando o que parece brinquedo em ferramenta.',[
  ['Companheiro Drone','Recebe um drone de combate tático como aliado, de um tipo à escolha. Consertar: 1 ação de interlúdio (com as peças); novo: 2 ações.',[],{aliado:'drone'}],
  ['Protetor dos Drones','Aplica uma modificação no drone (fora do limite de categoria). Quando o drone sofreria um efeito negativo, gaste 3 PE para evitá-lo.'],
  ['Ás dos Drones','Duas modificações a mais (3 no total). Ao falhar num teste usando o drone, 3 PE para tentar de novo uma vez.'],
  ['Mestre dos Drones','Três modificações a mais (6 no total) ou um segundo drone com 3. Evitar efeito negativo no drone custa 1 PE.']]),
],
itens:[
 I('operacional','Aríete portátil',1,2,{desc:'Exige as duas mãos. +10 em testes para arrombar.'}),
 I('operacional','Boroscópio articulado',1,1,{desc:'Câmera em cabo flexível de 3m, com visão no escuro: permite Investigação e Percepção sem entrar no ambiente.'}),
 I('protecao','Capacete tático',2,1,{defesa:0,proficiencia:'pesada',desc:'Proteção pesada vestida: 25% (1 em 1d4) de ignorar o dano extra de crítico ou ataque furtivo.',acumulaProtecao:true}),
 I('arma','Designated Marksman Rifle (DMR)',3,3,{dano:'2d10',critico:'19/x3',alcance:'medio',tipoDano:'Balístico',proficiencia:'tatica',empunhadura:'duas',forma:'fogo',municao:'Balas longas',desc:'Permite Ataque Furtivo até alcance médio. Veterano em Pontaria que mira recebe +5 na margem de ameaça.'}),
 I('operacional','Drone de combate tático',3,2,{aliado:true,desc:'Aliado com câmera (Investigação e Percepção remotas). Escolha um tipo: Atirador (+1d20 em ataques; 2 PE para +2d8 balístico), Espião (+1d20 em Investigação e Percepção, visão no escuro; 2 PE para visão térmica e captar rádio), Hacker (+1d20 em Tecnologia, hackeia à distância), Inteligente (opera por voz; 2 PE para braços que carregam 5 espaços), Médico (treinado em Medicina ou +1d20; 2 PE cura 2d8+2), Protetor (+5 Defesa; 2 PE para +5 em resistência) ou Utilitário (+1d20 numa perícia; 3 PE para repetir falha). Cada modificação adiciona outro tipo e +I de categoria.'}),
 I('protecao','Escudo balístico LED',2,2,{defesa:2,escudo:true,proficiencia:'pesada',rd:'Balístico 10',desc:'Escudo (proteção pesada): +2 Defesa e RD balístico 10. Ação de movimento: cobertura leve para você e quem estiver atrás (até se deslocar). Lanterna tática embutida.'}),
 I('arma','Espingarda serrada',1,1,{dano:'3d6',critico:'x3',alcance:'curto',tipoDano:'Balístico',proficiencia:'tatica',empunhadura:'uma',forma:'fogo',municao:'Cartuchos',desc:'Metade do dano em alcance médio ou maior.'}),
 I('arma','Lançador de granadas portátil',2,1,{proficiencia:'tatica',empunhadura:'uma',forma:'fogo',desc:'Como um lançador de granadas, mas comporta uma granada por vez.'}),
 I('arma','Machado tático',2,1,{dano:'1d8',critico:'x3',alcance:'curto',tipoDano:'Corte',proficiencia:'tatica',empunhadura:'uma',forma:'corpo',agil:true,arremesso:true,desc:'Ágil e arremessável. +2 no ataque ao contra-atacar; ao bloquear, 2 PE e sacrifica o machado para +20 de RD.'}),
 I('arma','Pistola taser',2,1,{dano:'2d6',critico:'x3',alcance:'curto',tipoDano:'Eletricidade',proficiencia:'simples',empunhadura:'uma',forma:'disparo',municao:'Dardos condutores',desc:'Atingido fica atordoado por 1 rodada (Fortitude DT Agi evita), uma vez por cena por alvo.'}),
 I('municao','Dardos condutores',1,1,{desc:'Munição da pistola taser.'}),
],
regras:[
 {id:'analisar_perigo',nome:'Analisar Perigo (novo uso de Tática)',desc:'Treinado, DT 15: ação de movimento, uma vez por cena, para +2 em testes e na Defesa até o fim do seu próximo turno (+1 a cada 5 acima da DT).',sempre:true},
 {id:'regalias_veiculos_as09',nome:'Regalias para veículos (assalto)',desc:'Expansão de Veículos Operacionais: Central de Drones (+5 em Tecnologia para drones; guardar/pegar drone como ação livre), Estação de Armas (arma de duas mãos montada, sem penalidade por veículo em movimento) e Lançadores de Fumaça (uma vez por cena, efeito de granada de fumaça).',requer:'veiculos_operacionais'},
],
};
