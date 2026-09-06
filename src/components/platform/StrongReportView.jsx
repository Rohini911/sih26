import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Cpu, 
  MapPin, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  Flame,
  Zap,
  Activity,
  AlertOctagon
} from 'lucide-react';
import FullAnalysisModal from './FullAnalysisModal';

export default function StrongReportView() {
  const [selectedReport, setSelectedReport] = useState(null);

  // High-value, high-consequence safety reports
  const strongReports = [
    {
      id: 101,
      report_reference: 'SR-CRIT-2026-01',
      report_type: 'Near Miss',
      title: 'Suspended 2-Ton Casing Flange Dropped on Drill Floor Walkway',
      description: 'During crane hoisting operation at Rig 04 Derrick Floor, a 4-inch heavy steel drilling flange slipped from the rigging sling at a height of 18 meters and fell 2 meters away from two roughnecks positioning casing pipe. No exclusion zone barricade was established around the drop zone.',
      location: 'Plant 03 • Drilling Rig 04',
      facility_unit: 'Derrick Floor Area',
      report_date: '2026-09-06',
      sif_potential: 'FATALITY / PERMANENT DISABILITY POTENTIAL (98%)',
      ai_confidence: 96.4,
      risk_score: 94,
      investigation_priority: 'P1 IMMEDIATE MANDATORY STOP-WORK',
      energy_source: 'Gravitational Potential Energy (2,000 kg at 18m)',
      barrier_status: 'DIRECT BARRIER TOTALLY ABSENT',
      key_learnings: 'Overhead travel across active working pathways requires physical interlocked laser or chain gate exclusion barriers.'
    },
    {
      id: 102,
      report_reference: 'SR-CRIT-2026-02',
      report_type: 'Unsafe Act',
      title: 'High Voltage 11kV Substation Switchgear Live Entry without LOTO',
      description: 'Maintenance technician observed entering high-voltage 11kV electrical substation switchgear room to perform circuit breaker inspection without conducting Lock-Out/Tag-Out (LOTO) energy isolation or verifying zero-energy state with a calibrated voltage detector.',
      location: 'Plant 01 • Central Processing Facility',
      facility_unit: 'Main Substation A',
      report_date: '2026-09-06',
      sif_potential: 'SEVERE ARC FLASH / FATAL ELECTROCUTION POTENTIAL (94%)',
      ai_confidence: 94.8,
      risk_score: 91,
      investigation_priority: 'P1 IMMEDIATE AUDIT ENFORCEMENT',
      energy_source: 'High-Voltage Electrical Energy (11,000 Volts)',
      barrier_status: 'CRITICAL ISOLATION PROTOCOL BYPASSED',
      key_learnings: 'Zero-energy verification must be signed off by a second authorized electrical auditor prior to enclosure door opening.'
    },
    {
      id: 103,
      report_reference: 'SR-CRIT-2026-03',
      report_type: 'Near Miss',
      title: 'High-Pressure Sour Gas Bleed Valve Failure During Flange Torqueing',
      description: 'Flange bolt makeup was attempted on high-pressure sour gas manifold while residual pressure remained trapped at 40 bar behind a passing isolation valve. Valve hiss alerted crew before complete seal breach.',
      location: 'Plant 05 • Wellhead Pad-4',
      facility_unit: 'Gathering Station Manifold',
      report_date: '2026-09-05',
      sif_potential: 'TOXIC H2S ASPHYXIATION & PRESSURE INJECTION POTENTIAL (92%)',
      ai_confidence: 97.2,
      risk_score: 89,
      investigation_priority: 'P1 SHUTDOWN & ISOLATION RE-AUDIT',
      energy_source: 'Pneumatic Pressure & Toxic Chemical Energy',
      barrier_status: 'DOUBLE BLOCK & BLEED BARRIER DEGRADED',
      key_learnings: 'Double block and bleed integrity must be pressure-monitored on digital gauges before mechanical intervention.'
    },
    {
      id: 104,
      report_reference: 'SR-CRIT-2026-04',
      report_type: 'Unsafe Condition',
      title: 'Missing Walkway Grating Void Above Hydrocarbon Separator Level 3',
      description: 'Open void (1.5m x 0.8m) left unprotected on elevated process walkway 8.5 meters above concrete ground. No perimeter tape, hard barrier, or safety harness warning installed during night maintenance.',
      location: 'Plant 02 • Separation Unit',
      facility_unit: 'Level 3 Elevated Walkway',
      report_date: '2026-09-04',
      sif_potential: 'FATAL FALL FROM HEIGHT POTENTIAL (88%)',
      ai_confidence: 93.1,
      risk_score: 86,
      investigation_priority: 'P2 HIGH EXPEDITED CLOSURE',
      energy_source: 'Gravitational Fall Potential',
      barrier_status: 'PHYSICAL WALKWAY BARRIER REMOVED',
      key_learnings: 'Grating removal permits must strictly enforce physical perimeter cage installation before removal begins.'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-100 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
              Strong Reports & Critical Precursors
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Top-ranked high-value observations with acute Serious Injury & Fatality potential requiring chief executive review
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            4 Critical Priority Events
          </span>
        </div>
      </div>

      {/* Deep Dive Cards */}
      <div className="space-y-6">
        {strongReports.map((report) => (
          <div 
            key={report.id}
            className="rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 hover:border-amber-500/40 p-6 shadow-xl space-y-5 transition-all duration-300"
          >
            
            {/* Top Bar with Priority & AI Scores */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="font-mono text-xs font-bold text-amber-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  {report.report_reference}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/40">
                  {report.investigation_priority}
                </span>
                <span className="text-xs text-slate-400">
                  {report.location} • {report.report_date}
                </span>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Risk Score</span>
                  <div className="text-lg font-black font-mono text-rose-400">{report.risk_score} / 100</div>
                </div>
                <div className="text-right pl-3 border-l border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">AI Confidence</span>
                  <div className="text-lg font-black font-mono text-cyan-400">{report.ai_confidence}%</div>
                </div>
              </div>
            </div>

            {/* Headline & Description */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {report.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-2 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800/80">
                {report.description}
              </p>
            </div>

            {/* Key Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase font-mono flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  High-Energy Vector
                </span>
                <div className="text-xs font-medium text-slate-200">{report.energy_source}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 uppercase font-mono flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  Barrier Integrity State
                </span>
                <div className="text-xs font-medium text-slate-200">{report.barrier_status}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono flex items-center gap-1">
                  <AlertOctagon className="w-3 h-3" />
                  SIF Consequence Potential
                </span>
                <div className="text-xs font-medium text-rose-300">{report.sif_potential}</div>
              </div>
            </div>

            {/* Bottom Action & Key Learnings */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="text-slate-300">
                <strong className="text-amber-400">Engineering Mandate:</strong> {report.key_learnings}
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(report)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black text-xs shadow-md shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <span>Examine SIF Barrier Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {selectedReport && (
        <FullAnalysisModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}

    </div>
  );
}
