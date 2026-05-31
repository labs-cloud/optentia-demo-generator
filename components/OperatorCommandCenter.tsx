"use client";

import { useState } from "react";
import { ActivityFeed } from "@/components/ActivityFeed";
import { CalendarPanel } from "@/components/CalendarPanel";
import { CapabilitiesPanel } from "@/components/CapabilitiesPanel";
import { DemoScenarioRunner } from "@/components/DemoScenarioRunner";
import { EscalationCenter } from "@/components/EscalationCenter";
import { KPICards } from "@/components/KPICards";
import { OperatorChat } from "@/components/OperatorChat";
import { PipelineBoard } from "@/components/PipelineBoard";
import { TaskBoard } from "@/components/TaskBoard";
import { UnifiedInbox } from "@/components/UnifiedInbox";
import { Badge } from "@/components/ui";
import { runSimulation } from "@/lib/simulation-engine";
import type { ActivityEvent, Client } from "@/types/demo";

export function OperatorCommandCenter({ client }: { client: Client }) {
  const [feed, setFeed] = useState<ActivityEvent[]>(client.activityFeed);
  const [demoRan, setDemoRan] = useState(false);
  const demoEventCount = demoRan ? client.demoScenario.events.length : 0;

  const runDemo = () => {
    if (demoRan) return;
    setFeed((current) => runSimulation(client, current));
    setDemoRan(true);
  };

  const addOperatorCommand = (event: ActivityEvent) => {
    setFeed((current) => [event, ...current]);
  };

  return (
    <main className="mx-auto min-h-screen max-w-[1540px] px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <header className="reveal mb-6 overflow-hidden rounded-[2rem] border border-white/10 bg-black/35 p-6 shadow-2xl shadow-black/30 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <Badge tone="border-[#c9a84c]/40 bg-[#c9a84c]/10 text-[#f0d58b]">Powered by Optentia</Badge>
              <Badge tone="border-white/15 bg-white/5 text-slate-200">{client.demoLabel}</Badge>
            </div>
            <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-white md:text-7xl">
              Operator Command Center
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-300 md:text-xl">
              Your AI Chief of Staff
            </p>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#c9a84c]">
              {client.company} / {client.industry}
            </p>
          </div>
          <div className="instrument-card min-w-[280px] rounded-3xl p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[#c9a84c]">Today at a glance</p>
            <p className="mt-3 text-3xl font-semibold text-white">{client.todaySummaryValue}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{client.todaySummaryBody}</p>
          </div>
        </div>
      </header>

      <KPICards kpis={client.kpis} />

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-6">
          <ActivityFeed feed={feed} demoEventCount={demoEventCount} />
          <PipelineBoard pipeline={client.pipeline} />
          <UnifiedInbox inbox={client.inbox} />

          <div className="grid gap-6 lg:grid-cols-2">
            <TaskBoard tasks={client.tasks} />
            <CalendarPanel appointments={client.appointments} />
          </div>

          <EscalationCenter escalations={client.escalations} />
          <CapabilitiesPanel capabilities={client.capabilities} />
        </div>

        <aside className="space-y-6 xl:sticky xl:top-5 xl:self-start">
          <DemoScenarioRunner scenario={client.demoScenario} demoRan={demoRan} onRun={runDemo} />
          <OperatorChat onCommand={addOperatorCommand} />

          <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c9a84c]">Operator principle</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{client.operatorPrincipleTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{client.operatorPrincipleBody}</p>
            <div className="mt-6 rounded-3xl border border-white/10 bg-black/25 p-4">
              <p className="text-4xl font-semibold text-white">{client.operatorPrincipleMetric}</p>
              <p className="mt-2 text-sm text-slate-300">{client.operatorPrincipleMetricDetail}</p>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
