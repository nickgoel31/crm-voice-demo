import { useState, useMemo, useEffect } from 'react';
import { useCRMStore } from '../store/crmStore';
import { Lead, LeadStage } from '../types';
import { users } from '../data/mockData';
import { Search, Plus, Download, Upload, Grid3X3, List, Star, Phone, Mail, MessageCircle, X, Tag, FileText, Brain } from 'lucide-react';


const stageConfig: Record<LeadStage, { label: string; color: string; bg: string }> = {
  new: { label: 'New', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500' },
  contacted: { label: 'Contacted', color: 'text-rose-600 dark:text-indigo-400', bg: 'bg-indigo-500' },
  qualified: { label: 'Qualified', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500' },
  proposal: { label: 'Proposal', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500' },
  negotiation: { label: 'Negotiation', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500' },
  converted: { label: 'Converted', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500' },
  lost: { label: 'Lost', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500' },
};

const stages: LeadStage[] = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'converted', 'lost'];

export default function Leads() {
  const { leads, updateLeadStage, deleteLead, updateLead, fetchLeads, initiateCall } = useCRMStore();

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [fetchLeads]);

  const handleCall = async (lead: Lead) => {
    try {
      await initiateCall(lead.id, lead.phone, lead.name);
      window.alert(`Calling ${lead.name}...`);
    } catch (error) {
      window.alert('Failed to initiate call. Check console for details.');
    }
  };


  const [view, setView] = useState<'kanban' | 'table'>('table');
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [sortField, setSortField] = useState<'name' | 'score' | 'value' | 'createdAt'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    let result = [...leads];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l => 
        (l.name?.toLowerCase() || '').includes(q) || 
        (l.company?.toLowerCase() || '').includes(q) || 
        (l.email?.toLowerCase() || '').includes(q)
      );
    }
    if (stageFilter !== 'all') result = result.filter(l => l.stage === stageFilter);
    if (sourceFilter !== 'all') result = result.filter(l => l.source === sourceFilter);
    result.sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      if (sortField === 'name') return (a.name || '').localeCompare(b.name || '') * mul;
      if (sortField === 'score') return ((a.score || 0) - (b.score || 0)) * mul;
      if (sortField === 'value') return ((a.value || 0) - (b.value || 0)) * mul;
      
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return (aTime - bTime) * mul;
    });
    return result;
  }, [leads, search, stageFilter, sourceFilter, sortField, sortDir]);

  const getAgentName = (id: string) => users.find(u => u.id === id)?.name || 'Unassigned';

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{filtered.length} leads found</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Upload className="w-4 h-4" /> Import
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors font-medium">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select value={stageFilter} onChange={e => setStageFilter(e.target.value)} className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">All Stages</option>
          {stages.map(s => <option key={s} value={s}>{stageConfig[s].label}</option>)}
        </select>
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)} className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">All Sources</option>
          <option value="website">Website</option>
          <option value="campaign">Campaign</option>
          <option value="referral">Referral</option>
          <option value="api">API</option>
          <option value="upload">Upload</option>
          <option value="call">Call</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
        </select>
        <select value={`${sortField}-${sortDir}`} onChange={e => { const [f, d] = e.target.value.split('-'); setSortField(f as any); setSortDir(d as any); }} className="text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
          <option value="score-desc">Highest Score</option>
          <option value="value-desc">Highest Value</option>
          <option value="name-asc">Name A-Z</option>
        </select>
        <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <button onClick={() => setView('table')} className={`p-2 ${view === 'table' ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600' : 'text-gray-400 hover:text-gray-600'}`}>
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => setView('kanban')} className={`p-2 ${view === 'kanban' ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600' : 'text-gray-400 hover:text-gray-600'}`}>
            <Grid3X3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {view === 'table' ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium w-8"><input type="checkbox" className="rounded" /></th>
                  <th className="text-left py-3 px-4 font-medium">Lead</th>
                  <th className="text-left py-3 px-4 font-medium">Company</th>
                  <th className="text-left py-3 px-4 font-medium">Stage</th>
                  <th className="text-left py-3 px-4 font-medium">Score</th>
                  <th className="text-left py-3 px-4 font-medium">Value</th>
                  <th className="text-left py-3 px-4 font-medium">Assigned To</th>
                  <th className="text-left py-3 px-4 font-medium">Source</th>
                  <th className="text-left py-3 px-4 font-medium">Last Activity</th>
                  <th className="text-right py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(lead => (
                  <tr key={lead.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer group" onClick={() => setSelectedLead(lead)}>
                    <td className="py-3 px-4" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded" /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {lead.name ? lead.name.split(' ').map(n => n[0]).join('') : '?'}
                        </div>
                        <div>
                          <div className="text-sm font-medium flex items-center gap-1.5">
                            {lead.name}
                            {lead.priority === 'urgent' && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{lead.company}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-xs px-2 py-1 rounded-md font-medium capitalize w-fit ${stageConfig[lead.stage].color} bg-opacity-10`}
                          style={{ backgroundColor: `color-mix(in srgb, currentColor 12%, transparent)` }}>
                          {stageConfig[lead.stage].label}
                        </span>
                        {lead.status && lead.status !== 'Pending' && (
                          <span className="text-[10px] text-gray-500 dark:text-gray-400 italic">
                            {lead.status.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${lead.score > 70 ? 'bg-emerald-500' : lead.score > 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${lead.score}%` }} />
                        </div>
                        <span className="text-xs font-medium">{lead.score}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">₹{(lead.value / 1000).toFixed(0)}K</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{getAgentName(lead.assignedTo)}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md capitalize">{lead.source}</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(lead.lastActivity).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleCall(lead)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-rose-600" 
                          title="Call Ringg AI"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="Email"><Mail className="w-3.5 h-3.5 text-gray-500" /></button>
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="WhatsApp"><MessageCircle className="w-3.5 h-3.5 text-gray-500" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map(stage => {
            const stageLeads = filtered.filter(l => l.stage === stage);
            const stageValue = stageLeads.reduce((s, l) => s + l.value, 0);
            return (
              <div key={stage} className="flex-shrink-0 w-72">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${stageConfig[stage].bg}`} />
                    <h3 className="font-semibold text-sm">{stageConfig[stage].label}</h3>
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md">{stageLeads.length}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">₹{(stageValue / 100000).toFixed(1)}L total</div>
                <div className="space-y-2">
                  {stageLeads.map(lead => (
                    <div key={lead.id} onClick={() => setSelectedLead(lead)} className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold">
                            {lead.name ? lead.name.split(' ').map(n => n[0]).join('') : '?'}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{lead.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{lead.company}</div>
                          </div>
                        </div>
                        {lead.priority === 'urgent' && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <div className="w-10 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${lead.score > 70 ? 'bg-emerald-500' : lead.score > 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${lead.score}%` }} />
                          </div>
                          <span className="text-[10px] text-gray-500">{lead.score}</span>
                        </div>
                        <span className="text-xs font-medium text-indigo-500">₹{(lead.value / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {lead.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
          onUpdate={updateLead} 
          onStageChange={updateLeadStage} 
          onDelete={(id) => { deleteLead(id); setSelectedLead(null); }} 
          onCall={handleCall}
          getAgentName={getAgentName} 
        />
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <AddLeadModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

function LeadDetailModal({ lead, onClose, onStageChange, onDelete: _onDelete, onCall, getAgentName }: {
  lead: Lead;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Lead>) => void;
  onStageChange: (id: string, stage: LeadStage) => void;
  onDelete: (id: string) => void;
  onCall: (lead: Lead) => void;
  getAgentName: (id: string) => string;
}) {
  const [tab, setTab] = useState<'overview' | 'activity' | 'notes'>('overview');
  const [note, setNote] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end" onClick={onClose}>
      <div className="w-full max-w-2xl h-full bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                {lead.name ? lead.name.split(' ').map(n => n[0]).join('') : '?'}
              </div>
              <div>
                <h2 className="text-xl font-bold">{lead.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{lead.title} at {lead.company}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md capitalize">{lead.source}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-md font-medium capitalize ${stageConfig[lead.stage].color}`} style={{ backgroundColor: `color-mix(in srgb, currentColor 12%, transparent)` }}>{lead.stage}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><X className="w-5 h-5" /></button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 mt-4">
            <button 
              onClick={() => onCall(lead)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </button>

            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Mail className="w-3.5 h-3.5" /> Email
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </button>
            <div className="flex-1" />
            <select value={lead.stage} onChange={e => onStageChange(lead.id, e.target.value as LeadStage)} className="text-xs border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-white dark:bg-gray-800">
              {stages.map(s => <option key={s} value={s}>{stageConfig[s].label}</option>)}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 px-6">
          {(['overview', 'activity', 'calls', 'notes'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-indigo-500 text-rose-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>
              {t}
            </button>
          ))}
        </div>


        {/* Tab Content */}
        <div className="p-6">
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email</p>
                  <p className="text-sm font-medium">{lead.email}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                  <p className="text-sm font-medium">{lead.phone}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Company</p>
                  <p className="text-sm font-medium">{lead.company}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Title</p>
                  <p className="text-sm font-medium">{lead.title}</p>
                </div>
              </div>

              {/* Lead Score & Value */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-center">
                  <p className="text-2xl font-bold text-rose-600 dark:text-indigo-400">{lead.score}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lead Score</p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹{(lead.value / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Deal Value</p>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-center">
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{lead.activityCount}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Activities</p>
                </div>
              </div>

              {/* AI Insights */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-indigo-500" />
                  <h4 className="text-sm font-semibold">AI Suggested Reply</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Hi {lead.name ? lead.name.split(' ')[0] : 'there'}, I noticed you've been exploring our {lead.customFields?.industry || 'platform'} solutions. I'd love to schedule a quick 15-min call to discuss how we can help {lead.company || 'your team'} scale. Would tomorrow at 3 PM work?
                </p>
                <button className="mt-2 text-xs text-indigo-500 hover:text-rose-600 font-medium">Copy to clipboard</button>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {lead.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {tag}
                    </span>
                  ))}
                  <button className="text-xs text-indigo-500 hover:text-rose-600 px-2 py-1">+ Add tag</button>
                </div>
              </div>

              {/* Custom Fields */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Custom Fields</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(lead.customFields).map(([key, value]) => (
                    <div key={key} className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key}</p>
                      <p className="text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p>Assigned to: <span className="font-medium text-gray-700 dark:text-gray-300">{getAgentName(lead.assignedTo)}</span></p>
                <p>Created: <span className="font-medium text-gray-700 dark:text-gray-300">{new Date(lead.createdAt).toLocaleDateString()}</span></p>
                <p>Last updated: <span className="font-medium text-gray-700 dark:text-gray-300">{new Date(lead.updatedAt).toLocaleDateString()}</span></p>
              </div>
            </div>
          )}

          {tab === 'calls' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Call Status</p>
                  <p className="text-sm font-medium capitalize">{lead.call_status || lead.status || 'No calls yet'}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Called At</p>
                  <p className="text-sm font-medium">{lead.called_at ? new Date(lead.called_at).toLocaleString() : 'N/A'}</p>
                </div>
              </div>

              {/* AI Summary */}
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-500" />
                  AI Call Summary
                </h4>
                {lead.call_summary ? (
                  <div className="p-4 rounded-lg bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-800/30">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                      "{lead.call_summary}"
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 text-center">
                    <p className="text-xs text-gray-500 italic">No AI summary available yet.</p>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Latest Transcript
                </h4>
                 {(lead.call_transcript || lead.transcript) ? (
                   <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 max-h-96 overflow-y-auto custom-scrollbar">
                     <div className="space-y-3">
                       {Array.isArray(lead.call_transcript || lead.transcript) ? (
                         (lead.call_transcript || lead.transcript).map((msg: any, i: number) => (
                           <div key={i} className="text-sm">
                             <span className={`font-bold capitalize ${msg.role === 'user' || msg.role === 'human' ? 'text-rose-600' : 'text-emerald-600'}`}>
                               {msg.role || 'Agent'}:
                             </span>
                             <p className="text-gray-600 dark:text-gray-300 mt-0.5">{msg.content || msg.text || JSON.stringify(msg)}</p>
                           </div>
                         ))
                       ) : (
                         <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                           {lead.call_transcript || lead.transcript}
                         </p>
                       )}
                     </div>
                   </div>
                 ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                    <Phone className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No call transcript available yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}


          {tab === 'activity' && (
            <div className="space-y-4">
              <div className="relative pl-6 space-y-4">
                <div className="absolute left-2 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700" />
                {[
                  { type: 'call', text: 'Phone call - 8 min 5 sec', time: '2 hours ago', icon: '📞' },
                  { type: 'email', text: 'Follow-up email sent', time: '5 hours ago', icon: '📧' },
                  { type: 'stage', text: 'Stage changed: New → Contacted', time: '1 day ago', icon: '🔄' },
                  { type: 'note', text: 'Added note: Interested in enterprise plan', time: '2 days ago', icon: '📝' },
                  { type: 'whatsapp', text: 'WhatsApp message sent', time: '3 days ago', icon: '💬' },
                  { type: 'assignment', text: 'Assigned to Rahul Verma', time: '5 days ago', icon: '👤' },
                  { type: 'created', text: 'Lead created via website form', time: '5 days ago', icon: '✨' },
                ].map((activity, i) => (
                  <div key={i} className="relative flex items-start gap-3">
                    <div className="absolute -left-6 w-4 h-4 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-[8px]">
                      {activity.icon}
                    </div>
                    <div className="flex-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <p className="text-sm">{activity.text}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'notes' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Add a note..."
                  className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              <button className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors">Add Note</button>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <p className="text-sm">{lead.notes}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Added 2 days ago by Priya Sharma</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddLeadModal({ onClose }: { onClose: () => void }) {
  const { addLead } = useCRMStore();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    company: '', 
    title: '', 
    source: 'website' as Lead['source'], 
    value: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form:', form);
    try {
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        ...form,
        stage: 'new',
        priority: 'medium',
        score: 0,
        assignedTo: 'user-1',
        organizationId: 'org-1',
        tags: ['Student Enquiry'],
        customFields: { 
          course: form.title,
          college: form.company 
        },
        value: parseInt(form.value) || 0,
        activityCount: 0,
        lastActivity: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Adding lead to store...');
      await addLead(newLead);
      console.log('Lead added successfully, closing modal');
      window.alert('Student lead created successfully!');
      onClose();
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      window.alert('Failed to create lead: ' + error.message);
    }
  };



  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold">New Student Enquiry</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Student Name *</label>
              <input required placeholder="Enter full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Email Address *</label>
              <input required type="email" placeholder="student@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Phone Number *</label>
              <input required placeholder="+91" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">College / School</label>
              <input placeholder="Current institution" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Interested Course</label>
              <select value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select Course</option>
                <option value="B.Tech CSE">B.Tech CSE</option>
                <option value="B.Tech ME">B.Tech ME</option>
                <option value="B.Tech ECE">B.Tech ECE</option>
                <option value="MBA">MBA</option>
                <option value="MCA">MCA</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Lead Source</label>
              <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value as any })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="website">Website</option>
                <option value="api">API</option>
                <option value="upload">Upload</option>
                <option value="call">Call</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="campaign">Campaign</option>
                <option value="referral">Referral</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Budget / Fee Range (₹)</label>
              <input type="number" placeholder="Enter amount" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Notes / Special Requirements</label>
            <textarea placeholder="Any specific details about the enquiry..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={3} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium">Create Student Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
}

