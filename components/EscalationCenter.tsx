import type { Escalation } from "@/types/demo";
import { SectionShell } from "@/components/ui";

export function EscalationCenter({ escalations }: { escalations: Escalation[] }) {
  return (
    <SectionShell title="Escalation Center" eyebrow="Only what needs attention">
      <div className="grid gap-4 lg:grid-cols-3">
        {escalations.map((item) => (
          <article key={item.title} className="rounded-3xl border border-[#c9a84c]/25 bg-[#c9a84c]/[0.075] p-5">
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#f0d58b]">Why escalated</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">{item.why}</p>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#f0d58b]">Recommended next move</p>
            <p className="mt-2 text-sm leading-6 text-slate-200">{item.next}</p>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#f0d58b]">Suggested reply draft</p>
            <p className="mt-2 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm leading-6 text-slate-100">"{item.draft}"</p>
            <div className="mt-5 flex gap-2">
              {["Approve", "Edit", "Ignore"].map((action) => (
                <button key={action} className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                  action === "Approve"
                    ? "bg-[#c9a84c] text-[#071427] hover:bg-[#f0d58b]"
                    : "border border-white/10 text-slate-300 hover:border-white/30 hover:text-white"
                }`}>
                  {action}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
