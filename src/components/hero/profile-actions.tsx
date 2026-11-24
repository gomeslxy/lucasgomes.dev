"use client";

import { ArrowDownRight, Check, Copy, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/data";
import { useScrollTo } from "@/lib/use-scroll-to";
import styles from "./hero.module.css";

export function ProfileActions() {
  const scrollTo = useScrollTo();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function copyEmail() {
    if (timer.current) clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyState("copied");
      timer.current = setTimeout(() => setCopyState("idle"), 3200);
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <footer className={styles.cardFooter} data-profile-layer="actions">
      <div className={styles.actions}>
        <a href="#work" className={styles.primaryAction} onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          scrollTo("#work");
        }}><span>Ver projetos</span><ArrowDownRight size={17} aria-hidden="true" /></a>
        <button type="button" onClick={copyEmail} className={styles.copyAction}>
          {copyState === "copied" ? <Check size={15} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          <span>{copyState === "copied" ? "E-mail copiado!" : "Copiar contato"}</span>
        </button>
      </div>
      <p className={styles.availability}><span />Aberto a boas conexões</p>
      <div className={styles.copyFeedback} role="status" aria-live="polite" aria-atomic="true">
        {copyState === "copied" && <span className="sr-only">E-mail {profile.email} copiado para a área de transferência.</span>}
        {copyState === "failed" && <a href={`mailto:${profile.email}`}><Mail size={13} aria-hidden="true" />Copiar indisponível. Enviar e-mail ↗</a>}
      </div>
    </footer>
  );
}
