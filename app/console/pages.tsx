'use client';
/* Operator Console — pages that aren't covered by the showcase concepts:
   Schedule, Channels, Records, Settings. All driven by the industry data. */

import React, { useState } from 'react';
import { useIndustry, OpIcon, Funnel, ChannelDot } from './shared';
import { OP_CHANNELS } from './data';

const CHAN_ICON: Record<string, string> = { Email: 'mail', WhatsApp: 'whatsapp', SMS: 'phone' };
const CHAN_REPLY: Record<string, string> = { Email: '4 min', WhatsApp: '40 s', SMS: '38 s' };

/* ── Schedule ─────────────────────────────────────────────── */
export function PageSchedule() {
  const { data } = useIndustry();
  const overnight = data.events.filter((e) => /overnight|waitlist|filled/i.test(e.who)).length;
  return (
    <div className="con-page">
      <div className="con-aura-wrap"><div className="op-aura" /></div>
      <div className="con-page-head">
        <div className="con-page-lede">
          <span className="op-eyebrow">Today · {data.date}</span>
          <h1 className="con-page-title">{data.events.length} on the calendar — <span className="op-em">{overnight} booked overnight</span>.</h1>
        </div>
        <button className="op-cta"><OpIcon name="calendar" size={16} />New booking</button>
      </div>
      <div className="con-card">
        <div className="con-card-head"><h2>Agenda</h2><span className="con-card-meta"><span className="op-livedot op-livedot--teal" />Synced by the Operator</span></div>
        <div className="con-agenda">
          {data.events.map((e, i) => (
            <div key={i} className={'con-ag-row' + (e.tone === 'accent' ? ' is-accent' : '')}>
              <span className="con-ag-time">{e.t}</span>
              <div>
                <div className="con-ag-title">{e.title}</div>
                <div className="con-ag-who">{e.who}</div>
              </div>
              <span className={'con-ag-tag' + (e.tone === 'accent' ? ' is-accent' : '')}>{e.tone === 'accent' ? 'Priority' : 'Scheduled'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Channels ─────────────────────────────────────────────── */
export function PageChannels() {
  const { data } = useIndustry();
  const channels = OP_CHANNELS(data);
  const draftsOn = (c: string) => data.drafts.filter((d) => d.channel === c);
  return (
    <div className="con-page">
      <div className="con-page-head">
        <div className="con-page-lede">
          <span className="op-eyebrow">Where the Operator talks to the world</span>
          <h1 className="con-page-title">{channels.length} live channels, <span className="op-em">one inbox</span>.</h1>
        </div>
        <button className="op-ghost"><OpIcon name="settings" size={15} />Configure</button>
      </div>

      <div className="con-grid-3">
        {channels.map((c, i) => {
          const ds = draftsOn(c);
          const latest = ds[0];
          return (
            <div key={i} className="con-chan-card">
              <div className="con-chan-top">
                <span className="con-chan-ico"><OpIcon name={CHAN_ICON[c] || 'mail'} size={18} /></span>
                <span className="con-chan-name">{c}</span>
                <span className="con-pill on">Active</span>
              </div>
              <div className="con-chan-note">{latest ? 'Latest: ' + latest.subj : 'Monitoring — no queue right now.'}</div>
              <div className="con-chan-metrics">
                <div><div className="con-metric-v">{ds.length}</div><div className="con-metric-l">Awaiting sign-off</div></div>
                <div><div className="con-metric-v">{CHAN_REPLY[c] || '< 2 min'}</div><div className="con-metric-l">Avg reply</div></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="con-card">
        <div className="con-card-head"><h2>Automations</h2><span className="con-card-meta">{data.flows.filter((f) => f.state === 'live').length} running</span></div>
        <div className="con-card-body" style={{ paddingTop: 4, paddingBottom: 4 }}>
          {data.flows.map((f, i) => (
            <div key={i} className="con-flow">
              <span className={'con-flow-state ' + f.state} />
              <span className="con-flow-name">{f.name}</span>
              <span className="con-flow-last">{f.last}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Records ──────────────────────────────────────────────── */
export function PageRecords() {
  const { data } = useIndustry();
  return (
    <div className="con-page">
      <div className="con-page-head">
        <div className="con-page-lede">
          <span className="op-eyebrow">Pipeline &amp; sign-offs</span>
          <h1 className="con-page-title">What's <span className="op-em">in motion</span>, and what needs you.</h1>
        </div>
      </div>

      <div className="con-kpis">
        {data.kpis.map((k, i) => (
          <div key={i} className={'con-kpi' + (k.accent ? ' is-accent' : '')}>
            <div className="con-kpi-label">{k.label}</div>
            <div className="con-kpi-val">{k.value}{k.unit && <span style={{ fontSize: 16, marginLeft: 2 }}>{k.unit}</span>}</div>
            <div className={'con-kpi-delta' + (k.tone === 'up' ? ' up' : '')}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="con-grid-2">
        <div className="con-card">
          <div className="con-card-head"><h2>Pipeline</h2><span className="con-card-meta">live</span></div>
          <div className="con-card-body"><Funnel stages={data.pipeline} /></div>
        </div>
        <div className="con-card">
          <div className="con-card-head"><h2>Drafts awaiting your sign-off</h2><span className="con-card-meta">{data.drafts.length} waiting</span></div>
          <div className="con-card-body" style={{ padding: 0 }}>
            <table className="con-table">
              <thead><tr><th>Contact</th><th>Channel</th><th>Subject</th><th>Status</th></tr></thead>
              <tbody>
                {data.drafts.map((d, i) => (
                  <tr key={i}>
                    <td><div className="who">{d.who}</div><div className="sub">{d.co}</div></td>
                    <td><ChannelDot channel={d.channel} /></td>
                    <td>{d.subj}</td>
                    <td>{d.flag ? <span className="con-flag">{d.flag}</span> : <span className="sub">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Settings ─────────────────────────────────────────────── */
function SetToggle({ label, desc, on }: { label: string; desc: string; on: boolean }) {
  const [v, setV] = useState(on);
  return (
    <div className="con-set-row">
      <div><div className="con-set-label">{label}</div><div className="con-set-desc">{desc}</div></div>
      <button className={'con-toggle' + (v ? ' on' : '')} role="switch" aria-checked={v} onClick={() => setV(!v)} />
    </div>
  );
}
export function PageSettings() {
  const { data } = useIndustry();
  const p = data.persona;
  return (
    <div className="con-page">
      <div className="con-page-head">
        <div className="con-page-lede">
          <span className="op-eyebrow">Workspace</span>
          <h1 className="con-page-title">How much the Operator runs <span className="op-em">on its own</span>.</h1>
        </div>
      </div>
      <div className="con-grid-2">
        <div className="con-card">
          <div className="con-card-head"><h2>Autonomy</h2></div>
          <SetToggle label="Auto-reply to inbound" desc="Draft and send routine replies without asking" on={true} />
          <SetToggle label="Auto-book &amp; confirm" desc="Schedule and confirm appointments end-to-end" on={true} />
          <SetToggle label="Auto-recover" desc="Re-engage cold leads and no-shows automatically" on={true} />
          <SetToggle label="Hold sensitive replies" desc="Escalate anything high-stakes for your sign-off" on={false} />
        </div>
        <div className="con-card">
          <div className="con-card-head"><h2>Hours &amp; notifications</h2></div>
          <SetToggle label="After-hours autonomy" desc="Keep working overnight, 22:00–07:00" on={true} />
          <SetToggle label="Weekend operation" desc="Run reduced sweeps on weekends" on={false} />
          <SetToggle label="Morning brief" desc={'Daily summary at 7:00 AM for ' + p.name.split(' ')[0]} on={true} />
          <SetToggle label="Escalation alerts" desc="Ping me the moment something needs a human" on={true} />
        </div>
      </div>
      <div className="con-card">
        <div className="con-card-head"><h2>Workspace</h2></div>
        <div className="con-set-row"><div><div className="con-set-label">Client</div><div className="con-set-desc">{p.company} · {data.tagline}</div></div><span className="con-pill on">Active</span></div>
        <div className="con-set-row"><div><div className="con-set-label">Owner</div><div className="con-set-desc">{p.name} · {p.role}</div></div><span className="con-card-meta">{data.streak}</span></div>
        <div className="con-set-row"><div><div className="con-set-label">Operator uptime</div><div className="con-set-desc">{data.streak} · 0 errors</div></div><span className="con-pill on">Healthy</span></div>
      </div>
    </div>
  );
}
