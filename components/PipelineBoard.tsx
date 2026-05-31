import type { PipelineColumn } from "@/types/demo";
import { Badge, SectionShell, channelStyles } from "@/components/ui";

export function PipelineBoard({ pipeline }: { pipeline: PipelineColumn[] }) {
  return (
    <SectionShell title="Lead Pipeline" eyebrow="From inquiry to close">
      <div className="grid gap-3 lg:grid-cols-3 2xl:grid-cols-6">
        {pipeline.map((column) => (
          <div key={column.title} className="min-h-[250px] rounded-3xl border border-white/10 bg-black/20 p-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">{column.title}</h3>
              <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-300">{column.leads.length}</span>
            </div>
            <div className="space-y-3">
              {column.leads.map((lead) => (
                <article key={lead.name} className="rounded-2xl border border-white/10 bg-white/[0.055] p-3 transition hover:-translate-y-1 hover:border-[#c9a84c]/35">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-white">{lead.name}</h4>
                      <p className="mt-1 text-xs text-slate-400">{lead.type} - {lead.interest}</p>
                    </div>
                    <Badge tone={channelStyles[lead.source]}>{lead.source}</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="mb-1 flex justify-between text-xs text-slate-400">
                      <span>Urgency</span>
                      <span>{lead.urgency}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#c9a84c] to-white" style={{ width: `${lead.urgency}%` }} />
                    </div>
                  </div>
                  <p className="mt-4 text-xs leading-5 text-slate-300">
                    <span className="text-[#c9a84c]">Next:</span> {lead.next}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
