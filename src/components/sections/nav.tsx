"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/ui/magnetic";
import { useScrollLock } from "@/lib/use-scroll-lock";
import { useScrollTo } from "@/lib/use-scroll-to";
import { chapters, profile } from "@/lib/data";
import { cn } from "@/lib/utils";

const NAV_LINKS = chapters.filter((c) => c.id !== "hero" && c.id !== "contato");

export function Nav() {
  const scrollTo = useScrollTo();
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Lock scroll and Lenis when mobile drawer is open
  useScrollLock(open);

  // Active section spy with efficient IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
    );

    chapters.forEach((chapter) => {
      const el = document.getElementById(chapter.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Trap focus & escape key handling for mobile drawer
  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Disable every sibling branch without making the dialog's ancestors inert.
    const previousInert = new Map<HTMLElement, boolean>();
    let branch: HTMLElement = dialog;
    while (branch.parentElement) {
      const parent = branch.parentElement;
      for (const sibling of parent.children) {
        if (sibling === branch || !(sibling instanceof HTMLElement) || /^(SCRIPT|STYLE|LINK)$/.test(sibling.tagName)) continue;
        previousInert.set(sibling, sibling.inert);
        sibling.inert = true;
      }
      if (parent === document.body) break;
      branch = parent;
    }
    dialog.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialog?.querySelectorAll<HTMLElement>("button, a[href]");
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first)?.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previousInert.forEach((value, element) => { element.inert = value; });
      const trigger = triggerRef.current;
      const target = trigger?.getClientRects().length ? trigger : document.getElementById("nav-logo");
      target?.focus({ preventScroll: true });
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollTo("#" + id);
  };

  return (
    <>
      <header
        data-nav-header
        className="fixed inset-x-0 top-0 z-[65] px-4 pt-3 pointer-events-none sm:px-6"
      >
        <nav
          aria-label="Navegação Principal"
          className="mx-auto flex max-w-[1600px] items-center justify-between rounded-full border border-white/10 bg-[#0c0b0cf5] px-5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-auto"
        >
          {/* Logo / Brand Name */}
          <Magnetic strength={0.15}>
            <button
              id="nav-logo"
              type="button"
              onClick={() => go("hero")}
              className="press group flex min-h-[44px] items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-crimson rounded-full px-2"
              aria-label="Voltar ao início"
            >
              <span className="font-sans font-bold tracking-tight text-bone text-base sm:text-lg flex items-center gap-2">
                Lucas
                <span className="h-2 w-2 rounded-full bg-crimson" />
              </span>
            </button>
          </Magnetic>

          {/* Desktop Navigation Links */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.id}>
                  <button
                    id={`nav-link-${link.id}`}
                    type="button"
                    onClick={() => go(link.id)}
                    className={cn(
                      "press relative flex min-h-[44px] items-center rounded-full px-4 font-mono text-[0.68rem] font-semibold tracking-widest uppercase outline-none focus-visible:ring-2 focus-visible:ring-crimson",
                      isActive ? "text-bone" : "text-ash hover:text-bone"
                    )}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-crimson" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Header Action / Contact Button */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:inline-flex">
              <Magnetic strength={0.2}>
                <button
                  id="nav-contact"
                  type="button"
                  onClick={() => go("contato")}
                  className="press group relative flex min-h-[44px] items-center gap-2 rounded-full border border-crimson/40 bg-crimson/10 px-5 font-mono text-[0.65rem] font-semibold tracking-widest text-bone uppercase outline-none hover:bg-crimson hover:text-white focus-visible:ring-2 focus-visible:ring-crimson transition-transform duration-300"
                >
                  <span>Contato</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-crimson group-hover:text-white transition-transform duration-300 group-hover:rotate-45" />
                </button>
              </Magnetic>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              id="nav-menu-open"
              ref={triggerRef}
              type="button"
              onClick={() => setOpen(true)}
              className="press flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-bone md:hidden outline-none hover:border-white/30 focus-visible:ring-2 focus-visible:ring-crimson"
              aria-label="Abrir menu principal"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </nav>
      </header>

      {/* Cinematic Fullscreen Mobile Navigation Drawer */}
      {open && (
        <motion.div
          ref={dialogRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de Navegação"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .35, ease: [.16, 1, .3, 1] }}
          className="fixed inset-0 z-[75] flex flex-col justify-between overflow-y-auto bg-ink text-bone"
        >
          {/* Mobile Header Bar */}
          <div className="gutter flex items-center justify-between py-5 border-b border-white/10">
            <span className="font-sans font-bold text-lg text-bone flex items-center gap-2">
              Lucas <span className="h-2 w-2 rounded-full bg-crimson" />
            </span>
            <button
              id="nav-menu-close"
              type="button"
              onClick={() => setOpen(false)}
              className="press flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/20 text-bone hover:border-crimson focus-visible:ring-2 focus-visible:ring-crimson"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav List */}
          <ul className="gutter my-auto flex flex-col justify-center py-8">
            {[chapters[0]!, ...NAV_LINKS, chapters[chapters.length - 1]!].map((link) => (
              <li key={link.id} className="border-b border-white/[0.08]">
                <button
                  id={`mobile-link-${link.id}`}
                  type="button"
                  onClick={() => go(link.id)}
                  className="press flex min-h-[64px] w-full items-baseline justify-between py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-crimson group"
                >
                  <span className="display text-[clamp(2.6rem,11vw,4.5rem)] text-bone group-hover:text-crimson">
                    {link.label}
                  </span>
                  <span className="font-mono text-xs text-ash">[{link.index}]</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Mobile Footer Status */}
          <div className="gutter flex flex-wrap items-center justify-between gap-3 py-6 border-t border-white/10 font-mono text-xs text-ash">
            <a
              id="mobile-email"
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-[44px] items-center break-all hover:text-bone"
            >
              {profile.email}
            </a>
            <span className="flex items-center gap-2 text-crimson font-semibold">
              <span className="h-2 w-2 rounded-full bg-crimson animate-pulse-dot" />
              Disponível
            </span>
          </div>
        </motion.div>
      )}
    </>
  );
}
