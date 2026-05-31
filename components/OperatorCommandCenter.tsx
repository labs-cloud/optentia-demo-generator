"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Client } from "@/types/demo";

/* ── Types ── */
type Page = "home" | "conversations" | "activity" | "schedule" | "channels" | "records" | "settings";

interface Msg {
  who: "op" | "me";
  text: string;
}

interface Toast {
  id: number;
  msg: string;
}

/* ── SVG Icons ── */
const ICONS: Record<string, string> = {
  dashboard: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
  comments: '<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 9 9 0 0 1-3.9-.9L3 21l1.9-5.6A8.4 8.4 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/>',
  activity: '<path d="M3 12h4l2.5-7 4 14 2.5-7H21"/>',
  calendar: '<path d="M4 6h16v14H4zM4 10h16M8 4v4M16 4v4"/>',
  broadcast: '<path d="M12 13v8M8 21h8M6 7.5a8 8 0 0 1 12 0M9 9.5a4 4 0 0 1 6 0M12 12.5a1 1 0 1 0 0-.01"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  gear: '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  bolt: '<path d="M13 2L3 14h7l-1 8 10-12h-7z"/>',
  file: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M12 12v6M9 15h6"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  warning: '<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18h.01"/>',
  sms: '<path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 9 9 0 0 1-3.9-.9L3 21l1.9-5.6A8.4 8.4 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/>',
  mail: '<path d="M3 5h18v14H3z"/><path d="M3 6l9 7 9-7"/>',
  phone: '<path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  whatsapp: '<path d="M4.5 19.5l1.4-4.1A7.2 7.2 0 1 1 9.6 18.6z"/><path d="M9 9.4c0 3.1 2.3 5.3 5.3 5.3.5 0 1.1-.4 1.1-.9 0-.4-1.3-1-1.6-1-.4 0-.6.6-1 .6-.7 0-2.1-1.5-2.1-2.1 0-.3.6-.6.6-1 0-.3-.6-1.6-1-1.6-.5 0-1 .6-1 1.1z"/>',
  globe: '<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><path d="M3.5 12h17M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  fax: '<path d="M7 3h10v5H7z"/><path d="M5 8h14a2 2 0 0 1 2 2v8h-4v-5H7v5H3v-8a2 2 0 0 1 2-2z"/><path d="M7 18h10v3H7z"/>',
  clock: '<path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/><path d="M12 6.5V12l3.5 2"/>',
  search: '<path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.3-4.3"/>',
  send: '<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
  check: '<path d="M20 6L9 17l-5-5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  pin: '<path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><path d="M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>',
};

function Icon({ name }: { name: string }) {
  const path = ICONS[name] || "";
  return (
    <i data-ic={name}>
      <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: path }} />
    </i>
  );
}

/* ── Static data ── */
const CHANNELS = [
  ["SMS", "sms", true, "Confirming exams · 38s avg reply", { sent: "214", reply: "38s" }],
  ["Email", "mail", true, "Intake packets to claimants", { sent: "96", reply: "4m" }],
  ["Phone", "phone", true, "2 reminder calls in progress", { sent: "31", reply: "live" }],
  ["WhatsApp", "whatsapp", true, "1 claimant thread · awaiting reply", { sent: "18", reply: "2m" }],
  ["Web Intake", "globe", false, "No new submissions in 12m", { sent: "7", reply: "—" }],
  ["Fax / Records", "fax", true, "Pulling records for 3 claims", { sent: "12", reply: "9m" }],
] as [string, string, boolean, string, { sent: string; reply: string }][];

const QUEUE = [
  ["22:00", "Send next-day reminders to 14 claimants"],
  ["23:30", "Sync confirmed exams to scheduling system"],
  ["05:00", "Chase 5 outstanding record requests"],
  ["06:30", "Compile coordinator morning brief"],
] as [string, string][];

const ACTS = [
  ["09:42:18", "CONFIRMED", "b-confirmed", "Confirmed IME with Dr. Patel (Ortho) for claim", "#RE-20481", "sms"],
  ["09:39:55", "SCHEDULED", "b-scheduled", "Booked exam — claimant J. Alvarez, Tue 10:30 AM", "#RE-20479", "mail"],
  ["09:36:40", "COLLECTED", "b-collected", "Received medical records (42 pp) for", "#RE-20455", "fax"],
  ["09:31:12", "ESCALATED", "b-escalated", "Claimant unresponsive after 3 attempts — flagged", "#RE-20460", "phone"],
  ["09:24:47", "CONFIRMED", "b-confirmed", "Reminder acknowledged by claimant", "#RE-20468", "whatsapp"],
  ["09:18:03", "RESCHEDULED", "b-rescheduled", "Moved exam — examiner conflict resolved", "#RE-20451", "mail"],
  ["09:11:29", "SENT", "b-sent", "Dispatched intake packets to 6 new claimants", "batch", "mail"],
  ["09:04:50", "SCHEDULED", "b-scheduled", "Booked neuro exam — Dr. Reyes, Thu 2:00 PM", "#RE-20472", "sms"],
  ["08:57:16", "COLLECTED", "b-collected", "Pulled imaging from provider portal for", "#RE-20444", "folder"],
  ["08:49:38", "QUEUED", "b-queued", "Queued no-show follow-up sequence — 4 claimants", "batch", "clock"],
  ["08:40:02", "CONFIRMED", "b-confirmed", "Confirmed orthopedic exam for claimant", "#RE-20438", "phone"],
  ["08:32:55", "SENT", "b-sent", "Sent appointment confirmations to 8 claimants", "batch", "mail"],
  ["08:21:17", "COLLECTED", "b-collected", "Logged returned records packet for", "#RE-20429", "fax"],
  ["08:09:44", "SCHEDULED", "b-scheduled", "Booked psych eval — Dr. Hahn, Fri 11:00 AM", "#RE-20422", "whatsapp"],
] as [string, string, string, string, string, string][];

const RECORDS = [
  ["#RE-20481", "Marcus Patel", "Orthopedic IME", "CONFIRMED", "b-confirmed", "Today 10:00"],
  ["#RE-20479", "Jordan Alvarez", "Orthopedic IME", "SCHEDULED", "b-scheduled", "Tue 10:30"],
  ["#RE-20472", "Maya Osei", "Neurological", "SCHEDULED", "b-scheduled", "Thu 14:00"],
  ["#RE-20468", "Priya Raman", "Psychological", "CONFIRMED", "b-confirmed", "Fri 09:00"],
  ["#RE-20460", "Devon Clarke", "Orthopedic IME", "ESCALATED", "b-escalated", "Unresponsive"],
  ["#RE-20455", "Sofia Lindqvist", "Records pending", "COLLECTED", "b-collected", "42 pp in"],
  ["#RE-20451", "Aaron Webb", "Neurological", "RESCHEDULED", "b-rescheduled", "Mon 13:00"],
  ["#RE-20444", "Hannah Kim", "Imaging review", "COLLECTED", "b-collected", "Imaging in"],
  ["#RE-20438", "Theo Marsh", "Orthopedic IME", "CONFIRMED", "b-confirmed", "Wed 11:30"],
] as [string, string, string, string, string, string][];

const EXAMS = [
  ["08:30", "AM", "Intake review — overnight submissions", "Operator · automated", "flat"],
  ["10:00", "AM", "IME · J. Alvarez — Dr. Patel (Ortho)", "#RE-20479 · confirmed", "accent"],
  ["11:00", "AM", "Records call — provider portal follow-up", "#RE-20455 · in progress", "flat"],
  ["12:30", "PM", "Neuro exam · M. Osei — Dr. Reyes", "#RE-20472 · confirmed", "flat"],
  ["14:00", "PM", "Coordinator sync — Dr. Patel's office", "Recurring", "flat"],
  ["15:30", "PM", "Psych eval · L. Tran — Dr. Hahn", "#RE-20422 · confirmed", "flat"],
  ["16:45", "PM", "Escalation review — unresponsive claimants", "2 flagged · needs you", "flat"],
] as [string, string, string, string, string][];

/* ── Page metadata ── */
const PAGE_META: Record<Page, [string, string]> = {
  home: ["Today · Friday May 30", "Command Center"],
  conversations: ["Live · responds instantly", "Conversations"],
  activity: ["Real-time feed", "Activity"],
  schedule: ["Friday · May 30", "Schedule"],
  channels: ["6 channels", "Channels"],
  records: ["Open claims", "Records"],
  settings: ["Workspace", "Settings"],
};

/* ── Operator reply logic ── */
function operatorReply(text: string): string {
  const t = text.toLowerCase();
  if (/(schedul|book|exam|appoint|slot)/.test(t))
    return "On it. I'll find the next open examiner slot that fits the claimant's location and specialty, book it, and send a confirmation on their preferred channel. You'll see it land in the activity log within a minute.";
  if (/(record|document|file|imaging|auth)/.test(t))
    return "I'll chase the outstanding records now — re-sending secure links to the providers and faxing the two that prefer it. Anything that comes back gets logged straight to the claim and flagged for review.";
  if (/(escalat|stuck|unrespons|no.?show|follow)/.test(t))
    return "Looking at it. I'll run one more multi-channel attempt with the alternate contact details, and if it's still quiet I'll hand it to a coordinator with the full timeline attached. No claim falls through.";
  if (/(remind|confirm|message|text|notify)/.test(t))
    return "Reminders are going out on each claimant's preferred channel, timed to their appointment. I'll watch for acknowledgements and re-send to anyone who goes quiet.";
  if (/(thank|great|perfect|nice|good job|awesome)/.test(t))
    return "Anytime. I'll keep the queue moving and surface anything that needs your judgment.";
  if (/(report|summary|brief|status|how|what)/.test(t))
    return "Here's where things stand: 27 exams scheduled in the last 24h, 88% no-show recovery, and 2 items flagged for you. Everything else is running autonomously. Want the full breakdown by channel?";
  return "Understood — I'll take it from here and update the activity log as I go. I'll only ping you if something needs a decision.";
}

/* ── Toast hook ── */
function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((msg: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2700);
  }, []);
  return { toasts, show };
}

/* ── Count-up hook ── */
function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    setValue(0);
    const t0 = performance.now();
    const dur = 1000;
    let raf: number;
    function step(t: number) {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      setValue(Math.round(target * e));
      if (k < 1) raf = requestAnimationFrame(step);
      else setValue(target);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return value;
}

/* ── Activity row ── */
function ActRow({
  row,
  isFirst,
  onToast,
}: {
  row: [string, string, string, string, string, string];
  isFirst: boolean;
  onToast: (msg: string) => void;
}) {
  const [time, label, cls, desc, ref, ico] = row;
  return (
    <button
      className={`act${isFirst ? " latest" : ""}`}
      onClick={() => onToast(ref === "batch" ? "Batch action — opening details" : "Opening " + ref)}
    >
      <span className="act-time">{time}</span>
      <span className={`badge ${cls}`}>{label}</span>
      <span className="act-desc">
        {desc} <span className="ref">{ref}</span>
      </span>
      <span className="act-chan">
        <Icon name={ico} />
      </span>
    </button>
  );
}

/* ── Schedule row ── */
function SchedRow({
  exam,
  onToast,
}: {
  exam: [string, string, string, string, string];
  onToast: (msg: string) => void;
}) {
  const [t, ap, title, sub, tone] = exam;
  return (
    <div className={`sched-row${tone === "accent" ? " accent" : ""}`} onClick={() => onToast(title)}>
      <div className="sched-time">
        {t}
        <span>{ap}</span>
      </div>
      <div>
        <div className="sched-title">{title}</div>
        <div className="sched-sub">{sub}</div>
      </div>
      <Icon name="arrow" />
    </div>
  );
}

/* ── Stat card ── */
function StatCard({
  label,
  target,
  suf,
  delta,
  gold,
  active,
  onToast,
}: {
  label: string;
  target: number;
  suf: string;
  delta: string;
  gold?: boolean;
  active: boolean;
  onToast: (msg: string) => void;
}) {
  const value = useCountUp(target, active);
  return (
    <div className={`stat${gold ? " gold" : ""}`} onClick={() => onToast(`${label}: tracking ${target}${suf}`)}>
      <div className="stat-val">
        {value}
        {value === target && suf ? <span className="u">{suf}</span> : null}
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-delta">{delta}</div>
    </div>
  );
}

/* ── Setting row ── */
function SettingRow({
  label,
  desc,
  on,
  onToggle,
}: {
  label: string;
  desc: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="set-row">
      <div>
        <div className="set-label">{label}</div>
        <div className="set-desc">{desc}</div>
      </div>
      <div className={`toggle${on ? " on" : ""}`} role="switch" onClick={onToggle} />
    </div>
  );
}

/* ── Main component ── */
export function OperatorCommandCenter({ client }: { client: Client }) {
  const [page, setPage] = useState<Page>("home");
  const [activeThread, setActiveThread] = useState("briefing");
  const [threadMessages, setThreadMessages] = useState<Record<string, Msg[]>>(() => {
    const briefingMsg = client.todaySummaryBody
      ? `Good morning, Dana. ${client.todaySummaryBody}`
      : "Good morning, Dana. Overnight I confirmed <b>11 exams</b>, recovered <b>3 no-shows</b>, and collected records on 7 claims. Two items need your eyes today.";

    const escMsg =
      client.escalations[0]
        ? `Heads up — <b>${client.escalations[0].title}</b>: ${client.escalations[0].why} ${client.escalations[0].next}`
        : "Heads up — <b>#RE-20460</b> (Devon Clarke) hasn't responded after 3 contact attempts across SMS and phone. I've paused automated outreach and flagged it for you.";

    return {
      briefing: [
        { who: "op", text: briefingMsg },
        { who: "me", text: "What still needs a human today?" },
        {
          who: "op",
          text: "Two items: one claim needs an examiner override (specialty mismatch), and a claimant asked to speak with a coordinator. Everything else is moving on its own. Want me to draft the override request?",
        },
      ],
      escalations: [
        { who: "op", text: escMsg },
        { who: "me", text: "Why did it stall?" },
        {
          who: "op",
          text: "Wrong number on the intake form, and the email bounced. I found an alternate number in the claim file. Want me to try it, or have a coordinator call directly?",
        },
      ],
      scheduling: [
        {
          who: "op",
          text: "I have 9 exams on the board for today and 14 reminders queued for tonight. Dr. Reyes opened two Thursday slots — I can pull forward the two neuro exams waiting on availability.",
        },
        { who: "me", text: "Do it, and confirm with the claimants." },
        {
          who: "op",
          text: "Done — both moved to Thursday and confirmation texts are out. I'll watch for replies and lock the slots once acknowledged.",
        },
      ],
      records: [
        {
          who: "op",
          text: "5 record requests are outstanding. I re-sent secure links to 3 providers this morning and faxed the other 2. <b>#RE-20455</b> just returned a 42-page packet — already logged to the claim.",
        },
        { who: "me", text: "Anything blocked?" },
        {
          who: "op",
          text: "One provider needs a signed authorization on file before they'll release. I've drafted the auth and queued it for your e-signature.",
        },
      ],
      alvarez: [
        {
          who: "op",
          text: "Jordan Alvarez confirmed the Tuesday 10:30 orthopedic exam with Dr. Patel and asked about parking. I sent the clinic's parking details and the intake checklist.",
        },
        { who: "me", text: "Great. Remind them the day before." },
        {
          who: "op",
          text: "Reminder is scheduled for Monday 5:00 PM via SMS — their preferred channel. I'll notify you if anything changes.",
        },
      ],
    };
  });
  const [typing, setTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [actFilter, setActFilter] = useState("all");
  const [clock, setClock] = useState("");
  const [settingsToggles, setSettingsToggles] = useState<Record<string, boolean>>({
    "Auto-confirm exams": true,
    "Auto-recover no-shows": true,
    "Auto-collect records": true,
    "Escalate before sending": false,
    "SMS reminders": true,
    WhatsApp: true,
    "After-hours autonomy": true,
    "Weekend operation": false,
    "Morning brief": true,
    "Escalation alerts": true,
    "Weekly digest": false,
  });
  const { toasts, show: showToast } = useToasts();
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Clock
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setClock(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [activeThread, threadMessages, typing]);

  const goPage = (p: Page, opts?: { thread?: string }) => {
    setPage(p);
    if (opts?.thread) setActiveThread(opts.thread);
  };

  const sendMessage = useCallback(
    (text: string) => {
      text = text.trim();
      if (!text) return;
      setThreadMessages((prev) => ({
        ...prev,
        [activeThread]: [...(prev[activeThread] || []), { who: "me" as const, text }],
      }));
      setChatInput("");
      setTyping(true);
      setTimeout(() => {
        const rep = operatorReply(text);
        setTyping(false);
        setThreadMessages((prev) => ({
          ...prev,
          [activeThread]: [...(prev[activeThread] || []), { who: "op" as const, text: rep }],
        }));
      }, 900 + Math.random() * 500);
    },
    [activeThread]
  );

  const handleAsk = (q: string) => {
    goPage("conversations", { thread: "briefing" });
    setTimeout(() => {
      if (!/open the full chat/i.test(q)) sendMessage(q);
    }, 260);
  };

  const threads = [
    { id: "briefing", name: "Operator", sub: "Daily briefing", av: "O", gold: false, time: "9:42", pin: true },
    { id: "escalations", name: "Escalations", sub: "2 items need you", av: "!", gold: true, time: "9:31", pin: false },
    { id: "scheduling", name: "Scheduling", sub: "Exam bookings", av: "S", gold: false, time: "9:18", pin: false },
    { id: "records", name: "Records requests", sub: "Provider follow-ups", av: "R", gold: false, time: "8:57", pin: false },
    { id: "alvarez", name: "J. Alvarez · #RE-20479", sub: "Claimant thread", av: "JA", gold: false, time: "8:40", pin: false },
  ];

  const threadPrompts: Record<string, string[]> = {
    escalations: ["Try the alternate number", "Hand to a coordinator", "Show the contact timeline"],
    scheduling: ["Pull forward the neuro exams", "How many reminders tonight?", "Any conflicts?"],
    records: ["What's blocked?", "Send the auth for signature", "Chase the slow providers"],
    alvarez: ["Remind them Monday", "Send parking details", "Any special instructions?"],
    briefing: ["Show me the escalations", "Draft the override request", "What's the day look like?"],
  };

  const filteredActs =
    actFilter === "all" ? ACTS : ACTS.filter((a) => a[2] === actFilter);

  const kpi0 = client.kpis[0];
  const kpi1 = client.kpis[1];
  const kpi2 = client.kpis[2];

  const stats = [
    {
      to: kpi0 ? parseInt(kpi0.value, 10) || 27 : 27,
      suf: "",
      label: kpi0?.label || "Exams scheduled · 24h",
      delta: kpi0?.detail || "+9 vs prev day",
      gold: false,
    },
    {
      to: kpi1 ? parseInt(kpi1.value, 10) || 41 : 41,
      suf: "s",
      label: kpi1?.label || "Avg response time",
      delta: kpi1?.detail || "−12s this week",
      gold: false,
    },
    {
      to: kpi2 ? parseInt(kpi2.value, 10) || 88 : 88,
      suf: "%",
      label: kpi2?.label || "No-show recovery",
      delta: kpi2?.detail || "+6 pts",
      gold: true,
    },
  ];

  const [eyebrow, tbTitle] = PAGE_META[page];

  return (
    <div className="app">
      {/* ── Sidebar ── */}
      <aside className="side">
        <div className="brand">
          <div className="brand-badge">O</div>
          <div className="brand-meta">
            <span className="brand-name">Operator</span>
            <span className="brand-status">
              <span className="pulse" />
              Running · 240h
            </span>
          </div>
        </div>
        <div className="nav-sec">Workspace</div>
        <nav className="nav">
          {(
            [
              ["home", "dashboard", "Command Center", null],
              ["conversations", "comments", "Conversations", "12"],
              ["activity", "activity", "Activity", null],
              ["schedule", "calendar", "Schedule", "9"],
              ["channels", "broadcast", "Channels", null],
              ["records", "folder", "Records", null],
            ] as [Page, string, string, string | null][]
          ).map(([pid, icon, label, cnt]) => (
            <button
              key={pid}
              className={`nav-item${page === pid ? " active" : ""}`}
              onClick={() => goPage(pid)}
            >
              <Icon name={icon} />
              <span className="lbl">{label}</span>
              {cnt ? <span className="cnt">{cnt}</span> : null}
            </button>
          ))}
        </nav>
        <div className="side-foot">
          <button
            className={`nav-item${page === "settings" ? " active" : ""}`}
            onClick={() => goPage("settings")}
          >
            <Icon name="gear" />
            <span className="lbl">Settings</span>
          </button>
          <div className="account">
            <div className="avatar">DM</div>
            <div className="account-meta">
              <span className="account-name">Dana Morales</span>
              <span className="account-co">{client.company} · Ops Lead</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="tb-title">
            <span className="tb-eyebrow">{eyebrow}</span>
            <span className="tb-h">{tbTitle}</span>
          </div>
          <div className="tb-spacer" />
          <div className="search">
            <Icon name="search" />
            <input placeholder="Search claims, threads, exams…" />
          </div>
          <span className="monitor">
            <span className="pulse" />
            MONITORING
          </span>
          <span className="clock">
            {clock}
            <span className="z"> LOCAL</span>
          </span>
        </header>

        {/* Pages */}
        <div className="view">

          {/* ── HOME ── */}
          <section className={`page${page === "home" ? " active" : ""}`}>
            <div className="cc-grid">
              {/* Left col */}
              <div className="stack">
                {/* Op preview */}
                <div className="op-prev">
                  <div className="op-prev-h">
                    <div className="op-mini">O</div>
                    <div>
                      <div className="op-prev-name">
                        Operator
                        <span>
                          <span className="pulse" style={{ display: "inline-block", width: 6, height: 6 }} />
                          &nbsp;Online · working {client.company}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="op-prev-body">
                    <div className="op-bubble">
                      Good morning, Dana. Overnight I confirmed <b>11 exams</b>, recovered <b>3 no-shows</b>, and
                      collected records on 7 claims. Two items need your eyes today.
                    </div>
                  </div>
                  <div className="op-prev-foot">
                    <button className="chip" onClick={() => handleAsk("What needs me today?")}>
                      What needs me today?
                    </button>
                    <button className="chip" onClick={() => handleAsk("Show escalations")}>
                      Show escalations
                    </button>
                    <button className="chip" onClick={() => goPage("conversations", { thread: "briefing" })}>
                      Open chat →
                    </button>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="card">
                  <div className="card-h">
                    <h2>Quick actions</h2>
                    <span className="sub">one tap</span>
                  </div>
                  <div className="qa">
                    <button
                      className="qa-btn"
                      onClick={() => showToast("Scheduling sweep started — checking examiner availability")}
                    >
                      <Icon name="bolt" />
                      Run scheduling sweep
                    </button>
                    <button className="qa-btn" onClick={() => showToast("Pulling records from 3 provider portals")}>
                      <Icon name="file" />
                      Pull records
                    </button>
                    <button className="qa-btn" onClick={() => showToast("Reminders queued for 14 claimants")}>
                      <Icon name="bell" />
                      Send reminders
                    </button>
                    <button
                      className="qa-btn gold"
                      onClick={() => goPage("conversations", { thread: "escalations" })}
                    >
                      <Icon name="warning" />
                      Review escalations
                    </button>
                  </div>
                </div>

                {/* Channel map */}
                <div className="card">
                  <div className="card-h">
                    <h2>Channel map</h2>
                    <button className="link" onClick={() => goPage("channels")}>
                      Details <Icon name="arrow" />
                    </button>
                  </div>
                  <div className="chan-grid">
                    {CHANNELS.map(([name, ico, active, note]) => (
                      <button
                        key={name as string}
                        className={`chan ${active ? "active" : "idle"}`}
                        onClick={() => goPage("channels")}
                      >
                        <div className="chan-top">
                          <span className="chan-ico">
                            <Icon name={ico as string} />
                          </span>
                          <span className="chan-name">{name}</span>
                          <span className={`chan-pill ${active ? "p-active" : "p-idle"}`}>
                            {active ? "ACTIVE" : "IDLE"}
                          </span>
                        </div>
                        <div className="chan-note">{note}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle col */}
              <div className="stack">
                <div className="stats">
                  {stats.map((s) => (
                    <StatCard
                      key={s.label}
                      label={s.label}
                      target={s.to}
                      suf={s.suf}
                      delta={s.delta}
                      gold={s.gold}
                      active={page === "home"}
                      onToast={showToast}
                    />
                  ))}
                </div>
                <div className="card">
                  <div className="card-h">
                    <h2>Live Activity</h2>
                    <span className="live-badge">
                      <span className="ld" />
                      LIVE
                    </span>
                  </div>
                  <div>
                    {ACTS.slice(0, 8).map((row, i) => (
                      <ActRow key={row[0] + i} row={row} isFirst={i === 0} onToast={showToast} />
                    ))}
                  </div>
                  <div style={{ padding: "13px 16px", borderTop: "1px solid var(--line-2)" }}>
                    <button className="link" onClick={() => goPage("activity")}>
                      View all activity <Icon name="arrow" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right col */}
              <div className="stack">
                <div className="card">
                  <div className="card-h">
                    <h2>Overnight Queue</h2>
                    <span className="q-badge">
                      <Icon name="clock" />
                      Scheduled
                    </span>
                  </div>
                  <div className="q-list">
                    {QUEUE.map(([t, d]) => (
                      <div key={t} className="q-item" onClick={() => showToast(`Queued: ${d}`)}>
                        <span className="q-time">{t}</span>
                        <span className="q-ico">
                          <Icon name="clock" />
                        </span>
                        <span className="q-desc">{d}</span>
                        <span className="badge b-queued">Queued</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-h">
                    <h2>Today&apos;s exams</h2>
                    <button className="link" onClick={() => goPage("schedule")}>
                      Schedule <Icon name="arrow" />
                    </button>
                  </div>
                  <div className="sched">
                    {EXAMS.slice(0, 4).map((exam) => (
                      <SchedRow key={exam[0] + exam[2]} exam={exam} onToast={showToast} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── CONVERSATIONS ── */}
          <section className={`page${page === "conversations" ? " active" : ""}`}>
            <div className="conv">
              <div className="thread-list">
                <div className="tl-h">
                  <h3>Conversations</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => showToast("New conversation started")}>
                    <Icon name="plus" />
                  </button>
                </div>
                <div className="tl-scroll">
                  {threads.map((t) => {
                    const msgs = threadMessages[t.id] || [];
                    const last = (msgs[msgs.length - 1]?.text || "").replace(/<[^>]+>/g, "");
                    return (
                      <button
                        key={t.id}
                        className={`thread${activeThread === t.id ? " active" : ""}`}
                        onClick={() => setActiveThread(t.id)}
                      >
                        <span className={`th-av${t.gold ? " gold" : ""}`}>{t.av}</span>
                        <span className="th-meta">
                          <span className="th-name">{t.name}</span>
                          <span className="th-last">{last}</span>
                        </span>
                        <span className="th-right">
                          <span className="th-time">{t.time}</span>
                          {t.pin ? <Icon name="pin" /> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="chatwrap">
                {(() => {
                  const t = threads.find((x) => x.id === activeThread) || threads[0];
                  return (
                    <div className="chat-h">
                      <div className="op-mini" style={{ width: 34, height: 34 }}>
                        O
                      </div>
                      <div className="chat-h-meta">
                        <div className="chat-h-name">
                          {t.name === "Operator" ? "Operator" : `Operator · ${t.name}`}
                        </div>
                        <div className="chat-h-sub">
                          <span className="pulse" style={{ width: 6, height: 6 }} />
                          {t.sub} · responds instantly
                        </div>
                      </div>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => showToast("Operator is handling this thread")}
                      >
                        <Icon name="bolt" />
                        Auto-run
                      </button>
                    </div>
                  );
                })()}

                <div className="chat-body" ref={chatBodyRef}>
                  <div className="daydiv">Today · Friday May 30</div>
                  {(threadMessages[activeThread] || []).map((m, i) =>
                    m.who === "op" ? (
                      <div key={i} className="msg op">
                        <span className="msg-av">O</span>
                        <div className="bubble" dangerouslySetInnerHTML={{ __html: m.text }} />
                      </div>
                    ) : (
                      <div key={i} className="msg me">
                        <div className="bubble">{m.text}</div>
                      </div>
                    )
                  )}
                  {typing ? (
                    <div className="msg op">
                      <span className="msg-av">O</span>
                      <div className="bubble typing">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="chat-foot">
                  <div className="chat-prompts">
                    {(threadPrompts[activeThread] || threadPrompts.briefing).map((p) => (
                      <button key={p} className="chip" onClick={() => sendMessage(p)}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <div className="chat-input">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          sendMessage(chatInput);
                        }
                      }}
                      placeholder="Message the Operator…"
                      autoComplete="off"
                    />
                    <button className="send-btn" onClick={() => sendMessage(chatInput)}>
                      <Icon name="send" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── ACTIVITY ── */}
          <section className={`page${page === "activity" ? " active" : ""}`}>
            <div className="section-head">
              <div className="filters">
                {(["all", "b-confirmed", "b-scheduled", "b-collected", "b-escalated", "b-queued"] as const).map(
                  (f) => (
                    <button
                      key={f}
                      className={`filter${actFilter === f ? " on" : ""}`}
                      onClick={() => setActFilter(f)}
                    >
                      {f === "all"
                        ? "All"
                        : (f.replace("b-", "").charAt(0).toUpperCase() + f.replace("b-", "").slice(1))}
                    </button>
                  )
                )}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => showToast("Activity log refreshed")}>
                <Icon name="refresh" />
                Refresh
              </button>
            </div>
            <div className="card">
              <div className="card-h">
                <h2>Activity log</h2>
                <span className="sub">{filteredActs.length} actions · 0 errors</span>
              </div>
              <div>
                {filteredActs.map((row, i) => (
                  <ActRow
                    key={row[0] + i}
                    row={row}
                    isFirst={i === 0 && actFilter === "all"}
                    onToast={showToast}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ── SCHEDULE ── */}
          <section className={`page${page === "schedule" ? " active" : ""}`}>
            <div className="section-head">
              <div>
                <span className="eyebrow">Friday · May 30</span>
                <div
                  style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 700, marginTop: 3 }}
                >
                  7 exams · 3 confirmed overnight
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => showToast("Opening new exam booking")}>
                <Icon name="plus" />
                Book exam
              </button>
            </div>
            <div className="card">
              <div className="sched">
                {EXAMS.map((exam) => (
                  <SchedRow key={exam[0] + exam[2]} exam={exam} onToast={showToast} />
                ))}
              </div>
            </div>
          </section>

          {/* ── CHANNELS ── */}
          <section className={`page${page === "channels" ? " active" : ""}`}>
            <div className="section-head">
              <div>
                <span className="eyebrow">Channel response map</span>
                <div
                  style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 700, marginTop: 3 }}
                >
                  5 active · 1 idle
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => showToast("Channel settings")}>
                <Icon name="gear" />
                Configure
              </button>
            </div>
            <div className="chan-detail">
              {CHANNELS.map(([name, ico, active, note, m]) => (
                <div key={name as string} className={`card chd${active ? "" : " idle"}`}>
                  <div className="chd-top">
                    <span className="chd-ico">
                      <Icon name={ico as string} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div className="chd-name">{name as string}</div>
                      <div className="chan-note" style={{ marginTop: 3 }}>
                        {note as string}
                      </div>
                    </div>
                    <span className={`chan-pill ${active ? "p-active" : "p-idle"}`}>
                      {active ? "ACTIVE" : "IDLE"}
                    </span>
                  </div>
                  <div className="chd-metrics">
                    <div className="chd-metric">
                      <div className="v">{(m as { sent: string; reply: string }).sent}</div>
                      <div className="l">Messages · today</div>
                    </div>
                    <div className="chd-metric">
                      <div className="v">{(m as { sent: string; reply: string }).reply}</div>
                      <div className="l">Avg reply</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── RECORDS ── */}
          <section className={`page${page === "records" ? " active" : ""}`}>
            <div className="bigcards">
              {(
                [
                  ["Open claims", "42", ""],
                  ["Records collected · 7d", "128", ""],
                  ["Awaiting authorization", "5", "gold"],
                ] as [string, string, string][]
              ).map(([label, v, g]) => (
                <div key={label} className={`stat${g ? " gold" : ""}`} onClick={() => showToast(label)}>
                  <div className="stat-val">{v}</div>
                  <div className="stat-label">{label}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="card-h">
                <h2>Claims &amp; records</h2>
                <span className="sub">{RECORDS.length} open claims</span>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Claim</th>
                    <th>Claimant</th>
                    <th>Exam type</th>
                    <th>Status</th>
                    <th>Next</th>
                  </tr>
                </thead>
                <tbody>
                  {RECORDS.map((r) => (
                    <tr key={r[0]} onClick={() => showToast(`Opening ${r[0]} · ${r[1]}`)}>
                      <td className="rid">{r[0]}</td>
                      <td>{r[1]}</td>
                      <td>{r[2]}</td>
                      <td>
                        <span className={`badge ${r[4]}`}>{r[3]}</span>
                      </td>
                      <td className="rid">{r[5]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── SETTINGS ── */}
          <section className={`page${page === "settings" ? " active" : ""}`}>
            <div className="set-grid">
              <div className="card">
                <div className="card-h">
                  <h2>Autonomy</h2>
                </div>
                {(
                  [
                    ["Auto-confirm exams", "Operator books and confirms without asking"],
                    ["Auto-recover no-shows", "Re-engage missed appointments automatically"],
                    ["Auto-collect records", "Chase provider records on a schedule"],
                    ["Escalate before sending", "Hold sensitive replies for your approval"],
                  ] as [string, string][]
                ).map(([label, desc]) => (
                  <SettingRow
                    key={label}
                    label={label}
                    desc={desc}
                    on={!!settingsToggles[label]}
                    onToggle={() => {
                      const wasOn = settingsToggles[label];
                      setSettingsToggles((prev) => ({ ...prev, [label]: !prev[label] }));
                      showToast(`Setting ${wasOn ? "disabled" : "enabled"}`);
                    }}
                  />
                ))}
              </div>

              <div className="card">
                <div className="card-h">
                  <h2>Channels &amp; hours</h2>
                </div>
                {(
                  [
                    ["SMS reminders", "Primary channel for claimant reminders"],
                    ["WhatsApp", "Enabled for claimants who opt in"],
                    ["After-hours autonomy", "Keep working overnight, 22:00–07:00"],
                    ["Weekend operation", "Run reduced sweeps on weekends"],
                  ] as [string, string][]
                ).map(([label, desc]) => (
                  <SettingRow
                    key={label}
                    label={label}
                    desc={desc}
                    on={!!settingsToggles[label]}
                    onToggle={() => {
                      const wasOn = settingsToggles[label];
                      setSettingsToggles((prev) => ({ ...prev, [label]: !prev[label] }));
                      showToast(`Setting ${wasOn ? "disabled" : "enabled"}`);
                    }}
                  />
                ))}
              </div>

              <div className="card">
                <div className="card-h">
                  <h2>Notifications</h2>
                </div>
                {(
                  [
                    ["Morning brief", "Daily summary at 7:00 AM"],
                    ["Escalation alerts", "Ping me when a claim needs a human"],
                    ["Weekly digest", "Performance recap every Monday"],
                  ] as [string, string][]
                ).map(([label, desc]) => (
                  <SettingRow
                    key={label}
                    label={label}
                    desc={desc}
                    on={!!settingsToggles[label]}
                    onToggle={() => {
                      const wasOn = settingsToggles[label];
                      setSettingsToggles((prev) => ({ ...prev, [label]: !prev[label] }));
                      showToast(`Setting ${wasOn ? "disabled" : "enabled"}`);
                    }}
                  />
                ))}
              </div>

              <div className="card">
                <div className="card-h">
                  <h2>Workspace</h2>
                </div>
                <div className="set-row">
                  <div>
                    <div className="set-label">Client</div>
                    <div className="set-desc">{client.company} · IME scheduling</div>
                  </div>
                  <span className="badge b-confirmed">Active</span>
                </div>
                <div className="set-row">
                  <div>
                    <div className="set-label">Connected systems</div>
                    <div className="set-desc">Scheduling, CRM, provider portal, fax</div>
                  </div>
                  <button className="link" onClick={() => showToast("Manage connections")}>
                    Manage
                  </button>
                </div>
                <div className="set-row">
                  <div>
                    <div className="set-label">Operator uptime</div>
                    <div className="set-desc">240 hours · 0 errors</div>
                  </div>
                  <span className="badge b-scheduled">Healthy</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── Toasts ── */}
      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <Icon name="check" />
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
