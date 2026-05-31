import { SectionShell } from "@/components/ui";

export function CapabilitiesPanel({ capabilities }: { capabilities: string[] }) {
  return (
    <SectionShell title="What The Operator Handles" eyebrow="The work, not just the dashboard">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {capabilities.map((capability) => (
          <div key={capability} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 transition hover:-translate-y-1 hover:border-[#c9a84c]/35">
            <div className="mb-4 h-1 w-10 rounded-full bg-[#c9a84c]" />
            <p className="font-semibold text-white">{capability}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
