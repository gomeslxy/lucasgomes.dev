"use client";

import { useLenis } from "lenis/react";
import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { Magnetic } from "@/components/ui/magnetic";
import { RollText } from "@/components/ui/roll-text";
import { SectionLabel } from "@/components/ui/section-label";
import { profile } from "@/lib/data";
import { useFitText } from "@/lib/use-fit-text";

export function ContactFooter() {
  const lenis = useLenis();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const emailTimerRef = useRef<number | null>(null);
  const phoneTimerRef = useRef<number | null>(null);
  const { containerRef, textRef } = useFitText<HTMLDivElement, HTMLSpanElement>();

  useEffect(() => {
    return () => {
      if (emailTimerRef.current) window.clearTimeout(emailTimerRef.current);
      if (phoneTimerRef.current) window.clearTimeout(phoneTimerRef.current);
    };
  }, []);

  const copyToClipboard = async (text: string, type: "email" | "phone") => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      if (type === "email") {
        setCopiedEmail(true);
        if (emailTimerRef.current) window.clearTimeout(emailTimerRef.current);
        emailTimerRef.current = window.setTimeout(() => setCopiedEmail(false), 2200);
      } else {
        setCopiedPhone(true);
        if (phoneTimerRef.current) window.clearTimeout(phoneTimerRef.current);
        phoneTimerRef.current = window.setTimeout(() => setCopiedPhone(false), 2200);
      }
    } catch {
      // Fallback: window.prompt or direct selection
    }
  };

  const scrollToTop = () => {
    lenis?.scrollTo(0, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
  };

  return (
    <footer id="contato" className="relative bg-ink text-bone border-t border-white/10 pt-[clamp(6rem,11vw,9.5rem)] pb-8 overflow-hidden">
      <div className="gutter">
        <SectionLabel index="05" title="Contato & Propostas" aside="Pronto para novos desafios" tone="dark" />

        {/* Big CTA Heading & Direct Actions */}
        <div className="mt-14 md:mt-20 grid gap-10 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8">
            <h2 className="display text-[clamp(3.4rem,10.5vw,9.5rem)] leading-[0.82]">
              Vamos <br />
              <span className="font-serif italic text-crimson text-[0.85em] normal-case tracking-normal">construir</span> <br />
              o próximo.
            </h2>
            <p className="mt-8 text-base md:text-lg text-bone/70 leading-relaxed max-w-xl">
              Disponível para novos projetos, freelas e oportunidades em Tecnologia/Desenvolvimento — presencial em Indaiatuba/Campinas, modelo híbrido ou remoto global.
            </p>
          </div>

          {/* Quick Direct Actions Box */}
          <div className="lg:col-span-4 bg-coal border border-white/10 p-6 md:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-pulse-dot rounded-full bg-crimson" />
                <span className="relative h-2 w-2 rounded-full bg-crimson" />
              </span>
              <span className="label text-ash text-[0.62rem]">Status Atual: Disponível</span>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              {/* Email copy */}
              <div>
                <span className="label text-smoke block text-[0.6rem]">E-mail Principal</span>
                <div className="mt-1.5 flex items-center justify-between gap-3 bg-graphite border border-white/10 px-4 py-2.5">
                  <span className="text-xs md:text-sm font-mono text-bone truncate">{profile.email}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(profile.email, "email")}
                    className="label min-h-[44px] min-w-[44px] text-ash hover:text-crimson flex items-center gap-1.5 transition-colors shrink-0 outline-none focus-visible:ring-1 focus-visible:ring-crimson px-2"
                    title="Copiar e-mail"
                    aria-label="Copiar e-mail"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-crimson" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[0.62rem]">{copiedEmail ? "Copiado!" : "Copiar"}</span>
                  </button>
                </div>
              </div>

              {/* WhatsApp & Call */}
              <div>
                <span className="label text-smoke block text-[0.6rem]">WhatsApp / Telefone</span>
                <div className="mt-1.5 flex items-center justify-between gap-3 bg-graphite border border-white/10 px-4 py-2.5">
                  <span className="text-xs md:text-sm font-mono text-bone truncate">{profile.phoneDisplay}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("+5511989940080", "phone")}
                    className="label min-h-[44px] min-w-[44px] text-ash hover:text-crimson flex items-center gap-1.5 transition-colors shrink-0 outline-none focus-visible:ring-1 focus-visible:ring-crimson px-2"
                    title="Copiar telefone"
                    aria-label="Copiar telefone"
                  >
                    {copiedPhone ? <Check className="w-3.5 h-3.5 text-crimson" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[0.62rem]">{copiedPhone ? "Copiado!" : "Copiar"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp CTA Button */}
            <Magnetic strength={0.2} className="w-full">
              <a
                href={profile.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[48px] w-full items-center justify-center gap-3 rounded-full bg-crimson text-bone font-mono text-xs uppercase tracking-widest hover:bg-crimson-deep transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Falar no WhatsApp</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:rotate-45" />
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Social channels and metadata links */}
        <div className="mt-20 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="label text-smoke block text-[0.6rem]">GitHub</span>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2 min-h-[44px] inline-flex items-center gap-2 text-sm font-medium hover:text-crimson transition-colors"
            >
              <GithubIcon size={16} />
              <RollText text={profile.githubHandle} />
            </a>
          </div>

          <div>
            <span className="label text-smoke block text-[0.6rem]">LinkedIn</span>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2 min-h-[44px] inline-flex items-center gap-2 text-sm font-medium hover:text-crimson transition-colors"
            >
              <LinkedinIcon size={16} />
              <RollText text="Lucas Gomes" />
            </a>
          </div>

          <div>
            <span className="label text-smoke block text-[0.6rem]">SaaS em Produção</span>
            <a
              href={profile.agendra}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2 min-h-[44px] inline-flex items-center gap-2 text-sm font-medium text-crimson hover:underline"
            >
              <span>agendra.site</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div>
            <span className="label text-smoke block text-[0.6rem]">Localização</span>
            <span className="mt-2 block text-sm font-medium text-bone/80">
              {profile.city} · {profile.region}
            </span>
          </div>
        </div>

        {/* Giant Footer Display Typography with Fluid clamp() */}
        <div className="mt-24 md:mt-32 pt-8 border-t border-white/10">
          <div ref={containerRef} className="w-full overflow-hidden select-none">
            <span
              ref={textRef}
              className="display block whitespace-nowrap text-bone leading-[0.78] tracking-tighter text-[clamp(3.6rem,16.2vw,16.8rem)]"
            >
              LUCAS GOMES
            </span>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ash">
          <span className="label text-[0.6rem]">
            © 2026 Lucas Gomes do Amaral. Todos os direitos reservados.
          </span>

          <div className="flex items-center gap-6">
            <span className="label text-[0.6rem] text-smoke hidden md:block">
              Next.js 15 · React 19 · Motion · Lenis
            </span>
            <Magnetic strength={0.3}>
              <button
                type="button"
                onClick={scrollToTop}
                className="label min-h-[44px] text-[0.62rem] flex items-center gap-1.5 text-bone hover:text-crimson transition-colors outline-none focus-visible:ring-1 focus-visible:ring-crimson px-2 rounded-sm"
              >
                <span>Voltar ao Topo</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </footer>
  );
}
