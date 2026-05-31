import type { ActivityStatus, Channel } from "@/types/demo";
import type React from "react";

export const channelStyles: Record<Channel, string> = {
  WhatsApp: "border-emerald-300/25 bg-emerald-400/10 text-emerald-200",
  Email: "border-sky-300/25 bg-sky-400/10 text-sky-200",
  SMS: "border-cyan-300/25 bg-cyan-400/10 text-cyan-100",
  Asana: "border-rose-300/25 bg-rose-400/10 text-rose-100",
  Calendar: "border-amber-300/25 bg-amber-400/10 text-amber-100",
  CRM: "border-indigo-300/25 bg-indigo-400/10 text-indigo-100",
  Phone: "border-slate-300/25 bg-slate-300/10 text-slate-100",
  "Missed Calls": "border-slate-300/25 bg-slate-300/10 text-slate-100"
};

export const statusStyles: Record<ActivityStatus, string> = {
  Completed: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
  Waiting: "border-amber-300/35 bg-amber-400/10 text-amber-100",
  Escalated: "border-[#c9a84c]/45 bg-[#c9a84c]/14 text-[#f0d58b]"
};

export function MiniIcon({ name }: { name: Channel }) {
  const letter = name.slice(0, 1);

  return (
    <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${channelStyles[name]}`}>
      {letter}
    </span>
  );
}

export function Badge({ children, tone }: { children: React.ReactNode; tone: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tone}`}>
      {children}
    </span>
  );
}

export function SectionShell({
  title,
  eyebrow,
  children,
  className = ""
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`glass-card rounded-[1.75rem] p-5 md:p-6 ${className}`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#c9a84c]">{eyebrow}</p> : null}
          <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
        </div>
        <div className="mt-2 h-px w-20 hairline" />
      </div>
      {children}
    </section>
  );
}
