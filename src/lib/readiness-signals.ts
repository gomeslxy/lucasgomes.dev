"use client";

import { ENHANCED_MOTION_QUERY } from "@/lib/use-animation-policy";

let webglReady = false;
const webglListeners = new Set<() => void>();

/** Signals that the Hero WebGL lattice compiled and painted its first frame. */
export function markWebGLFieldReady(): void {
  if (webglReady) return;
  webglReady = true;
  const pending = Array.from(webglListeners);
  webglListeners.clear();
  for (const listener of pending) {
    listener();
  }
}

export function isWebGLFieldReady(): boolean {
  return webglReady;
}

export function subscribeWebGLFieldReady(listener: () => void): () => void {
  if (webglReady) {
    listener();
    return () => {};
  }
  webglListeners.add(listener);
  return () => {
    webglListeners.delete(listener);
  };
}

export type ReadinessSnapshot = {
  progress: number;
  ready: boolean;
};

type ObserveReadinessOptions = {
  container: HTMLElement | null;
  signal: AbortSignal;
  onUpdate: (snapshot: ReadinessSnapshot) => void;
};

/**
 * Observes real browser, typography, priority hero image, WebGL warm-up,
 * and compositor paint readiness without artificial milestone delays.
 */
export function observePageReadiness({
  container,
  signal,
  onUpdate,
}: ObserveReadinessOptions): void {
  if (signal.aborted) return;

  const expectsWebGL = window.matchMedia(ENHANCED_MOTION_QUERY).matches;
  const weights = expectsWebGL
    ? { dom: 0.15, fonts: 0.35, images: 0.3, webgl: 0.15, paint: 0.05 }
    : { dom: 0.2, fonts: 0.4, images: 0.35, webgl: 0, paint: 0.05 };

  let domScore = 0;
  let fontsScore = 0;
  let imagesScore = 0;
  let webglScore = 0;
  let paintScore = 0;

  let lastProgress = 0;
  let paintScheduled = false;
  let paintSettled = false;
  let rafOne = 0;
  let rafTwo = 0;
  let unsubscribeWebGL: (() => void) | undefined;

  const cleanup = () => {
    if (rafOne) {
      cancelAnimationFrame(rafOne);
      rafOne = 0;
    }
    if (rafTwo) {
      cancelAnimationFrame(rafTwo);
      rafTwo = 0;
    }
    unsubscribeWebGL?.();
    unsubscribeWebGL = undefined;
  };

  signal.addEventListener("abort", cleanup, { once: true });

  const emit = () => {
    if (signal.aborted) return;

    const weighted =
      domScore * weights.dom +
      fontsScore * weights.fonts +
      imagesScore * weights.images +
      webglScore * weights.webgl +
      paintScore * weights.paint;

    lastProgress = Math.min(1, Math.max(lastProgress, weighted));

    const prereqsSettled =
      domScore >= 1 && fontsScore >= 1 && imagesScore >= 1 && webglScore >= 1;

    if (prereqsSettled && !paintScheduled && !paintSettled) {
      paintScheduled = true;
      rafOne = requestAnimationFrame(() => {
        rafOne = 0;
        if (signal.aborted) return;
        rafTwo = requestAnimationFrame(() => {
          rafTwo = 0;
          if (signal.aborted) return;
          paintSettled = true;
          paintScore = 1;
          emit();
        });
      });
    }

    onUpdate({
      progress: paintSettled ? 1 : lastProgress,
      ready: paintSettled,
    });
  };

  // 1. DOM readiness
  if (document.readyState !== "loading") {
    domScore = 1;
  } else {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        domScore = 1;
        emit();
      },
      { once: true, signal },
    );
  }

  // 2. Typography readiness (failures resolve too so loading never stalls)
  if (document.fonts?.ready) {
    document.fonts.ready.then(
      () => {
        fontsScore = 1;
        emit();
      },
      () => {
        fontsScore = 1;
        emit();
      },
    );
  } else {
    fontsScore = 1;
  }

  // 3. Priority Hero images (ignore lazy-loaded offscreen assets)
  const priorityImages = Array.from(
    container?.querySelectorAll<HTMLImageElement>("#hero img") ?? [],
  ).filter((img) => img.loading !== "lazy");

  if (priorityImages.length === 0) {
    imagesScore = 1;
  } else {
    const completed = new WeakSet<HTMLImageElement>();
    let completedCount = 0;

    const markImageDone = (img: HTMLImageElement) => {
      if (signal.aborted || completed.has(img)) return;
      completed.add(img);
      completedCount += 1;
      imagesScore = completedCount / priorityImages.length;
      emit();
    };

    const decodeAndComplete = (img: HTMLImageElement) => {
      if (img.naturalWidth === 0) {
        markImageDone(img);
        return;
      }
      if (typeof img.decode === "function") {
        img.decode().then(
          () => markImageDone(img),
          () => markImageDone(img),
        );
      } else {
        markImageDone(img);
      }
    };

    for (const img of priorityImages) {
      if (img.complete) {
        decodeAndComplete(img);
      } else {
        img.addEventListener("load", () => decodeAndComplete(img), {
          once: true,
          signal,
        });
        img.addEventListener("error", () => markImageDone(img), {
          once: true,
          signal,
        });
      }
    }
  }

  // 4. Hero WebGL lattice shader warm-up & first frame
  if (!expectsWebGL || isWebGLFieldReady()) {
    webglScore = 1;
  } else {
    unsubscribeWebGL = subscribeWebGLFieldReady(() => {
      webglScore = 1;
      emit();
    });
  }

  emit();
}
