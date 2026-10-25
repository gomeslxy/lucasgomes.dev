"use client";

import { useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { PipelineActivity } from "@/components/ui/pipeline-activity";
import { useEnhancedMotion } from "@/lib/use-animation-policy";

/** The diagram stays in the server HTML; only its decorative activity is deferred. */
export function DeferredVisual({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const nearby = useInView(ref, { once: true, margin: "400px" });
  const active = useInView(ref);
  const enhancedMotion = useEnhancedMotion();

  return (
    <div ref={ref} className="relative">
      {children}
      {nearby && enhancedMotion && <PipelineActivity active={active} />}
    </div>
  );
}
