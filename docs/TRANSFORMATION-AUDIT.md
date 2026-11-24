# Auditoria de transformação — Lucas

## Escopo e direção final

Esta auditoria parte da leitura dos componentes e estilos do portfólio antes da transformação espacial. Os achados do “antes” são verificáveis no código daquele snapshot; não constituem avaliação de screenshots novos nem medição de FPS. A validação visual e funcional da implementação final deve acompanhar este documento.

A direção foi ajustada conforme a preferência do usuário: **o elemento 3D central é o próprio card de perfil**. Banner e foto de perfil usam as imagens fornecidas pelo usuário, seguindo sua identidade no LinkedIn. O banner permanece uma imagem estática dentro da composição; não é substituído por uma escultura, shader ou canvas. A profundidade pertence ao card, às suas bordas e aos planos da interface.

O site já possui uma linguagem reconhecível: preto profundo, carmesim, títulos condensados, metadados monoespaçados e conteúdo técnico substancial. O potencial desperdiçado está na relação entre esses elementos: seções retangulares consecutivas, imagens com pouca presença no desktop, vários blocos de texto tratados com o mesmo peso e quase nenhuma continuidade espacial entre capítulos.

No snapshot inicial, a hero tinha saída CSS 3D, mas quase todo o perfil era uma superfície plana em repouso. O banner orbital ilustrado e a entrada por uma subida de 22 px não davam massa ao card. A transformação passa a estabelecer uma gramática coerente: **sinal → perfil físico → trabalho**. A abertura organiza a interface, o card ganha espessura e resposta amortecida, e os projetos emergem como planos tangíveis.

## Mapa de oportunidades

| Região e origem | Antes, identificado no código | Depois proposto | Limite de movimento e prioridade |
| --- | --- | --- | --- |
| Hero — `hero.tsx`, `profile-stage.tsx`, `hero.module.css` | Card bem hierarquizado, mas entrada por `translateY(22px)` e quase todos os elementos no mesmo plano. A perspectiva aparece principalmente quando o visitante está saindo. | Entrada de câmera curta; linhas de montagem, pequenos marcadores e identidade em cascata. O próprio card passa a ter planos e espessura. | P0. Conteúdo já no HTML, sem tela de espera e sem reter a rolagem. Touch recebe distância e duração menores. |
| Card — `profile-card.tsx` e camada `ProfileDepth` | Avatar, identidade, conteúdo e ações não produzem separação espacial perceptível. | **Profile Artifact**: corpo com extrusão visual por camadas, planos internos em Z, tilt amortecido e reflexo localizado sobre a superfície. | P0. CSS 3D avançado e Motion. Nenhum objeto WebGL no banner; o texto repousa nítido. |
| Banner | A arte orbital ilustrada ocupava a área que poderia reforçar a identidade pessoal do usuário. | Usar o banner anexado, seguindo a mesma apresentação do LinkedIn. A imagem é estática e acompanha apenas o plano físico do card. | P0. Preservar a imagem, reservar proporção e conferir o recorte. Sem distorção, shader, rotação independente ou objeto decorativo sobre a foto. |
| Identidade — `profile-card.tsx`, `hero-profile.ts` | O primeiro snapshot mostrava monograma porque `avatarSrc` estava vazio. O espaço de identificação pessoal estava subutilizado. | Usar a PFP anexada pelo usuário, em arquivo local otimizado, preservando o rosto no recorte circular. Avatar e status podem ocupar um plano ligeiramente mais próximo. | P0. `next/image`, dimensões reservadas e recorte conferido. Sem transformação generativa da foto. |
| Projetos — `works-showcase.tsx` | No desktop a imagem inline estava oculta por `lg:hidden`; a evidência visual dependia de hover e aparecia num painel fixo. A lista privilegiava nomes e explicações. | Mostrar os produtos sem exigir descoberta. Cada projeto é um painel amplo: imagem em um plano, título e ações em outro, entrada como dobradura e iluminação contida na superfície. | P0. Não esconder imagens do teclado ou touch. Tilt fino e curto, sem fazer o alvo fugir do clique. |
| Transição hero → projetos | O card recuava no eixo Z, mas a próxima seção chegava como um bloco horizontal independente. | A saída do perfil físico abre espaço para o primeiro plano de projeto; perspectiva e direção de luz conectam os dois momentos. | P0. Preservar `#work` e a navegação direta. Nenhuma rolagem horizontal obrigatória. |
| Cases — `case-studies.tsx` | Títulos fortes, imagens com tilt e conteúdo rico, mas longos trechos repetiam bordas e hierarquia. Imagem e dados pareciam documentos lado a lado. | Entrada de capítulo com profundidade; mídia em plano destacado e conteúdo técnico estável. O movimento apresenta o case e depois cede lugar à leitura. | P1. Efeito no intervalo de entrada, sem animar parágrafos durante toda a leitura. |
| Diagramas — `agendra-pipeline.tsx`, `bonds-pipeline.tsx` | Nós de arquitetura eram uma grade de seis caixas; conectividade ficava implícita nos rótulos. | Fazer a ordem de leitura aparecer como circuito: linha conectora, poucos pulsos de sinal e camadas que se acomodam em sequência. | P2. A ordem continua sendo uma lista semântica. Animação deve explicar o fluxo técnico. Não adicionar canvas por decoração. |
| Sobre — `manifesto.tsx` | Boa copy e contraste tipográfico, com estrutura estática de duas colunas e três princípios. Havia pouca mudança de atmosfera após os cases. | Tratar como pausa de escala: texto no primeiro plano e princípios se assentando com atrasos curtos. A continuidade vem de planos e luz, sem introduzir outro objeto central. | P1. Manter o conteúdo como protagonista. Nenhum interlúdio WebGL obrigatório. |
| Faixas — `marquee-bands.tsx`, `velocity-marquee.tsx` | As bandas inclinadas já ofereciam energia, mas eram um recurso frequente em portfólios. | Usá-las como junção entre capítulos: velocidades diferentes sugerem profundidade, enquanto a passagem das seções mantém o mesmo eixo espacial. | P2. Evitar somar parallax forte, velocidade alta e rotação simultânea. Touch permanece legível e estático quando necessário. |
| Stack — `stack-capabilities.tsx` | Accordions nativos funcionais, mas cinco caixas com aparência semelhante tornavam a seção previsível. | Entrada por planos deslocados; categoria ativa recebe uma borda iluminada e tecnologias aparecem organizadas, sem virar nuvem decorativa. | P1. Preservar `details/summary`, abertura nativa, conteúdo textual e foco. Não animar altura a cada frame. |
| Trajetória — `trajectory.tsx` | O fundo claro já oferecia uma mudança útil de ritmo. Certificados e experiência usavam grades e linhas convencionais. | Fazer a mudança para o claro parecer uma folha que se desdobra. A profundidade fica no enquadramento e na entrada. | P1. Movimento mais sóbrio. Não distorcer ou girar continuamente o texto dos certificados. |
| Footer — `contact-footer.tsx`, `big-name.tsx` | Já havia glow reativo, contato direto e assinatura monumental; um dos trechos mais trabalhados. | Encerrar com uma assinatura estável que assenta num último plano. A luz responde ao foco; a ação de contato continua óbvia. | P1 para custo da animação; P2 para ornamentação extra. |
| Navegação — `nav.tsx`, `scroll-chrome.tsx` | Barra fixa arredondada e marcação ativa funcionavam como UI utilitária. | A navegação é a âncora estável da experiência; manter controles precisos e um indicador discreto de progresso/capítulo. | P0 para foco e usabilidade. Sem fazer os controles flutuarem ou fugirem do toque. |

## Três efeitos centrais

### 1. Signal Assembly — a interface ganha forma

O primeiro contato é um enquadramento próximo do perfil. Traços finos carmesim marcam os eixos e o card parece se organizar no espaço. O plano principal se aproxima por perspectiva e perde a inclinação inicial; avatar, nome, metadados e ações se acomodam em uma cascata curta. O último movimento é pequeno, com desaceleração precisa, para comunicar peso.

A sequência deve ocupar aproximadamente um segundo no desktop. Ela não é um preloader e não aguarda uma lista de assets. O HTML do perfil, os links e as imagens existem desde o primeiro render; a animação apenas enquadra o conteúdo. A abertura não captura o scroll nem cria um clique obrigatório para entrar. No touch, a aproximação fica menor e a sequência mais curta. Com movimento reduzido, o perfil aparece na posição final.

Estrutura:

- Palco externo com perspectiva; plano de entrada separado do plano de saída no scroll e do tilt de ponteiro.
- Guias luminosas e profundidade separadas da camada de texto.
- `transform` e `opacity` para a revelação; nenhuma interpolação de `height`, `top` ou espaçamento de layout.
- Delays curtos entre grupos, evitando uma fila longa de elementos que o visitante precisa esperar.
- Banner e PFP preservados como imagens. A sensação de câmera é aplicada ao enquadramento do card.

Os feixes são uma sugestão gráfica de luz e profundidade. A composição não precisa de simulação volumétrica física nem de um canvas para oferecer essa leitura.

### 2. Profile Artifact — o perfil é o objeto

O card torna-se o elemento tangível da experiência. Uma borda frontal, camadas de espessura e planos internos separados por pequenas distâncias em Z sugerem um objeto sólido. A resposta acontece no conjunto: ao mover o cursor, o card inclina com amortecimento e seus planos demonstram parallax; um brilho contido desliza pela superfície. O banner e a PFP mantêm seu conteúdo visual original.

A profundidade é construída com `perspective`, `transform-style: preserve-3d`, `translateZ` e camadas de DOM. A extrusão é uma representação visual por superfícies CSS; não é uma malha de WebGL nem uma simulação física de material. A iluminação usa gradientes e opacidade de alcance local, sem alegações de caustics, ray tracing, reflexo físico ou shader GLSL no banner.

Separar responsabilidades evita conflito entre transformações:

1. O palco posiciona a câmera e conduz a saída no scroll.
2. O plano de entrada executa a aproximação inicial e termina na pose neutra.
3. `ProfileDepth` converte ponteiro/foco em orientação amortecida e controla as camadas de espessura e reflexo.
4. Avatar, conteúdo e ações têm distâncias em Z discretas. Não é necessário destacar cada tag ou letra como um objeto independente.

A resposta ao ponteiro deve ser limitada para não prejudicar clique ou leitura. O card volta ao repouso ao sair o ponteiro. No touch, o gesto vertical de rolagem continua livre; a política pode oferecer uma reação tátil curta com amplitude menor, sem depender de hover. A aceleração da saída acompanha o scroll, mantendo as camadas coerentes durante o recuo.

O banner não recebe movimento independente, deformação ou objeto orbitando. Ele é uma imagem estática anexada ao plano superior do card. A PFP continua sendo uma foto reconhecível, com recorte conferido, sem processamento generativo. A assinatura tridimensional pertence à interface física que reúne essas imagens.

### 3. Spatial Chapters — os capítulos se desdobram

Os projetos deixam de ser linhas que apenas cruzam o topo da viewport. Um painel chega com uma inclinação pequena em X, o enquadramento da imagem recua em Z e a tipografia ocupa um plano mais próximo. Conforme o visitante avança, os planos se alinham. Em repouso, a imagem e o texto permanecem estáveis e nítidos.

As seções seguintes repetem a mesma gramática com amplitudes menores. O movimento apresenta uma mudança de capítulo; não transforma a página longa de leitura num percurso obrigatório de câmera. Os cases técnicos continuam utilizáveis quando acessados diretamente por âncora.

O efeito combina um wrapper de perspectiva, MotionValues ligados ao scroll e camadas internas. A origem da transformação define a sensação de dobradura. O parallax entre camadas usa poucos pixels; a profundidade vem da coerência entre direção, luz e escala, não da quantidade de deslocamento.

No mobile, o wrapper preserva o fluxo da página e reduz o movimento. Não há pin prolongado nem gesto lateral obrigatório. Em movimento reduzido, as seções aparecem na posição final. Os títulos e links não começam com opacidade zero no HTML do servidor.

## Microinterações que sustentam a direção

- **Luz de superfície:** brilho localizado sobre o corpo do card, com área pequena. Foco de teclado recebe resposta equivalente. O brilho não altera a foto do banner.
- **Borda reativa:** contraste do contorno acompanha hover/foco; o interior permanece escuro para preservar leitura.
- **Peso tátil:** botões comprimem poucos pontos percentuais e retornam com amortecimento. O alvo de toque e sua área clicável permanecem estáveis.
- **Estado com propósito:** copiar contato muda o estado do próprio botão e anuncia o resultado. A rich presence alterna conteúdo editorial do perfil, sem inventar telemetria ou reprodução musical.
- **Texto em repouso:** a câmera move a interface na entrada e na saída, mas parágrafos não precisam flutuar continuamente. Isso mantém contraste e reduz borramento por rasterização de CSS 3D.

## Pontos de engenharia encontrados na base

Os itens abaixo são achados do snapshot auditado. Devem ser comparados ao código final; não são afirmações de que os problemas permanecem:

1. O modal de `works-showcase.tsx` exibia “Fechar [ESC]”, mas não tinha handler de Escape, foco inicial, contenção de Tab ou restauração do foco. O painel também precisava garantir rolagem interna em telas curtas.
2. O menu de `nav.tsx` continha foco e fechava com Escape, porém não restaurava explicitamente o foco no acionador ao fechar. A camada modal também precisava impedir interação de teclado com o fundo.
3. `big-name.tsx` usava um MotionValue no `height` do recorte da assinatura. Isso contrariava o orçamento de animações restrito a transform/opacity.
4. A composição alternada de `case-studies.tsx` usava `col-start` inverso nos dois filhos sem linha explícita. A autoalocação podia colocar o segundo bloco numa nova linha desktop.
5. `GlowSurface` possuía um RAF próprio para agrupar eventos de ponteiro. Um RAF pontual não é um loop permanente, mas novas interações devem aproveitar o scheduler do Motion em vez de multiplicar loops contínuos.
6. A saída da hero já previa `inert` para controles invisíveis e fallback de clipboard. Essas proteções devem permanecer quando os planos de entrada, tilt e luz forem adicionados.

Na implementação desta rodada, a assinatura foi convertida para recorte de tamanho fixo com traduções opostas; o menu passou a preservar/restaurar `inert` no fundo e devolver o foco ao acionador; os dois planos de cada case receberam a mesma linha explícita no grid desktop. O modal de certificados passou a usar `useScrollLock`, para que o bloqueio inclua o Lenis além do overflow nativo.

## Orçamento de composição e adaptação

A composição padrão não monta canvas WebGL nem um interlúdio orbital. DPR, frustum culling e destruição de buffers/contextos não são controles aplicáveis a esses efeitos CSS 3D. O orçamento relevante é o número e a área das camadas compostas, a resolução das imagens, o custo de pintura e o trabalho executado por frame.

| Condição | Política de composição | Experiência preservada |
| --- | --- | --- |
| Desktop com ponteiro preciso | Tilt amortecido com amplitude limitada, poucas camadas em Z, reflexo localizado e saída espacial pelo Motion. | O próprio card tem volume e responde ao visitante. |
| Mobile/touch | Menos camadas decorativas, menor amplitude e scroll nativo. Evitar filtros grandes, sombras animadas e planos de viewport inteira. | Banner, PFP, conteúdo e ações permanecem íntegros. |
| Dispositivo ou viewport limitado | Reduzir distâncias, reflexo e tilt conforme a política de capacidade; preferir uma pose estável a acumular ornamentação. | Hierarquia e identidade preservadas. |
| Seção fora da viewport | Pausar animações decorativas e liberar `will-change` que deixou de ser necessário. | Sem atividade visual contínua fora de vista. |
| Aba oculta | Suspender animações decorativas e atualizações desnecessárias; evitar salto ao retomar. | Retorno estável ao conteúdo. |
| Movimento reduzido | Remover câmera, pin, tilt, aceleração espacial e parallax; oferecer a pose final. | Leitura e navegação completas. |
| CSS 3D indisponível ou JS desativado | Renderizar card e seções no fluxo estático. | Conteúdo SSR e links continuam disponíveis. |

A saída anima `transform` e `opacity`; não mede texto nem muda altura por frame. Orientação, reflexo e progresso usam refs ou MotionValues, sem `setState` de React em cada evento de movimento. Gradientes ficam em superfícies pequenas, e a resposta visual pode ser obtida movendo uma camada pré-composta em vez de repintar um fundo de tela inteira.

O Lenis já é conduzido por `frame.update` do Motion. Não há necessidade de um loop de renderização de canvas para o card. As interações devem compartilhar a infraestrutura existente, com inscrição e cancelamento explícitos quando utilizarem o scheduler.

As imagens de banner e perfil devem ter dimensões CSS reservadas antes do carregamento, arquivos locais otimizados e `sizes` adequados. O card é legível antes da hidratação. A transformação não pode introduzir scroll horizontal, tornar texto desfocado em repouso ou deixar controles transparentes no tab order.

## WebGL como oportunidade futura — P2

WebGL não é o efeito central desta versão e não integra a composição padrão do perfil. Uma implementação futura só se justifica quando houver conteúdo que precise demonstrar uma cena ou um modelo tridimensional, ou uma interação que não possa ser bem resolvida por planos CSS. Não se deve adicionar canvas apenas para decorar o banner ou preencher espaços entre seções.

Se uma necessidade concreta surgir, a proposta deve incluir carregamento sob demanda, DPR inicial de 1 no mobile e teto de 1.5 no desktop, resolução adaptativa, culling, pausa fora de vista e descarte explícito de contexto e recursos. Esses itens seriam requisitos daquela cena futura, não capacidades a anunciar como parte do card atual.

## Critérios de aceite

1. **Identidade:** nome, banner anexado, PFP anexada, username e ações aparecem sem depender de um efeito. As imagens seguem a identidade fornecida pelo usuário.
2. **Profundidade do card:** inclinar o conjunto demonstra separação entre corpo, bordas e planos internos. O banner permanece uma imagem estática no seu plano; não contém uma escultura ou canvas substituindo-o.
3. **Navegação:** âncoras, CTA de projetos, menu, modal, contato e retorno ao topo funcionam por mouse, touch e teclado.
4. **Leitura:** nenhum conteúdo essencial depende de um reveal que não inicializou. Zoom de 200%, telas baixas e `prefers-reduced-motion` mantêm fluxo utilizável.
5. **Ciclo de vida:** efeitos decorativos deixam de atualizar fora de vista e com a aba oculta; camadas não mantêm `will-change` desnecessário.
6. **Responsividade:** testar pelo menos 320×640, 360×640, 390×844, 768×1024, 1366×768 e 1440×900, incluindo resize durante a transição e retorno por scroll.
7. **Produção:** TypeScript e build passam; não há erros de execução ou overflow horizontal nos percursos testados.
8. **Performance física:** medir em celular intermediário e em tela de 120 Hz. O orçamento de um frame a 60 Hz é cerca de 16,7 ms; a 120 Hz, cerca de 8,3 ms. Verificar frames longos, pintura, composição e memória, não apenas a média de FPS.

60–120 FPS é o objetivo de engenharia. Build aprovado, uso da GPU pelo compositor e testes headless não constituem garantia de frequência em qualquer aparelho. A versão final precisa registrar o que foi medido e em quais condições.

## Ordem de execução

1. Aplicar banner e PFP fornecidos, preservar conteúdo SSR e estabilizar a navegação.
2. Construir `ProfileDepth`: camadas do card, extrusão visual, tilt amortecido e reflexo localizado.
3. Compor Signal Assembly separando seus transforms da interação de ponteiro e da saída no scroll.
4. Implementar Spatial Chapters e a nova apresentação de projetos; corrigir o modal no mesmo percurso.
5. Revisar cases, assinatura e menu para eliminar custos ou comportamentos que contradizem a direção.
6. Validar a experiência em produção e então medir em aparelhos reais, com movimento reduzido e navegação por teclado.

O ganho principal vem de três gestos reconhecíveis e bem executados. A tridimensionalidade é uma propriedade do perfil e da passagem dos capítulos; as imagens pessoais continuam sendo imagens pessoais.

## Verificação da implementação final

O build de produção passou em `.next-cinematic`, isolado do cache dos outros servidores locais. O TypeScript também passou. A hero, os anexos aplicados e a inclinação do card foram conferidos em capturas desktop e mobile; a nova apresentação dos projetos foi inspecionada no navegador.

Os testes funcionais em Edge headless passaram em 1440×900, 1366×768, 768×1024, 390×844, 360×640 e 320×640, sem overflow horizontal ou erros de execução. Foram verificados a resposta do card ao cursor, as duas imagens carregadas, a proporção integral do banner, atividades, cópia de contato e fallback, navegação a projetos, foco e Escape nos modais, restauração do foco no menu mobile e movimento reduzido. A versão final não monta canvas nem objetos orbitais no banner. Frequência de frames em celulares físicos não foi medida nesta rodada.
