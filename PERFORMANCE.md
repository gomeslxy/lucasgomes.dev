# Refatoração de performance

## Orquestração global e auditoria visual — 25/10/2026

A rota principal agora usa `ScrollDirectorProvider` para as revelações editoriais, costuras e assinatura, com uma fonte compartilhada, IO/RO compartilhados e geometria em cache. Cinco padrões (`heading`, `meta`, `body`, `depth`, `row`) diferenciam títulos, badges, parágrafos, chamadas e registros. As costuras animam planos pequenos, mantendo o conteúdo e ancestors sticky estacionários.

Intro, header, materiais e cards foram revisados para eliminar blur global, backdrop filters móveis, transforms de artigos completos e transições amplas. O contador não renderiza React por frame. Bloqueios de scroll agora respeitam múltiplos proprietários. A intro tem mínimo de 320ms e saída de 560/360ms. Build final passou: rota estática e First Load JS de 209kB; o tamanho não é uma redução de bundle medida.

Os testes de curvas, lifecycle do diretor, cache de geometria, anchors compartilhados e ownership das travas passaram. O guard percorreu 55 dependências da rota e aprovou keyframes/transições CSS limitados a transform/opacity. Isso valida código e contratos; não confirma composição pela GPU em todos os navegadores. [Diagnóstico e evidências da auditoria global](docs/PERFORMANCE-VISUAL-AUDIT.md).

## Scrollytelling compacto — 25/10/2026

O manifesto agora usa uma cena sticky com três capítulos e 680px de percurso animado. Lenis e Motion compartilham o ciclo de frames existente. O progresso alimenta MotionValues diretamente, com curva quintic, platôs de leitura e assentamento direcional após wheel. As atualizações animam apenas transform e opacity; medidas de geometria ficam em cache e são invalidadas por resize, fontes e término da intro. CSS reserva o tamanho antes da hidratação. O manifesto não recebe o fold de perspectiva do wrapper, e o conteúdo da intro libera will-change ao terminar.

Testes matemáticos, TypeScript, build de produção e diff check passaram. A rota principal foi pré-renderizada; o build informou 207kB de First Load JS. Cena e controles foram conferidos no navegador integrado em 1280×720; composição também conferida em iframes de 320×740, 375×812 e 768×640. Sem avisos ou erros de console capturados na navegação inicial. FPS, CLS e aparelhos físicos não foram medidos. A arquitetura reduz fontes conhecidas de custo, mas esses checks não comprovam 60–120 FPS nem ausência universal de layout shifts. [Implementação, configuração, testes e roteiro de profiling](docs/SCROLLYTELLING.md).

## Redesign e reposicionamento — 24/10/2026

Esta revisão substitui a organização visual descrita no registro anterior abaixo. A Hero e a grade de projetos agora são Server Components. O leque com 360vh não é mais importado pela página; os dois projetos podem ser acessados imediatamente. A seção Sobre também entrega conteúdo estático no HTML.

A Hero mantém o título visível desde a primeira renderização, sem entrada por opacidade, imagem de capa, vídeo ou efeito que atrase sua leitura. O footer usa dimensionamento CSS e duas camadas de texto: a assinatura permanece visível, enquanto a camada com gradiente altera apenas opacidade. MotionValues controlam deslocamentos de até 5px/3px; a geometria é medida na entrada do ponteiro, sem leitura de layout em cada movimento e sem estado React por frame. A assinatura fica estática em telas pequenas, ponteiros de toque e movimento reduzido.

Os cards reservam a proporção das imagens. O modal de certificados passa a reservar uma área de visualização de altura definida antes da decodificação, preservando a proporção real do documento com `object-contain`. A navegação usa âncoras nativas, alvos de toque de pelo menos 44px, foco visível, Escape e restauração de foco nos diálogos.

### Verificação desta revisão

- Build de produção e TypeScript passaram; rota principal pré-renderizada como conteúdo estático, 177 kB de First Load JS informados pelo Next.js. O número descreve esta compilação, sem representar benchmark de FPS ou redução percentual medida.
- Navegador de produção conferido em 320×740, 375×812, 768×1024, 1280×720 e 1440×900. Nas verificações de 320, 375 e 768px, `scrollWidth` e `clientWidth` coincidiram, sem transbordamento horizontal nos títulos, parágrafos, links e botões inspecionados.
- Hero, âncoras de case/contato e assinatura centralizada conferidas visualmente. Gradiente da assinatura ativado por foco no desktop; versão estática no mobile. Menu mobile: abertura, ciclo de foco, Escape e retorno ao acionador verificados.
- Cópia de e-mail com anúncio de sucesso verificada. Filtros de trajetória e modal: imagem carregada, foco inicial, ciclo de Tab, Escape e restauração do foco conferidos.
- Console sem avisos ou erros capturados durante essa navegação.
- Não foram medidos Core Web Vitals de campo, trace de frames, GPU ou fluidez em aparelho físico. A preferência por movimento reduzido foi inspecionada no código, sem emulação dedicada nesta sessão.

CLS 0 permanece um alvo de estabilidade. LCP ≤2,5s, INP ≤200ms e CLS ≤0,1 no percentil 75 são critérios para medição em produção, não resultados obtidos por esta revisão. 60–120fps também dependem do navegador e dispositivo. [Critérios oficiais de Core Web Vitals](https://web.dev/articles/vitals).

## Registro da refatoração anterior

As seções seguintes documentam a etapa anterior ao redesign; referências ao leque, manifesto animado e ajuste de fonte descrevem aquela versão.

## Diagnóstico do código original

| Local | Custo encontrado | Alteração |
| --- | --- | --- |
| ExperienceProvider | Lenis em `frame.update(..., true)`, inércia de toque, bloqueio de scroll e restauração manual | Scroll nativo; removidos RAF global, Lenis e bloqueio de entrada |
| Nav | Dois setters chamados em cada atualização do scroll; header com blur e sombra | Header fixo opaco, sem assinatura de scroll; drawer estático |
| Hero/HeroGlow | Texto com blur animado; três camadas grandes com filtros; springs de ponteiro e leitura de geometria a cada movimento | Gradientes radiais estáticos; entrada CSS única com transform/opacity; conteúdo visível no HTML |
| VelocityMarquee | RAF contínuo, springs de velocidade/skew e múltiplas repetições de conteúdo | Duas cópias; animação CSS; pausa por IntersectionObserver e visibilidade da aba |
| Manifesto | MotionValues e transforms por palavra | Sete segmentos de opacidade no desktop; texto estático no mobile |
| WorksFan | Setter em cada frame de scroll; filtros/sombras sobre cards em movimento | Sticky CSS + MotionValues; estado apenas no hover/foco; cards estáticos no mobile |
| CountUp | Estado React atualizado durante a contagem | Escrita isolada no texto, somente quando o inteiro muda |
| Magnetic/TiltCard | Leitura de `getBoundingClientRect()` durante todo pointermove | Medição no pointerenter; transforms via MotionValues; sem efeito no header fixo |
| ImageReveal | Parallax por imagem, overscan e duas cortinas | Imagem lazy com dimensões reservadas e uma revelação discreta |
| Pipelines | Dezenas de timelines repetidas, inclusive fora da tela | Texto e geometria SSR; uma linha decorativa carregada sob demanda |
| Stack | Hover alterava estado e animava `grid-template-rows`, provocando layout | Accordion nativo com `details`/`summary`, sem animação de dimensões |
| Grain | Filtro SVG e blending em toda a viewport | Pequeno tile estático, sem filtros nem blending |
| Preloader | Bloqueio artificial de entrada e contador atualizado por intervalo | Componente removido; página utilizável desde a primeira renderização |

Os setters repetidos de valores booleanos podiam ser descartados pelo React quando o valor não mudava. Ainda assim, eram invocados por frame; os contadores realmente renderizavam durante a animação. O diagnóstico acima identifica custos de implementação, não atribui percentuais de CPU sem um trace.

## Organização final

- `use-animation-policy.ts`: um único listener compartilhado de media query. Efeitos elaborados só montam com tela de pelo menos 768px, hover, ponteiro preciso e sem preferência por movimento reduzido. A primeira renderização é estática e consistente entre servidor e cliente.
- `ExperienceProvider`: configura a política do Motion, sem estado de introdução e sem controle de scroll.
- `CaseStudies`, `StackCapabilities` e os pipelines são Server Components. Conteúdo, links e accordion não dependem de hidratação.
- `DeferredVisual`: observa a proximidade da viewport e usa `dynamic(() => import(...), { ssr: false })` para a camada decorativa. O diagrama completo continua no HTML; não há placeholder de altura estimada nem desaparecimento do conteúdo.
- `WorksFan`: o fallback SSR reserva os mesmos `360vh` no desktop usando a mesma media query do hook, e mantém os cards legíveis com sticky. O módulo `works-fan-animated.tsx` usa `dynamic({ ssr: false })` e só monta quando a seção chega a 800px da viewport; mobile não carrega esse módulo. O artwork compartilhado evita duplicar os cards. Isso evita mudar a posição dos cases na hidratação.
- `Magnetic`, `TiltCard` e `SplitReveal`: subárvores animadas isoladas. Elementos estáticos não recebem estado de animação por frame.
- `use-fit-text`: ResizeObserver considera mudanças de largura e agrupa a medição em um RAF; mudanças de altura causadas pela própria escrita não realimentam o ajuste.

Não foi adicionado React Compiler nem memoização indiscriminada: não havia processamento pesado que justificasse um novo compilador ou cache. A prioridade foi eliminar loops, estado por frame, filtros e subárvores cliente desnecessárias. MotionValues preservam as animações de scroll sem renderizar a árvore React.

Foram removidos Lenis e a dependência de conversão de PDF sem uso no projeto. Sharp permanece como dependência da otimização de imagens do Next.js. As mudanças de apresentação incluem header sempre visível, fundo do hero estático, ausência de preloader e versões simplificadas dos efeitos no celular.

## Validação de performance no navegador

Use `npm run build` e `npm start`, com DevTools separado da janela de conteúdo. O modo de desenvolvimento inclui HMR e verificações extras, portanto não serve como comparação final.

1. Grave um trace de Performance durante 15–20 segundos, passando por hero, manifesto, leque e cases. Repita o mesmo percurso, viewport e throttling antes/depois em uma versão anterior separada.
2. Em uma tela de 60 Hz, verifique o orçamento aproximado de 16,7ms por frame, frames perdidos, tarefas longas e tempo de layout/paint. Animações CSS/MotionValues também precisam ser medidas: transform não garante composição barata para qualquer tamanho de camada.
3. Confirme que marquee/linha dos pipelines pausam fora da viewport e ao ocultar a aba. Em repouso, não deve existir um loop próprio de Lenis, contador de preloader ou parallax por imagem.
4. No React Profiler, confira que rolar não gera commits contínuos em Nav, WorksFan ou nos contadores. Commits por entrada na viewport, hover, abertura de modal e filtros são esperados.
5. Teste celular real e `prefers-reduced-motion`: leque, parallax, tilt, magnetismo e marquee devem ficar estáticos. Use teclado para accordion, navegação e modal.
6. Confira links diretos `/#work`, `/#case-agendra`, `/#case-bonds`, `/#stack` e `/#contato`, incluindo recarga com posição restaurada.
7. Compare snapshots de memória após percorrer a página e abrir/fechar certificados. Depois de GC, a quantidade de listeners e nós destacados não deve crescer continuamente.

Build e TypeScript validam integração e tipos. Uma garantia de 60 FPS depende de traces no navegador e nos dispositivos alvo; não pode ser inferida apenas da refatoração ou de um score Lighthouse.

## Checks executados em 24/10/2026

- `npm run build`: passou na pasta original, após encerrar o processo concorrente e limpar somente o cache gerado. Rota principal estática; First Load JS informado pelo Next.js: 189 kB. Sem baseline equivalente, esse número não representa uma redução percentual medida.
- `npm run typecheck`: passou. Checagem adicional com `--noUnusedLocals --noUnusedParameters --incremental false` também passou.
- `git diff --check`: passou.
- Smoke HTTP com servidor temporário de produção: página, ícone e oito assets JavaScript retornaram 200; rota inexistente retornou 404; otimização de imagem retornou 200 com WebP.
- HTML de produção: oito âncoras principais presentes uma vez cada; nenhum estilo inline de opacidade zero escondendo conteúdo SSR.
- CSS de produção: keyframes do marquee, geometria reservada do leque e media queries de movimento reduzido presentes.
- Não foi feito profiling visual/FPS ou teste de interação no navegador: a conexão da ferramenta de navegador foi encerrada durante a sessão. Os checks HTTP não substituem esse teste.

## Referências

- [Next.js: lazy loading e ssr:false em Client Components](https://nextjs.org/docs/app/guides/lazy-loading)
- [Motion: política de movimento reduzido](https://motion.dev/docs/react-motion-config)
- [Motion: scroll com MotionValues](https://motion.dev/docs/react-use-scroll)
- [web.dev: custo de animações e composição](https://web.dev/articles/animations-and-performance)
