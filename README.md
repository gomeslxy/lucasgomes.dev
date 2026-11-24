# Portfólio — Lucas Gomes

> Full-Stack & AI Developer | Criador de SaaS Multi-Tenant & E-Commerce de Alta Performance  
> Indaiatuba, SP — Brasil

Interface editorial de alto impacto concebida com estética **Editorial Brutalist / High-Contrast Dark & Light** e acento em **Vermelho Carmesim** (`#E11D2A`), inspirada no padrão visual Awwwards Site of the Day / FWA.

---

## ⚡ Stack Tecnológica

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **Engine Reativa**: React 19 + TypeScript Estrito
- **Estilização**: Tailwind CSS v4 com tokens autorais
- **Física de Movimento**: `motion/react` (`motion` v14) — molas inerciais e curvas cúbicas bezier
- **Smooth Scroll**: `lenis` integrado ao loop de animação do Motion
- **Tipografia**: Anton (Display), Instrument Serif (Itálico Editorial), JetBrains Mono (Metadados Técnicos) e Inter Tight (Texto Fluido)
- **Ícones**: Lucide React + SVGs vetoriais customizados

---

## 📂 Arquitetura do Projeto

```
portfolio/
├── public/
│   └── work/               # Imagens cinematográficas dos projetos
│       ├── agendra.jpg     # Featured SaaS: Agendra Multi-Tenant
│       └── bonds.jpg       # E-Commerce: BONDS AGENCE V4
├── src/
│   ├── app/
│   │   ├── globals.css     # Design tokens, keyframes e utilitários editoriais
│   │   ├── layout.tsx      # Fontes Google, Viewport, OpenGraph e SEO Schema.org
│   │   ├── page.tsx        # Composição das seções com Smooth Scroll
│   │   └── icon.svg        # Favicon monograma
│   ├── components/
│   │   ├── providers/      # Lenis smooth scroll sincronizado com Motion RAF
│   │   ├── sections/       # Seções modulares da narrativa de scroll:
│   │   │   ├── nav.tsx                 # Header com inversão e menu drawer mobile
│   │   │   ├── hero.tsx                # Wordmark responsivo com dispersão em scroll
│   │   │   ├── marquee-bands.tsx       # Faixas reativas à velocidade da rolagem
│   │   │   ├── manifesto.tsx           # Revelação palavra a palavra e estatísticas
│   │   │   ├── works-fan.tsx           # Seção pinada com cards em leque 3D
│   │   │   ├── case-studies.tsx        # Estudos de caso detalhados + especificações de arquitetura
│   │   │   ├── agendra-pipeline.tsx    # Diagrama de arquitetura viva do Agendra (Multi-LLM & RAG)
│   │   │   ├── bonds-pipeline.tsx      # Diagrama de arquitetura do BONDS V4 (Realtime & Edge)
│   │   │   ├── stack-capabilities.tsx  # Matriz técnica e interesses pessoais
│   │   │   ├── trajectory.tsx          # Ledger histórico com filtros de experiência/educação
│   │   │   └── contact-footer.tsx      # Wordmark gigante, cópia rápida e links diretos
│   │   └── ui/             # Micro-interações autorais:
│   │       ├── preloader.tsx           # Curtain preloader com contador suave
│   │       ├── cursor.tsx              # Cursor magnético com modos de hover e label
│   │       ├── grain.tsx               # Textura de ruído SVG sutil
│   │       ├── magnetic.tsx            # Efeito magnético atrelado ao ponteiro
│   │       ├── tilt-card.tsx           # Perspectiva 3D e reflexo dinâmico
│   │       ├── split-reveal.tsx        # Revelação tipográfica cinética
│   │       ├── count-up.tsx            # Contadores numéricos em viewport
│   │       ├── velocity-marquee.tsx    # Marquee com inclinação e aceleração
│   │       └── scroll-chrome.tsx       # Barra de progresso e indicador de capítulos
│   └── lib/
│       ├── data.ts         # Dados reais e tipados sobre Lucas Gomes
│       ├── utils.ts        # Fórmulas de interpolação e curvas de mola
│       └── use-fit-text.ts # Hook de ajuste tipográfico milimétrico
```

---

## 🚀 Como Executar

### 1. Pré-requisitos
Node.js 18+ instalado.

### 2. Desenvolvimento Local
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### 3. Build de Produção
```bash
npm run build
npm run start
```
