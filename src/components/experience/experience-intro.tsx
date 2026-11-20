"use client";

import { cancelFrame, frame } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { experienceConfig } from "@/lib/experience-config";
import { INTRO_SESSION_KEY } from "@/lib/intro-bootstrap";
import { observePageReadiness } from "@/lib/readiness-signals";
import { useScrollLock } from "@/lib/use-scroll-lock";
import styles from "./experience-intro.module.css";

export type IntroPhase = "loading" | "revealing" | "ready";

type NetworkInformationLike = {
  saveData?: boolean;
};

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

  const introRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const periodRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const finishRef = useRef<(reason: string) => void>(() => {});

  useScrollLock(locked);

  useEffect(() => {
    const root = document.documentElement;
    const content = contentRef.current;
    const bootstrap = window.__portfolioIntroBootstrap;
    const mobile = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const minimumMs = Math.max(0, mobile ? timings.mobileMinimumMs : timings.minimumMs);
    const maximumMs = Math.max(minimumMs, mobile ? timings.mobileMaximumMs : timings.maximumMs);
    const exitMs = Math.max(0, mobile ? timings.mobileExitMs : timings.exitMs);
    const handoffDelayMs = Math.max(0, mobile ? timings.mobileHandoffDelayMs : timings.handoffDelayMs);
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
    let hasCompletedHold = false;

    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        callback();
      }, Math.max(0, delay));
      timers.add(timer);
      return timer;
    };

    const clearTimers = () => {
      timers.forEach((timer) => clearTimeout(timer));
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
      const introEl = introRef.current;
      const activeEl = document.activeElement;
      const focusInDialog = !!(introEl && activeEl && introEl.contains(activeEl));
      if (!focusInDialog && activeEl !== document.body && activeEl !== null) return;

      const target =
        previousFocus &&
        previousFocus !== document.body &&
        previousFocus.isConnected &&
        !(introEl && introEl.contains(previousFocus))
          ? previousFocus
          : document.getElementById("main-content");
      target?.focus({ preventScroll: true });
    };

    const finish = (reason: string) => {
      if (disposed || finished) return;
      finished = true;
      const exitedDirectly = livePhase === "loading";
      livePhase = "ready";
      const wasOwned = restoreDom();
      if (exitedDirectly) {
        root.style.setProperty("--intro-handoff-delay", "0ms");
        delete root.dataset.introHandoff;
      }
      root.dataset.introPhase = "ready";
      root.dataset.introResult = reason;
      clearTimers();
      if (bootstrap?.timer) clearTimeout(bootstrap.timer);
      if (bootstrap) bootstrap.recover = undefined;
      remember();
      setLocked(false);
      setPhase("ready");
      if (wasOwned) restoreFocus();
      document.dispatchEvent(
        new CustomEvent("portfolio:intro-ready", { bubbles: true, detail: { reason } }),
      );
    };

    const reveal = (reason: string) => {
      if (disposed || finished || livePhase !== "loading") return;
      livePhase = "revealing";
      hasCompletedHold = true;
      stopProgress();
      const wasOwned = restoreDom();
      setLocked(false);
      root.style.setProperty("--intro-handoff-delay", `${handoffDelayMs}ms`);
      root.dataset.introHandoff = "true";
      root.dataset.introPhase = "revealing";
      setPhase("revealing");
      if (wasOwned) restoreFocus();
      schedule(() => finish(reason), exitMs + 70);
    };

    finishRef.current = finish;

    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_SESSION_KEY) === "seen";
    } catch {
      /* ignore */
    }

    const navigation = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const isReload = navigation?.type === "reload";
    const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    const saveData = Boolean(connection?.saveData);
    const scrollRestored = window.scrollY > 40;

    const shouldSkip =
      bootstrap?.skip ||
      reduced.matches ||
      !!location.hash ||
      document.hidden ||
      saveData ||
      scrollRestored ||
      (seen && !isReload) ||
      navigation?.type === "back_forward";

    if (shouldSkip) {
      finish(scrollRestored ? "scroll-restored" : "bypassed");
      return () => {
        disposed = true;
        clearTimers();
        lifecycle.abort();
        finishRef.current = () => {};
      };
    }

    root.style.setProperty("--intro-exit-ms", `${exitMs}ms`);
    root.style.setProperty("--intro-max-ms", `${maximumMs}ms`);
    root.style.setProperty("--intro-handoff-delay", `${handoffDelayMs}ms`);
    root.dataset.introPhase = "loading";
    if (content) content.inert = true;
    owned = true;
    setLocked(true);
    if (bootstrap) bootstrap.recover = () => finish("safety-release");

    const onKeyDown = (event: KeyboardEvent) => {
      if (finished) return;
      if (event.key === "Escape") {
        event.preventDefault();
        finish("skipped");
      }
    };
    const onVisibility = () => {
      if (document.hidden) finish("backgrounded");
    };
    const onMotionPreference = () => {
      if (reduced.matches) finish("reduced-motion");
    };

    window.addEventListener("keydown", onKeyDown, { capture: true, signal: lifecycle.signal });
    document.addEventListener("visibilitychange", onVisibility, { signal: lifecycle.signal });
    reduced.addEventListener("change", onMotionPreference, { signal: lifecycle.signal });
    introRef.current?.focus({ preventScroll: true });

    let targetProgress = 0;
    let allReady = false;
    let displayProgress = 0;
    let lastPercent = -1;

    const writeProgress = (value: number) => {
      const bounded = Math.max(0, Math.min(1, value));
      const pct = Math.round(bounded * 100);
      const offset = (1 - bounded) * 100;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${bounded})`;
      }
      if (maskRef.current) {
        maskRef.current.style.transform = `translate3d(${-offset}%, 0, 0)`;
      }
      if (fillRef.current) {
        fillRef.current.style.transform = `translate3d(${offset}%, 0, 0)`;
      }
      if (periodRef.current) {
        const periodActive = bounded >= 0.96;
        periodRef.current.style.opacity = periodActive ? "1" : "0.28";
        periodRef.current.style.transform = periodActive ? "scale(1)" : "scale(0.84)";
      }
      if (pct !== lastPercent) {
        lastPercent = pct;
        progressRef.current?.setAttribute("aria-valuenow", String(pct));
        if (percentRef.current) {
          percentRef.current.textContent = String(pct).padStart(3, "0");
        }
      }
    };

    const tick = ({ delta: deltaMs }: { delta: number }) => {
      if (disposed || finished || livePhase !== "loading") return;

      const dt = Math.min(64, Math.max(0, deltaMs));
      const timeFrac = minimumMs > 0 ? Math.min(1, elapsed() / minimumMs) : 1;

      const desired =
        allReady && timeFrac >= 1
          ? 1
          : Math.min(
              targetProgress,
              allReady ? 0.99 : Math.max(targetProgress * 0.85, timeFrac * 0.96),
            );

      if (displayProgress < desired) {
        const tau = allReady && timeFrac >= 1 ? 42 : 78;
        const step = (desired - displayProgress) * (1 - Math.exp(-dt / tau));
        displayProgress =
          desired - displayProgress < 0.004
            ? desired
            : displayProgress + Math.max(step, dt * 0.0004);
        if (displayProgress > desired) displayProgress = desired;
        writeProgress(displayProgress);
      }

      if (allReady && timeFrac >= 1 && displayProgress >= 0.995 && !hasCompletedHold) {
        hasCompletedHold = true;
        displayProgress = 1;
        writeProgress(1);
        schedule(() => {
          if (!disposed && !finished) {
            reveal("resources-ready");
          }
        }, 60);
      }
    };

    stopProgress = () => cancelFrame(tick);
    frame.update(tick, true);

    observePageReadiness({
      container: content,
      signal: lifecycle.signal,
      onUpdate: (snapshot) => {
        if (disposed || finished) return;
        targetProgress = Math.max(targetProgress, snapshot.progress);
        if (snapshot.ready) {
          allReady = true;
        }
      },
    });

    schedule(() => {
      if (!disposed && !finished && livePhase === "loading") {
        targetProgress = 1;
        displayProgress = 1;
        writeProgress(1);
        reveal("time-budget");
      }
    }, maximumMs - elapsed());

    schedule(() => {
      finish("safety-release");
    }, maximumMs + exitMs + 280 - elapsed());

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
          ref={introRef}
          className={styles.intro}
          data-experience-intro
          data-phase={phase}
          role="dialog"
          aria-modal="true"
          aria-label="Carregando portfólio de Lucas"
          tabIndex={-1}
        >
          <div className={styles.curtainUnderlay} aria-hidden="true" />
          <div className={styles.curtainPrimary}>
            <span className={`${styles.guide} ${styles.guideLeft}`} aria-hidden="true" />
            <span className={`${styles.guide} ${styles.guideRight}`} aria-hidden="true" />

            <div className={styles.stage}>
              <div className={styles.topBar} aria-hidden="true">
                <span className={styles.topIndex}>[00]</span>
                <span className={styles.topName}>LUCAS</span>
                <span className={styles.topDots} />
                <span className={styles.topLocation}>INDAIATUBA · SP</span>
              </div>

              <div
                ref={progressRef}
                className={styles.centerStage}
                role="progressbar"
                aria-label="Carregamento do portfólio"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={0}
              >
                <div className={styles.wordmarkRow} aria-hidden="true">
                  <div className={styles.wordmark}>
                    <span className={styles.wordmarkOutline}>LUCAS</span>
                    <span
                      ref={maskRef}
                      className={styles.wordmarkMask}
                      style={{ transform: "translate3d(-100%, 0, 0)" }}
                    >
                      <span
                        ref={fillRef}
                        className={styles.wordmarkFill}
                        style={{ transform: "translate3d(100%, 0, 0)" }}
                      >
                        LUCAS
                      </span>
                    </span>
                  </div>
                  <span
                    ref={periodRef}
                    className={styles.period}
                    style={{ opacity: 0.28, transform: "scale(0.84)" }}
                  >
                    .
                  </span>
                </div>

                <div className={styles.progressBlock} aria-hidden="true">
                  <div className={styles.progressRail}>
                    <div
                      ref={barRef}
                      className={styles.progressFill}
                      style={{ transform: "scaleX(0)" }}
                    />
                  </div>

                  <div className={styles.baselineRow}>
                    <span className={styles.roleSubtitle}>Desenvolvedor Full-Stack</span>
                    <span className={styles.counter}>
                      <span ref={percentRef} className={styles.percentDigits}>
                        000
                      </span>
                      <span className={styles.percentSign}>%</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.bottomBar}>
                <span className={styles.folioYear} aria-hidden="true">
                  PORTFÓLIO · 2026
                </span>
                <button
                  type="button"
                  onClick={() => finishRef.current("skipped")}
                  className={styles.skipBtn}
                  aria-label="Pular abertura e entrar no portfólio"
                >
                  <span>Pular</span>
                  <span className={styles.skipKey} aria-hidden="true">
                    ESC
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
