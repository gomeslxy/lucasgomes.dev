"use client";

import { ArrowUpRight, Check, Copy, Mail, MessageSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GlowSurface } from "@/components/ui/glow-surface";
import { Magnetic } from "@/components/ui/magnetic";
import { profile } from "@/lib/data";
import styles from "@/components/spatial/living-surface.module.css";

type ContactKind = "email" | "phone";

export function ContactCard() {
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
    <GlowSurface className="min-w-0 rounded-2xl border border-white/10 bg-[#101011] p-6 sm:p-8">
      <p className="font-mono text-[0.6875rem] uppercase tracking-widest text-ash">
        Canal Direto de Comunicação
      </p>

      <Magnetic strength={0.15} className="w-full">
        <a
          href={`mailto:${profile.email}`}
          className="press group mt-6 flex w-full min-h-[52px] items-center justify-between gap-3 rounded-xl bg-bone px-5 py-3.5 text-sm font-mono font-semibold uppercase tracking-wider text-ink outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-crimson"
        >
          <span className="flex items-center gap-3">
            <Mail aria-hidden="true" className="h-4 w-4 text-crimson" />
            <span>Enviar E-mail Direto</span>
          </span>
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
        </a>
      </Magnetic>

      <div className="mt-6 divide-y divide-white/10">
        <div className="flex min-w-0 items-center justify-between gap-3 py-3.5">
          <a
            href={`mailto:${profile.email}`}
            className="flex min-h-[44px] min-w-0 items-center break-all font-mono text-xs md:text-sm text-bone/90 hover:text-crimson"
          >
            {profile.email}
          </a>
          <button
            type="button"
            onClick={() => copyContact(profile.email, "email")}
            aria-label={copied === "email" ? "E-mail copiado" : "Copiar e-mail"}
            className="press flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 text-ash hover:border-crimson hover:text-bone motion-safe:active:scale-95 cursor-pointer"
          >
            {copied === "email" ? <Check aria-hidden="true" className="h-4 w-4 text-emerald-400" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex min-w-0 items-center justify-between gap-3 py-3.5">
          <a
            href={`tel:${profile.phoneE164}`}
            className="flex min-h-[44px] items-center font-mono text-xs md:text-sm text-bone/90 hover:text-crimson"
          >
            {profile.phoneDisplay}
          </a>
          <button
            type="button"
            onClick={() => copyContact(profile.phoneE164, "phone")}
            aria-label={copied === "phone" ? "Telefone copiado" : "Copiar telefone"}
            className="press flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 text-ash hover:border-crimson hover:text-bone motion-safe:active:scale-95 cursor-pointer"
          >
            {copied === "phone" ? <Check aria-hidden="true" className="h-4 w-4 text-emerald-400" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <a
        href={profile.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="press mt-4 flex min-h-[44px] items-center justify-between gap-3 rounded-lg border border-white/15 bg-white/[0.02] px-4 py-2.5 text-xs font-mono uppercase tracking-wider text-bone/85 hover:border-emerald-500/50 hover:text-emerald-400"
      >
        <span className="flex items-center gap-2">
          <MessageSquare className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
          <span>Conversar no WhatsApp</span>
        </span>
        <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
      </a>

      <p role="status" aria-live="polite" aria-atomic="true" data-error={copyFailed} className={styles.contactStatus}>{announcement}</p>
    </GlowSurface>
  );
}
