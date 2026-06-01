'use client';
/* Operator Console — unified app shell: sidebar nav, topbar (type + theme +
   industry switchers), router. Reuses the industry-aware screens as embedded
   pages. Ported from console-app.jsx. */

import React, { useState, useEffect } from 'react';
import { useIndustry, OpIcon, IndustrySwitcher } from './shared';
import {
  OperatorMark, useGraphTheme, useGraphFont, useGraphStyle,
  GraphThemeSwitcher, GraphFontSwitcher, GraphStyleSwitcher,
} from './graph';
import { ConceptCommand, ConceptChat, ConceptStream, ConceptMesh, ConceptOrbit, ConceptFlow } from './concepts';
import { PageSchedule, PageChannels, PageRecords, PageSettings } from './pages';
import type { Industry } from './data';

interface NavItem { sec?: string; id?: string; label?: string; icon?: string; cnt?: (d: Industry) => number; }

const NAV: NavItem[] = [
  { sec: 'Workspace' },
  { id: 'command', label: 'Command Center', icon: 'home' },
  { id: 'conversations', label: 'Conversations', icon: 'inbox', cnt: (d) => d.drafts.length },
  { id: 'activity', label: 'Activity', icon: 'bolt' },
  { id: 'schedule', label: 'Schedule', icon: 'calendar', cnt: (d) => d.events.length },
  { id: 'channels', label: 'Channels', icon: 'send' },
  { id: 'records', label: 'Records', icon: 'drafts' },
  { sec: 'Intelligence' },
  { id: 'graph', label: 'Agent Graph', icon: 'sparkles' },
];

const PAGE_META: Record<string, (d: Industry) => [string, string]> = {
  command:       (d) => ['Today · ' + d.date, 'Command Center'],
  conversations: ()  => ['Live · responds instantly', 'Conversations'],
  activity:      ()  => ['Real-time feed', 'Activity'],
  schedule:      (d) => [d.date, 'Schedule'],
  channels:      ()  => ['Response map', 'Channels'],
  records:       ()  => ['Pipeline & sign-offs', 'Records'],
  graph:         ()  => ['Your autonomous workforce', 'Agent Graph'],
  settings:      ()  => ['Workspace', 'Settings'],
};

const GRAPH_TABS = [
  { id: 'mesh', label: 'Hierarchy', icon: 'pipeline' },
  { id: 'orbit', label: 'Mission Control', icon: 'sparkles' },
  { id: 'flow', label: 'Pipeline Flow', icon: 'arrowRight' },
];

function Clock() {
  const [t, setT] = useState('--:--:--');
  useEffect(() => {
    const f = () => { const d = new Date(), p = (n: number) => String(n).padStart(2, '0'); setT(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`); };
    f(); const id = setInterval(f, 1000); return () => clearInterval(id);
  }, []);
  return <span className="con-clock">{t}<span className="z"> LOCAL</span></span>;
}

function GraphView() {
  const [view, setView] = useState<string>(() => (typeof window === 'undefined' ? 'mesh' : localStorage.getItem('op-console-graph') || 'mesh'));
  const set = (v: string) => { setView(v); try { localStorage.setItem('op-console-graph', v); } catch (e) {} };
  return (
    <>
      <div className="con-graphbar">
        <div className="con-seg">
          {GRAPH_TABS.map((t) => (
            <button key={t.id} className={view === t.id ? 'is-active' : ''} onClick={() => set(t.id)}>
              <OpIcon name={t.icon} size={14} />{t.label}
            </button>
          ))}
        </div>
        <span className="con-graphbar-hint">Same agents · three ways to read them</span>
      </div>
      {view === 'mesh' && <ConceptMesh embedded />}
      {view === 'orbit' && <ConceptOrbit embedded />}
      {view === 'flow' && <ConceptFlow embedded />}
    </>
  );
}

export function Console() {
  const { data } = useIndustry();
  const { theme } = useGraphTheme();
  const { font } = useGraphFont();
  const { style } = useGraphStyle();
  const p = data.persona;
  const [page, setPage] = useState<string>(() => (typeof window === 'undefined' ? 'command' : localStorage.getItem('op-console-page') || 'command'));
  const [navOpen, setNavOpen] = useState(false);
  const go = (id: string) => { setPage(id); setNavOpen(false); try { localStorage.setItem('op-console-page', id); } catch (e) {} };
  const meta = (PAGE_META[page] || PAGE_META.command)(data);

  return (
    <div className={'op-console theme-' + theme + ' font-' + font + ' style-' + style}>
      {/* Mobile drawer scrim */}
      <div className={'con-scrim' + (navOpen ? ' is-open' : '')} onClick={() => setNavOpen(false)} aria-hidden="true" />
      {/* Sidebar */}
      <aside className={'con-side' + (navOpen ? ' is-open' : '')}>
        <div className="con-brand">
          <span className="con-brand-badge"><OperatorMark size={40} variant="cream" /></span>
          <div className="con-brand-meta">
            <span className="con-brand-name">Operator</span>
            <span className="con-brand-status"><span className="op-livedot" />Running · {data.streak}</span>
          </div>
        </div>
        <nav className="con-nav">
          {NAV.map((n, i) => n.sec
            ? <div key={'s' + i} className="con-nav-sec">{n.sec}</div>
            : (
              <button key={n.id} className={'con-nav-item' + (page === n.id ? ' active' : '')} onClick={() => go(n.id as string)}>
                <OpIcon name={n.icon as string} size={18} />
                <span className="lbl">{n.label}</span>
                {n.cnt && <span className="cnt">{n.cnt(data)}</span>}
              </button>
            ))}
        </nav>
        <div className="con-foot">
          <button className={'con-nav-item' + (page === 'settings' ? ' active' : '')} onClick={() => go('settings')}>
            <OpIcon name="settings" size={18} /><span className="lbl">Settings</span>
          </button>
          <div className="con-account">
            <span className="op-avatar" style={{ width: 34, height: 34, fontSize: 12 }}>{p.initials}</span>
            <div className="con-acc-meta">
              <span className="con-acc-name">{p.name}</span>
              <span className="con-acc-co">{p.company} · {p.role}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="con-main">
        <header className="con-top">
          <button className="con-hamburger" onClick={() => setNavOpen((v) => !v)} aria-label="Toggle navigation" aria-expanded={navOpen}>
            <OpIcon name={navOpen ? 'close' : 'menu'} size={20} />
          </button>
          <div className="con-top-title">
            <span className="con-top-eyebrow">{meta[0]}</span>
            <span className="con-top-h">{meta[1]}</span>
          </div>
          <div className="con-top-spacer" />
          <GraphStyleSwitcher />
          <GraphFontSwitcher />
          <GraphThemeSwitcher />
          <div className="con-top-div" />
          <IndustrySwitcher compact />
          <div className="con-top-div" />
          <span className="con-monitor"><span className="op-livedot op-livedot--teal" />Monitoring</span>
          <Clock />
        </header>

        <div className="con-view" key={page + '-' + data.id}>
          {page === 'command' && <ConceptCommand embedded />}
          {page === 'conversations' && <ConceptChat embedded />}
          {page === 'activity' && <ConceptStream embedded />}
          {page === 'schedule' && <PageSchedule />}
          {page === 'channels' && <PageChannels />}
          {page === 'records' && <PageRecords />}
          {page === 'graph' && <GraphView />}
          {page === 'settings' && <PageSettings />}
        </div>
      </div>
    </div>
  );
}
