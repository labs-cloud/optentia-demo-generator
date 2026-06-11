'use client';
/* Operator Demo Generator — showcase concept screens.
   Command Center · Conversation · Activity stream · and the three agent graphs
   (Mesh / Orbit / Flow). Ported from the concept-*.jsx prototypes. */

import React, { useState, useEffect } from 'react';
import {
  useIndustry, IndustrySwitcher, OpIcon, Tag, ChannelDot, Sparkline, HoursRing,
  useDetail, clickProps,
} from './shared';
import {
  OperatorMark, useGraphTheme, GraphThemeSwitcher, GLegend, GEdge,
  gPathV, gPathH, gLine, gPolar, useTick,
} from './graph';
import { OP_TONE, OP_TEAMS, OP_CHANNELS, type Industry } from './data';

/* ── Concept 1 · Live Command Center ───────────────────────── */
export function ConceptCommand({ embedded }: { embedded?: boolean }) {
  const { data } = useIndustry();
  const { open } = useDetail();
  const p = data.persona;
  const spark = [22, 26, 24, 30, 28, 34, 33, 40, 44];
  // Vibrant category colors — one per stat tile (mint · violet · amber · coral).
  const cats = ['var(--color-mint)', 'var(--color-violet)', 'var(--color-amber)', 'var(--color-coral)'];

  return (
    <div className="op-shell cc">
      <div className="op-aura" />
      <div className="cc-inner">

        {!embedded && (
        <header className="cc-top">
          <div className="cc-brand">
            <OperatorMark size={30} color="var(--color-text-strong)" />
            <div className="cc-brand-meta">
              <span className="cc-brand-name">Operator</span>
              <span className="cc-brand-status"><span className="op-livedot" />Running · {data.streak}</span>
            </div>
          </div>
          <IndustrySwitcher />
        </header>
        )}

        <div className="cc-title">
          <div>
            <span className="op-eyebrow">Today · {data.date}</span>
            <h1 className="cc-h1">Good morning, {p.name.split(' ')[0]}.</h1>
            <span className="cc-sub">{p.role} · {p.company}</span>
          </div>
          <div className="cc-actions">
            <div className="cc-search is-clickable" {...clickProps(() => open({
              title: 'Search', subtitle: p.company, tag: { tone: 'info', label: 'Operator' },
              rows: [{ k: 'Threads', v: 'All channels' }, { k: 'Drafts', v: String(data.drafts.length) }, { k: 'Deals', v: 'Live pipeline' }],
              body: 'Ask the Operator anything across threads, drafts, and deals — it answers from everything it’s working.',
            }))}><OpIcon name="search" size={16} /><span>Search threads, drafts, deals…</span></div>
            <button className="op-cta" onClick={() => open({
              title: 'Run a workflow', tag: { tone: 'info', label: 'Workflows' },
              rows: data.flows.map((f) => ({ k: f.name, v: f.state === 'live' ? 'Autonomous' : 'Scheduled' })),
              body: 'Kick off any workflow on demand, or let the Operator keep running them on its own.',
              actions: [{ label: 'Run now', primary: true }, { label: 'Cancel' }],
            })}><OpIcon name="zap" size={16} />Run a workflow</button>
          </div>
        </div>

        {/* Vibrant signature: full-width gradient "Daily briefing" hero */}
        <div className="cc-brief is-clickable" {...clickProps(() => open({
          title: 'Daily briefing', subtitle: data.date, tag: { tone: 'info', label: '✦ Operator' },
          rows: [{ k: 'Actions overnight', v: String(data.log.length + 10) }, { k: 'Errors', v: '0' }, { k: 'Streak', v: data.streak }],
          body: data.briefLede,
        }))}>
          <div className="cc-brief-top">
            <span className="cc-brief-label">Daily briefing</span>
            <span className="cc-brief-badge"><OperatorMark size={12} variant="cream" /> Operator</span>
          </div>
          <p className="cc-brief-text">{data.briefLede}</p>
        </div>

        <section className="cc-kpis">
          {data.kpis.map((k, i) => (
            <div key={i} className={'cc-kpi is-clickable' + (k.accent ? ' is-accent' : '')}
              style={{ ['--kpi-c' as string]: cats[i % cats.length] } as React.CSSProperties}
              {...clickProps(() => open({
                title: k.label, subtitle: p.company,
                tag: { tone: k.tone === 'up' ? 'success' : 'info', label: k.tone === 'up' ? 'Trending up' : 'This week' },
                rows: [{ k: 'Current', v: k.value + (k.unit ? ' ' + k.unit : '') }, { k: 'Change', v: k.delta }, { k: 'Window', v: 'Last 7 days' }],
                body: 'Driven live by the Operator’s activity this week.',
              }))}>
              <span className="cc-kpi-label">{k.label}</span>
              <span className="cc-kpi-value">{k.value}{k.unit && <span className="cc-kpi-unit">{k.unit}</span>}</span>
              <div className="cc-kpi-foot">
                <span className={'cc-kpi-delta' + (k.tone === 'up' ? ' is-up' : '')}>{k.delta}</span>
                {k.accent && <Sparkline points={spark} w={86} h={28} accent />}
              </div>
            </div>
          ))}
        </section>

        <div className="cc-main">
          <section className="cc-card cc-log">
            <header className="cc-card-head">
              <h2 className="cc-h2">What it ran <span className="op-em">today</span></h2>
              <span className="cc-meta"><span className="op-livedot op-livedot--teal" />{data.log.length + 10} actions · 0 errors</span>
            </header>
            <div className="cc-log-body">
              {data.log.map(([t, status, msg], i) => (
                <div key={i} className="cc-log-line is-clickable"
                  {...clickProps(() => open({
                    title: status + ' · ' + t, tag: { tone: OP_TONE(status), label: status },
                    rows: [{ k: 'Time', v: t }, { k: 'Outcome', v: status }, { k: 'Run by', v: 'Operator' }],
                    body: msg,
                    actions: status === 'Review' ? [{ label: 'Review now', primary: true }, { label: 'Close' }]
                      : status === 'Failed' ? [{ label: 'Reconnect', primary: true }, { label: 'Close' }]
                      : undefined,
                  }))}>
                  <span className="cc-log-time">{t}</span>
                  <Tag tone={OP_TONE(status)}>{status}</Tag>
                  <span className="cc-log-msg">{msg}</span>
                </div>
              ))}
            </div>
            <footer className="cc-card-foot"><a href="#" onClick={(e) => { e.preventDefault(); open({
              title: 'Full activity log', subtitle: data.date, meta: (data.log.length + 10) + ' actions · 0 errors',
              rows: data.log.map(([t, status]) => ({ k: t, v: status })),
              body: 'Every action the Operator took today, oldest to newest.',
            }); }}>See full activity log</a><OpIcon name="arrowRight" size={13} /></footer>
          </section>

          <aside className="cc-rail">
            <section className="cc-card cc-rail-card">
              <header className="cc-card-head cc-card-head--tight"><h3 className="cc-h3">Today</h3><span className="cc-meta">{data.events.length} events</span></header>
              <div className="cc-events">
                {data.events.map((e, i) => (
                  <div key={i} className={'cc-event is-clickable' + (e.tone === 'accent' ? ' is-accent' : '')}
                    {...clickProps(() => open({
                      title: e.title, subtitle: e.t + ' · ' + data.date,
                      tag: { tone: e.tone === 'accent' ? 'warning' : 'info', label: e.tone === 'accent' ? 'Priority' : 'Scheduled' },
                      rows: [{ k: 'Time', v: e.t }, { k: 'Source', v: e.who }, { k: 'Owner', v: p.name }],
                      body: 'Booked and confirmed by the Operator.',
                      actions: [{ label: 'Reschedule', primary: true }, { label: 'Cancel' }],
                    }))}>
                    <span className="cc-event-time">{e.t}</span>
                    <div>
                      <span className="cc-event-title">{e.title}</span>
                      <span className="cc-event-who">{e.who}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="cc-card cc-rail-card">
              <header className="cc-card-head cc-card-head--tight"><h3 className="cc-h3">Workflows</h3><span className="cc-meta">{data.flows.length} active</span></header>
              <div className="cc-flows">
                {data.flows.map((f, i) => (
                  <div key={i} className="cc-flow is-clickable"
                    {...clickProps(() => open({
                      title: f.name, subtitle: 'Workflow',
                      tag: { tone: f.state === 'live' ? 'success' : 'info', label: f.state === 'live' ? 'Autonomous' : 'Scheduled' },
                      rows: [{ k: 'State', v: f.state === 'live' ? 'Running' : 'Scheduled' }, { k: 'Last run', v: f.last }, { k: 'Errors', v: '0' }],
                      body: 'The Operator runs this on its own and only pings you if it gets stuck.',
                      actions: [{ label: 'View runs', primary: true }, { label: 'Pause' }],
                    }))}>
                    <span className={'cc-flow-state cc-flow-state--' + f.state} />
                    <span className="cc-flow-name">{f.name}</span>
                    <span className="cc-flow-last">{f.last}</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ── Concept 2 · The Conversation ──────────────────────────── */
function Msg({ who, card, children }: { who: string; card?: boolean; children: React.ReactNode }) {
  return (
    <div className={'ch-msg ch-msg--' + who}>
      {who === 'op' && <span className="ch-msg-av"><OperatorMark size={18} color="var(--color-text-strong)" /></span>}
      <div className={'ch-bubble' + (card ? ' ch-bubble--card' : '') + (who === 'me' ? ' ch-bubble--me' : '')}>
        {children}
      </div>
    </div>
  );
}

export function ConceptChat({ embedded }: { embedded?: boolean }) {
  const { data } = useIndustry();
  const { open } = useDetail();
  const p = data.persona;
  const accentKpi = data.kpis.find((k) => k.accent) || data.kpis[0];
  const hours = data.kpis.find((k) => k.unit === 'hr');
  const d0 = data.drafts[0];
  const doneToday = data.log.filter((l) => l[1] === 'Done');

  return (
    <div className="op-shell ch">
      <div className="op-aura" />
      <div className="ch-inner">

        {!embedded && (
        <header className="ch-top">
          <div className="cc-brand">
            <OperatorMark size={30} color="var(--color-text-strong)" />
            <div className="cc-brand-meta">
              <span className="cc-brand-name">Operator <span className="ch-tag">— an employee, not a dashboard</span></span>
              <span className="cc-brand-status"><span className="op-livedot" />Online · working {p.company}</span>
            </div>
          </div>
          <IndustrySwitcher compact />
        </header>
        )}

        <div className="ch-body">
          <section className="ch-thread">
            <div className="ch-daydiv"><span>Today · {data.date}</span></div>

            <Msg who="op"><p>{data.chatOpener}</p></Msg>

            <Msg who="op" card>
              <div className="ch-numcard">
                <div className="ch-num">
                  <span className="ch-num-label">{accentKpi.label}</span>
                  <span className="ch-num-val">{accentKpi.value}</span>
                  <span className="ch-num-delta">{accentKpi.delta}</span>
                </div>
                <div className="ch-num-ring">
                  {hours && <HoursRing value={parseFloat(hours.value)} size={84} />}
                </div>
              </div>
            </Msg>

            <Msg who="me"><p>What needs me today?</p></Msg>

            <Msg who="op"><p>{data.drafts.length} drafts are waiting on your sign-off. The top one is time-sensitive — I drafted a reply you can send as-is.</p></Msg>

            <Msg who="op" card>
              <article className="ch-draft">
                <div className="ch-draft-head">
                  <span className="op-avatar ch-av">{d0.who.split(' ').map((s) => s[0]).join('').slice(0, 2)}</span>
                  <div className="ch-draft-meta">
                    <span className="ch-draft-who">{d0.who} <span className="ch-draft-co">· {d0.co}</span></span>
                    <span className="ch-draft-subj">{d0.subj}</span>
                  </div>
                  <ChannelDot channel={d0.channel} />
                </div>
                <p className="ch-draft-preview">{d0.preview}</p>
                <div className="ch-draft-actions">
                  <button className="op-cta op-cta--sm" onClick={() => open({
                    title: 'Approve & send', subtitle: d0.who + ' · ' + d0.co, tag: { tone: 'success', label: 'Ready to send' },
                    rows: [{ k: 'Channel', v: d0.channel }, { k: 'Subject', v: d0.subj }],
                    body: d0.preview,
                    actions: [{ label: 'Send now', primary: true }, { label: 'Cancel' }],
                  })}><OpIcon name="send" size={14} />Approve &amp; send</button>
                  <button className="op-ghost" onClick={() => open({
                    title: 'Edit draft', subtitle: d0.who, tag: { tone: 'info', label: d0.channel },
                    rows: [{ k: 'Subject', v: d0.subj }], body: d0.preview,
                    actions: [{ label: 'Save changes', primary: true }, { label: 'Cancel' }],
                  })}>Edit</button>
                  <button className="op-ghost" onClick={() => open({
                    title: 'Reject draft', subtitle: d0.who, tag: { tone: 'danger', label: 'Discard' },
                    body: 'The Operator will discard this draft and learn from your decision.',
                    actions: [{ label: 'Reject', primary: true }, { label: 'Keep' }],
                  })}>Reject</button>
                </div>
              </article>
            </Msg>

            <Msg who="op"><p>{data.chatConfirm}</p></Msg>

            <Msg who="op"><p>Want me to keep working the queue, or walk you through anything first?</p></Msg>
          </section>

          <aside className="ch-side">
            <section className="ch-ledger">
              <header className="ch-ledger-head"><h3 className="cc-h3">Handled while you were away</h3></header>
              <div className="ch-ledger-list">
                {doneToday.slice(0, 5).map(([t, , msg], i) => (
                  <div key={i} className="ch-ledger-row is-clickable"
                    {...clickProps(() => open({
                      title: 'Done · ' + t, tag: { tone: 'success', label: 'Done' },
                      rows: [{ k: 'Time', v: t }, { k: 'Run by', v: 'Operator' }], body: msg,
                    }))}>
                    <OpIcon name="check" size={14} style={{ color: 'var(--color-success)' }} />
                    <span className="ch-ledger-msg">{msg}</span>
                  </div>
                ))}
              </div>
              <div className="ch-ledger-foot">
                <span className="cc-meta"><span className="op-livedot op-livedot--teal" />Still running 4 workflows</span>
              </div>
            </section>
          </aside>
        </div>

        <footer className="ch-composer">
          <div className="ch-quick">
            <button className="ch-chip" onClick={() => open({
              title: 'Approve all safe', tag: { tone: 'success', label: 'Bulk action' },
              rows: [{ k: 'Drafts queued', v: String(data.drafts.length) }, { k: 'Auto-send', v: 'Low-risk only' }],
              body: 'The Operator sends every low-risk draft and holds anything sensitive for you.',
              actions: [{ label: 'Approve all', primary: true }, { label: 'Cancel' }],
            })}>Approve all safe</button>
            <button className="ch-chip" onClick={() => open({
              title: 'Pipeline', subtitle: p.company, tag: { tone: 'info', label: 'Live' },
              rows: data.pipeline.map((s) => ({ k: s.stage, v: String(s.value) })),
            })}>Show me the pipeline</button>
            <button className="ch-chip" onClick={() => open({
              title: 'What slipped?', tag: { tone: 'warning', label: 'Needs you' },
              rows: data.log.filter((l) => l[1] === 'Review' || l[1] === 'Failed').map(([t, s]) => ({ k: t, v: s })),
              body: 'Everything the Operator couldn’t close on its own and handed back to you.',
            })}>What slipped?</button>
          </div>
          <div className="ch-input">
            <input placeholder={`Message the Operator…  e.g. "draft a reply to ${d0.who.split(' ')[0]}"`} />
            <button className="op-cta op-cta--icon"><OpIcon name="send" size={16} /></button>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ── Concept 3 · Watch It Work ─────────────────────────────── */
// Isolated clock so the per-second tick never re-renders the stream list.
function LiveClock() {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return <>{`${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`}</>;
}

export function ConceptStream({ embedded }: { embedded?: boolean }) {
  const { data } = useIndustry();
  const { open } = useDetail();
  const p = data.persona;
  const nowFlow = data.flows[0];
  const actions = (data.log.length + 10);

  const stream = [...data.log].reverse();

  return (
    <div className="op-shell st" key={data.id}>
      <div className="op-aura" />
      <div className="st-inner">

        {!embedded && (
        <header className="st-top">
          <div className="cc-brand">
            <OperatorMark size={30} color="var(--color-text-strong)" />
            <div className="cc-brand-meta">
              <span className="cc-brand-name">Operator · Live</span>
              <span className="cc-brand-status"><span className="op-livedot" />Working {p.company}</span>
            </div>
          </div>
          <IndustrySwitcher compact />
        </header>
        )}

        <div className="st-grid">
          <section className="st-hero">
            <span className="op-eyebrow st-now-label"><span className="op-livedot op-livedot--teal" />Working right now</span>
            <h2 className="st-now-title">{nowFlow.name}</h2>
            <p className="st-now-sub">Scanning the inbound queue and drafting replies — it hasn’t pinged you once.</p>
            <div className="st-bars">
              <span className="st-bar" /><span className="st-bar" /><span className="st-bar" /><span className="st-bar" /><span className="st-bar" />
            </div>
            <div className="st-metrics">
              <div className="st-metric"><span className="st-metric-val">{actions}</span><span className="st-metric-label">actions today</span></div>
              <div className="st-metric st-metric--accent"><span className="st-metric-val"><LiveClock/></span><span className="st-metric-label">working · this session</span></div>
              <div className="st-metric"><span className="st-metric-val">0</span><span className="st-metric-label">pings to you</span></div>
            </div>
          </section>

          <section className="st-feed">
            <header className="st-feed-head">
              <h3 className="cc-h3">Activity stream</h3>
              <span className="cc-meta">newest first · {data.date}</span>
            </header>
            <div className="st-spine">
              {stream.map(([t, status, msg], i) => (
                <div key={i} className="st-item is-clickable" style={{ animationDelay: `${i * 90}ms` }}
                  {...clickProps(() => open({
                    title: status + ' · ' + t, tag: { tone: OP_TONE(status), label: status },
                    rows: [{ k: 'Time', v: t }, { k: 'Outcome', v: status }, { k: 'Run by', v: 'Operator' }],
                    body: msg,
                  }))}>
                  <span className={'st-node st-node--' + OP_TONE(status)} />
                  <div className="st-item-body">
                    <div className="st-item-meta">
                      <span className="st-item-time">{t}</span>
                      <Tag tone={OP_TONE(status)}>{status}</Tag>
                    </div>
                    <p className="st-item-msg">{msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ── Concept 6 · Operator Mesh (top-down hierarchy) ────────── */
export function ConceptMesh({ embedded }: { embedded?: boolean }) {
  const { data } = useIndustry();
  const { open } = useDetail();
  const { theme } = useGraphTheme();
  const p = data.persona;
  const team = OP_TEAMS[data.id] || [];
  const agents = data.flows;
  const actions = data.log.length + 10;
  const openCore = () => open({ title: 'Operator', subtitle: 'Orchestrator', tag: { tone: 'success', label: 'Running' }, meta: actions + ' actions today · 0 errors', rows: [{ k: 'Agents', v: String(agents.length) }, { k: 'Team', v: String(team.length) }, { k: 'Streak', v: data.streak }], body: 'One Operator orchestrating a team of agents for ' + p.company + '.' });
  const openAgent = (f: typeof agents[number]) => open({ title: f.name, subtitle: 'Specialist agent', tag: { tone: f.state === 'live' ? 'success' : 'info', label: f.state === 'live' ? 'Autonomous' : 'Scheduled' }, rows: [{ k: 'State', v: f.state === 'live' ? 'Running' : 'Scheduled' }, { k: 'Last run', v: f.last }, { k: 'Errors', v: '0' }], body: 'A specialist agent the Operator delegates to.' });
  const openHuman = (h: any) => open({ title: h.name, subtitle: h.owner ? h.role : h.role + ' · your team', tag: { tone: 'info', label: h.owner ? 'You' : 'Team' }, rows: [{ k: 'Role', v: h.role }, ...(h.picks ? [{ k: 'Picks up', v: h.picks }] : [])], body: h.owner ? 'Escalations route to you.' : 'The Operator hands off ' + (h.picks || 'work') + ' to ' + h.name + '.' });

  const VW = 1120, VH = 780;
  const core = { x: VW / 2, y: 116, r: 49 };

  const spread = (n: number, pad: number) => Array.from({ length: n }, (_, i) =>
    n === 1 ? VW / 2 : pad + (i * (VW - 2 * pad)) / (n - 1));

  const agentY = 372, humanY = 662;
  const ax = spread(agents.length, 168);
  const humans: any[] = [team[0], { ...p, owner: true }, team[1], team[2]].filter(Boolean);
  const hx = spread(humans.length, 152);

  return (
    <div className={'op-shell mesh theme-' + theme} key={data.id}>
      <div className="op-aura" />
      <div className="mesh-inner">
        {!embedded && (
        <header className="g-top">
          <div className="cc-brand">
            <OperatorMark size={30} color="var(--color-text-strong)" />
            <div className="cc-brand-meta">
              <span className="cc-brand-name">Operator</span>
              <span className="cc-brand-status"><span className="op-livedot" />Running · {data.streak}</span>
            </div>
          </div>
          <IndustrySwitcher compact />
        </header>
        )}
        <div className="mesh-subhead">
          <div className="g-title-wrap">
            <span className="op-eyebrow">Your autonomous workforce</span>
            <h1 className="g-title">One <span className="op-em">Operator</span>, a team of agents, working for {p.company}.</h1>
          </div>
          {embedded ? (
            <GLegend items={[
              { kind: 'delegate', label: 'Operator delegates' },
              { kind: 'escalate', label: 'Handed to your team' },
            ]} />
          ) : (
          <div className="g-rightstack">
            <GraphThemeSwitcher />
            <GLegend items={[
              { kind: 'delegate', label: 'Operator delegates' },
              { kind: 'escalate', label: 'Handed to your team' },
            ]} />
          </div>
          )}
        </div>

        <div className="mesh-stage">
          <span className="g-tier-label" style={{ left: 0, top: core.y - 8 }}>Orchestrator</span>
          <span className="g-tier-label" style={{ left: 0, top: agentY - 8 }}>Specialist&nbsp;agents</span>
          <span className="g-tier-label" style={{ left: 0, top: humanY - 8 }}>Your&nbsp;team</span>

          <svg className="mesh-edges" viewBox={`0 0 ${VW} ${VH}`} width={VW} height={VH} preserveAspectRatio="none">
            {ax.map((x, i) => (
              <GEdge key={'d' + i} id={'me-d' + i} kind="delegate"
                d={gPathV(core.x, core.y + core.r, x, agentY - 44)}
                pulses={agents[i].state === 'live' ? 2 : 1}
                dur={agents[i].state === 'live' ? 3 : 5} delay={i * 0.5}
                dim={agents[i].state !== 'live'} />
            ))}
            {ax.map((x, i) => {
              const hIdx = i % humans.length;
              return (
                <GEdge key={'e' + i} id={'me-e' + i} kind="escalate"
                  d={gPathV(x, agentY + 44, hx[hIdx], humanY - 46)}
                  pulses={1} dur={4.6} delay={0.8 + i * 0.6} />
              );
            })}
          </svg>

          <div className="g-node" style={{ left: core.x, top: core.y }}>
            <div className="g-core is-clickable" {...clickProps(openCore)}><OperatorMark size={56} variant="cream" /></div>
          </div>
          <div className="mesh-core-cap" style={{ left: core.x, top: core.y + core.r + 14 }}>
            <span className="mesh-core-name">Operator</span>
            <span className="mesh-core-stat"><span className="op-livedot op-livedot--teal" />{actions} actions today · 0 errors</span>
          </div>

          {agents.map((f, i) => (
            <div key={i} className="g-node" style={{ left: ax[i], top: agentY }}>
              <div className={'g-chip g-chip--agent is-clickable' + (f.state !== 'live' ? ' g-chip--scheduled' : '')} {...clickProps(() => openAgent(f))}>
                <span className="g-chip-name">{f.name}</span>
                <span className="g-chip-sub">{f.state === 'live' ? 'Autonomous' : 'Scheduled'}</span>
                <span className="mesh-agent-last">{f.last}</span>
              </div>
            </div>
          ))}

          {humans.map((h, i) => (
            <div key={i} className="g-node" style={{ left: hx[i], top: humanY }}>
              <div className={'g-face is-clickable' + (h.owner ? ' g-face--owner' : '')} {...clickProps(() => openHuman(h))}>{h.initials}</div>
              <span className="g-person-name">{h.owner ? 'You · ' + h.name.split(' ')[0] : h.name}</span>
              <span className="g-person-role">{h.owner ? h.role : h.picks}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Concept 7 · Mission Control Orbit ─────────────────────── */
export function ConceptOrbit({ embedded }: { embedded?: boolean }) {
  const { data } = useIndustry();
  const { open } = useDetail();
  const { theme } = useGraphTheme();
  const p = data.persona;
  const team = (OP_TEAMS[data.id] || []).slice(0, 3);
  const agents = data.flows;
  const channels = OP_CHANNELS(data);
  const actions = data.log.length + 10;
  const openAgent = (f: typeof agents[number]) => open({ title: f.name, subtitle: 'Specialist agent', tag: { tone: f.state === 'live' ? 'success' : 'info', label: f.state === 'live' ? 'Autonomous' : 'Scheduled' }, rows: [{ k: 'State', v: f.state === 'live' ? 'Running' : 'Scheduled' }, { k: 'Last run', v: f.last }], body: 'A specialist agent on the Operator’s ring.' });
  const openChan = (c: string) => open({ title: c, subtitle: 'Inbound channel', tag: { tone: 'success', label: 'Active' }, rows: [{ k: 'Status', v: 'Connected' }, { k: 'Drafts', v: String(data.drafts.filter((d) => d.channel === c).length) }], body: 'Work comes in on ' + c + ' and the Operator picks it up.' });
  const openMember = (h: any) => open({ title: h.name, subtitle: h.role + ' · your team', tag: { tone: 'info', label: 'Team' }, rows: [{ k: 'Role', v: h.role }, { k: 'Picks up', v: h.picks }], body: 'The Operator escalates ' + h.picks + ' to ' + h.name + '.' });
  const openYou = () => open({ title: 'You · ' + p.name, subtitle: p.role + ' · ' + p.company, tag: { tone: 'info', label: 'Owner' }, rows: [{ k: 'Reports in', v: String(agents.length) + ' agents' }, { k: 'Streak', v: data.streak }], body: 'You sit at the centre — the Operator works the orbit and reports to you.' });

  const VW = 980, VH = 840;
  const C = { x: 490, y: 408 };
  const R_AGENT = 258, R_CHAN = 352, R_TEAM = 94;

  const agentDeg = agents.map((_, i) => 45 + i * (360 / agents.length));
  const aPos = agentDeg.map((d) => gPolar(C.x, C.y, R_AGENT, d));
  const chanDeg = channels.map((_, j) => j * (360 / channels.length));
  const cPos = chanDeg.map((d) => gPolar(C.x, C.y, R_CHAN, d));
  const teamDeg = [40, 165, 290];
  const tPos = team.map((_, i) => gPolar(C.x, C.y, R_TEAM, teamDeg[i % 3]));

  const nearestAgent = (cd: number) => {
    let best = 0, bd = 999;
    agentDeg.forEach((ad, i) => {
      const diff = Math.abs(((ad - cd + 540) % 360) - 180);
      if (diff < bd) { bd = diff; best = i; }
    });
    return best;
  };

  const ringPath = `M${C.x},${C.y - R_AGENT} a${R_AGENT},${R_AGENT} 0 1,1 -0.01,0`;

  return (
    <div className={'op-shell orbit theme-' + theme} key={data.id}>
      <div className="op-aura" />
      <div className="orbit-inner">
        {!embedded && (
        <header className="g-top">
          <div className="cc-brand">
            <OperatorMark size={30} color="var(--color-text-strong)" />
            <div className="cc-brand-meta">
              <span className="cc-brand-name">Operator · Mission Control</span>
              <span className="cc-brand-status"><span className="op-livedot" />Working {p.company}</span>
            </div>
          </div>
          <IndustrySwitcher compact />
        </header>
        )}
        <div className="orbit-subhead">
          <h1 className="g-title">You're at the centre. The <span className="op-em">Operator</span> works the orbit.</h1>
          {embedded ? (
            <GLegend items={[
              { kind: 'inbound', label: 'Channels in' },
              { kind: 'delegate', label: 'Operator ring' },
              { kind: 'escalate', label: 'Reports to you' },
            ]} />
          ) : (
          <div className="g-rightstack">
            <GraphThemeSwitcher />
            <GLegend items={[
              { kind: 'inbound', label: 'Channels in' },
              { kind: 'delegate', label: 'Operator ring' },
              { kind: 'escalate', label: 'Reports to you' },
            ]} />
          </div>
          )}
        </div>

        <div className="orbit-stage">
          <svg className="orbit-edges" viewBox={`0 0 ${VW} ${VH}`} width={VW} height={VH} preserveAspectRatio="none">
            <g className="orbit-spin orbit-spin--cw" style={{ transformOrigin: `${C.x}px ${C.y}px` }}>
              <circle cx={C.x} cy={C.y} r={R_CHAN} className="orbit-guide" />
            </g>
            <g className="orbit-spin orbit-spin--ccw" style={{ transformOrigin: `${C.x}px ${C.y}px` }}>
              <circle cx={C.x} cy={C.y} r={(R_AGENT + R_TEAM) / 2} className="orbit-guide orbit-guide--faint" />
            </g>

            {cPos.map((c, j) => {
              const a = aPos[nearestAgent(chanDeg[j])];
              return <GEdge key={'in' + j} id={'or-in' + j} kind="inbound"
                d={gLine(c.x, c.y, a.x, a.y)} pulses={1} dur={3.4} delay={j * 0.7} />;
            })}

            <GEdge id="or-ring" kind="delegate" d={ringPath} pulses={agents.length + 1} dur={9} />

            {aPos.map((a, i) => (
              <GEdge key={'rep' + i} id={'or-rep' + i} kind="escalate"
                d={gLine(a.x, a.y, C.x, C.y)}
                pulses={1} dur={agents[i].state === 'live' ? 4 : 6}
                delay={0.6 + i * 0.5} dim={agents[i].state !== 'live'} />
            ))}
          </svg>

          <span className="orbit-ring-tag" style={{ left: C.x, top: C.y - R_AGENT }}>
            <span className="op-livedot op-livedot--teal" />Operator · {actions} actions today
          </span>

          {cPos.map((c, j) => (
            <div key={j} className="orbit-chan is-clickable" style={{ left: c.x, top: c.y }} {...clickProps(() => openChan(channels[j]))}>
              <ChannelDot channel={channels[j]} />
            </div>
          ))}

          {agents.map((f, i) => (
            <div key={i} className="g-node" style={{ left: aPos[i].x, top: aPos[i].y }}>
              <div className={'g-chip g-chip--agent is-clickable' + (f.state !== 'live' ? ' g-chip--scheduled' : '')} {...clickProps(() => openAgent(f))}>
                <span className="g-chip-name">{f.name}</span>
                <span className="g-chip-sub">{f.state === 'live' ? 'Autonomous' : 'Scheduled'}</span>
              </div>
            </div>
          ))}

          {team.map((h, i) => (
            <div key={i} className="orbit-team is-clickable" style={{ left: tPos[i].x, top: tPos[i].y }} title={h.name + ' · ' + h.role} {...clickProps(() => openMember(h))}>
              <div className="g-face orbit-team-face">{h.initials}</div>
            </div>
          ))}

          <div className="g-node orbit-you" style={{ left: C.x, top: C.y }}>
            <div className="g-face g-face--owner orbit-you-face is-clickable" {...clickProps(openYou)}>{p.initials}</div>
            <span className="g-person-name">You · {p.name.split(' ')[0]}</span>
            <span className="g-person-role">{p.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Concept 8 · Pipeline Flow ─────────────────────────────── */
export function ConceptFlow({ embedded }: { embedded?: boolean }) {
  const { data } = useIndustry();
  const { open } = useDetail();
  const { theme } = useGraphTheme();
  const p = data.persona;
  const team = (OP_TEAMS[data.id] || []).slice(0, 3);
  const stages = data.pipeline;
  const agents = data.flows;
  const channels = OP_CHANNELS(data);
  const maxV = Math.max(...stages.map((s) => s.value));
  const openAgent = (f: typeof agents[number]) => open({ title: f.name, subtitle: 'Specialist agent', tag: { tone: f.state === 'live' ? 'success' : 'info', label: f.state === 'live' ? 'Autonomous' : 'Scheduled' }, rows: [{ k: 'State', v: f.state === 'live' ? 'Running' : 'Scheduled' }, { k: 'Last run', v: f.last }], body: 'Moves work down the pipeline for the Operator.' });
  const openChan = (c: string) => open({ title: c, subtitle: 'Inbound channel', tag: { tone: 'success', label: 'Active' }, rows: [{ k: 'Status', v: 'Connected' }, { k: 'Drafts', v: String(data.drafts.filter((d) => d.channel === c).length) }], body: 'Work enters the pipeline on ' + c + '.' });
  const openStage = (s: typeof stages[number]) => open({ title: s.stage, subtitle: 'Pipeline stage', tag: { tone: 'info', label: s.value + ' in stage' }, rows: [{ k: 'Count', v: String(s.value) }, { k: 'Share of top', v: Math.round((s.value / maxV) * 100) + '%' }], body: 'Records the Operator has moved into “' + s.stage + '”.' });
  const openHuman = (h: any) => open({ title: h.name, subtitle: h.owner ? h.role : h.role + ' · your team', tag: { tone: 'info', label: h.owner ? 'You' : 'Team' }, rows: [{ k: 'Role', v: h.role }, ...(h.picks ? [{ k: 'Picks up', v: h.picks }] : [])], body: h.owner ? 'Escalations route to you.' : 'The Operator hands off ' + (h.picks || 'work') + ' to ' + h.name + '.' });

  const VW = 1280, VH = 620;
  const n = stages.length;
  const sx = Array.from({ length: n }, (_, i) => 220 + (i * (1150 - 220)) / (n - 1));
  const CARD_HW = 100;
  const yBar = 46, yAgent = 150, yStage = 330, yTeam = 540;
  const cardTop = yStage - 60, cardBot = yStage + 60;

  const humans: any[] = [...team.slice(0, n - 1), { ...p, owner: true }];

  const chanY = channels.map((_, j) => yStage - 46 + j * 46);

  return (
    <div className={'op-shell flow theme-' + theme} key={data.id}>
      <div className="op-aura" />
      <div className="flow-inner">
        {!embedded && (
        <header className="g-top">
          <div className="cc-brand">
            <OperatorMark size={30} color="var(--color-text-strong)" />
            <div className="cc-brand-meta">
              <span className="cc-brand-name">Operator · Pipeline</span>
              <span className="cc-brand-status"><span className="op-livedot" />Running · {data.streak}</span>
            </div>
          </div>
          <IndustrySwitcher compact />
        </header>
        )}
        <div className="flow-subhead">
          <h1 className="g-title">A line of <span className="op-em">agents</span> moving work down your pipeline.</h1>
          {embedded ? (
            <GLegend items={[
              { kind: 'inbound', label: 'Channels in' },
              { kind: 'delegate', label: 'Work flowing' },
              { kind: 'escalate', label: 'Handed to your team' },
            ]} />
          ) : (
          <div className="g-rightstack">
            <GraphThemeSwitcher />
            <GLegend items={[
              { kind: 'inbound', label: 'Channels in' },
              { kind: 'delegate', label: 'Work flowing' },
              { kind: 'escalate', label: 'Handed to your team' },
            ]} />
          </div>
          )}
        </div>

        <div className="flow-stage">
          <svg className="flow-edges" viewBox={`0 0 ${VW} ${VH}`} width={VW} height={VH} preserveAspectRatio="none">
            {sx.map((x, i) => (
              <GEdge key={'op' + i} id={'fl-op' + i} kind="delegate"
                d={gLine(x, yBar + 17, x, yAgent - 40)} pulses={1} dur={2.6} delay={i * 0.4} />
            ))}
            {sx.map((x, i) => (
              <GEdge key={'as' + i} id={'fl-as' + i} kind="delegate"
                d={gLine(x, yAgent + 40, x, cardTop)} pulses={1} dur={2.8} delay={0.3 + i * 0.4}
                dim={agents[i % agents.length].state !== 'live'} />
            ))}
            {chanY.map((cy, j) => (
              <GEdge key={'in' + j} id={'fl-in' + j} kind="inbound"
                d={gPathH(120, cy, sx[0] - CARD_HW, yStage)} pulses={1} dur={3.2} delay={j * 0.6} />
            ))}
            {sx.slice(0, -1).map((x, i) => (
              <GEdge key={'pipe' + i} id={'fl-pipe' + i} kind="delegate"
                d={gLine(x + CARD_HW, yStage, sx[i + 1] - CARD_HW, yStage)} pulses={2} dur={3.4} delay={i * 0.5} />
            ))}
            {sx.map((x, i) => (
              <GEdge key={'h' + i} id={'fl-h' + i} kind="escalate"
                d={gLine(x, cardBot, x, yTeam - 34)} pulses={1} dur={4.4} delay={0.8 + i * 0.5} />
            ))}
          </svg>

          <div className="flow-opbar" style={{ top: yBar }}>
            <span className="flow-opbar-tag"><OperatorMark size={18} /> Operator · orchestrating</span>
            <span className="flow-opbar-meta">{data.log.length + 10} actions today · 0 errors</span>
          </div>

          {channels.map((c, j) => (
            <div key={j} className="flow-chan is-clickable" style={{ left: 64, top: chanY[j] }} {...clickProps(() => openChan(c))}>
              <ChannelDot channel={c} />
            </div>
          ))}

          {sx.map((x, i) => {
            const f = agents[i % agents.length];
            return (
              <div key={i} className="g-node" style={{ left: x, top: yAgent }}>
                <div className={'g-chip g-chip--agent is-clickable' + (f.state !== 'live' ? ' g-chip--scheduled' : '')} {...clickProps(() => openAgent(f))}>
                  <span className="g-chip-name">{f.name}</span>
                  <span className="g-chip-sub">{f.state === 'live' ? 'Autonomous' : 'Scheduled'}</span>
                </div>
              </div>
            );
          })}

          {stages.map((s, i) => (
            <div key={i} className={'flow-card is-clickable' + (i === n - 1 ? ' is-last' : '')} style={{ left: sx[i], top: yStage }} {...clickProps(() => openStage(s))}>
              <span className="flow-card-stage">{s.stage}</span>
              <span className="flow-card-val">{s.value}</span>
              <div className="flow-card-track"><div className="flow-card-fill" style={{ width: Math.max(10, (s.value / maxV) * 100) + '%' }} /></div>
            </div>
          ))}

          {humans.map((h, i) => (
            <div key={i} className="g-node" style={{ left: sx[i], top: yTeam }}>
              <div className={'g-face is-clickable' + (h.owner ? ' g-face--owner' : '')} {...clickProps(() => openHuman(h))}>{h.initials}</div>
              <span className="g-person-name">{h.owner ? 'You · ' + h.name.split(' ')[0] : h.name}</span>
              <span className="g-person-role">{h.owner ? h.role : h.picks}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
