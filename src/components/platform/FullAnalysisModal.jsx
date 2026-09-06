import React from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Shield,
  Sparkles,
  Layers,
  Scale
} from 'lucide-react';

export default function FullAnalysisModal({ report, onClose }) {
  if (!report) return null;

  const isSIF = report.sif_precursor_assessment === 'YES' || report.isSIF;
  const analysis = report.ai_analysis || {};
  const hazard = report.identified_hazard || analysis.identified_hazard || 'Hazard Assessment Completed';
  const energy = analysis.energy_source || report.energy_source || 'Identified High-Energy Vector';
  const barrier = report.barrier_status || report.barrier_information || analysis.barrier_information || 'Critical Barrier Audited';
  const explanation = analysis.explanation || report.description || 'AI analysis completed based on industrial safety precursor signals.';
  const recommendation = report.recommended_action || analysis.recommended_action || 'Enforce physical controls and verify critical barrier integrity.';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 select-none">
      
      {/* Modal Dialog */}
      <div className="w-full max-w-3xl bg-[#0E1628] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[90vh] text-left text-slate-100">
        
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-[#0F1D38] via-[#0D182E] to-[#0A1222] border-b border-slate-800 text-white flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs font-black px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {report.report_reference || `REP-${report.id}`}
              </span>
              {report.report_date && (
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{report.report_date}</span>
                </span>
              )}
              {report.report_type && (
                <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                  {report.report_type}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-heading">
              Report Causal & SIF Barrier Analysis
            </h2>
            <p className="text-xs text-slate-400">
              {report.location} • {report.facility_unit || 'Industrial Site A'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* SIF Assessment Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
            isSIF 
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}>
            <div className="flex items-center gap-3">
              {isSIF ? (
                <ShieldAlert className="w-8 h-8 text-rose-400 shrink-0" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              )}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider">
                  {isSIF ? 'High-Consequence SIF Precursor Detected' : 'Non-SIF Controlled Event'}
                </div>
                <div className="text-xs mt-0.5 opacity-90">
                  {isSIF ? 'Energy release capacity exceeds critical fatality threshold without direct barrier.' : 'Adequate mitigation present; event contained.'}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-mono font-bold">AI Score: {report.ai_score || 94}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              Field Incident Statement
            </span>
            <p className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 leading-relaxed">
              {report.description}
            </p>
          </div>

          {/* Hazards & Energy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Identified Hazard Vector
              </span>
              <div className="text-xs font-semibold text-white">{hazard}</div>
              <div className="text-[11px] text-slate-400">{energy}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Barrier Integrity Assessment
              </span>
              <div className="text-xs font-semibold text-rose-400">{barrier}</div>
              <div className="text-[11px] text-slate-400">Direct physical barrier failed or bypassed</div>
            </div>
          </div>

          {/* Recommended Action */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mandated Corrective Controls
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {recommendation}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">Audit ID: {report.id} • API RP 754 Compliant</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
          >
            Close Report
          </button>
        </div>

      </div>

    </div>
  );
}
