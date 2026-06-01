'use client';
/* Operator Console — route entry. Wraps the shell in the font / theme / industry
   providers, mirroring the App() composition from the design bundle's
   "Operator Console.html". */

import './operator-console.css';
import { GraphFontProvider, GraphThemeProvider } from './graph';
import { IndustryProvider } from './shared';
import { Console } from './Console';

export default function OperatorConsolePage() {
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
