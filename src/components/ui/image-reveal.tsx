"use client";

import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { cn, EASE_QUART, EASE_EXPO } from "@/lib/utils";

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
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-graphite select-none", className)}>
      {/* Parallax Inner Container */}
      <motion.div className="absolute inset-[-8%]" style={{ y }}>
        <motion.div
          className="relative h-full w-full"
          initial={{ scale: 1.2 }}
          animate={inView ? { scale: 1 } : { scale: 1.2 }}
          transition={{ duration: 1.4, ease: EASE_EXPO }}
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
      </motion.div>

      {/* Cinematic Wipe Curtains (Pointer events strictly disabled) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 origin-top bg-crimson"
        initial={{ y: "0%" }}
        animate={inView ? { y: "-101%" } : { y: "0%" }}
        transition={{ duration: 1, ease: EASE_QUART }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-ink"
        initial={{ y: "0%" }}
        animate={inView ? { y: "-101%" } : { y: "0%" }}
        transition={{ duration: 1, ease: EASE_QUART, delay: 0.1 }}
      />
    </div>
  );
}
