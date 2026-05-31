import type { DemoScenario } from "@/types/demo";
import { SectionShell } from "@/components/ui";

export function DemoScenarioRunner({
  scenario,
  demoRan,
  onRun
}: {
  scenario: DemoScenario;
  demoRan: boolean;
  onRun: () => void;
}) {
  return (
    <SectionShell title={scenario.title} eyebrow={scenario.eyebrow}>
      <div className="space-y-4">
        {scenario.steps.map((step, index) => (
          <div key={step} className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#c9a84c]/35 bg-[#c9a84c]/10 font-semibold text-[#f0d58b]">{index + 1}</span>
            <p className="text-sm leading-6 text-slate-200">{step}</p>
          </div>
        ))}
      </div>
      <button
        onClick={onRun}
        className="mt-6 w-full rounded-full bg-[#c9a84c] px-5 py-3 text-sm font-bold text-[#071427] shadow-lg shadow-[#c9a84c]/20 transition hover:-translate-y-0.5 hover:bg-[#f0d58b] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={demoRan}
      >
        {demoRan ? scenario.completedLabel : scenario.buttonLabel}
      </button>
    </SectionShell>
  );
}
