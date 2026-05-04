import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useCRMStore } from '../store/crmStore';
import {
  Users, Zap, ChevronDown, Plus, Menu, X, Brain, Search, Moon, Sun, Bell, Shield, LogOut, Bot, GraduationCap
} from 'lucide-react';


const navItems = [
  { path: '/leads', icon: Users, label: 'Leads', badge: true },
  { path: '/chatbot', icon: Bot, label: 'Agentic AI', badge: false },
];



export default function Layout({ children }: { children: React.ReactNode }) {
  const { darkMode, toggleDarkMode, sidebarOpen, setSidebarOpen, currentOrg, organizations, switchOrganization, currentUser, notifications } = useCRMStore();
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const unreadCount = notifications.filter(n => !n.read).length;

  const themeClass = darkMode ? 'dark' : '';

  return (
    <div className={themeClass}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-30 flex-shrink-0`}>
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <h1 className="font-bold text-sm leading-tight bg-gradient-to-r from-rose-600 to-red-800 bg-clip-text text-transparent">
                    I.T.S Engineering<br/>College
                  </h1>
                </div>
              )}
            </div>
          </div>

          {/* Org Switcher */}
          {sidebarOpen && (
            <div className="p-3 relative">
              <button
                onClick={() => setShowOrgSwitcher(!showOrgSwitcher)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                <span className="text-lg">{currentOrg.logo}</span>
                <span className="flex-1 text-left font-medium truncate">{currentOrg.name}</span>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </button>
              {showOrgSwitcher && (
                <div className="absolute top-full left-3 right-3 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                  {organizations.map(org => (
                    <button
                      key={org.id}
                      onClick={() => { switchOrganization(org.id); setShowOrgSwitcher(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm ${org.id === currentOrg.id ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : ''}`}
                    >
                      <span className="text-lg">{org.logo}</span>
                      <div className="text-left">
                        <div className="font-medium">{org.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{org.plan}</div>
                      </div>
                    </button>
                  ))}
                  <button className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-indigo-600 dark:text-indigo-400 border-t border-gray-200 dark:border-gray-700">
                    <Plus className="w-4 h-4" /> New Organization
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                  }`
                }
              >
  <>
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span className="text-sm">{item.label}</span>}
                    {!sidebarOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                        {item.label}
                      </div>
                    )}
                    {sidebarOpen && item.path === '/leads' && (
                      <span className="ml-auto text-xs bg-rose-100 dark:bg-rose-800 text-rose-600 dark:text-rose-300 px-2 py-0.5 rounded-full font-medium">50</span>
                    )}
                  </>
              </NavLink>
            ))}
          </nav>

          {/* AI Assistant Button */}
          {sidebarOpen && (
            <div className="px-3 pb-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500/10 to-red-500/10 dark:from-rose-500/20 dark:to-red-500/20 border border-rose-200 dark:border-rose-800">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">ITS Admission AI</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">6 potential students identified</p>
                <button className="w-full text-xs bg-rose-600 hover:bg-rose-700 text-white py-1.5 rounded-lg transition-colors font-medium">
                  Analyze Leads
                </button>
              </div>
            </div>
          )}

          {/* User */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {currentUser.avatar}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{currentUser.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{currentUser.role}</div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 gap-4 flex-shrink-0">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Search */}
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads, campaigns, contacts... (⌘K)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button onClick={toggleDarkMode} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Notifications */}
              <div className="relative">
                <button onClick={() => { setShowNotifPanel(!showNotifPanel); setShowUserMenu(false); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {showNotifPanel && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <h3 className="font-semibold text-sm">Notifications</h3>
                      <button className="text-xs text-indigo-500 hover:text-indigo-600">Mark all read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-3 border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                          <div className="flex items-start gap-2">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'warning' ? 'bg-amber-500' : n.type === 'success' ? 'bg-emerald-500' : n.type === 'error' ? 'bg-red-500' : 'bg-indigo-500'}`} />
                            <div>
                              <p className="text-sm font-medium">{n.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifPanel(false); }} className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {currentUser.avatar}
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-medium text-sm">{currentUser.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                    </div>
                    <div className="p-1">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Shield className="w-4 h-4" /> Account Settings</button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-red-500"><LogOut className="w-4 h-4" /> Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto" onClick={() => { setShowNotifPanel(false); setShowUserMenu(false); setShowOrgSwitcher(false); }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
