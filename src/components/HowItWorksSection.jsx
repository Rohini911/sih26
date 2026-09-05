import React, { useState } from 'react';
import ReusableImage from './ReusableImage';
import { 
  FileText, 
  Cpu, 
  ShieldAlert, 
  SearchCode, 
  Network, 
  BarChart2, 
  ArrowRight, 
  Workflow,
  Sparkles
} from 'lucide-react';

export default function HowItWorksSection() {
  const [selectedStep, setSelectedStep] = useState(0);

  const steps = [
    {
      id: 1,
      name: 'Safety Reports Ingestion',
      subtitle: 'Data Aggregation',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      description: 'Ingests Unsafe Acts (UA), Unsafe Conditions (UC), Near-Misses, and incident logs from OIL platforms and field apps.',
      metric: 'Real-Time Ingestion'
    },
    {
      id: 2,
      name: 'AI / NLP Semantic Engine',
      subtitle: 'Transformer NLP',
      icon: Cpu,
      color: 'from-indigo-500 to-blue-600',
      description: 'Domain-trained safety LLMs parse unstructured oilfield jargon, acronyms, and multilingual report descriptions.',
      metric: '< 500ms Triage'
    },
    {
      id: 3,
      name: 'SIF Precursor Detection',
      subtitle: 'Fatal Potential Classifier',
      icon: ShieldAlert,
      color: 'from-amber-500 to-yellow-600',
      description: 'Differentiates true fatal precursors from low-energy occurrences using scientific EEI/DEKRA risk models.',
      metric: '98.4% Precision'
    },
    {
      id: 4,
      name: 'Barrier Failure Mapping',
      subtitle: 'Bow-Tie Defense',
      icon: SearchCode,
      color: 'from-yellow-500 to-amber-600',
      description: 'Identifies whether physical LOTO, administrative permits, or interlock hardware defenses were compromised.',
      metric: '100% Barrier Audit'
    },
    {
      id: 5,
      name: 'Pattern & Trend Analytics',
      subtitle: 'Risk Clustering',
      icon: Network,
      color: 'from-purple-500 to-indigo-600',
      description: 'Aggregates recurring precursor clusters across rigs, production platforms, gathering stations, and pipeline zones.',
      metric: 'Site SPDI Index'
    },
    {
      id: 6,
      name: 'Automated HSSE Alerts',
      subtitle: 'Action Command Center',
      icon: BarChart2,
      color: 'from-emerald-500 to-teal-600',
      description: 'Triggers automated Stop Work Authority recommendations and targeted audit stand-downs for safety leaders.',
      metric: 'Zero Data Lag'
    }
  ];

  const current = steps[selectedStep];

  return (
    <section 
      id="how-it-works" 
      className="py-24 md:py-32 bg-[#070709] text-white relative transition-colors duration-300 overflow-hidden"
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 3rd Page Layout: STRICT LEFT TEXT | STRICT RIGHT IMAGE (No crossing middle line) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center">
          
          {/* LEFT SIDE: Text strictly on the left */}
          <div className="lg:col-span-6 lg:pr-14 space-y-6 text-left">
            
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-amber-300 text-sm font-black uppercase tracking-wider backdrop-blur-md shadow-md">
              <Workflow className="w-5 h-5 text-amber-400" />
              <span>How It Works</span>
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-heading leading-tight tracking-tight">
              Automated Field Report Triage in Sub-Seconds
            </h3>

            {/* Prominent Metric */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-4xl sm:text-5xl font-black text-amber-400 font-heading">
                &lt; 500ms
              </span>
              <span className="text-xs sm:text-sm text-slate-300 font-medium">
                Automated Semantic Extraction & Barrier Classification
              </span>
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              A continuous AI & NLP pipeline turning unstructured field safety observations, rig acronyms, and multilingual logs into proactive life-saving intelligence.
            </p>

            {/* Interactive Step Selector Pills */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-mono font-bold uppercase text-slate-400">
                Select Pipeline Stage:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {steps.map((step, idx) => {
                  const isSelected = selectedStep === idx;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setSelectedStep(idx)}
                      className={`p-2.5 rounded-xl text-left border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:border-amber-400/40 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] mb-0.5 opacity-80">
                        <span>0{step.id}</span>
                        <span>{step.metric}</span>
                      </div>
                      <div className="truncate">{step.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Deep Dive Callout */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md space-y-1 text-sm">
              <div className="text-amber-400 font-mono text-xs uppercase font-bold">
                Stage 0{current.id}: {current.name}
              </div>
              <p className="text-slate-300 text-xs sm:text-sm">
                {current.description}
              </p>
            </div>

          </div>

          {/* RIGHT SIDE: Image strictly on the right */}
          <div className="lg:col-span-6 lg:pl-14">
            <div className="relative group mx-auto max-w-md lg:max-w-none">
              
              {/* Stacked Shadow Card Layer 2 */}
              <div className="absolute inset-0 bg-blue-900/30 rounded-3xl transform rotate-3 scale-95 transition-transform duration-500 group-hover:rotate-6 shadow-md" />
              
              {/* Stacked Shadow Card Layer 1 */}
              <div className="absolute inset-0 bg-amber-500/20 rounded-3xl transform -rotate-2 scale-98 transition-transform duration-500 group-hover:-rotate-4 shadow-lg" />
              
              {/* Foreground Image Card */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]">
                <img
                  src="/assets/images/pic-3.jpg"
                  alt="Offshore Rig Safety Inspection"
                  className="w-full h-80 sm:h-96 md:h-[420px] object-cover"
                />
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}