'use client';
/* Operator command palette — the summonable "floating deck" from the Desktop
   handoff (Treatment A · ⌘K Spotlight panel). Overlays the whole console from
   any screen: ask the Operator, run a suggestion, dismiss with ESC. Themed
   entirely off the shared --color-* tokens so it follows Vibrant dark/light. */

import React, { useState, useRef, useEffect } from 'react';
import { useIndustry, OpIcon } from './shared';

interface Line { who: 'you' | 'op'; text: string; }

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data } = useIndustry();
  const first = data.drafts[0]?.who.split(' ')[0] || 'the next lead';
  const suggestions = [
    'Approve all safe drafts',
    'Show me the pipeline',
    'What slipped today?',
    `Draft a reply to ${first}`,
  ];

  const [msgs, setMsgs] = useState<Line[]>([]);
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Seed the thread each time the palette opens, then focus the input.
  useEffect(() => {
    if (!open) return;
    setMsgs([{ who: 'you', text: "What's urgent today?" }, { who: 'op', text: data.chatOpener }]);
    setBusy(false);
    const id = setTimeout(() => inputRef.current?.focus(), 40);
    return () => clearTimeout(id);
  }, [open, data.chatOpener]);

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs, busy]);

  if (!open) return null;

  const ask = (text: string) => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { who: 'you', text }]);
    setBusy(true);
    setTimeout(() => { setMsgs((m) => [...m, { who: 'op', text: data.chatConfirm }]); setBusy(false); }, 1000);
  };

  return (
    <div className="op-cmdk-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="op-cmdk" role="dialog" aria-label="Operator command palette">
        <div className="op-cmdk-search">
          <OpIcon name="search" size={19} />
          <input
            ref={inputRef}
            className="op-cmdk-input"
            placeholder="Ask the Operator, or jump to anything…"
            onKeyDown={(e) => {
              const el = e.target as HTMLInputElement;
              if (e.key === 'Enter' && el.value.trim()) { ask(el.value.trim()); el.value = ''; }
              if (e.key === 'Escape') onClose();
            }}
          />
          <button className="op-cmdk-esc" onClick={onClose}>ESC</button>
        </div>
        <div className="op-cmdk-body" ref={bodyRef}>
          <div className="op-cmdk-thread">
            {msgs.map((m, i) => <div key={i} className={'op-cmdk-bub op-cmdk-bub--' + m.who}>{m.text}</div>)}
            {busy && (
              <div className="op-cmdk-bub op-cmdk-bub--think">
                <span className="op-cmdk-dots"><i /><i /><i /></span> Working on it…
              </div>
            )}
          </div>
          <div className="op-cmdk-label">Suggested</div>
          <div className="op-cmdk-suggests">
            {suggestions.map((s, i) => (
              <button key={i} className="op-cmdk-suggest" onClick={() => ask(s)}>
                <OpIcon name="sparkles" size={15} /><span>{s}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
