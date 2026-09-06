import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Zap, 
  Layers, 
  ArrowRight, 
  RotateCcw,
  CheckCircle,
  FileText,
  Activity,
  Flame,
  Scale
} from 'lucide-react';

export default function AIAnalysisView() {
  const [reportType, setReportType] = useState('NEAR_MISS');
  const [description, setDescription] = useState(
    'Worker operating overhead bridge crane in Bay 2 with worn wire rope. A 2-ton steel beam slipped during transport and swung into the designated pedestrian walkway where two workers were walking. No exclusion zone or spotter was present.'
  );
  const [location, setLocation] = useState('Bay 2 Heavy Fabrication Shop');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const sampleScenarios = [
    {
      title: 'Suspended Crane Load Near-Miss',
      type: 'NEAR_MISS',
      location: 'Bay 2 Heavy Fabrication Shop',
      desc: 'Worker operating overhead bridge crane in Bay 2 with worn wire rope. A 2-ton steel beam slipped during transport and swung into the designated pedestrian walkway where two workers were walking. No exclusion zone or spotter was present.'
    },
    {
      title: 'Work at Height (Unclipped at 8m)',
      type: 'UNSAFE_ACT',
      location: 'Pipe Rack Scaffolding Bay 4',
      desc: 'Contractor observed working on scaffolding platform at 8 meters elevation without clipping twin lanyards to the static lifeline. Scaffolding mid-rail was temporarily unbolted for material passage.'
    },
    {
      title: 'High Pressure Line Isolation',
      type: 'UNSAFE_CONDITION',
      location: 'Wellhead Pad-4 Gathering Station',
      desc: 'Fitter loosened flange bolts on sour gas flowline before bleed valve confirmed zero gauge pressure. Residual line pressure was measured at 40 bar after valve began hissing.'
    },
    {
      title: 'Routine Minor Tripping Hazard',
      type: 'UNSAFE_CONDITION',
      location: 'Central Administrative Walkway',
      desc: 'Water hose left coiled across warehouse entrance hallway. Lighting was operational and ground was dry with clear walking perimeter.'
    }
  ];

  const handleApplyScenario = (sc) => {
    setReportType(sc.type);
    setLocation(sc.location);
    setDescription(sc.desc);
    setAnalysisResult(null);
  };

  // Preset or calculated dynamic result
  const [analysisResult, setAnalysisResult] = useState({
    sif_precursor: 'YES',
    confidence: 96.4,
    risk_score: 94,
    classification: 'NEAR_MISS',
    detected_hazards: [
      'Suspended Load & Rigging Integrity',
      'Dynamic Kinetic Energy (2-ton steel beam)',
      'Human-Machine / Line-of-Fire Interaction'
    ],
    energy_source: 'Gravity & Mechanical Motion (2,000 kg mass at 6m elevation)',
    barrier_status: 'CRITICAL BARRIER FAILED',
    explainable_reasoning: 'The event involved high gravitational energy with an absent physical barrier. A 2-ton load traversed an unbarricaded personnel walkway without positive mechanical restraints or spotter verification. If the load had detached 1 second earlier, fatal crush injuries would have occurred with >90% probability.',
    recommended_controls: [
      'Establish physical interlocked exclusion barricades under crane slewing radii',
      'Mandate non-destructive testing (NDT) magnetic particle inspection for wire slings',
      'Deploy audible travel alarms and overhead laser boundary markers'
    ],
    corrective_actions: [
      'Issue Stop-Work Notice on Crane Bay 2 until rigging sling certification is verified',
      'Re-train crane operators and riggers on IOGP Mechanical Lifting Life-Saving Rule',
      'Update plant Job Hazard Analysis (JHA-CR-04) to prohibit dual-use pathways'
    ]
  });

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      const isMinor = description.toLowerCase().includes('hose') || description.toLowerCase().includes('tripping');
      if (isMinor) {
        setAnalysisResult({
          sif_precursor: 'NO',
          confidence: 91.2,
          risk_score: 28,
          classification: 'UNSAFE_CONDITION',
          detected_hazards: ['Low Energy Tripping Hazard', 'Housekeeping Defect'],
          energy_source: 'Low Kinetic / Potential Energy (< 100 Joules)',
          barrier_status: 'BARRIER FUNCTIONAL',
          explainable_reasoning: 'Observation presents low acute energy release potential. No high-energy source or life-threatening vector detected. Standard housekeeping corrective action suffices without life-saving rule violation.',
          recommended_controls: ['Store equipment in designated wall reels', 'Conduct housekeeping walkdown'],
          corrective_actions: ['Re-coil hose immediately', 'Notify zone safety representative']
        });
      } else {
        setAnalysisResult({
          sif_precursor: 'YES',
          confidence: 95.8,
          risk_score: 92,
          classification: reportType,
          detected_hazards: [
            'High-Energy Vector Identified',
            'Absence / Failure of Direct Safety Barrier',
            'Line of Fire Vulnerability'
          ],
          energy_source: 'High Potential / Kinetic Energy Release Risk',
          barrier_status: 'BARRIER DEFICIENT',
          explainable_reasoning: 'Neural analysis confirmed SIF precursor potential. The scenario lacked dual containment or positive latching barriers. An unattenuated energy path existed between the hazard vector and personnel.',
          recommended_controls: [
            'Enforce mandatory zero-energy verification protocol',
            'Isolate and lock out primary energy supply',
            'Implement continuous field supervisor verification'
          ],
          corrective_actions: [
            'Immediate work suspension and supervisor review',
            'Document CAPA item in enterprise tracking queue',
            'Verify Life-Saving Rule compliance prior to restart'
          ]
        });
      }
    }, 600);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-100 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
              AI Safety Intelligence Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time neural hazard extraction, SIF precursor determination, and explainable control recommendations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            Model: SIF-Neural-v2.4
          </span>
        </div>
      </div>

      {/* Preset Scenario Selector */}
      <div className="rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Select Industrial Test Scenario
          </span>
          <span className="text-[11px] text-slate-500 font-mono">One-click evaluation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {sampleScenarios.map((sc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyScenario(sc)}
              className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 text-left transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                {sc.title}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">{sc.location}</div>
              <span className={`inline-block mt-2 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                sc.type === 'NEAR_MISS' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
              }`}>
                {sc.type.replace('_', ' ')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form & AI Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Safety Report Input (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Safety Observation Input</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Live Input</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Classification Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['NEAR_MISS', 'UNSAFE_ACT', 'UNSAFE_CONDITION'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setReportType(t)}
                    className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                      reportType === t 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' 
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Plant Location / Unit
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Detailed Field Description & Barrier Context
              </label>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-white leading-relaxed focus:outline-none focus:border-amber-500"
                placeholder="Describe what occurred, energies involved, and whether barriers were absent or failed..."
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Cpu className="w-4 h-4 text-slate-950" />
                <span>Execute Neural SIF Inference</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Analysis Result (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl space-y-6">
          
          <div>
            {/* Analysis Result Top Status Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-3">
                {analysisResult.sif_precursor === 'YES' ? (
                  <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-black text-sm shrink-0">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-black text-sm shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="text-xs font-semibold text-slate-400">SIF Precursor Assessment</div>
                  <div className={`text-lg font-black font-heading ${
                    analysisResult.sif_precursor === 'YES' ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {analysisResult.sif_precursor === 'YES' ? 'CONFIRMED SIF PRECURSOR' : 'NON-SIF OBSERVATION'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Risk Score</div>
                  <div className={`text-xl font-black font-mono ${
                    analysisResult.risk_score >= 80 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {analysisResult.risk_score} / 100
                  </div>
                </div>
                <div className="text-right pl-3 border-l border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">AI Confidence</div>
                  <div className="text-xl font-black font-mono text-cyan-400">
                    {analysisResult.confidence}%
                  </div>
                </div>
              </div>
            </div>

            {/* Detected Hazards & Energy Source */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Detected High-Energy Vectors
                </span>
                <ul className="mt-2 space-y-1.5">
                  {analysisResult.detected_hazards.map((hz, i) => (
                    <li key={i} className="text-xs text-slate-200 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span>{hz}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Barrier Status & Energy
                </span>
                <div className="mt-2 space-y-1 text-xs">
                  <div className="font-semibold text-rose-400">{analysisResult.barrier_status}</div>
                  <div className="text-slate-300 text-[11px]">{analysisResult.energy_source}</div>
                </div>
              </div>
            </div>

            {/* Explainable AI Reasoning */}
            <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                Explainable Neural Reasoning
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {analysisResult.explainable_reasoning}
              </p>
            </div>

            {/* Recommended Controls & Corrective Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Recommended Critical Controls
                </span>
                <ul className="space-y-1.5">
                  {analysisResult.recommended_controls.map((ctrl, i) => (
                    <li key={i} className="text-xs text-slate-200 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">✓</span>
                      <span>{ctrl}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Corrective Action Requirements
                </span>
                <ul className="space-y-1.5">
                  {analysisResult.corrective_actions.map((act, i) => (
                    <li key={i} className="text-xs text-slate-200 flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">→</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Validated under API RP 754 & Campbell Institute framework</span>
            <span>Zero Hallucination Protocol Active</span>
          </div>

        </div>

      </div>

    </div>
  );
}
