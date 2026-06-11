'use client';
/* Operator Console — pages that aren't covered by the showcase concepts:
   Schedule, Channels, Records, Settings. All driven by the industry data. */

import React, { useState } from 'react';
import { useIndustry, OpIcon, ChannelDot, channelColor, useDetail, clickProps } from './shared';
import { OP_CHANNELS } from './data';

const CHAN_ICON: Record<string, string> = { Email: 'mail', WhatsApp: 'whatsapp', SMS: 'phone', Shopify: 'ecommerce', 'Wholesale Form': 'drafts', QuickBooks: 'finance', 'Google Calendar': 'calendar' };
const CHAN_REPLY: Record<string, string> = { Email: '4 min', WhatsApp: '40 s', SMS: '38 s', Shopify: 'auto', 'Wholesale Form': '6 min', QuickBooks: 'auto', 'Google Calendar': '2 min' };

/* ── Schedule ─────────────────────────────────────────────── */
export function PageSchedule() {
  const { data } = useIndustry();
  const { open } = useDetail();
  const p = data.persona;
  const overnight = data.events.filter((e) => /overnight|waitlist|filled/i.test(e.who)).length;
  return (
    <div className="con-page">
      <div className="con-aura-wrap"><div className="op-aura" /></div>
      <div className="con-page-head">
        <div className="con-page-lede">
          <span className="op-eyebrow">Today · {data.date}</span>
          <h1 className="con-page-title">{data.events.length} on the calendar — <span className="op-em">{overnight} booked overnight</span>.</h1>
        </div>
        <button className="op-cta" onClick={() => open({
          title: 'New booking', subtitle: p.company, tag: { tone: 'info', label: 'Scheduler' },
          rows: [{ k: 'Owner', v: p.name }, { k: 'Default length', v: '30 min' }, { k: 'Booked by', v: 'Operator (auto-confirm on)' }],
          body: 'The Operator finds an open slot, books it, and sends the confirmation for you.',
          actions: [{ label: 'Create booking', primary: true }, { label: 'Cancel' }],
        })}><OpIcon name="calendar" size={16} />New booking</button>
      </div>
      <div className="con-card">
        <div className="con-card-head"><h2>Agenda</h2><span className="con-card-meta"><span className="op-livedot op-livedot--teal" />Synced by the Operator</span></div>
        <div className="con-agenda">
          {data.events.map((e, i) => (
            <div key={i} className={'con-ag-row is-clickable' + (e.tone === 'accent' ? ' is-accent' : '')}
              {...clickProps(() => open({
                title: e.title, subtitle: e.t + ' · ' + data.date,
                tag: { tone: e.tone === 'accent' ? 'warning' : 'info', label: e.tone === 'accent' ? 'Priority' : 'Scheduled' },
                rows: [{ k: 'Time', v: e.t }, { k: 'Source', v: e.who }, { k: 'Owner', v: p.name }, { k: 'Location', v: 'Video · link sent' }],
                body: 'Booked and confirmed by the Operator. Reminders go out automatically 24h and 1h before.',
                actions: [{ label: 'Reschedule', primary: true }, { label: 'Cancel event' }],
              }))}>
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
  const { open } = useDetail();
  const channels = OP_CHANNELS(data);
  const draftsOn = (c: string) => data.drafts.filter((d) => d.channel === c);
  return (
    <div className="con-page">
      <div className="con-page-head">
        <div className="con-page-lede">
          <span className="op-eyebrow">Where the Operator talks to the world</span>
          <h1 className="con-page-title">{channels.length} live channels, <span className="op-em">one inbox</span>.</h1>
        </div>
        <button className="op-ghost" onClick={() => open({
          title: 'Configure channels', tag: { tone: 'info', label: 'Settings' },
          rows: channels.map((c) => ({ k: c, v: 'Connected · active' })),
          body: 'Connect or pause a channel, set business hours, and choose which ones the Operator can send on without sign-off.',
          actions: [{ label: 'Manage connections', primary: true }, { label: 'Close' }],
        })}><OpIcon name="settings" size={15} />Configure</button>
      </div>

      <div className="con-grid-3">
        {channels.map((c, i) => {
          const ds = draftsOn(c);
          const latest = ds[0];
          return (
            <div key={i} className="con-chan-card is-clickable"
              style={{ ['--ch-c' as string]: channelColor(c) } as React.CSSProperties}
              {...clickProps(() => open({
                title: c, subtitle: 'Channel · ' + data.persona.company, tag: { tone: 'success', label: 'Active' },
                meta: ds.length + ' awaiting sign-off',
                rows: [
                  { k: 'Status', v: 'Connected' },
                  { k: 'Awaiting sign-off', v: String(ds.length) },
                  { k: 'Avg reply', v: CHAN_REPLY[c] || '< 2 min' },
                  { k: 'Latest', v: latest ? latest.subj : 'No queue right now' },
                ],
                body: 'The Operator monitors ' + c + ' around the clock, drafts replies, and routes anything sensitive to you.',
                actions: [{ label: 'Open inbox', primary: true }, { label: 'Pause channel' }],
              }))}>
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
            <div key={i} className="con-flow is-clickable"
              {...clickProps(() => open({
                title: f.name, subtitle: 'Automation', tag: { tone: f.state === 'live' ? 'success' : 'info', label: f.state === 'live' ? 'Autonomous' : 'Scheduled' },
                rows: [{ k: 'State', v: f.state === 'live' ? 'Running autonomously' : 'Scheduled' }, { k: 'Last run', v: f.last }, { k: 'Errors', v: '0' }],
                body: 'Runs without supervision. The Operator only pings you if it hits something it can’t resolve on its own.',
                actions: [{ label: 'View run history', primary: true }, { label: 'Pause' }],
              }))}>
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
  const { open } = useDetail();
  const maxV = Math.max(...data.pipeline.map((s) => s.value));
  const cats = ['var(--color-mint)', 'var(--color-violet)', 'var(--color-amber)', 'var(--color-coral)'];
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
          <div key={i} className={'con-kpi is-clickable' + (k.accent ? ' is-accent' : '')}
            {...clickProps(() => open({
              title: k.label, subtitle: data.persona.company,
              tag: { tone: k.tone === 'up' ? 'success' : 'info', label: k.tone === 'up' ? 'Trending up' : 'This week' },
              rows: [{ k: 'Current', v: k.value + (k.unit ? ' ' + k.unit : '') }, { k: 'Change', v: k.delta }, { k: 'Window', v: 'Last 7 days' }],
              body: 'Computed live from the Operator’s activity. Tap through in the demo to show how each metric is driven.',
            }))}>
            <div className="con-kpi-label">{k.label}</div>
            <div className="con-kpi-val">{k.value}{k.unit && <span style={{ fontSize: 16, marginLeft: 2 }}>{k.unit}</span>}</div>
            <div className={'con-kpi-delta' + (k.tone === 'up' ? ' up' : '')}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div className="con-grid-2">
        <div className="con-card">
          <div className="con-card-head"><h2>Pipeline</h2><span className="con-card-meta">live</span></div>
          <div className="con-card-body">
            <div className="op-funnel">
              {data.pipeline.map((s, i) => (
                <div key={i} className="op-funnel-row is-clickable"
                  style={{ ['--fc' as string]: cats[i % cats.length] } as React.CSSProperties}
                  {...clickProps(() => open({
                    title: s.stage, subtitle: 'Pipeline stage', tag: { tone: 'info', label: s.value + ' in stage' },
                    rows: [{ k: 'Count', v: String(s.value) }, { k: 'Share of top', v: Math.round((s.value / maxV) * 100) + '%' }, { k: 'Owner', v: data.persona.name }],
                    body: 'Records the Operator has moved into “' + s.stage + '”. Click any record in the demo to open its full history.',
                    actions: [{ label: 'View records', primary: true }, { label: 'Close' }],
                  }))}>
                  <span className="op-funnel-label">{s.stage}</span>
                  <div className="op-funnel-track"><div className={'op-funnel-fill' + (i === data.pipeline.length - 1 ? ' is-accent' : '')} style={{ width: Math.max(8, (s.value / maxV) * 100) + '%' }} /></div>
                  <span className="op-funnel-val">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="con-card">
          <div className="con-card-head"><h2>Drafts awaiting your sign-off</h2><span className="con-card-meta">{data.drafts.length} waiting</span></div>
          <div className="con-card-body" style={{ padding: 0 }}>
            <table className="con-table">
              <thead><tr><th>Contact</th><th>Channel</th><th>Subject</th><th>Status</th></tr></thead>
              <tbody>
                {data.drafts.map((d, i) => (
                  <tr key={i} className="is-clickable"
                    {...clickProps(() => open({
                      title: d.who, subtitle: d.co,
                      tag: d.flag ? { tone: 'warning', label: d.flag } : { tone: 'info', label: d.channel },
                      meta: 'Drafted ' + d.when,
                      rows: [{ k: 'Channel', v: d.channel }, { k: 'Subject', v: d.subj }, { k: 'Status', v: d.flag || 'Queued' }],
                      body: d.preview,
                      actions: [{ label: 'Approve & send', primary: true }, { label: 'Edit' }, { label: 'Reject' }],
                    }))}>
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
  const { open } = useDetail();
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
        <div className="con-set-row is-clickable" {...clickProps(() => open({
          title: 'Client', subtitle: p.company, tag: { tone: 'success', label: 'Active' },
          rows: [{ k: 'Company', v: p.company }, { k: 'Industry', v: data.tagline }, { k: 'Plan', v: 'Operator · full autonomy' }],
          body: 'The whole console repopulates from this client’s data model.',
          actions: [{ label: 'Edit client', primary: true }, { label: 'Close' }],
        }))}><div><div className="con-set-label">Client</div><div className="con-set-desc">{p.company} · {data.tagline}</div></div><span className="con-pill on">Active</span></div>
        <div className="con-set-row is-clickable" {...clickProps(() => open({
          title: p.name, subtitle: p.role + ' · ' + p.company, tag: { tone: 'info', label: 'Owner' },
          rows: [{ k: 'Name', v: p.name }, { k: 'Role', v: p.role }, { k: 'Operator streak', v: data.streak }],
          body: 'Escalations and sign-offs route to the owner.',
          actions: [{ label: 'Manage access', primary: true }, { label: 'Close' }],
        }))}><div><div className="con-set-label">Owner</div><div className="con-set-desc">{p.name} · {p.role}</div></div><span className="con-card-meta">{data.streak}</span></div>
        <div className="con-set-row is-clickable" {...clickProps(() => open({
          title: 'Operator uptime', tag: { tone: 'success', label: 'Healthy' },
          rows: [{ k: 'Uptime', v: data.streak }, { k: 'Errors', v: '0' }, { k: 'Last incident', v: 'None' }],
          body: 'The Operator has been running continuously with zero errors.',
        }))}><div><div className="con-set-label">Operator uptime</div><div className="con-set-desc">{data.streak} · 0 errors</div></div><span className="con-pill on">Healthy</span></div>
      </div>
    </div>
  );
}
