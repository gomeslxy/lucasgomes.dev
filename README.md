# Lucas Gomes (@gomeslxy) — Portfólio

Portfólio pessoal desenvolvido com Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion e Lenis. Apresenta decisões de arquitetura, fluxo de dados e trade-offs de projetos full-stack.

## Projetos em destaque

- **Agendra** ([agendra.site](https://www.agendra.site)) — Projeto de estudo full-stack de qualificação de leads e agendamento automatizado via WhatsApp com IA, busca semântica (`pgvector`), isolamento multi-tenant via PostgreSQL RLS, Upstash Redis e WhatsApp Cloud API.
- **Bonds Agence** ([bonds-agence.vercel.app](https://bonds-agence.vercel.app)) — E-commerce full-stack finalizado com Next.js, Stripe, Supabase (PostgreSQL, Auth PKCE e Realtime), Resend e rate limiting na Edge com Upstash Redis.

## Stack

- **Framework:** Next.js 15 (App Router) & React 19
- **Linguagem:** TypeScript (`strict: true`)
- **Estilização:** Tailwind CSS v4 & CSS Modules
- **Animação & Scroll:** Motion (`motion/react`), Lenis e campo WebGL sob demanda
- **SEO & Metadados:** Metadata API, `sitemap.ts`, `robots.ts`, `manifest.ts`, Open Graph (`1200x630`) e JSON-LD (`Person` + `WebSite`)

## Estrutura

- `src/app/`: rotas, layout raiz, metadados, `sitemap.ts`, `robots.ts` e `manifest.ts`
- `src/components/hero/`: card de perfil, profundidade em camadas CSS 3D e canvas WebGL
- `src/components/sections/`: navegação, vitrine de projetos, modal de arquitetura, trajetória, certificados e contato
- `src/components/experience/`: abertura inicial não-bloqueante e atmosfera periférica
- `src/components/motion/`: diretor único de scroll (`ScrollDirector`) e reveals composited-only
- `src/lib/`: dados do portfólio, políticas de movimento e hooks de acessibilidade/scroll

## Desenvolvimento

```bash
npm install
npm run dev
```

### Variáveis de ambiente

- `NEXT_PUBLIC_SITE_URL` *(opcional)*: URL canônica de produção usada em `metadataBase`, `sitemap.xml`, `robots.txt` e JSON-LD. Padrão: `https://lucasgomes.dev`.

## Validação e build

```bash
npm run lint
npm run typecheck
npm run test:motion
npm run build
npm start
```

## Contato

- **Nome:** Lucas Gomes (`@gomeslxy`)
- **E-mail:** `la181009@gmail.com`
- **Localização:** Indaiatuba, SP — Brasil
- **GitHub:** [github.com/gomeslxy](https://github.com/gomeslxy)
