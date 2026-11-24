import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_QUART = [0.76, 0, 0.24, 1] as const;

export const SPRING = {
  type: "spring",
  damping: 24,
  stiffness: 260,
  mass: 0.9,
} as const;

export const SPRING_MAGNETIC = {
  type: "spring",
  damping: 22,
  stiffness: 280,
  mass: 0.7,
} as const;

export const SPRING_CARD = {
  type: "spring",
  damping: 24,
  stiffness: 260,
  mass: 0.85,
} as const;

/** Reference spring for UI chrome (dock pill, sheets). */
export const SPRING_UI = {
  type: "spring",
  damping: 25,
  stiffness: 280,
  mass: 0.8,
} as const;

/** Loose follower for cursor-bound layers (lens, project preview). */
export const SPRING_FOLLOW = {
  damping: 26,
  stiffness: 170,
  mass: 0.7,
} as const;

/** easeOutExpo as a function, for imperative APIs such as Lenis.scrollTo. */
export const EASE_EXPO_FN = (t: number): number => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
