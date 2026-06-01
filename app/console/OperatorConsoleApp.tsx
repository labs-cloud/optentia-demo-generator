'use client';
/* Operator Console — composed app (font / theme / industry providers + shell).
   Mirrors the App() composition from the design bundle's "Operator Console.html".
   Shared by the root, the per-client demo route, and /console. */

import './operator-console.css';
import { GraphFontProvider, GraphThemeProvider } from './graph';
import { IndustryProvider } from './shared';
import { Console } from './Console';

export default function OperatorConsoleApp() {
  return (
    <GraphFontProvider>
      <GraphThemeProvider>
        <IndustryProvider>
          <Console />
        </IndustryProvider>
      </GraphThemeProvider>
    </GraphFontProvider>
  );
}
