# Auditoria de performance e movimento — 25/10/2026

A revisão cobre a rota principal montada por `src/app/page.tsx`, os providers, os componentes utilizados por essa rota e os diálogos abertos a partir dela. A direção visual preserva a base editorial escura, a tipografia condensada/serifada e o acento carmesim. O trabalho organiza o movimento por papel de conteúdo e reduz os custos encontrados no código, sem atribuir ganhos percentuais ou FPS sem medição.

## Diagnóstico e alterações

| Área | Situação identificada | Implementação resultante |
| --- | --- | --- |
| Transições de seção | O wrapper transformava a seção inteira com perspectiva, incluindo textos, imagens e potenciais descendentes sticky. Isso ampliava a superfície transformada e complicava a referência geométrica dos elementos internos. | `SpatialSection` mantém o conteúdo estacionário. Uma costura decorativa pequena, uma linha e um plano independente conectam a aproximação das seções. |
| Orquestração editorial | Vários efeitos instalavam sua própria interpretação de scroll; títulos e parágrafos tinham pouco repertório contextual fora do manifesto. | `ScrollDirectorProvider` centraliza a fonte de scroll e a medição dos novos reveals, das costuras e da assinatura. `Reveal` expõe cinco padrões distintos. |
| Intro | O contador atualizava estado React durante o progresso; havia blur no conteúdo completo, animação da posição da ponta da barra e promoção de uma camada do tamanho da página. | Pilhas de glifos estáticos, barra e ponta usam transformações; React acompanha fases e marcos de recursos. O progresso usa o ciclo de frames do Motion. O conteúdo principal não recebe blur nem transformação global. |
| Recursos da intro | URLs de imagem originais podiam ser carregadas novamente apesar da seleção otimizada feita por `next/image`. | A intro aguarda a decodificação dos candidatos já selecionados nas imagens do hero. Eventos de recursos e preferências usam um `AbortController` de ciclo de vida. |
| Header | Backdrop blur em uma superfície fixa e `transition-all` permitiam trabalho de pintura sobre conteúdo em movimento. | Superfície quase opaca, sem backdrop blur; entrada e feedback de movimento limitados a transform/opacity. Indicador de seção continua por `IntersectionObserver`. |
| Hero | A apresentação já tinha composição espacial; a saída podia continuar deixando links visualmente ocultos no fluxo de foco. Existiam materiais amplos e feedbacks animados por propriedades de pintura. | Entrada em câmera, montagem tipográfica por caracteres e passagem de luz usam transform/opacity. Card e convite de continuidade recebem `inert` quando ocultos. O pinning só ativa quando a viewport comporta o perfil. |
| Projetos | Cada card tinha `useScroll`, três springs, invalidação de geometria e um glow com `-inset-1/2`; o artigo inteiro, com textos, imagem e sombra, era transformado. | Artigo estacionário; título, metadados, descrição e métrica têm reveals próprios. A profundidade fica no preview menor. O motor por card e o glow ampliado foram removidos. |
| Projetos e navegação | O footer apontava para `#case-agendra`, sem um destino persistente no card. Um título estava dentro de um botão em vez de conter o botão. | Cada card expõe `id="case-${slug}"`; o heading contém o acionador. Links diretos e semântica passam a corresponder à interface. |
| Manifesto | A cena sticky já tinha ritmo compacto e matemática testada; o texto anterior e posterior à cena permanecia visualmente separado do repertório global. | O scrollytelling de três capítulos é preservado. Introdução usa máscaras por linha; resumo usa body e chamada depth. O ancestor da cena continua sem transform. |
| Faixas de conexão | As faixas tinham movimento contínuo, mas pouca ligação com a aproximação da seção. | Contramovimento curto das faixas acompanha o scroll pelo diretor; cada marquee pausa fora da viewport, na aba oculta ou ao desativar a política de movimento. |
| Stack | Os materiais recebiam listeners e observadores por superfície. Headings, badges e módulos precisavam de ritmos próprios. | Eventos de invalidação e `ResizeObserver` compartilhados entre materiais; título por linha, badges meta e módulos row. O accordion permanece um `details` nativo, sem animação de dimensões. |
| Trajetória | Título e registros tinham apresentação estática uniforme; o modal de certificados era renderizado dentro da seção. | Revelação tipográfica por linha, registros row e certificados depth. Modal em portal, com isolamento do fundo, foco, Escape, restauração e bloqueio de scroll. |
| Contato | Headline, texto e chamada usavam a mesma presença visual; superfícies grandes tinham sombras e transições amplas. | Headline por linha, parágrafo body, metadados meta e cartão de contato depth. O feedback de cópia respeita o unmount e mantém área reservada para o status. |
| Assinatura | Havia uma assinatura local de scroll e bounds de ponteiro que podiam ficar antigos após mudanças de geometria. | A assinatura participa do diretor central. Duas translações opostas revelam o preenchimento; bounds são invalidados em scroll, resize, blur e mudança de visibilidade. |

Os pipelines de arquitetura permanecem importados estaticamente. Um experimento de carregamento por chunk foi revertido porque um fallback curto não reservava a altura real do diagrama. O custo de bundle desse adiamento não foi medido, enquanto o salto de tamanho seria uma regressão concreta. Os nós só entram no DOM quando a aba do modal é aberta.

A espera mínima da intro foi reduzida de 1.400ms para 320ms. Os limites de preparação passaram a 1.400ms no desktop e 900ms no mobile, com saída de 560/360ms. A transição ainda tem custo de acesso percebido; esses limites não são resultados de LCP. Visitas elegíveis, links diretos e movimento reduzido pulam essa fase. O contador acompanha marcos reais sem simular medição de FPS, latência ou GPU.

Componentes legados não importados pela página, como `case-studies`, `works-fan` e `tilt-card`, continuam disponíveis no repositório. O comportamento de um desses componentes precisa ser reavaliado se voltar à rota. A revisão do caminho montado não certifica automaticamente todo código antigo que está sem uso.

## Repertório de movimento

| Padrão | Uso | Movimento |
| --- | --- | --- |
| `heading` | Títulos e linhas editoriais | Máscara estática por overflow; a camada de texto sobe e perde uma rotação discreta. O recorte não é animado. |
| `meta` | Labels, subtítulos e badges | Fade acelerado no início com pequena entrada lateral. Tracking permanece estático. |
| `body` | Parágrafos e blocos de leitura | Fade e deslocamento vertical curto com curva quintic. Atrasos são frações do percurso de scroll. |
| `depth` | Métricas, previews e chamadas | Perspectiva local, aproximação no eixo Z e inclinação discreta. |
| `row` | Registros da trajetória e módulos de capacidades | Entrada lateral curta com fade mais rápido, favorecendo o ritmo de uma lista. |
| Cena do manifesto | Três princípios conectados | Platôs de leitura, crossfade e profundidade reversíveis em 680px de percurso. Gesto deliberado completa o estado de leitura. |
| Montagem do hero | Primeiro contato | Câmera curta, caracteres e luz com tempos próprios; conteúdo entregue no HTML. |
| Costuras | Passagem entre seções | Plano decorativo localizado e linha de continuidade, sem mover o corpo completo da seção. |

Blur e letter-spacing animados foram evitados para manter a política conservadora de transform/opacity. O fade de metadados e as máscaras estáticas dão variedade sem depender desses efeitos.

Os títulos terminam sua revelação antes dos blocos de leitura: o intervalo de entrada vai de 100% a 72% da altura da viewport. Metadados usam 97%–74%; parágrafos, 94%–56%; destaques, 98%–56%; registros, 96%–62%. Assim um título em várias linhas não exige chegar ao centro da tela para estar legível. Os delays são frações desses percursos, sem animações em fila.

## Arquitetura do diretor

`ExperienceProvider` configura Motion, instala Lenis e oferece uma instância de `ScrollDirector` ao conteúdo. Lenis mantém `autoRaf: false`; seu driver chama `lenis.raf(timestamp)` no ciclo compartilhado do Motion.

`useSceneProgress` registra um elemento de medição estacionário e um MotionValue. `Reveal` aplica a pose somente ao filho visual. As funções de `src/lib/motion-curves.ts` transformam o progresso em strings de `transform` e valores de `opacity`; não dependem do DOM nem de estado acumulado.

O provider já está instalado na página. Para novas seções, use o papel do conteúdo:

```tsx
import { Reveal } from "@/components/motion/reveal";

export function EditorialSection() {
  return (
    <section aria-labelledby="editorial-title" className="gutter py-24">
      <Reveal pattern="meta"><p className="label">Engenharia com intenção</p></Reveal>
      <h2 id="editorial-title" className="display mt-8 text-6xl">
        <Reveal as="span" pattern="heading">Entender primeiro.</Reveal>
        <Reveal as="span" pattern="heading" delay={0.08}>Construir melhor.</Reveal>
      </h2>
      <Reveal pattern="body" delay={0.12} className="mt-8 max-w-xl">
        <p>Interfaces, dados e operação fazem parte da mesma experiência.</p>
      </Reveal>
      <Reveal pattern="depth" className="mt-8">
        <a href="#work" className="inline-flex min-h-12 items-center">Conhecer os projetos ↗</a>
      </Reveal>
    </section>
  );
}
```

`className` posiciona o anchor e `innerClassName` organiza a camada visual, incluindo flex/grid. Para headings, mantenha a classe tipográfica no h2/h3 e use `as="span"` por linha: a máscara acompanha a escala da fonte e preserva a semântica. Nenhum wrapper recebe altura calculada por JavaScript.

O diretor mantém:

- Uma fonte de scroll: evento efetivo do Lenis quando disponível ou listener nativo passivo como fallback.
- Um `IntersectionObserver` para limitar atualizações contínuas aos alvos próximos da viewport.
- Um `ResizeObserver` compartilhado para os alvos e o corpo do documento.
- Um passe de leitura de geometria em `frame.read`, seguido da atualização dos valores.
- Geometria em cache durante o caminho comum de scroll, sem leitura de layout por frame da revelação.

As medições são invalidadas por resize, fontes prontas, conclusão da intro, mudanças de dimensões e abertura/fechamento de disclosures. Elementos já visíveis quando registrados começam completos para preservar a leitura de links diretos e posições restauradas. A rolagem não envia progresso contínuo ao estado React.

O manifesto conserva seu hook específico porque sua trilha tem geometria e assentamento por capítulo próprios. O hero e a linha global de progresso continuam com hooks Motion dedicados; eles não instalam loops próprios de RAF. “Diretor central” descreve a orquestração editorial compartilhada, sem afirmar que todo componente do site passou a usar um único MotionValue.

## Ciclo de vida e isolamento

| Recurso | Liberação ou suspensão |
| --- | --- |
| Diretor | Remove evento Lenis/nativo, listeners de resize/toggle/visibilidade/intro, desconecta os dois observers e cancela callbacks de frame. Cada reveal remove seu registro ao desmontar. |
| Lenis | Driver cancela o callback de frame e remove seu listener de visibilidade. `ReactLenis` controla a instância montada. O driver interrompe a atualização enquanto a aba está oculta. |
| Bloqueio de scroll | `useScrollLock` usa proprietários independentes. Fechar um diálogo não libera um bloqueio ainda mantido por outra interface. A instância registrada não é reiniciada depois de destruída/substituída. |
| Intro | Aborta listeners de recursos/preferências, limpa timers e cancela progresso; saída também existe para Escape, botão pular, movimento reduzido, aba oculta e limite de tempo. |
| Materiais reativos | A assinatura compartilhada é removida quando a última superfície sai. Bounds são invalidados sem medir o DOM no evento de scroll. |
| Hero | Observers e listeners são removidos; loops CSS pausam fora da viewport ou na aba oculta. Eventos de ponteiro distinguem mouse de toque. |
| Marquees e atividade de pipeline | Pausa explícita por visibilidade e preferência de movimento, com remoção dos listeners ao desmontar. |
| Diálogos | Fundo `inert`, foco inicial, ciclo de Tab, Escape e restauração dos valores anteriores no cleanup. Portais evitam herdar containing blocks transformados. |
| Clipboard | Timer limpo ao desmontar; o resultado assíncrono não atualiza o footer depois de desmontado. |

A tabela descreve os caminhos de limpeza encontrados no código. Uma prova de ausência de vazamento exige também repetir montagem, navegação e abertura de diálogos e comparar heap/listeners em runtime.

## Responsividade e estabilidade

A política editorial exige largura a partir de 768px, hover, ponteiro fino e ausência de movimento reduzido. A cena fixa do manifesto exige também altura de pelo menos 640px. O pinning do hero só ativa a partir de 900×880 com a mesma política de entrada. CSS e hooks usam os mesmos critérios para essas geometrias.

Mobile, toque como ponteiro primário e movimento reduzido recebem conteúdo em fluxo e sem as revelações espaciais. O toque não recebe inércia sintética: `syncTouch` permanece falso. Em aparelhos híbridos, o ponteiro primário pode continuar sendo fino; as interações de card ainda verificam `pointerType` para não capturar toque como mouse.

Imagens de projetos e de certificados têm áreas reservadas antes da decodificação. O manifesto reserva a trilha em CSS antes da hidratação. Accordions e filtros alteram o conteúdo por ação explícita, sem interpolar altura ou grid. Mudanças de cor/borda em hover podem repintar o elemento, mas ocorrem como mudança instantânea de estado, sem uma animação de pintura contínua.

O conteúdo SSR permanece legível, e a política resolve sem remontar a árvore principal. Ao alcançar um acionador por teclado, o reveal com foco revela a camada por inteiro. A leitura por tecnologia assistiva continua pela ordem semântica do documento, sem anunciar cada frame.

## Verificação registrada nesta revisão

- `npm run typecheck`: passou na integração das novas seções e do Reveal.
- `npm run test:story`: passou; limites, continuidade, platôs, crossfade, reversão e assentamento direcional.
- `npm run test:motion`: passou; curvas contextuais, lifecycle do diretor, geometria em cache, suspensão, múltiplos consumidores do mesmo anchor e coordenação de travas. Os testes executam os módulos TypeScript reais em memória com ambiente controlado.
- O guard inspecionou 55 dependências da rota montada, incluindo folhas CSS e imports locais: keyframes/transições CSS usam somente transform/opacity; não encontrou transition-all/colors/shadow ou backdrop blur nos componentes ativos.
- Build final passou em `.next-audit`, com Next.js 15.5.28: rota principal estática, First Load JS informado de 209kB. O bundle anterior do manifesto tinha 207kB; esta revisão não alega redução de bundle.
- Navegador integrado: projetos, trajetória e máscaras sem overflow horizontal; modal de projeto abriu com fundo inert e trava de scroll, fechou por Escape e devolveu foco ao botão Agendra. Filtro de certificados e lightbox conferidos: portal no body, imagem carregada, fundo inert, Escape e retorno ao botão Ver na Página.
- Navegação para stack e redimensionamento de desktop para 375px conferidos. No layout estreito, o menu abriu, fechou ao selecionar Stack e chegou ao destino após liberar a trava. Isso verifica a navegação com mouse em viewport estreita, sem substituir toque físico.
- `git diff --check`: passou.

### Passagens instrumentadas locais

Ferramenta reproduzível: `npm run audit:serve`, com a prévia de produção já em `http://localhost:3101`. Abra `http://localhost:3110/__audit`. O proxy é restrito a loopback e não entra no bundle de produção. O botão percorre a página em scroll programático instantâneo por 16 segundos, após um segundo de aquecimento, e grava no DOM um relatório JSON. Não injeta eventos de wheel/toque.

| Passagem desktop | Mediana rAF | P95 rAF | Maior intervalo | Tarefas longas observadas | CLS durante percurso |
| --- | --- | --- | --- | --- | --- |
| Primeira passagem | 16,7ms | 33,3ms | 116,9ms | 0 | 0 |
| Repetição com recursos aquecidos | 16,6ms | 17ms | 33,7ms | 0 | 0 |
| Layout estreito, 374×811 reais | 16,6ms | 17ms | 42ms | 0 | 0 |

Condições: navegador integrado, viewport real do iframe 1263×719, DPR 1,5, documentos visíveis; o host recorta parte do iframe. Não houve overflow horizontal nessas passagens. O aquecimento de um segundo ocorre no hero; somente a segunda passagem já percorreu todas as seções anteriormente. A diferença entre passagens indica sensibilidade ao primeiro percurso, mas a instrumentação não atribui a causa a decodificação, rasterização ou escalonamento do host. A primeira passagem não permite afirmar zero jank.

Os relatórios completos estão em `docs/qa/motion-desktop-first-pass.json` e `docs/qa/motion-desktop-warm-pass.json`. Cadência rAF próxima de 60Hz não mede frames efetivamente exibidos, não constitui trace de GPU e não comprova 120 FPS. CLS zero descreve a janela de scroll observada, excluindo entrada recente; não mede o carregamento nem dados de campo. A inspeção de heap e aparelhos físicos continua necessária para confirmar ausência de vazamentos em uso prolongado.

A passagem estreita está em `docs/qa/motion-mobile-375-pass.json`, sem overflow horizontal. É uma viewport no mesmo navegador desktop, com DPR 1,5 e recorte do host; não representa hardware móvel ou teste de toque físico.

Para reproduzir a versão compilada, em PowerShell:

```powershell
$env:NEXT_DIST_DIR = ".next-audit"
npm run build
npm start -- -p 3101
```

Em outro terminal, `npm run audit:serve` abre o proxy de auditoria em `http://localhost:3110/__audit`. O servidor de auditoria pode ser encerrado ao terminar; a aplicação não depende dele.

Os resultados da rodada anterior do manifesto em `docs/SCROLLYTELLING.md` documentam a implementação anterior à orquestração global. Eles não substituem a validação desta versão.

## Critérios para concluir a medição de performance

O alvo de 60Hz permite aproximadamente 16,67ms por frame; 120Hz, 8,33ms. Esses valores são orçamentos de teste. As passagens acima medem cadência de callbacks e estabilidade durante scroll; não há FPS exibido, LCP, INP ou ganho percentual comprovado.

Transform/opacity são escolhas favoráveis à etapa de composição, mas tamanho das camadas, filtros estáticos, memória de GPU, implementação do navegador e carga concorrente ainda precisam de observação. O cálculo dos MotionValues alimentados pelo Lenis continua em JavaScript na thread principal. Escolher propriedades de composição não transforma esse cálculo em execução fora da thread principal. Essa distinção e o custo das camadas estão descritos no [guia de performance do Motion](https://motion.dev/docs/performance).

Para concluir a validação, rode uma versão de produção, registre o hardware e a frequência do monitor e capture a mesma navegação em 1280×720, 1440×900 e 768×640. Grave descida, reversão, pausas e entrada/saída do manifesto; inspecione Frames, tarefas longas, Layout, Paint e eventos de Layout Shift. Use Paint Flashing e Layer Borders em uma rodada separada. O procedimento segue a orientação de [animações de alto desempenho do web.dev](https://web.dev/articles/animations-guide).

Confira também 320×740 e 375×812, zoom de 200%, movimento reduzido ao vivo, navegação por teclado, mousewheel, trackpad e um aparelho touch real. Teste a restauração de posição e links `#work`, `#case-agendra`, `#manifesto`, `#stack`, `#trajetoria` e `#contato`. Repita a abertura dos diálogos e examine heap/listeners após coleta de lixo. Essas medições confirmam o resultado prático e revelam os custos que a revisão estática não consegue demonstrar.
