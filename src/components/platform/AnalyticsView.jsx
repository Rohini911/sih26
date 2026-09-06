import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Activity,
  Layers,
  MapPin,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

export default function AnalyticsView() {
  // Monthly Incident vs Near Miss vs SIF Precursor Trend
  const monthlyComparison = [
    { month: 'Jan', totalIncidents: 12, nearMisses: 48, sifPrecursors: 28 },
    { month: 'Feb', totalIncidents: 14, nearMisses: 56, sifPrecursors: 32 },
    { month: 'Mar', totalIncidents: 9, nearMisses: 62, sifPrecursors: 29 },
    { month: 'Apr', totalIncidents: 16, nearMisses: 74, sifPrecursors: 38 },
    { month: 'May', totalIncidents: 11, nearMisses: 81, sifPrecursors: 42 },
    { month: 'Jun', totalIncidents: 8, nearMisses: 89, sifPrecursors: 46 },
    { month: 'Jul', totalIncidents: 6, nearMisses: 94, sifPrecursors: 51 },
  ];

  // Site Benchmark Scores & Hazard Frequency
  const plantBenchmarkData = [
    { site: 'Plant 01', safetyScore: 94, criticalHazards: 12, compliance: 96 },
    { site: 'Plant 02', safetyScore: 89, criticalHazards: 18, compliance: 92 },
    { site: 'Plant 03', safetyScore: 76, criticalHazards: 31, compliance: 84 },
    { site: 'Plant 04', safetyScore: 92, criticalHazards: 14, compliance: 95 },
    { site: 'Plant 05', safetyScore: 86, criticalHazards: 21, compliance: 89 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0B1220]/95 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs space-y-1">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1">{label} Metric</div>
          {payload.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2" style={{ color: item.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.name}: <strong className="text-white">{item.value}</strong></span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-100 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
              Safety Telemetry Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise analytics, multi-plant benchmarking, and predictive incident trajectory modeling
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Historical Ingestion: 7 Months
          </span>
        </div>
      </div>

      {/* KPI Top Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400">Total Observations</span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">12,450</div>
          <span className="text-xs text-emerald-400 font-bold mt-1 inline-block">+12.8% reporting culture</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400">Total Recordable Injury Rate (TRIR)</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">0.14</div>
          <span className="text-xs text-emerald-400 font-bold mt-1 inline-block">-28% vs industry average</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400">Near-Miss to SIF Ratio</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">6.8 : 1</div>
          <span className="text-xs text-slate-400 font-medium mt-1 inline-block">Healthy weak-signal capture</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800">
          <span className="text-[11px] font-bold uppercase text-slate-400">Composite Safety Score</span>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">91.4%</div>
          <span className="text-xs text-cyan-400 font-bold mt-1 inline-block">Top quartile performance</span>
        </div>
      </div>

      {/* Chart 1: Incident vs Near Miss vs SIF Precursor Trend */}
      <div className="rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Incident Severity & Precursor Evolution (Jan - Jul)</h3>
            <p className="text-xs text-slate-400 mt-0.5">Demonstrating proactive reporting increase while severe incidents decline</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Incidents
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              Near Misses
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              SIF Precursors
            </span>
          </div>
        </div>

        <div className="w-full h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="nearGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="precurGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={{ stroke: '#1E293B' }} />
              <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={{ stroke: '#1E293B' }} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="totalIncidents" name="Incidents" stroke="#EF4444" strokeWidth={2} fill="url(#incGrad)" />
              <Area type="monotone" dataKey="nearMisses" name="Near Misses" stroke="#06B6D4" strokeWidth={2} fill="url(#nearGrad)" />
              <Area type="monotone" dataKey="sifPrecursors" name="SIF Precursors" stroke="#F59E0B" strokeWidth={2} fill="url(#precurGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Cross-Plant Benchmarking & AI Analytics Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Plant Comparison Bar Chart (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Plant Safety Performance Index</h3>
              <p className="text-xs text-slate-400 mt-0.5">Comparative scoring (0-100) vs identified critical hazards</p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold">5 Facilities</span>
          </div>

          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={plantBenchmarkData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="site" stroke="#64748B" fontSize={12} tickLine={false} axisLine={{ stroke: '#1E293B' }} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={{ stroke: '#1E293B' }} domain={[0, 100]} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="safetyScore" name="Safety Score" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                <Bar dataKey="compliance" name="Compliance %" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Predictive Analytics Insights (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-[#121B33] via-[#0E1628] to-[#0A101D] border border-cyan-500/30 p-6 flex flex-col justify-between shadow-xl space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-cyan-500/20">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Predictive Safety Insights</h3>
                <div className="text-[10px] text-cyan-400 font-mono">Neural forecast engine</div>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong className="text-cyan-300">Lead Indicator Correlation:</strong> Analysis of 12,450 reports demonstrates that facilities maintaining a near-miss reporting velocity of &gt;50/month experience 72% fewer actual lost-time injuries.
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong className="text-rose-400">High Risk Hotspot:</strong> Heavy rigging operations in Plant 03 account for 44% of potential crane excursion events. Automated exclusion laser boundaries recommended.
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong className="text-emerald-400">CAPA Effectiveness:</strong> Actions closed within 7 days showed a 91% zero-recurrence rate over a 90-day post-audit window.
              </div>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-500 font-mono text-center border-t border-slate-800">
            Algorithmic confidence: 94.7% • Model verified
          </div>
        </div>

      </div>

    </div>
  );
}
