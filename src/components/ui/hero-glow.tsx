export function HeroGlow() {
  return (
    <div
      aria-hidden="true"
      className="hero-ambient pointer-events-none absolute inset-0 select-none"
    >
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
