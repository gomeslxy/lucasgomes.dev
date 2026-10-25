# Portfólio — Lucas

Desenvolvedor Full-Stack com foco em interfaces modernas, performance e IA aplicada. O Agendra é apresentado como case pessoal de engenharia e estudo, construído de ponta a ponta.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Validação e produção

```bash
npm run typecheck
npm run build
npm start
```

O projeto usa Next.js App Router, React, TypeScript, Tailwind CSS v4, Motion e Lucide. As fontes são servidas localmente pelo `next/font`; a primeira compilação pode precisar de acesso ao Google Fonts.

Para manter um preview de produção independente de um servidor de desenvolvimento já aberto, `next.config.ts` aceita `NEXT_DIST_DIR`. No PowerShell: `$env:NEXT_DIST_DIR = '.next-cinematic'`, seguido de `npm run build` e `npm start -- --port 3217` no mesmo ambiente. Sem essa variável, o diretório padrão continua sendo `.next`.

## Estrutura da experiência

- `src/components/sections/hero.tsx`: card de perfil com abertura cinematográfica, banner e foto fornecidos, profundidade em CSS 3D, rich presence e saída espacial. Componentes em `src/components/hero/` e dados em `src/lib/hero-profile.ts`.
- `src/components/sections/works-showcase.tsx`: painéis de projetos com imagens no desktop e mobile, entrada em perspectiva, luz reativa e modal acessível.
- `src/components/spatial/spatial-section.tsx`: transições curtas entre capítulos, adaptadas ao tipo de ponteiro e à preferência por movimento reduzido.
- `src/components/experience/experience-intro.tsx`: abertura curta ligada às fontes e imagens essenciais, com saída garantida e controle para pular.
- `src/components/experience/ambient-environment.tsx`: luz periférica, partículas discretas e malha de fundo com movimento mínimo.
- `src/lib/experience-config.ts`: tempos da intro, intensidade da luz, limites do ponteiro e quantidade de partículas.
- `src/components/sections/case-studies.tsx`: contexto, autoria, arquitetura, pontos de atenção e links para os projetos.
- `src/components/sections/manifesto.tsx`: apresentação profissional compacta e competências contextualizadas.
- `src/components/sections/contact-footer.tsx`: contato por e-mail, telefone, WhatsApp e cópia com feedback acessível.
- `src/components/ui/big-name.tsx`: assinatura LUCAS com dimensão por CSS, gradiente por opacidade e deslocamento sutil via MotionValues.
- `src/lib/use-animation-policy.ts`: efeitos elaborados apenas com tela a partir de 768px, hover, ponteiro preciso e sem preferência por movimento reduzido.
- `src/lib/data.ts`: perfil, projetos, trajetória e formação.

O scroll usa Lenis somente no desktop com ponteiro preciso e sem preferência por movimento reduzido; no touch, permanece nativo. A Hero não aguarda hidratação para aparecer. Projetos e imagens reservam proporções antes de carregar. O footer não mede nem altera o tamanho da fonte por JavaScript. Não há dependências novas para este redesign.

## Documentação

- [Auditoria de contratação e três propostas de copy](docs/PORTFOLIO-REVIEW.md)
- [Decisões e validação de performance](PERFORMANCE.md)
- [Hero de perfil: estrutura, efeito 3D e personalização](docs/PROFILE-HERO.md)
- [Auditoria de transformação e os três efeitos centrais](docs/TRANSFORMATION-AUDIT.md)
- [Intro, atmosfera e configuração das interações](docs/ATMOSPHERE-INTRO.md)

As funcionalidades dos cases foram descritas a partir das informações já existentes no portfólio; seus repositórios e resultados externos não foram auditados nesta reformulação. FPS e Core Web Vitals precisam ser medidos em produção e nos dispositivos alvo. CLS 0 é um objetivo de estabilidade, não uma garantia universal; LCP mede tempo e não deve ser prometido como zero.
