"use client";

import type Lenis from "lenis";
import { useLenis } from "lenis/react";
import { cancelFrame, frame, type MotionValue, useMotionValue } from "motion/react";
import { createContext, useContext, useEffect, useState, type ReactNode, type RefObject } from "react";
import { useEnhancedMotion } from "@/lib/use-animation-policy";
import { sceneProgress, bidirectionalSceneProgress } from "@/lib/motion-curves";

type Range = {
  start?: number;
  end?: number;
  bidirectional?: boolean;
  exitStart?: number;
  exitEnd?: number;
};
type Scene = {
  element: HTMLElement;
  value: MotionValue<number>;
  start: number;
  end: number;
  top: number;
  height: number;
  measured: boolean;
  settledOnLoad: boolean;
  bidirectional: boolean;
  exitStart: number;
  exitEnd: number;
};

/** One event source and one geometry pass for all editorial reveals and bridges. */
export class ScrollDirector {
  private scenes = new Set<Scene>();
  private targets = new Map<Element, Set<Scene>>();
  private active = new Set<Scene>();
  private intersection?: IntersectionObserver;
  private resize?: ResizeObserver;
  private lenis?: Lenis;
  private running = false;
  private y = 0;
  private viewport = 1;

  register(element: HTMLElement, value: MotionValue<number>, range: Range) {
    const isBidirectional = range.bidirectional ?? (range.end !== undefined ? range.end > 0 : true);
    const scene: Scene = {
      element,
      value,
      start: range.start ?? .94,
      end: range.end ?? .5,
      top: 0,
      height: 0,
      measured: false,
      settledOnLoad: false,
      bidirectional: isBidirectional,
      exitStart: range.exitStart ?? .18,
      exitEnd: range.exitEnd ?? -.06,
    };
    this.scenes.add(scene);
    const siblings = this.targets.get(element) ?? new Set<Scene>();
    if ([...siblings].some(sibling => this.active.has(sibling))) this.active.add(scene);
    siblings.add(scene);
    this.targets.set(element, siblings);
    this.intersection?.observe(element);
    this.resize?.observe(element);
    if (this.running) this.invalidate();
    return () => {
      this.scenes.delete(scene);
      this.active.delete(scene);
      siblings.delete(scene);
      if (!siblings.size) {
        this.targets.delete(element);
        this.intersection?.unobserve(element);
        this.resize?.unobserve(element);
      }
    };
  }

  start(lenis?: Lenis) {
    this.running = true;
    this.lenis = lenis;
    this.y = lenis?.scroll ?? window.scrollY;
    this.intersection = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        for (const scene of this.targets.get(entry.target) ?? []) {
          if (entry.isIntersecting) this.active.add(scene);
          else this.active.delete(scene);
          this.update(scene);
        }
      }
    }, { rootMargin: "35% 0px 35% 0px" });
    this.resize = new ResizeObserver(this.invalidate);
    this.resize.observe(document.body);
    for (const target of this.targets.keys()) {
      this.intersection.observe(target);
      this.resize.observe(target);
    }
    if (lenis) lenis.on("scroll", this.onLenis);
    else window.addEventListener("scroll", this.onNative, { passive: true });
    window.addEventListener("resize", this.invalidate, { passive: true });
    document.addEventListener("portfolio:intro-ready", this.invalidate);
    document.addEventListener("toggle", this.invalidate, true);
    document.addEventListener("visibilitychange", this.onVisibility);
    void document.fonts.ready.then(() => { if (this.running) this.invalidate(); });
    this.invalidate();
    return () => this.stop();
  }

  private update(scene: Scene) {
    if (!scene.measured || document.hidden) return;
    if (scene.settledOnLoad) {
      const topInView = scene.top - this.y;
      const bottomInView = scene.top + scene.height - this.y;
      if (topInView < this.viewport * scene.end && bottomInView > this.viewport * scene.exitStart) {
        scene.value.set(1);
        return;
      }
      scene.settledOnLoad = false;
    }

    const progress = scene.bidirectional
      ? bidirectionalSceneProgress(this.y, scene.top, scene.height, this.viewport, scene.start, scene.end, scene.exitStart, scene.exitEnd)
      : sceneProgress(this.y, scene.top, this.viewport, scene.start, scene.end);

    scene.value.set(progress);
  }

  private onLenis = (instance: Lenis) => {
    this.y = instance.scroll;
    if (!document.hidden) for (const scene of this.active) this.update(scene);
  };

  private onNative = () => {
    this.y = window.scrollY;
    frame.update(this.flush);
  };

  private flush = () => {
    if (!this.running || document.hidden) return;
    for (const scene of this.active) this.update(scene);
  };

  private measure = () => {
    if (!this.running || document.hidden) return;
    this.viewport = window.innerHeight;
    this.y = this.lenis?.scroll ?? window.scrollY;
    // All geometry reads precede every MotionValue write.
    for (const scene of this.scenes) {
      const rect = scene.element.getBoundingClientRect();
      scene.top = rect.top + window.scrollY;
      scene.height = rect.height ?? (rect.bottom - rect.top);
      if (!scene.measured && rect.top < this.viewport * .98 && rect.bottom > 0) {
        scene.settledOnLoad = true;
      }
      scene.measured = true;
      const inMargin = rect.bottom >= -this.viewport * .35 && rect.top <= this.viewport * 1.35;
      if (inMargin) this.active.add(scene);
    }
    for (const scene of this.scenes) this.update(scene);
  };

  private invalidate = () => { if (this.running) frame.read(this.measure); };
  private onVisibility = () => {
    if (document.hidden) { cancelFrame(this.flush); cancelFrame(this.measure); }
    else this.invalidate();
  };

  private stop() {
    this.running = false;
    this.lenis?.off("scroll", this.onLenis);
    this.lenis = undefined;
    this.intersection?.disconnect();
    this.resize?.disconnect();
    this.intersection = undefined;
    this.resize = undefined;
    this.active.clear();
    cancelFrame(this.measure);
    cancelFrame(this.flush);
    window.removeEventListener("scroll", this.onNative);
    window.removeEventListener("resize", this.invalidate);
    document.removeEventListener("portfolio:intro-ready", this.invalidate);
    document.removeEventListener("toggle", this.invalidate, true);
    document.removeEventListener("visibilitychange", this.onVisibility);
  }
}

const DirectorContext = createContext<ScrollDirector | null>(null);

export function ScrollDirectorProvider({ children }: { children: ReactNode }) {
  const [director] = useState(() => new ScrollDirector());
  const lenis = useLenis();
  const enhanced = useEnhancedMotion();
  useEffect(() => {
    if (enhanced) return director.start(lenis);
  }, [director, enhanced, lenis]);
  return <DirectorContext.Provider value={director}>{children}</DirectorContext.Provider>;
}

export function useSceneProgress(ref: RefObject<HTMLElement | null>, range: Range = {}) {
  const director = useContext(DirectorContext);
  const enhanced = useEnhancedMotion();
  const progress = useMotionValue(1);
  const start = range.start ?? .94;
  const end = range.end ?? .5;
  const bidirectional = range.bidirectional;
  const exitStart = range.exitStart;
  const exitEnd = range.exitEnd;

  useEffect(() => {
    const element = ref.current;
    if (!enhanced || !director || !element) { progress.set(1); return; }
    return director.register(element, progress, { start, end, bidirectional, exitStart, exitEnd });
  }, [director, enhanced, end, progress, ref, start, bidirectional, exitStart, exitEnd]);
  return { progress, enhanced: enhanced && !!director };
}
