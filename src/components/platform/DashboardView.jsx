import React, { useState } from 'react';
import { 
  FileText, 
  Zap, 
  AlertTriangle, 
  Cpu, 
  CheckSquare, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  AlertOctagon, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  ShieldAlert,
  ArrowUpRight,
  Activity,
  CheckCircle2,
  Clock,
  ChevronDown,
  Lightbulb,
  Layers,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function DashboardView({ onNavigate }) {
  const [trendRange, setTrendRange] = useState('Last 7 Months');

  const handleNav = (path) => {
    if (onNavigate) onNavigate(path);
  };

  // 7 Months Risk Overview Data (Overall Safety vs SIF Risk)
  const riskOverviewData = [
    { month: 'Jan', overallSafety: 48, sifRisk: 34 },
    { month: 'Feb', overallSafety: 56, sifRisk: 38 },
    { month: 'Mar', overallSafety: 59, sifRisk: 36 },
    { month: 'Apr', overallSafety: 68, sifRisk: 42 },
    { month: 'May', overallSafety: 76, sifRisk: 48 },
    { month: 'Jun', overallSafety: 81, sifRisk: 55 },
    { month: 'Jul', overallSafety: 87, sifRisk: 62 },
  ];

  // SIF Precursor Distribution Donut Data (Strictly matching reference: Red, Orange, Cyan, Teal, Blue, Slate)
  const precursorDistributionData = [
    { name: 'Line of Fire', value: 28, count: 510, color: '#EF4444' },
    { name: 'Energy Isolation', value: 21, count: 382, color: '#F97316' },
    { name: 'Working at Height', value: 17, count: 309, color: '#06B6D4' },
    { name: 'Lifting Operations', value: 13, count: 237, color: '#10B981' },
    { name: 'Confined Space', value: 9, count: 164, color: '#3B82F6' },
    { name: 'Other', value: 12, count: 218, color: '#64748B' },
  ];

  // 4 Critical Alerts for Dashboard Center Card
  const summaryAlerts = [
    {
      id: 'ALT-101',
      severity: 'CRITICAL',
      title: 'Worker exposed to suspended load',
      location: 'Plant 03 • Crane Operations',
      riskScore: 94,
      timeAgo: '8 min ago'
    },
    {
      id: 'ALT-102',
      severity: 'CRITICAL',
      title: 'Energy isolation control not verified',
      location: 'Plant 01 • Maintenance',
      riskScore: 91,
      timeAgo: '24 min ago'
    },
    {
      id: 'ALT-103',
      severity: 'HIGH',
      title: 'Fall protection gap detected',
      location: 'Plant 02 • Work at Height',
      riskScore: 86,
      timeAgo: '42 min ago'
    },
    {
      id: 'ALT-104',
      severity: 'HIGH',
      title: 'Vehicle-pedestrian interaction risk',
      location: 'Plant 04 • Logistics',
      riskScore: 82,
      timeAgo: '1 hr ago'
    }
  ];

  // Latest 5 Recent Safety Reports
  const summaryReports = [
    {
      id: 'SR-2026-1245',
      type: 'Near Miss',
      location: 'Plant 03',
      risk: 'High',
      score: 94,
      status: 'Open'
    },
    {
      id: 'SR-2026-1244',
      type: 'Unsafe Condition',
      location: 'Plant 01',
      risk: 'Critical',
      score: 91,
      status: 'Open'
    },
    {
      id: 'SR-2026-1243',
      type: 'Unsafe Act',
      location: 'Plant 02',
      risk: 'High',
      score: 86,
      status: 'Under Review'
    },
    {
      id: 'SR-2026-1242',
      type: 'Safety Observation',
      location: 'Plant 04',
      risk: 'Medium',
      score: 78,
      status: 'Closed'
    },
    {
      id: 'SR-2026-1241',
      type: 'Near Miss',
      location: 'Plant 05',
      risk: 'Medium',
      score: 74,
      status: 'Closed'
    }
  ];

  // Custom Dark Tooltip for Risk Chart (Amber/Gold & Cyan/Blue)
  const CustomRiskTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#051423]/95 backdrop-blur-md border border-slate-700/80 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1">{label} Exposure</div>
          <div className="flex items-center gap-2 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Overall Safety: <strong className="text-white">{payload[0]?.value}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>SIF Risk: <strong className="text-white">{payload[1]?.value}</strong></span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomPrecursorTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#051423]/95 backdrop-blur-md border border-slate-700/80 p-2 rounded-xl shadow-xl text-xs">
          <div className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
            {data.name}
          </div>
          <div className="text-slate-300 mt-0.5">
            <strong>{data.value}%</strong> ({data.count} Precursors)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-5 lg:p-6 space-y-4 max-w-[1680px] mx-auto text-slate-100 animate-in fade-in duration-200 select-none">

      {/* ================= 1. REFINERY HERO BANNER (MATCHING REFERENCE IMAGE) ================= */}
      {/* Refinery image/video is strictly positioned on the RIGHT side of the banner with smooth fade to navy */}
      <section className="relative overflow-hidden rounded-2xl bg-[#071322] border border-slate-800/80 shadow-2xl min-h-[175px] flex items-center">
        
        {/* RIGHT SIDE: Industrial Refinery Visual from existing project assets */}
        <div className="absolute right-0 top-0 bottom-0 w-full sm:w-3/5 md:w-1/2 lg:w-7/12 pointer-events-none select-none overflow-hidden">
          <video
            src="/assets/videos/hero-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-right sm:object-center opacity-80"
          />
          {/* Subtle gradient overlays to seamlessly blend into deep navy card background on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071322] via-[#071322]/80 to-transparent w-3/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071322]/80 via-transparent to-[#071322]/40" />
          <div className="absolute inset-0 bg-[#071322]/20" />
        </div>

        {/* LEFT SIDE: Safety Intelligence Content */}
        <div className="relative z-10 w-full lg:w-3/5 p-5 sm:p-7 flex flex-col justify-center space-y-2.5">
          <div className="flex items-start gap-3.5">
            {/* Golden Shield Icon */}
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
              <ShieldCheck className="w-6 h-6 text-amber-400 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <div className="text-[10.5px] font-black uppercase tracking-widest text-amber-400 font-mono">
                SAFETY INTELLIGENCE
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-[26px] font-black font-heading text-white tracking-tight leading-tight">
                Detect Risk Before It Becomes an Incident
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                AI-powered safety intelligence for identifying Serious Injury &amp; Fatality precursors before they escalate.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1 pl-[58px]">
            <button
              onClick={() => handleNav('/ai-analysis')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-extrabold shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Analyze Safety Report</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={() => handleNav('/critical-alerts')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#091626]/90 hover:bg-[#0e213a] text-slate-200 hover:text-white text-xs sm:text-sm font-semibold border border-slate-700/80 hover:border-slate-600 transition-all cursor-pointer backdrop-blur-sm"
            >
              <span>View Critical Alerts</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================= 2. SIX KPI CARDS (SINGLE ROW WITH SPARKLINES) ================= */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
        
        {/* KPI 1: TOTAL SAFETY REPORTS */}
        <div 
          onClick={() => handleNav('/reports')}
          className="group rounded-2xl bg-[#061424]/90 backdrop-blur-md border border-slate-800/80 hover:border-amber-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">
              Total Safety Reports
            </span>
            <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-black text-white font-heading tracking-tight">
              12,450
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                +12.8%
              </span>
              <span className="text-[9.5px] text-slate-500">vs last month</span>
            </div>
            {/* Green Sparkline */}
            <svg className="w-14 h-6 text-emerald-400 shrink-0" viewBox="0 0 60 24" fill="none">
              <path d="M2 18 L14 15 L26 19 L38 9 L50 11 L58 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* KPI 2: SIF PRECURSORS */}
        <div 
          onClick={() => handleNav('/sif-precursors')}
          className="group rounded-2xl bg-[#061424]/90 backdrop-blur-md border border-slate-800/80 hover:border-rose-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">
              SIF Precursors
            </span>
            <div className="w-6 h-6 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-black text-white font-heading tracking-tight">
              1,820
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                +8.4%
              </span>
              <span className="text-[9.5px] text-slate-500">detected by AI</span>
            </div>
            {/* Red Sparkline */}
            <svg className="w-14 h-6 text-rose-500 shrink-0" viewBox="0 0 60 24" fill="none">
              <path d="M2 19 L15 17 L27 12 L39 16 L49 8 L58 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* KPI 3: CRITICAL RISKS */}
        <div 
          onClick={() => handleNav('/critical-alerts')}
          className="group rounded-2xl bg-[#061424]/90 backdrop-blur-md border border-slate-800/80 hover:border-amber-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">
              Critical Risks
            </span>
            <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-black text-white font-heading tracking-tight">
              38
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" />
                -14.2%
              </span>
              <span className="text-[9.5px] text-slate-500">vs last month</span>
            </div>
            {/* Amber Sparkline */}
            <svg className="w-14 h-6 text-amber-400 shrink-0" viewBox="0 0 60 24" fill="none">
              <path d="M2 20 L16 16 L28 17 L40 10 L50 12 L58 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* KPI 4: AI CONFIDENCE */}
        <div 
          onClick={() => handleNav('/ai-analysis')}
          className="group rounded-2xl bg-[#061424]/90 backdrop-blur-md border border-slate-800/80 hover:border-blue-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">
              AI Confidence
            </span>
            <div className="w-6 h-6 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-black text-white font-heading tracking-tight">
              94.7%
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                +2.1%
              </span>
              <span className="text-[9.5px] text-slate-500">average confidence</span>
            </div>
            {/* Cyan Sparkline */}
            <svg className="w-14 h-6 text-cyan-400 shrink-0" viewBox="0 0 60 24" fill="none">
              <path d="M2 17 L14 14 L26 15 L38 8 L48 9 L58 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* KPI 5: OPEN ACTIONS */}
        <div 
          onClick={() => handleNav('/corrective-actions')}
          className="group rounded-2xl bg-[#061424]/90 backdrop-blur-md border border-slate-800/80 hover:border-cyan-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">
              Open Actions
            </span>
            <div className="w-6 h-6 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center">
              <CheckSquare className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-black text-white font-heading tracking-tight">
              126
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-amber-400">
                18 overdue
              </span>
              <span className="text-[9.5px] text-slate-500">active CAPA</span>
            </div>
            {/* Teal Sparkline */}
            <svg className="w-14 h-6 text-teal-400 shrink-0" viewBox="0 0 60 24" fill="none">
              <path d="M2 18 L15 19 L27 13 L39 15 L50 7 L58 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* KPI 6: SAFETY SCORE */}
        <div 
          onClick={() => handleNav('/analytics')}
          className="group rounded-2xl bg-[#061424]/90 backdrop-blur-md border border-slate-800/80 hover:border-emerald-500/40 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">
              Safety Score
            </span>
            <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-black text-white font-heading tracking-tight">
              91.4%
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                +5.6%
              </span>
              <span className="text-[9.5px] text-slate-500">organization score</span>
            </div>
            {/* Green Sparkline */}
            <svg className="w-14 h-6 text-emerald-400 shrink-0" viewBox="0 0 60 24" fill="none">
              <path d="M2 19 L15 16 L27 18 L39 11 L49 12 L58 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

      </section>

      {/* ================= 3. MAIN ANALYTICS ROW (3-COLUMN BALANCED STRUCTURE) ================= */}
      {/* 5 cols / 3.5 cols / 3.5 cols */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* 1. Safety / Risk Trend (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#061424]/90 backdrop-blur-md border border-slate-800/80 p-4 sm:p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-white tracking-tight">
                  Safety / Risk Trend
                </h3>
                <p className="text-[10.5px] text-slate-400">Overall safety performance trend</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[10.5px] px-2.5 py-1 rounded-lg bg-[#081729] border border-slate-700/80 text-slate-300">
                <span>Last 7 Months</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="w-full h-48 sm:h-52 pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskOverviewData} margin={{ top: 10, right: 25, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="overallGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="sifGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#17263C" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={{ stroke: '#17263C' }} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={{ stroke: '#17263C' }} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} />
                <RechartsTooltip content={<CustomRiskTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="overallSafety" 
                  stroke="#F59E0B" 
                  strokeWidth={2.5} 
                  fill="url(#overallGrad)" 
                  dot={{ fill: '#F59E0B', r: 3 }}
                  activeDot={{ r: 5, fill: '#F59E0B', stroke: '#fff', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sifRisk" 
                  stroke="#06B6D4" 
                  strokeWidth={2.5} 
                  fill="url(#sifGrad)" 
                  dot={{ fill: '#06B6D4', r: 3 }}
                  activeDot={{ r: 5, fill: '#06B6D4', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom Chart Legend */}
          <div className="flex items-center gap-4 pt-2 border-t border-slate-800/70 text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" />
              Overall Safety
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 inline-block" />
              SIF Risk
            </span>
          </div>
        </div>

        {/* 2. SIF Precursor Distribution (3.5 cols) */}
        <div className="lg:col-span-3 rounded-2xl bg-[#061424]/90 backdrop-blur-md border border-slate-800/80 p-4 sm:p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading text-white tracking-tight">
                  SIF Precursor Distribution
                </h3>
                <p className="text-[10.5px] text-slate-400">Total precursors by category</p>
              </div>
            </div>
          </div>

          {/* Donut Chart & Side Legend */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-1">
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip content={<CustomPrecursorTooltip />} />
                  <Pie
                    data={precursorDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={58}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {precursorDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#061424" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black text-white font-heading">1,820</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Total Precursors</span>
              </div>
            </div>

            {/* Vertical Legend on Right */}
            <div className="flex-1 space-y-1.5 text-[11px] w-full">
              {precursorDistributionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-2 text-slate-300">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="truncate text-slate-300 text-[10.5px]">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-200 text-[11px]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Critical Alert Center (3.5 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#061424]/90 backdrop-blur-md border border-slate-800/80 p-4 sm:p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                <AlertOctagon className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold font-heading text-white tracking-tight">
                Critical Alert Center
              </h3>
            </div>
            <button 
              onClick={() => handleNav('/critical-alerts')}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {summaryAlerts.map((alert) => (
              <div 
                key={alert.id}
                onClick={() => handleNav('/critical-alerts')}
                className="p-2.5 rounded-xl bg-[#081729]/80 hover:bg-[#0c223d] border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shrink-0 ${
                    alert.severity === 'CRITICAL' 
                      ? 'bg-rose-500 text-white font-bold' 
                      : 'bg-amber-500 text-slate-950 font-bold'
                  }`}>
                    {alert.severity}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">{alert.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{alert.location}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[11px] font-mono font-bold text-rose-400">Risk {alert.riskScore}</div>
                  <div className="text-[9.5px] text-slate-500">{alert.timeAgo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ================= 4. LOWER SECTION (3-COLUMN BALANCED STRUCTURE) ================= */}
      {/* 5 cols / 4 cols / 3 cols */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* 1. Recent Safety Reports (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#061424]/90 backdrop-blur-md border border-slate-800/80 p-4 sm:p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold font-heading text-white tracking-tight">
                Recent Safety Reports
              </h3>
            </div>
            <button 
              onClick={() => handleNav('/reports')}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>

          <div className="overflow-x-auto pt-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                  <th className="pb-2 font-semibold">ID</th>
                  <th className="pb-2 font-semibold">Type</th>
                  <th className="pb-2 font-semibold">Location</th>
                  <th className="pb-2 font-semibold">Risk</th>
                  <th className="pb-2 font-semibold text-center">Score</th>
                  <th className="pb-2 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {summaryReports.map((rep) => (
                  <tr 
                    key={rep.id} 
                    onClick={() => handleNav('/reports')}
                    className="hover:bg-slate-900/40 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 font-mono text-slate-300 text-[11px]">{rep.id}</td>
                    <td className="py-2.5 text-slate-300 text-[11.5px]">{rep.type}</td>
                    <td className="py-2.5 text-slate-400 text-[11.5px]">{rep.location}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        rep.risk === 'Critical'
                          ? 'bg-rose-500 text-white'
                          : rep.risk === 'High'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-yellow-500 text-slate-950'
                      }`}>
                        {rep.risk}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono font-bold text-center text-slate-200 text-[11px]">{rep.score}</td>
                    <td className="py-2.5 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9.5px] font-medium ${
                        rep.status === 'Open'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : rep.status === 'Under Review'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {rep.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. AI Safety Intelligence (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#061424]/90 backdrop-blur-md border border-slate-800/80 p-4 sm:p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
              <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-sm font-bold font-heading text-white">AI Safety Intelligence</h3>
            </div>

            {/* Split layout: Text on left, Golden Constellation graphic on right */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3">
              <div className="sm:col-span-7 space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Emerging Risk Detected</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Line-of-fire related observations have increased by <strong className="text-white">18%</strong> across Plant 03 during the last 30 days.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>Recommended Focus</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    Review lifting exclusion zones and verify critical controls before the next shift.
                  </p>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => handleNav('/ai-analysis')}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all"
                  >
                    <span>View AI Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Golden Constellation / AI Network graphic */}
              <div className="sm:col-span-5 flex items-center justify-center relative min-h-[140px] rounded-xl overflow-hidden bg-[#071322]/80 border border-slate-800/80 p-2">
                {/* SVG Golden Neural Network with AI Emblem */}
                <svg className="w-full h-full text-amber-400/80" viewBox="0 0 160 140" fill="none">
                  {/* Network lines */}
                  <line x1="25" y1="35" x2="80" y2="70" stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.4" />
                  <line x1="135" y1="35" x2="80" y2="70" stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.4" />
                  <line x1="25" y1="105" x2="80" y2="70" stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.4" />
                  <line x1="135" y1="105" x2="80" y2="70" stroke="#F59E0B" strokeWidth="1.2" strokeOpacity="0.4" />
                  <line x1="25" y1="35" x2="25" y2="105" stroke="#F59E0B" strokeWidth="0.8" strokeOpacity="0.25" />
                  <line x1="135" y1="35" x2="135" y2="105" stroke="#F59E0B" strokeWidth="0.8" strokeOpacity="0.25" />
                  <line x1="80" y1="20" x2="80" y2="70" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.3" />
                  <line x1="80" y1="120" x2="80" y2="70" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.3" />

                  {/* Network Nodes */}
                  <circle cx="25" cy="35" r="4" fill="#F59E0B" fillOpacity="0.7" />
                  <circle cx="135" cy="35" r="4" fill="#F59E0B" fillOpacity="0.7" />
                  <circle cx="25" cy="105" r="4" fill="#F59E0B" fillOpacity="0.7" />
                  <circle cx="135" cy="105" r="4" fill="#F59E0B" fillOpacity="0.7" />
                  <circle cx="80" cy="20" r="3" fill="#F59E0B" fillOpacity="0.6" />
                  <circle cx="80" cy="120" r="3" fill="#F59E0B" fillOpacity="0.6" />

                  {/* Central AI Node */}
                  <circle cx="80" cy="70" r="18" fill="#061424" stroke="#F59E0B" strokeWidth="2" />
                  <circle cx="80" cy="70" r="23" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 3" />
                  <text x="80" y="75" textAnchor="middle" fill="#F59E0B" fontSize="13" fontWeight="900" fontFamily="sans-serif">AI</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Organization Safety Score (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl bg-[#061424]/90 backdrop-blur-md border border-slate-800/80 p-4 sm:p-5 flex flex-col justify-between shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
            <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold font-heading text-white tracking-tight">
              Organization Safety Score
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            {/* Circular Gauge Ring */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#17263C" strokeWidth="8" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10B981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="251.32"
                  strokeDashoffset={251.32 * (1 - 0.914)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black font-heading text-white tracking-tight">91.4%</span>
              </div>
            </div>

            {/* Breakdown Progress Bars */}
            <div className="flex-1 space-y-2 text-[10px] w-full">
              <div>
                <div className="flex justify-between text-slate-300 mb-0.5">
                  <span className="text-[10px]">Critical Controls</span>
                  <span className="font-bold text-slate-200 font-mono">94%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-400 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-0.5">
                  <span className="text-[10px]">Training Compliance</span>
                  <span className="font-bold text-slate-200 font-mono">89%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full" style={{ width: '89%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-0.5">
                  <span className="text-[10px]">Corrective Actions</span>
                  <span className="font-bold text-slate-200 font-mono">91%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '91%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-0.5">
                  <span className="text-[10px]">SIF Prevention</span>
                  <span className="font-bold text-slate-200 font-mono">93%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '93%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ================= 5. FOOTER (MATCHING REFERENCE IMAGE) ================= */}
      <footer className="pt-2 pb-1 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="hidden sm:block">
          {/* subtle left spacer */}
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <span className="text-slate-400">
            Last data synchronization: 2 minutes ago
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
          </span>
        </div>
      </footer>

    </div>
  );
}
