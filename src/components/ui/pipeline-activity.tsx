"use client";

import { useEffect, useState } from "react";

export function PipelineActivity({ active }: { active: boolean }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-[5.5rem] hidden h-px overflow-hidden lg:block select-none"
    >
      <span
        className="block h-full w-1/4 bg-linear-to-r from-transparent via-crimson to-transparent animate-[pipeline-travel_3s_cubic-bezier(0.76,0,0.24,1)_infinite]"
        style={{ animationPlayState: active && visible ? "running" : "paused" }}
      />
    </div>
  );
}
