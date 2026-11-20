/** Pure choreography. Geometry stays fixed; every animated output is composite-only. */
export type RevealPattern = "heading" | "meta" | "body" | "depth" | "row";

export function unit(value: number) {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

export function quintic(value: number) {
  const t = unit(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function sceneProgress(scroll: number, top: number, viewport: number, start = .94, end = .5) {
  const distance = Math.max(1, viewport * (start - end));
  return unit((scroll + viewport * start - top) / distance);
}

/**
 * Bidirectional viewport progress:
 * - When element is below viewport: progress = 0
 * - Entering bottom (scroll down) or exiting bottom (scroll up): progress smoothly scrubs between 0 and 1
 * - In reading viewport: progress = 1
 * - Exiting top (scroll down) or re-entering top (scroll up): progress smoothly scrubs between 1 and 0
 * - Above viewport: progress = 0
 */
export function bidirectionalSceneProgress(
  scroll: number,
  top: number,
  height: number,
  viewport: number,
  start = .94,
  end = .5,
  exitStart = .18,
  exitEnd = -.06,
) {
  const enterDistance = Math.max(1, viewport * (start - end));
  const enter = unit((scroll + viewport * start - top) / enterDistance);

  const bottom = top + Math.max(0, height);
  const bottomInView = bottom - scroll;
  const exitDistance = Math.max(1, viewport * (exitStart - exitEnd));
  const exit = unit((bottomInView - viewport * exitEnd) / exitDistance);

  return Math.min(enter, exit);
}

function normalizedRevealProgress(progress: number, delay = 0) {
  const offset = Math.min(.45, Math.max(0, delay));
  return unit((progress - offset) / (1 - offset));
}

export function revealTransform(progress: number, pattern: RevealPattern, delay = 0): string {
  const p = normalizedRevealProgress(progress, delay);
  const remaining = 1 - quintic(p);
  switch (pattern) {
    case "heading":
      return `translate3d(0, ${remaining * 108}%, 0) rotate(${remaining * 2.4}deg)`;
    case "meta":
      return `translate3d(${remaining * 12}px, 0, 0)`;
    case "body":
      return `translate3d(0, ${remaining * 22}px, 0)`;
    case "depth":
      return `perspective(1000px) translate3d(0, ${remaining * 36}px, ${remaining * -64}px) rotateX(${remaining * 4}deg)`;
    case "row":
      return `translate3d(${remaining * -28}px, 0, 0)`;
  }
}

export function revealOpacity(progress: number, pattern: RevealPattern, delay = 0): number {
  const p = normalizedRevealProgress(progress, delay);
  switch (pattern) {
    case "heading":
      return 1;
    case "meta":
      return quintic(unit(p * 1.5));
    case "body":
    case "depth":
      return quintic(p);
    case "row":
      return quintic(unit(p * 1.25));
  }
}

export function revealPose(progress: number, pattern: RevealPattern, delay = 0) {
  return {
    opacity: revealOpacity(progress, pattern, delay),
    transform: revealTransform(progress, pattern, delay),
  };
}
