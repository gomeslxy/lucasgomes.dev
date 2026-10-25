"use client";

import { ArrowDown, ArrowUpRight, MoveUpRight } from "lucide-react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useEffect, useRef, useSyncExternalStore } from "react";
import { useScrollTo } from "@/lib/use-scroll-to";
import { useEnhancedMotion } from "@/lib/use-animation-policy";
import { ProfileDepth } from "./profile-depth";
import styles from "./hero.module.css";

// Match CSS pinning: short viewports and touch keep natural flow.
const SPATIAL_QUERY = "(min-width: 900px) and (min-height: 880px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
function subscribe(callback: () => void) {
  const media = window.matchMedia(SPATIAL_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const getSnapshot = () => window.matchMedia(SPATIAL_QUERY).matches;
const getServerSnapshot = () => false;

export function ProfileStage({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const spatial = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const reduced = useReducedMotion();
  const enhanced = useEnhancedMotion();
  const scrollTo = useScrollTo();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: spatial ? ["start start", "end end"] : ["end end", "end start"],
  });
  // MotionValues update compositor properties without React renders per frame.
  const z = useTransform(scrollYProgress, [0, .13, 1], [0, 0, spatial ? -1050 : 0]);
  const y = useTransform(scrollYProgress, [0, .13, 1], [0, 0, spatial ? -135 : -24]);
  const rotateX = useTransform(scrollYProgress, [0, .13, .8, 1], [0, 0, spatial ? 36 : 3, spatial ? 48 : 5]);
  const rotateZ = useTransform(scrollYProgress, [0, .13, 1], [0, 0, spatial ? -9 : 0]);
  // Functional transforms keep opacity on the same measured progress after a
  // responsive offset change; native timelines can retain the hydration offsets.
  const opacity = useTransform(() => 1 - Math.min(1, Math.max(0, (scrollYProgress.get() - .58) / .4)));
  const labelOpacity = useTransform(() => {
    const progress = scrollYProgress.get();
    return progress < .72
      ? Math.max(0, (progress - .36) / .36) * .65
      : Math.max(0, (1 - progress) / .28) * .65;
  });
  const labelY = useTransform(scrollYProgress, [0, 1], [70, -30]);
  const cueOpacity = useTransform(() => 1 - Math.min(1, scrollYProgress.get() / .2));

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const cardHidden = enhanced && !reduced && value > .94;
    const footerHidden = enhanced && !reduced && value >= .2;
    if (cardRef.current && cardRef.current.inert !== cardHidden) cardRef.current.inert = cardHidden;
    if (footerRef.current && footerRef.current.inert !== footerHidden) footerRef.current.inert = footerHidden;
  });
  useEffect(() => {
    if (cardRef.current) cardRef.current.inert = enhanced && !reduced && scrollYProgress.get() > .94;
    if (footerRef.current) footerRef.current.inert = enhanced && !reduced && scrollYProgress.get() >= .2;
  }, [enhanced, reduced, spatial, scrollYProgress]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let visible = true;
    const update = () => { section.dataset.heroPaused = String(!visible || document.hidden); };
    const observer = new IntersectionObserver(([entry]) => { visible = !!entry?.isIntersecting; update(); });
    observer.observe(section);
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);

  return (
    <section ref={sectionRef} id="hero" aria-labelledby="hero-title" className={styles.hero}>
      <div className={styles.stickyStage}>
        <div className={styles.background} aria-hidden="true">
          <div className={styles.atmosphere} />
          <span className={styles.backgroundWord}>LUCAS</span>
          <span className={`${styles.guide} ${styles.guideLeft}`} />
          <span className={`${styles.guide} ${styles.guideRight}`} />
          <span className={styles.sideNote}>DESIGN MINDED. ENGINEERING DRIVEN.</span>
        </div>
        <div className={styles.stageShell}>
          <motion.div ref={cardRef} data-profile-scroll className={styles.cardPlane} style={reduced || !enhanced ? undefined : { z, y, rotateX, rotateZ, opacity }}>
            <ProfileDepth>
              <div className={styles.entranceRig}>
                <span className={styles.assemblyFrame} aria-hidden="true" />
                <span className={styles.assemblyLight} aria-hidden="true" />
                {children}
              </div>
            </ProfileDepth>
          </motion.div>
          <motion.div className={styles.nextChapter} aria-hidden="true" style={reduced || !spatial ? { opacity: 0 } : { opacity: labelOpacity, y: labelY }}>
            <span>MENOS DISCURSO. MAIS CÓDIGO.</span>
            <p>Veja em <em>prática.</em><MoveUpRight /></p>
          </motion.div>
        </div>
        <motion.div ref={footerRef} className={styles.stageFooter} style={reduced || !enhanced ? undefined : { opacity: cueOpacity }}>
          <span className={styles.footerNote}><span className={styles.footerAsterisk}>✳</span> CURIOSIDADE É O MEU ESTADO PADRÃO.</span>
          <a href="#work" onClick={(event) => { event.preventDefault(); scrollTo("#work"); }} className={styles.scrollHint}><span>CONTINUE EXPLORANDO</span><span className={styles.scrollIcon}><ArrowDown size={14} aria-hidden="true" /></span></a>
          <span className={styles.footerIndex}><span>PORTFÓLIO PESSOAL</span><ArrowUpRight size={12} aria-hidden="true" />2026</span>
        </motion.div>
      </div>
    </section>
  );
}
