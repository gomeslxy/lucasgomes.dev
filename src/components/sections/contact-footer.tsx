"use client";

import { ArrowUp, ArrowUpRight, Check, Copy, Mail, MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BigName } from "@/components/ui/big-name";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { GlowSurface } from "@/components/ui/glow-surface";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { profile } from "@/lib/data";
import styles from "@/components/spatial/living-surface.module.css";

type ContactKind = "email" | "phone";

export function ContactFooter() {
  const [copied, setCopied] = useState<ContactKind | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [copyFailed, setCopyFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copyContact(value: string, kind: ContactKind) {
    if (timer.current) clearTimeout(timer.current);
    setCopied(null);
    setAnnouncement("");
    setCopyFailed(false);

    try {
      await navigator.clipboard.writeText(value);
      if (!alive.current) return;
      setCopied(kind);
      setAnnouncement(kind === "email" ? "E-mail copiado com sucesso!" : "Telefone copiado com sucesso!");
      timer.current = setTimeout(() => { setCopied(null); setAnnouncement(""); }, 3000);
    } catch {
      if (!alive.current) return;
      setCopyFailed(true);
      setAnnouncement("Não foi possível copiar. Use os links de e-mail ou telefone acima.");
    }
  }

  return (
    <footer id="contato" className="relative overflow-hidden border-t border-white/10 bg-ink pt-16 text-bone sm:pt-24">
      <div className="gutter mx-auto max-w-[1600px]">
        {/* Header Metadata Rail */}
        <Reveal pattern="meta">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 font-mono text-[0.6875rem] uppercase tracking-widest">
          <span className="flex items-center gap-3">
            <span className="text-crimson font-bold">[05]</span>
            <span>VAMOS CONVERSAR</span>
          </span>
          <span className="inline-flex items-center gap-2 text-bone/70">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-crimson animate-pulse-dot" />
            <span>DISPONÍVEL PARA CONTRATAÇÃO</span>
          </span>
        </div>
        </Reveal>

        {/* Content Grid */}
        <div className="grid items-start gap-12 py-12 md:py-20 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="min-w-0">
            <h2 className="display text-[clamp(2.8rem,7vw,7rem)] uppercase leading-[0.92] tracking-tighter">
              <Reveal as="span" pattern="heading">Boas ideias.</Reveal>
              <Reveal as="span" pattern="heading" delay={0.1}><span className="text-crimson">Melhor em equipe.</span></Reveal>
            </h2>
            <Reveal pattern="body" delay={0.16} className="mt-8 max-w-lg">
              <p className="text-base leading-relaxed text-bone/70 sm:text-lg">
                Estou pronto para agregar valor a times que priorizam engenharia consistente, atenção meticulosa a cada detalhe de interface e evolução técnica contínua.
              </p>
            </Reveal>
            <Reveal pattern="meta" delay={0.2} className="mt-6">
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-ash">
              <span>📍 Indaiatuba & Região de Campinas</span>
              <span>·</span>
              <span>Presencial · Híbrido · Remoto</span>
            </div>
            </Reveal>
          </div>

          {/* Interactive Contact Card with Pointer-reactive Glow */}
          <Reveal pattern="depth" delay={0.1} className="min-w-0">
          <GlowSurface className="min-w-0 rounded-2xl border border-white/10 bg-[#101011] p-6 sm:p-8">
            <p className="font-mono text-[0.6875rem] uppercase tracking-widest text-ash">
              Canal Direto de Comunicação
            </p>

            <Magnetic strength={0.15}>
              <a
                href={`mailto:${profile.email}`}
                className="press group mt-6 flex min-h-[52px] items-center justify-between gap-3 rounded-xl bg-bone px-5 py-3.5 text-sm font-mono font-semibold uppercase tracking-wider text-ink outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-crimson"
              >
                <span className="flex items-center gap-3">
                  <Mail aria-hidden="true" className="h-4 w-4 text-crimson" />
                  <span>Enviar E-mail Direto</span>
                </span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
              </a>
            </Magnetic>

            {/* Quick Copy Contact List */}
            <div className="mt-6 divide-y divide-white/10">
              <div className="flex min-w-0 items-center justify-between gap-3 py-3.5">
                <a
                  href={`mailto:${profile.email}`}
                  className="flex min-h-[44px] min-w-0 items-center break-all font-mono text-xs md:text-sm text-bone/85 hover:text-crimson"
                >
                  {profile.email}
                </a>
                <button
                  type="button"
                  onClick={() => copyContact(profile.email, "email")}
                  aria-label={copied === "email" ? "E-mail copiado" : "Copiar e-mail"}
                  className="press flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 text-ash hover:border-crimson hover:text-bone motion-safe:active:scale-95"
                >
                  {copied === "email" ? <Check aria-hidden="true" className="h-4 w-4 text-emerald-400" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex min-w-0 items-center justify-between gap-3 py-3.5">
                <a
                  href="tel:+5511989940080"
                  className="flex min-h-[44px] items-center font-mono text-xs md:text-sm text-bone/85 hover:text-crimson"
                >
                  {profile.phoneDisplay}
                </a>
                <button
                  type="button"
                  onClick={() => copyContact("+5511989940080", "phone")}
                  aria-label={copied === "phone" ? "Telefone copiado" : "Copiar telefone"}
                  className="press flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 text-ash hover:border-crimson hover:text-bone motion-safe:active:scale-95"
                >
                  {copied === "phone" ? <Check aria-hidden="true" className="h-4 w-4 text-emerald-400" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <a
              href={profile.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="press mt-4 flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-bone/80 hover:border-emerald-500/50 hover:text-emerald-400"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                <span>Conversar no WhatsApp</span>
              </span>
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>

            <p role="status" aria-live="polite" aria-atomic="true" data-error={copyFailed} className={styles.contactStatus}>{announcement}</p>
          </GlowSurface>
          </Reveal>
        </div>

        {/* Social Links Row */}
        <div className="grid grid-cols-2 gap-4 border-t border-white/10 py-6 sm:grid-cols-3 font-mono text-xs">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] items-center gap-2 text-bone/70 hover:text-bone"
          >
            <GithubIcon size={16} /> <span>GitHub</span> <ArrowUpRight aria-hidden="true" size={14} className="text-ash" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] items-center gap-2 text-bone/70 hover:text-bone"
          >
            <LinkedinIcon size={16} /> <span>LinkedIn</span> <ArrowUpRight aria-hidden="true" size={14} className="text-ash" />
          </a>
          <a
            href="#case-agendra"
            className="col-span-2 flex min-h-[44px] items-center gap-2 text-bone/70 hover:text-crimson sm:col-span-1 sm:justify-self-end"
          >
            <span>Case Agendra</span> <ArrowUpRight aria-hidden="true" size={14} />
          </a>
        </div>

        {/* Monumental Signature */}
        <BigName />

        {/* Bottom Micro Copyright Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-xs font-mono text-ash/70 sm:flex-row">
          <span>© 2026 Lucas · Desenvolvedor Full-Stack & IA</span>
          <a href="#hero" className="flex min-h-[44px] items-center gap-2 text-bone/80 hover:text-crimson">
            <span>Voltar ao topo</span>
            <ArrowUp aria-hidden="true" size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
