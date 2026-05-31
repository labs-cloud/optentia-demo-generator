"use client";

import { useState } from "react";
import type { InboxThread } from "@/types/demo";
import { SectionShell } from "@/components/ui";

export function UnifiedInbox({ inbox }: { inbox: InboxThread[] }) {
  const [activeTab, setActiveTab] = useState(inbox[0]?.channel ?? "");
  const activeThread = inbox.find((thread) => thread.channel === activeTab) ?? inbox[0];

  return (
    <SectionShell title="Unified Inbox Preview" eyebrow="Replies, qualification, escalation">
      <div className="mb-5 flex flex-wrap gap-2">
        {inbox.map((thread) => (
          <button
            key={thread.channel}
            onClick={() => setActiveTab(thread.channel)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              activeTab === thread.channel
                ? "border-[#c9a84c]/50 bg-[#c9a84c]/15 text-white"
                : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/25"
            }`}
          >
            {thread.channel}
          </button>
        ))}
      </div>
      <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
        {activeThread?.messages.map((item) => (
          <div key={`${item.speaker}-${item.message}`} className="mb-3 last:mb-0">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#c9a84c]">{item.speaker}</p>
            <p className={`rounded-2xl border p-3 text-sm leading-6 ${
              item.speaker.includes("Operator")
                ? "border-[#c9a84c]/25 bg-[#c9a84c]/10 text-[#f8edcc]"
                : "border-white/10 bg-white/[0.055] text-slate-200"
            }`}>
              {item.message}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
