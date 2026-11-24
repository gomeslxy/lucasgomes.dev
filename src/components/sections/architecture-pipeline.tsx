export type PipelineNode = {
  k: string;
  title: string;
  desc: string;
};

type ArchitecturePipelineProps = {
  title: string;
  statusLabel?: string;
  nodes: readonly PipelineNode[];
  footnotes: readonly string[];
};

export function ArchitecturePipeline({
  title,
  statusLabel = "FLUXO ILUSTRATIVO",
  nodes,
  footnotes,
}: ArchitecturePipelineProps) {
  return (
    <div className="mt-12 border border-white/10 bg-coal/60">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-4 py-3 md:px-5">
        <span className="label font-mono text-[0.65rem] tracking-wider uppercase text-bone">
          {title}
        </span>
        <span className="label flex items-center gap-2 text-ash font-mono text-[0.62rem]">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-crimson" />
          {statusLabel}
        </span>
      </div>

      <ol className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {nodes.map((node, i) => (
          <li
            key={node.k}
            className="relative flex min-h-[12.5rem] flex-col justify-between gap-4 bg-[#0d0d0f] p-4 md:p-5"
          >
            <div className="flex items-center gap-2.5">
              <span className="relative z-10 flex h-3 w-3 items-center justify-center rounded-full border border-bone/40 bg-ink">
                <span className="h-1 w-1 rounded-full bg-crimson" />
              </span>
              <span className="label text-ash text-[0.62rem]">{node.k}</span>
            </div>
            <div>
              <span className="block text-base font-semibold tracking-tight text-bone leading-snug">{node.title}</span>
              <span className="mt-1.5 block text-xs leading-relaxed text-bone/70">{node.desc}</span>
            </div>
            <span className="label text-[0.62rem] text-ash font-mono">[{String(i + 1).padStart(2, "0")}]</span>
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 px-4 py-3 md:px-5">
        {footnotes.map((note) => (
          <span key={note} className="label text-[0.62rem] text-ash">
            <span className="text-crimson">+</span> {note}
          </span>
        ))}
      </div>
    </div>
  );
}
