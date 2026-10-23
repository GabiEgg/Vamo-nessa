// Arquivos Secretos 06 — Indústrias Panacea.
const {O,P,PP,R,I}=require('./h');
module.exports={
origens:[
 O('cientista_panacea','Cientista Ex-Panacea','atualidades,ciencias','Existe uma Explicação','Ao fazer um teste de Ocultismo, gaste 2 PE para usar Ciências no lugar.'),
 O('cobaia','Cobaia Sobrevivente','fortitude,vontade','Forças para Enfrentar','Em cenas ligadas ao seu trauma como cobaia, a critério do mestre, fica abalado; mas pode gastar 2 PE para ficar imune a efeitos de medo até o fim da cena.'),
 O('seguranca_panacea','Segurança Ex-Panacea','luta,pontaria','Técnicas de Contenção','Ao fazer uma manobra de combate, gaste 2 PE para receber +5 no teste.'),
],
poderes:[
 P('combatente','Análise Combativa','+5 em testes usando Ciente das Cicatrizes; contra ameaças já investigadas com sucesso por ele, +2 em testes.','Ciente das Cicatrizes'),
 P('combatente','Especialista em Proteção Leve','Usando proteção leve, +2 na Defesa e em Reflexos.','',[],{condicional:'protecao leve'}),
 P('especialista','Doutor em Emergências','Cicatrizantes e medicamentos que você aplica curam ou dão +1d8 PV (temporários) adicionais. +5 em Medicina para tratamento; o paciente recebe +10 (em vez de +5) na próxima Fortitude contra a doença ou veneno.','Especialista em Emergências'),
 P('especialista','Farmacêutico de Campo','Uma vez por interlúdio, com kit de medicina, gaste 2 PE + 2 PE por categoria para criar um cicatrizante ou medicamento. O kit é consumido após 3 usos. Usos extras na mesma cena custam uma ação de interlúdio.','treinado em Medicina e Profissão (químico ou similar)'),
 P('especialista','Médico da Salvação','Os dados de Paramédico passam de d10 para d12. Uma vez por rodada, 3 PE para usar Paramédico como ação de movimento.','Paramédico'),
 P('especialista','Resgatar da Morte','Em primeiros socorros, 2 PE para sucesso automático (uma vez por cena por ser).','veterano em Medicina'),
 P('especialista','Veterano da Equipe de Trauma','Equipe de Trauma remove até três condições negativas (exceto morrendo).','Paramédico, Equipe de Trauma'),
 P('ocultista','Barreira do Oculto','Escolha um elemento: ao conjurar ritual dele, gaste PE (até o limite) para +2 na Defesa por PE durante 1 rodada.','Especialista em Elemento no elemento, NEX 30%'),
 P('ocultista','Grão-Mestre em Elemento','Escolha um elemento: ao conjurar ritual dele, 1 PE para um efeito extra em um alvo até o fim da cena. Sangue: aliado +2d4 de dano de Sangue / inimigo debilitado 1 rodada. Morte: aliado 3d8+3 PV temporários / inimigo enjoado. Conhecimento: aliado +2 em perícias / inimigo esmorecido. Energia: aliado +6m de deslocamento / inimigo desprevenido. As condições ignoram imunidades.','Mestre em Elemento no elemento, NEX 60%'),
 P('geral','Adaptação Climática','+2 em Fortitude e não sofre dano por clima muito quente, muito frio ou extremo.','Vig 2',[{alvo:'per:fortitude',valor:2}]),
 P('geral','Muito Sorrateiro','No início de cenas de furtividade, subtraia 1d4 da visibilidade inicial. +3 em Furtividade.','Sorrateiro',[{alvo:'per:furtividade',valor:3}]),
 P('geral','Especialista em Armas Improvisadas','Sem penalidade de ataque com armas improvisadas, que causam +1 dado de dano do mesmo tipo.','For 2 ou Agi 2, treinado em Luta'),
 PP('morte','Escudo Espiral Temporal','Uma vez por rodada, reação e 2 PE contra arma ou munição que vai causar dano: munição dá RD 20 e vira cinzas; arma corpo a corpo dá RD 10 e sofre 10 de dano químico. Não funciona contra dano de Energia.','Pode usar mais de uma vez por rodada e o dano químico vira 20.','Morte 2'),
 PP('morte','Grilhões de Lodo','2 PE: área de 9m de raio ao seu redor até o fim da cena. Seres na área (exceto você e criaturas de Morte) sofrem 3d6 de Morte e ficam lentos (Fortitude reduz à metade e evita a condição por 1 rodada).','Dano 6d6 e a condição vira enredado.'),
 PP('energia','Salto de Dados','Ação completa e 2 PE: marca um símbolo no corpo (dura 1 dia). Reação e 3 PE para consumi-lo e voltar ao estado físico e mental do momento da marca (PV, PE, condições), perdendo a memória desde então: fica alquebrado e frustrado até o fim da cena e pasmo por 1d4+1 rodadas.','O símbolo dura 1 ano.','Energia 2'),
],
rituais:[
 R('Hesitação Forçada','conhecimento',1,'Padrão','Curto','1 pessoa','Sustentada','Vontade parcial','Dúvidas tomam o alvo: no início de cada turno ele faz Vontade; se falhar, rola de novo o maior dado de seus testes até o fim do turno. Passar duas vezes seguidas encerra o efeito.','+2 PE: alvo 1 ser; quem não resistiu não pode agir de forma hostil contra você. Requer 2º círculo.','+5 PE: Vontade anula; o alvo fica confiante demais: rola de novo o menor dado dos testes e deve se colocar como alvo de ataques contra aliados adjacentes. Requer 3º círculo e afinidade.'),
],
itens:[
 I('amaldicoado','Anel Invertido',2,0.5,{elemento:'morte',desc:'Usando o anel, ao sofrer dano de um nidere, reação e 2 PE para RD 4d10 contra esse dano.'}),
 I('medicamento','Aplicador de adrenalina',1,1,{consumivel:true,desc:'Ação padrão: você ou ser adjacente recebe 2d8+2 PV temporários, +3m de deslocamento e +2 em testes de Força, Agilidade e Vigor até o fim da cena; depois fica fatigado por uma cena.',acao:{pvTemp:'2d8+2'}}),
 I('arma','Lança-nitrogênio',3,2,{dano:'6d6',critico:'x2',alcance:'curto',tipoDano:'Frio',proficiencia:'pesada',empunhadura:'duas',forma:'fogo',municao:'Combustível',desc:'Linha de 1,5m até alcance curto, um teste contra todos. Atingidos ficam enredados até quebrar o gelo (ação padrão); Fortitude DT Agi muda para lento.'}),
],
modificacoes:[
 {id:'mod_emulsificante',nome:'Emulsificante Químico',aplica:'medicamento',desc:'O medicamento ganha o efeito de outro medicamento de categoria igual ou menor.',efeitos:{}},
 {id:'mod_potencializador',nome:'Potencializador Químico',aplica:'medicamento',desc:'Melhora o efeito: +5 em bônus de testes, +2d8 PV temporários, +2d8 PV de cura, ou funciona duas vezes por cena.',efeitos:{}},
 {id:'mald_aceleracao_espiral',nome:'Aceleração Espiral',aplica:'medicamento',elemento:'morte',maldicao:true,desc:'Além do efeito, 3 PE para uma ação padrão extra (não para rituais). Fortitude DT 20 ou perde 2d8 PV.',efeitos:{}},
 {id:'mald_esforco_espiral',nome:'Esforço Espiral',aplica:'medicamento',elemento:'morte',maldicao:true,desc:'Além do efeito, recupera 1d8+1 PE. Fortitude DT 20 ou envelhece 1 ano e fica frustrado até o fim da cena.',efeitos:{}},
],
regras:[
 {id:'evolucao_modular',nome:'Evolução Modular (fã, não oficial)',desc:'Substitui as habilidades "Poder" de classe: um poder de utilidade em NEX 10% e a cada NEX par, e um poder de combate em NEX 15% e a cada NEX ímpar. Versatilidade passa a dar o primeiro poder de outra trilha da sua classe.',efeito:{evolucaoModular:true}},
 {id:'categoria_veneno',nome:'Categoria de venenos pela DT',desc:'DT 0-10: categoria 0; 11-15: I; 16-20: II; 21-25: III; 26+: IV.'},
],
doencas:[
 {nome:'Crise Alérgica',desc:'Fortitude DT 20. I: –2 em testes. II: –5. III: –5 e enjoado. IV+: –5, enjoado e asfixiado.'},
 {nome:'Crise Hipocondríaca',desc:'I: abalado. II: abalado e confuso. III: usa todos os medicamentos do grupo sem benefício e perde 2d12 PV. IV+: morre intoxicado.'},
 {nome:'Crise Hipertensiva',desc:'Vontade DT 20. I: trêmulo. II: trêmulo e abalado. III: trêmulo, abalado e enjoado. IV+: infarto e morte.'},
 {nome:'Infecção Cerebral',desc:'Fortitude DT 20. I: frustrado. II: esmorecido. III: esmorecido e Intelecto 0. IV+: morte cerebral.'},
 {nome:'Infecção Generalizada',desc:'Fortitude DT 20. I: fatigado. II: exausto. III: exausto e inconsciente. IV+: falência dos órgãos.'},
],
venenos:[
 {nome:'Batracotoxina',desc:'Contato, Fortitude DT 25: exausto, paralisado e asfixiado (se passar, exausto).'},
 {nome:'Cianeto de Potássio',desc:'Ingestão, Fortitude DT 25: inconsciente e asfixiado (se passar, asfixiado).'},
 {nome:'Gás Neurotóxico',desc:'Inalação, Fortitude DT 25: paralisado (se passar, imóvel).'},
 {nome:'Ricina',desc:'Inalação, Fortitude DT 25: perde 4d6 PV por rodada até ser curado (se passar, 2d6 por 1d4+1 rodadas).'},
 {nome:'Toxina Cardiotóxica',desc:'Ferimento, Fortitude DT 25: 0 PV e morrendo (se passar, perde metade dos PV).'},
],
};
