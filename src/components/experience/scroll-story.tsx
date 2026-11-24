"use client";

import { ArrowDown, ArrowDownRight } from "lucide-react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { useId, type CSSProperties } from "react";
import { getStoryFrame, STORY_SETTINGS } from "@/lib/scrollytelling";
import { useScrollStory } from "@/lib/use-scroll-story";
import styles from "./scroll-story.module.css";

export type StoryChapter = {
  id: string;
  label: string;
  title: readonly [string, string];
  description: string;
  detail: string;
};

type ScrollStoryProps = {
  chapters: readonly StoryChapter[];
  continueTo: string;
};

/** Compact, reversible storytelling. All chapters are included in the server HTML. */
export function ScrollStory({ chapters, continueTo }: ScrollStoryProps) {
  const instanceId = useId();
  const { trackRef, progress, activeChapter, enhanced, goToChapter } = useScrollStory({ count: chapters.length });

  return (
    <div
      ref={trackRef}
      className={styles.track}
      data-scroll-story
      style={{ "--story-travel": `${Math.max(0, chapters.length - 1) * STORY_SETTINGS.stepPx}px` } as CSSProperties}
    >
      <noscript><style>{`[data-scroll-story]{height:auto!important}[data-story-stage]{position:relative!important;height:auto!important;min-height:0!important}[data-story-chapters]{display:grid!important;gap:4rem!important}[data-story-chapter]{grid-area:auto!important;opacity:1!important;transform:none!important}[data-story-diagram],[data-story-controls]{display:none!important}`}</style></noscript>
      <div className={styles.stage} data-story-stage>
        <div className={styles.topline}>
          <span><i aria-hidden="true" /> FILOSOFIA DE ENGENHARIA</span>
          <span className={styles.scrollHint}>TRÊS PRINCÍPIOS. UMA FORMA DE CONSTRUIR. <ArrowDown size={12} aria-hidden="true" /></span>
        </div>

        <div className={styles.composition}>
          <div className={styles.chapters} data-story-chapters>
            {chapters.map((chapter, index) => (
              <Chapter
                key={chapter.id}
                chapter={chapter}
                index={index}
                count={chapters.length}
                progress={progress}
                enhanced={enhanced}
                active={activeChapter === index}
                headingId={`${instanceId}-${chapter.id}`}
              />
            ))}
          </div>
          <StoryDiagram progress={progress} enhanced={enhanced} />
        </div>

        <div className={styles.controls} data-story-controls>
          <nav className={styles.chapterNav} aria-label="Princípios de engenharia">
            {chapters.map((chapter, index) => (
              <ChapterButton
                key={chapter.id}
                chapter={chapter}
                index={index}
                count={chapters.length}
                active={activeChapter === index}
                progress={progress}
                headingId={`${instanceId}-${chapter.id}`}
                onSelect={() => goToChapter(index)}
              />
            ))}
          </nav>
          <a href={continueTo} className={styles.continue}>Continuar <ArrowDownRight size={17} aria-hidden="true" /></a>
        </div>
      </div>
    </div>
  );
}

function Chapter({ chapter, index, count, progress, enhanced, active, headingId }: {
  chapter: StoryChapter; index: number; count: number; progress: MotionValue<number>; enhanced: boolean; active: boolean; headingId: string;
}) {
  const opacity = useTransform(progress, (value) => getStoryFrame(value, index, count).opacity);
  const transform = useTransform(progress, (value) => {
    const pose = getStoryFrame(value, index, count);
    return `perspective(1100px) translate3d(0, ${pose.y}%, ${pose.z}px) rotateX(${pose.rotateX}deg) scale(${pose.scale})`;
  });
  const bodyTransform = useTransform(progress, (value) => {
    const pose = getStoryFrame(value, index, count);
    return `translate3d(0, ${pose.y * 0.6}px, 0)`;
  });

  return (
    <motion.article
      className={styles.chapter}
      data-story-chapter={index}
      data-active={active || undefined}
      aria-labelledby={headingId}
      style={enhanced ? { opacity, transform } : undefined}
    >
      <p className={styles.eyebrow}><span>0{index + 1}</span> / {chapter.label}</p>
      <h3 id={headingId} className={styles.title}>
        <span>{chapter.title[0]}</span>
        <em>{chapter.title[1]}</em>
      </h3>
      <motion.div className={styles.copy} style={enhanced ? { transform: bodyTransform } : undefined}>
        <p className={styles.description}>{chapter.description}</p>
        <p className={styles.detail}><span aria-hidden="true">↳</span> {chapter.detail}</p>
      </motion.div>
    </motion.article>
  );
}

function ChapterButton({ chapter, index, count, active, progress, headingId, onSelect }: {
  chapter: StoryChapter; index: number; count: number; active: boolean; progress: MotionValue<number>; headingId: string; onSelect: () => void;
}) {
  const scaleX = useTransform(progress, (value) => Math.max(0, Math.min(1, value * Math.max(0, count - 1) - index + 1)));
  return (
    <button type="button" className={styles.chapterButton} onClick={onSelect} aria-current={active ? "step" : undefined} aria-controls={headingId}>
      <span className={styles.buttonLabel}><span>0{index + 1}</span> {chapter.label}</span>
      <span className={styles.buttonTrack} aria-hidden="true"><motion.span style={{ scaleX }} /></span>
    </button>
  );
}

/** Three small composited planes; geometry and lighting are painted once in CSS. */
function StoryDiagram({ progress, enhanced }: { progress: MotionValue<number>; enhanced: boolean }) {
  const rotate = useTransform(progress, [0, 0.5, 1], [-12, 0, 12]);
  const coreRotate = useTransform(progress, [0, 0.5, 1], [0, 90, 180]);
  const outerTransform = useTransform(progress, [0, 0.5, 1], ["translate3d(0, 0, 0) rotate(-12deg)", "translate3d(0, -22px, 0) rotate(0deg)", "translate3d(0, -44px, 0) rotate(12deg)"]);
  const innerTransform = useTransform(progress, [0, 0.5, 1], ["translate3d(0, 0, 0) rotate(12deg)", "translate3d(0, 22px, 0) rotate(0deg)", "translate3d(0, 44px, 0) rotate(-12deg)"]);

  return (
    <div className={styles.diagram} data-story-diagram aria-hidden="true">
      <div className={styles.diagramMeta}><span>ARQUITETURA / VISTA EXPANDIDA</span><span>FIG. 02</span></div>
      <div className={styles.diagramDrawing}>
        <span className={styles.axisX} /><span className={styles.axisY} />
        <motion.div className={`${styles.plane} ${styles.outerPlane}`} style={enhanced ? { transform: outerTransform } : undefined}><span>03 / PESSOAS</span><i /></motion.div>
        <motion.div className={`${styles.plane} ${styles.middlePlane}`} style={enhanced ? { rotate } : undefined}><span>02 / SISTEMA</span><i /></motion.div>
        <motion.div className={`${styles.plane} ${styles.innerPlane}`} style={enhanced ? { transform: innerTransform } : undefined}><span>01 / DADOS</span><i /></motion.div>
        <motion.div className={styles.core} style={enhanced ? { rotate: coreRotate } : undefined}><span /><span /></motion.div>
      </div>
      <div className={styles.diagramCaption}><span className={styles.captionDot} /> DE DENTRO PARA FORA.<span className={styles.diagramCoordinate}>23° S / 47° W</span></div>
    </div>
  );
}
