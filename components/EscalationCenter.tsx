"use client";

import { useState } from "react";
import type { Escalation } from "@/types/demo";
import { SectionShell } from "@/components/ui";

const decisionCopy = {
  Approve: "Approved. The Operator will send this reply and log the decision.",
  Edit: "Draft opened for editing. The Operator is waiting for revised wording.",
  Ignore: "Ignored for now. The Operator will keep monitoring the thread."
};

export function EscalationCenter({ escalations }: { escalations: Escalation[] }) {
  const [decisions, setDecisions] = useState<Record<string, string>>({});

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
            {decisions[item.title] ? (
              <p className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">
                {decisions[item.title]}
              </p>
            ) : null}
            <div className="mt-5 flex gap-2">
              {["Approve", "Edit", "Ignore"].map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    const copy = decisionCopy[action as keyof typeof decisionCopy];
                    setDecisions((current) => ({ ...current, [item.title]: copy }));
                  }}
                  className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                    action === "Approve"
                      ? "bg-[#c9a84c] text-[#071427] hover:bg-[#f0d58b]"
                      : "border border-white/10 text-slate-300 hover:border-white/30 hover:text-white"
                  }`}
                >
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
