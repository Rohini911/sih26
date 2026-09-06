import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  UploadCloud, 
  FileText, 
  Activity, 
  ShieldAlert, 
  Zap, 
  AlertOctagon, 
  CheckSquare, 
  BarChart3, 
  Flame, 
  ShieldCheck, 
  Settings,
  Building2, 
  LogOut,
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ 
  currentPath = '/dashboard', 
  onNavigate, 
  isOpen = false, 
  onClose,
  onExitPlatform
}) {
  const { user, logout } = useAuth();

  const navGroups = [
    {
      title: 'MAIN',
      items: [
        { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'ai_analysis', path: '/ai-analysis', label: 'AI Analysis', icon: Cpu, isAi: true },
        { id: 'bulk_upload', path: '/bulk-upload', label: 'Bulk Upload', icon: UploadCloud },
        { id: 'reports', path: '/reports', label: 'All Reports', icon: FileText },
        { id: 'week_signals', path: '/week-signals', label: 'Week Signals', icon: Activity },
        { id: 'strong_report', path: '/strong-report', label: 'Strong Report', icon: ShieldAlert, badge: 'High Risk' },
      ]
    },
    {
      title: 'SIF & SAFETY',
      items: [
        { id: 'sif_precursors', path: '/sif-precursors', label: 'SIF Precursors', icon: Zap },
        { id: 'critical_alerts', path: '/critical-alerts', label: 'Critical Alerts', icon: AlertOctagon, badge: '4', badgeColor: 'rose' },
        { id: 'corrective_actions', path: '/corrective-actions', label: 'Corrective Actions', icon: CheckSquare, badge: '18', badgeColor: 'amber' },
        { id: 'analytics', path: '/analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'risk_heatmap', path: '/risk-heatmap', label: 'Risk Heatmap', icon: Flame },
        { id: 'life_saving_rules', path: '/life-saving-rules', label: 'Life-Saving Rules', icon: ShieldCheck },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', path: '/settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  const handleItemClick = (path) => {
    if (onNavigate) onNavigate(path);
    if (onClose) onClose();
  };

  const handleExit = () => {
    if (onExitPlatform) {
      onExitPlatform();
    } else {
      logout();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#07101F]/95 backdrop-blur-xl border-r border-slate-800/80 text-slate-300 w-64 shrink-0 select-none">
      
      {/* 1. Header: SIF Sentinel & Subtitle */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/25">
              <ShieldCheck className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping opacity-75" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-[#07101F]" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-base font-black tracking-tight text-white font-heading">
                SIF <span className="text-amber-400 font-black">Sentinel</span>
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-tight">
              AI-Powered Safety Platform
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Navigation Items List grouped */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-3.5 custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-0.5">
            <div className="px-2.5 pb-1 text-[9.5px] font-bold uppercase tracking-wider text-slate-400">
              {group.title}
            </div>

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.path)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs font-semibold transition-all duration-200 group relative cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 border border-amber-300'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-slate-950/20 text-slate-950' 
                        : 'text-slate-400 group-hover:text-amber-400'
                    }`}>
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-1 shrink-0 ml-1.5">
                    {item.badge && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                        isActive
                          ? 'bg-slate-950/20 text-slate-950 font-black'
                          : item.badgeColor === 'rose'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                    {item.isAi && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                        isActive
                          ? 'bg-slate-950/20 text-slate-950 font-black'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}>
                        AI
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* 3. Bottom of Sidebar: Organization, Industrial Site A & System Online */}
      <div className="p-3 border-t border-slate-800/80 bg-[#070D18]/90 space-y-2">
        
        {/* Organization Information Card */}
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Building2 className="w-3 h-3 text-amber-400" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                  Organization
                </div>
                <div className="text-xs font-bold text-white truncate" title="PetroSafe Industries / Industrial Site A">
                  PetroSafe Industries / Industrial Site A
                </div>
              </div>
            </div>
          </div>

          {/* Operational Status Indicator */}
          <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10.5px] font-medium text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span>System Online</span>
            </div>
            <span className="text-[9px] font-mono text-slate-500">99.98%</span>
          </div>
        </div>

        {/* Exit to Public Website Button */}
        <button
          onClick={handleExit}
          className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-700/60 cursor-pointer"
          title="Return to public safety overview or log out"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          <span>Exit Platform</span>
        </button>

      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex flex-col h-screen sticky top-0 z-40 shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={onClose}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
