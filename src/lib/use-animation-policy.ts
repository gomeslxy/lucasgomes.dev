"use client";

import { useSyncExternalStore } from "react";

export const ENHANCED_MOTION_QUERY =
  "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export const SPATIAL_HERO_QUERY =
  "(min-width: 900px) and (min-height: 880px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
};

function isConstrainedNetwork(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  return Boolean(conn && (conn.saveData || /^(slow-)?2g$/.test(conn.effectiveType ?? "")));
}

const getServerSnapshot = () => false;

/**
 * Factory returning a hook backed by one shared MediaQueryList subscription.
 * Server and initial hydration render remain static (`false`), and constrained
 * networks automatically fall back to light static presentation.
 */
export function createMediaQueryHook(query: string) {
  const subscribers = new Set<() => void>();
  let media: MediaQueryList | undefined;

  const getMedia = () => (media ??= window.matchMedia(query));
  const notify = () => {
    subscribers.forEach((subscriber) => subscriber());
  };

  function subscribe(subscriber: () => void) {
    const mql = getMedia();
    if (subscribers.size === 0) mql.addEventListener("change", notify);
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) mql.removeEventListener("change", notify);
    };
  }

  const getSnapshot = () => getMedia().matches && !isConstrainedNetwork();

  return function useMediaQueryPolicy(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  };
}

export const useEnhancedMotion = createMediaQueryHook(ENHANCED_MOTION_QUERY);
export const useSpatialHeroPolicy = createMediaQueryHook(SPATIAL_HERO_QUERY);
