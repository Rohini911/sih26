import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  DoorClosed, 
  ArrowUpRight, 
  Anchor, 
  Crosshair, 
  Flame, 
  Car, 
  AlertOctagon, 
  FileCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  X,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function LifeSavingRulesView() {
  const [selectedRule, setSelectedRule] = useState(null);

  const rules = [
    {
      id: 'LSR-01',
      name: 'Energy Isolation',
      category: 'Lock-Out / Tag-Out',
      icon: Zap,
      compliance: 92.4,
      violations: 6,
      verifications: 284,
      color: 'amber',
      mandate: 'Verify zero-energy state and apply Lock-Out/Tag-Out (LOTO) before commencing work on any energized system.',
      controls: [
        'Apply multi-padlock hasps on primary isolation points',
        'Test for zero voltage with calibrated multi-meter',
        'Bleed trapped fluid/gas pressure to zero gauge reading'
      ]
    },
    {
      id: 'LSR-02',
      name: 'Working at Height',
      category: 'Fall Protection',
      icon: ArrowUpRight,
      compliance: 88.6,
      violations: 11,
      verifications: 340,
      color: 'rose',
      mandate: 'Protect yourself against a fall whenever working at height above 1.8 meters or near unguarded platform edges.',
      controls: [
        'Inspect 100% tie-off twin lanyards and static lifelines',
        'Verify green scaffolding inspection status tags daily',
        'Install rigid toe-boards to prevent dropped objects'
      ]
    },
    {
      id: 'LSR-03',
      name: 'Line of Fire',
      category: 'Exclusion Zones',
      icon: Crosshair,
      compliance: 78.2,
      violations: 24,
      verifications: 198,
      color: 'rose',
      mandate: 'Position yourself outside the path of moving machinery, dynamic tension lines, and overhead crane trajectories.',
      controls: [
        'Establish hard barricaded exclusion zones around drop hazards',
        'Maintain constant line-of-sight communication with crane operators',
        'Never position body parts between moving and stationary objects'
      ]
    },
    {
      id: 'LSR-04',
      name: 'Confined Space',
      category: 'Atmospheric Safety',
      icon: DoorClosed,
      compliance: 96.1,
      violations: 2,
      verifications: 142,
      color: 'emerald',
      mandate: 'Obtain authorization, conduct continuous atmospheric gas testing, and maintain a dedicated standby entry watch.',
      controls: [
        'Continuous 4-gas monitor (LEL, O2, CO, H2S) calibration',
        'Designate trained hole-watch sentry with emergency air supply',
        'Verify positive mechanical ventilation before entry'
      ]
    },
    {
      id: 'LSR-05',
      name: 'Safe Mechanical Lifting',
      category: 'Crane & Rigging',
      icon: Anchor,
      compliance: 84.5,
      violations: 14,
      verifications: 215,
      color: 'amber',
      mandate: 'Verify lifting equipment integrity, never exceed safe working loads, and never walk or stand under suspended loads.',
      controls: [
        'Inspect certified shackles, wire slings, and spreader beams',
        'Establish barricades beneath maximum slewing radius',
        'Use non-conductive synthetic taglines to guide loads'
      ]
    },
    {
      id: 'LSR-06',
      name: 'Bypass Safety Controls',
      category: 'Overriding Interlocks',
      icon: AlertOctagon,
      compliance: 97.8,
      violations: 1,
      verifications: 112,
      color: 'emerald',
      mandate: 'Obtain executive approval and formal risk assessment before overriding or disabling any safety-critical device.',
      controls: [
        'Document formal Safety Instrumented System (SIS) bypass permit',
        'Implement temporary compensatory manual mitigations',
        'Maintain maximum 24-hour bypass time limit'
      ]
    },
    {
      id: 'LSR-07',
      name: 'Hot Work',
      category: 'Combustion & Sparks',
      icon: Flame,
      compliance: 94.2,
      violations: 4,
      verifications: 180,
      color: 'emerald',
      mandate: 'Control flammables and ignition sources in hazardous refinery zones and maintain continuous fire watch.',
      controls: [
        'Conduct LEL flammable gas test within 15m radius',
        'Deploy fire blankets over drainage channels and open sumps',
        'Post dedicated fire watch with charged 9kg dry powder cylinder'
      ]
    },
    {
      id: 'LSR-08',
      name: 'Driving Safety',
      category: 'Transport & Logistics',
      icon: Car,
      compliance: 91.0,
      violations: 7,
      verifications: 160,
      color: 'emerald',
      mandate: 'Wear seatbelts, adhere to 20 km/h facility speed limits, and never use handheld mobile phones while operating vehicles.',
      controls: [
        'Active in-vehicle telematics GPS tracking & speed governor',
        'Pre-trip vehicle circle-of-safety defect inspection',
        'Separation of pedestrian crosswalks from heavy forklift traffic'
      ]
    },
    {
      id: 'LSR-09',
      name: 'Work Authorization',
      category: 'Permit-to-Work (PTW)',
      icon: FileCheck,
      compliance: 95.5,
      violations: 3,
      verifications: 420,
      color: 'emerald',
      mandate: 'Work only with a valid Permit-to-Work confirming that all hazards have been assessed and joint site checks completed.',
      controls: [
        'Perform joint on-site inspection between Issuer and Performer',
        'Review Job Hazard Analysis (JHA) with frontline crew at toolbox talk',
        'Revalidate permits following any shift change or work interruption'
      ]
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-100 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
              Life-Saving Rules Compliance Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Standardized 9 IOGP barrier rules mapped directly to field telemetry, control verifications, and observed infractions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            Overall Compliance: 91.4%
          </span>
        </div>
      </div>

      {/* 9 Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rules.map((rule) => {
          const Icon = rule.icon;
          return (
            <div 
              key={rule.id}
              onClick={() => setSelectedRule(rule)}
              className="p-5 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-amber-400 font-bold block">{rule.id}</span>
                      <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {rule.name}
                      </h3>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    rule.compliance >= 92 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : rule.compliance >= 85
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {rule.compliance}% Compliance
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {rule.mandate}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Verifications: <strong className="text-white">{rule.verifications}</strong></span>
                  <span>Violations: <strong className={rule.violations > 10 ? 'text-rose-400' : 'text-slate-200'}>{rule.violations}</strong></span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      rule.compliance >= 92 ? 'bg-emerald-400' : rule.compliance >= 85 ? 'bg-amber-400' : 'bg-rose-500'
                    }`}
                    style={{ width: `${rule.compliance}%` }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedRule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#0E1628] rounded-2xl border border-slate-800 shadow-2xl p-6 space-y-5 text-left text-slate-100">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 font-mono font-bold text-xs">
                  {selectedRule.id}
                </span>
                <h3 className="text-base font-bold text-white">
                  {selectedRule.name} – {selectedRule.category}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedRule(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">IOGP Mandatory Standard</div>
              <p className="text-slate-200 leading-relaxed">{selectedRule.mandate}</p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-emerald-400 block">
                Critical Barrier Controls
              </span>
              {selectedRule.controls.map((ctrl, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span className="text-slate-200">{ctrl}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Total Control Audits</span>
                <span className="font-mono text-base font-bold text-white">{selectedRule.verifications}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Logged Infractions</span>
                <span className={`font-mono text-base font-bold ${selectedRule.violations > 10 ? 'text-rose-400' : 'text-slate-200'}`}>
                  {selectedRule.violations}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRule(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close Rule
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
