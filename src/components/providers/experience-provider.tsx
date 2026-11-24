"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import { cancelFrame, frame } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type IntroContextValue = {
  ready: boolean;
  markReady: () => void;
};

const IntroContext = createContext<IntroContextValue>({
  ready: false,
  markReady: () => undefined,
});

export function useIntro(): IntroContextValue {
  return useContext(IntroContext);
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const [ready, setReady] = useState(false);

  // Drive Lenis from Motion's frame loop so every scroll-linked transform
  // reads the exact same inertial scroll position on the same frame.
  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }
    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    const root = document.documentElement;
    if (ready) {
      lenis?.start();
      lenis?.resize();
      root.style.removeProperty("overflow");
    } else {
      lenis?.stop();
      root.style.overflow = "hidden";
    }

    const handleResize = () => {
      lenisRef.current?.lenis?.resize();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        lenisRef.current?.lenis?.resize();
      });
    }

    return () => {
      root.style.removeProperty("overflow");
      window.removeEventListener("resize", handleResize);
    };
  }, [ready]);

  const markReady = useCallback(() => setReady(true), []);
  const value = useMemo(() => ({ ready, markReady }), [ready, markReady]);

  return (
    <IntroContext.Provider value={value}>
      <ReactLenis
        root
        ref={lenisRef}
        options={{
          autoRaf: false,
          lerp: 0.085,
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.2,
          syncTouch: true,
        }}
      >
        {children}
      </ReactLenis>
    </IntroContext.Provider>
  );
}
