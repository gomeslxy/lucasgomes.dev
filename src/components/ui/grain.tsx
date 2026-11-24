// A small cached image tile avoids runtime SVG filters and backdrop blending.
const STATIC_GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><path fill='white' d='M3 5h1v1H3zm14 7h1v1h-1zm18-9h1v1h-1zM8 31h1v1H8zm20-7h1v1h-1zm14 18h1v1h-1zM19 44h1v1h-1zm-6-25h1v1h-1zm27 5h1v1h-1zM1 42h1v1H1zm30-5h1v1h-1zM24 3h1v1h-1z'/><path fill='black' d='M7 14h1v1H7zm24-5h1v1h-1zm13 19h1v1h-1zM16 37h1v1h-1zm7-17h1v1h-1zm13 22h1v1h-1zM4 24h1v1H4zm22 8h1v1h-1zM39 13h1v1h-1z'/></svg>",
)}")`;

export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[80] hidden opacity-[0.025] select-none md:block motion-reduce:hidden"
      style={{ backgroundImage: STATIC_GRAIN }}
    />
  );
}
