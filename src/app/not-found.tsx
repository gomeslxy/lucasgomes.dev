import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#080808] text-[#EAEAEA] px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-[#E11D2A] mb-3">
        [404] — Página Não Encontrada
      </p>
      <h1 className="font-serif italic text-5xl md:text-7xl font-normal tracking-tight mb-6">
        Destino Inexistente
      </h1>
      <p className="text-zinc-400 max-w-md text-sm mb-8 leading-relaxed">
        A rota solicitada não existe ou foi movida. Retorne para a página inicial do portfólio.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-xs font-mono tracking-wider uppercase transition-colors"
      >
        Voltar ao Início
      </Link>
    </main>
  );
}
