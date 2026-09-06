import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Calendar, 
  ArrowRight, 
  Filter, 
  ShieldCheck, 
  Layers,
  ChevronRight
} from 'lucide-react';

export default function CorrectiveActionsView() {
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const [actions, setActions] = useState([
    {
      id: 'CAPA-2026-081',
      title: 'Erect Interlocked Crane Drop-Zone Physical Barricade',
      description: 'Design and install heavy-duty magnetic chain barrier with warning sirens under Rig 04 Derrick Floor crane radius.',
      precursorRef: 'REP-ID001-0001',
      assignedTo: 'Mechanical Lifting Integrity Team',
      assignedPerson: 'Sarah Jenkins (Lead Rigging Engineer)',
      dueDate: '2026-09-08',
      priority: 'P1 - Critical',
      status: 'Open',
      progress: 65,
      site: 'Plant 03'
    },
    {
      id: 'CAPA-2026-082',
      title: 'Mandatory Multi-Lock LOTO Station Installation',
      description: 'Install lockout stations with dual-key interlocks outside 11kV Substation A breaker panel doors.',
      precursorRef: 'REP-ID001-0002',
      assignedTo: 'Electrical Safety Command',
      assignedPerson: 'Rajesh Sharma (Chief Electrical Auditor)',
      dueDate: '2026-09-04',
      priority: 'P1 - Critical',
      status: 'Overdue',
      progress: 40,
      site: 'Plant 01'
    },
    {
      id: 'CAPA-2026-083',
      title: 'Grating Void Replacement & Walkway Kick-Plate Audit',
      description: 'Fit galvanized steel grating and self-closing gates on Level 3 elevated process walkways above separation vessels.',
      precursorRef: 'REP-ID001-0003',
      assignedTo: 'Structural Maintenance Division',
      assignedPerson: 'David Miller (Plant Superintendent)',
      dueDate: '2026-09-09',
      priority: 'P2 - High',
      status: 'Open',
      progress: 80,
      site: 'Plant 02'
    },
    {
      id: 'CAPA-2026-084',
      title: 'Convex Mirror & Automated Speed Governor Deployment',
      description: 'Install 4 safety convex mirrors and radar-activated floor speed limits along Warehouse logistics corridor.',
      precursorRef: 'REP-ID001-0004',
      assignedTo: 'Logistics HSE Oversight',
      assignedPerson: 'Elena Rostova (Warehouse Safety Officer)',
      dueDate: '2026-09-12',
      priority: 'P2 - High',
      status: 'Open',
      progress: 30,
      site: 'Plant 04'
    },
    {
      id: 'CAPA-2026-080',
      title: 'Whip-Check Wire Harness Installation on HP Purge Headers',
      description: 'Equip all 16 nitrogen purge hose couplings with double-clamped stainless whip-checks.',
      precursorRef: 'REP-ID001-0005',
      assignedTo: 'Process Engineering Operations',
      assignedPerson: 'Tariq Al-Mansoor (Senior Process Specialist)',
      dueDate: '2026-09-02',
      priority: 'P1 - Critical',
      status: 'Completed',
      progress: 100,
      site: 'Plant 05'
    }
  ]);

  const filteredActions = actions.filter((act) => {
    if (filterPriority !== 'ALL' && !act.priority.includes(filterPriority)) return false;
    if (filterStatus !== 'ALL' && act.status !== filterStatus) return false;
    return true;
  });

  const openCount = actions.filter(a => a.status === 'Open').length;
  const overdueCount = actions.filter(a => a.status === 'Overdue').length;
  const completedCount = actions.filter(a => a.status === 'Completed').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-100 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
              Corrective & Preventive Action (CAPA) Console
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking lifecycle barrier engineering, Life-Saving Rule remediation, and verification sign-offs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            Total Queue: 126 Actions Active
          </span>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 flex items-center justify-between shadow-xl">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Active Open Actions</div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">126</div>
            <span className="text-xs text-cyan-400 font-medium mt-1 inline-block">Assigned to field engineers</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 flex items-center justify-between shadow-xl">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Overdue Critical Items</div>
            <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">18</div>
            <span className="text-xs text-rose-400 font-medium mt-1 inline-block">Requires immediate escalation</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 flex items-center justify-between shadow-xl">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Completed This Month</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">412</div>
            <span className="text-xs text-emerald-400 font-medium mt-1 inline-block">91.4% barrier reliability rate</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-medium">Filter by Priority:</span>
          {['ALL', 'P1', 'P2', 'P3'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 rounded-xl font-semibold cursor-pointer border ${
                filterPriority === p 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {p === 'ALL' ? 'All Priorities' : p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-medium">Filter by Status:</span>
          {['ALL', 'Open', 'Overdue', 'Completed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl font-semibold cursor-pointer border ${
                filterStatus === s 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {s === 'ALL' ? 'All Statuses' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Actions List Cards */}
      <div className="space-y-4">
        {filteredActions.map((item) => (
          <div 
            key={item.id}
            className="p-5 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 hover:border-amber-500/30 transition-all shadow-xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-xs font-bold text-amber-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  {item.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                  item.priority.includes('P1') ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {item.priority}
                </span>
                <span className="text-xs text-slate-400">{item.site} • Ref: {item.precursorRef}</span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  item.status === 'Completed'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : item.status === 'Overdue'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {item.status}
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Due: {item.dueDate}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white tracking-tight">{item.title}</h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{item.description}</p>
            </div>

            {/* Progress & Assignee */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2 text-xs items-center">
              <div className="sm:col-span-6 flex items-center gap-2 text-slate-300">
                <User className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Assigned: <strong className="text-white">{item.assignedPerson}</strong> ({item.assignedTo})</span>
              </div>

              <div className="sm:col-span-6 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Implementation Progress</span>
                  <span className="text-white font-bold">{item.progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.progress === 100 
                        ? 'bg-emerald-400' 
                        : item.status === 'Overdue' 
                          ? 'bg-rose-500' 
                          : 'bg-amber-400'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
