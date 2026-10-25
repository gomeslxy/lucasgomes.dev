"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { cn, EASE_EXPO } from "@/lib/utils";
import { useEnhancedMotion } from "@/lib/use-animation-policy";

type ImageRevealProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
};

export function ImageReveal({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 55vw, (min-width: 640px) 90vw, 100vw",
  priority,
  quality = 85,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-10%" });
  const enhancedMotion = useEnhancedMotion();

  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-graphite select-none", className)}>
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ scale: enhancedMotion && !inView ? 1.06 : 1 }}
        transition={{ duration: enhancedMotion ? 0.8 : 0, ease: EASE_EXPO }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          quality={quality}
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
