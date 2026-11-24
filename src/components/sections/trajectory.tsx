import { SectionLabel } from "@/components/ui/section-label";
import { TrajectoryExplorer } from "@/components/sections/trajectory-explorer";

export function Trajectory() {
  return (
    <section id="trajetoria" aria-labelledby="trajectory-title" className="relative bg-bone text-ink py-[clamp(6rem,11vw,10rem)]">
      <div className="gutter">
        <SectionLabel index="04" title="Formação & Trajetória" aside="Aprendizado e experiência" tone="light" />
        <TrajectoryExplorer />
      </div>
    </section>
  );
}
