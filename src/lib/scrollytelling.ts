/** Distances are CSS pixels; timings are milliseconds except settleDuration (seconds). */
export const STORY_SETTINGS = {
  stepPx: 340,
  holdRatio: 0.42,
  settleDelayMs: 160,
  settleDuration: 0.38,
  magnetRadius: 0.24,
} as const;

export type StoryFrame = {
  opacity: number;
  /** Percentage of the chapter's own height. */
  y: number;
  z: number;
  rotateX: number;
  scale: number;
};

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, Number.isNaN(value) ? min : value));
}

/** Quintic interpolation: both velocity and acceleration reach zero at each end. */
export function smootherstep(value: number): number {
  const t = clamp(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function chapterCount(count: number): number {
  return Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
}

const HIDDEN_FRAME: Readonly<StoryFrame> = {
  opacity: 0,
  y: 18,
  z: -100,
  rotateX: -5,
  scale: 0.96,
};

/**
 * Maps normalized scroll to a reversible depth transition with a reading plateau.
 * Adjacent opacity curves are complementary: their sum stays at one throughout
 * the crossfade. No timers, mutable state, or DOM measurements are involved.
 */
export function getStoryFrame(progress: number, index: number, count: number): StoryFrame {
  const chapters = chapterCount(count);
  if (!Number.isInteger(index) || index < 0 || index >= chapters) return { ...HIDDEN_FRAME };

  const distance = clamp(progress) * (chapters - 1) - index;
  const hold = STORY_SETTINGS.holdRatio / 2;
  const transition = 1 - STORY_SETTINGS.holdRatio;
  const departure = smootherstep((Math.abs(distance) - hold) / transition);
  const direction = Math.sign(distance);

  return {
    opacity: 1 - departure,
    y: -direction * 18 * departure,
    z: -100 * departure,
    rotateX: direction * 5 * departure,
    scale: 1 - 0.04 * departure,
  };
}

export function getActiveChapter(progress: number, count: number): number {
  return Math.round(clamp(progress) * Math.max(0, chapterCount(count) - 1));
}

/** Radius uses chapter units (0.24 = 24% of one chapter interval). */
export function getMagneticChapter(
  progress: number,
  count: number,
  radius: number = STORY_SETTINGS.magnetRadius,
): number | null {
  const chapters = chapterCount(count);
  if (chapters === 0) return null;
  const position = clamp(progress) * (chapters - 1);
  const nearest = getActiveChapter(progress, chapters);
  return Math.abs(position - nearest) <= clamp(radius, 0, 0.5) ? nearest : null;
}

/**
 * Completes a deliberate wheel gesture after it leaves its reading plateau.
 * The destination respects gesture direction and the chapter where it began;
 * tiny movements use only local attraction, so jitter cannot skip a chapter.
 */
export function getSettledChapter(
  progress: number,
  startProgress: number,
  count: number,
): number | null {
  const chapters = chapterCount(count);
  if (chapters === 0) return null;
  const position = clamp(progress) * (chapters - 1);
  const start = clamp(startProgress) * (chapters - 1);
  const movement = position - start;
  const hold = STORY_SETTINGS.holdRatio / 2;
  if (Math.abs(movement) < hold) return getMagneticChapter(progress, chapters);

  const startChapter = getActiveChapter(startProgress, chapters);
  const candidate = movement > 0
    ? Math.ceil(position - hold)
    : Math.floor(position + hold);
  return clamp(
    movement > 0 ? Math.max(startChapter, candidate) : Math.min(startChapter, candidate),
    0,
    chapters - 1,
  );
}
