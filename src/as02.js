// Arquivos Secretos 02 — Hexatombe ("na sua mesa": Mascarados e agentes).
const {P,PP,R,I,slug}=require('./h');
const MOD=(nome,aplica,desc,ef={},x={})=>({id:'mod_'+slug(nome)+'_'+aplica,nome,aplica,desc,efeitos:ef,...x});
const AL=(id,nome,desc,bonus,habilidade,x={})=>({id,nome,desc,bonus,habilidade,...x});
module.exports={
poderes:[
 // Aguiar
 P('geral','Revidar Violento','Pode fazer uma segunda reação especial de defesa na mesma rodada, desde que seja um contra-ataque.','For 2 ou Agi 2'),
 P('combatente','Predador Perfeito','Uma vez por rodada, 5 PE para uma ação padrão adicional que precisa ter intenção de causar dano.','veterano em Luta ou Pontaria e Sobrevivência'),
 PP('sangue','Predador de Sangue','Ação padrão e 3 PE com uma fonte do odor da vítima: memoriza-a e recebe +1d20 para rastreá-la, percebê-la e atacá-la. Uma vítima por vez.','Pode memorizar até três vítimas ao mesmo tempo.',''),
 // Dalmo
 P('geral','Corpo Fechado','Pode fazer uma segunda reação especial de defesa na mesma rodada, desde que seja um bloqueio.','Vig 2'),
 P('combatente','Golpes de Arena','Ao acertar um ataque desarmado, 2 PE para outro ataque desarmado ou uma manobra contra o mesmo alvo.','treinado em Luta'),
 PP('energia','Pressão Atmosférica','Ao acertar corpo a corpo um alvo agarrado, 2 PE: +1d10 de dano de Energia e o alvo fica atordoado 1 rodada (Fortitude DT For evita). Uma vez por cena por ser.','O alvo também fica caído e sangrando, sem teste.'),
 // Jae-Yoon
 P('geral','Esquiva Tática','Pode fazer uma segunda reação especial de defesa na mesma rodada, desde que seja uma esquiva.','Agi 2'),
 P('especialista','Assassinato Furtivo','O dano do Ataque Furtivo aumenta em +1d6; ao acertar um furtivo, 2 PE para mudar os dados furtivos de d6 para d8.','Ataque Furtivo'),
 PP('conhecimento','Zona dos Sussurros','Ação completa e 3 PE: marca um cômodo pequeno com símbolos "X". Ali recebe +5 em ataques e não sofre penalidade de Furtividade após atacar ou agir de forma chamativa. Máximo de três áreas.','Contra alvo desprevenido ou flanqueado (corpo a corpo ou alcance curto), rola de novo dados de dano com 1 ou 2.','Conhecimento 1'),
 // Kemi
 P('geral','Palpite Confiante','Em testes de perícia de Intelecto ou Presença, 1 PE para somar o Intelecto ao teste.','Int 2'),
 P('especialista','Especialista em Matar','Mirar e fintar exigem uma ação a menos. Depois de fazer uma delas, até seu próximo turno, ao atacar gaste 2 PE para +5 no ataque ou no dano (NEX 40%: 3 PE para +10; NEX 70%: 4 PE para +15, divididos como quiser).','treinado em Luta ou Pontaria, Perito'),
 PP('morte','Disparo da Morte','Antes de um ataque com arma de fogo ou de disparo, 2 PE para +2 na margem de ameaça.','O ataque ignora cobertura leve e 10 de RD do alvo.'),
 // Jasper
 P('geral','Especialista em Correntes','Ação completa para acorrentar um item ao corpo (seu ou de aliado ao toque): não pode ser desarmado sem quebrar a corrente. +3m de alcance corpo a corpo e +2 em manobras com correntes e itens acorrentados. Cada item preso além do primeiro dá –1 em perícias de carga.','Agi 2'),
 P('geral','Puxar pra Briga','Ao acertar com corrente, chicote ou corda, 2 PE para puxar o alvo para um espaço adjacente. Se ele se afastar por vontade própria, sofre –1d20 em ataques contra outros alvos por 1 rodada.','For 2 ou Agi 2, treinado em Luta, Especialista em Correntes'),
 // Lena
 P('geral','Prática com Materiais Ritualísticos','Na conjuração complexa, não sofre –1d20 por usar materiais de uma Entidade na 1ª etapa.','Int 2, treinado em Ocultismo, conjurar rituais'),
 P('ocultista','Dominar Habilidade Ritualística','Recebe a primeira habilidade de outra trilha de ocultista (ou a segunda, se já a tiver por Versatilidade), respeitando o NEX. Pode ser escolhido uma segunda vez para a habilidade seguinte.','Escolhido pelo Outro Lado',[],{repetivel:true}),
 // Maria
 P('geral','Estágio Terminal','Uma vez por rodada, enquanto machucado, 2 PE para uma ação de movimento extra.','Agi 2'),
 P('geral','Kian Vai Nos Salvar','A critério do mestre, quando sua fé em Kian o motiva num desafio, conjura um ritual de Conhecimento de 1º círculo (2º a partir de NEX 25%, 3º a partir de 55%) como se o conhecesse, até o fim da cena. Um ritual por cena.','Pre 2, conjurar rituais, adorar o Kian'),
 P('geral','Tratamento de Emergência','Ação padrão e 2 PE: um ser ao toque recebe 2d10+10 PV temporários; ao perdê-los, fica fraco até o fim da cena. Uma vez por cena por alvo.','Int 2, treinado em Medicina',[],{acao:{pe:2,pvTemp:'2d10+10'}}),
 // Remi
 P('geral','Arte da Música Macabra','Ação padrão e 2 PE, 1 ser em alcance curto que ouça: próximo dano +5, ou próximo ataque +2 na margem, ou próximo teste de ataque +5, ou +9m no alcance do próximo ataque ou habilidade.','Pre 2, treinado em Artes e Ocultismo, conjurar rituais'),
 P('geral','Sintonização Mental com Arma','Ação de interlúdio e 3 PE com uma arma empunhada: até o próximo interlúdio ela usa o atributo que você escolher em ataque e dano.','Int 2 ou Pre 2, treinado em Ocultismo, conjurar rituais',[],{interludio:{pe:3}}),
 P('geral','Sintonização Mental com Proteção','Ação de interlúdio e 3 PE com uma proteção vestida: até o próximo interlúdio ela usa o atributo que você escolher na Defesa (em vez de Agilidade) e você não fica em condição ruim ou terrível para conjurar.','Int 2 ou Pre 2, treinado em Ocultismo, conjurar rituais',[],{interludio:{pe:3}}),
 // Tuco
 P('geral','Movimentação Tática','Ao se mover em direção a uma cobertura ou inimigo, 1 PE para percorrer o dobro do deslocamento.','For 2, treinado em Atletismo e Tática'),
 P('geral','Instintos Táticos','Imune a desprevenido. Ao causar dano, 2 PE para o alvo falhar automaticamente em Furtividade contra você por 1 rodada.','Pre 2, treinado em Percepção e Tática'),
 P('combatente','Marteladas','Ação completa e 3 PE: três ataques desarmados contra o mesmo alvo, somando o dano dos acertos numa única instância.','For 2, treinado em Luta, Artista Marcial'),
 // Juan
 P('ocultista','Liturgia de Fortalecimento Ritualístico','Ação de interlúdio e 2 PE: a DT de um ritual que conhece aumenta em +2 até o próximo interlúdio.','Int 2 e Pre 2',[],{interludio:{pe:2}}),
 PP('sangue','Engolir Sangue','Ação completa para consumir uma porção de carne humana (1 espaço): recupera 2d8+2 PV e perde 1d4 SAN.','A cura muda para 4d8+4 PV.'),
],
rituais:[
 R('Mapa Sanguíneo','sangue',2,'Padrão','Toque','1 superfície','Cena','Vontade evita','Desenha com sangue um mapa que marca em tempo real os seres num raio de 1 km.','(+3 PE) Também mostra o estado de saúde de quem falhar: ileso, ferido, machucado ou morrendo.'),
 R('Capturar Momento','morte',2,'Padrão','Médio','Esfera de 18m de raio','Permanente até dissipado','','Marca um símbolo invisível (Intuição ou Ocultismo contra a DT para notar) que capta imagens e sons a 18m; ação padrão para ver e ouvir de longe. Até três símbolos.','(+3 PE) Ação padrão para explodir o símbolo: 4d8 de Morte em quem estiver nele (Fortitude reduz à metade).','(+7 PE) A explosão causa 8d8. Requer 3º círculo.',{dano:'',danoD:'4d8',danoV:'8d8',tipoDano:'Morte'}),
 R('Labirinto Mental','conhecimento',2,'Padrão','Médio','1 pessoa','1d4 rodadas','Vontade evita','A mente do alvo fica presa num labirinto: ele gasta as ações se movendo em direção aleatória e repete o teste no início de cada turno.','(+3 PE) Alcance longo.','(+7 PE) Alcance longo e duração cena (ainda repete o teste). Requer 3º círculo.'),
 R('Rajada Caótica','energia',2,'Padrão','Médio','1 ser','Instantânea','Reflexos reduz à metade','Dispara um raio de estática caótica: 8d6 de dano de Energia.','(+3 PE) O dano vira 8d8.','(+7 PE) Duração cena: 8d10 e, nos turnos seguintes, ação padrão para outro raio igual. Requer 3º círculo.',{dano:'8d6',danoD:'8d8',danoV:'8d10',tipoDano:'Energia'}),
],
itens:[
 I('geral','Bandagem',1,0.5,{consumivel:true,cura:'2d4+2',desc:'Ação padrão: cura 2d4+2 PV e remove sangrando (você ou ser adjacente). Com uma dose de álcool, cura 2d8+2.'}),
 I('geral','Bússola',1,1,{bonusPericia:{sobrevivencia:5},desc:'Utensílio: +5 em Sobrevivência para se orientar.'}),
 I('geral','Caixa de Ferramentas',1,2,{bonusPericia:{profissao:5},desc:'Utensílio: +5 em Profissão quando as ferramentas ajudarem.'}),
 I('geral','Dose de Álcool',1,0.5,{consumivel:true,desc:'Ação padrão: +2 contra infecções e doenças de contato. Com bandagem, a cura sobe para 2d8+2. Inflamável.'}),
 I('geral','Incenso',1,0.5,{consumivel:true,desc:'Ação de interlúdio: todos na cena de interlúdio recuperam 1d4 PE (uma vez por dia).',interludioPE:'1d4'}),
 I('geral','Kit de Escalada',1,2,{bonusPericia:{atletismo:5},desc:'Utensílio: +5 em Atletismo para escalar.'}),
 I('geral','Pedra de Amolar',1,0.5,{consumivel:true,desc:'Ação de interlúdio: uma arma corpo a corpo de corte ou perfuração causa +1d4 na primeira cena em que for usada.'}),
 I('amaldicoado','Machado do Mutilador',4,1,{elemento:'sangue',dano:'1d8+1d8',critico:'x3',tipoDano:'Corte + Sangue',proficiencia:'tatica',empunhadura:'uma',forma:'corpo',desc:'Arma tática de uma mão: 1d8 de corte +1d8 de Sangue (multiplicado no crítico). Ao acertar, 1 PE deixa o alvo sangrando (acumulativo, 1d6 por sangramento).'}),
 I('amaldicoado','Elmo do Colosso',3,3,{elemento:'energia',desc:'Vestimenta: RD 10. Com o resto de um equipamento de escafandro, conta como traje de mergulho.',rd:10}),
 I('amaldicoado','Manoplas do Colosso',4,3,{elemento:'energia',dano:'1d8+1d10',critico:'x3',tipoDano:'Impacto + Energia',proficiencia:'tatica',empunhadura:'uma',forma:'corpo',desc:'Par de manoplas (só funcionam juntas), cada uma arma tática de uma mão: 1d8 de impacto +1d10 de Energia. Contam como ataque desarmado para regras e efeitos.'}),
 I('amaldicoado','Punhal X',4,1,{elemento:'conhecimento',dano:'1d4+1d6',critico:'19/x3',alcance:'curto',tipoDano:'Perfuração + Conhecimento',proficiencia:'simples',empunhadura:'uma',forma:'corpo',agil:true,arremesso:true,desc:'Arma simples ágil e arremessável: 1d4 de perfuração +1d6 de Conhecimento. 2 PE ao atacar deixam o alvo desprevenido e, se acertar, cego 1 rodada (uma vez por cena por alvo).'}),
 I('amaldicoado','Sniper Fantasma',4,2,{elemento:'morte',dano:'2d10+3d4',critico:'19/x3',alcance:'longo',tipoDano:'Balístico + Morte',proficiencia:'tatica',empunhadura:'duas',forma:'fogo',desc:'Fuzil tático de duas mãos: 2d10 balístico +3d4 de Morte. Veterano em Pontaria mirando: +5 na margem. Quem cai a 0 PV por ela morre ao iniciar 2 turnos morrendo.'}),
 I('amaldicoado','A Antena',4,2,{elemento:'conhecimento',dano:'1d6',critico:'x2',tipoDano:'Impacto',proficiencia:'simples',empunhadura:'duas',forma:'corpo',atk:'-1d20',desc:'Arma simples improvisada de duas mãos (–1d20 no ataque). A DT dos seus rituais aumenta em +3. Pode armazenar um ritual conjurado e liberá-lo depois com uma ação padrão, sem custo.',mods:[{alvo:'dtRitual',valor:3}]}),
 I('paranormal','Catalisador Sofisticado e Horrorizado',3,1,{desc:'Catalisador vestível que não é consumido. Uma vez por cena recebe 3d6; ao conjurar, gaste 1d6 (um por ritual) para +1d6 no dano, na cura ou na DT do ritual. Os não usados somem no fim da cena.'}),
 I('amaldicoado','Faca Predadora',4,1,{elemento:'sangue',dano:'1d4+2d10',critico:'19/x3',alcance:'curto',tipoDano:'Perfuração + Sangue',proficiencia:'simples',empunhadura:'uma',forma:'corpo',agil:true,arremesso:true,desc:'Arma simples ágil e arremessável: 1d4 de perfuração +2d10 de Sangue. 2 PE ao atacar: se acertar, cura 2d10 PV; o excesso vira PV temporário.'}),
],
modificacoes:[
 MOD('Encaixe','corpo','Arma corpo a corpo de uma mão (leve, simples ou tática) que pode se acoplar a outra com Encaixe (ação de movimento): vira arma tática de duas mãos, +1 dado de dano, +1 na margem ou no multiplicador, espaços dobrados, e ainda conta para Combater com Duas Armas.',{}),
],
aliados:[
 AL('aguiar','Aguiar','Policial e serial killer.','+1d20 em testes de ataque.','Investigador e Caçador: 1 PE para +1d8 em Investigação ou Sobrevivência para pistas e rastros.',{bonusEf:{dadosAtaque:1},habPE:1,habDado:'1d8'}),
 AL('dalmo','Dalmo Magno','Motorista e lutador de arena.','Sempre que causar dano, +1d10 de dano de Energia.','Motorista Veterano: 2 PE para treinamento em Pilotagem até o fim da cena (ou +1d20 se já for treinado).',{habPE:2}),
 AL('jae_yoon','Park Jae-Yoon','Influencer e serial killer.','Pode usar Ataque Furtivo (se já tiver, +1d6 de dano furtivo).','Figura Influente: 3 PE para rolar de novo Diplomacia, Enganação ou Intimidação.',{habPE:3}),
 AL('kemi','Kemi','Atiradora de elite.','Sempre que causar dano, +3d4 de Morte que ignora 10 de RD.','Movimentação de Atiradora: uma vez por rodada, após ataque à distância, 2 PE para uma ação de movimento extra.',{habPE:2}),
 AL('labirinto','Labirinto','Ocultista com poderes que nem ele entende.','Uma vez por dia, +2d4 PE atuais e máximos até o fim do dia.','Labirinto para o Outro Lado: 2 PE para +3 na DT das suas habilidades até o fim da cena (cumulativo).',{habPE:2}),
 AL('jasper','Jasper','Defensor contra o paranormal e combatente letal.','Resistência a dano paranormal 5.','Letalidade do Ceifador: 2 PE para +2 na margem de ameaça de um ataque.',{habPE:2}),
 AL('lena','Lena Viegas','Ocultista de conhecimento amplo.','+1d20 em Ocultismo e Vontade.','Versatilidade Mística: 3 PE para ter os efeitos de um Catalisador Sofisticado e Horrorizado até o fim da cena.',{bonusEf:{dadosPer:{ocultismo:1,vontade:1}},habPE:3}),
 AL('maria','Maria','Profissional de saúde de métodos duvidosos.','+1d20 em Medicina.','De Onde Veio Isso?: pode usar o poder Kian Vai Nos Salvar.',{bonusEf:{dadosPer:{medicina:1}}}),
 AL('remi','Remi','Músico e conjurador perturbado.','+1d20 em Artes e Ocultismo.','Sintonização e Sincronia: pode usar Sintonização Mental com Arma e com Proteção.',{bonusEf:{dadosPer:{artes:1,ocultismo:1}}}),
 AL('tuco','Tuco','Máquina militar de tática e pancadaria.','+1d20 em Luta e +1d6 no dano corpo a corpo.','Instintos Militares de Combate: pode usar o poder Instintos Táticos.',{bonusEf:{dadosPer:{luta:1}}}),
 AL('juan','Juan Davo','Ocultista de Sangue temido.','+1d20 em Intimidação e Ocultismo.','Ligado ao Sangue: conjura Armadura de Sangue e Descarnar como se os conhecesse (ou –1 PE se já conhece).',{bonusEf:{dadosPer:{intimidacao:1,ocultismo:1}}}),
],
regras:[
 {id:'recursos_hexatombe',nome:'Procurar recursos (Hexatombe)',desc:'Em exploração, um teste de Sobrevivência ou Percepção encontra itens de recurso (comida, munição, bandagem, bússola, pedra de amolar etc.) conforme o resultado e uma rolagem de 1d12. Teste de jornada: DT 20 ou maior, um testa e os demais ajudam.'},
 {id:'mascaras',nome:'As Máscaras (forma suprema)',desc:'Com o mestre, o personagem ganha uma "forma suprema" ligada a um item. Ativar custa 1 ação de movimento e 6 SAN (+2 SAN por rodada adicional): +20 PV e +10 PE atuais e máximos, +10 Defesa, +2 dados em todos os danos, +5 em todos os testes, +5 na DT das habilidades e até 3 habilidades novas ou aprimoradas. Desativar é ação livre; se ficar com menos de 20 PV, cai a 0 e morrendo. Ficar insano nessa forma transforma o personagem em NPC.',efeito:{formaSuprema:{pv:20,pe:10,defesa:10,testes:5,dt:5,san:6}}},
 {id:'poderes_intencao',nome:'Poderes de Intenção',desc:'Poderes paranormais do elemento Intenção (contato com a Coroa de Espinhos): não gastam PE e só podem ser usados após um gatilho narrativo (por exemplo, ser ferido três vezes, testemunhar uma morte, ouvir o grito de um aliado morrendo). Usar consome o gatilho.'},
],
};
