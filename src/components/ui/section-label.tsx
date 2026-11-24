import { cn } from "@/lib/utils";

type SectionLabelProps = {
  index: string;
  title: string;
  aside?: string;
  className?: string;
  tone?: "dark" | "light";
};

export function SectionLabel({ index, title, aside, className, tone = "dark" }: SectionLabelProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4",
        tone === "dark" ? "text-bone" : "text-ink",
        className,
      )}
    >
      <span className="label tabular-nums text-crimson">[{index}]</span>
      <span className="label">{title}</span>
      <span aria-hidden="true" className="hairline-dots flex-1" />
      {aside && <span className={cn("label", tone === "dark" ? "text-ash" : "text-smoke")}>{aside}</span>}
    </div>
  );
}
