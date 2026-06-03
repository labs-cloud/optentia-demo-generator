# Operator Command Center

Reusable SaaS demo platform for Optentia sales demos.

Operator Command Center shows how an AI Chief of Staff manages daily business operations across inboxes, tasks, calendars, pipelines, follow-ups, and escalations. The real estate brokerage demo is preserved as the first client-driven implementation at `/demo/chaim`.

## Local Development

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open the default demo:

```text
http://localhost:3000/demo/chaim
```

If port `3000` is already in use, Next.js will print the alternate local URL.

## Available Demos

```text
/demo/chaim
/demo/lawfirm
/demo/construction
/demo/insurance
```

The root route `/` redirects to `/demo/chaim`.

## Operator Console

A second, self-contained surface lives at:

```text
/console
```

The Operator Console is the unified dashboard from the Claude Design handoff — a
sidebar shell with every tab (Command Center, Conversations, Activity, Schedule,
Channels, Records, Agent Graph, Settings) plus three top-bar selectors that
re-skin the whole console live:

- **Type** — six curated font pairings (Editorial, Grotesk, Newsprint, Display, Elegant, Technical)
- **Theme** — six premium palettes (Optentia, Graphite, Aubergine, Slate, Sand, Porcelain)
- **Demo industry** — fourteen industries that repopulate every screen from one data model

The **Agent Graph** tab carries three living layouts as sub-tabs — Hierarchy
(Mesh), Mission Control (Orbit), and Pipeline Flow — with animated delegation,
escalation, and inbound pulses. The Operator silhouette is the brand mark
throughout. Selections persist in `localStorage`.

Implementation lives in `app/console/` (styles in `operator-console.css`,
data in `data.ts`, primitives in `shared.tsx` / `graph.tsx`, screens in
`concepts.tsx` / `pages.tsx`, shell in `Console.tsx`). The silhouette and brand
assets are served from `public/console/`.

## Project Overview

This app turns a single polished client dashboard into a reusable demo-generation platform. Dashboard code stays stable while each prospect demo is powered by a JSON file in `/data/clients`.

Core behavior:

- Client-specific KPI cards, activity feed, pipeline, inbox, tasks, calendar, escalations, capabilities, and demo scenario.
- Reusable simulation engine that adds live activity events when the demo flow runs.
- Strong TypeScript models for the shared data contract.
- Premium executive SaaS visual system using dark navy, black, white, gold, and teal accents.

## Folder Structure

```text
app/
  demo/[client]/page.tsx     Dynamic client demo route
  globals.css                Global visual system
  layout.jsx                 App metadata and root layout
  page.jsx                   Redirects to /demo/chaim

components/
  ActivityFeed.tsx
  CalendarPanel.tsx
  CapabilitiesPanel.tsx
  DemoScenarioRunner.tsx
  EscalationCenter.tsx
  KPICards.tsx
  OperatorCommandCenter.tsx
  PipelineBoard.tsx
  TaskBoard.tsx
  UnifiedInbox.tsx
  ui.tsx

data/
  clients/
    chaim.json
    construction.json
    insurance.json
    lawfirm.json

lib/
  client-data.ts             Client registry and lookup
  simulation-engine.ts       Reusable demo simulation

types/
  demo.ts                    Shared Client, Lead, Task, Appointment, Message, Escalation, and KPI models
```

## How To Create A New Client Demo

1. Create a new JSON file in `/data/clients`, for example:

```text
data/clients/acme.json
```

2. Match the existing `Client` shape from `/types/demo.ts`. The fastest path is to copy one starter template and update:

- `slug`
- `company`
- `industry`
- KPI values
- activity feed
- pipeline leads
- inbox messages
- tasks
- appointments
- escalations
- capabilities
- demo scenario events

3. Visit:

```text
/demo/acme
```

No dashboard code changes are required for a new prospect demo. The route automatically loads matching JSON files from `/data/clients`.

## Demo Engine

The simulation engine lives in `/lib/simulation-engine.ts`.

When a user asks the Operator a question or gives a direction, client-specific activity is inserted into the live activity stream. Each client can tell a different operational story while using the same product shell.

The standard flow demonstrates:

1. New lead arrives
2. Operator responds
3. Lead is qualified
4. Appointment is booked
5. Task is created
6. Escalation occurs if needed

## GitHub Workflow

This project is connected to:

```text
https://github.com/labs-cloud/optentia-demo-generator
```

Use the existing repository. Do not create a new repository and do not rename it.

Recommended workflow:

```bash
git status
git add .
git commit -m "Refactor dashboard into reusable client demo platform"
git push
```

## Vercel Deployment

Connect the existing GitHub repository to Vercel and use the default Next.js settings.

Recommended settings:

- Framework Preset: `Next.js`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `.next`

After deployment, demos will be available at:

```text
https://your-vercel-domain/demo/chaim
https://your-vercel-domain/demo/lawfirm
https://your-vercel-domain/demo/construction
https://your-vercel-domain/demo/insurance
```
