import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

type SectionLabelProps = {
  index: string;
  title: string;
  aside?: string;
  className?: string;
  tone?: "dark" | "light";
};

export function SectionLabel({ index, title, aside, className, tone = "dark" }: SectionLabelProps) {
  return (
    <Reveal pattern="meta" className={className}
      innerClassName={cn(
        "flex items-center gap-4",
        tone === "dark" ? "text-bone" : "text-ink",
      )}
    >
      <span className="label tabular-nums text-crimson">[{index}]</span>
      <span className="label">{title}</span>
      <span aria-hidden="true" className="hairline-dots flex-1" />
      {aside && <span className={cn("label", tone === "dark" ? "text-ash" : "text-smoke")}>{aside}</span>}
    </Reveal>
  );
}
