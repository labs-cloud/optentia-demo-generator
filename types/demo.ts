export type ActivityStatus = "Completed" | "Waiting" | "Escalated";

export type Channel =
  | "WhatsApp"
  | "Telegram"
  | "Email"
  | "Slack"
  | "SMS"
  | "Asana"
  | "Calendar"
  | "CRM"
  | "Phone"
  | "Missed Calls";

export interface KPI {
  label: string;
  value: string;
  detail: string;
}

export interface ActivityEvent {
  time: string;
  channel: Channel;
  status: ActivityStatus;
  summary: string;
}

export interface Lead {
  name: string;
  type: string;
  interest: string;
  source: Channel;
  urgency: number;
  next: string;
}

export interface PipelineColumn {
  title: string;
  leads: Lead[];
}

export interface Message {
  speaker: string;
  message: string;
}

export interface InboxThread {
  channel: string;
  messages: Message[];
}

export interface Task {
  title: string;
  due: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  assignedTo: string;
  createdBy: string;
}

export interface Appointment {
  time: string;
  title: string;
  status: "Confirmed" | "Reminder Sent" | "Needs Review" | "Tentative";
}

export interface Escalation {
  title: string;
  why: string;
  next: string;
  draft: string;
}

export interface DemoScenario {
  title: string;
  eyebrow: string;
  steps: string[];
  buttonLabel: string;
  completedLabel: string;
  events: ActivityEvent[];
}

export interface NavigationLabels {
  operator: string;
  leads: string;
  inbox: string;
  tasks: string;
  calendar: string;
  pipeline: string;
  documents?: string;
  escalations: string;
  reports: string;
}

export interface ClientTerms {
  recordSingular: string;
  recordPlural: string;
  pipelineSingular: string;
  pipelinePlural: string;
  appointmentPlural: string;
  taskPlural: string;
  escalationPlural: string;
  monitoredBusiness: string;
}

export interface Client {
  slug: string;
  clientName?: string;
  companyName?: string;
  company: string;
  industry: string;
  demoLabel: string;
  operatorSubtitle?: string;
  navigationLabels?: NavigationLabels;
  terms?: ClientTerms;
  operatorPrincipleTitle: string;
  operatorPrincipleBody: string;
  operatorPrincipleMetric: string;
  operatorPrincipleMetricDetail: string;
  todaySummaryValue: string;
  todaySummaryBody: string;
  kpis: KPI[];
  activityFeed: ActivityEvent[];
  pipeline: PipelineColumn[];
  inbox: InboxThread[];
  tasks: Task[];
  appointments: Appointment[];
  escalations: Escalation[];
  capabilities: string[];
  demoScenario: DemoScenario;
}
