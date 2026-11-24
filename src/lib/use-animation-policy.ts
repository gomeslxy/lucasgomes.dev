"use client";

import { useSyncExternalStore } from "react";

const QUERY =
  "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const subscribers = new Set<() => void>();
let media: MediaQueryList | undefined;

function getMedia() {
  return (media ??= window.matchMedia(QUERY));
}

function notify() {
  subscribers.forEach((subscriber) => subscriber());
}

function subscribe(subscriber: () => void) {
  const query = getMedia();
  if (subscribers.size === 0) query.addEventListener("change", notify);
  subscribers.add(subscriber);
  return () => {
    subscribers.delete(subscriber);
    if (subscribers.size === 0) query.removeEventListener("change", notify);
  };
}

const getSnapshot = () => getMedia().matches;
const getServerSnapshot = () => false;

/** One shared media subscription; server and first hydration render stay static. */
export function useEnhancedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
