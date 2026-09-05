import React, { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function CinematicVideoSection({ onLogin, onSeeHowItWorks }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section 
      id="sif-intelligence" 
      className="py-24 md:py-32 bg-[#FAF8F5] text-slate-900 relative transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 4th Page Layout: STRICT LEFT VIDEO/IMAGE | STRICT RIGHT TEXT (No crossing middle line) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center">
          
          {/* LEFT SIDE: Interactive 4K Video Player Card */}
          <div className="lg:col-span-6 lg:pr-14">
            <div className="relative group mx-auto max-w-md lg:max-w-none">
              
              {/* Stacked Shadow Card Layer 2 */}
              <div className="absolute inset-0 bg-yellow-200/50 rounded-3xl transform rotate-3 scale-95 transition-transform duration-500 group-hover:rotate-6 shadow-md" />
              
              {/* Stacked Shadow Card Layer 1 */}
              <div className="absolute inset-0 bg-amber-300/40 rounded-3xl transform -rotate-2 scale-98 transition-transform duration-500 group-hover:-rotate-4 shadow-lg" />
              
              {/* Foreground Video Card */}
              <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]">
                <video
                  ref={videoRef}
                  src="/assets/videos/safety-analysis-video.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-80 sm:h-96 md:h-[420px] object-cover"
                />
              </div>

            </div>
          </div>

          {/* RIGHT SIDE: Text strictly on the right */}
          <div className="lg:col-span-6 lg:pl-14 space-y-6 text-left">
            
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-amber-100/95 border-2 border-amber-400 text-amber-950 text-sm font-black uppercase tracking-wider shadow-md">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>SIF Intelligence</span>
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 font-heading leading-tight tracking-tight">
              Detect Hidden Safety Signals Before Incidents
            </h3>

            {/* Prominent Metric */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-4xl sm:text-5xl font-black text-amber-600 font-heading">
                100%
              </span>
              <span className="text-xs sm:text-sm text-slate-600 font-medium">
                Continuous Digital Barrier Assurance
              </span>
            </div>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              High-energy hazards (pressure, voltage, gravity, toxic gases) are analyzed instantly from field logs to protect teams during high-risk workover and refinery turnaround tasks.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 rounded-full bg-amber-100 text-amber-700 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  Live SIF Parsing: Instant energy vector & hazard identification
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 rounded-full bg-amber-100 text-amber-700 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  IOGP Guardrails: Standardized life-saving rules compliance
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 rounded-full bg-amber-100 text-amber-700 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  Zero Data Lag: Eliminates quarterly review backlogs completely
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}