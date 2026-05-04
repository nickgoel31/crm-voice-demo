import { create } from 'zustand';
import { Lead, User, Organization, Notification, LeadStage } from '../types';
import { users as mockUsers, organizations as mockOrgs, notifications as mockNotifications } from '../data/mockData';

interface CRMStore {
  // Auth & Org
  currentUser: User;
  currentOrg: Organization;
  organizations: Organization[];
  users: User[];
  switchOrganization: (orgId: string) => void;

  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Leads
  leads: Lead[];
  fetchLeads: () => Promise<void>;
  addLead: (lead: Lead) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  updateLeadStage: (id: string, stage: LeadStage) => Promise<void>;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  unreadCount: () => number;

  // Modals
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  modalData: any;
  setModalData: (data: any) => void;
}

const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

export const useCRMStore = create<CRMStore>((set, get) => ({
  currentUser: mockUsers[0],
  currentOrg: mockOrgs[0],
  organizations: mockOrgs,
  users: mockUsers,
  switchOrganization: (orgId) => {
    const org = mockOrgs.find(o => o.id === orgId);
    if (org) set({ currentOrg: org });
  },

  darkMode: true,
  toggleDarkMode: () => set(s => ({ darkMode: !s.darkMode })),

  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  leads: [],
  fetchLeads: async () => {
    try {
      const response = await fetch(`${API_URL}/leads`);
      const data = await response.json();
      set({ leads: data.leads });
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    }
  },
  addLead: async (lead) => {
    console.log('API POST /leads:', lead);
    try {
      const response = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add lead');
      }
      
      console.log('Lead added successfully to DB');
      await get().fetchLeads();
    } catch (error) {
      console.error('Failed to add lead:', error);
      throw error; // Re-throw so the component can handle it
    }
  },

  initiateCall: async (leadId, phoneNumber, leadName) => {
    console.log('Initiating call for lead:', leadId);
    try {
      const response = await fetch(`${API_URL}/call/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, phoneNumber, leadName }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }
      
      await get().fetchLeads();
    } catch (error) {
      console.error('Call initiation failed:', error);
      throw error;
    }
  },
  updateLead: async (id, updates) => {
    // For now, we'll just update local state and you can implement the PUT endpoint if needed
    set(s => ({ leads: s.leads.map(l => l.id === id ? { ...l, ...updates } : l) }));
  },
  deleteLead: async (id) => {
    set(s => ({ leads: s.leads.filter(l => l.id !== id) }));
  },
  updateLeadStage: async (id, stage) => {
    set(s => ({ leads: s.leads.map(l => l.id === id ? { ...l, stage, updatedAt: new Date().toISOString() } : l) }));
  },

  notifications: mockNotifications,
  markNotificationRead: (id) => set(s => ({ notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n) })),
  unreadCount: () => get().notifications.filter(n => !n.read).length,

  activeModal: null,
  setActiveModal: (modal) => set({ activeModal: modal }),
  modalData: null,
  setModalData: (data) => set({ modalData: data }),
}));

