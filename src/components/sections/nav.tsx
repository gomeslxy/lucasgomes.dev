"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useIntro } from "@/components/providers/experience-provider";
import { Magnetic } from "@/components/ui/magnetic";
import { RollText } from "@/components/ui/roll-text";
import { chapters, profile } from "@/lib/data";
import { EASE_EXPO, EASE_QUART, useLocalTime } from "@/lib/utils";

const NAV_LINKS = chapters.filter((c) => c.id !== "hero" && c.id !== "contato");

export function Nav() {
  const lenis = useLenis();
  const { ready } = useIntro();
  const time = useLocalTime();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const navTimerRef = useRef<number | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 240);
  });

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else if (ready) lenis.start();
  }, [open, lenis, ready]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (navTimerRef.current) window.clearTimeout(navTimerRef.current);
    };
  }, []);

  const go = (id: string) => {
    setOpen(false);
    if (navTimerRef.current) window.clearTimeout(navTimerRef.current);
    navTimerRef.current = window.setTimeout(
      () => lenis?.scrollTo(`#${id}`, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) }),
      open ? 400 : 0,
    );
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[65] text-bone mix-blend-difference pointer-events-none"
        style={{ willChange: "transform" }}
        initial={{ y: "-110%" }}
        animate={{ y: ready && !hidden ? "0%" : "-110%" }}
        transition={{ duration: 0.8, ease: EASE_EXPO, delay: ready && !hidden ? 0.1 : 0 }}
      >
        <nav
          aria-label="Principal"
          className="gutter grid grid-cols-[1fr_auto] items-center gap-6 py-4 lg:grid-cols-[1fr_auto_1fr] pointer-events-auto"
        >
          {/* Logo Monogram - Clean, uncluttered */}
          <button
            id="nav-logo"
            type="button"
            onClick={() => go("hero")}
            className="group flex min-h-[44px] items-center gap-1.5 justify-self-start outline-none focus-visible:ring-2 focus-visible:ring-crimson rounded-sm"
            aria-label="Voltar ao início"
          >
            <span className="display text-[1.65rem] leading-none tracking-[-0.02em]">
              Gomes<sup className="ml-0.5 align-super font-mono text-[0.55rem] tracking-normal text-crimson">®</sup>
            </span>
          </button>

          {/* Desktop Nav Links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  id={`nav-link-${link.id}`}
                  type="button"
                  onClick={() => go(link.id)}
                  className="group flex min-h-[44px] items-center gap-1.5 outline-none focus-visible:ring-1 focus-visible:ring-crimson px-1 rounded-sm"
                >
                  <span className="font-mono text-[0.55rem] text-bone/50">[{link.index}]</span>
                  <span className="label text-[0.68rem]">
                    <RollText text={link.label} />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {/* Actions & Live Clock */}
          <div className="flex items-center justify-self-end gap-5">
            <span
              suppressHydrationWarning
              className="label hidden tabular-nums text-bone/60 md:block text-[0.62rem]"
            >
              IDT {time} BRT
            </span>
            <Magnetic strength={0.3} className="hidden sm:inline-flex">
              <button
                id="nav-contact"
                type="button"
                onClick={() => go("contato")}
                className="group flex min-h-[44px] items-center gap-2 rounded-full border border-bone/40 px-5 outline-none focus-visible:ring-2 focus-visible:ring-crimson"
              >
                <span className="label text-[0.65rem]">
                  <RollText text="Contato" />
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-expo group-hover:rotate-45" />
              </button>
            </Magnetic>
            <button
              id="nav-menu-open"
              type="button"
              onClick={() => setOpen(true)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-bone/40 lg:hidden outline-none focus-visible:ring-2 focus-visible:ring-crimson"
              aria-label="Abrir menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Fullscreen Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de Navegação"
            className="fixed inset-0 z-[75] flex flex-col bg-crimson text-ink"
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: EASE_QUART }}
          >
            <div className="gutter flex items-center justify-between py-4">
              <span className="display text-[1.65rem] leading-none">Gomes®</span>
              <button
                id="nav-menu-close"
                type="button"
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-ink/40 outline-none focus-visible:ring-2 focus-visible:ring-ink"
                aria-label="Fechar menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="gutter mt-6 flex flex-1 flex-col justify-center gap-1">
              {[...NAV_LINKS, chapters[chapters.length - 1]!].map((link, i) => (
                <li key={link.id} className="overflow-hidden border-b border-ink/20">
                  <motion.button
                    id={`mobile-link-${link.id}`}
                    type="button"
                    onClick={() => go(link.id)}
                    className="flex min-h-[56px] w-full items-baseline justify-between py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ink"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.8, ease: EASE_EXPO, delay: 0.2 + i * 0.05 }}
                  >
                    <span className="display text-[clamp(2.8rem,14vw,5.5rem)]">{link.label}</span>
                    <span className="label text-sm">[{link.index}]</span>
                  </motion.button>
                </li>
              ))}
            </ul>

            <motion.div
              className="gutter grid grid-cols-2 gap-4 py-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE_EXPO, delay: 0.5 }}
            >
              <a
                id="mobile-email"
                href={`mailto:${profile.email}`}
                className="label flex min-h-[44px] items-center break-all text-[0.68rem]"
              >
                {profile.email}
              </a>
              <span
                suppressHydrationWarning
                className="label flex min-h-[44px] items-center justify-end tabular-nums text-[0.68rem]"
              >
                IDT {time}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
