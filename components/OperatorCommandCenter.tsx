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

interface LeadRow   { name: string; budget: string; status: string; cls: string; source: string; lastContact: string; urgency: "High"|"Med"|"Low"; note: string }
interface OrderRow  { id: string; client: string; type: string; property: string; status: string; cls: string; due: string; priority: "Urgent"|"High"|"Med"|"Low" }
interface InboxItem { from: string; subject: string; preview: string; time: string; channel: string; ico: string; unread?: boolean; thread: Msg[] }
interface TaskRow   { title: string; due: string; priority: "Urgent"|"High"|"Med"|"Low"; cls: string; assignee: string; done: boolean }
interface CalEvent  { time: string; title: string; sub: string; type: string; status: string; cls: string }
interface PipeCol   { stage: string; items: { name: string; budget: string; note: string }[] }
interface ProjectRow{ name: string; type: string; orders: number; deadline: string; status: string; cls: string }
interface DocRow    { name: string; order: string; type: string; status: string; cls: string; pages: number; date: string }
interface ReportKPI { label: string; value: string; delta: string; up: boolean }

interface ClientCfg {
  eyebrow: string; statusChip: string;
  nav: { id: string; label: string; ico: string }[];
  stats: Stat[]; chatIntro: string; prompts: string[]; seedThread: Msg[];
  acts: Act[]; attnHeader: string; attnItems: Attn[];
  escs: Esc[]; chans: Chan[];
  overnightLabel: string; overnightTask: string;
  replies: { pat: RegExp; text: string }[]; fallback: string;
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
  dashboard:   '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
  leads:       '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  inbox:       '<path d="M4 4h16v16H4z"/><polyline points="22,6 12,13 2,6"/>',
  tasks:       '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  calendar:    '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  pipeline:    '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  escalations: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  reports:     '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  orders:      '<path d="M6 2h12l4 4v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M8 10h8M8 14h8M8 6h4"/>',
  projects:    '<rect x="2" y="3" width="6" height="6"/><rect x="9" y="3" width="6" height="6"/><rect x="16" y="3" width="6" height="6"/><rect x="2" y="11" width="6" height="6"/><rect x="9" y="11" width="6" height="6"/>',
  documents:   '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  gear:        '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  send:        '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
  bolt:        '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  bell:        '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  warning:     '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  clock:       '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  check:       '<polyline points="20 6 9 17 4 12"/>',
  refresh:     '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>',
  mail:        '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/>',
  phone:       '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  sms:         '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  whatsapp:    '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  doc:         '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  folder:      '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  search:      '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  sheets:      '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>',
  keep:        '<path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/><line x1="8" y1="3" x2="8" y2="21"/>',
  team:        '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  asana:       '<circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/>',
  trending_up: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  trending_dn: '<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>',
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

function CountUp({ to }: { to: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    setVal(0);
    let raf: number;
    const t0 = performance.now(), dur = 600;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      setVal(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{val}</>;
}

/* ─── PAGE DATA — CLIENT A ────────────────────────────────────────────── */
const LEADS_A: LeadRow[] = [
  { name:"Rachel Blum",    budget:"$1,500,000", status:"Offer Pending",         cls:"b-confirmed", source:"Referral",  lastContact:"Today",       urgency:"High", note:"Offer submitted — decision expected EOD." },
  { name:"Sarah Klein",    budget:"$1,200,000", status:"Pre-Approval Pending",  cls:"b-escalated", source:"Referral",  lastContact:"4 days ago",  urgency:"High", note:"Strong lead. Follow up within 24 hours." },
  { name:"Moshe Fried",    budget:"$1,100,000", status:"Follow-Up Needed",      cls:"b-escalated", source:"Email",     lastContact:"5 days ago",  urgency:"High", note:"Missed last two follow-ups. At risk." },
  { name:"David Rosen",    budget:"$850,000",   status:"Showing Scheduled",     cls:"b-confirmed", source:"WhatsApp",  lastContact:"Today",       urgency:"High", note:"Highly motivated. Showing tomorrow 2PM." },
  { name:"Miriam Cohen",   budget:"$975,000",   status:"Comps Requested",       cls:"b-queued",    source:"Online",    lastContact:"Yesterday",   urgency:"Med",  note:"Waiting on Bergen County comps." },
  { name:"James Pfeiffer", budget:"$620,000",   status:"First Contact",         cls:"b-sent",      source:"Zillow",    lastContact:"2 days ago",  urgency:"Med",  note:"Initial inquiry, qualifying call needed." },
  { name:"Aaron Stein",    budget:"$740,000",   status:"New",                   cls:"b-scheduled", source:"Facebook",  lastContact:"3 hours ago", urgency:"Low",  note:"New inquiry, not yet contacted." },
  { name:"Devorah Weiss",  budget:"$890,000",   status:"Under Contract",        cls:"b-confirmed", source:"Referral",  lastContact:"Today",       urgency:"Low",  note:"Under contract — closing in 30 days." },
];

const INBOX_A: InboxItem[] = [
  { from:"David Rosen",   subject:"Tomorrow's Showing — 123 Ocean Ave", preview:"Just confirming the 2pm — can my wife join?",        time:"11:42 AM", channel:"WhatsApp", ico:"whatsapp", unread:true,
    thread:[
      { who:"op", text:"Hi David, confirming your showing at 123 Ocean Ave tomorrow at 2:00 PM. Please let us know if anything changes." },
      { who:"me", text:"Just confirming the 2pm — will my wife be able to join?" },
      { who:"op", text:"Absolutely. She's welcome to join. The listing agent will meet you both at the door. Do you need directions sent to your phone?" },
    ]
  },
  { from:"Sarah Klein",   subject:"Pre-Approval Update",                 preview:"Hi, wanted to check on our pre-approval letter…",     time:"9:15 AM",  channel:"Email",    ico:"mail",     unread:true,
    thread:[
      { who:"me", text:"Hi, wanted to check in on the status of our pre-approval letter and the properties you mentioned." },
      { who:"op", text:"Hi Sarah — your pre-approval is progressing. I'll have a lender update by end of day. I've also queued 3 new comps in Bergen County within your criteria — sending now." },
    ]
  },
  { from:"Miriam Cohen",  subject:"Bergen County Comps",                 preview:"Can you send the comparable sales for Bergen County?",  time:"Yesterday",channel:"Email",    ico:"mail",     unread:false,
    thread:[
      { who:"me", text:"Can you send over the comparable sales for the Bergen County area?" },
      { who:"op", text:"Certainly. I've compiled 6 comparable sales from the past 90 days in Bergen County within your $975K budget range. Sending now." },
      { who:"me", text:"Perfect, thank you. I'll review by tomorrow." },
    ]
  },
  { from:"Rachel Blum",   subject:"Offer Status Update",                 preview:"Any word back on our offer yet?",                      time:"10:05 AM", channel:"SMS",      ico:"sms",      unread:true,
    thread:[
      { who:"me", text:"Any word back on our offer yet?" },
      { who:"op", text:"The seller's agent confirmed they received the offer this morning. We expect a response by 5 PM today. I'll notify you immediately when we hear back." },
    ]
  },
  { from:"Devorah Weiss", subject:"Closing Documents Checklist",         preview:"Please confirm which documents we need for closing.",   time:"Yesterday",channel:"WhatsApp", ico:"whatsapp", unread:false,
    thread:[
      { who:"me", text:"Please confirm which documents we need to bring to closing." },
      { who:"op", text:"For closing you'll need: Government-issued photo ID (both buyers), certified check or wire confirmation, proof of homeowner's insurance, and your signed purchase agreement. I'll send the full checklist by email today." },
    ]
  },
];

const TASKS_A: TaskRow[] = [
  { title:"Follow up with Sarah Klein — pre-approval status",   due:"Today · 3:00 PM",  priority:"Urgent", cls:"b-escalated", assignee:"Operator", done:false },
  { title:"Send comps to Miriam Cohen — Bergen County",          due:"Today · 5:00 PM",  priority:"High",   cls:"b-escalated", assignee:"Operator", done:false },
  { title:"Confirm showing details with David Rosen",            due:"Today · 6:00 PM",  priority:"High",   cls:"b-escalated", assignee:"Operator", done:false },
  { title:"Review Rachel Blum offer response when received",     due:"Today · 5:00 PM",  priority:"High",   cls:"b-escalated", assignee:"Operator", done:false },
  { title:"Re-engage Moshe Fried — 5 days no contact",           due:"Tomorrow · 9 AM",  priority:"High",   cls:"b-escalated", assignee:"Operator", done:false },
  { title:"Schedule qualifying call with James Pfeiffer",        due:"Tomorrow · 10 AM", priority:"Med",    cls:"b-queued",    assignee:"Operator", done:false },
  { title:"Send new listings to Aaron Stein",                    due:"Tomorrow",         priority:"Low",    cls:"b-sent",      assignee:"Operator", done:false },
  { title:"Update pipeline — Devorah Weiss closing status",      due:"Friday",           priority:"Low",    cls:"b-sent",      assignee:"Operator", done:true  },
];

const CAL_A: CalEvent[] = [
  { time:"9:00 AM",  title:"Lead intake call — Aaron Stein",     sub:"New inquiry · Facebook lead",               type:"Call",     status:"Confirmed",     cls:"b-confirmed" },
  { time:"10:30 AM", title:"Follow-up call — Sarah Klein",        sub:"Pre-approval pending discussion",           type:"Call",     status:"Reminder Sent", cls:"b-sent" },
  { time:"12:00 PM", title:"Pipeline review — internal",          sub:"Weekly summary · Operator prepared",        type:"Internal", status:"Confirmed",     cls:"b-confirmed" },
  { time:"2:00 PM",  title:"Showing — 123 Ocean Ave",             sub:"David Rosen + spouse · 3BR Colonial",       type:"Showing",  status:"Confirmed",     cls:"b-confirmed" },
  { time:"4:30 PM",  title:"Offer review — Rachel Blum",          sub:"Decision expected · 47 Maple Dr",           type:"Meeting",  status:"Pending",       cls:"b-queued" },
  { time:"6:00 PM",  title:"Evening follow-up sweep",             sub:"Automated · Operator queued 4 messages",    type:"Auto",     status:"Pending",       cls:"b-scheduled" },
];

const PIPE_A: PipeCol[] = [
  { stage:"New Leads",           items:[{ name:"Aaron Stein",   budget:"$740K",  note:"Facebook · not yet contacted" }, { name:"James Pfeiffer", budget:"$620K", note:"Zillow · qualifying call needed" }] },
  { stage:"Active Nurture",      items:[{ name:"Sarah Klein",   budget:"$1.2M",  note:"Pre-approval pending" }, { name:"Miriam Cohen", budget:"$975K", note:"Comps requested" }, { name:"Moshe Fried", budget:"$1.1M", note:"5 days no contact — at risk" }] },
  { stage:"Showing Scheduled",   items:[{ name:"David Rosen",   budget:"$850K",  note:"Tomorrow 2PM · 123 Ocean Ave" }] },
  { stage:"Offer / Negotiation", items:[{ name:"Rachel Blum",   budget:"$1.5M",  note:"Offer submitted · awaiting reply" }] },
  { stage:"Under Contract",      items:[{ name:"Devorah Weiss", budget:"$890K",  note:"Closing in 30 days" }] },
];

const REPORTS_A: ReportKPI[] = [
  { label:"Leads This Month",        value:"12",     delta:"+3 vs last month",    up:true  },
  { label:"Showings Scheduled",      value:"4",      delta:"+1 this week",        up:true  },
  { label:"Offers Submitted",        value:"2",      delta:"Same as last month",  up:false },
  { label:"Avg Response Time",       value:"2.4 hr", delta:"-0.8hr vs last week", up:true  },
  { label:"Deals Under Contract",    value:"1",      delta:"+1 this month",       up:true  },
  { label:"Leads Awaiting Follow-Up",value:"3",      delta:"+1 this week",        up:false },
];

/* ─── PAGE DATA — CLIENT B ────────────────────────────────────────────── */
const ORDERS_B: OrderRow[] = [
  { id:"RE-2854", client:"Flatbush Closing Group",  type:"Lien Search",            property:"2204 Flatbush Ave, Brooklyn",  status:"Escalated",        cls:"b-escalated", due:"Jun 2",  priority:"Urgent" },
  { id:"RE-2858", client:"Metro Title Corp",         type:"Recording",              property:"34 Spruce St, Bronx",           status:"Blocked",          cls:"b-escalated", due:"Jun 1",  priority:"Urgent" },
  { id:"RE-2847", client:"ABC Title Agency",         type:"Full Title Search 40yr", property:"1457 Ocean Pkwy, Brooklyn",     status:"Awaiting County",  cls:"b-scheduled", due:"Jun 3",  priority:"High"   },
  { id:"RE-2851", client:"Goldman Law PLLC",          type:"Certified Copy",         property:"88 Court St, Manhattan",        status:"Ready to Deliver", cls:"b-confirmed", due:"Today",  priority:"High"   },
  { id:"RE-2860", client:"Queens Title Associates",  type:"Surrogate Court Search", property:"109-33 Jamaica Ave, Queens",    status:"In Progress",      cls:"b-sent",      due:"Jun 5",  priority:"Med"    },
  { id:"RE-2863", client:"ABC Title Agency",         type:"Tax Search",             property:"220 Bay Ridge Ave, Brooklyn",   status:"In Progress",      cls:"b-sent",      due:"Jun 6",  priority:"Low"    },
  { id:"RE-2865", client:"Brooklyn Bridge Title",    type:"Full Title Search 60yr", property:"551 Atlantic Ave, Brooklyn",    status:"New",              cls:"b-scheduled", due:"Jun 10", priority:"Low"    },
  { id:"RE-2867", client:"Goldman Law PLLC",          type:"Judgment Search",        property:"14 Wall St, Manhattan",         status:"New",              cls:"b-scheduled", due:"Jun 8",  priority:"Med"    },
];

const PROJECTS_B: ProjectRow[] = [
  { name:"Brooklyn Residential Portfolio Q2",     type:"Residential Bundle",  orders:4, deadline:"Jun 15", status:"In Progress", cls:"b-sent"      },
  { name:"Goldman Law PLLC — Recurring Searches", type:"Law Firm Account",    orders:8, deadline:"Ongoing",status:"Active",      cls:"b-confirmed" },
  { name:"Metro Title Corp — Recording Batch",    type:"Recording Services",  orders:3, deadline:"Jun 1",  status:"Blocked",     cls:"b-escalated" },
  { name:"Queens Commercial Search Bundle",       type:"Commercial",          orders:2, deadline:"Jun 12", status:"Active",      cls:"b-confirmed" },
  { name:"ABC Title Q2 Batch",                    type:"Multi-property",      orders:6, deadline:"Jun 20", status:"Scheduled",   cls:"b-scheduled" },
];

const DOCS_B: DocRow[] = [
  { name:"Kings County Property Record",      order:"RE-2847", type:"County Record",      status:"Requested",   cls:"b-scheduled", pages:4, date:"May 30" },
  { name:"Certified Copy — 88 Court St",      order:"RE-2851", type:"Certified Copy",     status:"Received",    cls:"b-confirmed", pages:2, date:"May 31" },
  { name:"Lien Search Report — RE-2854",      order:"RE-2854", type:"Search Report",      status:"On Hold",     cls:"b-escalated", pages:6, date:"May 31" },
  { name:"Signed Authorization — RE-2858",    order:"RE-2858", type:"Authorization Form", status:"Missing",     cls:"b-escalated", pages:1, date:"—"      },
  { name:"Surrogate Court Index — RE-2860",   order:"RE-2860", type:"Court Record",       status:"In Progress", cls:"b-sent",      pages:3, date:"Pending"},
  { name:"Tax Certificate — RE-2863",         order:"RE-2863", type:"Tax Document",       status:"Requested",   cls:"b-scheduled", pages:2, date:"Jun 1"  },
  { name:"Title Insurance Commitment RE-2865",order:"RE-2865", type:"Insurance Form",     status:"Pending",     cls:"b-queued",    pages:8, date:"Pending"},
  { name:"Judgment Search Results — RE-2867", order:"RE-2867", type:"Search Report",      status:"New",         cls:"b-scheduled", pages:4, date:"Pending"},
];

const INBOX_B: InboxItem[] = [
  { from:"ABC Title Agency",        subject:"RE-2847 — County Request Status",  preview:"Any update from Kings County on the title search?",     time:"10:15 AM", channel:"WhatsApp", ico:"whatsapp", unread:true,
    thread:[
      { who:"me", text:"Any update from Kings County on the title search for RE-2847?" },
      { who:"op", text:"We submitted the county request 2 days ago. No response yet from Kings County clerk. I recommend we call them directly today — I've queued the follow-up for 11 AM." },
      { who:"me", text:"Please call and let me know ASAP, our client is asking for an ETA." },
      { who:"op", text:"Understood. I'll call the clerk now and update you within the hour. I'll also prepare a client-ready status message for you to forward." },
    ]
  },
  { from:"Goldman Law PLLC",        subject:"RE-2851 — Delivery Confirmation",  preview:"Is the certified copy ready to send over?",               time:"9:45 AM",  channel:"Email",    ico:"mail",     unread:true,
    thread:[
      { who:"me", text:"Is the certified copy ready to send over?" },
      { who:"op", text:"Yes — the certified copy for RE-2851 (88 Court St) has been received, verified, and packaged. Ready for delivery. Shall I send via encrypted email or courier?" },
    ]
  },
  { from:"Flatbush Closing Group",  subject:"RE-2854 — Lien Search Results",    preview:"We need the lien search report as soon as possible.",       time:"Yesterday",channel:"Email",    ico:"mail",     unread:false,
    thread:[
      { who:"me", text:"We need the lien search report as soon as possible." },
      { who:"op", text:"I have the results. However, the search returned a possible open judgment that requires attorney review before I can release the report. I've escalated this internally. You'll have a response within 24 hours." },
      { who:"me", text:"Understood. Please expedite the review." },
    ]
  },
  { from:"Metro Title Corp",        subject:"RE-2858 — Recording Blocked",       preview:"Why has the recording not been filed yet?",                time:"8:30 AM",  channel:"Email",    ico:"mail",     unread:true,
    thread:[
      { who:"me", text:"Why has the recording not been filed yet?" },
      { who:"op", text:"Recording is currently blocked because the signed authorization form is missing from our file. I've sent two requests to your office. Could you please resend the signed form so we can proceed immediately?" },
    ]
  },
  { from:"Queens Title Associates", subject:"RE-2860 — Surrogate Court Search",  preview:"How long does the Surrogate Court search typically take?", time:"Yesterday",channel:"WhatsApp", ico:"whatsapp", unread:false,
    thread:[
      { who:"me", text:"How long does the Surrogate Court search typically take?" },
      { who:"op", text:"Surrogate Court searches typically take 3–5 business days. We submitted Monday, June 2nd — on track for Thursday, June 5th completion." },
    ]
  },
];

const TASKS_B: TaskRow[] = [
  { title:"Call Kings County clerk — RE-2847 county follow-up",        due:"Today · 11:00 AM", priority:"Urgent", cls:"b-escalated", assignee:"Operator", done:false },
  { title:"Request signed authorization form — Metro Title RE-2858",   due:"Today · ASAP",     priority:"Urgent", cls:"b-escalated", assignee:"Operator", done:false },
  { title:"Escalate judgment to examiner — RE-2854",                    due:"Today · 12 PM",    priority:"Urgent", cls:"b-escalated", assignee:"Examiner", done:false },
  { title:"Deliver certified copy to Goldman Law — RE-2851",            due:"Today · 2:00 PM",  priority:"High",   cls:"b-escalated", assignee:"Operator", done:false },
  { title:"Send status update to Flatbush Closing Group — RE-2854",    due:"Today · 4:00 PM",  priority:"High",   cls:"b-escalated", assignee:"Operator", done:false },
  { title:"Notify ABC Title of county delay — RE-2847",                due:"Today · 12 PM",    priority:"High",   cls:"b-escalated", assignee:"Operator", done:false },
  { title:"Queue Surrogate Court follow-up — RE-2860",                  due:"Tomorrow",         priority:"Med",    cls:"b-queued",    assignee:"Operator", done:false },
  { title:"Open new order file — RE-2867 Goldman Law",                  due:"Today",            priority:"Low",    cls:"b-sent",      assignee:"Operator", done:true  },
];

const CAL_B: CalEvent[] = [
  { time:"9:00 AM",  title:"County follow-up call — Kings County",  sub:"RE-2847 · Full Title Search 40yr",         type:"Call",     status:"Confirmed",     cls:"b-confirmed" },
  { time:"10:00 AM", title:"Judgment review — RE-2854",              sub:"Examiner + Operator · Flatbush",           type:"Review",   status:"Confirmed",     cls:"b-confirmed" },
  { time:"11:30 AM", title:"Client call — Metro Title Corp",         sub:"RE-2858 recording status discussion",       type:"Call",     status:"Pending",       cls:"b-queued" },
  { time:"2:00 PM",  title:"Delivery — RE-2851 certified copy",      sub:"Goldman Law PLLC · encrypted transfer",    type:"Delivery", status:"Confirmed",     cls:"b-confirmed" },
  { time:"3:30 PM",  title:"Order intake — RE-2867",                 sub:"Goldman Law PLLC · Judgment Search",       type:"Intake",   status:"Reminder Sent", cls:"b-sent" },
  { time:"5:00 PM",  title:"End-of-day order digest",                sub:"Automated · Operator generates summary",   type:"Auto",     status:"Pending",       cls:"b-scheduled" },
];

const REPORTS_B: ReportKPI[] = [
  { label:"Active Orders",            value:"18",       delta:"+5 vs last month",    up:true  },
  { label:"Orders Completed",         value:"11",       delta:"+2 vs last month",    up:true  },
  { label:"Escalated Orders",         value:"3",        delta:"+1 this week",        up:false },
  { label:"Avg Turnaround Time",      value:"3.2 days", delta:"-0.4d vs last month", up:true  },
  { label:"Awaiting County Response", value:"5",        delta:"+2 this week",        up:false },
  { label:"Ready for Delivery",       value:"2",        delta:"New today",           up:true  },
];

/* ─── CONFIGS ─────────────────────────────────────────────────────────── */
const CFG_A: ClientCfg = {
  eyebrow: "OPERATOR FOR REAL ESTATE",
  statusChip: "MONITORING PIPELINE",
  nav: [
    { id:"home",        label:"Command Center", ico:"dashboard"   },
    { id:"leads",       label:"Leads",          ico:"leads"       },
    { id:"inbox",       label:"Inbox",          ico:"inbox"       },
    { id:"tasks",       label:"Tasks",          ico:"tasks"       },
    { id:"calendar",    label:"Calendar",       ico:"calendar"    },
    { id:"pipeline",    label:"Pipeline",       ico:"pipeline"    },
    { id:"escalations", label:"Escalations",    ico:"escalations" },
    { id:"reports",     label:"Reports",        ico:"reports"     },
  ],
  stats: [
    { to:12, label:"Active Leads",       detail:"+3 this week" },
    { to:4,  label:"Showings Today",     detail:"2 confirmed" },
    { to:3,  label:"Awaiting Follow-Up", detail:"oldest: 4 days", gold:true },
  ],
  chatIntro: "I'm managing your leads, appointments, and follow-ups.",
  prompts: ["Who needs follow-up today?","Any showings confirmed?","What leads came in this week?","Show my pipeline.","Any escalations?","Who hasn't responded?"],
  seedThread: [
    { who:"me", text:"Who needs follow-up today?" },
    { who:"op", text:"Sarah Klein has not responded in 4 days — budget $1.2M, pre-approval pending. Follow-up recommended within 24 hours. David Rosen confirmed tomorrow's showing at 123 Ocean Ave — high motivation, 60-day close target. Miriam Cohen requested updated comps for Bergen County — sent to queue." },
  ],
  acts: [
    { time:"8:14 AM",  desc:"New lead received — David Rosen — $850K budget — WhatsApp",    badge:"COMPLETED",  cls:"b-confirmed",  ico:"whatsapp", latest:true },
    { time:"9:02 AM",  desc:"Showing confirmed — 123 Ocean Ave — David Rosen — Email",       badge:"CONFIRMED",  cls:"b-confirmed",  ico:"mail" },
    { time:"9:45 AM",  desc:"Follow-up sent — Sarah Klein — pre-approval reminder",           badge:"SENT",       cls:"b-sent",       ico:"sms" },
    { time:"10:30 AM", desc:"Comps requested — Miriam Cohen — Bergen County",                badge:"QUEUED",     cls:"b-queued",     ico:"mail" },
    { time:"11:05 AM", desc:"Negotiation escalated — buyer requesting price reduction",       badge:"ESCALATED",  cls:"b-escalated",  ico:"phone" },
    { time:"11:48 AM", desc:"Reminder sent — tomorrow's showing — David Rosen — SMS",        badge:"SENT",       cls:"b-sent",       ico:"sms" },
    { time:"12:15 PM", desc:"Pipeline updated — 3 active deals — 1 under contract",          badge:"COMPLETED",  cls:"b-confirmed",  ico:"pipeline" },
  ],
  attnHeader: "People Needing Attention",
  attnItems: [
    { ref:"Rosen", name:"David Rosen",  meta1:"Budget: $850,000",   meta2:"Status: Showing Scheduled",    statusCls:"b-confirmed", statusLabel:"READY",  note:"Highly motivated buyer. Close target 60 days.",        actions:["Book Showing","Send Reminder"] },
    { ref:"Klein", name:"Sarah Klein",  meta1:"Budget: $1,200,000", meta2:"Status: Pre-Approval Pending", statusCls:"b-escalated", statusLabel:"URGENT", note:"Strong lead. Follow up within 24 hours.",              actions:["Follow Up","Send Comps"] },
    { ref:"Cohen", name:"Miriam Cohen", meta1:"Budget: $975,000",   meta2:"Status: Comps Requested",      statusCls:"b-queued",    statusLabel:"QUEUED", note:"Waiting on Bergen County data. No action needed yet.", actions:["View Details"] },
  ],
  escs: [
    { title:"Negotiation Request", body:"Buyer requesting lower purchase price on 47 Maple Dr.",  rec:"Escalate to broker — pricing decision required.",    actions:["Review Now","Escalate to Broker"] },
    { title:"Commission Question",  body:"Seller asking about reduced commission structure.",      rec:"Escalate to principal — not within Operator authority.", actions:["Review Now"] },
  ],
  chans: [
    { name:"WhatsApp",  ico:"whatsapp", active:true,  note:"3 active threads · 2m avg" },
    { name:"SMS",       ico:"sms",      active:true,  note:"Reminders queued for 4 leads" },
    { name:"Email",     ico:"mail",     active:true,  note:"6 emails sent today" },
    { name:"Phone",     ico:"phone",    active:false, note:"No calls in progress" },
    { name:"Asana",     ico:"asana",    active:true,  note:"5 tasks updated · synced" },
  ],
  overnightLabel: "Delegate Tonight",
  overnightTask: "Review all unresponsive leads and prepare morning follow-up drafts with suggested next steps.",
  replies: [
    { pat:/follow/i,        text:"Sarah Klein — 4 days no response, budget $1.2M. David Rosen — confirmed showing tomorrow. Miriam Cohen — comps queued. I recommend contacting Sarah first." },
    { pat:/show/i,          text:"David Rosen confirmed tomorrow's showing at 123 Ocean Ave at 2PM. 2 more showings this week are pending confirmation — I'll send reminders tonight." },
    { pat:/week|came in/i,  text:"3 new leads this week: David Rosen ($850K, WhatsApp), Sarah Klein ($1.2M, referral), and Miriam Cohen ($975K, online form). All qualified and active." },
    { pat:/pipeline/i,      text:"Pipeline: 12 active leads, 3 showings scheduled, 2 offers pending, 1 under contract. Highest urgency: Sarah Klein and David Rosen." },
    { pat:/escalat/i,       text:"2 open escalations: (1) Negotiation request — buyer wants price reduction on 47 Maple Dr. (2) Commission question — seller asking about reduced rate. Both need your decision." },
    { pat:/respond|hasn.t/i,text:"Sarah Klein hasn't responded in 4 days. Two other leads haven't acknowledged last week's follow-up. I'll queue a re-engagement sequence if you'd like." },
  ],
  fallback: "I'm monitoring your pipeline. Could you be more specific? You can ask about follow-ups, showings, leads, or escalations.",
};

const CFG_B: ClientCfg = {
  eyebrow: "OPERATOR FOR TITLE OPERATIONS",
  statusChip: "MONITORING ORDERS",
  nav: [
    { id:"home",        label:"Command Center", ico:"dashboard"   },
    { id:"orders",      label:"Orders",         ico:"orders"      },
    { id:"projects",    label:"Projects",       ico:"projects"    },
    { id:"documents",   label:"Documents",      ico:"documents"   },
    { id:"inbox",       label:"Inbox",          ico:"inbox"       },
    { id:"tasks",       label:"Tasks",          ico:"tasks"       },
    { id:"calendar",    label:"Calendar",       ico:"calendar"    },
    { id:"escalations", label:"Escalations",    ico:"escalations" },
    { id:"reports",     label:"Reports",        ico:"reports"     },
  ],
  stats: [
    { to:18, label:"Active Orders",   detail:"6 due today" },
    { to:3,  label:"Escalated",       detail:"Human review needed", gold:true },
    { to:5,  label:"Awaiting County", detail:"Oldest: 5 days" },
  ],
  chatIntro: "I'm tracking your active orders, document requests, and county timelines.",
  prompts: ["What needs attention today?","Which orders are delayed?","Show escalations.","RE-2847 status?","Any missing documents?","What's due this week?"],
  seedThread: [
    { who:"me", text:"What needs my attention today?" },
    { who:"op", text:"RE-2847 — Kings County records requested 2 days ago, no response. Follow-up call to clerk recommended. RE-2854 — Lien search produced a possible open judgment. Human review required before report release. RE-2858 — Recording cannot proceed. Signed authorization form missing. Request from client immediately." },
  ],
  acts: [
    { time:"8:42 AM",  desc:"New order opened — RE-2847 — Full Title Search 40yr — ABC Title",  badge:"COMPLETED",  cls:"b-confirmed",  ico:"orders", latest:true },
    { time:"9:05 AM",  desc:"County request submitted — Kings County — RE-2847",                 badge:"WAITING",    cls:"b-scheduled",  ico:"doc" },
    { time:"9:31 AM",  desc:"Certified copy retrieved + verified — RE-2851",                     badge:"COMPLETED",  cls:"b-confirmed",  ico:"doc" },
    { time:"10:04 AM", desc:"Status update sent to client — RE-2851 — Goldman Law PLLC",         badge:"SENT",       cls:"b-sent",       ico:"mail" },
    { time:"10:37 AM", desc:"Possible judgment detected — RE-2854 — Flatbush Closing Group",     badge:"ESCALATED",  cls:"b-escalated",  ico:"warning" },
    { time:"11:16 AM", desc:"Recording deadline approaching — RE-2858",                          badge:"WAITING",    cls:"b-scheduled",  ico:"clock" },
    { time:"11:42 AM", desc:"Internal note — missing authorization required — RE-2858",          badge:"QUEUED",     cls:"b-queued",     ico:"doc" },
    { time:"12:08 PM", desc:"Delivery prepared — certified copy package — RE-2851",              badge:"COMPLETED",  cls:"b-confirmed",  ico:"folder" },
  ],
  attnHeader: "Orders Needing Attention",
  attnItems: [
    { ref:"RE-2847", name:"RE-2847", meta1:"Client: ABC Title Agency · Full Title Search 40yr", meta2:"Property: 1457 Ocean Pkwy · Awaiting County Records",   statusCls:"b-scheduled", statusLabel:"WAITING", note:"County request submitted 2 days ago. Follow-up recommended.",    actions:["Follow Up County","Notify Client"] },
    { ref:"RE-2851", name:"RE-2851", meta1:"Client: Goldman Law PLLC · Certified Copy",        meta2:"Status: Ready for Delivery",                              statusCls:"b-confirmed", statusLabel:"READY",   note:"Certified copy received and verified. Ready to send.",         actions:["Deliver","View Doc"] },
    { ref:"RE-2854", name:"RE-2854", meta1:"Client: Flatbush Closing Group · Lien Search",     meta2:"Status: Escalated — Possible Judgment",                   statusCls:"b-escalated", statusLabel:"URGENT",  note:"Open judgment detected. Do not release without review.",       actions:["Review Now"] },
  ],
  escs: [
    { title:"County Non-Response — RE-2847", body:"No reply from Kings County after 5 business days.",          rec:"Call clerk directly and notify client of delay.",        actions:["Call County","Notify Client"] },
    { title:"Missing Authorization — RE-2858", body:"Recording blocked. No signed authorization on file.",       rec:"Request signed form from client immediately.",           actions:["Request Form"] },
    { title:"Possible Judgment — RE-2854",   body:"Lien search match requires attorney review before delivery.", rec:"Hold report and escalate to examiner.",                  actions:["Escalate"] },
  ],
  chans: [
    { name:"WhatsApp",       ico:"whatsapp", active:true,  note:"1 client thread · awaiting reply" },
    { name:"Email",          ico:"mail",     active:true,  note:"Status updates to 3 clients" },
    { name:"Google Sheets",  ico:"sheets",   active:true,  note:"Order tracker synced · 5m ago" },
    { name:"Google Keep",    ico:"keep",     active:false, note:"No new notes today" },
    { name:"Team Messaging", ico:"team",     active:true,  note:"2 internal threads active" },
  ],
  overnightLabel: "Overnight Sweep",
  overnightTask: "Chase 5 outstanding county requests, re-send authorization form requests, and compile the morning order digest.",
  replies: [
    { pat:/attention|needs/i, text:"RE-2847 — County follow-up overdue. RE-2854 — Judgment detected, human review required. RE-2858 — Authorization missing, blocks recording. These three need action today." },
    { pat:/delay/i,           text:"RE-2847 is the most delayed — Kings County request is now 5 days old with no response. RE-2860 is behind on Surrogates Court documents." },
    { pat:/escalat/i,         text:"3 escalations: (1) County non-response on RE-2847. (2) Missing authorization on RE-2858. (3) Possible open judgment on RE-2854. All require your decision before I can proceed." },
    { pat:/2847/i,            text:"RE-2847 — Full Title Search 40yr for ABC Title Agency at 1457 Ocean Parkway. County request submitted to Kings County 2 days ago, no clerk response yet. Follow-up call recommended today." },
    { pat:/document|missing/i,text:"RE-2858 needs a signed authorization form before recording can proceed. RE-2847 is waiting on Kings County for the actual document return. I've flagged both for follow-up." },
    { pat:/due|week/i,        text:"This week: RE-2858 recording deadline is Friday. RE-2851 delivery is ready today. RE-2847 county follow-up is overdue. RE-2860 Surrogates Court deadline is Thursday." },
  ],
  fallback: "I'm monitoring your orders. Could you be more specific? You can ask about delayed orders, escalations, missing documents, or a specific order number.",
};

const CFGS: Record<ClientId, ClientCfg> = { A: CFG_A, B: CFG_B };

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────── */
export function OperatorCommandCenter({ client }: { client: Client }) {
  const initId: ClientId            = client.slug === "lazer" ? "B" : "A";
  const [cid, setCid]               = useState<ClientId>(initId);
  const [fading, setFading]         = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [clock, setClock]           = useState("");
  const [msgs, setMsgs]             = useState<Msg[]>(CFGS[initId].seedThread);
  const [input, setInput]           = useState("");
  const [typing, setTyping]         = useState(false);
  const [toasts, setToasts]         = useState<{id:number;msg:string}[]>([]);
  const [selThread, setSelThread]   = useState(0);
  const [doneTasks, setDoneTasks]   = useState<Set<string>>(new Set());
  const chatRef                     = useRef<HTMLDivElement>(null);

  const cfg   = CFGS[cid];
  const theme = THEMES[cid];
  const activeNav = cfg.nav.find(n => n.id === activePage) ?? cfg.nav[0];

  useEffect(() => {
    const tick = () => {
      const d = new Date(), p = (n: number) => String(n).padStart(2, "0");
      setClock(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setMsgs(CFGS[cid].seedThread);
    setInput(""); setTyping(false);
  }, [cid]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, typing]);

  const switchClient = (id: ClientId) => {
    if (id === cid) return;
    setFading(true);
    setTimeout(() => { setCid(id); setActivePage("home"); setSelThread(0); setFading(false); }, 150);
  };

  const toast = (msg: string) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2700);
  };

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

  const navigate = (id: string) => { setActivePage(id); setSelThread(0); };

  const initials = (name: string) => name.split(" ").map(w => w[0]).slice(0, 2).join("");

  /* ── PAGE: HOME ────────────────────────────────────────────────────── */
  const renderHome = () => (
    <div className="cc-grid">
      {/* LEFT */}
      <div className="stack">
        <div className="op-prev">
          <div className="op-prev-h">
            <div className="op-mini">O</div>
            <div>
              <div className="op-prev-name">
                Operator
                <span><span className="pulse" style={{display:"inline-block",width:6,height:6,verticalAlign:"middle"}}/>&nbsp;Online · working</span>
              </div>
            </div>
          </div>
          <div ref={chatRef} className="op-prev-body" style={{maxHeight:240,overflowY:"auto"}}>
            {msgs.map((m, i) =>
              m.who === "op"
                ? <div key={i} className="op-bubble">{m.text}</div>
                : <div key={i} style={{alignSelf:"flex-end",background:"var(--teal)",color:"#fff",borderRadius:"12px 4px 12px 12px",padding:"10px 13px",fontSize:12.5,lineHeight:1.5,maxWidth:"82%"}}>{m.text}</div>
            )}
            {typing && (
              <div className="op-bubble" style={{display:"flex",gap:4,padding:"12px 14px"}}>
                {[0,1,2].map(i => <span key={i} style={{width:7,height:7,borderRadius:"50%",background:"var(--teal)",display:"inline-block",animation:`tdot 1.2s infinite ${i*200}ms`}}/>)}
              </div>
            )}
          </div>
          <div className="op-prev-foot">
            {cfg.prompts.slice(0,4).map(p => <button key={p} className="chip" onClick={() => send(p)}>{p}</button>)}
          </div>
          <div style={{padding:"0 16px 14px"}}>
            <div className="chat-input" style={{borderRadius:"var(--rad-sm)"}}>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); send(input); } }}
                placeholder="Ask the Operator…" style={{fontSize:12.5}}/>
              <button className="send-btn" style={{width:32,height:32}} onClick={() => send(input)}>
                <Icon name="send" size={13}/>
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-h"><h2>Quick actions</h2><span className="sub">one tap</span></div>
          <div className="qa">
            <button className="qa-btn" onClick={() => toast(cid==="A"?"Lead sweep started":"County records chase queued")}>
              <Icon name="bolt" size={15}/>{cid==="A"?"Run lead sweep":"Chase county records"}
            </button>
            <button className="qa-btn" onClick={() => toast(cid==="A"?"Reminders queued for 4 leads":"Client updates queued")}>
              <Icon name="bell" size={15}/>{cid==="A"?"Send reminders":"Notify clients"}
            </button>
            <button className="qa-btn" onClick={() => toast("Follow-ups queued")}>
              <Icon name="refresh" size={15}/>{cid==="A"?"Queue follow-ups":"Send status updates"}
            </button>
            <button className="qa-btn gold" onClick={() => navigate("escalations")}>
              <Icon name="warning" size={15}/>Review escalations
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <h2>{cfg.overnightLabel}</h2>
            <span className="q-badge"><Icon name="clock" size={11}/>Scheduled</span>
          </div>
          <div className="q-list">
            <div className="q-item" style={{cursor:"pointer"}} onClick={() => toast("Task queued for tonight")}>
              <span className="q-time">22:00</span>
              <span style={{color:"var(--ink-dim)",display:"inline-flex"}}><Icon name="clock" size={12}/></span>
              <span className="q-desc">{cfg.overnightTask}</span>
              <span className="badge b-queued">Queued</span>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER */}
      <div className="stack">
        <div className="stats">
          {cfg.stats.map(s => (
            <div key={`${cid}-${s.label}`} className={`stat${s.gold?" gold":""}`} onClick={() => toast(s.label)}>
              <div className="stat-val"><CountUp key={`${cid}-${s.to}`} to={s.to}/></div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-delta">{s.detail}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-h">
            <h2>Live Activity</h2>
            <span className="live-badge"><span className="ld"/>LIVE</span>
          </div>
          <div key={cid}>
            {cfg.acts.map((a, i) => (
              <button key={i} className={`act${a.latest?" latest":""}`} style={{animationDelay:`${i*55}ms`}} onClick={() => toast(a.desc)}>
                <span className="act-time">{a.time}</span>
                <span className={`badge ${a.cls}`}>{a.badge}</span>
                <span className="act-desc">{a.desc}</span>
                <span className="act-chan"><Icon name={a.ico} size={13}/></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="stack">
        <div className="card">
          <div className="card-h"><h2>{cfg.attnHeader}</h2><span className="sub">{cfg.attnItems.length} items</span></div>
          {cfg.attnItems.map((item, i) => (
            <div key={i} className="attn-item">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                <div>
                  <div className="attn-name">{item.name}</div>
                  <div className="attn-meta">{item.meta1}</div>
                  <div className="attn-meta">{item.meta2}</div>
                </div>
                <span className={`badge ${item.statusCls}`} style={{flexShrink:0,marginTop:2}}>{item.statusLabel}</span>
              </div>
              <div className="attn-note">Operator: {item.note}</div>
              <div className="attn-actions">
                {item.actions.map(action => (
                  <button key={action} className="btn btn-ghost btn-sm" onClick={() => toast(`${action} — ${item.ref}`)}>{action}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{borderColor:"rgba(207,64,48,.25)"}}>
          <div className="card-h">
            <h2>Escalations</h2>
            <span className="badge b-escalated">{cfg.escs.length} open</span>
          </div>
          {cfg.escs.map((esc, i) => (
            <div key={i} className="esc-item esc-open">
              <div className="esc-title">
                <span style={{color:"var(--danger)",display:"inline-flex"}}><Icon name="warning" size={13}/></span>
                {esc.title}
              </div>
              <div className="esc-body">{esc.body}</div>
              <div className="esc-rec">{esc.rec}</div>
              <div className="esc-actions">
                {esc.actions.map(action => (
                  <button key={action} className="btn btn-ghost btn-sm btn-danger" onClick={() => toast(`${action} — reviewing`)}>{action}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-h"><h2>Channel map</h2></div>
          <div style={{padding:"10px 14px 14px",display:"flex",flexDirection:"column",gap:8}}>
            {cfg.chans.map(ch => (
              <button key={ch.name} className={`chan ${ch.active?"active":"idle"}`}
                style={{width:"100%",flexDirection:"row",justifyContent:"space-between",gap:10,padding:"10px 12px"}}
                onClick={() => toast(`${ch.name}: ${ch.note}`)}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span className="chan-ico"><Icon name={ch.ico} size={13}/></span>
                  <span className="chan-name">{ch.name}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span className="chan-note">{ch.note}</span>
                  <span className={`chan-pill ${ch.active?"p-active":"p-idle"}`}>{ch.active?"ACTIVE":"IDLE"}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ── PAGE: LEADS ───────────────────────────────────────────────────── */
  const renderLeads = () => (
    <div>
      <div className="section-head">
        <div style={{display:"flex",alignItems:"baseline",gap:10}}>
          <span style={{fontFamily:"var(--serif)",fontSize:21,fontWeight:700,color:"var(--ink)"}}>Active Leads</span>
          <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--ink-dim)"}}>{LEADS_A.length} total</span>
        </div>
        <div className="filters">
          <button className="filter on">All</button>
          <button className="filter" onClick={() => toast("Showing high urgency leads")}>High Urgency</button>
          <button className="filter" onClick={() => toast("Showing leads needing follow-up")}>Needs Follow-Up</button>
          <button className="filter" onClick={() => toast("New lead form opened")}>+ New Lead</button>
        </div>
      </div>
      <div className="card">
        <table className="table" style={{width:"100%"}}>
          <thead>
            <tr>
              <th>Name</th><th>Budget</th><th>Status</th><th>Source</th>
              <th>Last Contact</th><th>Urgency</th><th>Note</th><th></th>
            </tr>
          </thead>
          <tbody>
            {LEADS_A.map((l, i) => (
              <tr key={i} onClick={() => toast(`${l.name} — ${l.note}`)}>
                <td style={{fontWeight:600}}>{l.name}</td>
                <td style={{fontFamily:"var(--mono)",fontSize:12}}>{l.budget}</td>
                <td><span className={`badge ${l.cls}`}>{l.status}</span></td>
                <td style={{color:"var(--ink-dim)",fontSize:12}}>{l.source}</td>
                <td style={{fontFamily:"var(--mono)",fontSize:11.5,color:"var(--ink-dim)"}}>{l.lastContact}</td>
                <td style={{fontFamily:"var(--mono)",fontSize:10.5,fontWeight:600,
                  color:l.urgency==="High"?"var(--danger)":l.urgency==="Med"?"var(--warning)":"var(--ink-dim)"}}>
                  {l.urgency}
                </td>
                <td style={{fontSize:12,color:"var(--ink-dim)",maxWidth:180}}>{l.note}</td>
                <td>
                  <button className="btn btn-ghost btn-sm" onClick={e=>{e.stopPropagation();toast(`Follow-up sent to ${l.name}`);}}>Follow Up</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ── PAGE: ORDERS ──────────────────────────────────────────────────── */
  const renderOrders = () => (
    <div>
      <div className="section-head">
        <div style={{display:"flex",alignItems:"baseline",gap:10}}>
          <span style={{fontFamily:"var(--serif)",fontSize:21,fontWeight:700,color:"var(--ink)"}}>Active Orders</span>
          <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--ink-dim)"}}>{ORDERS_B.length} total · 6 due today</span>
        </div>
        <div className="filters">
          <button className="filter on">All</button>
          <button className="filter" onClick={() => toast("Showing escalated orders")}>Escalated</button>
          <button className="filter" onClick={() => toast("Showing orders awaiting county")}>Awaiting County</button>
          <button className="filter" onClick={() => toast("New order form opened")}>+ New Order</button>
        </div>
      </div>
      <div className="card">
        <table className="table" style={{width:"100%"}}>
          <thead>
            <tr>
              <th>Order ID</th><th>Client</th><th>Type</th><th>Property</th>
              <th>Status</th><th>Due</th><th>Priority</th><th></th>
            </tr>
          </thead>
          <tbody>
            {ORDERS_B.map((o, i) => (
              <tr key={i} onClick={() => toast(`${o.id} — ${o.client} · ${o.status}`)}>
                <td className="rid">{o.id}</td>
                <td style={{fontWeight:600,fontSize:12.5}}>{o.client}</td>
                <td style={{fontSize:12,color:"var(--ink-dim)"}}>{o.type}</td>
                <td style={{fontSize:12,color:"var(--ink-2)"}}>{o.property}</td>
                <td><span className={`badge ${o.cls}`}>{o.status}</span></td>
                <td style={{fontFamily:"var(--mono)",fontSize:11.5,color:"var(--ink-dim)"}}>{o.due}</td>
                <td style={{fontFamily:"var(--mono)",fontSize:10.5,fontWeight:600,
                  color:o.priority==="Urgent"?"var(--danger)":o.priority==="High"?"var(--warning)":o.priority==="Med"?"var(--teal-ink)":"var(--ink-dim)"}}>
                  {o.priority}
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm" onClick={e=>{e.stopPropagation();toast(`Opening ${o.id}`);}}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ── PAGE: INBOX ───────────────────────────────────────────────────── */
  const renderInbox = () => {
    const threads = cid === "A" ? INBOX_A : INBOX_B;
    const thread  = threads[selThread] ?? threads[0];
    return (
      <div style={{display:"grid",gridTemplateColumns:"290px 1fr",gap:16,height:"calc(100vh - 114px)",overflow:"hidden",margin:"-22px -26px -30px"}}>
        <div className="thread-list">
          <div className="tl-h">
            <h3>Inbox</h3>
            <span className="badge b-escalated">{threads.filter(t => t.unread).length} unread</span>
          </div>
          <div className="tl-scroll">
            {threads.map((t, i) => (
              <button key={i} className={`thread${selThread===i?" active":""}`} onClick={() => setSelThread(i)}>
                <div className="th-av">{initials(t.from)}</div>
                <div className="th-meta">
                  <div className="th-name">{t.from}</div>
                  <div className="th-last">{t.preview}</div>
                </div>
                <div className="th-right">
                  <span className="th-time">{t.time}</span>
                  {t.unread && <span className="th-dot"/>}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="chatwrap">
          <div className="chat-h">
            <div className="op-mini" style={{width:34,height:34,fontSize:13}}>{initials(thread.from)}</div>
            <div className="chat-h-meta">
              <div className="chat-h-name">{thread.from}</div>
              <div className="chat-h-sub">
                <span className="pulse" style={{width:6,height:6}}/>
                {thread.channel} · {thread.subject}
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-ghost btn-sm" onClick={() => toast("Reply sent")}>Reply</button>
              <button className="btn btn-ghost btn-sm" onClick={() => toast("Archived")}>Archive</button>
            </div>
          </div>
          <div className="chat-body" style={{flex:1,overflowY:"auto"}}>
            <div className="daydiv">Today</div>
            {thread.thread.map((m, i) => (
              <div key={i} className={`msg ${m.who}`}>
                {m.who==="op" && <div className="msg-av">O</div>}
                <div className="bubble">{m.text}</div>
              </div>
            ))}
          </div>
          <div className="chat-foot">
            <div className="chat-input">
              <input placeholder={`Reply to ${thread.from}…`} style={{fontSize:13}}
                onKeyDown={e => { if (e.key==="Enter") toast("Message sent"); }}/>
              <button className="send-btn" onClick={() => toast("Message sent")}><Icon name="send" size={14}/></button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ── PAGE: TASKS ───────────────────────────────────────────────────── */
  const renderTasks = () => {
    const tasks   = cid === "A" ? TASKS_A : TASKS_B;
    const pending = tasks.filter(t => !t.done && !doneTasks.has(`${cid}-${tasks.indexOf(t)}`)).length;
    return (
      <div>
        <div className="section-head">
          <div style={{display:"flex",alignItems:"baseline",gap:10}}>
            <span style={{fontFamily:"var(--serif)",fontSize:21,fontWeight:700,color:"var(--ink)"}}>{pending} Tasks Pending</span>
            <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--ink-dim)"}}>{tasks.filter(t=>t.done).length} completed</span>
          </div>
          <div className="filters">
            <button className="filter on">All</button>
            <button className="filter" onClick={() => toast("Showing urgent tasks")}>Urgent</button>
            <button className="filter" onClick={() => toast("Showing tasks due today")}>Due Today</button>
            <button className="filter" onClick={() => toast("New task created")}>+ New Task</button>
          </div>
        </div>
        <div className="card">
          {tasks.map((t, i) => {
            const key  = `${cid}-${i}`;
            const done = doneTasks.has(key) || t.done;
            return (
              <button key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 16px",borderBottom:"1px solid var(--line-2)",width:"100%",textAlign:"left",background:"transparent",cursor:"pointer",transition:".14s"}}
                onClick={() => {
                  if (!t.done) setDoneTasks(prev => { const n=new Set(prev); n.has(key)?n.delete(key):n.add(key); return n; });
                }}>
                <div style={{width:16,height:16,borderRadius:4,border:`1.5px solid ${done?"var(--success)":"var(--line)"}`,flexShrink:0,marginTop:2,display:"flex",alignItems:"center",justifyContent:"center",background:done?"var(--success)":"transparent",transition:".15s"}}>
                  {done && <Icon name="check" size={10}/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,color:done?"var(--ink-dim)":"var(--ink)",textDecoration:done?"line-through":"none",lineHeight:1.4}}>{t.title}</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--ink-dim)",marginTop:3}}>{t.assignee} · {t.due}</div>
                </div>
                <span className={`badge ${t.cls}`} style={{flexShrink:0,marginTop:2}}>{t.priority}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /* ── PAGE: CALENDAR ────────────────────────────────────────────────── */
  const renderCalendar = () => {
    const events = cid === "A" ? CAL_A : CAL_B;
    return (
      <div>
        <div className="section-head">
          <div style={{display:"flex",alignItems:"baseline",gap:10}}>
            <span style={{fontFamily:"var(--serif)",fontSize:21,fontWeight:700,color:"var(--ink)"}}>Today&apos;s Schedule</span>
            <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--ink-dim)"}}>
              {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}
            </span>
          </div>
          <div className="filters">
            <button className="filter on">Today</button>
            <button className="filter" onClick={() => toast("Week view")}>This Week</button>
            <button className="filter" onClick={() => toast("Event added")}>+ New Event</button>
          </div>
        </div>
        <div className="card">
          <div className="sched">
            {events.map((ev, i) => (
              <div key={i} className={`sched-row${ev.status==="Confirmed"?" accent":""}`} onClick={() => toast(`${ev.title} — ${ev.status}`)}>
                <div className="sched-time">{ev.time}<span>{ev.type}</span></div>
                <div>
                  <div className="sched-title">{ev.title}</div>
                  <div className="sched-sub">{ev.sub}</div>
                </div>
                <span className={`badge ${ev.cls}`}>{ev.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ── PAGE: PIPELINE ────────────────────────────────────────────────── */
  const renderPipeline = () => (
    <div>
      <div className="section-head">
        <span style={{fontFamily:"var(--serif)",fontSize:21,fontWeight:700,color:"var(--ink)"}}>Sales Pipeline</span>
        <div className="filters">
          <button className="filter on">Active</button>
          <button className="filter" onClick={() => toast("All leads view")}>All Leads</button>
          <button className="filter" onClick={() => toast("Lead added to pipeline")}>+ Add Lead</button>
        </div>
      </div>
      <div className="kanban">
        {PIPE_A.map((col, i) => (
          <div key={i} className="k-col">
            <div className="k-col-h">
              {col.stage}
              <span className="k-cnt">{col.items.length}</span>
            </div>
            <div className="k-cards">
              {col.items.map((card, j) => (
                <div key={j} className="k-card" onClick={() => toast(`${card.name} — ${card.note}`)}>
                  <div className="k-name">{card.name}</div>
                  <div className="k-detail">{card.budget}</div>
                  <div className="k-detail">{card.note}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── PAGE: PROJECTS ────────────────────────────────────────────────── */
  const renderProjects = () => (
    <div>
      <div className="section-head">
        <span style={{fontFamily:"var(--serif)",fontSize:21,fontWeight:700,color:"var(--ink)"}}>Active Projects</span>
        <div className="filters">
          <button className="filter on">All</button>
          <button className="filter" onClick={() => toast("Active projects")}>Active</button>
          <button className="filter" onClick={() => toast("New project created")}>+ New Project</button>
        </div>
      </div>
      <div className="card">
        <table className="table" style={{width:"100%"}}>
          <thead>
            <tr><th>Project</th><th>Type</th><th>Orders</th><th>Deadline</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {PROJECTS_B.map((p, i) => (
              <tr key={i} onClick={() => toast(`${p.name} — ${p.orders} orders · ${p.status}`)}>
                <td style={{fontWeight:600}}>{p.name}</td>
                <td style={{color:"var(--ink-dim)",fontSize:12}}>{p.type}</td>
                <td style={{fontFamily:"var(--mono)",fontSize:12,textAlign:"center"}}>{p.orders}</td>
                <td style={{fontFamily:"var(--mono)",fontSize:12,color:"var(--ink-dim)"}}>{p.deadline}</td>
                <td><span className={`badge ${p.cls}`}>{p.status}</span></td>
                <td><button className="btn btn-ghost btn-sm" onClick={e=>{e.stopPropagation();toast(`Opening ${p.name}`);}}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ── PAGE: DOCUMENTS ───────────────────────────────────────────────── */
  const renderDocuments = () => (
    <div>
      <div className="section-head">
        <span style={{fontFamily:"var(--serif)",fontSize:21,fontWeight:700,color:"var(--ink)"}}>Documents</span>
        <div className="filters">
          <button className="filter on">All</button>
          <button className="filter" onClick={() => toast("Missing documents")}>Missing</button>
          <button className="filter" onClick={() => toast("Documents ready to deliver")}>Ready</button>
          <button className="filter" onClick={() => toast("Document upload opened")}>+ Upload</button>
        </div>
      </div>
      <div className="card">
        <table className="table" style={{width:"100%"}}>
          <thead>
            <tr><th>Document</th><th>Order</th><th>Type</th><th>Status</th><th>Pages</th><th>Date</th><th></th></tr>
          </thead>
          <tbody>
            {DOCS_B.map((d, i) => (
              <tr key={i} onClick={() => toast(`${d.name} — ${d.status}`)}>
                <td style={{fontWeight:600,fontSize:12.5}}>
                  <span style={{display:"inline-flex",alignItems:"center",gap:6}}>
                    <Icon name="doc" size={13}/>{d.name}
                  </span>
                </td>
                <td className="rid">{d.order}</td>
                <td style={{color:"var(--ink-dim)",fontSize:12}}>{d.type}</td>
                <td><span className={`badge ${d.cls}`}>{d.status}</span></td>
                <td style={{fontFamily:"var(--mono)",fontSize:12,color:"var(--ink-dim)",textAlign:"center"}}>{d.pages}</td>
                <td style={{fontFamily:"var(--mono)",fontSize:11.5,color:"var(--ink-dim)"}}>{d.date}</td>
                <td><button className="btn btn-ghost btn-sm" onClick={e=>{e.stopPropagation();toast(`Opening ${d.name}`);}}>Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  /* ── PAGE: ESCALATIONS ─────────────────────────────────────────────── */
  const renderEscalations = () => (
    <div>
      <div className="section-head">
        <div style={{display:"flex",alignItems:"baseline",gap:10}}>
          <span style={{fontFamily:"var(--serif)",fontSize:21,fontWeight:700,color:"var(--ink)"}}>Open Escalations</span>
          <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--danger)"}}>{cfg.escs.length} require action</span>
        </div>
        <div className="filters">
          <button className="filter on">Open</button>
          <button className="filter" onClick={() => toast("Resolved escalations")}>Resolved</button>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {cfg.escs.map((esc, i) => (
          <div key={i} className="card" style={{borderColor:"rgba(207,64,48,.3)",borderLeftWidth:4,borderLeftStyle:"solid",borderLeftColor:"var(--danger)"}}>
            <div className="card-h" style={{background:"rgba(207,64,48,.04)"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:"var(--danger)",display:"inline-flex"}}><Icon name="warning" size={16}/></span>
                <span style={{fontFamily:"var(--serif)",fontSize:16,fontWeight:700,color:"var(--ink)"}}>{esc.title}</span>
              </div>
              <span className="badge b-escalated">ESCALATED</span>
            </div>
            <div style={{padding:"16px 18px"}}>
              <p style={{fontSize:13.5,color:"var(--ink-2)",lineHeight:1.6,marginBottom:12}}>{esc.body}</p>
              <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--teal-ink)",background:"var(--teal-soft)",padding:"8px 12px",borderRadius:6,marginBottom:14,lineHeight:1.5}}>
                Operator recommendation: {esc.rec}
              </div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {esc.actions.map(action => (
                  <button key={action} className="btn btn-ghost btn-sm btn-danger" onClick={() => toast(`${action} — reviewing escalation`)}>{action}</button>
                ))}
                <button className="btn btn-ghost btn-sm" onClick={() => toast("Escalation marked resolved")}>Mark Resolved</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── PAGE: REPORTS ─────────────────────────────────────────────────── */
  const renderReports = () => {
    const kpis  = cid === "A" ? REPORTS_A : REPORTS_B;
    const label = cid === "A" ? "Real Estate Performance" : "Title Operations Summary";
    return (
      <div>
        <div className="section-head">
          <div style={{display:"flex",alignItems:"baseline",gap:10}}>
            <span style={{fontFamily:"var(--serif)",fontSize:21,fontWeight:700,color:"var(--ink)"}}>{label}</span>
            <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--ink-dim)"}}>Month to date</span>
          </div>
          <div className="filters">
            <button className="filter on">This Month</button>
            <button className="filter" onClick={() => toast("Last month data loaded")}>Last Month</button>
            <button className="filter" onClick={() => toast("Report exported")}>Export</button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
          {kpis.map((k, i) => (
            <div key={i} className="card" style={{padding:"18px 20px",cursor:"pointer"}} onClick={() => toast(k.label)}>
              <div style={{fontFamily:"var(--mono)",fontSize:26,fontWeight:700,color:"var(--teal-ink)",lineHeight:1}}>{k.value}</div>
              <div style={{fontSize:12.5,color:"var(--ink-2)",marginTop:7}}>{k.label}</div>
              <div style={{fontFamily:"var(--mono)",fontSize:10.5,marginTop:5,color:k.up?"var(--success)":"var(--danger)",display:"inline-flex",alignItems:"center",gap:4}}>
                <Icon name={k.up?"trending_up":"trending_dn"} size={11}/>{k.delta}
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-h"><h2>Activity Log</h2><span className="sub">Today</span></div>
          <div className="sched">
            {cfg.acts.map((a, i) => (
              <div key={i} className="sched-row" onClick={() => toast(a.desc)}>
                <div className="sched-time">{a.time}<span>{new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span></div>
                <div><div className="sched-title" style={{fontSize:13}}>{a.desc}</div></div>
                <span className={`badge ${a.cls}`}>{a.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ── RENDER ────────────────────────────────────────────────────────── */
  return (
    <div style={theme as React.CSSProperties} className="app">

      {/* SIDEBAR */}
      <aside className="side">
        <div className="brand">
          <div className="brand-badge">O</div>
          <div className="brand-meta">
            <span className="brand-name">Operator</span>
            <span className="brand-status"><span className="pulse"/>Running · Active</span>
          </div>
        </div>

        <div className="nav-sec">Workspace</div>
        <nav className="nav">
          {cfg.nav.map(item => (
            <button key={item.id} className={`nav-item${activePage===item.id?" active":""}`}
              onClick={() => navigate(item.id)}>
              <Icon name={item.ico} size={17}/>
              <span className="lbl">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="side-foot">
          <button className="nav-item" onClick={() => toast("Settings")}>
            <Icon name="gear" size={17}/><span className="lbl">Settings</span>
          </button>
          <div className="account">
            <div className="avatar">OP</div>
            <div className="account-meta">
              <span className="account-name">Operator</span>
              <span className="account-co">{cid==="A"?"Real Estate · Active":"Title Operations · Active"}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
        <header className="topbar">
          <div className="tb-title">
            <span className="tb-eyebrow">{cfg.eyebrow}</span>
            <span className="tb-h">{activeNav.label}</span>
          </div>
          <div className="tb-spacer"/>
          <div className="search">
            <Icon name="search" size={13}/>
            <input placeholder="Search…" readOnly/>
          </div>
          <span className="monitor"><span className="pulse"/>{cfg.statusChip}</span>
          <span className="clock">{clock}<span className="z"> LOCAL</span></span>
          <div className="ab-toggle">
            <button className={`ab-seg${cid==="A"?" ab-on":""}`} onClick={() => switchClient("A")}>A</button>
            <button className={`ab-seg${cid==="B"?" ab-on":""}`} onClick={() => switchClient("B")}>B</button>
          </div>
        </header>

        <div className="view" style={{opacity:fading?0:1,transition:"opacity .2s ease"}}>
          {activePage==="home"        && renderHome()}
          {activePage==="leads"       && renderLeads()}
          {activePage==="orders"      && renderOrders()}
          {activePage==="inbox"       && renderInbox()}
          {activePage==="tasks"       && renderTasks()}
          {activePage==="calendar"    && renderCalendar()}
          {activePage==="pipeline"    && renderPipeline()}
          {activePage==="projects"    && renderProjects()}
          {activePage==="documents"   && renderDocuments()}
          {activePage==="escalations" && renderEscalations()}
          {activePage==="reports"     && renderReports()}
        </div>
      </div>

      {/* TOASTS */}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            <span style={{color:"var(--teal-2)",display:"inline-flex"}}><Icon name="check" size={15}/></span>
            {t.msg}
          </div>
        ))}
      </div>

    </div>
  );
}
