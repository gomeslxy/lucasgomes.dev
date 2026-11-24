"use client";

import { cancelFrame, frame, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, type FocusEvent, type PointerEvent, type ReactNode } from "react";
import { useEnhancedMotion } from "@/lib/use-animation-policy";
import { experienceConfig } from "@/lib/experience-config";
import styles from "./profile-depth.module.css";

const { pointer, spring } = experienceConfig;

/** A physical card rig, separate from the scroll camera and static banner. */
export function ProfileDepth({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bounds = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const boundsDirty = useRef(true);
  const pointerInside = useRef(false);
  const keyboardFocus = useRef(false);
  const enhanced = useEnhancedMotion();
  const reduced = useReducedMotion();
  const xTarget = useMotionValue(0);
  const yTarget = useMotionValue(0);
  const lightTarget = useMotionValue(0);
  const pressTarget = useMotionValue(0);
  const rotateX = useSpring(xTarget, spring);
  const rotateY = useSpring(yTarget, spring);
  const light = useSpring(lightTarget, spring);
  const press = useSpring(pressTarget, spring);
  const scale = useTransform(press, [0, 1], [1, .998]);
  const z = useTransform(press, [0, 1], [0, -.5]);
  const lightX = useTransform(rotateY, [-pointer.maxTiltY, pointer.maxTiltY], ["-4%", "4%"]);
  const lightY = useTransform(rotateX, [-pointer.maxTiltX, pointer.maxTiltX], ["4%", "-4%"]);
  const reflectionX = useTransform(rotateY, [-pointer.maxTiltY, pointer.maxTiltY], ["-2%", "2%"]);
  const reflectionAngle = useTransform(rotateY, [-pointer.maxTiltY, pointer.maxTiltY], [-.5, .5]);

  function showActive(active: boolean) {
    if (hostRef.current) hostRef.current.dataset.depthActive = String(active);
  }

  function returnToRest() {
    pointerInside.current = false;
    bounds.current = null;
    boundsDirty.current = true;
    xTarget.set(0);
    yTarget.set(0);
    pressTarget.set(0);
    lightTarget.set(keyboardFocus.current && enhanced && !reduced ? pointer.lightOpacity * .5 : 0);
    showActive(keyboardFocus.current);
  }

  function pointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (!enhanced || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    bounds.current = { left: rect.left + window.scrollX, top: rect.top + window.scrollY, width: rect.width, height: rect.height };
    boundsDirty.current = false;
    pointerInside.current = true;
    lightTarget.set(pointer.lightOpacity);
    showActive(true);
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!enhanced || event.pointerType !== "mouse" || !pointerInside.current) return;
    // Sticky scroll invalidates page coordinates; measure once on the next move.
    if (boundsDirty.current || !bounds.current) {
      const rect = event.currentTarget.getBoundingClientRect();
      bounds.current = { left: rect.left + window.scrollX, top: rect.top + window.scrollY, width: rect.width, height: rect.height };
      boundsDirty.current = false;
      lightTarget.set(pointer.lightOpacity);
      showActive(true);
    }
    const rect = bounds.current;
    if (!rect.width || !rect.height) return;
    const px = Math.max(-.5, Math.min(.5, (event.pageX - rect.left) / rect.width - .5));
    const py = Math.max(-.5, Math.min(.5, (event.pageY - rect.top) / rect.height - .5));
    xTarget.set(-py * pointer.maxTiltX * 2);
    yTarget.set(px * pointer.maxTiltY * 2);
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!enhanced || reduced || event.pointerType !== "mouse" || !event.isPrimary) return;
    // No preventDefault/capture: vertical touch scrolling and native links stay intact.
    keyboardFocus.current = false;
    showActive(pointerInside.current);
    pressTarget.set(1);
  }

  function releasePress() {
    pressTarget.set(0);
    if (!pointerInside.current) lightTarget.set(keyboardFocus.current && enhanced && !reduced ? pointer.lightOpacity * .5 : 0);
  }

  function focus(event: FocusEvent<HTMLDivElement>) {
    keyboardFocus.current = event.target.matches(":focus-visible");
    if (!keyboardFocus.current || !enhanced || reduced) return;
    lightTarget.set(pointer.lightOpacity * .5);
    showActive(true);
  }

  function blur(event: FocusEvent<HTMLDivElement>) {
    if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
    keyboardFocus.current = false;
    if (!pointerInside.current) { lightTarget.set(0); showActive(false); }
  }

  useEffect(() => {
    const host = hostRef.current;
    const content = contentRef.current;
    if (!host || !content) return;
    const measure = () => {
      boundsDirty.current = true;
      const surface = content.querySelector<HTMLElement>("[data-profile-surface], article");
      if (!surface) return;
      let top = 0;
      let element: HTMLElement | null = surface;
      while (element && element !== content) {
        top += element.offsetTop;
        element = element.offsetParent as HTMLElement | null;
      }
      host.style.setProperty("--depth-top", `${top}px`);
    };
    const queueMeasure = () => frame.read(measure);
    queueMeasure();
    const observer = new ResizeObserver(queueMeasure);
    observer.observe(content);
    return () => { observer.disconnect(); cancelFrame(measure); };
  }, []);

  useEffect(() => {
    if (!enhanced) return;
    const invalidate = () => {
      bounds.current = null;
      boundsDirty.current = true;
      if (xTarget.get() !== 0) xTarget.set(0);
      if (yTarget.get() !== 0) yTarget.set(0);
      if (pressTarget.get() !== 0) pressTarget.set(0);
      lightTarget.set(keyboardFocus.current ? pointer.lightOpacity * .5 : 0);
      showActive(keyboardFocus.current);
    };
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate, { passive: true });
    document.addEventListener("toggle", invalidate, true);
    return () => {
      window.removeEventListener("scroll", invalidate);
      window.removeEventListener("resize", invalidate);
      document.removeEventListener("toggle", invalidate, true);
    };
  }, [enhanced, lightTarget, pressTarget, xTarget, yTarget]);

  useEffect(() => {
    const release = () => {
      pressTarget.set(0);
      if (!pointerInside.current) lightTarget.set(keyboardFocus.current && enhanced && !reduced ? pointer.lightOpacity * .5 : 0);
    };
    const suspend = () => {
      if (!document.hidden) return;
      pointerInside.current = false;
      bounds.current = null;
      boundsDirty.current = true;
      xTarget.set(0);
      yTarget.set(0);
      lightTarget.set(0);
      pressTarget.set(0);
    };
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointercancel", release, { passive: true });
    document.addEventListener("visibilitychange", suspend);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      document.removeEventListener("visibilitychange", suspend);
    };
  }, [enhanced, lightTarget, pressTarget, reduced, xTarget, yTarget]);

  useEffect(() => {
    if (enhanced && !reduced) return;
    xTarget.set(0);
    yTarget.set(0);
    lightTarget.set(0);
    pressTarget.set(0);
    pointerInside.current = false;
    bounds.current = null;
    boundsDirty.current = true;
    showActive(false);
  }, [enhanced, reduced, xTarget, yTarget, lightTarget, pressTarget]);

  return (
    <div
      ref={hostRef}
      className={styles.host}
      data-profile-depth-host
      data-depth-mode={enhanced ? "spatial" : "compact"}
      onPointerEnter={pointerEnter}
      onPointerMove={pointerMove}
      onPointerLeave={returnToRest}
      onPointerDown={pointerDown}
      onPointerUp={releasePress}
      onPointerCancel={returnToRest}
      onFocusCapture={focus}
      onBlurCapture={blur}
    >
      <motion.div data-profile-depth className={styles.rig} style={enhanced && !reduced ? { rotateX, rotateY, scale, z } : undefined}>
        <span className={styles.chassis} aria-hidden="true" />
        <span className={styles.backplate} aria-hidden="true" />
        <div ref={contentRef} className={styles.content}>{children}</div>
        <motion.div className={styles.glass} style={{ opacity: light }} aria-hidden="true">
          <motion.span className={styles.reflection} style={{ x: reflectionX, rotateZ: reflectionAngle }} />
        </motion.div>
        <motion.div className={styles.edgeMask} style={{ opacity: light }} aria-hidden="true">
          <motion.span className={styles.edgeLight} style={{ x: lightX, y: lightY }} />
        </motion.div>
        <motion.span className={styles.lowerEdge} style={{ opacity: light }} aria-hidden="true" />
      </motion.div>
    </div>
  );
}
