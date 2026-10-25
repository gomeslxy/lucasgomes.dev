"use client";

import { useLenis } from "lenis/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { experienceConfig } from "@/lib/experience-config";
import { useScrollLock } from "@/lib/use-scroll-lock";
import styles from "./experience-intro.module.css";

export type IntroPhase = "loading" | "revealing" | "ready";

declare global {
  interface Window {
    __portfolioIntroBootstrap?: {
      startedAt: number;
      skip: boolean;
      timer: number;
      recover?: () => void;
    };
  }
}

const SESSION_KEY = "lucas:portfolio-intro:v2";
const timings = experienceConfig.intro;

/**
 * Runs inline in <head> before hydration.
 * If reduced motion is requested, or if already visited in this session,
 * sets dataset.introPhase to 'ready' instantly (0ms delay, zero flash).
 */
const BOOTSTRAP = `(function(){try{var r=document.documentElement,c=${JSON.stringify(timings)},m=matchMedia('(max-width: 767px), (pointer: coarse)').matches,n=performance.getEntriesByType('navigation')[0],seen=false;try{seen=sessionStorage.getItem('${SESSION_KEY}')==='seen'}catch(e){}var skip=matchMedia('(prefers-reduced-motion: reduce)').matches||!!location.hash||document.hidden||seen||(n&&n.type==='back_forward');r.dataset.introPhase=skip?'ready':'loading';r.style.setProperty('--intro-exit-ms',(m?c.mobileExitMs:c.exitMs)+'ms');r.style.setProperty('--intro-max-ms',(m?c.mobileMaximumMs:c.maximumMs)+'ms');var state={startedAt:performance.now(),skip:!!skip,timer:0};window.__portfolioIntroBootstrap=state;if(!skip)state.timer=setTimeout(function(){try{if(state.recover)state.recover()}finally{r.dataset.introPhase='ready'}},(m?c.mobileMaximumMs:c.maximumMs)+(m?c.mobileExitMs:c.exitMs)+200)}catch(e){document.documentElement.dataset.introPhase='ready'}})();`;

export function ExperienceIntro({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("loading");
  const [locked, setLocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("[01/03] INICIALIZANDO NÚCLEO DO SISTEMA");
  const [diagnostics, setDiagnostics] = useState({
    dom: false,
    fonts: false,
    assets: false,
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const finishRef = useRef<(reason: string) => void>(() => {});
  const lenis = useLenis();
  const lenisRef = useRef(lenis);

  useScrollLock(locked);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    const root = document.documentElement;
    const content = contentRef.current;
    const bootstrap = window.__portfolioIntroBootstrap;
    const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const minimumMs = Math.max(0, timings.minimumMs);
    const maximumMs = Math.max(minimumMs, mobile ? timings.mobileMaximumMs : timings.maximumMs);
    const exitMs = Math.max(0, mobile ? timings.mobileExitMs : timings.exitMs);
    const startedAt = bootstrap?.startedAt ?? performance.now();
    const elapsed = () => Math.max(0, performance.now() - startedAt);

    const previousInert = content?.getAttribute("inert") ?? null;
    const previousOverflow = root.style.getPropertyValue("overflow");
    const previousOverflowPriority = root.style.getPropertyPriority("overflow");
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const timers = new Set<number>();
    let animationFrameId: number | null = null;
    let disposed = false;
    let finished = false;
    let livePhase: IntroPhase = "loading";
    let owned = false;

    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        callback();
      }, Math.max(0, delay));
      timers.add(timer);
      return timer;
    };

    const clearTimers = () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    };

    const remember = () => {
      try {
        sessionStorage.setItem(SESSION_KEY, "seen");
      } catch {
        /* storage may be disabled */
      }
    };

    const restoreDom = () => {
      if (!owned) return;
      owned = false;
      if (content) {
        if (previousInert === null) content.removeAttribute("inert");
        else content.setAttribute("inert", previousInert);
      }
      if (previousOverflow) root.style.setProperty("overflow", previousOverflow, previousOverflowPriority);
      else root.style.removeProperty("overflow");
      lenisRef.current?.start();
    };

    const restoreFocus = () => {
      const target =
        previousFocus && previousFocus !== document.body && previousFocus.isConnected
          ? previousFocus
          : document.getElementById("main-content");
      target?.focus({ preventScroll: true });
    };

    const finish = (reason: string) => {
      if (disposed || finished) return;
      finished = true;
      livePhase = "ready";
      restoreDom();
      root.dataset.introPhase = "ready";
      root.dataset.introResult = reason;
      clearTimers();
      if (bootstrap?.timer) clearTimeout(bootstrap.timer);
      if (bootstrap) bootstrap.recover = undefined;
      remember();
      setLocked(false);
      setPhase("ready");
      restoreFocus();
      document.dispatchEvent(new CustomEvent("portfolio:intro-ready", { bubbles: true, detail: { reason } }));
    };

    const reveal = (reason: string) => {
      if (disposed || finished || livePhase !== "loading") return;
      livePhase = "revealing";
      root.dataset.introPhase = "revealing";
      setPhase("revealing");
      schedule(() => finish(reason), exitMs);
    };

    finishRef.current = finish;

    // Check if we should skip intro entirely
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "seen";
    } catch {
      /* ignore */
    }

    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const shouldSkip =
      bootstrap?.skip ||
      reduced.matches ||
      !!location.hash ||
      document.hidden ||
      seen ||
      navigation?.type === "back_forward";

    if (shouldSkip) {
      finish("bypassed");
      return () => {
        disposed = true;
        clearTimers();
      };
    }

    root.style.setProperty("--intro-exit-ms", `${exitMs}ms`);
    root.style.setProperty("--intro-max-ms", `${maximumMs}ms`);
    root.dataset.introPhase = "loading";
    if (content) content.inert = true;
    owned = true;
    setLocked(true);
    if (bootstrap) bootstrap.recover = () => finish("safety-release");

    // Keyboard and accessibility listeners
    const onKeyDown = (e: KeyboardEvent) => {
      if (finished) return;
      if (e.key === "Escape") {
        e.preventDefault();
        finish("skipped");
      }
    };
    window.addEventListener("keydown", onKeyDown, true);

    // Smooth ticker progress simulation synced with real loading milestones
    let currentVal = 0;
    let targetVal = 20;

    const tick = () => {
      if (disposed || finished) return;
      if (currentVal < targetVal) {
        currentVal += Math.max(1, (targetVal - currentVal) * 0.16);
        if (Math.abs(targetVal - currentVal) < 0.8) currentVal = targetVal;
        setProgress(Math.round(currentVal));
      }
      animationFrameId = requestAnimationFrame(tick);
    };
    animationFrameId = requestAnimationFrame(tick);

    // 1. DOM Ready check
    const domReady =
      document.readyState !== "loading"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            const onDom = () => {
              document.removeEventListener("DOMContentLoaded", onDom);
              resolve();
            };
            document.addEventListener("DOMContentLoaded", onDom, { once: true });
          });

    const stepDom = domReady.then(() => {
      if (!disposed && !finished) {
        setDiagnostics((d) => ({ ...d, dom: true }));
        targetVal = Math.max(targetVal, 48);
        setStatusMessage("[02/03] CARREGANDO TIPOGRAFIA & ATIVOS");
      }
    });

    // 2. Font Loading check
    const stepFonts = document.fonts?.ready
      ? document.fonts.ready.then(() => {
          if (!disposed && !finished) {
            setDiagnostics((d) => ({ ...d, fonts: true }));
            targetVal = Math.max(targetVal, 75);
          }
        })
      : Promise.resolve();

    // 3. Proactive Asset Preloading & GPU Decoding (Crucial for Optimization)
    // Preloads the above-the-fold critical Hero profile assets so there is zero render delay or image pop.
    const preloadHeroAssets = async () => {
      const urls = ["/profile/avatar.webp", "/profile/banner.webp"];
      await Promise.allSettled(
        urls.map((url) => {
          return new Promise<void>((res) => {
            const img = new window.Image();
            img.src = url;
            if (img.decode) {
              img.decode().then(() => res(), () => res());
            } else {
              img.onload = img.onerror = () => res();
            }
          });
        }),
      );
      if (!disposed && !finished) {
        setDiagnostics((d) => ({ ...d, assets: true }));
        targetVal = 100;
        setStatusMessage("[03/03] AMBIENTE PRONTO // INICIALIZANDO");
      }
    };

    const stepAssets = preloadHeroAssets();

    // Coordinate readiness
    Promise.allSettled([stepDom, stepFonts, stepAssets]).then(() => {
      targetVal = 100;
      const waitTime = Math.max(0, minimumMs - elapsed());
      schedule(() => {
        if (!disposed && !finished) {
          reveal("resources-ready");
        }
      }, waitTime);
    });

    // Safety timeout: Maximum allowed intro duration
    schedule(() => {
      if (!disposed && !finished) {
        targetVal = 100;
        reveal("time-budget");
      }
    }, maximumMs - elapsed());

    // Absolute fallback
    schedule(() => {
      finish("safety-release");
    }, maximumMs + exitMs + 180 - elapsed());

    return () => {
      disposed = true;
      clearTimers();
      window.removeEventListener("keydown", onKeyDown, true);
      restoreDom();
      root.dataset.introPhase = "ready";
      restoreFocus();
      finishRef.current = () => {};
    };
  }, []);

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP }} />
      {phase !== "ready" && (
        <div className={styles.intro} data-experience-intro data-phase={phase} role="dialog" aria-modal="true" aria-label="Carregando portfólio de Lucas Gomes">
          <div className={styles.curtain} aria-hidden="true" />
          <div className={styles.wrapper}>
            {/* Top Bar */}
            <header className={styles.top}>
              <div className={styles.topBadge}>
                <span className={styles.pulseDot} aria-hidden="true" />
                <span>LUCAS GOMES // CREATIVE DEVELOPER</span>
              </div>
              <div>SP / BR · 23°05′S 47°13′W</div>
            </header>

            {/* Central Stage: Monumental Counter & Status */}
            <main className={styles.center}>
              <div className={styles.preTitle}>
                <span>[00]</span>
                <span>INICIALIZAÇÃO DO SISTEMA</span>
              </div>

              <div className={styles.counterWrap} aria-live="polite">
                <span className={styles.counter}>{String(progress).padStart(3, "0")}</span>
                <span className={styles.percent} aria-hidden="true">%</span>
              </div>

              <p className={styles.statusMessage} role="status">
                {statusMessage}
              </p>

              {/* Hairline Progress Track */}
              <div className={styles.progressTrack} aria-hidden="true">
                <div
                  className={styles.progressBar}
                  style={{ transform: `scaleX(${progress / 100})` }}
                />
              </div>
            </main>

            {/* Bottom Bar: Diagnostics & Skip Action */}
            <footer className={styles.bottom}>
              <ul className={styles.diagnostics} aria-label="Status de preparação de recursos">
                <li className={styles.diagnosticItem} data-ready={diagnostics.dom}>
                  <span className={styles.diagnosticDot} aria-hidden="true" />
                  <span>DOM {diagnostics.dom ? "PRONTO" : "CARREGANDO"}</span>
                </li>
                <li className={styles.diagnosticItem} data-ready={diagnostics.fonts}>
                  <span className={styles.diagnosticDot} aria-hidden="true" />
                  <span>FONTES {diagnostics.fonts ? "SINCRONIZADAS" : "CARREGANDO"}</span>
                </li>
                <li className={styles.diagnosticItem} data-ready={diagnostics.assets}>
                  <span className={styles.diagnosticDot} aria-hidden="true" />
                  <span>ATIVOS CRÍTICOS {diagnostics.assets ? "DECODIFICADOS" : "OTIMIZANDO"}</span>
                </li>
              </ul>

              <button
                ref={skipRef}
                type="button"
                onClick={() => finishRef.current("skipped")}
                className={styles.skipBtn}
                aria-label="Pular tela de abertura e entrar direto no portfólio"
              >
                <span>Pular intro</span>
                <span className={styles.skipKey} aria-hidden="true">ESC ↗</span>
              </button>
            </footer>
          </div>
        </div>
      )}
      <div ref={contentRef} className={styles.content} data-experience-content data-intro-phase={phase}>
        {children}
      </div>
    </>
  );
}
