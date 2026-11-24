# Scrollytelling do manifesto

A seção `#manifesto` apresenta três princípios — Integridade, Inteligência e Realidade — em uma composição fixa que responde diretamente ao scroll. Cada mudança de capítulo ocupa 340 pixels de rolagem. Os três capítulos usam 680 pixels de percurso animado, além da altura da cena, evitando reservar várias telas para cada parágrafo.

O conteúdo profissional anterior e posterior à cena continua no fluxo da página. O link **Continuar** leva a `#manifesto-details` a qualquer momento.

## Arquivos e responsabilidades

| Arquivo | Responsabilidade |
| --- | --- |
| `src/components/experience/scroll-story.tsx` | Componente `ScrollStory`, capítulos, indicadores, navegação e diagrama decorativo. |
| `src/components/experience/scroll-story.module.css` | Tipografia, geometria reservada, sticky, composição e leitura estática. |
| `src/lib/use-scroll-story.ts` | Política de ativação, geometria em cache, progresso, capítulo ativo e assentamento direcional dos gestos. |
| `src/lib/scrollytelling.ts` | Parâmetros e funções matemáticas puras. |
| `src/components/sections/manifesto.tsx` | Conteúdo dos três capítulos e integração com o portfólio. |
| `src/components/providers/smooth-scroll.tsx` | Instância Lenis e integração com o ciclo de frames do Motion. |
| `scripts/test-scrollytelling.cjs` | Testes das curvas e dos limites da narrativa. |

Em `src/app/page.tsx`, o `SpatialSection` que envolve o manifesto usa `fold={false}`. Isso evita aplicar a transformação de entrada da seção inteira sobre a cena sticky.

## Reutilização

`ScrollStory` recebe uma lista somente para leitura de capítulos e uma âncora de continuação. Todo capítulo exige um identificador único, um rótulo curto, duas linhas de título, descrição e detalhe. A configuração atual tem direção visual para três princípios: o texto superior e o diagrama mencionam três camadas. Se mudar o tema ou a quantidade de capítulos, ajuste também esses elementos editoriais.

Exemplo completo para uma seção independente:

```tsx
import {
  ScrollStory,
  type StoryChapter,
} from "@/components/experience/scroll-story";

const chapters = [
  {
    id: "contexto",
    label: "Contexto",
    title: ["Escutar.", "Antes de criar."],
    description:
      "Cada produto começa pela compreensão das pessoas, do trabalho e dos problemas que precisam de uma resposta.",
    detail: "Pesquisa · Fluxos reais · Prioridades",
  },
  {
    id: "estrutura",
    label: "Estrutura",
    title: ["Construir.", "Com clareza."],
    description:
      "A arquitetura transforma esse contexto em uma base segura, legível e preparada para evoluir com o produto.",
    detail: "Dados · Interfaces · Integrações",
  },
  {
    id: "evolucao",
    label: "Evolução",
    title: ["Entregar.", "E aprender."],
    description:
      "A entrega abre espaço para observar o uso, medir os resultados e melhorar o que realmente faz diferença.",
    detail: "Observação · Medição · Iteração",
  },
] as const satisfies readonly StoryChapter[];

export function ProductPrinciples() {
  return (
    <section id="principios" aria-labelledby="principios-title">
      <div className="gutter py-12">
        <h2 id="principios-title">Como o produto ganha forma.</h2>
      </div>
      <ScrollStory chapters={chapters} continueTo="#proxima-secao" />
      <div id="proxima-secao" className="gutter py-12">
        <h2>O próximo passo.</h2>
        <p>Conheça os projetos que colocam esses princípios em prática.</p>
      </div>
    </section>
  );
}
```

No portfólio, o `ExperienceProvider` já instala o Motion e o Lenis. Ao reutilizar em outra aplicação, leve também o provider e os estilos globais do projeto, ou configure essas dependências no ambiente de destino. As variáveis de fonte e `--gutter` usadas pelo CSS vêm de `src/app/globals.css` e `src/app/layout.tsx`.

## Ritmo e matemática

O progresso é calculado com a posição atual e a geometria da trilha:

```text
percurso = stepPx × (quantidadeDeCapitulos − 1)
progresso = clamp((scrollY − topoDaTrilha) / percurso, 0, 1)
posiçãoDoCapítulo = progresso × (quantidadeDeCapitulos − 1)
```

`getStoryFrame` transforma esse progresso em opacidade e profundidade. A interpolação `smootherstep(t) = 6t⁵ − 15t⁴ + 10t³` tem velocidade e aceleração nulas nos extremos. Isso cria um platô para ler e suaviza o início e o fim de cada transição.

As opacidades de capítulos adjacentes são complementares: durante o crossfade, somam 1. A transformação é reversível e não acumula estado ou animações em fila. Um gesto rápido pode atravessar vários capítulos; a cena acompanha a posição efetiva do scroll.

| Parâmetro em `STORY_SETTINGS` | Valor | Efeito |
| --- | --- | --- |
| `stepPx` | `340` | Distância em pixels entre os centros de capítulos consecutivos. |
| `holdRatio` | `0.42` | Fração do intervalo destinada ao platô de leitura. |
| `settleDelayMs` | `160` | Espera após cessarem as atualizações de scroll para considerar o assentamento do gesto. |
| `settleDuration` | `0.38` | Duração em segundos do ajuste pelo Lenis. |
| `magnetRadius` | `0.24` | Raio de atração local para movimentos que ainda não saíram do platô, em unidades de intervalo. |

Com os valores atuais, o capítulo intermediário tem 142,8 pixels de platô; os extremos têm 71,4 pixels dentro da trilha. A transição ocupa 197,2 pixels.

`getSettledChapter` considera a posição no início do gesto e a posição em que o scroll parou. Ao superar 71,4 pixels de movimento, completa a transição na direção escolhida. O cálculo desconta meio platô antes de escolher o destino, evitando que uma pequena ultrapassagem do centro avance dois capítulos. Partindo do primeiro capítulo, gestos de 100, 310 e 400 pixels assentam no segundo; 450 pixels chegam ao terceiro. Os mesmos limites se aplicam ao subir a página.

Movimentos menores usam somente `getMagneticChapter`: a atração local alcança até 81,6 pixels do centro mais próximo e pode retornar `null` quando não há destino próximo. Jitter de até 71 pixels partindo do centro de um capítulo permanece nesse capítulo. A função pura retorna apenas um destino; a política de entrada e o momento do ajuste pertencem ao hook.

A pose varia até 18% de deslocamento vertical, −100 pixels no eixo Z, 5 graus de rotação e escala 0,96. O corpo recebe um deslocamento adicional de até 10,8 pixels, criando uma diferença discreta de profundidade em relação ao título. Na pose de leitura, essas transformações retornam ao estado neutro.

Para mudar o ritmo global, altere `STORY_SETTINGS.stepPx`; tanto a geometria inline quanto o hook usam esse valor. O hook aceita `stepPx` para usos próprios: nesse caso, a variável CSS `--story-travel` precisa refletir a mesma distância. Alterar somente a altura CSS ou somente o cálculo quebra a correspondência entre scroll e sticky.

## Geometria e ativação

O CSS reserva `calc(100svh + var(--story-travel))` para a trilha e `100svh` para a cena sticky. `svh` evita variar a altura com a abertura e o fechamento de barras do navegador. Os capítulos compartilham uma célula de grid; a altura do conteúdo considera os capítulos sobrepostos, sem inserir e remover blocos durante o avanço.

A cena animada exige, simultaneamente:

- Largura de pelo menos 768 pixels e altura de pelo menos 640 pixels.
- Ponteiro preciso e suporte a hover.
- Preferência `prefers-reduced-motion: no-preference`.

A mesma media query é usada no CSS e no hook. A geometria desktop já é reservada antes da hidratação. Em viewports menores, telas baixas, dispositivos de toque ou movimento reduzido, os capítulos aparecem sequencialmente, sem pinning, diagrama ou controles de capítulos. A rolagem de toque permanece nativa.

Um bloco `<noscript>` libera a trilha e torna todos os capítulos visíveis quando JavaScript está desativado. Os textos estão no HTML entregue pelo servidor. Quando JavaScript está habilitado, a experiência avançada depende da hidratação dos componentes para acompanhar o scroll.

Mantenha os textos curtos. Traduções, aumentos de fonte e novos títulos precisam de conferência visual: reservar geometria não garante que qualquer quantidade de conteúdo caiba em uma cena de uma tela. Evite aplicar `overflow: auto/hidden` ou transformações adicionais aos ancestrais do sticky sem verificar o comportamento no navegador.

## Scroll, entrada e acessibilidade

Lenis usa `autoRaf: false`; `LenisFrameDriver` chama `lenis.raf(timestamp)` pelo ciclo compartilhado de frames do Motion. A configuração atual tem `lerp: 0.11`, suavização de wheel e `syncTouch: false`. Isso centraliza a atualização da rolagem e evita acrescentar outro loop próprio de animação à cena. A integração segue o uso de RAF manual documentado pelo [Lenis](https://github.com/darkroomengineering/lenis).

O hook recebe o scroll efetivo do Lenis. Se essa instância ainda não estiver disponível, acompanha a rolagem nativa. Os botões usam `goToChapter`; o ajuste programático dura 0,65 segundo e usa a mesma curva quintic.

O assentamento só considera entrada real de wheel vertical e registra o capítulo de início de cada gesto. Não atua quando o Lenis está parado ou bloqueado, a intro está aberta, a aba está oculta ou o foco está em formulário ou diálogo. Entradas de teclado, toque, ponteiro e perda de foco cancelam o ajuste pendente. Não há listener próprio que chame `preventDefault` para capturar o gesto.

Os controles são botões com área mínima de 48 pixels, foco visível, `aria-controls` e `aria-current="step"` no capítulo ativo. Os capítulos têm headings e relações `aria-labelledby`; o diagrama é decorativo e usa `aria-hidden`. Todos os textos permanecem disponíveis na ordem do documento para tecnologia assistiva. Não se anuncia cada frame por região viva.

## Engenharia de animação

As atualizações de scroll alteram `MotionValue`s e estilos de `transform`/`opacity`. O estado React do hook muda quando o capítulo ativo muda; não recebe progresso contínuo. O conceito de progresso como MotionValue está documentado em [Motion: useScroll](https://motion.dev/docs/react-use-scroll); neste componente, o valor é alimentado diretamente pelo Lenis e pela geometria em cache, em vez de instalar um `useScroll` adicional para a trilha.

`getBoundingClientRect` é usado na medição invalidada por resize, mudanças de dimensões observadas, fontes prontas ou término da intro. A medição é agendada em `frame.read`. O caminho normal de scroll usa coordenadas em cache e não mede o layout a cada evento. As alturas, margens e tamanhos de fonte não são animados.

O diagrama usa poucos planos CSS e um núcleo. Bordas e superfícies são estáticas; o scroll altera transformações. Não foram adicionados blur animado, filtros de tela inteira ou promoção indiscriminada de camadas com `will-change`. Animar transformações e opacidade reduz a necessidade de layout e pintura, mas o custo real depende das camadas e do navegador. Consulte o [guia de performance do Motion](https://motion.dev/docs/performance) e a orientação do [web.dev sobre animações e performance](https://web.dev/articles/animations-and-performance).

Os listeners, o `ResizeObserver`, os callbacks agendados e os timers são removidos no cleanup do hook. A política de media query usa uma assinatura compartilhada; a preferência de movimento reduzido também pode mudar com a página aberta.

## Verificação automatizada e preview de produção

Na raiz do projeto, em PowerShell:

```powershell
npm run test:story
npm run typecheck
$env:NEXT_DIST_DIR = ".next-story"
npm run build
npm start -- -p 3101
```

Se iniciar o servidor em outro terminal, defina também nesse terminal `$env:NEXT_DIST_DIR = ".next-story"` antes de executar `npm start -- -p 3101`. Build e start precisam usar o mesmo diretório. Verifique que a porta 3101 está livre antes de iniciar.

Abra [o manifesto no preview de produção](http://localhost:3101/#manifesto). Esse deep link leva à seção e também faz a intro existente ser ignorada. O início da seção inclui a apresentação anterior à trilha; avance até a cena para iniciar o scrub.

`test:story` executa o módulo TypeScript real em memória e verifica limites, valores finitos, platôs, continuidade, soma das opacidades, reversibilidade, extremos, raio de magnetismo e assentamento direcional. Os casos de gesto incluem 100, 310, 400 e 450 pixels, subida, jitter abaixo do limiar e narrativas com um único capítulo. Esses testes verificam a matemática; não medem renderização, interação física, FPS ou CLS. TypeScript e build verificam integração e geração do aplicativo.

### Resultados registrados em 25/10/2026

- Testes matemáticos: passaram.
- TypeScript: passou.
- Build de produção: passou com Next.js 15; a rota principal foi gerada como estática. O relatório do build informou 207 kB de First Load JS para essa rota.
- Prévia de produção conferida no navegador integrado em 1280 × 720: fixação da cena, capítulos 1 e 2, navegação por botão e console sem avisos ou erros capturados.
- No build final, um gesto de scroll de aproximadamente 100px a partir do capítulo 1 completou o avanço ao capítulo 2: posição final de cerca de 340px na trilha, opacidade 1 no capítulo ativo e 0 nos demais.
- Gesto reverso de aproximadamente 100px retornou ao capítulo 1; o terceiro capítulo foi acionado por Enter; o link Continuar levou ao resumo com margem de navegação preservada.
- Composição conferida visualmente em iframes de 320 × 740, 375 × 812 e 768 × 640: capítulos em fluxo nas larguras móveis e conteúdo legível na cena fixa compacta. Essas verificações de viewport não representam testes de toque em aparelhos físicos.
- FPS não foi medido. O tamanho de JavaScript do build e a aprovação dos testes não constituem benchmark de fluidez.

Movimento reduzido, JavaScript desativado e aparelhos físicos têm fallback previsto no código, mas não foram emulados nesta conferência. O roteiro abaixo permite ampliar a validação e medir performance nos dispositivos alvo.

## Roteiro de profiling em produção

60 Hz permite aproximadamente 16,67 ms por frame; 120 Hz permite 8,33 ms. São orçamentos para medição, não resultados obtidos ou garantidos por esta implementação. Tela, navegador, CPU, GPU, extensões e carga concorrente afetam a entrega dos frames. A cena tem atualizações em JavaScript; o uso de transformações não significa que toda a lógica rode fora da thread principal.

1. Use o servidor de produção acima. Registre navegador, sistema, dispositivo, taxa de atualização e viewport; comece com 1440 × 900, 1280 × 720 e 768 × 640 em um dispositivo com ponteiro preciso. Confirme que o monitor está configurado para 120 Hz antes de avaliar esse alvo. Use DevTools desacoplado para preservar a viewport.
2. Abra `/#manifesto`, espere as fontes e imagens estabilizarem e posicione o primeiro capítulo no centro da cena. Faça uma passagem de aquecimento antes de gravar. Separe essa análise de uma gravação de carregamento inicial, na qual fontes e intro podem mudar a carga.
3. No painel **Performance**, grave de 15 a 20 segundos: avance lentamente pelos três capítulos, pause no centro de cada um, faça um gesto rápido até o final e reverta imediatamente. Repita três vezes com viewport e percurso iguais. Não use o servidor de desenvolvimento como baseline.
4. Inspecione a trilha **Frames**, os frames perdidos e o tempo da thread principal. Compare o tempo de cada frame com 16,67 ou 8,33 ms conforme o monitor. No intervalo de scrub, procure eventos de Layout ou avisos de forced reflow atribuídos à cena. Medições após resize são esperadas; layout repetido causado pelas atualizações da animação exige investigação.
5. Ative temporariamente **Paint flashing** e **Layer borders** no painel Rendering. Verifique se o scrub repinta grandes áreas e se a quantidade ou o tamanho de camadas cresce desnecessariamente. Desative esses diagnósticos para a gravação final, pois também alteram o custo da inspeção.
6. Inspecione os eventos de **Layout Shift** durante carregamento, entrada na cena e avanço dos capítulos. A trilha deve manter a altura ao hidratar; atribua qualquer mudança ao elemento responsável. Registre CLS observado e condições de teste; não infira CLS zero da estratégia CSS.
7. Com React DevTools Profiler, em uma gravação separada, confira que o progresso contínuo não gera commits contínuos de `ScrollStory`. Mudanças de capítulo ativo e ações de navegação podem gerar commits. Considere que a instrumentação do profiler modifica o custo e não substitui o trace de frames.
8. Teste o assentamento com wheel/trackpad reais: um gesto curto que ultrapasse o platô deve completar a transição na mesma direção; um movimento de poucos pixels deve permanecer no capítulo atual. Confira pequenas ultrapassagens do centro e gestos longos, nos dois sentidos. Inverta o gesto durante o ajuste. Navegue também por teclado, pelos três botões e pelo link **Continuar**. Eventos de wheel sintéticos não ativam o assentamento porque o hook exige `isTrusted`.
9. Repita a inspeção com movimento reduzido, em 375 × 812, com toque e com zoom de 200%. Confira leitura de todos os textos, ausência de sobreposição e ausência de overflow horizontal. Redimensione com a cena aberta e altere a preferência de movimento reduzido sem recarregar. Teste JavaScript desativado para conferir o `<noscript>`.
10. Confira recarga em `/#manifesto`, navegação voltar/avançar e restauração de posição. Percorra a seção repetidamente e examine memória/listeners após coleta de lixo, procurando crescimento contínuo. Registre console, navegador e qualquer limitação observada.

Somente traces e testes nos dispositivos alvo permitem afirmar o FPS entregue. Metas de estabilidade e fluidez orientam a arquitetura; os testes matemáticos e um build aprovado não comprovam ausência universal de frames perdidos.
