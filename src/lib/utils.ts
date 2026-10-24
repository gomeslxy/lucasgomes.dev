import { clsx, type ClassValue } from "clsx";
import { useEffect, useState } from "react";

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

export const SPRING_TACTILE = {
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

export const SPRING_SOFT = {
  type: "spring",
  damping: 30,
  stiffness: 160,
  mass: 0.9,
} as const;

export function useMediaQuery(query: string, fallback = false): boolean {
  const [matches, setMatches] = useState<boolean>(fallback);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function useLocalTime(timeZone = "America/Sao_Paulo"): string {
  const [time, setTime] = useState<string>("--:--:--");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("pt-BR", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return time;
}

export function wrap(min: number, max: number, value: number): number {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}
