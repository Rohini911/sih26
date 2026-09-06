import React, { useState } from 'react';
import { 
  Flame, 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Layers, 
  Filter, 
  ArrowRight,
  Eye,
  Building2,
  Activity
} from 'lucide-react';

export default function RiskHeatmapView() {
  const [selectedPlant, setSelectedPlant] = useState('Plant 03');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Plant risk zones data
  const plantZones = {
    'Plant 03': [
      { id: 'Z-01', name: 'Drilling Rig 04 - Derrick Floor', hazard: 'Suspended Load & Gravity', score: 94, level: 'Critical', precursors: 18, color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
      { id: 'Z-02', name: 'Mud Pump & High Pressure Manifold', hazard: 'Pneumatic / Hydraulic Pressure', score: 88, level: 'High', precursors: 9, color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
      { id: 'Z-03', name: 'Pipe Staging & Catwalk Bay', hazard: 'Line of Fire / Pinch Points', score: 81, level: 'High', precursors: 7, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
      { id: 'Z-04', name: 'Electrical Motor Control Center (MCC)', hazard: 'Arc Flash / Live Voltage', score: 68, level: 'Medium', precursors: 4, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
      { id: 'Z-05', name: 'Chemical Additive Mixing Tank', hazard: 'Toxic Inhalation & Splashes', score: 58, level: 'Medium', precursors: 3, color: 'bg-blue-500/15 text-blue-300 border-blue-500/20' },
      { id: 'Z-06', name: 'Administrative Walkways & Muster Point', hazard: 'Slip/Trip Housekeeping', score: 22, level: 'Low', precursors: 1, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    ],
    'Plant 01': [
      { id: 'Z-11', name: 'Main Substation A 11kV Room', hazard: 'Live High-Voltage Arc Flash', score: 91, level: 'Critical', precursors: 11, color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
      { id: 'Z-12', name: 'Central Crude Distillation Column', hazard: 'Thermal & Hydrocarbon Fire', score: 79, level: 'High', precursors: 8, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
      { id: 'Z-13', name: 'Compressor House No. 2', hazard: 'High Pressure Gas Leak', score: 74, level: 'High', precursors: 6, color: 'bg-amber-500/15 text-amber-300 border-amber-500/25' },
      { id: 'Z-14', name: 'Utility Boiler Area', hazard: 'Steam Thermal Release', score: 48, level: 'Medium', precursors: 3, color: 'bg-blue-500/15 text-blue-300 border-blue-500/20' },
    ],
    'Plant 02': [
      { id: 'Z-21', name: 'Hydrocarbon Separator Level 3 Walkway', hazard: 'Fall from Height Void', score: 86, level: 'High', precursors: 12, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
      { id: 'Z-22', name: 'Pipe Rack Overhead Trays', hazard: 'Working at Height / Lifelines', score: 78, level: 'High', precursors: 7, color: 'bg-amber-500/15 text-amber-300 border-amber-500/25' },
      { id: 'Z-23', name: 'Nitrogen Storage Bullet Tank', hazard: 'Asphyxiant Pressure Gas', score: 62, level: 'Medium', precursors: 4, color: 'bg-blue-500/15 text-blue-300 border-blue-500/20' },
    ],
    'Plant 04': [
      { id: 'Z-31', name: 'Central Logistics Yard Corridor', hazard: 'Forklift-Pedestrian Collision', score: 82, level: 'High', precursors: 9, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
      { id: 'Z-32', name: 'Chemical Drum Loading Bay', hazard: 'Chemical Toxic Corrosive', score: 64, level: 'Medium', precursors: 5, color: 'bg-blue-500/15 text-blue-300 border-blue-500/20' },
    ],
    'Plant 05': [
      { id: 'Z-41', name: 'Reformer High Pressure Gas Manifold', hazard: 'Pneumatic Pressure Energy', score: 89, level: 'Critical', precursors: 14, color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' },
      { id: 'Z-42', name: 'Sulfur Recovery Unit Sump', hazard: 'Toxic H2S Asphyxiation', score: 84, level: 'High', precursors: 7, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    ]
  };

  // 5x5 Matrix (Likelihood vs Severity according to API RP 754)
  const matrixCells = [
    { row: '5 - Catastrophic', col1: 'Medium', col2: 'High', col3: 'Critical (Plant 03 Rig 04)', col4: 'Critical (Plant 01 Substation)', col5: 'Critical' },
    { row: '4 - Major', col1: 'Low', col2: 'Medium', col3: 'High (Plant 02 Separator)', col4: 'High (Plant 04 Logistics)', col5: 'Critical' },
    { row: '3 - Moderate', col1: 'Low', col2: 'Medium', col3: 'Medium', col4: 'High', col5: 'High' },
    { row: '2 - Minor', col1: 'Low', col2: 'Low', col3: 'Low', col4: 'Medium', col5: 'Medium' },
    { row: '1 - Negligible', col1: 'Low (Muster Point)', col2: 'Low', col3: 'Low', col4: 'Low', col5: 'Low' },
  ];

  const currentZones = plantZones[selectedPlant] || plantZones['Plant 03'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-100 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
              Facility Risk Heatmap & Exposure Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            API RP 754 risk matrix mapping spatial precursor frequency and barrier vulnerabilities across operating sites
          </p>
        </div>

        {/* Plant Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Select Facility:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {['Plant 01', 'Plant 02', 'Plant 03', 'Plant 04', 'Plant 05'].map((pl) => (
              <button
                key={pl}
                onClick={() => setSelectedPlant(pl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  selectedPlant === pl
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {pl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spatial Risk Zones for Selected Facility */}
      <div className="rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Spatial Risk Zones – {selectedPlant}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">High-energy zones ranked by active precursor frequency</p>
          </div>
          <span className="text-xs font-mono text-amber-400 font-bold">{currentZones.length} Zones Audited</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentZones.map((zone) => (
            <div 
              key={zone.id}
              className={`p-5 rounded-2xl bg-slate-900/80 border transition-all space-y-3 ${zone.color}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase opacity-80">{zone.id}</span>
                  <h4 className="text-xs font-bold text-white mt-0.5 leading-snug">{zone.name}</h4>
                </div>
                <span className="text-xs font-black font-mono shrink-0 px-2 py-0.5 rounded bg-black/40 border border-white/10">
                  Score {zone.score}
                </span>
              </div>

              <div className="text-xs text-slate-300">
                <span className="text-[10px] uppercase font-mono block opacity-75">Primary Hazard</span>
                <span className="font-medium text-white">{zone.hazard}</span>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="opacity-90">{zone.precursors} SIF Precursors</span>
                <span className="font-black uppercase">{zone.level} Risk</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5x5 Severity vs Likelihood Matrix */}
      <div className="rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">5x5 Enterprise Risk Matrix (API RP 754 Standard)</h3>
            <p className="text-xs text-slate-400 mt-0.5">Severity consequence vs Likelihood frequency evaluation</p>
          </div>
          <span className="text-xs font-mono text-cyan-400">Dynamic Cell Overlay</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                <th className="py-3 px-3 w-40">Consequence Severity</th>
                <th className="py-3 px-3 text-center">1 - Rare</th>
                <th className="py-3 px-3 text-center">2 - Unlikely</th>
                <th className="py-3 px-3 text-center">3 - Possible</th>
                <th className="py-3 px-3 text-center">4 - Likely</th>
                <th className="py-3 px-3 text-center">5 - Almost Certain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {matrixCells.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/30">
                  <td className="py-4 px-3 font-bold text-slate-200 bg-slate-900/50 border-r border-slate-800 whitespace-nowrap">
                    {row.row}
                  </td>
                  <td className={`p-3 text-center font-semibold text-[11px] ${row.col1.includes('Critical') ? 'bg-rose-500/25 text-rose-300' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {row.col1}
                  </td>
                  <td className={`p-3 text-center font-semibold text-[11px] ${row.col2.includes('Critical') ? 'bg-rose-500/25 text-rose-300' : row.col2.includes('High') ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {row.col2}
                  </td>
                  <td className={`p-3 text-center font-semibold text-[11px] ${row.col3.includes('Critical') ? 'bg-rose-500/25 text-rose-300 font-bold border border-rose-500/50' : row.col3.includes('High') ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40' : 'bg-blue-500/10 text-blue-300'}`}>
                    {row.col3}
                  </td>
                  <td className={`p-3 text-center font-semibold text-[11px] ${row.col4.includes('Critical') ? 'bg-rose-500/30 text-rose-300 font-black border border-rose-500/60' : row.col4.includes('High') ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/10 text-blue-300'}`}>
                    {row.col4}
                  </td>
                  <td className={`p-3 text-center font-semibold text-[11px] ${row.col5.includes('Critical') ? 'bg-rose-500/35 text-rose-200 font-black border border-rose-500/70' : 'bg-amber-500/20 text-amber-300'}`}>
                    {row.col5}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
          <span>Critical zones require positive verification before shift handovers</span>
          <span>Automated API RP 754 matrix feed</span>
        </div>
      </div>

    </div>
  );
}
