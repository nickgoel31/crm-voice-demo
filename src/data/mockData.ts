import { User, Organization, Lead, Campaign, Workflow, Task, CallLog, AIInsight, KnowledgeBaseDoc, LeadActivity, Notification } from '../types';

export const organizations: Organization[] = [
  { id: 'org-1', name: 'I.T.S Engineering College', slug: 'its', logo: '🎓', plan: 'enterprise', memberCount: 24, createdAt: '2024-01-15' },
  { id: 'org-2', name: 'ITS Admissions', slug: 'admissions', logo: '🏛️', plan: 'professional', memberCount: 8, createdAt: '2024-03-20' },
];

export const users: User[] = [
  { id: 'user-1', name: 'Arjun Mehta', email: 'arjun@acme.com', avatar: 'AM', role: 'admin', organizationId: 'org-1', permissions: ['all'], status: 'active', lastActive: '2025-01-10T10:30:00Z' },
  { id: 'user-2', name: 'Priya Sharma', email: 'priya@acme.com', avatar: 'PS', role: 'manager', organizationId: 'org-1', permissions: ['leads.read', 'leads.write', 'campaigns.manage', 'reports.view'], status: 'active', lastActive: '2025-01-10T09:45:00Z' },
  { id: 'user-3', name: 'Rahul Verma', email: 'rahul@acme.com', avatar: 'RV', role: 'agent', organizationId: 'org-1', permissions: ['leads.read', 'leads.write'], status: 'active', lastActive: '2025-01-10T11:00:00Z' },
  { id: 'user-4', name: 'Sneha Patel', email: 'sneha@acme.com', avatar: 'SP', role: 'agent', organizationId: 'org-1', permissions: ['leads.read', 'leads.write'], status: 'active', lastActive: '2025-01-09T18:30:00Z' },
  { id: 'user-5', name: 'Vikram Singh', email: 'vikram@acme.com', avatar: 'VS', role: 'agent', organizationId: 'org-1', permissions: ['leads.read'], status: 'inactive', lastActive: '2025-01-05T14:00:00Z' },
];

const names = ['Aarav Gupta', 'Diya Reddy', 'Kabir Joshi', 'Meera Nair', 'Rohan Das', 'Ananya Iyer', 'Dev Kapoor', 'Isha Malhotra', 'Nikhil Rao', 'Pooja Saxena', 'Siddharth Bose', 'Tanvi Agarwal', 'Yash Chauhan', 'Kavya Pillai', 'Aditya Thakur', 'Riya Deshmukh', 'Harsh Mishra', 'Nisha Kulkarni', 'Karan Bhatt', 'Simran Kaur'];
const companies = ['NexGen Solutions', 'CloudVista', 'DataPrime', 'InnoTech Labs', 'ScaleUp Co', 'Digital Forge', 'ByteCraft', 'Quantum Edge', 'Pinnacle Systems', 'Velocity AI', 'Fusion Works', 'Zenith Corp', 'Spark Digital', 'Matrix Labs', 'Apex Dynamics'];
const sources: Lead['source'][] = ['website', 'api', 'upload', 'call', 'whatsapp', 'email', 'campaign', 'referral'];
const stages: Lead['stage'][] = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'converted', 'lost'];
const priorities: Lead['priority'][] = ['low', 'medium', 'high', 'urgent'];
const tags = ['enterprise', 'smb', 'startup', 'hot-lead', 'follow-up', 'demo-scheduled', 'pricing-sent', 'renewal', 'upsell', 'trial'];

export const leads: Lead[] = Array.from({ length: 50 }, (_, i) => {
  const name = names[i % names.length];
  const company = companies[i % companies.length];
  const stage = stages[i % stages.length];
  const daysAgo = Math.floor(Math.random() * 60);
  const created = new Date(Date.now() - daysAgo * 86400000).toISOString();
  return {
    id: `lead-${i + 1}`,
    name,
    email: `${name.toLowerCase().replace(/\s/g, '.')}@${company.toLowerCase().replace(/\s/g, '')}.com`,
    phone: `+91 ${Math.floor(7000000000 + Math.random() * 3000000000)}`,
    company,
    title: ['CEO', 'CTO', 'VP Sales', 'Marketing Head', 'Director', 'Manager', 'Founder'][i % 7],
    stage,
    source: sources[i % sources.length],
    priority: priorities[i % priorities.length],
    score: Math.floor(Math.random() * 100),
    assignedTo: users[i % 4].id,
    organizationId: 'org-1',
    tags: [tags[i % tags.length], tags[(i + 3) % tags.length]],
    customFields: { industry: ['SaaS', 'Fintech', 'Healthcare', 'EdTech', 'E-commerce'][i % 5], budget: ['< ₹1L', '₹1-5L', '₹5-20L', '₹20L+'][i % 4] },
    value: Math.floor(Math.random() * 500000) + 10000,
    activityCount: Math.floor(Math.random() * 15) + 1,
    lastActivity: new Date(Date.now() - Math.floor(Math.random() * 7) * 86400000).toISOString(),
    createdAt: created,
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 3) * 86400000).toISOString(),
    notes: `Interested in our ${['enterprise', 'professional', 'starter'][i % 3]} plan. ${['Needs demo', 'Requested pricing', 'Waiting for approval', 'Comparing with competitors', 'Ready to close'][i % 5]}.`,
  };
});

export const leadActivities: LeadActivity[] = leads.slice(0, 10).flatMap(lead =>
  Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, i) => ({
    id: `act-${lead.id}-${i}`,
    leadId: lead.id,
    type: (['call', 'email', 'whatsapp', 'note', 'stage_change', 'task'] as const)[i % 6],
    content: [
      'Discussed pricing and features. Client interested in enterprise plan.',
      'Sent follow-up email with product brochure and case studies.',
      'WhatsApp message sent: Hi, following up on our conversation...',
      'Lead showed interest in the analytics module. Schedule demo next week.',
      'Stage changed from New to Contacted',
      'Task created: Prepare custom proposal by Friday',
    ][i % 6],
    timestamp: new Date(Date.now() - (i * 86400000 + Math.random() * 43200000)).toISOString(),
    userId: users[i % 4].id,
  }))
);

export const campaigns: Campaign[] = [
  {
    id: 'camp-1', name: 'Q1 Product Launch', type: 'email', status: 'active', audience: 2450, sent: 1820, opened: 945, clicked: 312, converted: 48,
    organizationId: 'org-1', createdBy: 'user-1', createdAt: '2025-01-01', updatedAt: '2025-01-10',
    steps: [
      { id: 'cs-1', type: 'email', delay: 0, delayUnit: 'days', content: 'Announcing our new product launch...', subject: '🚀 Big News: Our New Product is Here!' },
      { id: 'cs-2', type: 'wait', delay: 3, delayUnit: 'days', content: '' },
      { id: 'cs-3', type: 'email', delay: 0, delayUnit: 'days', content: 'Following up on our announcement...', subject: 'Don\'t Miss Out: Limited Launch Offer' },
    ],
  },
  {
    id: 'camp-2', name: 'Re-engagement Drip', type: 'drip', status: 'active', audience: 890, sent: 670, opened: 420, clicked: 156, converted: 23,
    organizationId: 'org-1', createdBy: 'user-2', createdAt: '2024-12-15', updatedAt: '2025-01-09',
    steps: [
      { id: 'cs-4', type: 'email', delay: 0, delayUnit: 'days', content: 'We miss you! Here\'s what you\'ve been missing...', subject: 'We Miss You! Come Back for 20% Off' },
      { id: 'cs-5', type: 'wait', delay: 5, delayUnit: 'days', content: '' },
      { id: 'cs-6', type: 'whatsapp', delay: 0, delayUnit: 'days', content: 'Hey! Just checking in...' },
    ],
  },
  {
    id: 'camp-3', name: 'Webinar Invite Blast', type: 'whatsapp', status: 'completed', audience: 1200, sent: 1200, opened: 780, clicked: 445, converted: 89,
    organizationId: 'org-1', createdBy: 'user-1', createdAt: '2024-12-01', updatedAt: '2024-12-20',
    steps: [{ id: 'cs-7', type: 'whatsapp', delay: 0, delayUnit: 'days', content: 'Join our exclusive webinar on...' }],
  },
  {
    id: 'camp-4', name: 'Enterprise Outreach', type: 'email', status: 'draft', audience: 350, sent: 0, opened: 0, clicked: 0, converted: 0,
    organizationId: 'org-1', createdBy: 'user-2', createdAt: '2025-01-08', updatedAt: '2025-01-10',
    steps: [{ id: 'cs-8', type: 'email', delay: 0, delayUnit: 'days', content: 'Tailored solutions for enterprise...', subject: 'Enterprise Solutions for {{company}}' }],
  },
];

export const workflows: Workflow[] = [
  {
    id: 'wf-1', name: 'New Lead Auto-Assign', status: 'active',
    trigger: { type: 'new_lead', conditions: [{ field: 'source', operator: 'equals', value: 'website' }] },
    actions: [
      { id: 'wa-1', type: 'assign_lead', config: { strategy: 'round_robin' } },
      { id: 'wa-2', type: 'send_email', config: { template: 'welcome', delay: 0 } },
      { id: 'wa-3', type: 'add_tag', config: { tag: 'website-lead' } },
    ],
    organizationId: 'org-1', createdAt: '2024-11-01', executionCount: 342,
  },
  {
    id: 'wf-2', name: 'Inactive Lead Alert', status: 'active',
    trigger: { type: 'inactivity', conditions: [{ field: 'days_inactive', operator: 'greater_than', value: '7' }] },
    actions: [
      { id: 'wa-4', type: 'notify', config: { channel: 'slack', message: 'Lead inactive for 7+ days' } },
      { id: 'wa-5', type: 'send_whatsapp', config: { template: 'reengagement' } },
    ],
    organizationId: 'org-1', createdAt: '2024-11-15', executionCount: 128,
  },
  {
    id: 'wf-3', name: 'High Score → Hot Lead', status: 'active',
    trigger: { type: 'score_change', conditions: [{ field: 'score', operator: 'greater_than', value: '80' }] },
    actions: [
      { id: 'wa-6', type: 'update_field', config: { field: 'priority', value: 'urgent' } },
      { id: 'wa-7', type: 'notify', config: { channel: 'email', recipients: ['manager'] } },
      { id: 'wa-8', type: 'create_task', config: { title: 'Follow up with hot lead', dueIn: '1 day' } },
    ],
    organizationId: 'org-1', createdAt: '2024-12-01', executionCount: 56,
  },
  {
    id: 'wf-4', name: 'Stage Change Notification', status: 'inactive',
    trigger: { type: 'stage_change', conditions: [{ field: 'stage', operator: 'equals', value: 'qualified' }] },
    actions: [
      { id: 'wa-9', type: 'send_email', config: { template: 'qualified_congrats' } },
      { id: 'wa-10', type: 'create_task', config: { title: 'Schedule demo', dueIn: '2 days' } },
    ],
    organizationId: 'org-1', createdAt: '2024-12-10', executionCount: 89,
  },
];

export const tasks: Task[] = [
  { id: 'task-1', title: 'Follow up with NexGen Solutions', description: 'Send revised pricing proposal', status: 'in_progress', priority: 'high', assignedTo: 'user-3', leadId: 'lead-1', dueDate: '2025-01-12', organizationId: 'org-1', createdAt: '2025-01-08' },
  { id: 'task-2', title: 'Prepare demo for CloudVista', description: 'Custom demo focusing on analytics module', status: 'todo', priority: 'high', assignedTo: 'user-4', leadId: 'lead-2', dueDate: '2025-01-14', organizationId: 'org-1', createdAt: '2025-01-09' },
  { id: 'task-3', title: 'Update lead scores', description: 'Review and update AI lead scores for Q1 batch', status: 'todo', priority: 'medium', assignedTo: 'user-2', dueDate: '2025-01-15', organizationId: 'org-1', createdAt: '2025-01-07' },
  { id: 'task-4', title: 'Call DataPrime decision maker', description: 'Final negotiation call', status: 'overdue', priority: 'urgent', assignedTo: 'user-3', leadId: 'lead-4', dueDate: '2025-01-08', organizationId: 'org-1', createdAt: '2025-01-05' },
  { id: 'task-5', title: 'Send campaign report', description: 'Weekly campaign performance report to stakeholders', status: 'completed', priority: 'medium', assignedTo: 'user-2', dueDate: '2025-01-10', organizationId: 'org-1', createdAt: '2025-01-06', completedAt: '2025-01-10' },
  { id: 'task-6', title: 'Onboard new agent', description: 'Set up accounts and training for new team member', status: 'todo', priority: 'low', assignedTo: 'user-1', dueDate: '2025-01-20', organizationId: 'org-1', createdAt: '2025-01-09' },
  { id: 'task-7', title: 'Review WhatsApp templates', description: 'Approve new WhatsApp message templates for campaigns', status: 'in_progress', priority: 'medium', assignedTo: 'user-2', dueDate: '2025-01-13', organizationId: 'org-1', createdAt: '2025-01-08' },
  { id: 'task-8', title: 'Database cleanup', description: 'Remove duplicate leads and update missing fields', status: 'todo', priority: 'low', assignedTo: 'user-4', dueDate: '2025-01-18', organizationId: 'org-1', createdAt: '2025-01-09' },
];

export const callLogs: CallLog[] = [
  { id: 'call-1', leadId: 'lead-1', userId: 'user-3', duration: 485, status: 'completed', transcription: 'Discussion about enterprise pricing. Client wants volume discount for 500+ seats. Agreed to send revised proposal by Friday.', aiSummary: 'Positive call. Client interested in enterprise plan for 500+ seats. Action: Send revised proposal with volume discount by Friday.', sentiment: 'positive', timestamp: '2025-01-10T10:30:00Z' },
  { id: 'call-2', leadId: 'lead-2', userId: 'user-4', duration: 234, status: 'completed', transcription: 'Quick check-in call. Client evaluating competitors. Needs more info on integrations.', aiSummary: 'Neutral call. Client comparing with competitors. Needs integration documentation. Action: Send integration guide.', sentiment: 'neutral', timestamp: '2025-01-10T09:15:00Z' },
  { id: 'call-3', leadId: 'lead-5', userId: 'user-3', duration: 67, status: 'missed', sentiment: 'neutral', timestamp: '2025-01-09T16:45:00Z' },
  { id: 'call-4', leadId: 'lead-3', userId: 'user-2', duration: 720, status: 'completed', transcription: 'Detailed product walkthrough. Client very interested in analytics and automation features. Wants to schedule a technical deep-dive.', aiSummary: 'Very positive call. Client excited about analytics & automation. Action: Schedule technical deep-dive next week.', sentiment: 'positive', timestamp: '2025-01-09T14:00:00Z' },
  { id: 'call-5', leadId: 'lead-8', userId: 'user-4', duration: 180, status: 'completed', transcription: 'Client unhappy with response time. Escalated concern about support quality.', aiSummary: 'Negative call. Client concerned about support response times. Action: Escalate to support team lead.', sentiment: 'negative', timestamp: '2025-01-09T11:30:00Z' },
  { id: 'call-6', leadId: 'lead-4', userId: 'user-3', duration: 395, status: 'completed', aiSummary: 'Discussed contract terms. Client wants annual billing with quarterly review clause.', sentiment: 'positive', timestamp: '2025-01-08T15:00:00Z' },
];

export const aiInsights: AIInsight[] = [
  { id: 'ai-1', type: 'high_intent', title: 'High Intent Lead Detected', description: 'Aarav Gupta from NexGen Solutions has shown strong buying signals: opened 5 emails, visited pricing page 3 times, and requested a demo.', leadId: 'lead-1', confidence: 92, timestamp: '2025-01-10T11:00:00Z' },
  { id: 'ai-2', type: 'at_risk', title: 'At-Risk Lead Alert', description: 'Rohan Das from DataPrime has been inactive for 12 days. Last engagement was a missed call. Recommend immediate re-engagement.', leadId: 'lead-5', confidence: 87, timestamp: '2025-01-10T10:30:00Z' },
  { id: 'ai-3', type: 'opportunity', title: 'Upsell Opportunity', description: 'CloudVista usage has increased 40% this month. They may be ready to upgrade to Enterprise plan.', leadId: 'lead-2', confidence: 78, timestamp: '2025-01-10T09:00:00Z' },
  { id: 'ai-4', type: 'suggestion', title: 'Optimal Follow-up Time', description: 'Based on engagement patterns, leads from the webinar campaign are most responsive between 2-4 PM IST on weekdays.', confidence: 85, timestamp: '2025-01-10T08:00:00Z' },
  { id: 'ai-5', type: 'alert', title: 'Conversion Rate Drop', description: 'Lead-to-customer conversion rate dropped 8% this week compared to last week. Primary bottleneck: proposal stage (avg. 6.2 days).', confidence: 91, timestamp: '2025-01-10T07:00:00Z' },
  { id: 'ai-6', type: 'high_intent', title: 'Enterprise Prospect Engaged', description: 'Siddharth Bose from Quantum Edge downloaded 3 whitepapers and spent 15 minutes on the enterprise features page.', leadId: 'lead-11', confidence: 88, timestamp: '2025-01-09T16:00:00Z' },
];

export const knowledgeBaseDocs: KnowledgeBaseDoc[] = [
  { id: 'kb-1', name: 'Product Features Guide 2025.pdf', type: 'pdf', size: 2450000, uploadedBy: 'user-1', organizationId: 'org-1', status: 'ready', createdAt: '2025-01-05', chunks: 45 },
  { id: 'kb-2', name: 'Sales Playbook.docx', type: 'docx', size: 1800000, uploadedBy: 'user-2', organizationId: 'org-1', status: 'ready', createdAt: '2025-01-03', chunks: 32 },
  { id: 'kb-3', name: 'Competitor Analysis Q1.pdf', type: 'pdf', size: 3200000, uploadedBy: 'user-1', organizationId: 'org-1', status: 'ready', createdAt: '2025-01-02', chunks: 58 },
  { id: 'kb-4', name: 'API Integration Docs.pdf', type: 'pdf', size: 1500000, uploadedBy: 'user-3', organizationId: 'org-1', status: 'processing', createdAt: '2025-01-09', chunks: 0 },
  { id: 'kb-5', name: 'Customer Case Studies.pdf', type: 'pdf', size: 4100000, uploadedBy: 'user-2', organizationId: 'org-1', status: 'ready', createdAt: '2024-12-28', chunks: 72 },
];

export const notifications: Notification[] = [
  { id: 'notif-1', title: 'New Lead Assigned', message: 'Aarav Gupta from NexGen Solutions has been assigned to you.', type: 'info', read: false, timestamp: '2025-01-10T11:00:00Z', userId: 'user-3' },
  { id: 'notif-2', title: 'Task Overdue', message: 'Call DataPrime decision maker was due on Jan 8.', type: 'warning', read: false, timestamp: '2025-01-10T09:00:00Z', userId: 'user-3' },
  { id: 'notif-3', title: 'Campaign Milestone', message: 'Q1 Product Launch reached 50% open rate!', type: 'success', read: false, timestamp: '2025-01-10T08:30:00Z', userId: 'user-1' },
  { id: 'notif-4', title: 'AI Insight', message: 'High intent lead detected: Aarav Gupta showing strong buying signals.', type: 'info', read: true, timestamp: '2025-01-10T07:00:00Z', userId: 'user-1' },
  { id: 'notif-5', title: 'Workflow Executed', message: 'New Lead Auto-Assign processed 5 leads in the last hour.', type: 'info', read: true, timestamp: '2025-01-09T18:00:00Z', userId: 'user-1' },
];

export const chartData = {
  leadsByMonth: [
    { month: 'Jul', leads: 120, converted: 28 },
    { month: 'Aug', leads: 145, converted: 35 },
    { month: 'Sep', leads: 180, converted: 42 },
    { month: 'Oct', leads: 165, converted: 38 },
    { month: 'Nov', leads: 210, converted: 52 },
    { month: 'Dec', leads: 245, converted: 61 },
    { month: 'Jan', leads: 198, converted: 48 },
  ],
  leadsBySource: [
    { source: 'Website', count: 340, color: '#6366f1' },
    { source: 'Campaigns', count: 220, color: '#8b5cf6' },
    { source: 'Referrals', count: 180, color: '#a78bfa' },
    { source: 'API', count: 120, color: '#c4b5fd' },
    { source: 'Upload', count: 90, color: '#ddd6fe' },
    { source: 'Calls', count: 65, color: '#ede9fe' },
  ],
  agentPerformance: [
    { name: 'Rahul V.', leads: 45, conversions: 12, calls: 89, revenue: 450000 },
    { name: 'Sneha P.', leads: 38, conversions: 10, calls: 72, revenue: 380000 },
    { name: 'Vikram S.', leads: 28, conversions: 6, calls: 45, revenue: 220000 },
    { name: 'Priya S.', leads: 52, conversions: 15, calls: 95, revenue: 580000 },
  ],
  pipelineFunnel: [
    { stage: 'New', count: 145, value: 2800000 },
    { stage: 'Contacted', count: 98, value: 2100000 },
    { stage: 'Qualified', count: 62, value: 1650000 },
    { stage: 'Proposal', count: 35, value: 1200000 },
    { stage: 'Negotiation', count: 18, value: 780000 },
    { stage: 'Won', count: 12, value: 520000 },
  ],
  weeklyActivity: [
    { day: 'Mon', calls: 24, emails: 85, whatsapp: 42 },
    { day: 'Tue', calls: 31, emails: 92, whatsapp: 38 },
    { day: 'Wed', calls: 28, emails: 78, whatsapp: 55 },
    { day: 'Thu', calls: 35, emails: 95, whatsapp: 48 },
    { day: 'Fri', calls: 22, emails: 88, whatsapp: 35 },
    { day: 'Sat', calls: 8, emails: 15, whatsapp: 12 },
    { day: 'Sun', calls: 3, emails: 8, whatsapp: 5 },
  ],
};
