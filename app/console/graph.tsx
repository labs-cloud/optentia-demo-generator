'use client';
/* Operator Demo Generator — shared graph primitives, theme + font systems.
   Ported from graph-core.jsx (window globals → ES module exports). */

import React, { useState, useEffect, useContext, createContext } from 'react';

/* ── Operator silhouette mark (the exact figure from the brand image).
   Rendered as <img> for max compatibility. variant 'cream' = white figure for
   accent/dark discs; 'auto' = white on dark themes, inked on light themes. */
export function OperatorMark({ size = 28, variant = 'auto', style }: { size?: number; color?: string; variant?: string; style?: React.CSSProperties }) {
  const AR = 536 / 640;
  return (
    <img src="/console/operator-silhouette.png" alt="" aria-hidden="true"
      className={'op-mark op-mark--' + variant}
      style={{ width: (size * AR) + 'px', height: size + 'px', objectFit: 'contain', flexShrink: 0, ...style }} />
  );
}

/* ── Theme system (premium re-skins of the token set) ────────── */
export interface GTheme { id: string; label: string; tone: string; bg: string; primary: string; secondary: string; }
export const G_THEMES: GTheme[] = [
  { id: 'navy',      label: 'Optentia',  tone: 'dark',  bg: '#0D1B2A', primary: '#3A9AAA', secondary: '#C9A84C' },
  { id: 'graphite',  label: 'Graphite',  tone: 'dark',  bg: '#1A1B1F', primary: '#D2B463', secondary: '#AEB6C0' },
  { id: 'plum',      label: 'Aubergine', tone: 'dark',  bg: '#241B2E', primary: '#D896AF', secondary: '#D8B45E' },
  { id: 'slate',     label: 'Slate',     tone: 'mid',   bg: '#243441', primary: '#54C6A8', secondary: '#D7A85A' },
  { id: 'sand',      label: 'Sand',      tone: 'light', bg: '#EFE9DD', primary: '#B5623C', secondary: '#9A7B3A' },
  { id: 'porcelain', label: 'Porcelain', tone: 'light', bg: '#ECEEF2', primary: '#4A55B8', secondary: '#B07A3E' },
  { id: 'mist',      label: 'Mist',      tone: 'light', bg: '#EBF0F4', primary: '#379AAB', secondary: '#B98A3C' },
  { id: 'blush',     label: 'Blush',     tone: 'light', bg: '#F6EDEA', primary: '#D67F73', secondary: '#B68A4A' },
  { id: 'mint',      label: 'Mint',      tone: 'light', bg: '#ECF3ED', primary: '#44B98A', secondary: '#B6923E' },
  { id: 'aurora',    label: 'Aurora',    tone: 'light', bg: 'linear-gradient(135deg,#E3F1F0,#ECE7F6,#FBEDE6)', primary: '#3F9FAE', secondary: '#D98A5A' },
  { id: 'dawn',      label: 'Dawn',      tone: 'light', bg: 'linear-gradient(135deg,#FDEEE4,#F8E4EA,#ECE6F6)', primary: '#E08769', secondary: '#C29A4E' },
];
interface GThemeCtxValue { theme: string; setTheme: (id: string) => void; themes: GTheme[]; }
const GThemeCtx = createContext<GThemeCtxValue | null>(null);
const G_THEME_KEY = 'op-graph-theme';

export function GraphThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window === 'undefined') return 'navy';
    const s = localStorage.getItem(G_THEME_KEY);
    return G_THEMES.some((t) => t.id === s) ? (s as string) : 'navy';
  });
  const set = (id: string) => { setTheme(id); try { localStorage.setItem(G_THEME_KEY, id); } catch (e) {} };
  return <GThemeCtx.Provider value={{ theme, setTheme: set, themes: G_THEMES }}>{children}</GThemeCtx.Provider>;
}
export const useGraphTheme = (): GThemeCtxValue => useContext(GThemeCtx) || { theme: 'navy', setTheme: () => {}, themes: G_THEMES };

export function GraphThemeSwitcher() {
  const { theme, setTheme, themes } = useGraphTheme();
  return (
    <div className="g-themes">
      <span className="g-themes-label">Theme</span>
      <div className="g-themes-row">
        {themes.map((t) => (
          <button key={t.id} className={'g-swatch' + (t.id === theme ? ' is-active' : '')}
            onClick={() => setTheme(t.id)} title={t.label}
            style={{ background: t.bg, ['--sw-accent' as string]: t.primary, ['--sw-2' as string]: t.secondary } as React.CSSProperties}>
            <span className="g-swatch-a" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Path builders (all in artboard px space) ──────────────── */
// Smooth vertical S-curve between two points (top→bottom flows).
export function gPathV(x1: number, y1: number, x2: number, y2: number) {
  const my = (y1 + y2) / 2;
  return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
}
// Smooth horizontal S-curve (left→right flows).
export function gPathH(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
}
// Straight segment.
export function gLine(x1: number, y1: number, x2: number, y2: number) { return `M${x1},${y1} L${x2},${y2}`; }
// Polar → cartesian around a centre.
export function gPolar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/* ── Edge with traveling pulses ──────────────────────────────── */
export function GEdge({ id, d, kind = 'delegate', pulses = 1, dur = 3.2, delay = 0, dim = false }:
  { id: string; d: string; kind?: string; pulses?: number; dur?: number; delay?: number; dim?: boolean }) {
  const dots = Array.from({ length: pulses });
  return (
    <g className={'g-edge g-edge--' + kind + (dim ? ' is-dim' : '')}>
      <path id={id} className="g-edge-path" d={d} fill="none" />
      {dots.map((_, i) => (
        <circle key={i} className="g-pulse" r={kind === 'escalate' ? 3.4 : 3}>
          <animateMotion dur={dur + 's'} repeatCount="indefinite"
            begin={(delay + (i * dur) / pulses) + 's'} keyPoints="0;1" keyTimes="0;1" calcMode="linear"
            rotate="0">
            <mpath xlinkHref={'#' + id} />
          </animateMotion>
        </circle>
      ))}
    </g>
  );
}

/* ── Font system (curated type pairings) ───────────────────── */
export interface GFont { id: string; label: string; }
export const G_FONTS: GFont[] = [
  { id: 'editorial', label: 'Editorial' },
  { id: 'grotesk',   label: 'Grotesk' },
  { id: 'newsprint', label: 'Newsprint' },
  { id: 'display',   label: 'Display' },
  { id: 'elegant',   label: 'Elegant' },
  { id: 'mono',      label: 'Technical' },
];
interface GFontCtxValue { font: string; setFont: (id: string) => void; fonts: GFont[]; }
const GFontCtx = createContext<GFontCtxValue | null>(null);
const G_FONT_KEY = 'op-graph-font';

export function GraphFontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFont] = useState<string>(() => {
    if (typeof window === 'undefined') return 'editorial';
    const s = localStorage.getItem(G_FONT_KEY);
    return G_FONTS.some((f) => f.id === s) ? (s as string) : 'editorial';
  });
  const set = (id: string) => { setFont(id); try { localStorage.setItem(G_FONT_KEY, id); } catch (e) {} };
  return <GFontCtx.Provider value={{ font, setFont: set, fonts: G_FONTS }}>{children}</GFontCtx.Provider>;
}
export const useGraphFont = (): GFontCtxValue => useContext(GFontCtx) || { font: 'editorial', setFont: () => {}, fonts: G_FONTS };

export function GraphFontSwitcher() {
  const { font, setFont, fonts } = useGraphFont();
  return (
    <label className="g-fontsel" title="Typeface pairing">
      <span className="g-fontsel-aa">Aa</span>
      <select value={font} onChange={(e) => setFont(e.target.value)}>
        {fonts.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
      </select>
      <svg width="10" height="10" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 4l3.5 3.5L9 4" /></svg>
    </label>
  );
}

/* ── Style system (surface / border / graphics presets) ────── */
export interface GStyle { id: string; label: string; }
export const G_STYLES: GStyle[] = [
  { id: 'aura',      label: 'Aura' },
  { id: 'blueprint', label: 'Blueprint' },
  { id: 'glass',     label: 'Glass' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'neon',      label: 'Neon HUD' },
];
interface GStyleCtxValue { style: string; setStyle: (id: string) => void; styles: GStyle[]; }
const GStyleCtx = createContext<GStyleCtxValue | null>(null);
const G_STYLE_KEY = 'op-graph-style';

export function GraphStyleProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyle] = useState<string>(() => {
    if (typeof window === 'undefined') return 'aura';
    const s = localStorage.getItem(G_STYLE_KEY);
    return G_STYLES.some((x) => x.id === s) ? (s as string) : 'aura';
  });
  const set = (id: string) => { setStyle(id); try { localStorage.setItem(G_STYLE_KEY, id); } catch (e) {} };
  return <GStyleCtx.Provider value={{ style, setStyle: set, styles: G_STYLES }}>{children}</GStyleCtx.Provider>;
}
export const useGraphStyle = (): GStyleCtxValue => useContext(GStyleCtx) || { style: 'aura', setStyle: () => {}, styles: G_STYLES };

export function GraphStyleSwitcher() {
  const { style, setStyle, styles } = useGraphStyle();
  return (
    <label className="g-fontsel g-stylesel" title="Surface & graphics style">
      <svg className="g-stylesel-ico" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="12" height="12" rx="2" /><path d="M2 6h12M6 6v8" strokeWidth="1.2" />
      </svg>
      <select value={style} onChange={(e) => setStyle(e.target.value)}>
        {styles.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
      </select>
      <svg width="10" height="10" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 4l3.5 3.5L9 4" /></svg>
    </label>
  );
}

/* ── Legend chip row ───────────────────────────────────────── */
export function GLegend({ items }: { items: { kind: string; label: string }[] }) {
  return (
    <div className="g-legend">
      {items.map((it, i) => (
        <span key={i} className="g-legend-item">
          <span className={'g-legend-key g-legend-key--' + it.kind} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

/* ── Lightweight ticking counter (seconds since mount) ─────── */
export function useTick(start = 0) {
  const [n, setN] = useState(start);
  useEffect(() => {
    const t = setInterval(() => setN((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return n;
}
