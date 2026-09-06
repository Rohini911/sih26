import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Building2, 
  LogOut, 
  Menu, 
  ShieldAlert, 
  CheckCircle2, 
  Sliders, 
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ROUTE_TITLES = {
  '/dashboard': { title: 'Good morning, Safety Team ☀', subtitle: "Here's today's safety intelligence overview." },
  '/ai-analysis': { title: 'AI Safety Intelligence', subtitle: 'Explainable neural analysis of safety observations & energy vectors.' },
  '/bulk-upload': { title: 'Bulk Safety Ingestion', subtitle: 'Batch upload incident logs, field sheets, and inspection reports.' },
  '/reports': { title: 'All Safety Reports', subtitle: 'Comprehensive database of field observations, near-misses, and unsafe acts.' },
  '/week-signals': { title: 'Weekly Safety Signals', subtitle: 'Week-over-week precursor trends and emerging risk patterns.' },
  '/strong-report': { title: 'High-Consequence Reports', subtitle: 'Prioritized critical reports with severe SIF potential.' },
  '/sif-precursors': { title: 'SIF Precursor Intelligence', subtitle: 'Distribution and trend analysis across the 6 high-energy vectors.' },
  '/critical-alerts': { title: 'Critical Alert Center', subtitle: 'Immediate high-priority hazard escalations requiring barrier verification.' },
  '/corrective-actions': { title: 'Corrective Actions (CAPA)', subtitle: 'Action tracking, control implementation, and barrier closure verification.' },
  '/analytics': { title: 'Safety Telemetry Analytics', subtitle: 'Cross-facility performance benchmarking and incident trajectory.' },
  '/risk-heatmap': { title: 'Facility Risk Heatmap', subtitle: 'Spatial risk matrix based on API RP 754 hazard exposure zones.' },
  '/life-saving-rules': { title: 'Life-Saving Rules', subtitle: 'IOGP standardized barrier verifications and compliance auditing.' },
  '/settings': { title: 'Platform Settings', subtitle: 'Organization profile, notification rules, and AI threshold configuration.' },
};

export default function Header({ currentPath = '/dashboard', onNavigate, onOpenSidebar, onExitPlatform }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const routeMeta = ROUTE_TITLES[currentPath] || ROUTE_TITLES['/dashboard'];

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExit = () => {
    if (onExitPlatform) {
      onExitPlatform();
    } else {
      logout();
    }
  };

  const handleNavigateToAlerts = () => {
    setNotificationsOpen(false);
    if (onNavigate) onNavigate('/critical-alerts');
  };

  return (
    <header className="h-16 bg-[#070E1A] border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 select-none shadow-sm">
      
      {/* 1. Left Section: Compact Greeting & Subtitle */}
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors border border-slate-800"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold font-heading text-white tracking-tight">
              {routeMeta.title}
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            {routeMeta.subtitle}
          </p>
        </div>
      </div>

      {/* 2. Right Section: Search, Notifications, User Avatar (PetroSafe Industries / Administrator) */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        
        {/* Search Bar matching screenshot */}
        <div className="hidden md:flex items-center bg-[#0C1628] border border-slate-800/90 rounded-xl px-3 py-1.5 w-60 lg:w-72 shadow-inner">
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
          <input 
            type="text"
            placeholder="Search reports, hazards, sites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs text-white placeholder-slate-400 focus:outline-none w-full"
          />
        </div>

        {/* Notification Bell with Red Badge 1 */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl bg-[#0C1628] hover:bg-slate-800 border border-slate-800/90 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Critical Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center ring-2 ring-[#070E1A]">
              1
            </span>
          </button>

          {/* Notifications Dropdown Card */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-2xl p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">Live Critical Alerts</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    4 Active
                  </span>
                </div>
                <button 
                  onClick={handleNavigateToAlerts}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Alert Center</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="divide-y divide-slate-800/60 mt-2 max-h-64 overflow-y-auto space-y-1 custom-scrollbar">
                <div className="py-1.5 text-left cursor-pointer hover:bg-slate-800/40 p-2 rounded-lg" onClick={handleNavigateToAlerts}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-400">Worker exposed to suspended load</span>
                    <span className="text-[9px] text-slate-500">8m ago</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Plant 03 • Crane Operations (Risk Score 94)</div>
                </div>

                <div className="py-1.5 text-left cursor-pointer hover:bg-slate-800/40 p-2 rounded-lg" onClick={handleNavigateToAlerts}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-rose-400">Energy isolation control not verified</span>
                    <span className="text-[9px] text-slate-500">24m ago</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Plant 01 • Maintenance (Risk Score 91)</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar + PetroSafe Industries / Administrator Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-slate-800/60 transition-all cursor-pointer group"
          >
            {/* User Avatar: Blue circle with PS */}
            <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/25">
              PS
            </div>
            
            {/* User Identity: PetroSafe Industries / Administrator */}
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-bold text-white tracking-tight flex items-center gap-1">
                <span>PetroSafe Industries</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 group-hover:text-white transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              <div className="text-[9.5px] text-slate-400 font-medium">
                Administrator
              </div>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2.5 border-b border-slate-800/80">
                <div className="text-xs font-bold text-white">Industrial Site A</div>
                <div className="text-[10.5px] text-slate-400 font-mono mt-0.5">
                  {user?.email || 'admin@petrosafe.com'}
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  <span>SIF Sentinel Enterprise</span>
                </div>
              </div>

              <div className="py-1 space-y-0.5">
                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onNavigate) onNavigate('/settings');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-left cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Organization Settings</span>
                </button>

                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onNavigate) onNavigate('/critical-alerts');
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-left cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                  <span>Critical Alerts (4)</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-800/80">
                <button
                  onClick={handleExit}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
                  <span>Exit Platform</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
