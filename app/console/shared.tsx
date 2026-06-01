'use client';
/* Optentia · Operator Demo Generator — shared store, switcher, primitives.
   Ported from op-shared.jsx (window globals → ES module exports). */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { OP_INDUSTRIES, type Industry, type Stage } from './data';

/* ── Industry store (context + localStorage) ───────────────── */
interface IndustryCtxValue { idx: number; setIndustry: (i: number) => void; data: Industry; list: Industry[]; }
const IndustryCtx = createContext<IndustryCtxValue | null>(null);
const OP_KEY = 'op-demo-industry';

export function IndustryProvider({ children }: { children: React.ReactNode }) {
  const list = OP_INDUSTRIES;
  const [idx, setIdx] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    const saved = Number(localStorage.getItem(OP_KEY));
    return Number.isInteger(saved) && saved >= 0 && saved < list.length ? saved : 0;
  });
  const setIndustry = (i: number) => {
    setIdx(i);
    try { localStorage.setItem(OP_KEY, String(i)); } catch (e) {}
  };
  return (
    <IndustryCtx.Provider value={{ idx, setIndustry, data: list[idx], list }}>
      {children}
    </IndustryCtx.Provider>
  );
}
export const useIndustry = (): IndustryCtxValue => useContext(IndustryCtx) as IndustryCtxValue;

/* ── Icons ─────────────────────────────────────────────────── */
export const ICONS: Record<string, string> = {
  // UI
  home: 'M3 11l9-8 9 8M5 10v10h14V10',
  inbox: 'M3 13l3-9h12l3 9M3 13v7h18v-7M3 13h6l1 2h4l1-2h6',
  drafts: 'M4 4h12l4 4v12H4zM16 4v4h4M8 14h8M8 18h6',
  calendar: 'M4 6h16v14H4zM4 10h16M8 4v4M16 4v4',
  pipeline: 'M3 12h6l3-7 3 14 3-7h3',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  search: 'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.3-4.3',
  menu: 'M3 6h18 M3 12h18 M3 18h18',
  close: 'M6 6l12 12 M18 6L6 18',
  zap: 'M13 2L3 14h7l-1 8 10-12h-7z',
  chevron: 'M9 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  check: 'M20 6L9 17l-5-5',
  alert: 'M12 9v4 M12 17h.01 M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
  send: 'M22 2L11 13 M22 2l-7 20-4-9-9-4z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
  sparkles: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z',
  arrowRight: 'M5 12h14 M13 6l6 6-6 6',
  bolt: 'M13 2L3 14h7l-1 8 10-12h-7z',
  mail: 'M3 5h18v14H3z M3 6l9 7 9-7',
  phone: 'M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  whatsapp: 'M5 19l1.5-4.5A7 7 0 1 1 9.5 18.5z M9 11h.01 M12 11h.01 M15 11h.01',
  // Industry glyphs
  hotels: 'M3 21h18 M5 21V5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v16 M8 8h3 M8 12h3 M8 16h3 M14 21V9h4a1 1 0 0 1 1 1v11',
  realestate: 'M3 11l9-8 9 8 M5 10v10h14V10 M10 20v-6h4v6',
  healthcare: 'M3 12h4l2-6 4 12 2-6h6',
  law: 'M12 3v18 M5 21h14 M6 7h12 M9 4l-9 5 M6 7l-3 6a3 3 0 0 0 6 0z M18 7l3 6a3 3 0 0 1-6 0z',
  finance: 'M3 17l6-6 4 4 7-8 M14 7h5v5',
  construction: 'M15 11l-9 9-3-3 9-9 M13 4l7 7 2-2-7-7z',
  ecommerce: 'M3 4h2l2.2 11.4a1 1 0 0 0 1 .8h8.5a1 1 0 0 0 1-.8L20 8H6 M9 20a1 1 0 1 0 0-.01 M17 20a1 1 0 1 0 0-.01',
  recruiting: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.2a4 4 0 0 1 0 7.6',
  agency: 'M3 11v3l12 5V6L3 11z M15 8a3 3 0 0 1 0 7 M6 14v4a2 2 0 0 0 4 0v-2',
  auto: 'M5 16l1.6-5.3A2 2 0 0 1 8.5 9.3h7a2 2 0 0 1 1.9 1.4L19 16 M4 16h16v3h-2v-1H6v1H4z M7.5 16a1 1 0 1 0 0-.01 M16.5 16a1 1 0 1 0 0-.01',
};

export const OpIcon = ({ name, size = 18, sw = 1.6, style }: { name: string; size?: number; sw?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    style={{ flexShrink: 0, ...style }}>
    <path d={ICONS[name] || ''} />
  </svg>
);

/* ── Industry switcher (segmented pill row) ────────────────── */
export function IndustrySwitcher({ compact = false }: { compact?: boolean }) {
  const { idx, setIndustry, list } = useIndustry();
  const railRef = useRef<HTMLDivElement>(null);
  // keep active chip in view
  useEffect(() => {
    const el = railRef.current?.querySelector('.op-seg.is-active') as HTMLElement | null;
    if (el && el.parentElement) {
      const p = el.parentElement;
      const left = el.offsetLeft - p.offsetWidth / 2 + el.offsetWidth / 2;
      p.scrollTo({ left, behavior: 'smooth' });
    }
  }, [idx]);
  return (
    <div className={'op-switcher' + (compact ? ' op-switcher--compact' : '')}>
      <span className="op-switcher-label">Demo&nbsp;industry</span>
      <div className="op-seg-rail" ref={railRef}>
        {list.map((it, i) => (
          <button key={it.id} className={'op-seg' + (i === idx ? ' is-active' : '')}
            onClick={() => setIndustry(i)}>
            <OpIcon name={it.id} size={15} sw={1.7} />
            <span>{it.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Status tag ────────────────────────────────────────────── */
export const Tag = ({ tone, children }: { tone: string; children: React.ReactNode }) => (
  <span className={'op-tag op-tag--' + tone}>{children}</span>
);

/* ── Channel dot (Email / WhatsApp / SMS) ──────────────────── */
export const ChannelDot = ({ channel }: { channel: string }) => {
  const icon = channel === 'WhatsApp' ? 'whatsapp' : channel === 'SMS' ? 'phone' : 'mail';
  return (
    <span className="op-channel" title={channel}>
      <OpIcon name={icon} size={12} sw={1.7} />{channel}
    </span>
  );
};

/* ── Logo mark ─────────────────────────────────────────────── */
export const Mark = ({ size = 30 }: { size?: number }) => (
  <img src="/console/optentia-mark.svg" alt="Optentia" width={size} height={size}
    style={{ display: 'block' }} />
);

/* ── Funnel viz (horizontal pipeline bars) ─────────────────── */
export function Funnel({ stages, accentLast = true }: { stages: Stage[]; accentLast?: boolean }) {
  const max = Math.max(...stages.map((s) => s.value));
  return (
    <div className="op-funnel">
      {stages.map((s, i) => {
        const w = Math.max(8, (s.value / max) * 100);
        const isLast = i === stages.length - 1;
        return (
          <div key={s.stage} className="op-funnel-row">
            <span className="op-funnel-label">{s.stage}</span>
            <div className="op-funnel-track">
              <div className={'op-funnel-fill' + (accentLast && isLast ? ' is-accent' : '')}
                style={{ width: w + '%' }} />
            </div>
            <span className="op-funnel-val">{s.value}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Sparkline ─────────────────────────────────────────────── */
export function Sparkline({ points, w = 120, h = 36, accent = false }: { points: number[]; w?: number; h?: number; accent?: boolean }) {
  const max = Math.max(...points), min = Math.min(...points);
  const span = max - min || 1;
  const step = w / (points.length - 1);
  const d = points.map((p, i) => `${i * step},${h - ((p - min) / span) * (h - 6) - 3}`).join(' ');
  const stroke = accent ? 'var(--color-brand-teal-light)' : 'var(--color-text-muted)';
  const last = points[points.length - 1], ly = h - ((last - min) / span) * (h - 6) - 3;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <polyline points={d} fill="none" stroke={stroke} strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={ly} r="2.4" fill={stroke} />
    </svg>
  );
}

/* ── Hours-saved ring ──────────────────────────────────────── */
export function HoursRing({ value, max = 14, size = 92, label = 'hrs back' }: { value: number; max?: number; size?: number; label?: string }) {
  const r = size / 2 - 7, c = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  return (
    <div className="op-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="var(--color-border)" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="var(--color-brand-teal-light)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset .8s var(--ease-emphasized)' }} />
      </svg>
      <div className="op-ring-center">
        <span className="op-ring-val">{value}</span>
        <span className="op-ring-label">{label}</span>
      </div>
    </div>
  );
}
