"use client";

import { useLenis } from "lenis/react";
import { cancelFrame, frame, useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { clamp, getActiveChapter, getSettledChapter, smootherstep, STORY_SETTINGS } from "@/lib/scrollytelling";

const QUERY = "(min-width: 768px) and (min-height: 640px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const subscribers = new Set<() => void>();
let media: MediaQueryList | undefined;

function getMedia() {
  return (media ??= window.matchMedia(QUERY));
}

function notify() {
  subscribers.forEach((subscriber) => subscriber());
}

function subscribe(subscriber: () => void) {
  const query = getMedia();
  if (!subscribers.size) query.addEventListener("change", notify);
  subscribers.add(subscriber);
  return () => {
    subscribers.delete(subscriber);
    if (!subscribers.size) query.removeEventListener("change", notify);
  };
}

const getSnapshot = () => getMedia().matches;
const getServerSnapshot = () => false;

type ScrollStoryOptions = { count: number; stepPx?: number };

/**
 * CSS owns the reserved track and sticky positioning. This hook only reads
 * geometry on invalidation, then maps cached scroll coordinates to MotionValues.
 */
export function useScrollStory({ count, stepPx = STORY_SETTINGS.stepPx }: ScrollStoryOptions) {
  const trackRef = useRef<HTMLDivElement>(null);
  const geometry = useRef({ top: 0, range: 0, ready: false });
  const progress = useMotionValue(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const activeRef = useRef(0);
  const cancelSettleRef = useRef<() => void>(() => {});
  const enhanced = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const lenis = useLenis();
  const chapterCount = Number.isFinite(count) ? Math.max(1, Math.floor(count)) : 1;
  const distance = (Number.isFinite(stepPx) && stepPx > 0 ? stepPx : STORY_SETTINGS.stepPx) * (chapterCount - 1);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !enhanced) {
      geometry.current.ready = false;
      progress.set(0);
      activeRef.current = 0;
      setActiveChapter(0);
      return;
    }

    let disposed = false;
    let wheelIntent = false;
    let wheelStartPosition = 0;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;

    const cancelSettle = () => {
      wheelIntent = false;
      clearTimeout(settleTimer);
      settleTimer = undefined;
    };
    cancelSettleRef.current = cancelSettle;

    const update = (y: number) => {
      const bounds = geometry.current;
      if (!bounds.ready) return;
      const next = bounds.range > 0 ? clamp((y - bounds.top) / bounds.range) : 0;
      progress.set(next);
      const chapter = getActiveChapter(next, chapterCount);
      if (chapter !== activeRef.current) {
        activeRef.current = chapter;
        setActiveChapter(chapter);
      }
    };

    const measure = () => {
      if (disposed) return;
      geometry.current = {
        top: track.getBoundingClientRect().top + window.scrollY,
        range: distance,
        ready: true,
      };
      update(lenis?.scroll ?? window.scrollY);
    };
    const queueMeasure = () => frame.read(measure);
    const readNativeScroll = () => update(window.scrollY);

    const settle = () => {
      settleTimer = undefined;
      if (!wheelIntent || disposed) return;
      wheelIntent = false;
      const bounds = geometry.current;
      const y = lenis?.scroll ?? window.scrollY;
      const focused = document.activeElement;
      if (
        !lenis || lenis.isStopped || lenis.isLocked || document.hidden ||
        document.documentElement.dataset.introPhase === "loading" ||
        document.documentElement.dataset.introPhase === "revealing" ||
        !bounds.ready || !bounds.range || y < bounds.top || y > bounds.top + bounds.range ||
        (focused instanceof Element && !!focused.closest("input, textarea, select, [contenteditable='true'], [role='dialog']"))
      ) return;

      const chapter = getSettledChapter(progress.get(), wheelStartPosition / (chapterCount - 1), chapterCount);
      if (chapter === null) return;
      const destination = bounds.top + chapter / (chapterCount - 1) * bounds.range;
      if (Math.abs(destination - y) < 1) return;
      // Finish the reading state; new wheel input interrupts Lenis naturally.
      lenis.scrollTo(destination, {
        duration: STORY_SETTINGS.settleDuration,
        lerp: 0,
        easing: smootherstep,
      });
    };

    const queueSettle = () => {
      clearTimeout(settleTimer);
      if (wheelIntent) settleTimer = setTimeout(settle, STORY_SETTINGS.settleDelayMs);
    };

    const onLenisScroll = () => {
      update(lenis?.scroll ?? window.scrollY);
      queueSettle();
    };
    const onNativeScroll = () => {
      frame.read(readNativeScroll);
      queueSettle();
    };
    const onWheel = (event: WheelEvent) => {
      clearTimeout(settleTimer);
      settleTimer = undefined;
      const target = event.target;
      if (
        !event.isTrusted || event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX) ||
        (target instanceof Element && !!target.closest("[data-lenis-prevent], [role='dialog'], input, textarea, select, [contenteditable='true']"))
      ) {
        cancelSettle();
        return;
      }
      if (!wheelIntent) {
        const bounds = geometry.current;
        const y = lenis?.scroll ?? window.scrollY;
        const start = bounds.ready && bounds.range > 0 ? clamp((y - bounds.top) / bounds.range) : 0;
        wheelStartPosition = start * (chapterCount - 1);
      }
      wheelIntent = true;
      queueSettle();
    };

    if (lenis) lenis.on("scroll", onLenisScroll);
    else window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", cancelSettle);
    window.addEventListener("pointerdown", cancelSettle, { passive: true });
    window.addEventListener("touchstart", cancelSettle, { passive: true });
    window.addEventListener("blur", cancelSettle);
    window.addEventListener("resize", queueMeasure, { passive: true });
    document.addEventListener("visibilitychange", cancelSettle);
    document.addEventListener("portfolio:intro-ready", queueMeasure);
    const observer = new ResizeObserver(queueMeasure);
    observer.observe(track);
    observer.observe(document.body);
    void document.fonts.ready.then(() => { if (!disposed) queueMeasure(); });
    queueMeasure();

    return () => {
      disposed = true;
      cancelSettle();
      cancelSettleRef.current = () => {};
      cancelFrame(measure);
      cancelFrame(readNativeScroll);
      observer.disconnect();
      lenis?.off("scroll", onLenisScroll);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", cancelSettle);
      window.removeEventListener("pointerdown", cancelSettle);
      window.removeEventListener("touchstart", cancelSettle);
      window.removeEventListener("blur", cancelSettle);
      window.removeEventListener("resize", queueMeasure);
      document.removeEventListener("visibilitychange", cancelSettle);
      document.removeEventListener("portfolio:intro-ready", queueMeasure);
    };
  }, [chapterCount, distance, enhanced, lenis, progress]);

  const goToChapter = useCallback((index: number) => {
    cancelSettleRef.current();
    const chapter = Math.round(clamp(index, 0, chapterCount - 1));
    const bounds = geometry.current;
    if (enhanced && bounds.ready) {
      const top = bounds.top + (chapterCount > 1 ? chapter / (chapterCount - 1) * bounds.range : 0);
      if (lenis) lenis.scrollTo(top, { duration: 0.65, lerp: 0, easing: smootherstep });
      else window.scrollTo({ top, behavior: "smooth" });
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    trackRef.current?.querySelector<HTMLElement>(`[data-story-chapter="${chapter}"]`)
      ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "center" });
  }, [chapterCount, enhanced, lenis]);

  return { trackRef, progress, activeChapter, enhanced, goToChapter };
}
