"use client";

import type Lenis from "lenis";
import { useEffect, useRef } from "react";

const owners = new Set<symbol>();
let previousOverflow: { value: string; priority: string } | undefined;
let runtime: { lenis: Lenis } | undefined;
const ownedStops = new WeakSet<Lenis>();

function stopOwnedRuntime(lenis: Lenis) {
  if (!lenis.isStopped) ownedStops.add(lenis);
  lenis.stop();
}

function releaseOwnedRuntime(lenis: Lenis) {
  if (!ownedStops.has(lenis)) return;
  ownedStops.delete(lenis);
  lenis.start();
}

/** Shared by navigation and the single Lenis driver; never force through a dialog. */
export function isPageScrollLocked() {
  return owners.size > 0;
}

/** The driver owns registration, so a destroyed/replaced Lenis is never restarted. */
export function registerScrollLockRuntime(lenis: Lenis) {
  const registration = { lenis };
  runtime = registration;
  if (owners.size) stopOwnedRuntime(lenis);
  else releaseOwnedRuntime(lenis);
  return () => {
    if (runtime === registration) runtime = undefined;
  };
}

/** Reference-counted locks keep nested dialogs and the intro independent. */
export function useScrollLock(active: boolean) {
  const owner = useRef(Symbol("page-scroll-lock"));

  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const token = owner.current;
    if (!owners.size) {
      previousOverflow = {
        value: root.style.getPropertyValue("overflow"),
        priority: root.style.getPropertyPriority("overflow"),
      };
      root.style.setProperty("overflow", "hidden");
      if (runtime) stopOwnedRuntime(runtime.lenis);
    }
    owners.add(token);

    return () => {
      if (!owners.delete(token)) return;
      if (owners.size) return;
      if (previousOverflow?.value) root.style.setProperty("overflow", previousOverflow.value, previousOverflow.priority);
      else root.style.removeProperty("overflow");
      previousOverflow = undefined;
      if (runtime) releaseOwnedRuntime(runtime.lenis);
    };
  }, [active]);
}
