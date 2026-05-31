import type { Appointment } from "@/types/demo";
import { Badge, SectionShell, statusStyles } from "@/components/ui";

export function CalendarPanel({ appointments }: { appointments: Appointment[] }) {
  return (
    <SectionShell title="Appointments & Calendar" eyebrow="Today's schedule">
      <div className="relative space-y-4 before:absolute before:left-[4.7rem] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-white/10">
        {appointments.map((appointment) => (
          <div key={`${appointment.time}-${appointment.title}`} className="relative grid grid-cols-[74px_1fr] gap-4">
            <p className="text-sm font-semibold text-[#f0d58b]">{appointment.time}</p>
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
              <h3 className="font-semibold text-white">{appointment.title}</h3>
              <div className="mt-3">
                <Badge tone={appointment.status.includes("Needs") ? statusStyles.Escalated : statusStyles.Completed}>{appointment.status}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
