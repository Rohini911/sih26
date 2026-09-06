import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  ChevronRight, 
  MapPin, 
  FileText,
  Sparkles,
  Eye,
  AlertTriangle,
  Calendar,
  X
} from 'lucide-react';
import FullAnalysisModal from './FullAnalysisModal';

export default function AllReportsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [siteFilter, setSiteFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReport, setSelectedReport] = useState(null);

  // 10 Comprehensive Oil & Gas safety reports
  const initialReports = [
    {
      id: 1,
      report_reference: 'REP-ID001-0001',
      report_type: 'Near Miss',
      description: 'Crane hoisting 4-inch heavy flange at 18m elevation. Rigging wire slipped and dropped flange 2m away from roughnecks. Exclusion zone barricades missing.',
      location: 'Plant 03',
      facility_unit: 'Drilling Rig 04 Derrick Floor',
      report_date: '2026-09-06',
      risk_level: 'Critical',
      sif_precursor_assessment: 'YES',
      ai_score: 94,
      status: 'Action Required',
      identified_hazard: 'Suspended Load & Dropped Object Hazard',
      energy_source: 'Gravity (18m elevation drop potential energy)',
      barrier_status: 'CRITICAL BARRIER FAILED',
      recommended_action: 'Erect physical drop-zone barricade and re-certify rigging slings.'
    },
    {
      id: 2,
      report_reference: 'REP-ID001-0002',
      report_type: 'Unsafe Act',
      description: 'Maintenance tech entered 11kV substation switchgear room without conducting Lock-Out/Tag-Out (LOTO) or verifying zero-energy state.',
      location: 'Plant 01',
      facility_unit: 'Main Substation A',
      report_date: '2026-09-06',
      risk_level: 'Critical',
      sif_precursor_assessment: 'YES',
      ai_score: 91,
      status: 'Under Investigation',
      identified_hazard: 'Electrical Arc Flash & Shock Hazard',
      energy_source: 'Electrical Energy (11kV Live Switchgear)',
      barrier_status: 'BARRIER MISSING',
      recommended_action: 'Immediate stop-work; enforce strict Lock-Out/Tag-Out (LOTO).'
    },
    {
      id: 3,
      report_reference: 'REP-ID001-0003',
      report_type: 'Unsafe Condition',
      description: 'Missing grating section (1.5m x 0.8m) on high elevation walkway above hydrocarbon separation vessel. Void left unbarricaded.',
      location: 'Plant 02',
      facility_unit: 'Separation Unit Level 3 Walkway',
      report_date: '2026-09-06',
      risk_level: 'High',
      sif_precursor_assessment: 'YES',
      ai_score: 86,
      status: 'Action Required',
      identified_hazard: 'Fall from Height Hazard',
      energy_source: 'Gravity (8.5m elevation void)',
      barrier_status: 'BARRIER MISSING',
      recommended_action: 'Install heavy steel grating and rigid guardrails immediately.'
    },
    {
      id: 4,
      report_reference: 'REP-ID001-0004',
      report_type: 'Unsafe Act',
      description: 'Forklift operator driving with elevated 1.2-ton pallet into blind logistics corridor without sounding horn; pedestrian stepped back just in time.',
      location: 'Plant 04',
      facility_unit: 'Central Logistics Yard',
      report_date: '2026-09-05',
      risk_level: 'High',
      sif_precursor_assessment: 'YES',
      ai_score: 82,
      status: 'Verified',
      identified_hazard: 'Vehicle-Pedestrian Interaction',
      energy_source: 'Kinetic Dynamic Mass',
      barrier_status: 'BARRIER DEFICIENT',
      recommended_action: 'Install convex mirrors and pedestrian barrier gates.'
    },
    {
      id: 5,
      report_reference: 'REP-ID001-0005',
      report_type: 'Near Miss',
      description: 'Nitrogen purge line disconnected during reactor depressurization at 6 bar residual pressure. Whipping hose struck guardrail.',
      location: 'Plant 05',
      facility_unit: 'Reformer Unit Bay 2',
      report_date: '2026-09-05',
      risk_level: 'Critical',
      sif_precursor_assessment: 'YES',
      ai_score: 89,
      status: 'Under Investigation',
      identified_hazard: 'Pneumatic Pressure Energy Release',
      energy_source: 'Compressed Gas Energy',
      barrier_status: 'BARRIER FAILED',
      recommended_action: 'Install whip-checks and enforce zero-energy bleed procedure.'
    },
    {
      id: 6,
      report_reference: 'REP-ID001-0006',
      report_type: 'Unsafe Condition',
      description: 'Oxygen deficiency monitor in condensate pump sump was out of calibration by 14 months with no daily bump test log.',
      location: 'Plant 03',
      facility_unit: 'Condensate Sump Pit',
      report_date: '2026-09-04',
      risk_level: 'Critical',
      sif_precursor_assessment: 'YES',
      ai_score: 93,
      status: 'Action Required',
      identified_hazard: 'Confined Space / Asphyxiation Hazard',
      energy_source: 'Toxic / Asphyxiant Atmosphere',
      barrier_status: 'CRITICAL BARRIER DEGRADED',
      recommended_action: 'Recalibrate gas detectors and halt confined space entry permits.'
    },
    {
      id: 7,
      report_reference: 'REP-ID001-0007',
      report_type: 'Safety Observation',
      description: 'Scaffolding toe-board dislodged on pipe rack Level 2; potential dropped object path over secondary pump bay.',
      location: 'Plant 01',
      facility_unit: 'Process Unit Pipe Rack',
      report_date: '2026-09-04',
      risk_level: 'Medium',
      sif_precursor_assessment: 'NO',
      ai_score: 54,
      status: 'Verified',
      identified_hazard: 'Dropped Hand Tool Hazard',
      energy_source: 'Minor Gravity Potential',
      barrier_status: 'BARRIER DEFICIENT',
      recommended_action: 'Fasten toe-board clamp and inspect scaffolding tag.'
    },
    {
      id: 8,
      report_reference: 'REP-ID001-0008',
      report_type: 'Safety Observation',
      description: 'Chemical drip tray under lube oil drum found with 1 liter oil accumulation; secondary containment valve closed properly.',
      location: 'Plant 02',
      facility_unit: 'Compressor House Bay A',
      report_date: '2026-09-03',
      risk_level: 'Low',
      sif_precursor_assessment: 'NO',
      ai_score: 24,
      status: 'Verified',
      identified_hazard: 'Environmental Housekeeping Defect',
      energy_source: 'Chemical Spillage',
      barrier_status: 'BARRIER FUNCTIONAL',
      recommended_action: 'Drain drip tray and replace drum tap gasket.'
    }
  ];

  const filteredReports = initialReports.filter((r) => {
    // Search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = r.report_reference.toLowerCase().includes(q) ||
                    r.description.toLowerCase().includes(q) ||
                    r.location.toLowerCase().includes(q) ||
                    r.identified_hazard.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Risk Filter
    if (riskFilter !== 'ALL' && r.risk_level.toLowerCase() !== riskFilter.toLowerCase()) {
      return false;
    }

    // Type Filter
    if (typeFilter !== 'ALL' && r.report_type.toLowerCase() !== typeFilter.toLowerCase()) {
      return false;
    }

    // Site Filter
    if (siteFilter !== 'ALL' && r.location.toLowerCase() !== siteFilter.toLowerCase()) {
      return false;
    }

    // Status Filter
    if (statusFilter !== 'ALL' && r.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }

    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-100 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
              Safety Observation & Incident Records
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise database of audited field reports with neural energy vector ratings and precursor status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 font-medium">
            Showing <strong className="text-amber-400">{filteredReports.length}</strong> of {initialReports.length} records
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Report ID, description, hazard, or plant unit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            
            {/* Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="Critical">Critical Risk</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Event Types</option>
              <option value="Near Miss">Near Miss</option>
              <option value="Unsafe Act">Unsafe Act</option>
              <option value="Unsafe Condition">Unsafe Condition</option>
              <option value="Safety Observation">Safety Observation</option>
            </select>

            {/* Site Filter */}
            <select
              value={siteFilter}
              onChange={(e) => setSiteFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Sites</option>
              <option value="Plant 01">Plant 01</option>
              <option value="Plant 02">Plant 02</option>
              <option value="Plant 03">Plant 03</option>
              <option value="Plant 04">Plant 04</option>
              <option value="Plant 05">Plant 05</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Action Required">Action Required</option>
              <option value="Under Investigation">Under Investigation</option>
              <option value="Verified">Verified</option>
            </select>

          </div>

        </div>
      </div>

      {/* Reports Table */}
      <div className="rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">Report ID</th>
                <th className="py-3 px-3">Report Summary</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Risk Level</th>
                <th className="py-3 px-3">AI Score</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredReports.map((report) => (
                <tr 
                  key={report.id} 
                  className="hover:bg-slate-900/50 transition-colors group cursor-pointer"
                  onClick={() => setSelectedReport(report)}
                >
                  <td className="py-3.5 px-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                    {report.report_reference}
                  </td>
                  <td className="py-3.5 px-3 text-slate-200 max-w-xs truncate">
                    {report.description}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                      {report.report_type}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap">
                    {report.location}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    {report.risk_level === 'Critical' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        Critical
                      </span>
                    )}
                    {report.risk_level === 'High' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40">
                        High
                      </span>
                    )}
                    {report.risk_level === 'Medium' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40">
                        Medium
                      </span>
                    )}
                    {report.risk_level === 'Low' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-800 text-slate-400 border border-slate-700">
                        Low
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold whitespace-nowrap">
                    <span className={report.ai_score >= 80 ? 'text-rose-400' : 'text-emerald-400'}>
                      {report.ai_score}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      report.status === 'Action Required' 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                        : report.status === 'Under Investigation'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {report.report_date}
                  </td>
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReport(report);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-300 font-bold transition-all text-[11px] cursor-pointer"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Analysis Modal */}
      {selectedReport && (
        <FullAnalysisModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}

    </div>
  );
}
