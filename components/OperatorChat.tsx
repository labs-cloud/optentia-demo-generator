"use client";

import { useState } from "react";
import type { ActivityEvent } from "@/types/demo";

interface ChatMessage {
  role: "Broker" | "Operator";
  text: string;
}

const quickCommands = [
  "Prioritize hot buyers",
  "Book the next showing",
  "Draft today's summary"
];

export function OperatorChat({
  onCommand
}: {
  onCommand: (event: ActivityEvent) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "Operator",
      text: "I'm online. Send me a direction and I'll turn it into action, then log the result in the activity feed."
    }
  ]);
  const [input, setInput] = useState("");

  const sendCommand = (command: string) => {
    const cleanCommand = command.trim();

    if (!cleanCommand) return;

    setMessages((current) => [
      ...current,
      { role: "Broker", text: cleanCommand },
      {
        role: "Operator",
        text: `Received. I’ll execute: ${cleanCommand}. I’ll reply to leads, update the workspace, and escalate only if judgment is needed.`
      }
    ]);
    onCommand({
      time: "Now",
      channel: "CRM",
      status: "Completed",
      summary: `Operator received direction: ${cleanCommand}`
    });
    setInput("");
  };

  return (
    <section className="rounded-[1.75rem] border border-[#2a7a8a]/30 bg-[#2a7a8a]/[0.08] p-6 shadow-2xl shadow-black/20">
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c9a84c]">Direct operator chat</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">Give the Operator a direction</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          This makes the demo feel like a real operating system: the broker can steer priorities without opening another app.
        </p>
      </div>

      <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-2xl border p-3 text-sm leading-6 ${
              message.role === "Operator"
                ? "border-[#c9a84c]/20 bg-[#c9a84c]/10 text-[#f8edcc]"
                : "border-white/10 bg-white/[0.06] text-slate-100"
            }`}
          >
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{message.role}</p>
            {message.text}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickCommands.map((command) => (
          <button
            key={command}
            onClick={() => sendCommand(command)}
            className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-[#2a7a8a]/60 hover:text-white"
          >
            {command}
          </button>
        ))}
      </div>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          sendCommand(input);
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Example: Follow up with every buyer over $800k"
          className="min-w-0 flex-1 rounded-full border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#c9a84c]/50"
        />
        <button className="rounded-full bg-[#c9a84c] px-4 py-3 text-sm font-bold text-[#071427] transition hover:bg-[#f0d58b]">
          Send
        </button>
      </form>
    </section>
  );
}
