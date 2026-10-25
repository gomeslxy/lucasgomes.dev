# Hero de perfil

A entrada do portfólio é um card de perfil central, inspirado em perfis sociais personalizados: banner e PFP fornecidos pelo Lucas, avatar com status, badges, identidade, bio, stack e ações rápidas. O efeito 3D pertence ao corpo do card, com inclinação, extrusão e profundidade entre camadas. As imagens permanecem estáticas no próprio plano. A rich presence permite alternar entre três focos de trabalho; são conteúdo editorial configurável.

O visual usa CSS Modules ao lado do Tailwind CSS já instalado. Os movimentos de saída usam Motion, também já presente no projeto. Não foi adicionada dependência.

## Personalizar o perfil

Edite `src/lib/hero-profile.ts`:

```ts
export const heroProfile = {
  displayName: "Lucas",
  handle: profile.githubHandle,
  avatarSrc: "/profile/avatar.webp" as string,
  bannerSrc: "/profile/banner.webp",
  bannerAlt: "Banner profissional de Lucas",
  initials: "LG",
  status: "Codando algo novo",
  role: "Desenvolvedor full-stack",
  bio: "Sua apresentação curta aqui.",
  stack: ["Next.js", "React", "TypeScript"],
  activities: [
    {
      id: "coding",
      label: "Codando",
      title: "Seu foco técnico atual.",
      detail: "Uma descrição curta do que você está criando",
      icon: "terminal",
    },
    // Mantenha as outras atividades ou personalize seu conteúdo.
  ],
} as const;
```

Os ícones disponíveis nas atividades são `terminal`, `layers` e `cpu`. Mantenha identificadores únicos e ao menos uma atividade. O primeiro item aparece inicialmente; os botões permitem trocar o conteúdo por mouse, toque ou teclado.

Para adicionar sua foto, salve uma imagem em `public/profile/avatar.webp` e defina `avatarSrc: "/profile/avatar.webp"`. Enquanto `avatarSrc` estiver vazio, o card exibe o monograma definido em `initials`. A imagem usa `next/image`, com espaço reservado pelo contêiner circular. Prefira uma foto quadrada e otimizada; a área exibida tem aproximadamente 104 px no desktop.

E-mail, GitHub, LinkedIn e localização continuam centralizados em `src/lib/data.ts`, no objeto `profile`. O botão de contato copia `profile.email` com confirmação acessível; se a área de transferência estiver indisponível, apresenta um link para enviar e-mail. O CTA de projetos aponta para `#work` e usa o helper de scroll existente.

O fundo, as dimensões e os breakpoints ficam em `src/components/hero/hero.module.css`. `profile-banner.tsx` usa `next/image` para mostrar o banner completo na proporção 4:1. O banner e a foto atuais são versões WebP dos anexos LinkedIn, sem elementos 3D sobrepostos.

## Estrutura dos componentes

| Arquivo | Responsabilidade |
| --- | --- |
| `src/components/sections/hero.tsx` | Compõe a seção e entrega o conteúdo renderizado no servidor. |
| `src/components/hero/profile-stage.tsx` | Mede o progresso do scroll e controla o palco, a saída espacial e a pausa de animações. |
| `src/components/hero/profile-card.tsx` | Renderiza identidade, avatar, badges, bio, tecnologias e links sociais. |
| `src/components/hero/profile-banner.tsx` | Mostra o banner fornecido, na proporção original. |
| `src/components/hero/profile-depth.tsx` | Dá volume ao próprio card, com inclinação, placas traseiras e luz reativa. |
| `src/components/hero/profile-actions.tsx` | Gerencia a cópia de contato e o CTA para projetos. |
| `src/components/hero/rich-presence.tsx` | Gerencia a seleção de atividade com botões e anúncio acessível do conteúdo. |
| `src/components/hero/hero.module.css` | Define o visual do card, o palco e as adaptações de tela. |
| `src/components/hero/rich-presence.module.css` | Define o visual e as microanimações da atividade. |

## Como a saída 3D funciona

O volume em repouso é controlado por `ProfileDepth`, em um rig separado da câmera de scroll. O cursor inclina o card em até 0,8° no eixo Y e 0,6° no eixo X, com molas amortecidas. Duas placas traseiras, recuadas 14 e 30 px, dão espessura à superfície. Identidade, avatar, detalhes e ações usam profundidades próprias. A luz de borda e o reflexo se movem por `transform` e `opacity`, com intensidade baixa; foco de teclado também acende a superfície. O efeito de mouse é desativado no touch, preservando o scroll vertical, e os botões permanecem imóveis. Valores ficam em `src/lib/experience-config.ts`.

As placas começam abaixo dos metadados: `ResizeObserver` mede a posição do card quando o layout muda, sem medição por frame. A sequência de entrada usa outro rig, permitindo revelar, inclinar ao cursor e sair no scroll sem disputar a mesma propriedade `transform`.

`ProfileStage` usa `useScroll` com a seção como `target`. O progresso é convertido em MotionValues por `useTransform`; os valores atualizam `transform` e `opacity` diretamente, sem renderizar React a cada frame.

Em telas com espaço suficiente, `.stickyStage` permanece fixada no topo por `position: sticky`. O contêiner `.stageShell` aplica `perspective: 1500px`, e o plano do card usa `transform-style: preserve-3d`. O movimento começa após os primeiros 13% do intervalo de scroll: o card recua até `z: -1050`, sobe até `y: -135`, inclina até `rotateX: 48` e gira até `rotateZ: -9`. A opacidade começa a cair após 58% do progresso e chega a zero em 98%. Um texto de transição aparece atrás do card durante a saída.

O pin só é ativado quando todas estas condições são atendidas: largura mínima de 900 px, altura mínima de 880 px, suporte a hover, ponteiro preciso e ausência de preferência por movimento reduzido. A altura considera o banner completo. A consulta de mídia de `profile-stage.tsx` corresponde à consulta do CSS; mantenha as duas sincronizadas ao alterar os limites.

Nesse modo, `.hero` tem `height: 148svh` e `margin-bottom: -16svh`. A altura cria o percurso do pin, e a margem negativa antecipa a chegada da próxima seção para conectar a transição aos projetos.

No mobile, no touch e em janelas curtas, não há pin: todo o conteúdo segue o fluxo natural. O progresso é medido de `"end end"` até `"end start"`, iniciando a saída somente depois que o fim da seção alcança o fim da viewport. A saída é leve, com até 24 px de deslocamento vertical e 5 graus de inclinação, sem recuo no eixo Z. Com `prefers-reduced-motion`, os transforms e o fade de saída não são aplicados.

Para mudar a sensação da saída:

- **Duração em distância de scroll:** ajuste os `148svh` de `.hero`. Um valor maior prolonga o percurso. Revise também a margem negativa e confira a chegada de `#work`.
- **Profundidade:** altere o destino `-1050` do MotionValue `z`. Valores mais negativos afastam o card. A perspectiva de `1500px` define a intensidade visual da projeção.
- **Rotação:** ajuste os valores finais de `rotateX` e `rotateZ` em `profile-stage.tsx`.
- **Pausa inicial e fade:** ajuste os pontos dos intervalos de `useTransform`, como `.13`, `.58` e `.98`. São frações do progresso, não segundos.

## Fluidez e acessibilidade

O conteúdo do card já está no HTML renderizado pelo servidor e aparece antes da hidratação. O palco não depende de WebGL, canvas ou medição de texto por frame. A saída anima apenas transformações e opacidade, propriedades favoráveis à composição pela GPU. O Lenis existente é dirigido pelo loop de frames do Motion; a hero não adiciona um segundo `requestAnimationFrame` manual.

As animações contínuas do indicador e da rich presence respeitam a pausa por `IntersectionObserver` e `visibilitychange`, além de `prefers-reduced-motion`. O estado `inert` é aplicado ao card após 94% da saída para retirar seus controles da navegação por teclado quando ele já está desaparecendo.

O link do indicador de scroll também recebe `inert` quando termina seu fade. As opacidades usam transforms funcionais ligados ao mesmo progresso medido da perspectiva, mantendo o intervalo correto após hidratação ou mudança de breakpoint. O `will-change` do card é liberado quando a seção fica fora da viewport.

Os botões de atividade usam `aria-pressed`; a atualização é anunciada por `aria-live`. A cópia de contato também tem feedback acessível. O scroll mantém o helper existente, com Lenis no desktop elegível e rolagem nativa no touch, respeitando movimento reduzido.

60–120 FPS é uma meta de projeto, não uma garantia independente do aparelho. Para validar, use o build de produção em celulares reais e telas de 60/120 Hz, verificando frames, custo de composição, estabilidade de layout e Core Web Vitals. As verificações básicas do projeto são `npm run typecheck` e `npm run build`; uma gravação no painel Performance do navegador complementa a inspeção visual durante o scroll.

## Validação desta implementação

- TypeScript e build de produção concluídos com sucesso.
- Verificação em Edge headless nas resoluções 1440×900, 1366×768, 768×1024, 390×844, 360×640 e 320×640, incluindo simulação de touch.
- Ausência de overflow horizontal e de erros de execução nas páginas testadas.
- Troca das atividades, confirmação da cópia de contato, fallback de e-mail e navegação para projetos.
- Saída e retorno do card, remoção de controles invisíveis do foco, troca de desktop para mobile e preferência por movimento reduzido.

Essas verificações funcionais e visuais não substituem uma medição de FPS em dispositivos físicos.
