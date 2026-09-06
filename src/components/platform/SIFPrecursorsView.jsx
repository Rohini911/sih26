import React from 'react';
import { 
  Zap, 
  TrendingUp, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Activity, 
  ChevronRight,
  Flame,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip
} from 'recharts';

export default function SIFPrecursorsView() {
  // Precursor Distribution across 6 categories
  const precursorCategories = [
    { name: 'Line of Fire', percentage: 28, count: 510, color: '#EF4444', risk: 'Critical', desc: 'Direct exposure to moving mechanics, high-pressure releases, or dropped tools.' },
    { name: 'Energy Isolation', percentage: 21, count: 382, color: '#F97316', risk: 'Critical', desc: 'Bypass or non-verification of Lock-Out/Tag-Out and zero-energy states.' },
    { name: 'Working at Height', percentage: 17, count: 309, color: '#F59E0B', risk: 'High', desc: 'Unguarded platform voids, unclipped safety harnesses, or uncertified scaffolding.' },
    { name: 'Lifting Operations', percentage: 13, count: 237, color: '#06B6D4', risk: 'High', desc: 'Rigging failure, suspended load traversing personnel, or unbarricaded slewing radius.' },
    { name: 'Confined Space', percentage: 9, count: 164, color: '#3B82F6', risk: 'Critical', desc: 'Toxic/asphyxiant atmospheres, lack of continuous gas test, or unmonitored entry.' },
    { name: 'Vehicle/Pedestrian', percentage: 12, count: 218, color: '#64748B', risk: 'High', desc: 'Heavy mobile plant interaction, lack of dedicated walkways, or blind logistics corners.' },
  ];

  // Site Distribution Matrix
  const siteDistributionData = [
    { site: 'Plant 01', lineOfFire: 92, energyIsolation: 84, height: 42, lifting: 31, confined: 24, vehicle: 35 },
    { site: 'Plant 02', lineOfFire: 88, energyIsolation: 61, height: 95, lifting: 38, confined: 19, vehicle: 29 },
    { site: 'Plant 03', lineOfFire: 184, energyIsolation: 72, height: 51, lifting: 94, confined: 41, vehicle: 68 },
    { site: 'Plant 04', lineOfFire: 71, energyIsolation: 81, height: 38, lifting: 22, confined: 29, vehicle: 49 },
    { site: 'Plant 05', lineOfFire: 75, energyIsolation: 84, height: 83, lifting: 52, confined: 51, vehicle: 37 },
  ];

  // Monthly Trend Chart
  const monthlyTrendData = [
    { month: 'Mar', count: 210 },
    { month: 'Apr', count: 245 },
    { month: 'May', count: 268 },
    { month: 'Jun', count: 290 },
    { month: 'Jul', count: 330 },
    { month: 'Aug', count: 360 },
    { month: 'Sep', count: 382 },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#0B1220]/95 backdrop-blur-md border border-slate-700/80 p-2.5 rounded-xl shadow-2xl text-xs">
          <div className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            {data.name}
          </div>
          <div className="text-slate-300 mt-1">
            <strong>{data.percentage}%</strong> ({data.count} Precursor Events)
          </div>
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
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
              SIF Precursor Intelligence Center
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deep-dive classification across the 6 high-energy vectors and facility exposure frequency
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
            Total SIF Precursors: <strong className="text-amber-400">1,820</strong>
          </div>
        </div>
      </div>

      {/* 6 Category Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {precursorCategories.map((cat) => (
          <div 
            key={cat.name}
            className="p-5 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 hover:border-amber-500/40 transition-all space-y-3 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                {cat.name}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                cat.risk === 'Critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {cat.risk}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
              {cat.desc}
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-300"><strong>{cat.count}</strong> events</span>
              <span className="font-mono font-bold text-white text-sm">{cat.percentage}%</span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full rounded-full"
                style={{ width: `${cat.percentage * 3.5}%`, backgroundColor: cat.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Charts: Donut Distribution & Site Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Precursor Donut (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Precursor Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Energy vector proportion</p>
          </div>

          <div className="relative w-full h-56 flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <RechartsTooltip content={<CustomTooltip />} />
                <Pie
                  data={precursorCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={88}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {precursorCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0E1628" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white">1,820</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Precursors</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
            Calculated under Energy Wheel & IOGP Life-Saving Rules
          </div>
        </div>

        {/* Site Distribution Matrix (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Site Precursor Distribution Matrix</h3>
              <p className="text-xs text-slate-400 mt-0.5">Frequency count of SIF precursors by plant and energy vector</p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold">5 Facilities</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="py-3 px-2">Plant Site</th>
                  <th className="py-3 px-2">Line of Fire</th>
                  <th className="py-3 px-2">Energy Isol.</th>
                  <th className="py-3 px-2">Work at Height</th>
                  <th className="py-3 px-2">Lifting Ops</th>
                  <th className="py-3 px-2">Confined Space</th>
                  <th className="py-3 px-2">Vehicle/Ped.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {siteDistributionData.map((row) => (
                  <tr key={row.site} className="hover:bg-slate-900/40">
                    <td className="py-3 px-2 font-bold text-white">{row.site}</td>
                    <td className={`py-3 px-2 font-mono ${row.lineOfFire > 100 ? 'text-rose-400 font-black' : 'text-slate-300'}`}>
                      {row.lineOfFire}
                    </td>
                    <td className="py-3 px-2 font-mono text-slate-300">{row.energyIsolation}</td>
                    <td className={`py-3 px-2 font-mono ${row.height > 80 ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                      {row.height}
                    </td>
                    <td className={`py-3 px-2 font-mono ${row.lifting > 60 ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                      {row.lifting}
                    </td>
                    <td className="py-3 px-2 font-mono text-slate-300">{row.confined}</td>
                    <td className="py-3 px-2 font-mono text-slate-300">{row.vehicle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-800">
            <span>Red indicates extreme cluster requiring barrier engineering</span>
            <span>Refreshed real-time</span>
          </div>
        </div>

      </div>

    </div>
  );
}
