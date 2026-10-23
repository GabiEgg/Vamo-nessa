// Ordem Paranormal RPG — parte 3: poderes paranormais (capítulo 5).
const {PP}=require('./h');
// Campo "afinidade": benefício extra ao escolher o poder de novo tendo afinidade com o elemento.
module.exports={
poderes:[
 PP('','Aprender Ritual','Aprende um ritual de 1º círculo (de até 2º a partir de NEX 45%, até 3º a partir de 75%) e pode trocar um ritual conhecido por outro. Repetível, sujeito ao limite de rituais (igual ao Intelecto). Conta como poder do elemento do ritual.','','',[],{repetivel:true,aprendeRitual:true}),
 PP('','Resistir a Elemento','Escolha Conhecimento, Energia, Morte ou Sangue: resistência 10 contra esse elemento. Conta como poder do elemento escolhido.','A resistência aumenta para 20.','',[],{escolheElemento:true}),
 PP('conhecimento','Expansão de Conhecimento','Aprende um poder de classe de outra classe (cumprindo os pré-requisitos).','Aprende um segundo poder de classe de outra classe.','Conhecimento 1'),
 PP('conhecimento','Percepção Paranormal','Ao procurar pistas em investigação, pode rolar de novo um dado com resultado menor que 10 (fica com o novo).','Pode rolar de novo até dois dados menores que 10.'),
 PP('conhecimento','Precognição','+2 em Defesa e em testes de resistência.','Fica imune à condição desprevenido.','Conhecimento 1',[{alvo:'defesa',valor:2},{alvo:'resist',valor:2}]),
 PP('conhecimento','Sensitivo','Sente emoções e intenções: +5 em Diplomacia, Intimidação e Intuição.','Em testes opostos com essas perícias, o oponente sofre –1d20.','',[{alvo:'per:diplomacia',valor:5},{alvo:'per:intimidacao',valor:5},{alvo:'per:intuicao',valor:5}]),
 PP('conhecimento','Visão do Oculto','+5 em Percepção e enxerga no escuro.','Ignora camuflagem.','',[{alvo:'per:percepcao',valor:5}]),
 PP('energia','Afortunado','Uma vez por rolagem, rola de novo um resultado 1 em qualquer dado que não seja d20.','Também pode rolar de novo um 1 em d20, uma vez por teste.'),
 PP('energia','Campo Protetor','Ao usar esquiva, gaste 1 PE para +5 em Defesa.','Também recebe +5 em Reflexos e, até seu próximo turno, passar em Reflexos que reduziria o dano à metade anula o dano.','Energia 1'),
 PP('energia','Causalidade Fortuita','Em investigação, a DT para procurar pistas diminui em –5 até você achar uma pista.','A redução de –5 vale sempre.'),
 PP('energia','Golpe de Sorte','+1 na margem de ameaça dos seus ataques.','+1 no multiplicador de crítico.','Energia 1',[],{margem:1}),
 PP('energia','Manipular Entropia','Quando outro ser em alcance curto faz teste de perícia, gaste 2 PE para fazê-lo rolar de novo um dos dados.','Ele rola de novo todos os dados que você escolher.','Energia 1'),
 PP('morte','Encarar a Morte','Em cenas de ação, seu limite de PE por turno aumenta em +1 (não afeta DT).','O aumento passa a +3 no total.'),
 PP('morte','Escapar da Morte','Uma vez por cena, dano que o deixaria com 0 PV o deixa com 1 PV (não vale contra dano massivo).','Evita o dano completamente; contra dano massivo, fica com 1 PV.','Morte 1'),
 PP('morte','Potencial Aprimorado','+1 PE por nível de NEX (cresce ao subir de NEX).','+2 PE por nível de NEX no total.','',[{alvo:'peNex',valor:1}],{modsAfinidade:[{alvo:'peNex',valor:1}]}),
 PP('morte','Potencial Reaproveitado','Uma vez por rodada, ao passar num teste de resistência, ganha 2 PE temporários cumulativos (somem no fim da cena).','Ganha 3 PE temporários em vez de 2.'),
 PP('morte','Surto Temporal','Uma vez por cena, no seu turno, gaste 3 PE para uma ação padrão adicional.','Pode usar uma vez por turno.','Morte 2'),
 PP('sangue','Anatomia Insana','50% de chance (par em 1d4) de ignorar o dano adicional de crítico ou ataque furtivo.','Imune a acertos críticos e ataques furtivos.','Sangue 2'),
 PP('sangue','Arma de Sangue','Ação de movimento e 2 PE: garras, chifres ou lâmina de sangue (arma simples, leve, corpo a corpo, 1d6 de Sangue, não precisa empunhar) até o fim da cena. Ao agredir, 1 PE para um ataque adicional com ela.','A arma fica permanente e causa 1d10.'),
 PP('sangue','Sangue de Ferro','+2 PV por nível de NEX (cresce ao subir de NEX).','+5 em Fortitude e imunidade a venenos e doenças.','',[{alvo:'pvNex',valor:2}],{modsAfinidade:[{alvo:'per:fortitude',valor:5}]}),
 PP('sangue','Sangue Fervente','Enquanto machucado, +1 em Agilidade ou Força (escolha a cada ativação).','O bônus passa a +2.','Sangue 2'),
 PP('sangue','Sangue Vivo','Na primeira vez que fica machucado na cena, ganha cura acelerada 2 (nunca acima da metade dos PV; termina no fim da cena ou ao deixar de estar machucado).','Cura acelerada 5.','Sangue 1'),
],
};
