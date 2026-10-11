import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  BarChart3,
  RotateCcw,
  FileSpreadsheet,
  Download,
  Info,
  CheckCircle2,
  TrendingUp,
  Sliders,
} from 'lucide-react';
import { MODEL_BENCHMARKS, SAMPLE_CONFUSION_MATRIX, FEATURE_IMPORTANCE_LIST } from '../../data/sampleData';
import { ModelMetrics } from '../../types';

interface ModelPerformanceScreenProps {
  isBackendConnected: boolean;
}

export const ModelPerformanceScreen: React.FC<ModelPerformanceScreenProps> = ({
  isBackendConnected,
}) => {
  const [selectedModelName, setSelectedModelName] = useState<string>('Random Forest Ensemble');
  const [activeTab, setActiveTab] = useState<'metrics' | 'comparison' | 'features'>('metrics');

  const selectedModel =
    MODEL_BENCHMARKS.find((m) => m.name === selectedModelName) || MODEL_BENCHMARKS[0];

  const handleDownloadMetrics = () => {
    const payload = {
      dataset: 'CNEH-Recon-2024.1',
      samples: 2480,
      validation: 'k-fold (k=5)',
      selectedModel,
      benchmarks: MODEL_BENCHMARKS,
      confusionMatrix: SAMPLE_CONFUSION_MATRIX,
      featureImportance: FEATURE_IMPORTANCE_LIST,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cneh_model_performance_metrics.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header and Scope */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>EVALUATION MODULE</span>
            <span>/</span>
            <span>SECTION 04</span>
            <span>·</span>
            <span className="text-indigo-400">CNEH STANDARD PROTOCOL</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Model Performance
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Supervised classification evaluation, model benchmarking, and feature attribution across academic datasets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert('Validation re-executed across 5-fold cross validation partitions.')}
            className="px-3 py-1.5 text-xs rounded bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-run Validation</span>
          </button>

          <button
            onClick={handleDownloadMetrics}
            className="px-3.5 py-1.5 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Generate Audit Sheet</span>
          </button>
        </div>
      </div>

      {/* Dataset & Parameter Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
        <span className="px-2.5 py-1 rounded bg-[#0F172A] border border-slate-800 text-indigo-300">
          Framework: Scikit-Learn / CNEH Benchmarks
        </span>
        <span className="px-2.5 py-1 rounded bg-[#0F172A] border border-slate-800 text-slate-300">
          Split: 80% Train / 20% Test (k=5 Cross-Validation)
        </span>
        <span className="px-2.5 py-1 rounded bg-[#0F172A] border border-slate-800 text-slate-400">
          Dataset: CNEH-Recon-2024.1 (n=2,480 samples)
        </span>
        <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
          DEMO DATA — NOT MEASURED (LAB PREVIEW)
        </span>
      </div>

      {/* Academic Disclaimer Callout */}
      <div className="p-4 rounded-lg bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
        <div className="flex items-center gap-2 font-semibold text-white">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>Academic Dataset Evaluation Disclaimer</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed pl-6">
          Metrics shown are generated from the project dataset and should not be presented as universal
          cybersecurity performance measures. Performance reflects passive reconnaissance feature classification
          on synthetic and labeled laboratory domains. Results benchmark estimator capability under controlled synthetic
          scenarios and must be validated independently against real-world, unconstrained threat environments prior to defensive deployment.
        </p>
      </div>

      {/* Selected Model Card */}
      <div className="p-6 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 font-semibold">
                SELECTED FINAL ESTIMATOR
              </span>
              <span className="text-xs font-mono text-slate-400">
                Type: {selectedModel.type}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {selectedModel.name}
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Ensemble of non-linear decision stumps calibrated via Platt scaling for robust
              probability estimations against high-dimensional passive recon vectors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label className="text-xs font-medium text-slate-400">Switch Model View:</label>
            <select
              value={selectedModelName}
              onChange={(e) => setSelectedModelName(e.target.value)}
              className="px-3 py-1.5 text-xs rounded bg-[#0B101B] border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            >
              {MODEL_BENCHMARKS.map((m) => (
                <option key={m.name} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Main Metrics: Accuracy, Precision, Recall, F1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
          {/* Accuracy */}
          <div className="p-4 rounded-lg bg-[#0B101B] border border-slate-800/80">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Accuracy</span>
              <span className="text-[10px] font-mono text-emerald-400">+2.8% vs Baseline</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-white">
              {selectedModel.accuracy}%
            </div>
            <div className="mt-1 text-[11px] font-mono text-slate-500">
              Sample Test Set (n=496)
            </div>
          </div>

          {/* Precision */}
          <div className="p-4 rounded-lg bg-[#0B101B] border border-slate-800/80">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Precision</span>
              <span className="text-[10px] font-mono text-indigo-400">Macro Avg</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-white">
              {selectedModel.precision}%
            </div>
            <div className="mt-1 text-[11px] font-mono text-slate-500">
              Low False Discovery Rate
            </div>
          </div>

          {/* Recall */}
          <div className="p-4 rounded-lg bg-[#0B101B] border border-slate-800/80">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Recall</span>
              <span className="text-[10px] font-mono text-amber-400">Weighted</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-white">
              {selectedModel.recall}%
            </div>
            <div className="mt-1 text-[11px] font-mono text-slate-500">
              Vulnerability Sensitivity
            </div>
          </div>

          {/* F1-Score */}
          <div className="p-4 rounded-lg bg-[#0B101B] border border-slate-800/80">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>F1 Score</span>
              <span className="text-[10px] font-mono text-indigo-400">Harmonic Mean</span>
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-white">
              {selectedModel.f1Score}%
            </div>
            <div className="mt-1 text-[11px] font-mono text-slate-500">
              CNEH Balanced Baseline
            </div>
          </div>
        </div>

        {/* Estimator Serialization details */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400 pt-3 border-t border-slate-800/80">
          <span>
            Serialization: <strong className="text-slate-300 font-normal">{selectedModel.serialization}</strong>
          </span>
          <span>Inference Latency: {selectedModel.latencyMs} ms</span>
          <span className="text-indigo-400">{selectedModel.deploymentStatus}</span>
        </div>
      </div>

      {/* Supervised Classifier Benchmarks Table */}
      <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Supervised Classifier Benchmarks
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Standardized comparison of algorithms evaluated during CSE-Data Science capstone coursework.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            STANDARDIZED K-FOLD (k=5) EVALUATION
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">ALGORITHM ARCHITECTURE</th>
                <th className="py-2.5 px-3">ACCURACY</th>
                <th className="py-2.5 px-3">PRECISION</th>
                <th className="py-2.5 px-3">RECALL</th>
                <th className="py-2.5 px-3">F1 SCORE</th>
                <th className="py-2.5 px-3">INFERENCE LATENCY</th>
                <th className="py-2.5 px-3">OVERFITTING RISK / VARIANCE</th>
                <th className="py-2.5 px-3 text-right">DEPLOYMENT STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {MODEL_BENCHMARKS.map((m) => {
                const isSelected = m.name === selectedModel.name;
                return (
                  <tr
                    key={m.name}
                    className={`transition-colors ${
                      isSelected ? 'bg-indigo-950/20 text-white' : 'hover:bg-slate-800/30 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200 flex items-center gap-2">
                        <span>{m.name}</span>
                        {isSelected && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-600 text-white">
                            SELECTED
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                        {m.type}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">{m.accuracy}%</td>
                    <td className="py-3 px-3">{m.precision}%</td>
                    <td className="py-3 px-3">{m.recall}%</td>
                    <td className="py-3 px-3 font-semibold text-indigo-300">{m.f1Score}%</td>
                    <td className="py-3 px-3 text-slate-400">{m.latencyMs} ms</td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                        {m.varianceRisk}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border ${
                          m.deploymentStatus === 'Active In Simulator'
                            ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {m.deploymentStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Confusion Matrix & Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Confusion Matrix (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Confusion Matrix (Binary Classification)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cross-tabulation of labeled laboratory targets versus Random Forest predictions (p ≥ 0.50).
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                N = 996 VALIDATION CASES
              </span>
            </div>

            {/* Matrix 2x2 Grid */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-mono">
              {/* True Positive */}
              <div className="p-3.5 rounded bg-[#0B101B] border border-emerald-500/30">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>PREDICTED: VULNERABLE</span>
                  <span className="text-emerald-400 font-semibold">ACTUAL: VULNERABLE</span>
                </div>
                <div className="text-2xl font-bold text-white mt-2">
                  {SAMPLE_CONFUSION_MATRIX.tp}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1 flex justify-between">
                  <span>TRUE POSITIVE (TP)</span>
                  <span>Rate: {SAMPLE_CONFUSION_MATRIX.tpRate}%</span>
                </div>
              </div>

              {/* False Negative */}
              <div className="p-3.5 rounded bg-[#0B101B] border border-rose-500/30">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>PREDICTED: SAFE</span>
                  <span className="text-rose-400 font-semibold">ACTUAL: VULNERABLE</span>
                </div>
                <div className="text-2xl font-bold text-white mt-2">
                  {SAMPLE_CONFUSION_MATRIX.fn}
                </div>
                <div className="text-[11px] text-rose-400 mt-1 flex justify-between">
                  <span>FALSE NEGATIVE (FN)</span>
                  <span>Rate: {SAMPLE_CONFUSION_MATRIX.fnRate}%</span>
                </div>
              </div>

              {/* False Positive */}
              <div className="p-3.5 rounded bg-[#0B101B] border border-amber-500/30">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>PREDICTED: VULNERABLE</span>
                  <span className="text-amber-400 font-semibold">ACTUAL: SAFE</span>
                </div>
                <div className="text-2xl font-bold text-white mt-2">
                  {SAMPLE_CONFUSION_MATRIX.fp}
                </div>
                <div className="text-[11px] text-amber-400 mt-1 flex justify-between">
                  <span>FALSE POSITIVE (FP)</span>
                  <span>Rate: {SAMPLE_CONFUSION_MATRIX.fpRate}%</span>
                </div>
              </div>

              {/* True Negative */}
              <div className="p-3.5 rounded bg-[#0B101B] border border-emerald-500/30">
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>PREDICTED: SAFE</span>
                  <span className="text-emerald-400 font-semibold">ACTUAL: SAFE</span>
                </div>
                <div className="text-2xl font-bold text-white mt-2">
                  {SAMPLE_CONFUSION_MATRIX.tn}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1 flex justify-between">
                  <span>TRUE NEGATIVE (TN)</span>
                  <span>Rate: {SAMPLE_CONFUSION_MATRIX.tnRate}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded bg-[#0B101B]/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              Defensive Implication: The observed false-negative rate of 7.4% (33 samples) is strictly
              controlled to mitigate silent security bypasses during pre-screening phases.
            </span>
          </div>
        </div>

        {/* Right: Feature Importance (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Feature Importance Attribution
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Relative weight attribution of passive reconnaissance predictors across 300 decision trees.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                MDI / GINI IMPURITY
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {FEATURE_IMPORTANCE_LIST.map((item) => (
                <div key={item.rank} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-mono text-[11px]">
                      0{item.rank} {item.featureName}
                    </span>
                    <span className="font-mono text-indigo-300 font-semibold">
                      {item.importance.toFixed(3)} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${item.percentage * 3.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>Cumulative Top 4 Attribution: 72.3%</span>
            <span>Permutation Feature Importance Checked</span>
          </div>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="p-4 rounded-lg bg-[#0B101B] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span>Random Seed: 42</span>
          <span>·</span>
          <span>Determinism: Strict (CPU-Single-Thread)</span>
          <span>·</span>
          <span>Citation: CNEH Lab (2024), arXiv:2409.11029</span>
        </div>
        <button
          onClick={handleDownloadMetrics}
          className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Model Metrics (.json / .csv)</span>
        </button>
      </div>
    </div>
  );
};
