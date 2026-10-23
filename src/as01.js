// Arquivos Secretos 01 — Agatha e os Transtornados ("Ritos & Maldições").
const {O,P,PP,T,R,I}=require('./h');
module.exports={
origens:[
 O('ferido_ritual','Ferido por Ritual','ocultismo','Mácula Ritualística','Perícias: Ocultismo e uma conforme o elemento do ritual que o feriu (Fortitude para Sangue, Vontade para Morte e Conhecimento, Reflexos para Energia). Aprende um ritual de 1º círculo desse elemento (fora do limite) e, uma vez por cena, conjura-o sem gastar PE (formas avançadas custam normalmente). Sofre –1d20 em resistência contra efeitos desse elemento.',[],{periciasNota:'+1 conforme o elemento'}),
 O('transtornado_arrependido','Transtornado Arrependido','luta,ocultismo','Sofrimento de Sangue','RD 2 a dano mental, +1 para cada dois rituais ou poderes paranormais de Sangue que possuir. Os pesadelos pioram sua condição de descanso em uma categoria.',[],{descansoPior:1}),
],
poderes:[
 P('ocultista','Acostumado a Maldição de Elemento','Escolha um elemento (exceto Medo): ao falhar num teste ligado ao preço de maldição de itens desse elemento, não perde Sanidade (outros efeitos negativos continuam).','Int 2, conjurar ritual de 2º círculo do elemento'),
 P('ocultista','Reter Ritual de Combate','Ritual retido que afeta negativamente um alvo pode virar duração cena como reação quando ele sai da linha de efeito. Ao sofrer condição que interrompe a retenção, reação e 1 PE por ritual para mudar a duração para cena. Exige a regra opcional Reter Ritual.','Int 2, conjurar ritual de 1º círculo',[],{regra:'reter_ritual'}),
 P('ocultista','Ritual Intenso','Soma sua Presença nas rolagens de dano e de cura dos seus rituais.','Pre 2'),
 P('ocultista','Saúde Sobrenatural','Uma vez por cena, ação de movimento e 3 PE: recebe PV temporários iguais a Presença x10 (somem no fim da cena, não acumulam consigo mesmos).','Int 2, Pre 2, conjurar ritual de 1º círculo',[],{acao:{pe:3,pvTemp:'PRE*10'}}),
 P('geral','Cicatrizes Expostas','Ação de movimento para expor sua cicatriz até o fim da cena: +1d8 de dano do mesmo tipo, mas –1d20 em Vontade e testes que exijam calma. Vale também se outro ser a expuser.','ter cicatrizes'),
 P('geral','Curiosidade Oculta','Treinado em Ocultismo (ou +2 se já for). Em testes de Vontade, gaste 2 PE para usar Ocultismo no lugar.','Int 2',[],{treinaOu2:'ocultismo'}),
 P('geral','Especialista Esotérico','Ao conjurar um ritual, combina os efeitos de até três catalisadores ritualísticos diferentes.','Int 3, conjurar ritual de 2º círculo, Domínio Esotérico'),
 P('geral','Habilidade Aprimorada','Escolha uma habilidade ou ritual com DT: a DT aumenta em +2. Repetível para outras escolhas; duas vezes na mesma dá +5 no total.','',[],{repetivel:true}),
 P('geral','Instintos Urbanos','Treinado em Crime (ou +2 se já for). Ao entrar num ambiente fechado, Crime DT 20 identifica uma rota de fuga: ação de movimento extra no primeiro turno da fuga e +2 Defesa até fugir (ou +2 Defesa enquanto estiver lá, se não houver rota).','Agi 2',[],{treinaOu2:'crime'}),
 PP('sangue','Ferro Maculado','Ação de movimento e 2 PV: amaldiçoa 1 projétil de munição, que causa +1d6 de dano de Sangue uma vez.','O dano muda para +1d8.'),
 PP('sangue','Placas Sanguinolentas','Ao conjurar um ritual de Sangue, recebe bônus na Defesa igual ao círculo do ritual até o início do seu próximo turno.','O bônus passa a círculo +2.','conjurar ritual de Sangue'),
 PP('sangue','Sangue Corrosivo','Ação de movimento e 1 PE: até o fim da cena, quando um ser adjacente lhe causa dano, ele sofre 1d10 de dano de Sangue.','O dano passa a 2d10.'),
 PP('sangue','Sangue Prazeroso','Enquanto machucado, recebe RD 5.','Enquanto machucado, também recebe +20 PV temporários uma vez por cena.','Sangue 1'),
],
trilhas:[
 T('maledictologo','Maledictólogo','ocultista','Estuda maldições de itens para compreendê-las, transferi-las e reproduzi-las.',[
  ['Identificação Macabra','Ao identificar item amaldiçoado ou ritual, 1 PE para +1d10. Identificar item amaldiçoado como ação completa impõe só –1d20.'],
  ['Compreensão de Maldições','Ação de interlúdio e 3 PE para estudar um item amaldiçoado: Ocultismo DT 10 +5 por categoria. Falha: perde 2d4+2 SAN. Sucesso: perde 1d4+1 SAN e aprende o ritual contido (fora do limite) ou transfere as maldições para outro item ou para uma tatuagem (uma por pessoa).'],
  ['Reproduzir Maldição','Ação de interlúdio e 3 PE para memorizar uma maldição já vista. Outra ação de interlúdio e 3 PE a aplica num item até o fim da missão: Ocultismo DT 10 +5 por categoria (falha: –2d8+2 SAN; sucesso: –1d8+1 SAN). Categoria máxima IV.'],
  ['Maldição Suprema','Ao Reproduzir Maldição, considera o item três categorias abaixo.']]),
],
rituais:[
 R('Passagem de Conhecimento','sangue',2,'Completa','Toque','1 pessoa','Cena','Vontade evita','Transfere sua consciência para o corpo do alvo: ou o domina (seu corpo cai inconsciente; usa os atributos físicos dele; ele repete o teste no início de cada turno para retomar o controle) ou troca de corpo com ele (cada um usa a própria ficha com os atributos físicos do outro). Morrer no corpo ocupado mata quem o ocupa.','+3 PE: alcance curto e duração 1 dia; no domínio, o alvo só tenta retomar o controle uma vez por dia ou por cena. Requer 2º círculo.','+7 PE: alcance médio e duração permanente; no domínio, só tenta uma vez por ano. Requer 4º círculo e afinidade.',{elementos:['sangue','conhecimento']}),
 R('Passagem de Conhecimento Expandido','sangue',4,'1 dia','Curto','2 a 10 pessoas (número par)','Permanente','','Versão criada por Agatha: dois grupos trocam de consciência, escolhendo os corpos por intenção. Os personagens assumem atributos e habilidades do novo corpo; memórias voltam aos poucos e, ao ficar perturbado, enlouquecendo ou insano, role 1d4 (no 1, as intenções do corpo assumem por 1d4 rodadas). Só pode ser aprendido por quem conjura Passagem de Conhecimento.','','',{elementos:['sangue','conhecimento']}),
],
itens:[
 I('paranormal','Agrupador Ritualístico',2,1,{desc:'Prende até quatro componentes ou catalisadores (ação padrão cada); empunhando o agrupador, todos contam como empunhados.'}),
 I('paranormal','Amuleto Sinalizador de (elemento)',2,1,{desc:'Vestido, emite um sinal (gotas vermelhas, fumaça, luz dourada ou mudança de cor) quando criatura do elemento entra em alcance longo.'}),
 I('paranormal','Rubra',2,1,{consumivel:true,desc:'Droga paranormal. Ação de movimento numa ferida aberta: +5 em testes de Força, Agilidade e Vigor e 10 PV temporários até o fim da cena; depois perde 1d3 pontos de atributos físicos até dormir. Vontade DT 15 (+2 por uso anterior) ou fica insano 1d3 rodadas atacando quem estiver perto; falhar por 10+ destrói a mente.',acao:{pvTemp:'10'}}),
 I('amaldicoado','Arpão do Pescador',1,1,{elemento:'sangue',dano:'1d8+1d12',critico:'x3',alcance:'curto',tipoDano:'Perfuração + Sangue',proficiencia:'simples',empunhadura:'uma',forma:'corpo',arremesso:true,desc:'Arma simples de uma mão, arremessável em alcance curto. 1d8 de perfuração +1d12 de Sangue. Arremessado e acertando, o alvo fica lento até remover o arpão (ação padrão e Atletismo DT For).'}),
 I('amaldicoado','Combustível de Sangue',2,1,{elemento:'sangue',desc:'Munição para lança-chamas ou galões: o dano vira Sangue e todos os dados sobem uma categoria (d6 vira d8).'}),
 I('amaldicoado','Marreta Transtornada',3,2,{elemento:'sangue',dano:'2d10+2d12',critico:'x4',tipoDano:'Impacto + Sangue',proficiencia:'tatica',empunhadura:'duas',forma:'corpo',desc:'Arma tática de duas mãos: 2d10 de impacto +2d12 de Sangue. Ao empunhar ou atacar, perde 1d6 PV. Crítico: Fortitude (DT For) ou o alvo fica fraco (debilitado se já estiver) até cuidados num interlúdio.'}),
],
regras:[
 {id:'transcender_itens',nome:'Transcender com Itens',desc:'Transcender passa a usar itens amaldiçoados: no interlúdio, num símbolo de Transcender, o personagem responde com sinceridade a uma pergunta da entidade e recebe um poder paranormal do elemento do item, que se torna mundano. Limite de poderes por itens: 1 (NEX até 25%), 2 (até 50%), 3 (até 75%), 4 (até 99%). Não recomendado junto do poder Transcender.'},
 {id:'reter_ritual',nome:'Reter Ritual',desc:'Rituais de duração cena podem ter duração retida: os PE ficam presos (saem do atual e do máximo) e o ritual dura enquanto você os retiver, perdendo 1 SAN ao reter. Soltar devolve o máximo, não o atual; ou gaste uma ação padrão e Ocultismo (DT 20 + custo) para recuperar ambos. Condições como atordoado, exausto e pasmo interrompem a retenção.'},
 {id:'blindar_mente',nome:'Blindar a Mente (novo uso de Ocultismo)',desc:'Veterano, DT 20: ação completa e 1 PE para receber +5 no próximo teste de Vontade na cena. Para um aliado adjacente, DT 25, e ele faz Vontade DT 20 ou perde 1d4 SAN e não recebe o bônus.',sempre:true},
],
};
