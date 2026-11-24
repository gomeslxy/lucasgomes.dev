import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-ink px-6 text-center text-bone">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-crimson-bright">
        [404] — Página não encontrada
      </p>
      <h1 className="mb-6 font-serif text-5xl font-normal italic tracking-tight md:text-7xl">
        Página não encontrada
      </h1>
      <p className="mb-8 max-w-md text-sm leading-relaxed text-ash">
        A rota solicitada não existe ou foi movida. Retorne para a página inicial do portfólio.
      </p>
      <Link
        href="/"
        className="press inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 text-xs font-mono uppercase tracking-wider text-bone hover:border-crimson hover:bg-crimson/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson"
      >
        Voltar ao início
      </Link>
    </main>
  );
}
