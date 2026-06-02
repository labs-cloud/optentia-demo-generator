/* Optentia · Operator Demo Generator — Industry data model
   One normalized schema, 12 industries. Every concept renders from this.
   All numbers/names are illustrative mockup data. */

export interface Persona { name: string; initials: string; role: string; company: string; }
export interface Kpi { label: string; value: string; delta: string; tone: string; unit?: string; accent?: boolean; }
export interface Stage { stage: string; value: number; }
export type LogEntry = [string, string, string];
export interface Draft { who: string; co: string; channel: string; subj: string; preview: string; flag: string | null; when: string; }
export interface EventItem { t: string; title: string; who: string; tone: string; }
export interface Flow { name: string; last: string; state: string; }
export interface TeamMember { name: string; initials: string; role: string; picks: string; }

export interface Industry {
  id: string; label: string; tagline: string;
  persona: Persona;
  date: string; streak: string;
  kpis: Kpi[];
  pipeline: Stage[];
  log: LogEntry[];
  drafts: Draft[];
  events: EventItem[];
  flows: Flow[];
  briefLede: string;
  chatOpener: string;
  chatConfirm: string;
}

export const OP_INDUSTRIES: Industry[] = [
  /* ── 1 · Hospitality ───────────────────────────────────────── */
  {
    id: 'hotels', label: 'Hospitality', tagline: 'Hotels & Resorts',
    persona: { name: 'Kiran Patel', initials: 'KP', role: 'GM', company: 'The Atlas Hotel Group' },
    date: 'Friday · May 30',
    streak: '240h streak',
    kpis: [
      { label: 'Booking pipeline · 7d', value: '$84,200', delta: '+ $21.4K vs prev 7d', tone: 'up', accent: true },
      { label: 'Inquiries to review', value: '9', delta: '2 flagged urgent', tone: 'flat' },
      { label: 'Site visits booked', value: '11', delta: '4 booked overnight', tone: 'up' },
      { label: 'Hours given back', value: '8.1', unit: 'hr', delta: '≈ 1 work day · this week', tone: 'flat' },
    ],
    pipeline: [
      { stage: 'New inquiries', value: 38 },
      { stage: 'Quoted', value: 21 },
      { stage: 'Site visit', value: 11 },
      { stage: 'Contract sent', value: 6 },
    ],
    log: [
      ['07:38', 'Done', 'Replied to 11 group-booking inquiries that sat overnight.'],
      ['08:04', 'Done', 'Upsold 2 standard bookings to suites — +$3,400 confirmed.'],
      ['08:51', 'Done', 'Recovered 1 abandoned wedding-block hold; re-sent the contract.'],
      ['09:30', 'Review', 'Drafted reply to the Hendricks wedding block — needs your sign-off.'],
      ['09:47', 'Failed', 'Could not sync the rate calendar — reconnect Cloudbeds in Settings.'],
      ['10:12', 'Note', '3 new WhatsApp inquiries from the website — none flagged urgent.'],
      ['11:05', 'Done', 'Updated 5 event holds in the PMS from this morning\u2019s calls.'],
    ],
    drafts: [
      { who: 'Rachel Hendricks', co: 'Wedding · 120 pax', channel: 'Email', subj: 'Re: October ballroom + room block', preview: 'Hi Rachel — yes, the Grand Ballroom is open Oct 18. I\u2019ve held 40 rooms at the group rate and attached the banquet menu\u2026', flag: 'urgent', when: '12m ago' },
      { who: 'Daniel Cho', co: 'Lyft · offsite', channel: 'Email', subj: 'Re: Q3 leadership offsite — 60 rooms', preview: 'Daniel — happy to host the offsite. Sharing two date options and a meeting-space layout for 60\u2026', flag: null, when: '41m ago' },
      { who: 'Priya Mehta', co: 'Returning guest', channel: 'WhatsApp', subj: 'Re: Anniversary suite request', preview: 'Priya — lovely to have you back. The Harbour Suite is available; I\u2019ve added the champagne turndown you had last time\u2026', flag: null, when: '1h ago' },
    ],
    events: [
      { t: '10:30', title: 'Ops standup · front desk', who: 'Recurring', tone: 'flat' },
      { t: '12:00', title: 'Hendricks wedding — site visit', who: 'Booked overnight', tone: 'accent' },
      { t: '14:00', title: 'Lyft offsite walkthrough', who: 'Booked overnight', tone: 'flat' },
      { t: '16:30', title: 'Revenue review · weekend rates', who: 'Recurring', tone: 'flat' },
    ],
    flows: [
      { name: 'Inquiry triage', last: 'ran 9m ago', state: 'live' },
      { name: 'Abandoned-booking recovery', last: 'ran 3h ago', state: 'live' },
      { name: 'Pre-arrival upsell', last: 'ran 1h ago', state: 'live' },
      { name: 'Weekend rate digest', last: 'next: 17:00', state: 'scheduled' },
    ],
    briefLede: 'While the hotel slept, the Operator worked the inbound queue, upsold two suites, and recovered a wedding block worth $18,000.',
    chatOpener: 'Morning, Kiran. While the property slept I cleared the overnight inquiry queue — 17 actions, zero errors.',
    chatConfirm: 'Sent. Rachel has the ballroom hold and menu now — I\u2019ll chase if she\u2019s quiet by Monday and keep the 40 rooms blocked.',
  },

  /* ── 2 · Real estate ───────────────────────────────────────── */
  {
    id: 'realestate', label: 'Real estate', tagline: 'Brokerage',
    persona: { name: 'Maya Bennett', initials: 'MB', role: 'Principal', company: 'Bennett & Co Realty' },
    date: 'Friday · May 30',
    streak: '186h streak',
    kpis: [
      { label: 'Pipeline · active deals', value: '$1.42M', delta: '+ $310K vs prev 7d', tone: 'up', accent: true },
      { label: 'Leads to review', value: '14', delta: '3 flagged hot', tone: 'flat' },
      { label: 'Showings booked', value: '22', delta: '6 booked overnight', tone: 'up' },
      { label: 'Hours given back', value: '9.3', unit: 'hr', delta: '\u2248 1.2 work days · this week', tone: 'flat' },
    ],
    pipeline: [
      { stage: 'New leads', value: 64 },
      { stage: 'Qualified', value: 31 },
      { stage: 'Showing', value: 22 },
      { stage: 'Offer', value: 7 },
    ],
    log: [
      ['07:21', 'Done', 'Followed up 18 portal leads that went cold past 24h.'],
      ['07:58', 'Done', 'Booked 6 showings for the weekend across 3 listings.'],
      ['08:40', 'Done', 'Sent 4 tailored CMAs to seller leads from last night.'],
      ['09:25', 'Review', 'Drafted offer-response to the Maple Ave buyers — needs your sign-off.'],
      ['09:52', 'Failed', 'Could not reach the MLS feed — reconnect in Settings.'],
      ['10:18', 'Note', '2 new SMS leads from the yard-sign QR — both first-time buyers.'],
      ['11:11', 'Done', 'Updated 9 deal stages in Follow Up Boss from this morning.'],
    ],
    drafts: [
      { who: 'Greg & Tara Lowe', co: 'Maple Ave buyers', channel: 'Email', subj: 'Re: Counter on 214 Maple Ave', preview: 'Greg, Tara — the sellers countered at $612K and will cover the home-warranty. I\u2019d recommend we hold firm on the close date\u2026', flag: 'hot', when: '8m ago' },
      { who: 'Jordan Park', co: 'Seller · Birch St', channel: 'Email', subj: 'Re: Listing strategy + pricing', preview: 'Jordan — based on the 3 closed comps this month I\u2019d list at $589K. Here\u2019s the CMA and a pre-list checklist\u2026', flag: null, when: '34m ago' },
      { who: 'Aisha Noor', co: 'First-time buyer', channel: 'SMS', subj: 'Re: Saturday showings', preview: 'Aisha — I\u2019ve lined up three in your budget for Saturday at 11, 12 and 1. Want me to add the Elm St condo too?', flag: null, when: '1h ago' },
    ],
    events: [
      { t: '10:00', title: 'Team pipeline standup', who: 'Recurring', tone: 'flat' },
      { t: '11:30', title: 'Maple Ave buyers — offer call', who: 'Booked overnight', tone: 'accent' },
      { t: '14:00', title: 'Birch St listing presentation', who: 'Booked overnight', tone: 'flat' },
      { t: '16:00', title: 'Saturday showing prep', who: 'Recurring', tone: 'flat' },
    ],
    flows: [
      { name: 'Portal-lead speed-to-lead', last: 'ran 6m ago', state: 'live' },
      { name: 'Cold-lead revival', last: 'ran 2h ago', state: 'live' },
      { name: 'CRM stage sync', last: 'ran 1h ago', state: 'live' },
      { name: 'Weekly seller digest', last: 'next: 17:00', state: 'scheduled' },
    ],
    briefLede: 'Overnight, the Operator revived 18 cold portal leads, booked 6 weekend showings, and moved $310K of new deals into the pipeline.',
    chatOpener: 'Morning, Maya. I worked the overnight lead queue — every portal inquiry over 24h cold now has a personal reply.',
    chatConfirm: 'Sent. The Lowes have the counter terms and I\u2019ve booked the offer call for 11:30 — I\u2019ll prep the comps sheet before it.',
  },

  /* ── 3 · Healthcare ────────────────────────────────────────── */
  {
    id: 'healthcare', label: 'Healthcare', tagline: 'Clinics & practices',
    persona: { name: 'Dr. Aisha Rahman', initials: 'AR', role: 'Owner', company: 'Brightwell Clinics' },
    date: 'Friday · May 30',
    streak: '312h streak',
    kpis: [
      { label: 'Treatment pipeline · 7d', value: '$62,800', delta: '+ $9.6K vs prev 7d', tone: 'up', accent: true },
      { label: 'New-patient forms', value: '8', delta: '2 flagged urgent', tone: 'flat' },
      { label: 'Consults booked', value: '17', delta: '5 filled from cancellations', tone: 'up' },
      { label: 'Hours given back', value: '11.2', unit: 'hr', delta: '\u2248 1.4 work days · this week', tone: 'flat' },
    ],
    pipeline: [
      { stage: 'New patients', value: 29 },
      { stage: 'Consult booked', value: 17 },
      { stage: 'Plan presented', value: 12 },
      { stage: 'Accepted', value: 8 },
    ],
    log: [
      ['07:30', 'Done', 'Filled 5 same-day cancellations from the waitlist.'],
      ['08:02', 'Done', 'Sent 22 recall reminders to patients overdue for a visit.'],
      ['08:45', 'Done', 'Booked 4 new-patient consults requested overnight.'],
      ['09:20', 'Review', 'Drafted reply to a new-patient insurance question — needs your sign-off.'],
      ['09:48', 'Failed', 'Could not write back to the practice management system — reconnect in Settings.'],
      ['10:15', 'Note', '3 new website intake forms — none flagged as clinical-urgent.'],
      ['11:08', 'Done', 'Confirmed tomorrow\u2019s 14 appointments and cut no-show risk flags.'],
    ],
    drafts: [
      { who: 'New patient', co: 'Implant consult', channel: 'Email', subj: 'Re: Does my plan cover the consult?', preview: 'Thanks for reaching out. The initial consult is covered under most PPO plans — I\u2019ve attached what to bring and three open times this week\u2026', flag: 'urgent', when: '15m ago' },
      { who: 'Returning patient', co: 'Recall · 9 months', channel: 'SMS', subj: 'Re: Time to book your check-up', preview: 'Hi — it\u2019s been a while since your last visit. I have Tuesday 10am or Thursday 2pm. Reply with a number and I\u2019ll lock it in\u2026', flag: null, when: '37m ago' },
      { who: 'Referral', co: 'From Dr. Lin', channel: 'Email', subj: 'Re: Referral received — next steps', preview: 'We received Dr. Lin\u2019s referral. I\u2019ve opened a chart and can offer a consult Monday or Wednesday morning\u2026', flag: null, when: '1h ago' },
    ],
    events: [
      { t: '09:00', title: 'Morning huddle · clinical team', who: 'Recurring', tone: 'flat' },
      { t: '11:00', title: 'New-patient implant consult', who: 'Filled from waitlist', tone: 'accent' },
      { t: '13:30', title: 'Treatment-plan review block', who: 'Recurring', tone: 'flat' },
      { t: '15:00', title: 'Referral consult · Dr. Lin', who: 'Booked overnight', tone: 'flat' },
    ],
    flows: [
      { name: 'Waitlist cancellation-fill', last: 'ran 11m ago', state: 'live' },
      { name: 'Recall reactivation', last: 'ran 2h ago', state: 'live' },
      { name: 'New-patient intake', last: 'ran 40m ago', state: 'live' },
      { name: 'Next-day confirmations', last: 'next: 16:00', state: 'scheduled' },
    ],
    briefLede: 'Before the clinic opened, the Operator filled 5 cancellations from the waitlist, sent 22 recalls, and booked 4 new-patient consults.',
    chatOpener: 'Morning, Dr. Rahman. I rebuilt today\u2019s schedule overnight — every cancellation is backfilled and tomorrow is confirmed.',
    chatConfirm: 'Sent. The patient has coverage details and three consult times — I\u2019ll hold the implant slot at 11 until they confirm.',
  },

  /* ── 4 · Law firm ──────────────────────────────────────────── */
  {
    id: 'law', label: 'Law firm', tagline: 'Boutique practice',
    persona: { name: 'David Okafor', initials: 'DO', role: 'Managing Partner', company: 'Okafor & Reyes LLP' },
    date: 'Friday · May 30',
    streak: '204h streak',
    kpis: [
      { label: 'Signed-matter pipeline', value: '$148K', delta: '+ $34K vs prev 7d', tone: 'up', accent: true },
      { label: 'Intakes to review', value: '11', delta: '3 within statute window', tone: 'flat' },
      { label: 'Consults booked', value: '13', delta: '4 booked overnight', tone: 'up' },
      { label: 'Hours given back', value: '10.6', unit: 'hr', delta: '\u2248 1.3 work days · this week', tone: 'flat' },
    ],
    pipeline: [
      { stage: 'New intakes', value: 41 },
      { stage: 'Screened', value: 24 },
      { stage: 'Consult', value: 13 },
      { stage: 'Retained', value: 6 },
    ],
    log: [
      ['07:25', 'Done', 'Screened 14 overnight intakes against your case criteria.'],
      ['08:06', 'Done', 'Booked 4 consults for qualified leads; declined 2 conflicts.'],
      ['08:50', 'Done', 'Sent 3 engagement letters to clients who verbally agreed.'],
      ['09:18', 'Review', 'Drafted reply to a personal-injury inquiry — needs your sign-off.'],
      ['09:44', 'Failed', 'Could not file the intake to Clio — reconnect in Settings.'],
      ['10:10', 'Note', '2 new intakes near a filing deadline — flagged for priority review.'],
      ['11:02', 'Done', 'Logged 9 matters and updated stages in the case management system.'],
    ],
    drafts: [
      { who: 'Prospective client', co: 'PI · auto', channel: 'Email', subj: 'Re: Were you at fault? Next steps', preview: 'Thank you for reaching out. Based on what you\u2019ve described there may be a clear claim. I\u2019ve held a consult Thursday 3pm and listed what to bring\u2026', flag: 'deadline', when: '10m ago' },
      { who: 'Referral', co: 'From a past client', channel: 'Email', subj: 'Re: Family law consultation', preview: 'Thanks for the referral. I can offer a confidential consult Monday or Tuesday. Here\u2019s a short intake form to complete beforehand\u2026', flag: null, when: '39m ago' },
      { who: 'Existing client', co: 'Matter #2208', channel: 'SMS', subj: 'Re: Document signing reminder', preview: 'Hi — a quick reminder that the retainer needs your e-signature by Friday. The secure link is below; it takes two minutes\u2026', flag: null, when: '1h ago' },
    ],
    events: [
      { t: '09:30', title: 'Partners\u2019 case review', who: 'Recurring', tone: 'flat' },
      { t: '11:00', title: 'New PI consult · screened', who: 'Booked overnight', tone: 'accent' },
      { t: '14:00', title: 'Family-law referral consult', who: 'Booked overnight', tone: 'flat' },
      { t: '16:00', title: 'Filing-deadline review', who: 'Priority', tone: 'flat' },
    ],
    flows: [
      { name: 'Intake screening', last: 'ran 7m ago', state: 'live' },
      { name: 'Conflict check', last: 'ran 1h ago', state: 'live' },
      { name: 'Engagement-letter send', last: 'ran 50m ago', state: 'live' },
      { name: 'Deadline watch', last: 'next: 16:00', state: 'scheduled' },
    ],
    briefLede: 'Overnight, the Operator screened 14 intakes against your criteria, booked 4 qualified consults, and flagged 2 matters near a filing deadline.',
    chatOpener: 'Morning, David. I screened the overnight intakes against your case criteria — qualified leads are booked, conflicts declined.',
    chatConfirm: 'Sent. The consult is held for Thursday 3pm and the intake form is on its way — I\u2019ve flagged the statute date in your calendar.',
  },

  /* ── 5 · Financial services ────────────────────────────────── */
  {
    id: 'finance', label: 'Financial services', tagline: 'Wealth & advisory',
    persona: { name: 'Elena Vasquez', initials: 'EV', role: 'Principal', company: 'Meridian Wealth' },
    date: 'Friday · May 30',
    streak: '268h streak',
    kpis: [
      { label: 'AUM in motion · 7d', value: '$3.8M', delta: '+ $720K vs prev 7d', tone: 'up', accent: true },
      { label: 'Items to review', value: '10', delta: '2 flagged urgent', tone: 'flat' },
      { label: 'Reviews booked', value: '16', delta: '5 booked overnight', tone: 'up' },
      { label: 'Hours given back', value: '9.8', unit: 'hr', delta: '\u2248 1.2 work days · this week', tone: 'flat' },
    ],
    pipeline: [
      { stage: 'Referrals', value: 33 },
      { stage: 'Discovery', value: 19 },
      { stage: 'Proposal', value: 11 },
      { stage: 'Onboarding', value: 5 },
    ],
    log: [
      ['07:28', 'Done', 'Scheduled 16 annual reviews and sent each client an agenda.'],
      ['08:08', 'Done', 'Followed up 9 referrals from this month\u2019s client intros.'],
      ['08:52', 'Done', 'Sent onboarding paperwork to 3 households who signed last week.'],
      ['09:22', 'Review', 'Drafted reply to a prospect\u2019s fee question — needs your sign-off.'],
      ['09:50', 'Failed', 'Could not sync to the CRM — reconnect Redtail in Settings.'],
      ['10:14', 'Note', '2 new referrals from a CPA partner — both above your minimum.'],
      ['11:06', 'Done', 'Prepared 6 review packets and flagged 2 rebalancing candidates.'],
    ],
    drafts: [
      { who: 'Prospective household', co: 'Referral · $1.2M', channel: 'Email', subj: 'Re: How are your fees structured?', preview: 'Thanks for the question. Our advisory fee is tiered and all-in — I\u2019ve attached a one-page breakdown and two times for a discovery call\u2026', flag: 'urgent', when: '13m ago' },
      { who: 'CPA partner', co: 'Referral intro', channel: 'Email', subj: 'Re: Introduction — the Carters', preview: 'Thanks for the intro. I\u2019ll reach out to the Carters today and keep you posted. Here\u2019s a brief on how we typically work with referrals\u2026', flag: null, when: '36m ago' },
      { who: 'Existing client', co: 'Annual review', channel: 'SMS', subj: 'Re: Your review — agenda attached', preview: 'Hi — ahead of Tuesday\u2019s review I\u2019ve attached the agenda and a snapshot of where things stand. Anything you\u2019d like to add?', flag: null, when: '1h ago' },
    ],
    events: [
      { t: '09:00', title: 'Investment committee', who: 'Recurring', tone: 'flat' },
      { t: '11:00', title: 'Discovery call · $1.2M referral', who: 'Booked overnight', tone: 'accent' },
      { t: '13:30', title: 'Annual review · the Okonkwos', who: 'Booked overnight', tone: 'flat' },
      { t: '15:30', title: 'CPA partner check-in', who: 'Recurring', tone: 'flat' },
    ],
    flows: [
      { name: 'Referral follow-up', last: 'ran 8m ago', state: 'live' },
      { name: 'Annual-review scheduling', last: 'ran 1h ago', state: 'live' },
      { name: 'Onboarding paperwork', last: 'ran 45m ago', state: 'live' },
      { name: 'Quarterly client digest', last: 'next: 17:00', state: 'scheduled' },
    ],
    briefLede: 'Overnight, the Operator scheduled 16 annual reviews, followed up 9 referrals, and moved $720K of new assets into discovery.',
    chatOpener: 'Morning, Elena. Annual-review season is handled — 16 clients booked with agendas sent, and your referral queue is worked.',
    chatConfirm: 'Sent. The prospect has the fee breakdown and two discovery times — I\u2019ll log the meeting and prep a household summary once they pick.',
  },

  /* ── 6 · Construction / trades ─────────────────────────────── */
  {
    id: 'construction', label: 'Construction', tagline: 'Trades & design-build',
    persona: { name: 'Marcus Hale', initials: 'MH', role: 'Owner', company: 'Hale Build Co.' },
    date: 'Friday · May 30',
    streak: '158h streak',
    kpis: [
      { label: 'Quoted-job pipeline', value: '$412K', delta: '+ $88K vs prev 7d', tone: 'up', accent: true },
      { label: 'Estimates to review', value: '7', delta: '2 flagged urgent', tone: 'flat' },
      { label: 'Site visits booked', value: '12', delta: '4 booked overnight', tone: 'up' },
      { label: 'Hours given back', value: '8.7', unit: 'hr', delta: '\u2248 1.1 work days · this week', tone: 'flat' },
    ],
    pipeline: [
      { stage: 'New inquiries', value: 36 },
      { stage: 'Site visit', value: 18 },
      { stage: 'Quoted', value: 12 },
      { stage: 'Won', value: 5 },
    ],
    log: [
      ['07:15', 'Done', 'Replied to 13 remodel inquiries that came in after hours.'],
      ['07:52', 'Done', 'Booked 4 site visits and routed them around your crew\u2019s map.'],
      ['08:38', 'Done', 'Followed up 6 quotes sent last week that hadn\u2019t replied.'],
      ['09:16', 'Review', 'Drafted a kitchen-remodel quote follow-up — needs your sign-off.'],
      ['09:42', 'Failed', 'Could not push to the estimating tool — reconnect in Settings.'],
      ['10:08', 'Note', '3 new leads from the truck-wrap QR code — all in your service area.'],
      ['11:00', 'Done', 'Updated 8 jobs in the pipeline from this morning\u2019s site visits.'],
    ],
    drafts: [
      { who: 'The Almeidas', co: 'Kitchen remodel', channel: 'Email', subj: 'Re: Quote follow-up — full kitchen', preview: 'Hi — following up on the $48K kitchen quote. I\u2019ve held a crew window for late June and can lock current material pricing if we move this week\u2026', flag: 'urgent', when: '11m ago' },
      { who: 'Property manager', co: '6-unit · turns', channel: 'Email', subj: 'Re: Bid for unit turnovers', preview: 'Thanks for the RFP. I\u2019ve scoped all six units and can walk the property Thursday. Rough range and a line-item breakdown attached\u2026', flag: null, when: '38m ago' },
      { who: 'New homeowner', co: 'Bathroom', channel: 'SMS', subj: 'Re: Site visit for the bathroom', preview: 'Hi — I can swing by Wednesday between 8 and 10 to measure and talk options. Does that window work for you?', flag: null, when: '1h ago' },
    ],
    events: [
      { t: '07:00', title: 'Crew dispatch · day plan', who: 'Recurring', tone: 'flat' },
      { t: '10:00', title: 'Almeida kitchen — site visit', who: 'Booked overnight', tone: 'accent' },
      { t: '13:00', title: '6-unit turnover walkthrough', who: 'Booked overnight', tone: 'flat' },
      { t: '15:30', title: 'Supplier pricing call', who: 'Recurring', tone: 'flat' },
    ],
    flows: [
      { name: 'After-hours inquiry catch', last: 'ran 10m ago', state: 'live' },
      { name: 'Quote follow-up', last: 'ran 2h ago', state: 'live' },
      { name: 'Site-visit routing', last: 'ran 1h ago', state: 'live' },
      { name: 'Weekly job digest', last: 'next: 17:00', state: 'scheduled' },
    ],
    briefLede: 'Before the crew rolled out, the Operator answered 13 after-hours inquiries, booked 4 site visits, and chased $88K of open quotes.',
    chatOpener: 'Morning, Marcus. Every after-hours inquiry has a reply and your site visits are routed around the crew\u2019s map for the day.',
    chatConfirm: 'Sent. The Almeidas have the quote follow-up with the June window — I\u2019ll lock material pricing the moment they say go.',
  },

  /* ── 7 · E-commerce / DTC ──────────────────────────────────── */
  {
    id: 'ecommerce', label: 'E-commerce', tagline: 'DTC brand',
    persona: { name: 'Sofia Lin', initials: 'SL', role: 'Founder', company: 'Maru Goods' },
    date: 'Friday · May 30',
    streak: '221h streak',
    kpis: [
      { label: 'Recovered revenue · 7d', value: '$28,940', delta: '+ $7.1K vs prev 7d', tone: 'up', accent: true },
      { label: 'Tickets to review', value: '6', delta: '2 flagged VIP', tone: 'flat' },
      { label: 'Carts recovered', value: '47', delta: '12 recovered overnight', tone: 'up' },
      { label: 'Hours given back', value: '12.4', unit: 'hr', delta: '\u2248 1.5 work days · this week', tone: 'flat' },
    ],
    pipeline: [
      { stage: 'Sessions', value: 92 },
      { stage: 'Add to cart', value: 41 },
      { stage: 'Recovered', value: 47 },
      { stage: 'Wholesale', value: 6 },
    ],
    log: [
      ['07:10', 'Done', 'Recovered 12 abandoned carts overnight — $2,340 captured.'],
      ['07:48', 'Done', 'Answered 31 WISMO tickets with live tracking links.'],
      ['08:30', 'Done', 'Processed 9 return requests inside policy automatically.'],
      ['09:12', 'Review', 'Drafted reply to a wholesale inquiry — needs your sign-off.'],
      ['09:40', 'Failed', 'Could not reach the 3PL API — reconnect in Settings.'],
      ['10:06', 'Note', '2 VIP customers messaged on Instagram — flagged for a personal reply.'],
      ['11:00', 'Done', 'Tagged 18 at-risk subscribers for a win-back flow.'],
    ],
    drafts: [
      { who: 'Boutique buyer', co: 'Wholesale · 40 stores', channel: 'Email', subj: 'Re: Wholesale terms + line sheet', preview: 'Hi — thanks for the interest. I\u2019ve attached our line sheet and MOQ. For a 40-door order I can offer net-30 and a first-order discount\u2026', flag: 'vip', when: '9m ago' },
      { who: 'Repeat customer', co: 'VIP · 14 orders', channel: 'WhatsApp', subj: 'Re: Restock on the sold-out tote', preview: 'Hi Dana — the Canvas Tote restocks Tuesday. I\u2019ve set aside one in your usual color and will send the link before it goes public\u2026', flag: null, when: '35m ago' },
      { who: 'New customer', co: 'First order', channel: 'Email', subj: 'Re: Where\u2019s my order?', preview: 'Hi — your order shipped this morning and is out for delivery today. Tracking is below, and I\u2019ve added a little something for the wait\u2026', flag: null, when: '1h ago' },
    ],
    events: [
      { t: '09:00', title: 'Ops + fulfillment sync', who: 'Recurring', tone: 'flat' },
      { t: '11:00', title: 'Wholesale buyer call · 40 doors', who: 'Booked overnight', tone: 'accent' },
      { t: '13:30', title: 'Restock planning · totes', who: 'Recurring', tone: 'flat' },
      { t: '15:00', title: 'Influencer gifting review', who: 'Recurring', tone: 'flat' },
    ],
    flows: [
      { name: 'Abandoned-cart recovery', last: 'ran 5m ago', state: 'live' },
      { name: 'WISMO auto-resolve', last: 'ran 20m ago', state: 'live' },
      { name: 'Returns inside policy', last: 'ran 1h ago', state: 'live' },
      { name: 'Subscriber win-back', last: 'next: 18:00', state: 'scheduled' },
    ],
    briefLede: 'Overnight, the Operator recovered 12 abandoned carts, cleared 31 support tickets, and opened a 40-door wholesale conversation.',
    chatOpener: 'Morning, Sofia. The overnight queue is clear — carts recovered, support answered, returns processed. Here\u2019s what made money.',
    chatConfirm: 'Sent. The buyer has the line sheet and net-30 offer — I\u2019ve booked the call for 11 and flagged the order if they want to move fast.',
  },

  /* ── 8 · Recruiting / staffing ─────────────────────────────── */
  {
    id: 'recruiting', label: 'Recruiting', tagline: 'Staffing agency',
    persona: { name: 'Tom Becker', initials: 'TB', role: 'Director', company: 'Apex Talent' },
    date: 'Friday · May 30',
    streak: '177h streak',
    kpis: [
      { label: 'Placement pipeline · 7d', value: '$94,500', delta: '+ $22K vs prev 7d', tone: 'up', accent: true },
      { label: 'Candidates to review', value: '15', delta: '4 flagged strong', tone: 'flat' },
      { label: 'Interviews booked', value: '21', delta: '6 booked overnight', tone: 'up' },
      { label: 'Hours given back', value: '10.1', unit: 'hr', delta: '\u2248 1.3 work days · this week', tone: 'flat' },
    ],
    pipeline: [
      { stage: 'Applicants', value: 88 },
      { stage: 'Screened', value: 34 },
      { stage: 'Interview', value: 21 },
      { stage: 'Placed', value: 6 },
    ],
    log: [
      ['07:18', 'Done', 'Screened 26 overnight applicants against the open reqs.'],
      ['07:55', 'Done', 'Booked 6 first-round interviews across 3 clients.'],
      ['08:42', 'Done', 'Submitted 4 shortlisted candidates with summaries to hiring managers.'],
      ['09:20', 'Review', 'Drafted a submittal note for a senior role — needs your sign-off.'],
      ['09:46', 'Failed', 'Could not update the ATS — reconnect Bullhorn in Settings.'],
      ['10:12', 'Note', '3 passive candidates replied to outreach — all open to a call.'],
      ['11:04', 'Done', 'Updated 11 candidate stages and chased 2 pending offers.'],
    ],
    drafts: [
      { who: 'Hiring manager', co: 'Client · Sr. Engineer', channel: 'Email', subj: 'Re: Two strong candidates for the role', preview: 'Hi — I\u2019ve shortlisted two for the Sr. Engineer role. Both are available to interview this week. Summaries and salary expectations attached\u2026', flag: 'strong', when: '10m ago' },
      { who: 'Candidate', co: 'Passive · Designer', channel: 'SMS', subj: 'Re: Quick call about a role?', preview: 'Hi Dana — thanks for getting back to me. There\u2019s a design role I think fits you well. Do you have 15 minutes tomorrow morning?', flag: null, when: '33m ago' },
      { who: 'Client', co: 'Offer stage', channel: 'Email', subj: 'Re: Offer details for Priya', preview: 'Following up on Priya\u2019s offer — she\u2019s excited and ready to sign. Here are the final terms; I can have her start date confirmed today\u2026', flag: null, when: '1h ago' },
    ],
    events: [
      { t: '09:00', title: 'Desk standup · open reqs', who: 'Recurring', tone: 'flat' },
      { t: '11:00', title: 'Client intake · Sr. Engineer', who: 'Booked overnight', tone: 'accent' },
      { t: '13:30', title: 'Candidate prep · Priya offer', who: 'Booked overnight', tone: 'flat' },
      { t: '15:30', title: 'Pipeline review · placements', who: 'Recurring', tone: 'flat' },
    ],
    flows: [
      { name: 'Applicant screening', last: 'ran 7m ago', state: 'live' },
      { name: 'Interview scheduling', last: 'ran 1h ago', state: 'live' },
      { name: 'Passive outreach', last: 'ran 40m ago', state: 'live' },
      { name: 'Offer follow-up', last: 'next: 16:00', state: 'scheduled' },
    ],
    briefLede: 'Overnight, the Operator screened 26 applicants, booked 6 interviews, and submitted 4 shortlisted candidates to hiring managers.',
    chatOpener: 'Morning, Tom. Overnight applicants are screened against the open reqs and your strongest matches already have interviews booked.',
    chatConfirm: 'Sent. The hiring manager has both summaries and interview windows — I\u2019ll confirm slots the moment they reply and prep the candidates.',
  },

  /* ── 9 · Marketing agency ──────────────────────────────────── */
  {
    id: 'agency', label: 'Marketing agency', tagline: 'Creative studio',
    persona: { name: 'Nina Castellano', initials: 'NC', role: 'Founder', company: 'Northbeam Studio' },
    date: 'Friday · May 30',
    streak: '193h streak',
    kpis: [
      { label: 'Proposal pipeline · 7d', value: '$176K', delta: '+ $42K vs prev 7d', tone: 'up', accent: true },
      { label: 'Inbounds to review', value: '9', delta: '2 flagged hot', tone: 'flat' },
      { label: 'Discovery calls booked', value: '14', delta: '4 booked overnight', tone: 'up' },
      { label: 'Hours given back', value: '11.0', unit: 'hr', delta: '\u2248 1.4 work days · this week', tone: 'flat' },
    ],
    pipeline: [
      { stage: 'Inbound', value: 52 },
      { stage: 'Discovery', value: 23 },
      { stage: 'Proposal', value: 14 },
      { stage: 'Retainer', value: 5 },
    ],
    log: [
      ['07:22', 'Done', 'Replied to 12 inbound leads from the site and referrals.'],
      ['08:00', 'Done', 'Booked 4 discovery calls and sent each a short prep brief.'],
      ['08:46', 'Done', 'Sent 3 proposals to prospects who finished discovery this week.'],
      ['09:19', 'Review', 'Drafted a scope reply to a retainer prospect — needs your sign-off.'],
      ['09:45', 'Failed', 'Could not sync to HubSpot — reconnect in Settings.'],
      ['10:11', 'Note', '2 hot inbounds mentioned a deadline — flagged for priority.'],
      ['11:03', 'Done', 'Updated 7 deals and nudged 3 proposals awaiting a decision.'],
    ],
    drafts: [
      { who: 'DTC founder', co: 'Retainer · brand', channel: 'Email', subj: 'Re: Scope + timeline for the rebrand', preview: 'Hi — based on our call, here\u2019s a phased scope: brand sprint first, then site. I\u2019ve attached the proposal and two kickoff dates\u2026', flag: 'hot', when: '12m ago' },
      { who: 'Inbound lead', co: 'SaaS · paid', channel: 'Email', subj: 'Re: Can you run our paid social?', preview: 'Thanks for reaching out. We\u2019d start with an audit, then a 90-day test. Here\u2019s how we work and a time to talk through goals\u2026', flag: null, when: '37m ago' },
      { who: 'Past client', co: 'Re-engagement', channel: 'SMS', subj: 'Re: Picking the campaign back up', preview: 'Hi Marco — great to hear from you. I can pull the old assets and have a refreshed plan ready by Tuesday. Want to grab 20 minutes?', flag: null, when: '1h ago' },
    ],
    events: [
      { t: '09:30', title: 'Studio standup · projects', who: 'Recurring', tone: 'flat' },
      { t: '11:00', title: 'Rebrand discovery · DTC founder', who: 'Booked overnight', tone: 'accent' },
      { t: '13:30', title: 'Paid-social audit call', who: 'Booked overnight', tone: 'flat' },
      { t: '15:30', title: 'Proposal review block', who: 'Recurring', tone: 'flat' },
    ],
    flows: [
      { name: 'Inbound qualification', last: 'ran 6m ago', state: 'live' },
      { name: 'Discovery scheduling', last: 'ran 1h ago', state: 'live' },
      { name: 'Proposal follow-up', last: 'ran 50m ago', state: 'live' },
      { name: 'Weekly pipeline digest', last: 'next: 17:00', state: 'scheduled' },
    ],
    briefLede: 'Overnight, the Operator qualified 12 inbounds, booked 4 discovery calls, and sent 3 proposals worth $42K into the pipeline.',
    chatOpener: 'Morning, Nina. Every inbound has a reply, discovery calls are booked with prep briefs, and three proposals went out overnight.',
    chatConfirm: 'Sent. The founder has the phased scope and two kickoff dates — I\u2019ll nudge gently in 48h if they\u2019re quiet and keep the dates open.',
  },

  /* ── 10 · Auto dealership ──────────────────────────────────── */
  {
    id: 'auto', label: 'Auto dealership', tagline: 'Sales & service',
    persona: { name: 'Rick Alvarez', initials: 'RA', role: 'GM', company: 'Summit Auto Group' },
    date: 'Friday · May 30',
    streak: '149h streak',
    kpis: [
      { label: 'Deal pipeline · 7d', value: '$268K', delta: '+ $61K vs prev 7d', tone: 'up', accent: true },
      { label: 'Leads to review', value: '13', delta: '3 flagged ready-to-buy', tone: 'flat' },
      { label: 'Test drives booked', value: '24', delta: '7 booked overnight', tone: 'up' },
      { label: 'Hours given back', value: '9.0', unit: 'hr', delta: '\u2248 1.1 work days · this week', tone: 'flat' },
    ],
    pipeline: [
      { stage: 'Internet leads', value: 71 },
      { stage: 'Engaged', value: 38 },
      { stage: 'Test drive', value: 24 },
      { stage: 'Sold', value: 9 },
    ],
    log: [
      ['07:12', 'Done', 'Responded to 19 internet leads within minutes overnight.'],
      ['07:50', 'Done', 'Booked 7 test drives around the weekend showroom schedule.'],
      ['08:36', 'Done', 'Sent 5 trade-in estimates from photos customers submitted.'],
      ['09:14', 'Review', 'Drafted a financing reply for a ready-to-buy lead — needs your sign-off.'],
      ['09:41', 'Failed', 'Could not write to the DMS — reconnect in Settings.'],
      ['10:07', 'Note', '3 service customers asked about upgrading — flagged to sales.'],
      ['11:01', 'Done', 'Updated 10 leads in the CRM and re-engaged 4 that had gone quiet.'],
    ],
    drafts: [
      { who: 'Ready-to-buy lead', co: 'SUV · trade-in', channel: 'Email', subj: 'Re: Financing on the Highlander', preview: 'Hi — great news on the approval. With your trade-in the monthly lands right where you wanted. I\u2019ve held the vehicle and a Saturday delivery slot\u2026', flag: 'ready', when: '8m ago' },
      { who: 'Internet lead', co: 'Sedan · price', channel: 'SMS', subj: 'Re: Out-the-door price', preview: 'Hi — the out-the-door on the Camry SE is below, no surprises. I can have it detailed and ready for a test drive tonight if you\u2019d like\u2026', flag: null, when: '34m ago' },
      { who: 'Service customer', co: 'Upgrade interest', channel: 'Email', subj: 'Re: Trading up from your current lease', preview: 'Thanks for asking while you were in for service. Based on your lease, here are two upgrade options with numbers and no obligation\u2026', flag: null, when: '1h ago' },
    ],
    events: [
      { t: '08:30', title: 'Sales floor huddle', who: 'Recurring', tone: 'flat' },
      { t: '11:00', title: 'Highlander delivery prep', who: 'Booked overnight', tone: 'accent' },
      { t: '13:00', title: 'Weekend test-drive block', who: 'Booked overnight', tone: 'flat' },
      { t: '15:30', title: 'Trade-in appraisal call', who: 'Recurring', tone: 'flat' },
    ],
    flows: [
      { name: 'Internet-lead speed-to-reply', last: 'ran 4m ago', state: 'live' },
      { name: 'Test-drive scheduling', last: 'ran 1h ago', state: 'live' },
      { name: 'Trade-in estimate', last: 'ran 45m ago', state: 'live' },
      { name: 'Quiet-lead re-engage', last: 'next: 18:00', state: 'scheduled' },
    ],
    briefLede: 'Overnight, the Operator answered 19 internet leads in minutes, booked 7 test drives, and sent 5 trade-in estimates.',
    chatOpener: 'Morning, Rick. Every overnight internet lead got a reply in minutes — test drives are booked and trade-in numbers are out.',
    chatConfirm: 'Sent. The buyer has the financing terms and a Saturday delivery slot — I\u2019ve held the Highlander and flagged it for the floor.',
  },

  /* ── 11 · MCA / merchant cash advance ──────────────────────── */
  {
    id: 'mca', label: 'MCA', tagline: 'Merchant cash advance',
    persona: { name: 'David Roth', initials: 'DR', role: 'Principal', company: 'Bayview Advance' },
    date: 'Friday · May 30',
    streak: '171h streak',
    kpis: [
      { label: 'Funded pipeline · 7d', value: '$620K', delta: '+ $140K vs prev 7d', tone: 'up', accent: true },
      { label: 'Submissions to review', value: '12', delta: '3 flagged hot', tone: 'flat' },
      { label: 'Callbacks booked', value: '11', delta: '11 booked overnight', tone: 'up' },
      { label: 'Hours given back', value: '10.4', unit: 'hr', delta: '≈ 1.3 work days · this week', tone: 'flat' },
    ],
    pipeline: [
      { stage: 'New submissions', value: 96 },
      { stage: 'Sent out', value: 42 },
      { stage: 'Offer in', value: 18 },
      { stage: 'Funded', value: 7 },
    ],
    log: [
      ['07:08', 'Done', 'Worked the Daily Calling List — voicemail drops and texts to 240 aged leads; 34 merchants replied.'],
      ['07:46', 'Done', 'Booked 11 callbacks for the brokers and routed them by time zone.'],
      ['08:29', 'Done', 'Collected 4 months of bank statements from 6 merchants and moved them to In-Process in Close.'],
      ['09:15', 'Review', 'Drafted a renewal offer for a merchant 78% paid down — needs your sign-off.'],
      ['09:43', 'Failed', 'Could not sync new submissions into Close — reconnect the Make scenario in Settings.'],
      ['10:09', 'Note', '3 leads hit 3 no-contacts — flagged stale and alerted you.'],
      ['11:02', 'Done', 'Sent 5 signed contracts to funding and chased 3 pending stips.'],
    ],
    drafts: [
      { who: 'Riverside Diner', co: 'Renewal · 78% paid', channel: 'Dialer', subj: 'Re: Renewal — talk track ready', preview: 'Owner answers best after 2pm. Lead with the $40K they’re re-qualified for and the lower factor on renewal — we’re the lender, so we can fund direct. I’ve queued the call and the offer summary…', flag: 'hot', when: '7m ago' },
      { who: 'Vela Logistics', co: 'New · LeadsViper · $85K', channel: 'SMS', subj: 'Re: Sending your application', preview: 'Hi Dawn — thanks for the call. Here’s the one-page app and a secure link to connect 4 months of statements. Takes about 5 minutes…', flag: null, when: '33m ago' },
      { who: 'Summit HVAC', co: 'Sent out · stips', channel: 'Email', subj: 'Re: Last two items to fund', preview: 'You’re approved pending two stips — a voided check and last month’s statement. Reply with both and we can fund as soon as tomorrow…', flag: null, when: '1h ago' },
    ],
    events: [
      { t: '08:00', title: 'Floor huddle · daily calling list', who: 'Recurring', tone: 'flat' },
      { t: '11:00', title: 'Renewal call · Riverside Diner', who: 'Booked overnight', tone: 'accent' },
      { t: '13:30', title: 'New submission review with David', who: 'Booked overnight', tone: 'flat' },
      { t: '15:30', title: 'Underwriting + funding round', who: 'Recurring', tone: 'flat' },
    ],
    flows: [
      { name: 'Daily calling list reactivation', last: 'ran 9m ago', state: 'live' },
      { name: 'Voicemail + SMS drops', last: 'ran 30m ago', state: 'live' },
      { name: 'Statement collection', last: 'ran 1h ago', state: 'live' },
      { name: 'Stale-lead alert · 3 no-contacts', last: 'next: 17:00', state: 'scheduled' },
    ],
    briefLede: 'Before the floor opened, the Operator worked the daily calling list, booked 11 callbacks, and collected statements on 6 files worth $310K in requests.',
    chatOpener: 'Morning, David. I worked the aged-lead list in Close overnight — voicemails and texts are out, and 11 merchants want a callback today.',
    chatConfirm: 'Sent. Riverside has a callback after 2pm and I’ve queued the renewal offer — I’ll log the disposition in Close and prep the next file the second it funds.',
  },

  /* ── 12 · Apparel manufacturing ────────────────────────────── */
  {
    id: 'apparel', label: 'Apparel mfg', tagline: 'Clothing manufacturer',
    persona: { name: 'Mattes', initials: 'MA', role: 'Founder', company: 'Parni Inc' },
    date: 'Friday · May 30',
    streak: '198h streak',
    kpis: [
      { label: 'Order book · in production', value: '$340K', delta: '+ $72K vs prev 7d', tone: 'up', accent: true },
      { label: 'Shipments to track', value: '14', delta: '3 flagged at-risk', tone: 'flat' },
      { label: 'On-time delivery', value: '96%', delta: '+ 4 pts this week', tone: 'up' },
      { label: 'Hours given back', value: '11.6', unit: 'hr', delta: '≈ 1.5 work days · this week', tone: 'flat' },
    ],
    pipeline: [
      { stage: 'Open orders', value: 52 },
      { stage: 'In production', value: 34 },
      { stage: 'QC + pack', value: 19 },
      { stage: 'Shipped', value: 11 },
    ],
    log: [
      ['07:05', 'Done', 'Tracked 38 outbound shipments and flagged 3 at risk of missing the dock window.'],
      ['07:44', 'Done', 'Reordered 6 low-stock materials with suppliers before the cutoff.'],
      ['08:26', 'Done', 'Rerouted 2 delayed freight loads around the port backup.'],
      ['09:12', 'Review', 'Drafted a delay notice to a wholesale buyer — needs your sign-off.'],
      ['09:40', 'Failed', 'Could not sync the warehouse system — reconnect in Settings.'],
      ['10:08', 'Note', '2 fabric POs arrived short — flagged for a claim with the mill.'],
      ['11:00', 'Done', 'Updated 12 production orders and confirmed 4 delivery dates with carriers.'],
    ],
    drafts: [
      { who: 'Nordhaven Apparel', co: 'Wholesale · 1,200 units', channel: 'Email', subj: 'Re: Delivery date on PO #4471', preview: 'Hi — the knit run finished early. I can ship PO #4471 Thursday and have it on your dock Monday. Tracking and packing list attached…', flag: 'at-risk', when: '9m ago' },
      { who: 'Yildiz Textiles', co: 'Mill · fabric PO', channel: 'WhatsApp', subj: 'Re: Short shipment on the cotton', preview: 'Hi Emre — the cotton order came in 80kg short. Can you cover it on the next container? I’ve logged a claim and held the cut on style P-22…', flag: null, when: '36m ago' },
      { who: 'Coastal Freight', co: 'Carrier · LTL', channel: 'Email', subj: 'Re: Pickup window for Friday', preview: 'Confirming the Friday 2–4pm pickup for 6 pallets to the NJ DC. Bills of lading are attached and the dock is booked…', flag: null, when: '1h ago' },
    ],
    events: [
      { t: '08:00', title: 'Floor + cutting standup', who: 'Recurring', tone: 'flat' },
      { t: '11:00', title: 'Nordhaven delivery call', who: 'Booked overnight', tone: 'accent' },
      { t: '13:30', title: 'Carrier rate review', who: 'Recurring', tone: 'flat' },
      { t: '15:30', title: 'Mill claim follow-up · Yildiz', who: 'Booked overnight', tone: 'flat' },
    ],
    flows: [
      { name: 'Shipment tracking + ETA alerts', last: 'ran 7m ago', state: 'live' },
      { name: 'Low-stock material reorder', last: 'ran 1h ago', state: 'live' },
      { name: 'Freight rerouting', last: 'ran 40m ago', state: 'live' },
      { name: 'Delivery-date confirmations', last: 'next: 16:00', state: 'scheduled' },
    ],
    briefLede: 'Overnight, the Operator tracked 38 shipments, reordered 6 materials before cutoff, and rerouted 2 freight loads around the port backup.',
    chatOpener: 'Morning, Mattes. Logistics ran itself overnight — every shipment is tracked, low materials are reordered, and two delayed loads are already rerouted.',
    chatConfirm: 'Sent. Nordhaven has the Thursday ship date and tracking — I’ll watch the dock window and ping the carrier the moment the ETA slips.',
  },
];

/* Helper: map a status tag to a semantic tone (never teal — teal is brand). */
export const OP_TONE = (s: string): string => ({
  Done: 'success', Review: 'warning', Failed: 'danger', Note: 'info',
}[s] || 'info');

/* ── Human team per industry ───────────────────────────────────
   The small team the Operator's agents hand work off to. The owner
   is data.persona; these are the people who pick up escalations and
   sign-offs. Keep to 3 — graph nodes stay legible. */
export const OP_TEAMS: Record<string, TeamMember[]> = {
  hotels: [
    { name: 'Lena Ortiz', initials: 'LO', role: 'Front Desk Lead', picks: 'Guest sign-offs & holds' },
    { name: 'Marco Reyes', initials: 'MR', role: 'Group Sales', picks: 'Contracts over $10K' },
    { name: 'Tara Vance', initials: 'TV', role: 'Events Coordinator', picks: 'Weddings & offsites' },
  ],
  realestate: [
    { name: 'Sam Devine', initials: 'SD', role: 'Buyer Agent', picks: 'Offers & showings' },
    { name: 'Ivy Chen', initials: 'IC', role: 'Listing Coordinator', picks: 'CMAs & pricing' },
    { name: 'Ben Royce', initials: 'BR', role: 'Transaction Coord.', picks: 'Contracts to close' },
  ],
  healthcare: [
    { name: 'Nadia Park', initials: 'NP', role: 'Front Desk', picks: 'New-patient sign-offs' },
    { name: 'Omar Diaz', initials: 'OD', role: 'Treatment Coord.', picks: 'Plan presentations' },
    { name: 'Grace Liu', initials: 'GL', role: 'Billing', picks: 'Coverage questions' },
  ],
  law: [
    { name: 'Rosa Mendez', initials: 'RM', role: 'Paralegal', picks: 'Filings & deadlines' },
    { name: 'Cole Barnes', initials: 'CB', role: 'Intake Specialist', picks: 'Conflict checks' },
    { name: 'Dana Webb', initials: 'DW', role: 'Office Manager', picks: 'Engagement letters' },
  ],
  finance: [
    { name: 'Priya Shah', initials: 'PS', role: 'Client Associate', picks: 'Review packets' },
    { name: 'Leo Marsh', initials: 'LM', role: 'Paraplanner', picks: 'Proposals & rebalances' },
    { name: 'Faye Wong', initials: 'FW', role: 'Operations', picks: 'Onboarding paperwork' },
  ],
  construction: [
    { name: 'Diego Cruz', initials: 'DC', role: 'Project Manager', picks: 'Quotes over $25K' },
    { name: 'Hana Ito', initials: 'HI', role: 'Estimator', picks: 'Bids & scopes' },
    { name: 'Wes Kelly', initials: 'WK', role: 'Field Lead', picks: 'Site-visit routing' },
  ],
  ecommerce: [
    { name: 'Mia Fox', initials: 'MF', role: 'Support Lead', picks: 'VIP & escalations' },
    { name: 'Raj Patel', initials: 'RP', role: 'Fulfillment', picks: 'Returns & 3PL issues' },
    { name: 'Cara Voss', initials: 'CV', role: 'Wholesale', picks: 'B2B & line sheets' },
  ],
  recruiting: [
    { name: 'Jade Ross', initials: 'JR', role: 'Recruiter', picks: 'Shortlist submittals' },
    { name: 'Kofi Mensah', initials: 'KM', role: 'Sourcer', picks: 'Passive outreach' },
    { name: 'Lena Hart', initials: 'LH', role: 'Account Manager', picks: 'Offers & client calls' },
  ],
  agency: [
    { name: 'Theo Vance', initials: 'TV', role: 'Account Manager', picks: 'Scopes & retainers' },
    { name: 'Sloane Kim', initials: 'SK', role: 'Strategist', picks: 'Discovery & briefs' },
    { name: 'Remy Ortega', initials: 'RO', role: 'Producer', picks: 'Proposals & timelines' },
  ],
  auto: [
    { name: 'Vic Russo', initials: 'VR', role: 'Sales Floor', picks: 'Ready-to-buy leads' },
    { name: 'Joy Adler', initials: 'JA', role: 'Finance Manager', picks: 'Financing & terms' },
    { name: 'Ned Cole', initials: 'NC', role: 'Service Advisor', picks: 'Upgrade interest' },
  ],
  mca: [
    { name: 'Joel Braver', initials: 'JB', role: 'Partner', picks: 'Renewals & big files' },
    { name: 'Andre Webb', initials: 'AW', role: 'Underwriting', picks: 'Stips & approvals' },
    { name: 'Marco Diaz', initials: 'MD', role: 'Senior Broker', picks: 'Callbacks & dials' },
  ],
  apparel: [
    { name: 'Elif Demir', initials: 'ED', role: 'Production Lead', picks: 'Order schedules & WIP' },
    { name: 'Sam Okoro', initials: 'SO', role: 'Logistics Coord.', picks: 'Freight & shipments' },
    { name: 'Lia Romano', initials: 'LR', role: 'Sourcing', picks: 'Material POs & claims' },
  ],
};

/* Channels the agents actually work, derived per industry from drafts. */
export const OP_CHANNELS = (data: Industry): string[] => {
  const order = ['Dialer', 'Email', 'WhatsApp', 'SMS'];
  const seen = [...new Set((data.drafts || []).map((d: Draft) => d.channel))];
  return order.filter((c: string) => seen.includes(c)).concat(seen.filter((c: string) => !order.includes(c)));
};
