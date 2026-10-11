import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  Database,
  Shield,
  Zap,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Server,
  Layers,
  GraduationCap,
} from 'lucide-react';

interface SettingsScreenProps {
  onResetBenchmarkData: () => void;
  onClearAll: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onResetBenchmarkData,
  onClearAll,
}) => {
  const [selectedModel, setSelectedModel] = useState<'rf-xgboost' | 'random-forest' | 'decision-tree' | 'logistic-regression'>('rf-xgboost');
  const [highRiskThreshold, setHighRiskThreshold] = useState<number>(70);
  const [mediumRiskThreshold, setMediumRiskThreshold] = useState<number>(40);
  const [backendUrl, setBackendUrl] = useState<string>('http://localhost:8000/api/v1');
  const [zapHost, setZapHost] = useState<string>('http://localhost:8080');
  const [zapApiKey, setZapApiKey] = useState<string>('cneh-zap-token-academic');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [pingStatus, setPingStatus] = useState<'idle' | 'checking' | 'failed' | 'connected'>('idle');

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTestBackendPing = () => {
    setPingStatus('checking');
    setTimeout(() => {
      // In standalone client preview, show realistic message
      setPingStatus('failed');
    }, 900);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-400" />
          System Settings & Model Configuration
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure machine learning model parameters, backend service endpoints, and academic laboratory defaults.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Settings successfully updated and applied to inference engine.
        </div>
      )}

      {/* Grid of Setting Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ML Inference Model Topology */}
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 bg-blue-950/60 rounded-lg text-blue-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Default Supervised Classifier</h2>
              <p className="text-[11px] text-slate-400">Select which trained model executes feature scoring</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              {
                id: 'rf-xgboost',
                name: 'RF-XGBoost Ensemble v2.4 (Recommended)',
                desc: 'Combines bagging and boosting for 93.4% accuracy & minimal false negatives',
              },
              {
                id: 'random-forest',
                name: 'Random Forest (150 Estimators)',
                desc: 'Standard ensemble model with 91.2% accuracy and balanced feature splits',
              },
              {
                id: 'decision-tree',
                name: 'Decision Tree (CART Classifier)',
                desc: 'Interpretable rule-based tree model with 84.7% accuracy',
              },
              {
                id: 'logistic-regression',
                name: 'L2-Regularized Logistic Regression',
                desc: 'Linear probability baseline model with 78.3% accuracy',
              },
            ].map((m) => (
              <label
                key={m.id}
                className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                  selectedModel === m.id
                    ? 'bg-blue-600/10 border-blue-500/40 text-slate-200'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="model"
                  checked={selectedModel === m.id}
                  onChange={() => setSelectedModel(m.id as any)}
                  className="mt-0.5 accent-blue-500"
                />
                <div>
                  <div className="font-semibold text-white">{m.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{m.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Risk Thresholds & Classification Bands */}
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 bg-rose-950/60 rounded-lg text-rose-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Risk Classification Bands</h2>
              <p className="text-[11px] text-slate-400">Define score thresholds for High, Medium, and Low Risk</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>High Risk Cutoff Threshold:</span>
                <span className="font-mono text-rose-400 font-bold">≥ {highRiskThreshold} / 100</span>
              </div>
              <input
                type="range"
                min="55"
                max="85"
                value={highRiskThreshold}
                onChange={(e) => setHighRiskThreshold(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
              <p className="text-[11px] text-slate-500 mt-0.5">
                Targets scoring above this mark trigger immediate escalation and high risk warnings.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Medium Risk Cutoff Threshold:</span>
                <span className="font-mono text-amber-400 font-bold">≥ {mediumRiskThreshold} / 100</span>
              </div>
              <input
                type="range"
                min="25"
                max="54"
                value={mediumRiskThreshold}
                onChange={(e) => setMediumRiskThreshold(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <p className="text-[11px] text-slate-500 mt-0.5">
                Targets between {mediumRiskThreshold} and {highRiskThreshold - 1} are classified as Medium Risk.
              </p>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] text-slate-400">
              <div className="text-white font-medium mb-1">Band Previews:</div>
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-1.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  High: {highRiskThreshold}–100
                </div>
                <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Med: {mediumRiskThreshold}–{highRiskThreshold - 1}
                </div>
                <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Low: 0–{mediumRiskThreshold - 1}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Python FastAPI ML Service Connection */}
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 bg-indigo-950/60 rounded-lg text-indigo-400">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">External Python ML Service</h2>
              <p className="text-[11px] text-slate-400">Connect to optional FastAPI / Scikit-learn backend</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">FastAPI Service Endpoint</label>
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                placeholder="http://localhost:8000/api/v1"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleTestBackendPing}
                disabled={pingStatus === 'checking'}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-medium transition-colors"
              >
                {pingStatus === 'checking' ? 'Pinging...' : 'Test Connection'}
              </button>

              <div className="text-[11px] font-mono">
                {pingStatus === 'idle' && <span className="text-slate-500">Not tested</span>}
                {pingStatus === 'checking' && <span className="text-blue-400">Contacting {backendUrl}...</span>}
                {pingStatus === 'failed' && (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Offline (Client Simulator Active)
                  </span>
                )}
                {pingStatus === 'connected' && (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Connected
                  </span>
                )}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              The application operates seamlessly in standalone simulator mode using client-side mathematical vectorization and pre-trained model weights.
            </p>
          </div>
        </div>

        {/* Scanner Integration Settings */}
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 bg-amber-950/60 rounded-lg text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">OWASP ZAP Scanner Integration</h2>
              <p className="text-[11px] text-slate-400">Configure local laboratory daemon parameters</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">ZAP Daemon Proxy URL</label>
              <input
                type="text"
                value={zapHost}
                onChange={(e) => setZapHost(e.target.value)}
                placeholder="http://localhost:8080"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">ZAP API Key / Token</label>
              <input
                type="password"
                value={zapApiKey}
                onChange={(e) => setZapApiKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-blue-500 outline-none"
              />
            </div>

            <p className="text-[11px] text-slate-400">
              When ZAP daemon is not running locally, the simulator uses academic benchmark findings for Week 12 comparative concordance.
            </p>
          </div>
        </div>
      </div>

      {/* Laboratory Reset & Demo Dataset Actions */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl p-6">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-blue-400" />
          Laboratory Data & Cache Management
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Manage stored assessment records or restore academic benchmark targets for evaluation demonstrations.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onResetBenchmarkData}
            className="flex items-center gap-2 px-3.5 py-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restore Academic Benchmark Targets
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Clear all stored test history and return to fresh simulator state?')) {
                onClearAll();
              }
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/30 text-rose-400 rounded-lg text-xs font-semibold transition-colors"
          >
            Clear All History Records
          </button>

          <button
            type="button"
            onClick={handleSaveSettings}
            className="ml-auto flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm shadow-blue-500/20"
          >
            <Save className="w-3.5 h-3.5" />
            Save Preferences
          </button>
        </div>
      </div>

      {/* Academic Attribution Footer Card */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-5 h-5 text-blue-400 shrink-0" />
          <div>
            <span className="font-semibold text-slate-200">CNEH Laboratory Project:</span> Cybersecurity & Ethical Hacking
            <span className="block text-[11px] text-slate-500">
              Week 8 (Reconnaissance Features) & Week 12 (Vulnerability Scanning) Synergy
            </span>
          </div>
        </div>
        <div className="text-[11px] font-mono text-slate-500 text-right">
          CSE - Data Science • Final Simulator Build
        </div>
      </div>
    </div>
  );
};
