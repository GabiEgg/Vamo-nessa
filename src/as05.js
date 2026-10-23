// Arquivos Secretos 05 — Transmissão.
const {O,P,PP,T,I}=require('./h');
const TR=(nome,desc)=>PP('transmissao',nome,desc,'','conectar-se ao Sino de Transmissão; só funciona se outro ser também tiver o poder');
module.exports={
origens:[
 O('ufologo','Ufólogo','ciencias,ocultismo','Minha Teoria Absurda','Uma vez por missão com algo a investigar, gaste 10 minutos apresentando sua tese ao grupo (antes de terem as respostas). Se ela se provar correta no fim da missão, recebe +3 PE máximos e atuais.'),
 O('funcionario_estrada','Funcionário de Beira de Estrada','fortitude,intuicao','Turno Invertido','Uma vez por missão, num interlúdio, recebe os benefícios de dormir sem precisar fazê-lo. +2 contra efeitos que deixam inconsciente.'),
],
poderes:[
 P('combatente','Aura de Confiança','Aliados num raio de 18m (não você) recebem +5 em Iniciativa e contra presença perturbadora.'),
 P('especialista','Adepto do Escuro','Ignora camuflagem leve e total por escuridão e recebe +2 em Investigação na penumbra.'),
 P('especialista','Saudosista Hi-Tech','+5 em Tecnologia com aparelhos anteriores aos anos 2000 e consegue fazê-los funcionar com aparelhos modernos.'),
 P('especialista','Fôlego de Emergência','Uma vez por cena, com ameaça presente, ação de movimento para recuperar 1d8+Vig PV ou PE.','',[],{acao:{cura:'1d8+VIG'}}),
 P('especialista','Parede de Carne','Aliados adjacentes recebem cobertura leve (+5 Defesa) do seu corpo.','Vig 3 ou For 3'),
 P('especialista','Treinado nas Telas','Em Iniciativa ou Reflexos, 2 PE para usar Intelecto no lugar de Agilidade.'),
 P('ocultista','Catálogo de Criaturas Ambulante','+5 em Ocultismo para identificar criaturas, mesmo só por vestígios deixados.'),
 P('geral','Apaixonado por Veículos','Treinado em Pilotagem (ou +2). +1d20 em testes para proteger o veículo e, com Veículos Operacionais, +1 regalia extra.','Agi 2',[],{treinaOu2:'pilotagem'}),
 P('geral','Meditação Ocultista','Nova ação de interlúdio, Meditação (uma vez por interlúdio): recupera PE igual ao dobro do limite de PE, ajustado pela condição (precária ×½, confortável ×1,5, luxuosa ×2).','',[],{interludioAcao:'meditar'}),
 P('geral','Ruído de Comunicação','Reação e 4 PE: quando um alvo em alcance curto recebe bônus ou penalidade em dados rolados, inverte o efeito até o fim da cena.'),
 P('geral','Desafiar o Ego','Uma vez por rodada, reação e 1 PE quando um aliado ataca: se acertar, ele causa dano extra igual à sua Presença; se errar, o PE volta.','Pre 2'),
 P('geral','Direção Defensiva','Treinado em Pilotagem (ou +2). Dirigindo, todos no veículo recebem +2 na Defesa e em resistências (o veículo também, com Veículos Operacionais).','',[],{treinaOu2:'pilotagem'}),
 TR('Conexão Comunicativa','Telepatia e localização com outros seres com este poder num raio de 90m; +2 contra efeitos de comunicação dos Alheios por ser com o poder no raio.'),
 TR('Sincronia Conectiva','Reação e 3 PE (todos com o poder) para ficar em sincronia até o fim da cena: escolhe o valor de Iniciativa de qualquer um, sabe os itens e as ações dos outros, pode gastar o PE deles e sofrer dano ou perda no lugar deles (exceto SAN).'),
 TR('Transmissão de Perícia','Uma vez por cena, ação de movimento e 2 PE: usa os valores permanentes de uma perícia de outro ser com o poder em alcance curto até o fim da cena.'),
 TR('Transmissão de Poder','Uma vez por cena, ação de movimento e 3 PE: usa um poder de outro ser com o poder em alcance curto (cujos pré-requisitos cumpra) até o fim da cena.'),
 TR('Transmissão de Ritual','Uma vez por cena, ação de movimento e 3 PE: conjura um ritual de outro ser com o poder em alcance curto (cujos pré-requisitos cumpra) até o fim da cena.'),
],
trilhas:[
 T('criptologista','Criptologista do Oculto','ocultista','Estuda as linguagens usadas para se comunicar com o Outro Lado e ensina aliados a aprimorar súplicas.',[
  ['Método Intuitivo','Recebe Criar Selo (se já tiver, dobra o máximo de selos). Cria 2 selos por ação de interlúdio (+1 por outra habilidade desta trilha).'],
  ['Caligrafia Eficiente','Usar seus selos de rituais desconhecidos exige Ocultismo DT 10 + custo. +5 para identificar rituais.'],
  ['Decifrar à Distância','Usa selos em alcance curto só lendo mentalmente, sem empunhar. +5 para compreender Sigilos e Sinais do Outro Lado.'],
  ['Selo Supremo','Seus selos dispensam teste de Ocultismo; seus rituais em selo têm DT +5, +3 dados de dano e formas avançadas sem custo adicional.']]),
],
itens:[
 I('geral','Câmera Filmadora',0,1,{bonusPericia:{investigacao:2,percepcao:2},desc:'Utensílio: +2 em Investigação e Percepção; serve de lanterna (cone de 9m) ou visão noturna (visão no escuro).'}),
 I('amaldicoado','Faixas da Vidência',3,1,{elemento:'morte',bonusPericia:{intimidacao:2},desc:'Vestimenta: +5 na Defesa e resistências contra o que vier de alcance curto, mas –5 contra o que vier de além de 9m. +2 em Intimidação.'}),
 I('amaldicoado','Joias da Mente',3,1,{elemento:'conhecimento',bonusPericia:{diplomacia:2},desc:'Piercing e brinco (uma vestimenta, só funciona com as duas peças): +2 em Diplomacia e resistência mental 10.'}),
 I('amaldicoado','Larva da Fúria',2,1,{elemento:'sangue',consumivel:true,desc:'Ação de movimento para ingerir: fúria até o fim da cena, +4 em ataque e dano corpo a corpo, mas sem ações de calma (Furtividade, rituais). Termina se passar uma rodada sem atacar nem sofrer efeito hostil.'}),
 I('amaldicoado','Skate Caótico',2,2,{elemento:'energia',defesa:5,desc:'Nos pés (treinado em Acrobacia, Atletismo ou Pilotagem): +3m de deslocamento. Como arma improvisada de duas mãos: 1d12 de impacto, x2. Como escudo: +5 Defesa.'}),
 I('amaldicoado','Tênis Lépidos',3,1,{elemento:'energia',bonusPericia:{atletismo:12},mods:[{alvo:'deslocamento',valor:3}],desc:'Vestimenta: +12 em Atletismo e +3m de deslocamento. 2 PE: até o fim do turno ignora terreno difícil, escala com o deslocamento normal e não sofre dano de quedas de até 9m.'}),
],
regras:[
 {id:'rastrear_trilha_digital',nome:'Rastrear Trilha Digital (novo uso de Tecnologia)',desc:'Veterano: 1d4+1 ações completas para refazer o trajeto de um aparelho eletrônico (DT 20 simples, 25 tortuoso, 30 enigmático).',sempre:true},
 {id:'regalias_veiculos_2',nome:'Novas regalias de veículos',desc:'Expansão de Veículos Operacionais: conversão de alto rendimento (10 dados de combustível), gaiola de proteção (+5 Defesa dos ocupantes, metade do dano de capotamento), indução forçada (deslocamento de manobra +3m), pneus run-flat, óxido nitroso (dobra o deslocamento 1 rodada por cena), multicombustível (+1d20 para achar combustível), snorkel selado, tanques de lastro e vedação hermética (imune a eletricidade).',requer:'veiculos_operacionais'},
 {id:'poderes_transmissao',nome:'Poderes de Transmissão',desc:'Poderes paranormais do elemento Transmissão (conexão com o Sino de Transmissão) que só funcionam quando dois ou mais seres têm o mesmo poder.'},
],
};
