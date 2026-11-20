"use client";

import { cancelFrame, frame } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { experienceConfig } from "@/lib/experience-config";
import { INTRO_SESSION_KEY } from "@/lib/intro-bootstrap";
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

const timings = experienceConfig.intro;

export function ExperienceIntro({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("loading");
  const [locked, setLocked] = useState(false);
  const [statusMessage, setStatusMessage] = useState("[01/04] PREPARANDO INTERFACE & RECURSOS");
  const [diagnostics, setDiagnostics] = useState({
    dom: false,
    fonts: false,
    assets: false,
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const finishRef = useRef<(reason: string) => void>(() => {});

  useScrollLock(locked);

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
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const timers = new Set<number>();
    const lifecycle = new AbortController();
    let stopProgress = () => {};
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
      stopProgress();
    };

    const remember = () => {
      try {
        sessionStorage.setItem(INTRO_SESSION_KEY, "seen");
      } catch {
        /* storage may be disabled */
      }
    };

    const restoreDom = (): boolean => {
      if (!owned) return false;
      owned = false;
      if (content) {
        if (previousInert === null) content.removeAttribute("inert");
        else content.setAttribute("inert", previousInert);
      }
      return true;
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
      const wasOwned = restoreDom();
      root.dataset.introPhase = "ready";
      root.dataset.introResult = reason;
      clearTimers();
      if (bootstrap?.timer) clearTimeout(bootstrap.timer);
      if (bootstrap) bootstrap.recover = undefined;
      remember();
      setLocked(false);
      setPhase("ready");
      if (wasOwned) restoreFocus();
      document.dispatchEvent(new CustomEvent("portfolio:intro-ready", { bubbles: true, detail: { reason } }));
    };

    const reveal = (reason: string) => {
      if (disposed || finished || livePhase !== "loading") return;
      livePhase = "revealing";
      root.dataset.introPhase = "revealing";
      setPhase("revealing");
      stopProgress();
      schedule(() => finish(reason), exitMs);
    };

    finishRef.current = finish;

    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_SESSION_KEY) === "seen";
    } catch {
      /* ignore */
    }

    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const isReload = navigation?.type === "reload";
    const shouldSkip =
      bootstrap?.skip ||
      reduced.matches ||
      !!location.hash ||
      document.hidden ||
      (seen && !isReload) ||
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

    const onKeyDown = (e: KeyboardEvent) => {
      if (finished) return;
      if (e.key === "Escape") {
        e.preventDefault();
        finish("skipped");
      }
    };
    const onVisibility = () => { if (document.hidden) finish("backgrounded"); };
    const onMotionPreference = () => { if (reduced.matches) finish("reduced-motion"); };
    window.addEventListener("keydown", onKeyDown, { capture: true, signal: lifecycle.signal });
    document.addEventListener("visibilitychange", onVisibility, { signal: lifecycle.signal });
    reduced.addEventListener("change", onMotionPreference, { signal: lifecycle.signal });
    skipRef.current?.focus({ preventScroll: true });

    let currentVal = 0;
    let targetVal = 24;
    let allReady = false;
    let hasCompletedHold = false;
    let lastInteger = -1;
    let lastSegment = -1;
    const digitStacks = counterRef.current?.querySelectorAll<HTMLElement>("[data-intro-digit]");
    const segments = railRef.current?.querySelectorAll<HTMLElement>("[data-intro-segment]");

    // Digit glyphs are static. Only their containing stacks and rails move;
    // progress never renders the React tree or rewrites numeric text per frame.
    const writeProgress = (value: number) => {
      const bounded = Math.max(0, Math.min(100, value));
      if (barRef.current) barRef.current.style.transform = `scaleX(${bounded / 100})`;
      if (headRef.current) headRef.current.style.transform = `translate3d(${bounded}%, 0, 0)`;
      const integer = Math.round(bounded);
      if (integer !== lastInteger) {
        lastInteger = integer;
        progressRef.current?.setAttribute("aria-valuenow", String(integer));
        const digits = String(integer).padStart(3, "0");
        digitStacks?.forEach((stack, index) => { stack.style.transform = `translate3d(0, -${Number(digits[index]) * 10}%, 0)`; });
      }
      const segment = Math.floor(bounded / 5);
      if (segment !== lastSegment) {
        lastSegment = segment;
        segments?.forEach((cell, index) => { cell.dataset.active = String(index < segment); });
      }
    };

    const tick = ({ delta: deltaMs }: { delta: number }) => {
      if (disposed || finished) return;

      const timeProgress = Math.min(1, elapsed() / Math.max(1, minimumMs));
      const timePacedCeiling = allReady
        ? Math.round(timeProgress * 100)
        : Math.min(88, Math.round(Math.pow(timeProgress, 0.75) * 94));

      const effectiveTarget = allReady && timeProgress >= 0.96
        ? 100
        : Math.min(targetVal, Math.max(targetVal * 0.65, timePacedCeiling));

      if (currentVal < effectiveTarget) {
        const delta = effectiveTarget - currentVal;
        currentVal += Math.max(Math.min(64, deltaMs) * 0.015, delta * (1 - Math.exp(-Math.min(64, deltaMs) / 90)));
        if (Math.abs(effectiveTarget - currentVal) < 0.6) currentVal = effectiveTarget;
        writeProgress(currentVal);
      }

      if (allReady && elapsed() >= minimumMs && currentVal >= 99 && !hasCompletedHold) {
        hasCompletedHold = true;
        currentVal = 100;
        writeProgress(100);
        setStatusMessage("[PRONTO] ABRINDO PORTFÓLIO");
        schedule(() => {
          if (!disposed && !finished) {
            reveal("resources-ready");
          }
        }, 160);
      }
    };
    stopProgress = () => cancelFrame(tick);
    frame.update(tick, true);

    const domReady =
      document.readyState !== "loading"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            const onDom = () => {
              document.removeEventListener("DOMContentLoaded", onDom);
              resolve();
            };
            document.addEventListener("DOMContentLoaded", onDom, { once: true, signal: lifecycle.signal });
          });

    const stepDom = domReady.then(() => {
      if (!disposed && !finished) {
        setDiagnostics((d) => ({ ...d, dom: true }));
        targetVal = Math.max(targetVal, 52);
        setStatusMessage("[02/04] CARREGANDO TIPOGRAFIA");
      }
    });

    const stepFonts = document.fonts?.ready
      ? document.fonts.ready.then(() => {
          if (!disposed && !finished) {
            setDiagnostics((d) => ({ ...d, fonts: true }));
            targetVal = Math.max(targetVal, 78);
            setStatusMessage("[03/04] CARREGANDO IMAGENS");
          }
        })
      : Promise.resolve();

    const preloadHeroAssets = async () => {
      const images = Array.from(content?.querySelectorAll<HTMLImageElement>("#hero img") ?? []);
      await Promise.allSettled(
        images.map((img) => {
          return new Promise<void>((res) => {
            if (img.decode) {
              img.decode().then(() => res(), () => res());
            } else if (img.complete) {
              res();
            } else {
              img.addEventListener("load", () => res(), { once: true, signal: lifecycle.signal });
              img.addEventListener("error", () => res(), { once: true, signal: lifecycle.signal });
            }
          });
        }),
      );
      if (!disposed && !finished) {
        setDiagnostics((d) => ({ ...d, assets: true }));
        targetVal = 100;
        setStatusMessage("[04/04] FINALIZANDO INTERFACE");
      }
    };

    const stepAssets = preloadHeroAssets();

    Promise.allSettled([stepDom, stepFonts, stepAssets]).then(() => {
      targetVal = 100;
      allReady = true;
    });

    schedule(() => {
      if (!disposed && !finished) {
        targetVal = 100;
        writeProgress(100);
        reveal("time-budget");
      }
    }, maximumMs - elapsed());

    schedule(() => {
      finish("safety-release");
    }, maximumMs + exitMs + 240 - elapsed());

    return () => {
      disposed = true;
      clearTimers();
      lifecycle.abort();
      if (bootstrap?.timer) clearTimeout(bootstrap.timer);
      if (bootstrap) bootstrap.recover = undefined;
      const wasOwned = restoreDom();
      root.dataset.introPhase = "ready";
      if (wasOwned) restoreFocus();
      finishRef.current = () => {};
    };
  }, []);

  return (
    <>
      {phase !== "ready" && (
        <div
          className={styles.intro}
          data-experience-intro
          data-phase={phase}
          role="dialog"
          aria-modal="true"
          aria-label="Carregando portfólio de Lucas"
        >
          {/* Architectural Split Shutters */}
          <div className={styles.shutterTop} aria-hidden="true" />
          <div className={styles.shutterBottom} aria-hidden="true" />
          <div className={styles.seamGlow} aria-hidden="true" />

          {/* Background Technical Grid and Ambient Core */}
          <div className={styles.backdrop} aria-hidden="true">
            <div className={styles.gridLines} />
            <div className={styles.ambientCore} />
            <div className={styles.scanline} />
          </div>

          {/* 4 Precision Corner HUD Reticles */}
          <div className={styles.hudCornerTL} aria-hidden="true">
            <span className={styles.crosshair}>+</span>
            <div className={styles.cornerMeta}>
              <span>[00 // INIT]</span>
              <span>LOC: SP / BR · 23°S 47°W</span>
            </div>
          </div>

          <div className={styles.hudCornerTR} aria-hidden="true">
            <div className={styles.cornerMeta}>
              <span>[INTERFACE // EM PREPARAÇÃO]</span>
              <span>DEV // FULL-STACK & IA</span>
            </div>
            <span className={styles.crosshair}>+</span>
          </div>

          <div className={styles.hudCornerBL} aria-hidden="true">
            <span className={styles.crosshair}>+</span>
            <div className={styles.cornerMeta}>
              <span>LUCAS</span>
              <span>FULL-STACK & IA · 2026</span>
            </div>
          </div>

          <div className={styles.hudCornerBR}>
            <button
              ref={skipRef}
              type="button"
              onClick={() => finishRef.current("skipped")}
              className={styles.skipBtn}
              aria-label="Pular tela de abertura e entrar direto no portfólio"
            >
              <span>PULAR INTRO</span>
              <span className={styles.skipKey} aria-hidden="true">ESC ↗</span>
            </button>
            <span className={styles.crosshair} aria-hidden="true">+</span>
          </div>

          {/* Center Stage Presentation */}
          <div className={styles.wrapper}>
            {/* Top Micro-Capsule */}
            <div className={styles.systemCapsule}>
              <span className={styles.pulseDot} aria-hidden="true" />
              <span>PORTFÓLIO · LUCAS</span>
            </div>

            {/* Monumental Counter */}
            <div className={styles.counterRow}>
              <div ref={progressRef} className={styles.counterWrap} role="progressbar" aria-label="Preparação do portfólio" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
                <span ref={counterRef} className={styles.counter} aria-hidden="true">
                  {[0, 1, 2].map((position) => <span key={position} className={styles.digitWindow}><span className={styles.digitStack} data-intro-digit>{Array.from({ length: 10 }, (_, digit) => <span key={digit}>{digit}</span>)}</span></span>)}
                </span>
                <span className={styles.percent} aria-hidden="true">%</span>
              </div>
            </div>

            {/* Kinetic Equalizer + Status Readout */}
            <div className={styles.statusRow}>
              <div className={styles.equalizer} aria-hidden="true">
                <span style={{ "--eq-delay": "0ms" } as CSSProperties} />
                <span style={{ "--eq-delay": "120ms" } as CSSProperties} />
                <span style={{ "--eq-delay": "240ms" } as CSSProperties} />
                <span style={{ "--eq-delay": "70ms" } as CSSProperties} />
                <span style={{ "--eq-delay": "190ms" } as CSSProperties} />
                <span style={{ "--eq-delay": "310ms" } as CSSProperties} />
              </div>
              <p className={styles.statusMessage} role="status">
                {statusMessage}
              </p>
            </div>

            {/* Dual Rail: 20 Segmented Metric Blocks + Continuous Laser Hairline */}
            <div className={styles.progressContainer} aria-hidden="true">
              <div ref={railRef} className={styles.segmentRail}>
                {Array.from({ length: 20 }).map((_, idx) => (
                  <span
                    key={idx}
                    className={styles.segmentCell}
                    data-intro-segment
                    data-active="false"
                  ><span /></span>
                ))}
              </div>
              <div className={styles.laserTrack}>
                <div
                  ref={barRef}
                  className={styles.laserBar}
                  style={{ transform: "scaleX(0)" }}
                />
                <div
                  ref={headRef}
                  className={styles.laserHead}
                />
              </div>
            </div>

            {/* Sub-Diagnostics Badges */}
            <ul className={styles.diagnostics} aria-label="Status de preparação de módulos">
              <li className={styles.diagnosticItem} data-ready={diagnostics.dom}>
                <span className={styles.diagnosticDot} aria-hidden="true" />
                <span>PÁGINA {diagnostics.dom ? "DISPONÍVEL" : "CARREGANDO"}</span>
              </li>
              <li className={styles.diagnosticItem} data-ready={diagnostics.fonts}>
                <span className={styles.diagnosticDot} aria-hidden="true" />
                <span>TIPOGRAFIA {diagnostics.fonts ? "SINCRONIZADA" : "SINCRONIZANDO"}</span>
              </li>
              <li className={styles.diagnosticItem} data-ready={diagnostics.assets}>
                <span className={styles.diagnosticDot} aria-hidden="true" />
                <span>IMAGENS {diagnostics.assets ? "PRONTAS" : "CARREGANDO"}</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Main Experience Content with Cinematic 3D Entrance */}
      <div
        ref={contentRef}
        className={styles.content}
        data-experience-content
        data-intro-phase={phase}
      >
        {children}
      </div>
    </>
  );
}
