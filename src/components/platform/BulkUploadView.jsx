import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  ShieldCheck, 
  Play, 
  Check, 
  ArrowRight,
  RefreshCw,
  FileText,
  FileCheck,
  Zap,
  Clock
} from 'lucide-react';

export default function BulkUploadView({ onNavigate }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Sample batch ingestion records
  const sampleBatchResults = [
    {
      id: 101,
      ref: 'OIL-BATCH-01',
      date: '2026-09-06',
      site: 'Drill Floor Rig 9 (Moran Deep)',
      type: 'NEAR_MISS',
      desc: 'Rotary table spinning chain caught on glove during connection makeup. Drill console emergency brake hit within 1 second.',
      isSIF: true,
      conf: 95.1,
      hazard: 'Kinetic Dynamic Mechanical Hazard'
    },
    {
      id: 102,
      ref: 'OIL-BATCH-02',
      date: '2026-09-06',
      site: 'Bay 2 Heavy Fabrication',
      type: 'UNSAFE_CONDITION',
      desc: 'Acetylene cutting cylinder stored horizontally without safety cap in welding staging yard.',
      isSIF: true,
      conf: 91.8,
      hazard: 'Compressed Flammable Gas Cylinder Hazard'
    },
    {
      id: 103,
      ref: 'OIL-BATCH-03',
      date: '2026-09-05',
      site: 'Wellhead Pad-4 Gathering Station',
      type: 'UNSAFE_CONDITION',
      desc: 'Minor oil drip from sample cock valve nipple onto concrete drip pan. Containment intact.',
      isSIF: false,
      conf: 89.2,
      hazard: 'Routine Environmental Housekeeping'
    },
    {
      id: 104,
      ref: 'OIL-BATCH-04',
      date: '2026-09-05',
      site: 'Central Tank Farm Bund B',
      type: 'NEAR_MISS',
      desc: 'Nitrogen purge hose disconnected while header was pressurized to 6 bar. Hose whipped 2 meters.',
      isSIF: true,
      conf: 97.4,
      hazard: 'High Pressure Pneumatic Whipping Hazard'
    }
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadComplete(false);
      setProgress(0);
    }
  };

  const handleSimulateUpload = () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setProgress(15);
    
    setTimeout(() => setProgress(45), 400);
    setTimeout(() => setProgress(75), 800);
    setTimeout(() => {
      setProgress(100);
      setIsProcessing(false);
      setUploadComplete(true);
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-100 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
              Bulk Safety Ingestion Portal
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Batch ingest incident registers, observation spreadsheets, and contractor safety logs for autonomous SIF classification
          </p>
        </div>

        <button
          onClick={() => onNavigate && onNavigate('/reports')}
          className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <span>View Ingested Database</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Upload Zone & Guide Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Drag & Drop Area (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl space-y-6">
          
          <div className="border-2 border-dashed border-slate-700/80 hover:border-amber-500/50 rounded-2xl p-8 text-center transition-colors relative group">
            <input 
              type="file" 
              accept=".csv,.xlsx,.xls,.pdf,.json" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            
            <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Drag & drop your safety spreadsheet or document here</h4>
                <p className="text-xs text-slate-400 mt-1">Supports CSV, XLSX, XLS, PDF, and JSON safety register files (up to 50MB)</p>
              </div>
              <span className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-amber-300 shadow-sm">
                Browse Files from Device
              </span>
            </div>
          </div>

          {/* Selected File Status */}
          {selectedFile && (
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <FileSpreadsheet className="w-6 h-6 text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{selectedFile.name}</div>
                  <div className="text-[10px] text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB • Ready for extraction</div>
                </div>
              </div>

              {!uploadComplete && !isProcessing && (
                <button
                  type="button"
                  onClick={handleSimulateUpload}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-slate-950 font-black text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Start Processing</span>
                </button>
              )}
            </div>
          )}

          {/* Progress State */}
          {isProcessing && (
            <div className="space-y-2 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  Neural Energy Vector Extraction in Progress...
                </span>
                <span className="font-mono font-bold text-amber-400">{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success State */}
          {uploadComplete && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Batch Ingestion Completed: 4 Safety Records Classified by AI</span>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('/reports')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-semibold hover:bg-emerald-500/30 cursor-pointer"
              >
                Inspect Records →
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Ingestion Protocol Info (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Autonomous Ingestion Protocol</span>
            </h3>
            
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                1. <strong className="text-amber-400">Data Normalization:</strong> Dates, locations, and descriptions are automatically sanitized and mapped into API RP 754 schema.
              </p>
              <p className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                2. <strong className="text-cyan-400">SIF Vector Classifier:</strong> Each record is evaluated against gravitational, electrical, pneumatic, and chemical energy thresholds.
              </p>
              <p className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                3. <strong className="text-emerald-400">Barrier Audit:</strong> Records with absent or failed primary barriers are automatically escalated to the Critical Alert Center.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-400">
            Current pipeline latency: ~0.4s per record
          </div>
        </div>

      </div>

      {/* Batch Processing Output Table */}
      <div className="rounded-2xl bg-[#0E1628]/80 backdrop-blur-xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Ingested Batch Telemetry</h3>
            <p className="text-xs text-slate-400 mt-0.5">Records processed during active session</p>
          </div>
          <span className="text-xs font-mono text-amber-400 font-bold">4 Verified Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-2">Batch Ref</th>
                <th className="py-3 px-2">Site / Unit</th>
                <th className="py-3 px-2">Observation Description</th>
                <th className="py-3 px-2">Detected Hazard</th>
                <th className="py-3 px-2">SIF Assessment</th>
                <th className="py-3 px-2 text-right">AI Conf.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sampleBatchResults.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-2 font-mono font-bold text-cyan-400">
                    {item.ref}
                  </td>
                  <td className="py-3.5 px-2 font-medium text-slate-300">
                    {item.site}
                  </td>
                  <td className="py-3.5 px-2 text-slate-300 max-w-sm truncate">
                    {item.desc}
                  </td>
                  <td className="py-3.5 px-2 text-slate-400">
                    {item.hazard}
                  </td>
                  <td className="py-3.5 px-2">
                    {item.isSIF ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        SIF Precursor
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Non-SIF
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono font-bold text-slate-200">
                    {item.conf}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
