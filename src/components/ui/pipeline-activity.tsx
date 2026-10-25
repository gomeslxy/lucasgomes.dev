"use client";

import { useEffect, useRef } from "react";

export function PipelineActivity({ active }: { active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const motionPolicy = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const update = () => { element.style.animationPlayState = active && !document.hidden && motionPolicy.matches ? "running" : "paused"; };
    update();
    document.addEventListener("visibilitychange", update);
    motionPolicy.addEventListener("change", update);
    return () => {
      element.style.animationPlayState = "paused";
      document.removeEventListener("visibilitychange", update);
      motionPolicy.removeEventListener("change", update);
    };
  }, [active]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-[5.5rem] hidden h-px overflow-hidden lg:block select-none"
    >
      <span
        ref={ref}
        className="block h-full w-1/4 bg-linear-to-r from-transparent via-crimson to-transparent animate-[pipeline-travel_3s_cubic-bezier(0.76,0,0.24,1)_infinite]"
        style={{ animationPlayState: "paused" }}
      />
    </div>
  );
}
