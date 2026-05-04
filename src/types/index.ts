export type Role = 'admin' | 'manager' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  organizationId: string;
  permissions: string[];
  status: 'active' | 'inactive';
  lastActive: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string;
  plan: 'starter' | 'professional' | 'enterprise';
  memberCount: number;
  createdAt: string;
}

export type LeadStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'converted' | 'lost';
export type LeadSource = 'website' | 'api' | 'upload' | 'call' | 'whatsapp' | 'email' | 'campaign' | 'referral';
export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  stage: LeadStage;
  source: LeadSource;
  priority: LeadPriority;
  score: number;
  assignedTo: string;
  organizationId: string;
  tags: string[];
  customFields: Record<string, string>;
  value: number;
  activityCount: number;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  status?: string;
  call_duration?: string;
  transcript?: string;
  call_summary?: string;
  call_transcript?: string;
  call_status?: string;
  called_at?: string;
}



export interface LeadActivity {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'whatsapp' | 'note' | 'stage_change' | 'assignment' | 'task';
  content: string;
  timestamp: string;
  userId: string;
  metadata?: Record<string, any>;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'whatsapp' | 'drip';
  status: 'draft' | 'active' | 'paused' | 'completed';
  audience: number;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  steps: CampaignStep[];
}

export interface CampaignStep {
  id: string;
  type: 'email' | 'whatsapp' | 'wait' | 'condition';
  delay: number;
  delayUnit: 'minutes' | 'hours' | 'days';
  content: string;
  subject?: string;
}

export interface Workflow {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'draft';
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  organizationId: string;
  createdAt: string;
  executionCount: number;
}

export interface WorkflowTrigger {
  type: 'new_lead' | 'stage_change' | 'inactivity' | 'field_change' | 'score_change';
  conditions: WorkflowCondition[];
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string;
}

export interface WorkflowAction {
  id: string;
  type: 'assign_lead' | 'send_email' | 'send_whatsapp' | 'create_task' | 'update_field' | 'add_tag' | 'notify';
  config: Record<string, any>;
  delay?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  leadId?: string;
  dueDate: string;
  organizationId: string;
  createdAt: string;
  completedAt?: string;
}

export interface CallLog {
  id: string;
  leadId: string;
  userId: string;
  duration: number;
  status: 'completed' | 'missed' | 'voicemail';
  recordingUrl?: string;
  transcription?: string;
  aiSummary?: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: string;
}

export interface DashboardMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'flat';
  icon: string;
}

export interface AIInsight {
  id: string;
  type: 'high_intent' | 'at_risk' | 'opportunity' | 'suggestion' | 'alert';
  title: string;
  description: string;
  leadId?: string;
  confidence: number;
  timestamp: string;
}

export interface KnowledgeBaseDoc {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'docx' | 'txt';
  size: number;
  uploadedBy: string;
  organizationId: string;
  status: 'processing' | 'ready' | 'error';
  createdAt: string;
  chunks: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  userId: string;
}
