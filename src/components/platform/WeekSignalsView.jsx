import React from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  ArrowRight,
  ShieldAlert,
  Flame,
  Zap,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

export default function WeekSignalsView() {
  // Weekly Risk Trajectory Data (Weeks 1 to 4)
  const weeklyTrendData = [
    { week: 'Wk 33', overall: 68, sifPrecursors: 32, nearMisses: 45 },
    { week: 'Wk 34', overall: 72, sifPrecursors: 38, nearMisses: 52 },
    { week: 'Wk 35', overall: 79, sifPrecursors: 46, nearMisses: 49 },
    { week: 'Wk 36 (Current)', overall: 84, sifPrecursors: 54, nearMisses: 61 },
  ];

  // Site comparison data
  const siteComparisonData = [
    { site: 'Plant 01', precursors: 12, weekChange: '-8%', status: 'Improving' },
    { site: 'Plant 02', precursors: 18, weekChange: '+4%', status: 'Stable' },
    { site: 'Plant 03', precursors: 31, weekChange: '+22%', status: 'Spike Detected' },
    { site: 'Plant 04', precursors: 14, weekChange: '-3%', status: 'Improving' },
    { site: 'Plant 05', precursors: 21, weekChange: '+11%', status: 'Elevated' },
  ];

  // Top emerging hazards this week
  const emergingHazards = [
    {
      title: 'Overhead Crane Rigging Tension Shifts',
      vector: 'Gravity & Suspended Load',
      change: '+28% observations',
      severity: 'Critical',
      site: 'Plant 03 Heavy Fabrication',
      action: 'Mandate rigging inspection and clear drop-zone perimeter.'
    },
    {
      title: 'Temporary Scaffold Deck Gaps',
      vector: 'Working at Height',
      change: '+14% observations',
      severity: 'High',
      site: 'Plant 02 Process Platform',
      action: 'Lockout uncertified scaffold bays and install toe-boards.'
    },
    {
      title: 'Bleed Valve Verification Bypass',
      vector: 'Pneumatic / Hydrocarbon Pressure',
      change: '+9% observations',
      severity: 'Critical',
      site: 'Plant 01 Gathering Station',
      action: 'Re-audit Lock-Out/Tag-Out positive zero-energy procedures.'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0B1220]/95 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs space-y-1">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1">{label} Telemetry</div>
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
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
              Weekly Safety Signals Intelligence
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Week-over-week precursor dynamics, weak signal clustering, and high-frequency hazard shifts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            Reporting Window: Week 36 (Sep 1 - Sep 6, 2026)
          </span>
        </div>
      </div>

      {/* Week Overview KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Weekly Precursor Events</div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">95</div>
          <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% vs last week</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Critical SIF Near-Misses</div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">11</div>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+2 events vs last week</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Barrier Degradation Index</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">22.4%</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold mt-2">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-3.1% positive trend</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase">Active Plant Attention</div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-1">Plant 03</div>
          <div className="text-xs text-rose-400 font-bold mt-2">
            31 Precursors (+22% spike)
          </div>
        </div>

      </div>

      {/* 4-Week Trend Chart & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trend Area Chart (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">4-Week Trajectory: Overall vs SIF Precursors</h3>
              <p className="text-xs text-slate-400 mt-0.5">Clustering pattern showing early week elevation</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                Overall Risk
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                SIF Precursors
              </span>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="wkOverallGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="wkSifGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="week" stroke="#64748B" fontSize={12} tickLine={false} axisLine={{ stroke: '#1E293B' }} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={{ stroke: '#1E293B' }} domain={[0, 100]} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="overall" name="Overall Risk" stroke="#06B6D4" strokeWidth={2.5} fill="url(#wkOverallGrad)" />
                <Area type="monotone" dataKey="sifPrecursors" name="SIF Precursors" stroke="#EF4444" strokeWidth={2.5} fill="url(#wkSifGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI-Generated Weekly Insights (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-gradient-to-br from-[#121B33] via-[#0E1628] to-[#0A101D] border border-amber-500/30 p-6 flex flex-col justify-between shadow-xl space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-amber-500/20">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Weekly Insights</h3>
                <div className="text-[10px] text-amber-400 font-mono">Neural cluster summary</div>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong className="text-rose-400">Primary Signal:</strong> Unbarricaded lifting operations in Plant 03 represent 42% of all SIF precursors detected this week.
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong className="text-amber-400">Shift Pattern:</strong> 68% of near-misses occurred during afternoon shift handovers (14:00 - 16:30), correlating with reduced supervisor walkdowns.
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <strong className="text-emerald-400">Positive Trend:</strong> Confined space gas test compliance in Plant 01 improved to 98% with zero unverified entries.
              </div>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-500 font-mono text-center">
            Synthesis generated from 342 raw inputs
          </div>
        </div>

      </div>

      {/* Top Emerging Hazards & Site Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Emerging Hazards (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Top Emerging Hazards (Week 36)</h3>
              <p className="text-xs text-slate-400 mt-0.5">High-velocity risk shifts requiring preventive action</p>
            </div>
            <span className="text-xs font-mono text-rose-400 font-bold">3 Priority Vectors</span>
          </div>

          <div className="space-y-3">
            {emergingHazards.map((hz, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white">{hz.title}</h4>
                    <div className="text-[11px] text-slate-400 mt-0.5">{hz.vector} • {hz.site}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                    {hz.change}
                  </span>
                </div>
                <p className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                  Target Control: {hz.action}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Site Comparison Table (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Facility Week-over-Week</h3>
              <p className="text-xs text-slate-400 mt-0.5">Precursor frequency across refineries</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">All Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="py-2.5">Site</th>
                  <th className="py-2.5">SIF Events</th>
                  <th className="py-2.5">Change</th>
                  <th className="py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {siteComparisonData.map((st) => (
                  <tr key={st.site} className="hover:bg-slate-900/40">
                    <td className="py-3 font-bold text-white">{st.site}</td>
                    <td className="py-3 font-mono text-slate-200">{st.precursors}</td>
                    <td className={`py-3 font-mono font-bold ${
                      st.weekChange.startsWith('+') ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {st.weekChange}
                    </td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        st.status === 'Spike Detected' 
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                          : st.status === 'Elevated'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {st.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
