"use client";

/**
 * Lightweight, zero-CPU static grain overlay.
 * Uses a static base64 noise tile with mix-blend-overlay and pointer-events-none,
 * preventing continuous GPU/CPU rasterization and layout repaints during scroll.
 */
const STATIC_NOISE_SVG =
  "data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.8'/></svg>";

export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[80] overflow-hidden opacity-[0.04] mix-blend-overlay select-none"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("${STATIC_NOISE_SVG}")`,
          backgroundRepeat: "repeat",
          backgroundSize: "160px 160px",
        }}
      />
    </div>
  );
}
