"use client";

import { FormEvent, useMemo, useState } from "react";
import type { ActivityEvent, Appointment, Client, Escalation, InboxThread, Lead, Task } from "@/types/demo";

type View = "operator" | "leads" | "inbox" | "tasks" | "calendar" | "pipeline" | "escalations" | "reports";
type DetailRecord =
  | { type: "lead"; item: Lead }
  | { type: "conversation"; item: InboxThread }
  | { type: "task"; item: Task }
  | { type: "appointment"; item: Appointment }
  | { type: "opportunity"; item: Lead; stage: string }
  | { type: "escalation"; item: Escalation }
  | { type: "activity"; item: ActivityEvent };

interface ChatMessage {
  role: "Operator" | "You";
  text: string;
}

interface ScheduledOperatorTask {
  title: string;
  window: string;
  instructions: string;
  status: "Queued" | "Scheduled";
}

const navItems: { id: View; label: string; icon: string }[] = [
  { id: "operator", label: "Operator", icon: "O" },
  { id: "leads", label: "Leads", icon: "L" },
  { id: "inbox", label: "Inbox", icon: "I" },
  { id: "tasks", label: "Tasks", icon: "T" },
  { id: "calendar", label: "Calendar", icon: "C" },
  { id: "pipeline", label: "Pipeline", icon: "P" },
  { id: "escalations", label: "Escalations", icon: "E" },
  { id: "reports", label: "Reports", icon: "R" }
];

const questionPrompts = [
  "Who needs follow up today?",
  "Which leads are hottest?",
  "What appointments do I have today?",
  "Any deals at risk?",
  "Show pending tasks.",
  "Where did you respond today?",
  "Summarize my pipeline."
];

function allLeads(client: Client) {
  return client.pipeline.flatMap((column) => column.leads.map((lead) => ({ ...lead, stage: column.title })));
}

function findRelatedLead(task: Task, leads: Lead[]) {
  return leads.find((lead) => task.title.toLowerCase().includes(lead.name.toLowerCase().split(" ")[0])) ?? leads[0];
}

function operatorAnswer(prompt: string, client: Client) {
  const leads = allLeads(client);
  const hotLeads = leads
    .filter((lead) => lead.urgency >= 80)
    .sort((a, b) => b.urgency - a.urgency)
    .slice(0, 3);
  const pendingTasks = client.tasks.filter((task) => task.priority === "High" || task.priority === "Urgent");
  const riskItems = client.escalations.slice(0, 2);
  const channelThreads = client.inbox
    .filter((thread) => ["WhatsApp", "Telegram", "Email", "Slack", "Asana", "SMS"].includes(thread.channel))
    .map((thread) => `${thread.channel}: ${thread.messages.find((message) => message.speaker.includes("Operator"))?.message ?? "Operator response logged"}`);
  const normalized = prompt.toLowerCase();

  if (normalized.includes("follow")) {
    return `I would follow up with ${pendingTasks.map((task) => task.title.replace(/^Follow up with /, "")).slice(0, 3).join(", ")}. The most time-sensitive item is ${pendingTasks[0]?.title ?? "the next qualified lead"} because it is marked ${pendingTasks[0]?.priority ?? "High"}.`;
  }

  if (normalized.includes("hot") || normalized.includes("lead")) {
    return `The hottest leads are ${hotLeads.map((lead) => `${lead.name} (${lead.urgency}/100 urgency, ${lead.stage})`).join(", ")}. I recommend acting on ${hotLeads[0]?.name ?? "the top buyer"} first and confirming the next step: ${hotLeads[0]?.next ?? "book the appointment"}.`;
  }

  if (normalized.includes("respond") || normalized.includes("whatsapp") || normalized.includes("telegram") || normalized.includes("slack") || normalized.includes("email") || normalized.includes("asana")) {
    return `I responded or logged work across ${channelThreads.length} channels today. ${channelThreads.join(" ")} I also kept Asana updated so the operational tasks match the conversations.`;
  }

  if (normalized.includes("pipeline")) {
    return `Pipeline summary: ${client.pipeline.map((column) => `${column.title}: ${column.leads.map((lead) => lead.name).join(", ") || "none"}`).join(" | ")}. The strongest next move is ${hotLeads[0]?.next ?? "follow up with the highest urgency lead"}.`;
  }

  if (normalized.includes("appointment") || normalized.includes("calendar")) {
    return `Today's schedule has ${client.appointments.length} appointments. The key ones are ${client.appointments.map((appointment) => `${appointment.time} - ${appointment.title}`).join("; ")}. I already sent reminders where needed.`;
  }

  if (normalized.includes("risk") || normalized.includes("escalation")) {
    return `There are ${client.escalations.length} open decisions. The main risks are ${riskItems.map((item) => item.title).join(" and ")}. I prepared reply drafts so the broker can approve quickly instead of writing from scratch.`;
  }

  if (normalized.includes("task") || normalized.includes("pending")) {
    return `Pending priority tasks: ${pendingTasks.map((task) => `${task.title} due ${task.due}`).join("; ")}. I created these because they protect response time, showings, and negotiation readiness.`;
  }

  return `I can handle that. Based on the current pipeline, I will prioritize ${hotLeads[0]?.name ?? "the hottest active lead"}, keep the appointment calendar clean, update records, and escalate only if a decision needs broker judgment.`;
}

function aiLeadSummary(lead: Lead) {
  const timeline = lead.urgency >= 90 ? "within 30 days" : lead.urgency >= 75 ? "within 60 days" : "within 90 days";
  const risk = lead.urgency >= 90 ? "High" : lead.urgency >= 70 ? "Medium" : "Low";

  return {
    budget: lead.interest.includes("$") ? lead.interest : "To be confirmed",
    timeline,
    risk,
    qualification: lead.urgency >= 70 ? "Qualified" : "Nurture",
    summary: `${lead.name} is a ${lead.type.toLowerCase()} with ${lead.interest.toLowerCase()} interest. Operator recommends ${lead.next.toLowerCase()} and keeping the conversation active today.`
  };
}

function ShellButton({
  children,
  onClick,
  active = false
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl px-3 py-2.5 text-left text-sm font-medium transition ${
        active ? "bg-[#0f172a] text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      {children}
    </button>
  );
}

function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "gold" | "teal" | "danger" }) {
  const tones = {
    neutral: "border-stone-200 bg-white/80 text-slate-600",
    gold: "border-[#c9a84c]/25 bg-[#c9a84c]/10 text-[#7a6120]",
    teal: "border-[#2a7a8a]/25 bg-[#2a7a8a]/10 text-[#1f6471]",
    danger: "border-rose-200 bg-rose-50 text-rose-700"
  };

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

function RecordCard({
  title,
  meta,
  children,
  onClick
}: {
  title: string;
  meta?: string;
  children?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full rounded-3xl border border-white/60 bg-white/78 p-5 text-left shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white hover:shadow-md"
    >
      {meta ? <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{meta}</p> : null}
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      {children ? <div className="mt-3 text-sm leading-6 text-slate-600">{children}</div> : null}
      <p className="mt-4 text-sm font-semibold text-[#2a7a8a] opacity-0 transition group-hover:opacity-100">Open details</p>
    </button>
  );
}

export function OperatorCommandCenter({ client }: { client: Client }) {
  const [view, setView] = useState<View>("operator");
  const [detail, setDetail] = useState<DetailRecord | null>(null);
  const [feed, setFeed] = useState<ActivityEvent[]>(client.activityFeed);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "Operator",
      text: "I am monitoring active leads, conversations, tasks, appointments, and decisions. Ask me what needs attention and I will answer from the live workspace."
    }
  ]);
  const [actionNotice, setActionNotice] = useState("");
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledOperatorTask[]>([
    {
      title: "Overnight lead sweep",
      window: "Tonight, 11:30 PM",
      instructions: "Review every qualified lead, identify unanswered messages, and prepare morning follow-up drafts.",
      status: "Queued"
    }
  ]);
  const leads = useMemo(() => allLeads(client), [client]);

  const askOperator = (prompt: string) => {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) return;

    const answer = operatorAnswer(cleanPrompt, client);
    setMessages((current) => [...current, { role: "You", text: cleanPrompt }, { role: "Operator", text: answer }]);
    setFeed((current) => [
      {
        time: "Now",
        channel: "CRM",
        status: "Completed",
        summary: `Operator answered: ${cleanPrompt}`
      },
      ...current
    ]);
    setChatInput("");
  };

  const submitChat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    askOperator(chatInput);
  };

  const approveAction = (label: string) => {
    setActionNotice(label);
    setFeed((current) => [
      {
        time: "Now",
        channel: "CRM",
        status: "Completed",
        summary: label
      },
      ...current
    ]);
  };

  const scheduleOperatorTask = (task: ScheduledOperatorTask) => {
    setScheduledTasks((current) => [task, ...current]);
    setActionNotice(`Scheduled: ${task.title}`);
    setFeed((current) => [
      {
        time: "Now",
        channel: "Asana",
        status: "Waiting",
        summary: `Overnight Operator task scheduled: ${task.title}`
      },
      ...current
    ]);
    setMessages((current) => [
      ...current,
      { role: "You", text: `Schedule overnight task: ${task.title}` },
      {
        role: "Operator",
        text: `Scheduled for ${task.window}. I’ll handle ${task.instructions.toLowerCase()} and leave a morning summary with completed work, open questions, and any escalations.`
      }
    ]);
  };

  return (
    <main className="min-h-screen text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr_360px]">
        <aside className="border-r border-white/50 bg-white/55 p-5 backdrop-blur-xl">
          <div className="mb-10">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg font-semibold text-white">O</div>
            <h1 className="text-2xl font-semibold tracking-tight">The Operator</h1>
            <p className="mt-1 text-sm text-slate-500">Your AI Chief of Staff</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <ShellButton key={item.id} active={view === item.id} onClick={() => setView(item.id)}>
                <span className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl border border-white/60 bg-white/50 text-xs">{item.icon}</span>
                  {item.label}
                </span>
              </ShellButton>
            ))}
          </nav>

          <div className="mt-10 rounded-3xl border border-white/60 bg-white/45 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Monitoring</p>
            <p className="mt-2 font-semibold">{client.company}</p>
            <p className="mt-1 text-sm text-slate-500">{client.todaySummaryBody}</p>
          </div>
        </aside>

        <section className="min-w-0 p-5 md:p-8">
          <div className="mx-auto max-w-5xl">
            <Header view={view} />
            {actionNotice ? (
              <div className="mb-5 rounded-3xl border border-[#2a7a8a]/25 bg-[#2a7a8a]/10 px-5 py-4 text-sm font-medium text-[#1f6471]">
                {actionNotice}
              </div>
            ) : null}
            {view === "operator" ? <OperatorHome messages={messages} onAsk={askOperator} chatInput={chatInput} setChatInput={setChatInput} submitChat={submitChat} client={client} leads={leads} scheduledTasks={scheduledTasks} onScheduleTask={scheduleOperatorTask} /> : null}
            {view === "leads" ? <LeadsView leads={leads} onOpen={(lead) => setDetail({ type: "lead", item: lead })} /> : null}
            {view === "inbox" ? <InboxView inbox={client.inbox} onOpen={(thread) => setDetail({ type: "conversation", item: thread })} onAsk={askOperator} /> : null}
            {view === "tasks" ? <TasksView tasks={client.tasks} onOpen={(task) => setDetail({ type: "task", item: task })} /> : null}
            {view === "calendar" ? <CalendarView appointments={client.appointments} onOpen={(appointment) => setDetail({ type: "appointment", item: appointment })} /> : null}
            {view === "pipeline" ? <PipelineView client={client} onOpen={(lead, stage) => setDetail({ type: "opportunity", item: lead, stage })} onAsk={askOperator} /> : null}
            {view === "escalations" ? <EscalationsView escalations={client.escalations} onOpen={(escalation) => setDetail({ type: "escalation", item: escalation })} onAction={approveAction} /> : null}
            {view === "reports" ? <ReportsView client={client} leads={leads} /> : null}
          </div>
        </section>

        <aside className="border-l border-white/50 bg-white/45 p-5 backdrop-blur-xl">
          <div className="sticky top-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Live activity</p>
                <h2 className="text-lg font-semibold">Operator stream</h2>
              </div>
              <Pill tone="teal">Live</Pill>
            </div>
            <div className="space-y-3">
              {feed.map((event, index) => (
                <button
                  key={`${event.time}-${event.summary}-${index}`}
                  onClick={() => setDetail({ type: "activity", item: event })}
                  className="w-full rounded-3xl border border-white/60 bg-white/72 p-4 text-left shadow-sm backdrop-blur-xl transition hover:border-white hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-slate-400">{event.time}</p>
                    <Pill tone={event.status === "Escalated" ? "danger" : event.status === "Waiting" ? "gold" : "teal"}>{event.status}</Pill>
                  </div>
                  <p className="mt-3 text-sm font-medium leading-6">{event.summary}</p>
                  <p className="mt-2 text-xs text-slate-400">{event.channel}</p>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {detail ? <DetailDrawer detail={detail} leads={leads} onClose={() => setDetail(null)} onAction={approveAction} /> : null}
    </main>
  );
}

function Header({ view }: { view: View }) {
  const titles = {
    operator: ["Operator", "Monitoring your real estate business"],
    leads: ["Leads", "Open every lead profile, summary, risk, and next action."],
    inbox: ["Inbox", "Conversations across WhatsApp, email, SMS, and calls."],
    tasks: ["Tasks", "Work the Operator created and why it matters."],
    calendar: ["Calendar", "Appointments, reminders, notes, and preparation."],
    pipeline: ["Pipeline", "Opportunities by stage with recommended next steps."],
    escalations: ["Escalations", "Decisions that need broker judgment."],
    reports: ["Reports", "Narrative briefs and insights instead of dashboard charts."]
  };
  const [title, subtitle] = titles[view];

  return (
    <header className="mb-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c]">Powered by Optentia</p>
      <h2 className="text-5xl font-semibold tracking-[-0.04em] text-slate-950 md:text-6xl">{title}</h2>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">{subtitle}</p>
    </header>
  );
}

function OperatorHome({
  messages,
  onAsk,
  chatInput,
  setChatInput,
  submitChat,
  client,
  leads,
  scheduledTasks,
  onScheduleTask
}: {
  messages: ChatMessage[];
  onAsk: (prompt: string) => void;
  chatInput: string;
  setChatInput: (value: string) => void;
  submitChat: (event: FormEvent<HTMLFormElement>) => void;
  client: Client;
  leads: ReturnType<typeof allLeads>;
  scheduledTasks: ScheduledOperatorTask[];
  onScheduleTask: (task: ScheduledOperatorTask) => void;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/60 bg-white/76 p-5 shadow-sm backdrop-blur-xl md:p-7">
        <div className="mb-6 flex flex-wrap gap-2">
          {questionPrompts.map((prompt) => (
            <button key={prompt} onClick={() => onAsk(prompt)} className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-[#2a7a8a]/40 hover:bg-white hover:text-slate-950">
              {prompt}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`max-w-3xl rounded-3xl border p-5 ${message.role === "Operator" ? "border-white/70 bg-[#fffaf0]/72" : "ml-auto border-[#2a7a8a]/20 bg-[#2a7a8a]/10"}`}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{message.role}</p>
              <p className="text-base leading-8 text-slate-800">{message.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={submitChat} className="mt-6 flex gap-3 rounded-3xl border border-white/70 bg-white/80 p-2 shadow-sm backdrop-blur-xl">
          <input
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            placeholder="Ask the Operator what needs attention..."
            className="min-w-0 flex-1 rounded-2xl px-4 py-3 text-base outline-none placeholder:text-slate-400"
          />
          <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">Ask</button>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <QuietMetric label="People needing attention" value={String(leads.filter((lead) => lead.urgency >= 80).length)} />
        <QuietMetric label="Open broker decisions" value={String(client.escalations.length)} />
        <QuietMetric label="Appointments today" value={String(client.appointments.length)} />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <OvernightScheduler onScheduleTask={onScheduleTask} />
        <section className="rounded-[2rem] border border-white/60 bg-white/72 p-5 shadow-sm backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9a84c]">Scheduled operator work</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">Overnight queue</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Anything scheduled from the Operator panel appears here immediately, just like a real after-hours work queue.
          </p>
          <div className="mt-5 space-y-3">
            {scheduledTasks.map((task, index) => (
              <div key={`${task.title}-${task.window}-${index}`} className="rounded-3xl border border-white/70 bg-[#fffaf0]/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{task.window}</p>
                  </div>
                  <Pill tone="gold">{task.status}</Pill>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{task.instructions}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ChannelResponseMap inbox={client.inbox} />
    </div>
  );
}

function OvernightScheduler({ onScheduleTask }: { onScheduleTask: (task: ScheduledOperatorTask) => void }) {
  const [title, setTitle] = useState("Prepare morning pipeline brief");
  const [window, setWindow] = useState("Tonight, 11:30 PM");
  const [instructions, setInstructions] = useState("Review WhatsApp, Telegram, Email, Slack, and Asana. Summarize hot leads, unanswered messages, tasks due tomorrow, and escalations needing approval.");
  const [sentTask, setSentTask] = useState<ScheduledOperatorTask | null>(null);

  const scheduleTask = () => {
    const task = {
      title: title.trim() || "Untitled overnight task",
      window: window.trim() || "Tonight",
      instructions: instructions.trim() || "Review the workspace and prepare a morning summary.",
      status: "Scheduled" as const
    };

    onScheduleTask(task);
    setSentTask(task);
  };

  return (
    <section className="rounded-[2rem] border border-white/60 bg-white/76 p-5 shadow-sm backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2a7a8a]">After-hours delegation</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight">Schedule work for the Operator</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Queue a task for overnight so the broker starts tomorrow with follow-ups, pipeline notes, and escalations already prepared.
      </p>
      <div className="mt-5 space-y-3">
        <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm outline-none focus:border-[#2a7a8a]/40" />
        <input value={window} onChange={(event) => setWindow(event.target.value)} className="w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm outline-none focus:border-[#2a7a8a]/40" />
        <textarea value={instructions} onChange={(event) => setInstructions(event.target.value)} rows={4} className="w-full resize-none rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm leading-6 outline-none focus:border-[#2a7a8a]/40" />
      </div>
      {sentTask ? (
        <div className="mt-4 rounded-3xl border border-[#2a7a8a]/25 bg-[#2a7a8a]/10 p-4" aria-live="polite">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#1f6471]">Sent to Operator queue</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {sentTask.title} is scheduled for {sentTask.window}. It now appears in the Overnight queue.
              </p>
            </div>
            <Pill tone="teal">In queue</Pill>
          </div>
        </div>
      ) : null}
      <button
        onClick={scheduleTask}
        className={`mt-4 rounded-2xl px-5 py-3 text-sm font-semibold transition ${
          sentTask ? "bg-[#2a7a8a] text-white hover:bg-[#236b79]" : "bg-slate-950 text-white hover:bg-slate-800"
        }`}
      >
        {sentTask ? "Sent - In Overnight Queue" : "Send to Operator Queue"}
      </button>
    </section>
  );
}

function ChannelResponseMap({ inbox }: { inbox: InboxThread[] }) {
  const channels = ["WhatsApp", "Telegram", "Email", "Slack", "Asana", "SMS"];

  return (
    <section className="rounded-[2rem] border border-white/60 bg-white/72 p-5 shadow-sm backdrop-blur-xl">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9a84c]">Operator response map</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">Where the Operator responded</h3>
        </div>
        <Pill tone="teal">{channels.length} connected channels</Pill>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {channels.map((channel) => {
          const thread = inbox.find((item) => item.channel === channel);
          const action = thread?.messages.find((message) => message.speaker.includes("Operator Action"))?.message ?? "Ready to monitor";
          return (
            <div key={channel} className="rounded-3xl border border-white/70 bg-[#fffaf0]/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{channel}</p>
                <Pill tone={thread ? "teal" : "neutral"}>{thread ? "Active" : "Idle"}</Pill>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{action}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function QuietMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/60 bg-white/72 p-5 shadow-sm backdrop-blur-xl">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function LeadsView({ leads, onOpen }: { leads: ReturnType<typeof allLeads>; onOpen: (lead: Lead) => void }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {leads.map((lead) => {
        const profile = aiLeadSummary(lead);
        return (
          <RecordCard key={lead.name} title={lead.name} meta={`${lead.type} / ${lead.stage}`} onClick={() => onOpen(lead)}>
            <div className="flex flex-wrap gap-2">
              <Pill tone="teal">{profile.qualification}</Pill>
              <Pill tone={profile.risk === "High" ? "danger" : "gold"}>{profile.risk} risk</Pill>
            </div>
            <p className="mt-3">{profile.summary}</p>
          </RecordCard>
        );
      })}
    </div>
  );
}

function InboxView({ inbox, onOpen, onAsk }: { inbox: InboxThread[]; onOpen: (thread: InboxThread) => void; onAsk: (prompt: string) => void }) {
  return (
    <div className="space-y-5">
      <AskOperatorStrip
        title="Ask about channel responses"
        prompts={["Where did you respond today?", "Show WhatsApp and Telegram follow-ups", "What did you post in Slack and Asana?"]}
        onAsk={onAsk}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {inbox.map((thread) => (
          <RecordCard key={thread.channel} title={thread.channel} meta={`${thread.messages.length} messages`} onClick={() => onOpen(thread)}>
            <p>{thread.messages[thread.messages.length - 1]?.message}</p>
            <div className="mt-3 flex gap-2">
              <Pill tone="teal">Operator replied</Pill>
              <Pill tone="gold">Actions logged</Pill>
            </div>
          </RecordCard>
        ))}
      </div>
    </div>
  );
}

function TasksView({ tasks, onOpen }: { tasks: Task[]; onOpen: (task: Task) => void }) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <RecordCard key={task.title} title={task.title} meta={`Due ${task.due}`} onClick={() => onOpen(task)}>
          <div className="flex flex-wrap gap-2">
            <Pill tone={task.priority === "Urgent" ? "danger" : task.priority === "High" ? "gold" : "neutral"}>{task.priority}</Pill>
            <Pill>{task.assignedTo}</Pill>
          </div>
          <p className="mt-3">Created by {task.createdBy} to keep the next step from slipping.</p>
        </RecordCard>
      ))}
    </div>
  );
}

function CalendarView({ appointments, onOpen }: { appointments: Appointment[]; onOpen: (appointment: Appointment) => void }) {
  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <RecordCard key={`${appointment.time}-${appointment.title}`} title={appointment.title} meta={appointment.time} onClick={() => onOpen(appointment)}>
          <Pill tone={appointment.status.includes("Needs") ? "danger" : "teal"}>{appointment.status}</Pill>
          <p className="mt-3">Operator has reminder status, notes, and preparation ready.</p>
        </RecordCard>
      ))}
    </div>
  );
}

function PipelineView({ client, onOpen, onAsk }: { client: Client; onOpen: (lead: Lead, stage: string) => void; onAsk: (prompt: string) => void }) {
  return (
    <div className="space-y-5">
      <AskOperatorStrip
        title="Chat with the Operator about the pipeline"
        prompts={["Summarize my pipeline.", "Which pipeline stage needs attention?", "Which lead should I move next?"]}
        onAsk={onAsk}
      />
      <div className="grid gap-4 xl:grid-cols-3">
        {client.pipeline.map((column) => (
          <section key={column.title} className="rounded-[2rem] border border-white/60 bg-white/72 p-4 shadow-sm backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">{column.title}</h3>
              <Pill>{column.leads.length}</Pill>
            </div>
            <div className="space-y-3">
              {column.leads.map((lead) => (
                <button key={lead.name} onClick={() => onOpen(lead, column.title)} className="w-full rounded-2xl border border-white/70 bg-[#fffaf0]/70 p-4 text-left transition hover:border-[#2a7a8a]/30 hover:bg-white">
                  <p className="font-semibold">{lead.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{lead.interest}</p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-[#2a7a8a]" style={{ width: `${lead.urgency}%` }} />
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function AskOperatorStrip({ title, prompts, onAsk }: { title: string; prompts: string[]; onAsk: (prompt: string) => void }) {
  return (
    <section className="rounded-[2rem] border border-white/60 bg-white/76 p-5 shadow-sm backdrop-blur-xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2a7a8a]">Operator chat available here</p>
          <h3 className="mt-1 text-xl font-semibold">{title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <button key={prompt} onClick={() => onAsk(prompt)} className="rounded-full border border-white/70 bg-white/70 px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-white hover:text-slate-950">
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function EscalationsView({
  escalations,
  onOpen,
  onAction
}: {
  escalations: Escalation[];
  onOpen: (escalation: Escalation) => void;
  onAction: (label: string) => void;
}) {
  return (
    <div className="space-y-4">
      {escalations.map((escalation) => (
        <div key={escalation.title} className="rounded-[2rem] border border-white/60 bg-white/76 p-5 shadow-sm backdrop-blur-xl">
          <button onClick={() => onOpen(escalation)} className="w-full text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-500">Needs decision</p>
            <h3 className="mt-2 text-xl font-semibold">{escalation.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{escalation.why}</p>
          </button>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Approve", "Edit", "Dismiss"].map((action) => (
              <button key={action} onClick={() => onAction(`${action}: ${escalation.title}`)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${action === "Approve" ? "bg-slate-950 text-white hover:bg-slate-800" : "border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-950"}`}>
                {action}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportsView({ client, leads }: { client: Client; leads: ReturnType<typeof allLeads> }) {
  const hotLead = [...leads].sort((a, b) => b.urgency - a.urgency)[0];

  return (
    <div className="space-y-4">
      <ReportCard title="Daily Brief">
        Operator handled {client.todaySummaryValue.toLowerCase()}. The most important motion today is moving {hotLead?.name} forward while keeping seller valuation and showing follow-ups on schedule.
      </ReportCard>
      <ReportCard title="Weekly Summary">
        Lead response is healthy, with qualified buyers and sellers moving through the pipeline. The main operational theme is fast follow-up plus selective broker escalation.
      </ReportCard>
      <ReportCard title="Revenue Opportunities">
        {hotLead?.name} is the strongest near-term opportunity. Operator recommends immediate next action: {hotLead?.next}.
      </ReportCard>
      <ReportCard title="Leads Requiring Attention">
        {leads.filter((lead) => lead.urgency >= 75).map((lead) => lead.name).join(", ")} should stay on today's watchlist.
      </ReportCard>
      <ReportCard title="Upcoming Appointments">
        {client.appointments.map((appointment) => `${appointment.time} ${appointment.title}`).join("; ")}.
      </ReportCard>
      <ReportCard title="Open Escalations">
        {client.escalations.map((escalation) => escalation.title).join("; ")}.
      </ReportCard>
      <ReportCard title="Operator Insights">
        The business is not missing activity. The risk is decision latency on negotiation and seller questions. Operator is filtering those moments and preparing replies.
      </ReportCard>
    </div>
  );
}

function ReportCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-white/60 bg-white/76 p-6 shadow-sm backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9a84c]">{title}</p>
      <p className="mt-3 text-lg leading-8 text-slate-800">{children}</p>
    </section>
  );
}

function DetailDrawer({
  detail,
  leads,
  onClose,
  onAction
}: {
  detail: DetailRecord;
  leads: Lead[];
  onClose: () => void;
  onAction: (label: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-sm" onClick={onClose}>
      <aside className="ml-auto h-full w-full max-w-xl overflow-y-auto border-l border-white/60 bg-[#fffdf8]/95 p-6 shadow-2xl backdrop-blur-xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-6 flex items-center justify-between">
          <Pill tone="teal">Detail view</Pill>
          <button onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-950">Close</button>
        </div>
        <DetailContent detail={detail} leads={leads} onAction={onAction} />
      </aside>
    </div>
  );
}

function DetailContent({ detail, leads, onAction }: { detail: DetailRecord; leads: Lead[]; onAction: (label: string) => void }) {
  if (detail.type === "lead" || detail.type === "opportunity") {
    const lead = detail.item;
    const profile = aiLeadSummary(lead);
    return (
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Lead Profile</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight">{lead.name}</h2>
        <DetailGrid rows={[
          ["Lead type", lead.type],
          ["Budget", profile.budget],
          ["Property interest", lead.interest],
          ["Timeline", profile.timeline],
          ["Qualification status", profile.qualification],
          ["Risk level", profile.risk],
          ["Next recommended action", lead.next]
        ]} />
        <Narrative title="AI Summary">{profile.summary}</Narrative>
        <Narrative title="Communication History">Operator qualified the lead, logged the source as {lead.source}, and is tracking the next action inside the workspace.</Narrative>
        <Narrative title="Notes">Urgency score is {lead.urgency}/100. Keep response time short and move the next action forward today.</Narrative>
      </div>
    );
  }

  if (detail.type === "conversation") {
    return (
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Conversation</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight">{detail.item.channel}</h2>
        <div className="mt-6 space-y-3">
          {detail.item.messages.map((message) => (
            <div key={`${message.speaker}-${message.message}`} className="rounded-3xl border border-white/70 bg-[#fffaf0]/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{message.speaker}</p>
              <p className="mt-2 text-base leading-7">{message.message}</p>
            </div>
          ))}
        </div>
        <Narrative title="Operator actions">Conversation includes qualification, follow-up history, and logged next steps. The Operator is watching for buying timeline, representation status, financing readiness, and negotiation signals.</Narrative>
      </div>
    );
  }

  if (detail.type === "task") {
    const relatedLead = findRelatedLead(detail.item, leads);
    return (
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Task</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight">{detail.item.title}</h2>
        <DetailGrid rows={[
          ["Priority", detail.item.priority],
          ["Due date", detail.item.due],
          ["Assigned to", detail.item.assignedTo],
          ["Related lead", relatedLead.name],
          ["Created by", detail.item.createdBy]
        ]} />
        <Narrative title="Why Operator created it">This task protects the next step for {relatedLead.name} and prevents the opportunity from going stale.</Narrative>
        <Narrative title="Suggested next action">Complete the task, update the record, and let the Operator continue follow-up automatically.</Narrative>
      </div>
    );
  }

  if (detail.type === "appointment") {
    return (
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Appointment</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight">{detail.item.title}</h2>
        <DetailGrid rows={[
          ["Time", detail.item.time],
          ["Status", detail.item.status],
          ["Property", detail.item.title.includes(":") ? detail.item.title.split(":").at(-1)?.trim() ?? "To be confirmed" : "To be confirmed"],
          ["Reminders sent", detail.item.status === "Reminder Sent" ? "Yes" : "Scheduled"],
          ["Recommended preparation", "Review lead context, objective, and next step before the meeting."]
        ]} />
        <Narrative title="Operator notes">Operator is tracking appointment history, reminder status, and preparation context so the broker can enter the call or showing already briefed.</Narrative>
      </div>
    );
  }

  if (detail.type === "escalation") {
    return (
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose-500">Escalation</p>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight">{detail.item.title}</h2>
        <Narrative title="What happened">{detail.item.why}</Narrative>
        <Narrative title="Why Operator escalated">{detail.item.next}</Narrative>
        <Narrative title="Draft message">{detail.item.draft}</Narrative>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Approve", "Edit", "Dismiss"].map((action) => (
            <button key={action} onClick={() => onAction(`${action}: ${detail.item.title}`)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${action === "Approve" ? "bg-slate-950 text-white hover:bg-slate-800" : "border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-950"}`}>
              {action}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Activity</p>
      <h2 className="mt-3 text-4xl font-semibold tracking-tight">{detail.item.summary}</h2>
      <DetailGrid rows={[
        ["Time", detail.item.time],
        ["Channel", detail.item.channel],
        ["Status", detail.item.status],
        ["Full detail", "Operator logged the activity, updated the workspace, and kept the broker informed only when judgment was required."]
      ]} />
    </div>
  );
}

function DetailGrid({ rows }: { rows: [string, string][] }) {
  return (
    <div className="mt-6 grid gap-3">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-white/70 bg-[#fffaf0]/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
          <p className="mt-1 font-medium">{value}</p>
        </div>
      ))}
    </div>
  );
}

function Narrative({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-3xl border border-white/70 bg-white/75 p-5 shadow-sm backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9a84c]">{title}</p>
      <p className="mt-3 text-base leading-8 text-slate-700">{children}</p>
    </section>
  );
}
