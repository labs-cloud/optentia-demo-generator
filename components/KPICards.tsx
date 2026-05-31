import type { KPI } from "@/types/demo";

export function KPICards({ kpis }: { kpis: KPI[] }) {
  return (
    <section className="reveal grid gap-3 sm:grid-cols-2 xl:grid-cols-6" style={{ animationDelay: "80ms" }}>
      {kpis.map((kpi) => (
        <div key={kpi.label} className="group rounded-3xl border border-white/10 bg-white/[0.055] p-4 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-[#c9a84c]/40 hover:bg-white/[0.075]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{kpi.label}</p>
          <p className="mt-3 text-4xl font-semibold text-white">{kpi.value}</p>
          <p className="mt-2 text-sm text-[#c9a84c]">{kpi.detail}</p>
        </div>
      ))}
    </section>
  );
}
