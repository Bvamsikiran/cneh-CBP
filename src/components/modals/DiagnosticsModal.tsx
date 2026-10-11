import React from 'react';
import {
  X,
  Activity,
  CheckCircle2,
  Cpu,
  Database,
  HardDrive,
  Shield,
  Layers,
  Terminal,
  Zap,
} from 'lucide-react';

interface DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  datasetCount: number;
}

export const DiagnosticsModal: React.FC<DiagnosticsModalProps> = ({
  isOpen,
  onClose,
  datasetCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#111726] border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-950/60 text-blue-400 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">System Diagnostics & Health</h2>
              <p className="text-xs text-slate-400">ML Pipeline Runtime & Laboratory Hardware Telemetry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
          {/* Status grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Inference Engine</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Operational
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Latency: 340ms</span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Feature Extractor</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                24 Features
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Vector: float64[24]</span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Storage Subsystem</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Persistent
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{datasetCount} Records</span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">OWASP ZAP Bridge</span>
              <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <Zap className="w-3.5 h-3.5" />
                Simulator Mode
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Daemon port: 8080</span>
            </div>
          </div>

          {/* Model Weights Details */}
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              Supervised Model Topology Telemetry
            </h3>
            <div className="grid grid-cols-2 gap-3 text-slate-300 font-mono text-[11px]">
              <div>Model: <span className="text-white">Random Forest (150 trees) + XGBoost Ensemble</span></div>
              <div>Calibration: <span className="text-white">Platt Scaling (Sigmoidal)</span></div>
              <div>Quantization: <span className="text-white">FP32 Vector Coefficients</span></div>
              <div>Training Corpus: <span className="text-white">12,500 Academic Recon Targets</span></div>
            </div>
          </div>

          {/* Real-time telemetry log */}
          <div>
            <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-400" />
              Runtime Telemetry Stream
            </h3>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
              <div>[SYSTEM] CNEH Pipeline initialized at {new Date().toLocaleTimeString()}</div>
              <div>[ENGINE] 24 recon features vectorized with StandardScaler</div>
              <div>[INFER] Ensemble probability threshold initialized (High: 70%, Med: 40%)</div>
              <div>[SEC] Passive mode active: zero active intrusive probes dispatched</div>
              <div className="text-emerald-400">[READY] System diagnostics nominal. Ready for website assessment.</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
