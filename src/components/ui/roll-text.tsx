import { cn } from "@/lib/utils";

type RollTextProps = {
  text: string;
  className?: string;
};

/** Vertical text roll on parent `.group` hover — pure transform transitions. */
export function RollText({ text, className }: RollTextProps) {
  return (
    <span className={cn("relative block overflow-hidden", className)}>
      <span className="block transition-transform duration-500 ease-expo group-hover:-translate-y-full">{text}</span>
      <span
        aria-hidden="true"
        className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-expo group-hover:translate-y-0"
      >
        {text}
      </span>
    </span>
  );
}
