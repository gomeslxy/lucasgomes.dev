# Atmosfera e abertura da experiência

## Escopo

Este documento descreve a configuração e a integração da atmosfera e da abertura. Os parâmetros ficam em `src/lib/experience-config.ts`, no objeto `experienceConfig`. A implementação está em `src/components/experience/experience-intro.tsx` e no CSS Module adjacente, e é montada por `ExperienceProvider`.

A direção continua centrada no perfil: banner e PFP são as imagens fornecidas pelo usuário, preservadas dentro do card. A atmosfera fica na periferia da composição e a abertura prepara a chegada do conteúdo. Ela não acrescenta um objeto no banner, um canvas decorativo ou um bloqueio de carregamento indefinido.

## Configuração prevista

| Controle | Valor inicial | Função |
| --- | --- | --- |
| `intro.minimumMs` | 500 ms | Permitir que o gesto de abertura seja percebido sem uma longa espera. |
| `intro.maximumMs` | 1600 ms | Iniciar a saída mesmo que algum recurso essencial não conclua, no desktop. |
| `intro.mobileMaximumMs` | 1200 ms | Reduzir o tempo de acesso ao conteúdo em touch. |
| `intro.exitMs` | 520 ms | Dissolver a sobreposição e conectar o enquadramento da hero no desktop. |
| `intro.mobileExitMs` | 360 ms | Fazer a passagem mais curta e contida no mobile. |
| `pointer.maxTiltX` | 0,6° | Limitar a resposta ao ponteiro sem prejudicar leitura ou clique. |
| `pointer.maxTiltY` | 0,8° | Sugerir profundidade com amplitude pequena. |
| `pointer.lightOpacity` | 0,28 | Manter o reflexo localizado subordinado ao conteúdo. |
| `atmosphere.particleCount` | 12 | Pontos periféricos discretos, com trajetórias lentas no desktop. |
| `atmosphere.mobileParticleCount` | 4 | Preservar atmosfera com menos camadas e menor custo de composição no mobile. |
| `atmosphere.cycleSeconds` | 22 s | Definir o ciclo base do brilho periférico. |
| `atmosphere.glowOpacity` | 0,36 | Controlar a força base do ambiente no desktop; mobile e movimento reduzido têm intensidades estáticas menores no CSS. É independente do reflexo sobre o card. |

Os limites de espera e a duração da saída são controles distintos. Se a espera atingir o teto, a experiência inicia a saída; não deve continuar aguardando uma fonte ou imagem. A configuração deve deixar essa separação clara para evitar somar atrasos adicionais em cada recurso.

Parâmetros de duração são expressos em milissegundos; inclinações, em graus; opacidade, entre 0 e 1. Os valores finais podem ser ajustados sem distribuir números mágicos entre a hero e o ambiente. Os controles permanecem imóveis: não há parâmetro de deslocamento magnético na configuração final.

O campo `spring` centraliza a resposta física: `stiffness: 110`, `damping: 28` e `mass: 0.65`. A configuração deve ser compartilhada pelos efeitos que precisam do mesmo peso visual, sem criar uma mola independente para cada elemento de texto.

## ExperienceIntro: prontidão e saída garantida

`ExperienceIntro` coordena a sobreposição de abertura com o estado do documento. A prontidão considera:

1. A estrutura do documento, verificando `document.readyState` antes de aguardar `DOMContentLoaded`. A composição não depende de um listener de `load` que possa já ter ocorrido.
2. As fontes necessárias para a primeira composição, por meio da prontidão de `document.fonts` quando a API estiver disponível.
3. As imagens essenciais da hero, incluindo banner e PFP; imagens lazy dos projetos e certificados não devem prolongar a abertura.

Falha de imagem, rejeição de `decode()` ou indisponibilidade da API de fontes contam como recurso encerrado, sem prender a transição. A coordenação usa um limite global de espera, em vez de encadear um timeout completo para cada recurso. A fase de saída começa após a prontidão e o mínimo configurado, ou ao alcançar o limite máximo.

A intro deve falhar liberando o conteúdo. Qualquer caminho de encerramento precisa remover a sobreposição, liberar os controles e restaurar o estado de scroll/foco que tenha sido alterado. Erros de armazenamento, callbacks atrasados, desmontagem e mudança de preferência de movimento não podem deixar a página bloqueada.

A abertura não deve aguardar todas as imagens da página, uma resposta de telemetria ou o completo carregamento de componentes abaixo da dobra. O conteúdo essencial já existe no HTML do servidor.

## Quando pular

| Situação | Comportamento |
| --- | --- |
| `prefers-reduced-motion: reduce` | Exibir a experiência na pose final, sem câmera, partículas em movimento ou uma espera artificial. |
| URL com hash | Preservar a navegação direta à seção, sem intro que recoloque o visitante no topo. |
| Retorno por BFCache | Manter o estado restaurado pelo navegador; tratar `pageshow` com `persisted` sem repetir a abertura. |
| Visita repetida na mesma sessão | Pular a intro conforme a chave de sessão definida na implementação. |
| Escape | Encerrar a abertura e liberar a experiência. |
| Ação “Pular” | Oferecer o mesmo caminho de encerramento, com alvo acessível por teclado e touch. |

Leituras e gravações em `sessionStorage` ficam em `try/catch`. O navegador pode bloquear esse armazenamento; isso não impede acesso à página. A chave é `lucas:portfolio-intro:v1`; o valor `seen` é gravado ao finalizar ou pular. Para repetir a abertura em desenvolvimento, remova essa chave na sessão e recarregue sem hash e sem preferência por movimento reduzido.

O botão “Pular” fica alcançável enquanto a abertura está em espera. Ao pressionar Tab durante a fase `revealing`, a implementação termina a intro e restaura o foco, em vez de focar o botão que já está desaparecendo. Se a intro administrar foco, ela deve restaurá-lo de modo previsível. Ao pular por hash, não move o foco para o início nem reinicia a rolagem. O tratamento de Escape ignora comandos após encerrar e é removido na desmontagem do componente.

## Integração com a hero

O atributo `data-intro-phase` no elemento `html` conecta o ciclo da intro às animações da hero. `IntroPhase` é exportado com os valores `loading`, `revealing` e `ready`. O estado `loading` pausa a entrada do perfil, `revealing` conecta a saída das cortinas à hero e `ready` libera a experiência. O resultado também fica registrado em `html.dataset.introResult`, para inspeção do caminho de encerramento.

| API/atributo | Responsabilidade |
| --- | --- |
| `ExperienceIntro` | Envolve o conteúdo, coordena prontidão e limites e administra a sobreposição. |
| `[data-experience-content]` | Wrapper de conteúdo com `display: contents`; recebe `inert` temporariamente. |
| `[data-experience-intro]` | Sobreposição da intro; `data-phase` acompanha seu estado visual. |
| `window.__portfolioIntroBootstrap` | Estado de proteção anterior à hidratação, com início, bypass e timer de segurança. É infraestrutura interna. |
| `portfolio:intro-reveal` | Evento no `document`, com `detail: { reason, exitMs }`, sinaliza o começo da revelação. |
| `portfolio:intro-ready` | Evento no `document`, com `detail: { reason }`, sinaliza a liberação final. |

Os recursos são apresentados como `document`, `fonts` e `profile`, com estados `pending`, `ready` ou `fallback`. A consulta de imagens essenciais está limitada a `#hero [data-profile-surface] img`; imagens dos projetos e certificados não participam dessa espera.

Integrações que escutarem os eventos devem registrar os listeners no cliente e removê-los na desmontagem. O evento de revelação pode ter `exitMs: 0` em um caminho de pulo ou liberação imediata; consumidores não devem pressupor uma duração de cortina completa.

A hero possui planos separados para entrada, tilt e saída no scroll. As animações de câmera, nome, avatar e metadados precisam começar na fase apropriada, sem terminar atrás da sobreposição. Ao pular a intro, a hero deve poder ir diretamente à pose legível, sem aguardar uma sequência que o visitante não verá.

O estado padrão do HTML/CSS permanece visível e utilizável quando JavaScript estiver desativado. O atributo de fase só pode restringir interação enquanto houver um caminho ativo e limitado para liberar a página. Não usar uma regra global que esconda o conteúdo indefinidamente até a hidratação.

Se houver bloqueio temporário de scroll, ele deve coordenar rolagem nativa e Lenis. A implementação já usa o scheduler do Motion para conduzir o Lenis; a intro não precisa criar um segundo loop permanente. Ao liberar, devem ser restaurados os valores anteriores de overflow, `inert` e foco, sem presumir que a página começou com todos eles vazios.

## Atmosfera periférica

A atmosfera é composta por brilho periférico e poucos pontos de luz. Seu papel é dar escala ao espaço ao redor do card e conectar a passagem dos capítulos. Nome, banner, PFP e ações continuam tendo contraste e prioridade.

O componente está em `src/components/experience/ambient-environment.tsx`, com seus estilos no CSS Module adjacente. As posições das partículas são determinísticas, para manter o HTML do servidor e a hidratação iguais. O mobile exibe um subconjunto das partículas do desktop, definido por `mobileParticleCount`. A camada é fixa e não captura eventos de ponteiro; o trecho claro da trajetória pode atenuá-la para preservar a mudança de atmosfera.

- Usar gradientes estáticos em áreas controladas; mover as respectivas camadas com `transform` e modular `opacity`.
- Distribuir 12 partículas no desktop e 4 no mobile. Cada partícula pode ser um elemento pequeno com trajetória predefinida, sem atualizar coordenadas por estado de React a cada frame.
- Preservar o fluxo do documento. Camadas decorativas usam `pointer-events: none` e não ampliam o scroll horizontal.
- Evitar filtros de grande raio, blend modes de tela inteira e animação de sombras que causem repintura contínua.
- Pausar animações quando o documento estiver oculto. Se a atmosfera pertencer a uma seção, pausar também quando essa seção sair da viewport.
- Liberar `will-change` quando a camada não estiver animando ou visível. O número de camadas compostas e sua área importam mais que a simples presença de `translate3d`.
- Com movimento reduzido, usar um enquadramento estático e discreto, sem drift, parallax ou pulsação contínua.

Não há canvas nessa composição. DPR, frustum culling e descarte de contexto WebGL não se aplicam à atmosfera e ao card CSS. O orçamento se concentra em composição, pintura, resolução das imagens e trabalho de JavaScript por frame.

## Ponteiro, controles estáveis e luz

As respostas ao mouse exigem ponteiro preciso, suporte a hover e ausência de preferência por movimento reduzido. Touch mantém a rolagem vertical nativa e não depende da existência de hover para descobrir conteúdo ou ações.

O tilt usa alvos de orientação e molas leves, limitados a 0,6° e 0,8° nos eixos configurados. A contribuição do ponteiro deve ser separada da câmera de entrada e da transformação de scroll, para que uma interação não sobrescreva a outra.

O wrapper `Magnetic` permanece disponível para compatibilidade com os componentes existentes, mas não desloca mais os controles. A prop `strength` é aceita para evitar mudanças desnecessárias nos pontos de uso; ela não produz movimento. A estabilidade do alvo de clique e foco tem prioridade. A compressão tátil de um botão pode continuar sendo um feedback local de pressão, sem mover sua posição pela aproximação do cursor.

A luz tem teto de opacidade de 0,28 e área local. Preferir mover uma camada de brilho já definida a alterar um gradiente de viewport inteira em cada evento. Foco de teclado recebe um estado equivalente e estável, sem obrigar o elemento focado a inclinar continuamente.

## Checklist de integração e validação

1. Primeira visita desktop: a intro termina quando os recursos essenciais ficam prontos, respeitando mínimo, teto e saída configurados.
2. Primeira visita touch: menos partículas, saída mais curta e nenhuma captura do gesto vertical.
3. Fonte indisponível, imagem quebrada ou `decode()` rejeitado: a página abre pelo caminho de saída garantida.
4. Documento já pronto antes da hidratação: nenhum listener fica aguardando um `DOMContentLoaded` que já ocorreu. Se a hidratação acontecer depois do timer de proteção, a intro não pode voltar a bloquear o conteúdo.
5. Escape, “Pular”, desmontagem e timeout: nenhum overlay, overflow ou `inert` permanece bloqueando a página.
6. Hash inicial, sessão repetida e BFCache: a navegação e a posição restaurada são preservadas.
7. Movimento reduzido, JS desativado e viewport curta: perfil e links continuam disponíveis na pose final.
8. Aba oculta e seção fora de vista: animações decorativas pausam; a retomada não cria salto de orientação.
9. Ponteiro nos extremos do card e dos botões: respeitar os limites de rotação/luz da configuração e manter os controles na mesma posição.
10. Build de produção: TypeScript, abertura, navegação, scroll, foco e ausência de overflow são verificados nos tamanhos alvo.

60–120 FPS é uma meta de engenharia. O uso de transform/opacity, build aprovado e testes headless não garantem essa frequência em qualquer aparelho. A validação física deve observar frames longos, custo de pintura e composição, memória e resposta ao toque, em celulares reais e telas de 60/120 Hz.

## Validação desta rodada

Build de produção e TypeScript aprovados. A regressão funcional passou em 1440×900, 1366×768, 768×1024, 390×844, 360×640 e 320×640, sem overflow horizontal ou erros de execução.

Foram aprovados 14 cenários da intro e do ambiente: prazo máximo com fonte pendente; limite mobile e ausência de follower no touch; Escape e foco; botão Pular; Tab durante a saída; âncora inicial; movimento reduzido inicial e alterado durante a intro; armazenamento bloqueado; sinal de retorno por BFCache; aba oculta e pausa do ambiente; JavaScript desativado; falha dos chunks do bundle; hidratação após o prazo de liberação. Os alvos dos botões permaneceram imóveis e a inclinação do perfil respeitou os limites configurados.

Para rever a intro na mesma sessão pelo console do navegador:

```js
sessionStorage.removeItem("lucas:portfolio-intro:v1");
location.reload();
```

Esse comando não altera os dados do perfil. O número de FPS em aparelhos físicos não foi medido nesta rodada.

