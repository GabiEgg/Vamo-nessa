// Arquivos Secretos 04 — Complexo 0413 / A Produção do Anfitrião.
const {O,P,PP,T,R,I,slug}=require('./h');
const MOD=(nome,aplica,desc,ef={},x={})=>({id:'mod_'+slug(nome)+'_'+aplica,nome,aplica,desc,efeitos:ef,...x});
module.exports={
origens:[
 O('cacador_recompensas','Caçador de Recompensas','crime,investigacao','Quem Não Arrisca, Não Petisca','+2 em testes para resistir a condições mentais e de medo; ao falhar num deles, +1d20 no próximo teste até o fim da cena.',[],{resistMental:2}),
 O('influencer_paranormal','Influencer Paranormal','enganacao,tecnologia','Registrar o Paranormal','Uma vez por cena, ação padrão e 2 PE para registrar (foto, vídeo) uma criatura ou ritual visto na cena. No interlúdio, gaste um registro de criatura para +5 em identificá-la e contra a presença perturbadora dela, ou um registro de ritual para conjurá-lo como se o conhecesse até o próximo interlúdio (1º círculo em NEX 5%, 2º em 45%, 3º em 75%) e +5 para identificá-lo.'),
],
poderes:[
 P('combatente','Chuva de Balas','Pacotes de munição duram o dobro das cenas; rajadas causam +2 dados de dano do mesmo tipo. Com contagem de munição, cada pacote rende +10 ataques. Não vale para foguetes, combustível e granadas 40mm.'),
 P('combatente','Combatente Esforçado','+1 PE por NEX.','For 3 ou Vig 3',[{alvo:'peNex',valor:1}]),
 P('combatente','Treinamento Militarizado','Pode exercitar-se uma vez por interlúdio sem gastar ação; o bônus de exercitar vira 1d8 e também pode ir para rolagens de dano (um por rolagem).','',[],{exercitarDado:'1d8',exercitarGratis:true}),
 P('especialista','Análise Conturbada','Numa investigação, ação padrão para expor teorias obscuras: quem aceitar ouvir (inclusive você) rola 1d6 e recebe o resultado como bônus em testes de Intelecto e Presença até o fim da cena, mas perde o mesmo tanto de SAN.'),
 P('especialista','Profissão Perigo','Ação completa e 4 PE: desmonta um item do inventário e cria um item operacional de categoria e espaços iguais ou menores. Três vezes por missão.'),
 P('especialista','Quase Novo','Ao fazer manutenção no interlúdio, o item recebe +10 PV e uma modificação temporária de categoria que você acesse até o próximo interlúdio.'),
 P('ocultista','Explorador da Névoa','Uma vez por cena, 2 PE para sentir o estado da Membrana. Se estiver danificada ou pior, perde 1 SAN, mas seus rituais custam –1 PE na cena.'),
 P('ocultista','Sinestesia Paranormal','Em cenas com a Membrana danificada ou pior, pode aceitar a sinestesia: perde 1d6 SAN e troca os atributos de dois pares de perícias (só perícias que possa usar). Dura até sair da área; uma vez por dia.'),
 P('ocultista','Terrores Noturnos','Ao dormir no interlúdio, role 1d100: 51+ bons sonhos (+2 PE); 50 ou menos, descanso precário e –1d4 SAN, mas escolhe um poder paranormal ou ritual cujos pré-requisitos cumpra para usar uma vez até o próximo interlúdio.','',[],{dormirD100:true}),
 P('geral','Gororoba','No interlúdio, pode alimentar-se uma vez sem gastar ação e sem ter comida de verdade.','',[],{alimentarGratis:true}),
 P('geral','Ruído Branco','Em ambientes movimentados ou cheios de conversas, +1d6 em Investigação e Percepção. Uma vez por cena, 1 PE para captar uma conversa útil (a critério do mestre).','Int 3'),
 P('geral','Uma Última Olhada','Na última rodada de uma investigação, uma vez por cena, 2 PE: a investigação ganha +1 rodada.'),
 PP('energia','Sobrepor Imprevisível','Uma vez por rodada, no início dela, reação para rolar 1d20: par soma à sua Iniciativa, ímpar subtrai.','Rola 2d20 e escolhe um.'),
 PP('energia','Foco Gravitacional','2 PE: voo 9m até o fim do turno. A cada uso além do primeiro na missão, +10% de chance acumulada de ser jogado 6m para cima e cair (4d6 de impacto).','A chance acumulada cai para 5%.'),
 PP('energia','Traço de Inconsistência','Reação e 2 PE: esconde sua identidade em fotos e vídeos digitais no momento da captura.','Você nunca aparece em imagens digitais e sua voz sai distorcida em gravações.'),
],
rituais:[
 R('Backup','energia',2,'Completa','Curto','Veja texto','1 dia','','Cria uma cópia de Energia com sua aparência que repete movimentos simples e uma frase. Num raio de 5 km, reação para trocar de lugar com ela (perde 2d4 SAN). Dano à cópia ou sair da área dissipa o ritual.','(+3 PE) Duração permanente; ação padrão cobrindo olhos e ouvidos para ver e ouvir pela cópia (fica cego, surdo e pasmo enquanto isso). Requer 3º círculo.','(+7 PE) Como discente, e também fala pela cópia e escolhe a aparência dela; ao trocar de lugar pode dissipar o ritual causando 6d6 de Energia (Reflexos reduz à metade) em alcance curto dos dois pontos. Requer 4º círculo e afinidade.'),
],
trilhas:[
 T('granadeiro_blaster','Granadeiro Blaster','especialista','Nerd de explosivos: poder de fogo nunca é suficiente.',[
  ['Meus Bebês','Treinado em Profissão (químico) (ou +5). Começa cada missão com 1 explosivo autoral (+1 por outra habilidade desta trilha), fora do limite de itens. Explosivos autorais contam 1 categoria abaixo (mínimo 0) e podem ser fabricados em campo.'],
  ['O Calor do Momento','Uma vez por cena, ação padrão e 2 PE (+2 por categoria) para criar um explosivo autoral, que explode no fim da cena se não usado. Pode arremessar granadas 40mm.'],
  ['Fogo Amigo','Recebe Perito em Explosivos (se já tiver: +2 na DT e nos alvos excluídos). A área dos seus explosivos aumenta em +6m.'],
  ['Memória Muscular','Você e aliados adjacentes sacam explosivos autorais como ação livre; 4 PE para usar um como ação de movimento (até em lança-granadas). Explosivos autorais causam o dobro dos dados de dano.']]),
],
itens:[
 I('amaldicoado','Granada Ctrl+C Ctrl+V',2,1,{elemento:'energia',consumivel:true,dano:'8d6',tipoDano:'Energia',alcance:'medio',desc:'Granada de Energia em raio de 6m: 8d6 (Reflexos DT Agi reduz à metade). Ao explodir, role 1d4: se par, surge outra igual dentro da área (até 4 explosões).'}),
 I('explosivo','Granada de Gás Lacrimogêneo',1,1,{consumivel:true,dano:'4d6',tipoDano:'Químico',alcance:'medio',desc:'Raio de 6m: 4d6 de dano químico, enjoado e asfixiado (asfixiado mais 1d4 rodadas ao sair; enjoado até o fim da cena). Fortitude DT Agi reduz à metade e evita enjoado.'}),
 I('explosivo','Granada de Tinta',0,1,{consumivel:true,alcance:'medio',desc:'Raio de 6m: alvos ficam vulneráveis e com –2d20 em Furtividade até o fim da cena (Reflexos DT Agi evita).'}),
 I('arma','Lançador de Granadas',2,2,{alcance:'longo',proficiencia:'pesada',empunhadura:'duas',forma:'fogo',municao:'granada_40mm',desc:'Arma de fogo pesada de duas mãos, alcance longo, sem dano próprio: dispara granadas 40mm (até 6 carregadas, ação de movimento por granada). Acertar o alvo aplica a granada nele e na área; mirar num ponto não exige ataque. Não pode ser automática.'}),
 I('municao','Granada 40mm',1,1,{desc:'Munição do lançador de granadas: cada uma vale um disparo e reproduz o efeito de uma granada do livro básico. Não funciona arremessada.'}),
],
modificacoes:[
 MOD('Adesiva','granada','Gruda no alvo (ataque à distância contra a Defesa; se acertar, ele falha nas resistências contra ela). +I categoria.',{}),
 MOD('Dupla','granada','Ganha o efeito adicional de outra granada de categoria igual ou menor (não amaldiçoada). +I categoria.',{}),
 MOD('Programada','granada','Temporizador: você define em quantos turnos ela ativa. +I categoria.',{}),
],
regras:[
 {id:'tecnologia_info',nome:'Obter Informações (novo uso de Tecnologia)',desc:'Ação completa e Tecnologia DT 5: pesquisa rápida na internet sobre um local ou pessoa, com 1 informação +1 a cada 5 pontos acima da DT.',sempre:true},
 {id:'hacking',nome:'Hacking',desc:'Cena em rodadas contra os Pontos de Segurança (PS) do sistema. Começa com dados virtuais (d6) iguais ao Intelecto. Ações (duas por turno): Procurar Brechas (treinado, DT 15 +5 por tentativa, +1 dado), Quebrar Códigos (gasta dados e causa a soma em PS), Cobrir Rastros e Programar Backdoor (veterano), Plantar Vírus (expert). Imprevistos pelo número de 1 rolados: dor nos pulsos, código mal escrito, rastro detectado (+2d6 PS), invasão detectada.'},
],
};
