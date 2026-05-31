"use client";

import { useState, useEffect, useRef } from "react";
import type { Client } from "@/types/demo";

/* ─── TYPES ─────────────────────────────────────────────────────────── */
type ClientId = "A" | "B";

interface Stat  { to: number; label: string; detail: string; gold?: boolean }
interface Act   { time: string; desc: string; badge: string; cls: string; ico: string; latest?: boolean }
interface Attn  { ref: string; name: string; meta1: string; meta2: string; statusCls: string; statusLabel: string; note: string; actions: string[] }
interface Esc   { title: string; body: string; rec: string; actions: string[] }
interface Chan  { name: string; ico: string; active: boolean; note: string }
interface Msg   { who: "op" | "me"; text: string }

interface ClientCfg {
  eyebrow: string; statusChip: string;
  nav: { id: string; label: string; ico: string }[];
  stats: Stat[]; chatIntro: string; prompts: string[]; seedThread: Msg[];
  acts: Act[]; attnHeader: string; attnItems: Attn[];
  escs: Esc[]; chans: Chan[];
  overnightLabel: string; overnightTask: string;
  replies: { pat: RegExp; text: string }[]; fallback: string;
  userName: string; userCo: string; userInitials: string;
}

/* ─── THEMES ─────────────────────────────────────────────────────────── */
const THEMES: Record<ClientId, Record<string, string>> = {
  A: {
    "--bg":"#F7F4EF","--bg-2":"#EDE8E0","--panel":"#FFFFFF",
    "--panel-2":"#F5F2EE","--panel-3":"#EDE9E3",
    "--line":"#DDD8CF","--line-2":"#E9E5DF",
    "--ink":"#1A1A2E","--ink-2":"#2D2D40","--ink-dim":"#7A7A8C",
    "--teal":"#1B4D3E","--teal-2":"#2E7D5E","--teal-ink":"#0F2E24","--teal-soft":"#E8F0EE",
    "--gold":"#C9A84C","--gold-soft":"#F9F2E0",
    "--success":"#1C9C57","--success-soft":"#E1F3E9",
    "--warning":"#C0761C","--warning-soft":"#F6EDDD",
    "--danger":"#CF4030","--danger-soft":"#F8E5E2",
    "--shadow-sm":"0 1px 2px rgba(26,26,46,.05)",
    "--shadow":"0 1px 2px rgba(26,26,46,.05),0 10px 26px rgba(26,26,46,.07)",
    "--shadow-lg":"0 18px 50px rgba(26,26,46,.13)",
  },
  B: {
    "--bg":"#E7EDF3","--bg-2":"#DDE5EC","--panel":"#FFFFFF",
    "--panel-2":"#F2F6FA","--panel-3":"#E9F0F6",
    "--line":"#D6E0E9","--line-2":"#E5ECF2",
    "--ink":"#152639","--ink-2":"#33485E","--ink-dim":"#6A7E91",
    "--teal":"#1E7180","--teal-2":"#2A8C9E","--teal-ink":"#135462","--teal-soft":"#E1F0F2",
    "--gold":"#A9842B","--gold-soft":"#F5EDD8",
    "--success":"#1C9C57","--success-soft":"#E1F3E9",
    "--warning":"#C0761C","--warning-soft":"#F6EDDD",
    "--danger":"#CF4030","--danger-soft":"#F8E5E2",
    "--shadow-sm":"0 1px 2px rgba(21,38,57,.05)",
    "--shadow":"0 1px 2px rgba(21,38,57,.05),0 10px 26px rgba(21,38,57,.07)",
    "--shadow-lg":"0 18px 50px rgba(21,38,57,.13)",
  },
};

/* ─── ICONS ──────────────────────────────────────────────────────────── */
const ICONS: Record<string, string> = {
  dashboard:    '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
  leads:        '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  inbox:        '<path d="M4 4h16v16H4z"/><polyline points="22,6 12,13 2,6"/>',
  tasks:        '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  calendar:     '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  pipeline:     '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  escalations:  '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  reports:      '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  orders:       '<path d="M6 2h12l4 4v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M8 10h8M8 14h8M8 6h4"/>',
  projects:     '<rect x="2" y="3" width="6" height="6"/><rect x="9" y="3" width="6" height="6"/><rect x="16" y="3" width="6" height="6"/><rect x="2" y="11" width="6" height="6"/><rect x="9" y="11" width="6" height="6"/>',
  documents:    '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  gear:         '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  send:         '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  bolt:         '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  bell:         '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  warning:      '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  clock:        '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  check:        '<polyline points="20 6 9 17 4 12"/>',
  arrow:        '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  refresh:      '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>',
  mail:         '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/>',
  phone:        '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  sms:          '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  whatsapp:     '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  globe:        '<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  doc:          '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  folder:       '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  plus:         '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  search:       '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  user:         '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  sheets:       '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>',
  keep:         '<path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/><line x1="8" y1="3" x2="8" y2="21"/>',
  team:         '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  asana:        '<circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/>',
};

function Icon({ name, size = 16 }: { name: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}
      style={{ display:"inline-block", flexShrink:0 }}
      stroke="currentColor" fill="none" strokeWidth={1.7}
      strokeLinecap="round" strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: ICONS[name] ?? "" }} />
  );
}

/* ─── COUNT-UP ───────────────────────────────────────────────────────── */
function CountUp({ to }: { to: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    setVal(0);
    let raf: number;
    const t0 = performance.now(), dur = 600;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      const ease = 1 - Math.pow(1 - k, 3);
      setVal(Math.round(to * ease));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{val}</>;
}

/* ─── CLIENT A — REAL ESTATE ────────────────────────────────────────── */
const CFG_A: ClientCfg = {
  eyebrow: "OPERATOR FOR REAL ESTATE",
  statusChip: "MONITORING PIPELINE",
  nav: [
    { id:"home",        label:"Command Center", ico:"dashboard" },
    { id:"leads",       label:"Leads",          ico:"leads" },
    { id:"inbox",       label:"Inbox",          ico:"inbox" },
    { id:"tasks",       label:"Tasks",          ico:"tasks" },
    { id:"calendar",    label:"Calendar",       ico:"calendar" },
    { id:"pipeline",    label:"Pipeline",       ico:"pipeline" },
    { id:"escalations", label:"Escalations",    ico:"escalations" },
    { id:"reports",     label:"Reports",        ico:"reports" },
  ],
  stats: [
    { to:12, label:"Active Leads",       detail:"+3 this week" },
    { to:4,  label:"Showings Today",     detail:"2 confirmed" },
    { to:3,  label:"Awaiting Follow-Up", detail:"oldest: 4 days", gold:true },
  ],
  chatIntro: "I'm managing your leads, appointments, and follow-ups. Tell me what you need or ask me about your pipeline.",
  prompts: [
    "Who needs follow-up today?",
    "Any showings confirmed?",
    "What leads came in this week?",
    "Show my pipeline.",
    "Any escalations?",
    "Who hasn't responded?",
  ],
  seedThread: [
    { who:"me", text:"Who needs follow-up today?" },
    { who:"op", text:"Sarah Klein has not responded in 4 days — budget $1.2M, pre-approval pending. Follow-up recommended within 24 hours. David Rosen confirmed tomorrow's showing at 123 Ocean Ave — high motivation, 60-day close target. Miriam Cohen requested updated comps for Bergen County — sent to queue." },
  ],
  acts: [
    { time:"8:14 AM",  desc:"New lead received — David Rosen — $850K budget — WhatsApp",   badge:"COMPLETED",  cls:"b-confirmed",  ico:"whatsapp", latest:true },
    { time:"9:02 AM",  desc:"Showing confirmed — 123 Ocean Ave — David Rosen — Email",      badge:"CONFIRMED",  cls:"b-confirmed",  ico:"mail" },
    { time:"9:45 AM",  desc:"Follow-up sent — Sarah Klein — pre-approval reminder",          badge:"SENT",       cls:"b-sent",       ico:"sms" },
    { time:"10:30 AM", desc:"Comps requested — Miriam Cohen — Bergen County",               badge:"QUEUED",     cls:"b-queued",     ico:"mail" },
    { time:"11:05 AM", desc:"Negotiation escalated — buyer requesting price reduction",      badge:"ESCALATED",  cls:"b-escalated",  ico:"phone" },
    { time:"11:48 AM", desc:"Reminder sent — tomorrow's showing — David Rosen — SMS",       badge:"SENT",       cls:"b-sent",       ico:"sms" },
    { time:"12:15 PM", desc:"Pipeline updated — 3 active deals — 1 under contract",        badge:"COMPLETED",  cls:"b-confirmed",  ico:"pipeline" },
  ],
  attnHeader: "People Needing Attention",
  attnItems: [
    { ref:"Rosen", name:"David Rosen",  meta1:"Budget: $850,000",   meta2:"Status: Showing Scheduled",    statusCls:"b-confirmed", statusLabel:"READY",  note:"Highly motivated buyer. Close target 60 days.",          actions:["Book Showing","Send Reminder"] },
    { ref:"Klein", name:"Sarah Klein",  meta1:"Budget: $1,200,000", meta2:"Status: Pre-Approval Pending", statusCls:"b-escalated", statusLabel:"URGENT", note:"Strong lead. Follow up within 24 hours.",                actions:["Follow Up","Send Comps"] },
    { ref:"Cohen", name:"Miriam Cohen", meta1:"Budget: $975,000",   meta2:"Status: Comps Requested",      statusCls:"b-queued",    statusLabel:"QUEUED", note:"Waiting on Bergen County data. No action needed yet.",   actions:["View Details"] },
  ],
  escs: [
    { title:"Negotiation Request", body:"Buyer requesting lower purchase price on 47 Maple Dr.",      rec:"Operator recommendation: Escalate to broker — pricing decision required.",          actions:["Review Now"] },
    { title:"Commission Question",  body:"Seller asking about reduced commission structure.",           rec:"Operator recommendation: Escalate to Chaim — not within Operator authority.",      actions:["Review Now"] },
  ],
  chans: [
    { name:"WhatsApp",  ico:"whatsapp", active:true,  note:"3 active threads · 2m avg" },
    { name:"SMS",       ico:"sms",      active:true,  note:"Reminders queued for 4 leads" },
    { name:"Email",     ico:"mail",     active:true,  note:"6 emails sent today" },
    { name:"Phone",     ico:"phone",    active:false, note:"No calls in progress" },
    { name:"Asana",     ico:"asana",    active:true,  note:"5 tasks updated · synced" },
  ],
  overnightLabel: "Delegate Tonight",
  overnightTask:  "Review all unresponsive leads and prepare morning follow-up drafts with suggested next steps.",
  replies: [
    { pat:/follow/i,         text:"Sarah Klein — 4 days no response, budget $1.2M. David Rosen — confirmed showing tomorrow. Miriam Cohen — comps queued. I recommend contacting Sarah first." },
    { pat:/show/i,           text:"David Rosen confirmed tomorrow's showing at 123 Ocean Ave. 2 more showings this week are pending confirmation — I'll send reminders tonight." },
    { pat:/week|came in/i,   text:"3 new leads this week: David Rosen ($850K, WhatsApp), Sarah Klein ($1.2M, referral), and Miriam Cohen ($975K, online form). All qualified and active." },
    { pat:/pipeline/i,       text:"Pipeline: 12 active leads, 3 showings scheduled, 2 offers pending, 1 under contract. Highest urgency: Sarah Klein and David Rosen." },
    { pat:/escalat/i,        text:"2 open escalations: (1) Negotiation request — buyer wants price reduction on 47 Maple Dr. (2) Commission question — seller asking about reduced rate. Both need your decision." },
    { pat:/respond|hasn.t/i, text:"Sarah Klein hasn't responded in 4 days. Two other leads haven't acknowledged last week's follow-up. I'll queue a re-engagement sequence if you'd like." },
  ],
  fallback: "I'm monitoring your pipeline. Could you be more specific? You can ask about follow-ups, showings, leads, or escalations.",
  userName:"Chaim Grossman", userCo:"Real Estate · Operator", userInitials:"CG",
};

/* ─── CLIENT B — TITLE OPERATIONS ───────────────────────────────────── */
const CFG_B: ClientCfg = {
  eyebrow: "OPERATOR FOR TITLE OPERATIONS",
  statusChip: "MONITORING ORDERS",
  nav: [
    { id:"home",        label:"Command Center", ico:"dashboard" },
    { id:"orders",      label:"Orders",         ico:"orders" },
    { id:"projects",    label:"Projects",       ico:"projects" },
    { id:"documents",   label:"Documents",      ico:"documents" },
    { id:"inbox",       label:"Inbox",          ico:"inbox" },
    { id:"tasks",       label:"Tasks",          ico:"tasks" },
    { id:"calendar",    label:"Calendar",       ico:"calendar" },
    { id:"escalations", label:"Escalations",    ico:"escalations" },
    { id:"reports",     label:"Reports",        ico:"reports" },
  ],
  stats: [
    { to:18, label:"Active Orders",   detail:"6 due today" },
    { to:3,  label:"Escalated",       detail:"Human review needed", gold:true },
    { to:5,  label:"Awaiting County", detail:"Oldest: 5 days" },
  ],
  chatIntro: "I'm tracking your active orders, document requests, and county timelines. Ask me what needs attention or pull up any order.",
  prompts: [
    "What needs attention today?",
    "Which orders are delayed?",
    "Show escalations.",
    "RE-2847 status?",
    "Any missing documents?",
    "What's due this week?",
  ],
  seedThread: [
    { who:"me", text:"What needs my attention today?" },
    { who:"op", text:"RE-2847 — Kings County records requested 2 days ago, no response. Follow-up call to clerk recommended. RE-2854 — Lien search produced a possible open judgment. Human review required before report release. RE-2858 — Recording cannot proceed. Signed authorization form missing. Request from client immediately." },
  ],
  acts: [
    { time:"8:42 AM",  desc:"New order opened — RE-2847 — Full Title Search 40yr — ABC Title", badge:"COMPLETED",  cls:"b-confirmed",  ico:"orders", latest:true },
    { time:"9:05 AM",  desc:"County request submitted — Kings County — RE-2847",               badge:"WAITING",    cls:"b-scheduled",  ico:"doc" },
    { time:"9:31 AM",  desc:"Certified copy retrieved + verified — RE-2851",                   badge:"COMPLETED",  cls:"b-confirmed",  ico:"doc" },
    { time:"10:04 AM", desc:"Status update sent to client — RE-2851 — Goldman Law PLLC",       badge:"SENT",       cls:"b-sent",       ico:"mail" },
    { time:"10:37 AM", desc:"Possible judgment detected — RE-2854 — Flatbush Closing Group",   badge:"ESCALATED",  cls:"b-escalated",  ico:"warning" },
    { time:"11:16 AM", desc:"Recording deadline approaching — RE-2858",                        badge:"WAITING",    cls:"b-scheduled",  ico:"clock" },
    { time:"11:42 AM", desc:"Internal note — missing authorization required — RE-2858",        badge:"QUEUED",     cls:"b-queued",     ico:"doc" },
    { time:"12:08 PM", desc:"Delivery prepared — certified copy package — RE-2851",            badge:"COMPLETED",  cls:"b-confirmed",  ico:"folder" },
  ],
  attnHeader: "Orders Needing Attention",
  attnItems: [
    { ref:"RE-2847", name:"RE-2847", meta1:"Client: ABC Title Agency · Full Title Search 40yr",    meta2:"Property: 1457 Ocean Parkway · Awaiting County Records",   statusCls:"b-scheduled", statusLabel:"WAITING", note:"County request submitted 2 days ago. Follow-up recommended.",      actions:["Follow Up County","Notify Client"] },
    { ref:"RE-2851", name:"RE-2851", meta1:"Client: Goldman Law PLLC · Certified Copy Request",   meta2:"Status: Ready for Delivery",                                statusCls:"b-confirmed", statusLabel:"READY",   note:"Certified copy received and verified. Ready to send.",           actions:["Deliver","View Doc"] },
    { ref:"RE-2854", name:"RE-2854", meta1:"Client: Flatbush Closing Group · Lien Search",        meta2:"Status: Escalated — Possible Judgment",                     statusCls:"b-escalated", statusLabel:"URGENT",  note:"Open judgment detected. Do not release report without review.",  actions:["Review Now"] },
  ],
  escs: [
    { title:"County Non-Response — RE-2847", body:"No reply from Kings County after 5 business days.",          rec:"Recommendation: Call clerk directly and notify client of delay.",     actions:["Call County","Notify Client"] },
    { title:"Missing Authorization — RE-2858", body:"Recording blocked. No signed authorization on file.",       rec:"Recommendation: Request signed form from client immediately.",         actions:["Request Form"] },
    { title:"Possible Judgment — RE-2854",   body:"Lien search match requires attorney review before delivery.", rec:"Recommendation: Hold report and escalate to examiner.",               actions:["Escalate"] },
  ],
  chans: [
    { name:"WhatsApp",       ico:"whatsapp", active:true,  note:"1 client thread · awaiting reply" },
    { name:"Email",          ico:"mail",     active:true,  note:"Status updates to 3 clients" },
    { name:"Google Sheets",  ico:"sheets",   active:true,  note:"Order tracker synced · 5m ago" },
    { name:"Google Keep",    ico:"keep",     active:false, note:"No new notes today" },
    { name:"Team Messaging", ico:"team",     active:true,  note:"2 internal threads active" },
  ],
  overnightLabel: "Overnight Sweep",
  overnightTask:  "Chase 5 outstanding county requests, re-send authorization form requests, and compile the morning order digest.",
  replies: [
    { pat:/attention|needs/i, text:"RE-2847 — County follow-up overdue. RE-2854 — Judgment detected, human review required. RE-2858 — Authorization missing, blocks recording. These three need action today." },
    { pat:/delay/i,           text:"RE-2847 is the most delayed — Kings County request is now 5 days old with no response. RE-2860 is behind on Surrogates Court documents." },
    { pat:/escalat/i,         text:"3 escalations: (1) County non-response on RE-2847. (2) Missing authorization on RE-2858. (3) Possible open judgment on RE-2854. All require your decision before I can proceed." },
    { pat:/2847/i,            text:"RE-2847 — Full Title Search 40yr for ABC Title Agency at 1457 Ocean Parkway. County request submitted to Kings County 2 days ago, no clerk response yet. Follow-up call recommended today." },
    { pat:/document|missing/i,text:"RE-2858 needs a signed authorization form before recording can proceed. RE-2847 is waiting on Kings County for the actual document return. I've flagged both for follow-up." },
    { pat:/due|week/i,        text:"This week: RE-2858 recording deadline is Friday. RE-2851 delivery is ready today. RE-2847 county follow-up is overdue. RE-2860 Surrogates Court deadline is Thursday." },
  ],
  fallback: "I'm monitoring your orders. Could you be more specific? You can ask about delayed orders, escalations, missing documents, or a specific order number.",
  userName:"Lazer Grossman", userCo:"Rapid Examiners · Operator", userInitials:"LG",
};

const CFGS: Record<ClientId, ClientCfg> = { A: CFG_A, B: CFG_B };

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────── */
export function OperatorCommandCenter({ client }: { client: Client }) {
  const initId: ClientId = client.slug === "lazer" ? "B" : "A";
  const [cid, setCid]       = useState<ClientId>(initId);
  const [fading, setFading] = useState(false);
  const [clock, setClock]   = useState("");
  const [msgs, setMsgs]     = useState<Msg[]>(CFGS[initId].seedThread);
  const [input, setInput]   = useState("");
  const [typing, setTyping] = useState(false);
  const [toasts, setToasts] = useState<{id:number; msg:string}[]>([]);
  const chatRef             = useRef<HTMLDivElement>(null);

  const cfg   = CFGS[cid];
  const theme = THEMES[cid];

  /* live clock */
  useEffect(() => {
    const tick = () => {
      const d = new Date(), p = (n:number) => String(n).padStart(2,"0");
      setClock(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* reset chat thread on client switch */
  useEffect(() => {
    setMsgs(CFGS[cid].seedThread);
    setInput("");
    setTyping(false);
  }, [cid]);

  /* keep chat scrolled to bottom */
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, typing]);

  /* client toggle — 150 ms fade out → swap → fade in */
  const switchClient = (id: ClientId) => {
    if (id === cid) return;
    setFading(true);
    setTimeout(() => { setCid(id); setFading(false); }, 150);
  };

  /* toast helper */
  const toast = (msg: string) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2700);
  };

  /* chat send */
  const send = (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    setMsgs(m => [...m, { who:"me", text:t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = cfg.replies.find(r => r.pat.test(t))?.text ?? cfg.fallback;
      setMsgs(m => [...m, { who:"op", text:reply }]);
      setTyping(false);
    }, 900 + Math.random() * 400);
  };

  return (
    <div style={theme as React.CSSProperties} className="app">

      {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
      <aside className="side">
        <div className="brand">
          <div className="brand-badge">O</div>
          <div className="brand-meta">
            <span className="brand-name">Operator</span>
            <span className="brand-status"><span className="pulse" />Running · Active</span>
          </div>
        </div>

        <div className="nav-sec">Workspace</div>
        <nav className="nav">
          {cfg.nav.map((item, i) => (
            <button key={item.id} className={`nav-item${i === 0 ? " active" : ""}`}
              onClick={() => toast(item.label)}>
              <Icon name={item.ico} size={17} />
              <span className="lbl">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="side-foot">
          <button className="nav-item" onClick={() => toast("Settings")}>
            <Icon name="gear" size={17} />
            <span className="lbl">Settings</span>
          </button>
          <div className="account">
            <div className="avatar">{cfg.userInitials}</div>
            <div className="account-meta">
              <span className="account-name">{cfg.userName}</span>
              <span className="account-co">{cfg.userCo}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────────────── */}
      <div className="main">

        {/* TOPBAR */}
        <header className="topbar">
          <div className="tb-title">
            <span className="tb-eyebrow">{cfg.eyebrow}</span>
            <span className="tb-h">Command Center</span>
          </div>
          <div className="tb-spacer" />
          <div className="search">
            <Icon name="search" size={13} />
            <input placeholder="Search…" readOnly />
          </div>
          <span className="monitor">
            <span className="pulse" />{cfg.statusChip}
          </span>
          <span className="clock">{clock}<span className="z"> LOCAL</span></span>

          {/* A / B client toggle */}
          <div className="ab-toggle">
            <button className={`ab-seg${cid === "A" ? " ab-on" : ""}`} onClick={() => switchClient("A")}>A</button>
            <button className={`ab-seg${cid === "B" ? " ab-on" : ""}`} onClick={() => switchClient("B")}>B</button>
          </div>
        </header>

        {/* 3-COLUMN PAGE */}
        <div className="view" style={{ opacity:fading ? 0 : 1, transition:"opacity .2s ease" }}>
          <div className="cc-grid">

            {/* ── LEFT: Chat · Quick Actions · Overnight Queue ── */}
            <div className="stack">

              {/* Operator Chat */}
              <div className="op-prev">
                <div className="op-prev-h">
                  <div className="op-mini">O</div>
                  <div>
                    <div className="op-prev-name">
                      Operator
                      <span>
                        <span className="pulse" style={{ display:"inline-block", width:6, height:6, verticalAlign:"middle" }} />
                        &nbsp;Online · working
                      </span>
                    </div>
                  </div>
                </div>

                <div ref={chatRef} className="op-prev-body" style={{ maxHeight:240, overflowY:"auto" }}>
                  {msgs.map((m, i) =>
                    m.who === "op" ? (
                      <div key={i} className="op-bubble">{m.text}</div>
                    ) : (
                      <div key={i} style={{
                        alignSelf:"flex-end", background:"var(--teal)", color:"#fff",
                        borderRadius:"12px 4px 12px 12px", padding:"10px 13px",
                        fontSize:12.5, lineHeight:1.5, maxWidth:"82%",
                      }}>{m.text}</div>
                    )
                  )}
                  {typing && (
                    <div className="op-bubble" style={{ display:"flex", gap:4, padding:"12px 14px" }}>
                      {[0,1,2].map(i => (
                        <span key={i} style={{
                          width:7, height:7, borderRadius:"50%",
                          background:"var(--teal)", display:"inline-block",
                          animation:`tdot 1.2s infinite ${i * 200}ms`,
                        }} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="op-prev-foot">
                  {cfg.prompts.slice(0,4).map(p => (
                    <button key={p} className="chip" onClick={() => send(p)}>{p}</button>
                  ))}
                </div>

                <div style={{ padding:"0 16px 14px" }}>
                  <div className="chat-input" style={{ borderRadius:"var(--rad-sm)" }}>
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); send(input); } }}
                      placeholder="Ask the Operator…"
                      style={{ fontSize:12.5 }}
                    />
                    <button className="send-btn" style={{ width:32, height:32 }} onClick={() => send(input)}>
                      <Icon name="send" size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <div className="card-h"><h2>Quick actions</h2><span className="sub">one tap</span></div>
                <div className="qa">
                  <button className="qa-btn" onClick={() => toast(cid === "A" ? "Lead sweep started" : "County records chase queued")}>
                    <Icon name="bolt" size={15} />
                    {cid === "A" ? "Run lead sweep" : "Chase county records"}
                  </button>
                  <button className="qa-btn" onClick={() => toast(cid === "A" ? "Reminders queued for 4 leads" : "Client updates queued")}>
                    <Icon name="bell" size={15} />
                    {cid === "A" ? "Send reminders" : "Notify clients"}
                  </button>
                  <button className="qa-btn" onClick={() => toast("Follow-ups queued")}>
                    <Icon name="refresh" size={15} />
                    {cid === "A" ? "Queue follow-ups" : "Send status updates"}
                  </button>
                  <button className="qa-btn gold" onClick={() => toast("Opening escalations review")}>
                    <Icon name="warning" size={15} />
                    Review escalations
                  </button>
                </div>
              </div>

              {/* Overnight Queue */}
              <div className="card">
                <div className="card-h">
                  <h2>{cfg.overnightLabel}</h2>
                  <span className="q-badge"><Icon name="clock" size={11} />Scheduled</span>
                </div>
                <div className="q-list">
                  <div className="q-item" onClick={() => toast("Task queued for tonight")}>
                    <span className="q-time">22:00</span>
                    <span style={{ color:"var(--ink-dim)", display:"inline-flex" }}><Icon name="clock" size={12} /></span>
                    <span className="q-desc">{cfg.overnightTask}</span>
                    <span className="badge b-queued">Queued</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CENTER: Stats · Live Activity ── */}
            <div className="stack">

              {/* Stats */}
              <div className="stats">
                {cfg.stats.map(s => (
                  <div key={`${cid}-${s.label}`} className={`stat${s.gold ? " gold" : ""}`}
                    onClick={() => toast(s.label)}>
                    <div className="stat-val">
                      <CountUp key={`${cid}-${s.to}`} to={s.to} />
                    </div>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-delta">{s.detail}</div>
                  </div>
                ))}
              </div>

              {/* Live Activity */}
              <div className="card">
                <div className="card-h">
                  <h2>Live Activity</h2>
                  <span className="live-badge"><span className="ld" />LIVE</span>
                </div>
                <div key={cid}>
                  {cfg.acts.map((a, i) => (
                    <button key={i} className={`act${a.latest ? " latest" : ""}`}
                      style={{ animationDelay:`${i * 55}ms` }}
                      onClick={() => toast(a.desc)}>
                      <span className="act-time">{a.time}</span>
                      <span className={`badge ${a.cls}`}>{a.badge}</span>
                      <span className="act-desc">{a.desc}</span>
                      <span className="act-chan"><Icon name={a.ico} size={13} /></span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Attention · Escalations · Channels ── */}
            <div className="stack">

              {/* Attention Panel */}
              <div className="card">
                <div className="card-h">
                  <h2>{cfg.attnHeader}</h2>
                  <span className="sub">{cfg.attnItems.length} items</span>
                </div>
                {cfg.attnItems.map((item, i) => (
                  <div key={i} className="attn-item">
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
                      <div>
                        <div className="attn-name">{item.name}</div>
                        <div className="attn-meta">{item.meta1}</div>
                        <div className="attn-meta">{item.meta2}</div>
                      </div>
                      <span className={`badge ${item.statusCls}`} style={{ flexShrink:0, marginTop:2 }}>{item.statusLabel}</span>
                    </div>
                    <div className="attn-note">Operator: {item.note}</div>
                    <div className="attn-actions">
                      {item.actions.map(action => (
                        <button key={action} className="btn btn-ghost btn-sm"
                          onClick={() => toast(`${action} — ${item.ref}`)}>
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Escalations */}
              <div className="card" style={{ borderColor:"rgba(207,64,48,.25)" }}>
                <div className="card-h">
                  <h2>Escalations</h2>
                  <span className="badge b-escalated">{cfg.escs.length} open</span>
                </div>
                {cfg.escs.map((esc, i) => (
                  <div key={i} className="esc-item esc-open">
                    <div className="esc-title">
                      <span style={{ color:"var(--danger)", display:"inline-flex" }}><Icon name="warning" size={13} /></span>
                      {esc.title}
                    </div>
                    <div className="esc-body">{esc.body}</div>
                    <div className="esc-rec">{esc.rec}</div>
                    <div className="esc-actions">
                      {esc.actions.map(action => (
                        <button key={action} className="btn btn-ghost btn-sm btn-danger"
                          onClick={() => toast(`${action} — reviewing`)}>
                          {action}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Channel Map */}
              <div className="card">
                <div className="card-h"><h2>Channel map</h2></div>
                <div style={{ padding:"10px 14px 14px", display:"flex", flexDirection:"column", gap:8 }}>
                  {cfg.chans.map(ch => (
                    <button key={ch.name} className={`chan ${ch.active ? "active" : "idle"}`}
                      style={{ width:"100%", flexDirection:"row", justifyContent:"space-between",
                               gap:10, padding:"10px 12px" }}
                      onClick={() => toast(`${ch.name}: ${ch.note}`)}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <span className="chan-ico"><Icon name={ch.ico} size={13} /></span>
                        <span className="chan-name">{ch.name}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, minWidth:0 }}>
                        <span className="chan-note" style={{ textAlign:"right" }}>{ch.note}</span>
                        <span className={`chan-pill ${ch.active ? "p-active" : "p-idle"}`}>
                          {ch.active ? "ACTIVE" : "IDLE"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>{/* /cc-grid */}
        </div>{/* /view */}
      </div>{/* /main */}

      {/* TOASTS */}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            <span style={{ color:"var(--teal-2)", display:"inline-flex" }}><Icon name="check" size={15} /></span>
            {t.msg}
          </div>
        ))}
      </div>

    </div>
  );
}
