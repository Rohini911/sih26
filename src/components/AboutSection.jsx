import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Flame,
  ShieldCheck,
  Target
} from 'lucide-react';

export default function AboutSection({ onExplore }) {
  return (
    <section 
      id="about" 
      className="py-24 md:py-32 bg-[#FAF8F5] text-slate-900 relative transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 2nd Page Layout: STRICT LEFT IMAGE | STRICT RIGHT TEXT (No crossing middle line) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center">
          
          {/* LEFT SIDE: Image strictly on the left (with padding away from center rope) */}
          <div className="lg:col-span-6 lg:pr-14">
            <div className="relative group mx-auto max-w-md lg:max-w-none">
              
              {/* Stacked Shadow Card Layer 2 */}
              <div className="absolute inset-0 bg-yellow-200/50 rounded-3xl transform rotate-3 scale-95 transition-transform duration-500 group-hover:rotate-6 shadow-md" />
              
              {/* Stacked Shadow Card Layer 1 */}
              <div className="absolute inset-0 bg-amber-300/40 rounded-3xl transform -rotate-2 scale-98 transition-transform duration-500 group-hover:-rotate-4 shadow-lg" />
              
              {/* Foreground Image Card */}
              <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]">
                <img
                  src="/assets/images/pic-2.jpg"
                  alt="Control Room SIF Analytics"
                  className="w-full h-80 sm:h-96 md:h-[420px] object-cover"
                />
              </div>

            </div>
          </div>

          {/* RIGHT SIDE: Text strictly on the right (with padding away from center rope) */}
          <div className="lg:col-span-6 lg:pl-14 space-y-6 text-left">
            
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-amber-100/95 border-2 border-amber-400 text-amber-950 text-sm font-black uppercase tracking-wider shadow-md">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
              <span>About SafetyAI</span>
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 font-heading leading-tight tracking-tight">
              AI-Powered Industrial Safety Intelligence
            </h3>

            {/* Core Explanation */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              <strong className="text-slate-900 font-semibold">SafetyAI</strong> is an AI-powered Safety Intelligence Platform that transforms industrial safety reports into actionable insights. It identifies potential risks and early warning signals before they develop into serious incidents.
            </p>

            {/* Analyzed Report Types */}
            <div className="space-y-2.5 pt-1">
              <div className="text-xs font-mono font-bold tracking-wider text-amber-700 uppercase">
                Continuous Analysis of:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-800">Unsafe Acts</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-800">Unsafe Conditions</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-800">Near-Miss Reports</span>
                </div>
              </div>
            </div>

            {/* Key Outcomes */}
            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 p-1 rounded-full bg-amber-100 text-amber-700 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  Isolates the 20–25% genuine SIF precursors from everyday minor report noise
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 p-1 rounded-full bg-amber-100 text-amber-700 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  Detects weak signals and barrier failures before high-energy releases occur
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}