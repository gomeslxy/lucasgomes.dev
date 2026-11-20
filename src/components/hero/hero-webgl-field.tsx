"use client";

import { cancelFrame, frame, type MotionValue } from "motion/react";
import { useEffect, useRef, type RefObject } from "react";
import { markWebGLFieldReady } from "@/lib/readiness-signals";

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_scroll;
uniform float u_time;

float gridLine(vec2 coord, float stepSize, float thickness) {
  vec2 wrapped = abs(fract(coord / stepSize - 0.5) - 0.5) * stepSize;
  float dist = min(wrapped.x, wrapped.y);
  return 1.0 - smoothstep(0.0, thickness, dist);
}

float crosshairNode(vec2 coord, float stepSize, float armLen, float thickness) {
  vec2 cell = (fract(coord / stepSize + 0.5) - 0.5) * stepSize;
  float h = (1.0 - smoothstep(0.0, thickness, abs(cell.y))) * step(abs(cell.x), armLen);
  float v = (1.0 - smoothstep(0.0, thickness, abs(cell.x))) * step(abs(cell.y), armLen);
  return max(h, v);
}

void main() {
  vec2 res = max(u_resolution, vec2(1.0));
  vec2 uv = gl_FragCoord.xy / res;

  // Subtle architectural Z-tilt / foreshortening driven by scroll depth
  vec2 centered = (gl_FragCoord.xy - 0.5 * res);
  float persp = 1.0 + (uv.y - 0.5) * u_scroll * 0.22;
  vec2 latticeCoord = centered / max(0.75, persp);
  latticeCoord.y += u_scroll * 44.0;

  float cell = 72.0;
  float px = 1.15;

  // Primary lattice and secondary half-step guide hairlines
  float minorGrid = gridLine(latticeCoord, cell, px);
  float majorCross = crosshairNode(latticeCoord, cell * 2.0, 4.5, px);

  // Restrained crimson focal aperture tracking cursor coordinates
  vec2 mousePx = u_mouse * res;
  float aspect = res.x / res.y;
  vec2 delta = (gl_FragCoord.xy - mousePx) / res.y;
  delta.x *= 1.0 / max(0.85, min(1.35, aspect * 0.62));
  float dist = length(delta);

  float aperture = exp(-dist * dist * 5.5);
  float innerRing = smoothstep(0.32, 0.312, dist) * smoothstep(0.295, 0.305, dist) * 0.45;

  // Soft viewport edge vignette
  vec2 edge = smoothstep(vec2(0.0), vec2(0.18), uv) * smoothstep(vec2(1.0), vec2(0.82), uv);
  float vignette = edge.x * edge.y;

  // Palette: bone (#eaeaea) lattice + crimson (#e11d2a) aperture
  vec3 bone = vec3(0.918, 0.918, 0.918);
  vec3 crimson = vec3(0.882, 0.114, 0.165);

  float gridAlpha = minorGrid * (0.042 + aperture * 0.085);
  float crossAlpha = majorCross * (0.075 + aperture * 0.24);
  float washAlpha = aperture * 0.095 + innerRing * 0.12 + 0.01 * sin(u_time * 0.4) * aperture;

  vec3 color = bone * (gridAlpha + crossAlpha * 0.35) + crimson * (washAlpha + crossAlpha * 0.75);
  float alpha = clamp((gridAlpha + crossAlpha + washAlpha) * vignette, 0.0, 0.28);

  gl_FragColor = vec4(color, alpha);
}
`;

const FULLSCREEN_TRIANGLE = new Float32Array([-1, -1, 3, -1, -1, 3]);

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

type HeroWebGLFieldProps = {
  scrollProgress: MotionValue<number>;
  sectionRef: RefObject<HTMLElement | null>;
};

/**
 * Zero-dependency WebGL architectural coordinate lattice for the Hero backdrop.
 * Enforces strict GPU/memory hygiene: DPR <= 2 (1.5 on >2200px), RAF paused
 * when offscreen, tab-hidden, or during intro loading, and full cleanup.
 */
export function HeroWebGLField({ scrollProgress, sectionRef }: HeroWebGLFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      canvas.style.display = "none";
      markWebGLFieldReady();
      return;
    }

    let program: WebGLProgram | null = null;
    let vertexShader: WebGLShader | null = null;
    let fragmentShader: WebGLShader | null = null;
    let buffer: WebGLBuffer | null = null;
    let uResolution: WebGLUniformLocation | null = null;
    let uMouse: WebGLUniformLocation | null = null;
    let uScroll: WebGLUniformLocation | null = null;
    let uTime: WebGLUniformLocation | null = null;

    let disposed = false;
    let contextLost = false;
    let inView = true;
    let rafId: number | null = null;
    let startTime = performance.now();
    let lastTime = 0;

    let targetX = 0.68;
    let targetY = 0.58;
    let currentX = 0.68;
    let currentY = 0.58;

    const cachedBounds = { left: 0, top: 0, width: 0, height: 0, valid: false };
    let widthPx = 1;
    let heightPx = 1;

    const releaseResources = () => {
      if (!gl.isContextLost()) {
        if (buffer) {
          gl.bindBuffer(gl.ARRAY_BUFFER, null);
          gl.deleteBuffer(buffer);
        }
        if (program) {
          gl.useProgram(null);
          if (vertexShader) gl.detachShader(program, vertexShader);
          if (fragmentShader) gl.detachShader(program, fragmentShader);
          gl.deleteProgram(program);
        }
        if (vertexShader) gl.deleteShader(vertexShader);
        if (fragmentShader) gl.deleteShader(fragmentShader);
      }
      buffer = null;
      program = null;
      vertexShader = null;
      fragmentShader = null;
      uResolution = null;
      uMouse = null;
      uScroll = null;
      uTime = null;
    };

    const initPipeline = (): boolean => {
      releaseResources();
      vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
      fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
      if (!vertexShader || !fragmentShader) {
        releaseResources();
        return false;
      }

      program = gl.createProgram();
      if (!program) {
        releaseResources();
        return false;
      }

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        releaseResources();
        return false;
      }

      buffer = gl.createBuffer();
      if (!buffer) {
        releaseResources();
        return false;
      }

      const positionLoc = gl.getAttribLocation(program, "a_position");
      if (positionLoc < 0) {
        releaseResources();
        return false;
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_TRIANGLE, gl.STATIC_DRAW);

      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      uResolution = gl.getUniformLocation(program, "u_resolution");
      uMouse = gl.getUniformLocation(program, "u_mouse");
      uScroll = gl.getUniformLocation(program, "u_scroll");
      uTime = gl.getUniformLocation(program, "u_time");

      gl.useProgram(program);
      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      return true;
    };

    const updateCanvasBounds = () => {
      const rect = canvas.getBoundingClientRect();
      cachedBounds.left = rect.left;
      cachedBounds.top = rect.top;
      cachedBounds.width = rect.width;
      cachedBounds.height = rect.height;
      cachedBounds.valid = true;
    };

    const applyResize = () => {
      if (disposed || contextLost) return;
      cachedBounds.valid = false;
      const rect = canvas.getBoundingClientRect();
      const maxDpr = rect.width > 2200 ? 1.5 : 2;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      widthPx = Math.max(1, Math.round(rect.width * dpr));
      heightPx = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== widthPx || canvas.height !== heightPx) {
        canvas.width = widthPx;
        canvas.height = heightPx;
      }
      gl.viewport(0, 0, widthPx, heightPx);
      if (uResolution) gl.uniform2f(uResolution, widthPx, heightPx);
    };

    const scheduleResize = () => {
      cachedBounds.valid = false;
      frame.read(applyResize);
    };

    const isIntroLoading = () => document.documentElement.dataset.introPhase === "loading";

    const canAnimate = () => !disposed && !contextLost && inView && !document.hidden && !isIntroLoading();

    const stopLoop = () => {
      lastTime = 0;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const drawFrame = (now: number) => {
      if (!program || disposed || contextLost) return;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uMouse, currentX, currentY);
      gl.uniform1f(uScroll, scrollProgress.get());
      gl.uniform1f(uTime, (now - startTime) * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const renderFrame = (now: number) => {
      rafId = null;
      if (!canAnimate() || !program) return;

      const dt = lastTime ? Math.min(64, Math.max(0, now - lastTime)) : 16.67;
      lastTime = now;
      const alpha = 1 - Math.exp(-dt * 0.005);

      currentX += (targetX - currentX) * alpha;
      currentY += (targetY - currentY) * alpha;

      drawFrame(now);

      rafId = requestAnimationFrame(renderFrame);
    };

    const syncLoop = () => {
      if (canAnimate()) {
        if (rafId === null) {
          lastTime = 0;
          rafId = requestAnimationFrame(renderFrame);
        }
      } else {
        stopLoop();
      }
    };

    if (!initPipeline()) {
      canvas.style.display = "none";
      markWebGLFieldReady();
      return;
    }
    applyResize();
    drawFrame(startTime);
    markWebGLFieldReady();

    const invalidateBounds = () => {
      cachedBounds.valid = false;
    };

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      updateCanvasBounds();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (!cachedBounds.valid) updateCanvasBounds();
      if (!cachedBounds.width || !cachedBounds.height) return;
      const nx = Math.max(0, Math.min(1, (event.clientX - cachedBounds.left) / cachedBounds.width));
      const ny = Math.max(0, Math.min(1, (event.clientY - cachedBounds.top) / cachedBounds.height));
      targetX = nx;
      targetY = 1 - ny;
    };

    const onPointerLeave = () => {
      cachedBounds.valid = false;
      targetX = 0.68;
      targetY = 0.58;
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      stopLoop();
    };

    const onContextRestored = () => {
      contextLost = false;
      startTime = performance.now();
      if (initPipeline()) {
        applyResize();
        syncLoop();
      }
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = !!entry?.isIntersecting;
      syncLoop();
    });
    intersectionObserver.observe(section);

    const resizeObserver = new ResizeObserver(scheduleResize);
    resizeObserver.observe(canvas);

    const introObserver = new MutationObserver(syncLoop);
    introObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-intro-phase"],
    });

    section.addEventListener("pointerenter", onPointerEnter);
    section.addEventListener("pointermove", onPointerMove, { passive: true });
    section.addEventListener("pointerleave", onPointerLeave);
    section.addEventListener("pointercancel", onPointerLeave);
    window.addEventListener("scroll", invalidateBounds, { passive: true });
    document.addEventListener("visibilitychange", syncLoop);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    syncLoop();

    return () => {
      disposed = true;
      stopLoop();
      cancelFrame(applyResize);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      introObserver.disconnect();
      section.removeEventListener("pointerenter", onPointerEnter);
      section.removeEventListener("pointermove", onPointerMove);
      section.removeEventListener("pointerleave", onPointerLeave);
      section.removeEventListener("pointercancel", onPointerLeave);
      window.removeEventListener("scroll", invalidateBounds);
      document.removeEventListener("visibilitychange", syncLoop);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      releaseResources();
    };
  }, [scrollProgress, sectionRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
