"use client";

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
 * Observes DOM, typography, priority hero image decoding, and compositor paint
 * readiness without waiting on decorative below-fold or WebGL chunks.
 */
export function observePageReadiness({
  container,
  signal,
  onUpdate,
}: ObserveReadinessOptions): void {
  if (signal.aborted) return;

  const weights = { dom: 0.2, fonts: 0.4, images: 0.35, paint: 0.05 };

  let domScore = 0;
  let fontsScore = 0;
  let imagesScore = 0;
  let paintScore = 0;

  let lastProgress = 0;
  let paintScheduled = false;
  let paintSettled = false;
  let rafOne = 0;
  let rafTwo = 0;

  const cleanup = () => {
    if (rafOne) {
      cancelAnimationFrame(rafOne);
      rafOne = 0;
    }
    if (rafTwo) {
      cancelAnimationFrame(rafTwo);
      rafTwo = 0;
    }
  };

  signal.addEventListener("abort", cleanup, { once: true });

  const emit = () => {
    if (signal.aborted) return;

    const weighted =
      domScore * weights.dom +
      fontsScore * weights.fonts +
      imagesScore * weights.images +
      paintScore * weights.paint;

    lastProgress = Math.min(1, Math.max(lastProgress, weighted));

    const prereqsSettled = domScore >= 1 && fontsScore >= 1 && imagesScore >= 1;

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

  emit();
}
