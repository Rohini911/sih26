import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Filter, 
  Activity, 
  Flame, 
  Zap, 
  X,
  Layers,
  FileCheck
} from 'lucide-react';

export default function AlertsView() {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [investigatingAlert, setInvestigatingAlert] = useState(null);
  const [investigationNotes, setInvestigationNotes] = useState('');
  const [investigationStatus, setInvestigationStatus] = useState('UNDER_INVESTIGATION');
  const [investigationSuccess, setInvestigationSuccess] = useState(false);

  const [alerts, setAlerts] = useState([
    {
      id: 'ALT-101',
      severity: 'CRITICAL',
      title: 'Worker exposed to suspended load on active casing line',
      location: 'Plant 03',
      facility_unit: 'Rig 04 Crane Operations',
      riskScore: 94,
      timeAgo: '8 min ago',
      timestamp: '2026-09-06 14:42:15',
      status: 'Action Required',
      description: 'A 2-ton casing pipe slipped during high-line hoist over active pedestrian walkway without mechanical dog latches or perimeter barricading.',
      hazard_type: 'Suspended Load / Kinetic Energy',
      barrier: 'Primary Tag Line & Exclusion Gate FAILED',
      action_needed: 'Deploy rigid barricades and verify sling test certificates.'
    },
    {
      id: 'ALT-102',
      severity: 'CRITICAL',
      title: 'Energy isolation control not verified in 11kV Substation A',
      location: 'Plant 01',
      facility_unit: 'Central Maintenance Bay',
      riskScore: 91,
      timeAgo: '24 min ago',
      timestamp: '2026-09-06 14:26:00',
      status: 'Under Investigation',
      description: 'Technician opened live 11kV high-voltage switchgear cubicle without multi-padlock LOTO or calibrated voltage tester proving dead.',
      hazard_type: 'Live High-Voltage Electrical Arc',
      barrier: 'LOTO Isolation Tagging BYPASSED',
      action_needed: 'Emergency stop-work; isolate main feeder switch.'
    },
    {
      id: 'ALT-103',
      severity: 'HIGH',
      title: 'Fall protection gap detected on Level 3 elevated platform',
      location: 'Plant 02',
      facility_unit: 'Hydrocarbon Separation Walkway',
      riskScore: 86,
      timeAgo: '42 min ago',
      timestamp: '2026-09-06 14:08:45',
      status: 'Action Required',
      description: 'Grating section removed leaving an 8.5m fall hazard directly above process pumps. Zero warning tape or safety harness lifelines attached.',
      hazard_type: 'Fall from Height Void',
      barrier: 'Grating Decking REMOVED',
      action_needed: 'Install scaffold planking and lock walkway access door.'
    },
    {
      id: 'ALT-104',
      severity: 'HIGH',
      title: 'Vehicle-pedestrian interaction in blind logistics corner',
      location: 'Plant 04',
      facility_unit: 'Logistics Warehouse Bay 5',
      riskScore: 82,
      timeAgo: '1 hr ago',
      timestamp: '2026-09-06 13:50:12',
      status: 'Under Investigation',
      description: 'Heavy 5-ton forklift operated at 18 km/h across pedestrian crosswalk without spotter or automatic collision strobe alarm.',
      hazard_type: 'Mobile Heavy Plant Dynamic Mass',
      barrier: 'Physical Segregation Gate ABSENT',
      action_needed: 'Implement physical speed governor and floor markings.'
    }
  ]);

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity === 'CRITICAL' && alert.severity !== 'CRITICAL') return false;
    if (filterSeverity === 'HIGH' && alert.severity !== 'HIGH') return false;
    if (filterSeverity === 'ACTION' && alert.status !== 'Action Required') return false;
    return true;
  });

  const handleSaveInvestigation = () => {
    if (!investigatingAlert) return;
    setAlerts(prev => prev.map(a => 
      a.id === investigatingAlert.id ? { ...a, status: 'Resolved' } : a
    ));
    setInvestigationSuccess(true);
    setTimeout(() => {
      setInvestigationSuccess(false);
      setInvestigatingAlert(null);
      setInvestigationNotes('');
    }, 800);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-100 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
              Critical Alert Command Center
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time escalation console for high-energy precursor events requiring immediate control room intervention
          </p>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'ALL', label: 'All Alerts' },
            { id: 'CRITICAL', label: 'Critical Only' },
            { id: 'HIGH', label: 'High Only' },
            { id: 'ACTION', label: 'Action Required' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterSeverity(pill.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                filterSeverity === pill.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div 
            key={alert.id}
            className={`p-6 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border transition-all duration-300 shadow-xl space-y-4 ${
              alert.severity === 'CRITICAL' 
                ? 'border-rose-500/30 hover:border-rose-500/60' 
                : 'border-amber-500/30 hover:border-amber-500/60'
            }`}
          >
            
            {/* Top Alert Header Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                  alert.severity === 'CRITICAL' 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${alert.severity === 'CRITICAL' ? 'bg-rose-500 animate-ping' : 'bg-amber-400'}`} />
                  {alert.severity}
                </span>

                <span className="font-mono text-xs font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {alert.id}
                </span>

                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {alert.location} • {alert.facility_unit}
                </span>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Risk Score</span>
                  <div className={`text-base font-black font-mono ${alert.severity === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'}`}>
                    {alert.riskScore} / 100
                  </div>
                </div>

                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {alert.timeAgo}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                "{alert.title}"
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {alert.description}
              </p>
            </div>

            {/* Telemetry Detail Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono block">Hazard Vector</span>
                <span className="text-white font-medium">{alert.hazard_type}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-rose-400 font-mono block">Barrier Integrity Audit</span>
                <span className="text-rose-300 font-medium">{alert.barrier}</span>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                  alert.status === 'Resolved' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : alert.status === 'Action Required'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {alert.status}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-[11px] hidden md:inline">
                  Action: {alert.action_needed}
                </span>

                <button
                  type="button"
                  onClick={() => setInvestigatingAlert(alert)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span>Investigate & Verify Barrier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Investigation Modal */}
      {investigatingAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#0E1628] rounded-2xl border border-slate-800 shadow-2xl p-6 space-y-5 text-left text-slate-100">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-white">
                  Investigate Precursor: {investigatingAlert.id}
                </h3>
              </div>
              <button 
                onClick={() => setInvestigatingAlert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <div className="font-bold text-white">{investigatingAlert.title}</div>
              <div className="text-slate-400">{investigatingAlert.location} • {investigatingAlert.hazard_type}</div>
            </div>

            <div className="space-y-3 text-xs">
              <span className="font-bold uppercase tracking-wider text-amber-400 block">
                Barrier Verification Checklist
              </span>
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-amber-500" />
                <span>Primary energy isolation confirmed at zero potential.</span>
              </label>
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-amber-500" />
                <span>Physical exclusion zone barricade erected and spotter assigned.</span>
              </label>
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-amber-500" />
                <span>Chief HSE Lead audited permit-to-work compliance.</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Control Room Log Notes
              </label>
              <textarea
                rows={3}
                value={investigationNotes}
                onChange={(e) => setInvestigationNotes(e.target.value)}
                placeholder="Document remedial barriers deployed, root causes identified, and supervisor sign-off..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {investigationSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Barrier verified. Precursor status updated to Resolved.</span>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setInvestigatingAlert(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveInvestigation}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black text-xs shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sign Off & Resolve Alert</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
