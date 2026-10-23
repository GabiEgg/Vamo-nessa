// Ordem Paranormal RPG — parte 8: aliados e regras opcionais (cap. 6).
module.exports={
aliados:[
 {id:'acolito',nome:'Acólito',desc:'Pessoa envolvida com o paranormal que auxilia em rituais.',bonus:'+1d20 em Ocultismo e dispensa manipular componentes ritualísticos.',bonusEf:{dadosPer:{ocultismo:1}},habilidade:'Conjuração Conjunta: ao conjurar um ritual, 1 PE para +2 na DT dele.',habPE:1},
 {id:'faz_tudo',nome:'Faz-Tudo',desc:'Pessoa prática e treinada em uma ou mais perícias.',bonus:'Treinado em duas perícias à escolha (exceto Luta e Pontaria).',bonusEf:{treinaEscolha:2},habilidade:'Dica Valiosa: 1 PE para +1d6 num teste de uma dessas perícias.',habPE:1,habDado:'1d6'},
 {id:'guerrilheiro',nome:'Guerrilheiro',desc:'Soldado, policial ou outro combatente armado.',bonus:'+1d20 em testes de ataque.',bonusEf:{dadosAtaque:1},habilidade:'Ataque Conjunto: 1 PE ao atacar; se acertar, +1d8 de dano.',habPE:1,habDado:'1d8'},
 {id:'socorrista',nome:'Socorrista',desc:'Médico, enfermeiro ou alguém treinado em primeiros socorros.',bonus:'Considerado treinado em Medicina.',bonusEf:{treina:['medicina']},habilidade:'Bolsa de Remédios: 1 PE para curar 1d8+1 PV seu ou de um aliado adjacente.',habPE:1,habCura:'1d8+1'},
],
regras:[
 {id:'nex0',nome:'Personagens de NEX 0%',desc:'Pessoas comuns: 3 pontos de atributo em vez de 4, classe Mundano e equipamento de um item de categoria I mais itens de categoria 0 coerentes com a origem (sem patentes). Ao chegar a NEX 5%, escolhe uma classe após treinamento e recebe +1 ponto de atributo e os ganhos da classe.',efeito:{pontosAttr:-1,nex0:true}},
 {id:'idade',nome:'Personagens de idade variada',desc:'Cada faixa etária dá modificadores: Criança (For e Vig 0, máximo 1; Pequeno, deslocamento 6m; um benefício de origem; +2 Defesa e +5 em resistência), Adolescente (For 0, máximo 2; dois benefícios de origem; +5 PE), Jovem (normal), Adulto (+1 poder de classe; 1 desvantagem), Maduro (+5% NEX; 2 desvantagens), Idoso (+10% NEX; não aumenta Agi, For ou Vig; 3 desvantagens).',efeito:{idade:true}},
 {id:'contagem_municao',nome:'Contagem de munição',desc:'Cada pacote tem munição para 20 ataques; armas de fogo têm capacidade (pistola 12, revólver 6, fuzil de caça 4, submetralhadora 20, espingarda 6, fuzil de assalto 30, fuzil de precisão 1, metralhadora 50) e recarregar é uma ação de movimento. Rajada gasta 10 balas e causa +2 dados.',efeito:{municao:true}},
 {id:'lesoes',nome:'Lesões',desc:'Ao iniciar um turno morrendo pela segunda vez na cena, Vigor DT 10; se falhar, perde 1 ponto de atributo permanente (1d6: Agi, For, Int, Pre, Vig; 6 não perde).'},
 {id:'inspiracao_resoluta',nome:'Inspiração resoluta',desc:'Quando um personagem morre, seu jogador rola 1d10 no início de cada rodada até o fim da cena e dá o efeito a outro personagem: 1-2 +5 em ataques contra o assassino; 3-4 +2 For e uma ação padrão extra; 5-6 resistência mental 10; 7-8 recupera 4d8+4 PV e 2d6 PE; 9-10 encerra efeitos de paralisia e dá uma ação padrão extra.'},
 {id:'loucura_nao_letal',nome:'Loucura não letal',desc:'Um personagem insano continua com o jogador, sofrendo um efeito severo e irreversível (1d6): a culpa é toda sua, euforia catatônica, alucinações, fúria homicida, amnésia paranormal ou descontrole mortal.'},
],
desvantagensIdade:[
 {id:'catarata',nome:'Catarata',desc:'–5 em Percepção e Pontaria.',mods:[{alvo:'per:percepcao',valor:-5},{alvo:'per:pontaria',valor:-5}]},
 {id:'definhamento',nome:'Definhamento',desc:'–5 em Fortitude e em manobras de combate.',mods:[{alvo:'per:fortitude',valor:-5}]},
 {id:'devagar',nome:'"Devagar, Jovem!"',desc:'–3m de deslocamento e não pode fazer investidas.',mods:[{alvo:'deslocamento',valor:-3}]},
 {id:'distraido',nome:'Distraído',desc:'Surpreendido na primeira rodada de cenas de ação e perde o primeiro turno em investigações.'},
 {id:'fragil',nome:'Frágil',desc:'Perde 2 PV por NEX.',mods:[{alvo:'pvNex',valor:-2}]},
 {id:'gota',nome:'Gota',desc:'Testes de Agilidade ou esquiva causam 1d6 de dano a você.'},
 {id:'juntas_duras',nome:'Juntas Duras',desc:'–5 em Acrobacia e Reflexos.',mods:[{alvo:'per:acrobacia',valor:-5},{alvo:'per:reflexos',valor:-5}]},
 {id:'melancolico',nome:'Melancólico',desc:'Perde 1 PE por NEX.',mods:[{alvo:'peNex',valor:-1}]},
 {id:'no_meu_tempo',nome:'"No Meu Tempo"',desc:'–5 em Intuição e Vontade.',mods:[{alvo:'per:intuicao',valor:-5},{alvo:'per:vontade',valor:-5}]},
 {id:'pulmao_ruim',nome:'Pulmão Ruim',desc:'Testes de Força causam 1d6 de dano a você; não prende a respiração; investidas o deixam fatigado.'},
 {id:'rabugento',nome:'Rabugento',desc:'–5 em testes de Presença e perícias de Presença, exceto Intimidação.',mods:['adestramento','artes','diplomacia','enganacao','intuicao','percepcao','religiao','vontade'].map(p=>({alvo:'per:'+p,valor:-5}))},
 {id:'recurvado',nome:'Recurvado',desc:'Considerado Pequeno, sem o bônus de Furtividade.'},
 {id:'sono_ruim',nome:'Sono Ruim',desc:'Descanso sempre uma categoria pior.'},
 {id:'teimoso',nome:'Teimoso',desc:'Não pode receber nem fornecer bônus por ajuda.'},
 {id:'tosse',nome:'Tosse',desc:'Em ação e investigação, 1 em 1d6 no início da rodada perde o turno; em interpretação, 1 em 1d6 dá –5 em testes de Presença.'},
],
classes:[
 {id:'mundano',nome:'Mundano',pvBase:8,pvNex:0,peBase:1,peNex:0,sanBase:8,sanNex:0,periciasFixas:[],periciasEscolha:'',periciasLivres:1,grau:0,ritInicial:0,ritNex:0,regra:'nex0',
  proficiencias:'Armas simples.',desc:'Pessoa comum com uma vida normal — por enquanto. Só disponível com a regra de NEX 0%.',
  habilidades:[{nex:0,nome:'Empenho',desc:'Ao fazer um teste de perícia, gaste 1 PE para receber +2.'}]},
],
};
