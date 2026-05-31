"use client";

import { useState } from "react";
import type { ActivityEvent } from "@/types/demo";
import { Badge, MiniIcon, SectionShell, statusStyles } from "@/components/ui";

export function ActivityFeed({
  feed,
  demoEventCount
}: {
  feed: ActivityEvent[];
  demoEventCount: number;
}) {
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(null);

  return (
    <SectionShell title="Operator Activity Feed" eyebrow="Autonomous work, in sequence">
      <div className="space-y-3">
        {feed.map((event, index) => (
          <div key={`${event.time}-${event.summary}`} className="group grid gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3 transition hover:border-[#c9a84c]/35 hover:bg-white/[0.07] md:grid-cols-[82px_120px_1fr_auto] md:items-center">
            <span className="text-sm font-semibold text-slate-300">{event.time}</span>
            <div className="flex items-center gap-2">
              <MiniIcon name={event.channel} />
              <span className="text-sm text-slate-200">{event.channel}</span>
            </div>
            <div>
              <Badge tone={statusStyles[event.status]}>{event.status}</Badge>
              <p className="mt-2 text-sm text-slate-200 md:mt-0 md:inline md:pl-3">{event.summary}</p>
            </div>
            <button
              onClick={() => setSelectedEvent(event)}
              className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-[#c9a84c]/45 hover:text-white"
            >
              View Details
            </button>
            {index < demoEventCount ? <span className="hidden text-xs text-[#c9a84c] md:block">Demo event</span> : null}
          </div>
        ))}
      </div>
      {selectedEvent ? (
        <div className="mt-5 rounded-3xl border border-[#c9a84c]/25 bg-[#c9a84c]/[0.075] p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f0d58b]">Operator action detail</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{selectedEvent.summary}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Channel: {selectedEvent.channel}. Status: {selectedEvent.status}. The Operator logged the action, updated the relevant workspace, and kept the broker out of the loop unless judgment was required.
              </p>
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-white/30 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </SectionShell>
  );
}
