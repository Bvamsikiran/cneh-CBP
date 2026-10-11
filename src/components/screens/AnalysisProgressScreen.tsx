import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Loader2,
  Clock,
  ArrowRight,
  XCircle,
  Cpu,
  Layers,
  Terminal,
  Shield,
} from 'lucide-react';
import { AnalysisResult, ReconFeatures } from '../../types';
import { runReconInference } from '../../services/analysisEngine';

interface AnalysisProgressScreenProps {
  features: ReconFeatures;
  onComplete: (result: AnalysisResult) => void;
  onAbort: () => void;
}

const STAGES = [
  {
    step: 1,
    title: '1. Validating Input',
    desc: 'Target syntax, 24 feature bounds, and type constraints validated',
    latency: '00:00.12s',
  },
  {
    step: 2,
    title: '2. Processing Reconnaissance Features',
    desc: 'WHOIS, DNS, server tokens, HTTP headers, and exposure flags encoded',
    latency: '00:00.33s',
  },
  {
    step: 3,
    title: '3. Extracting ML Features',
    desc: 'Feature normalization, vector scaling, and dimensional mapping [24-dim vector ready]',
    latency: '00:00.46s',
  },
  {
    step: 4,
    title: '4. Running ML Prediction',
    desc: 'RF-XGBoost Ensemble inferencing vulnerability classifications and confidence intervals',
    latency: '00:01.34s',
  },
  {
    step: 5,
    title: '5. Calculating Risk',
    desc: 'Platt scaling calibration, composite internal security score calculation [0-100 scale]',
    latency: '00:01.82s',
  },
  {
    step: 6,
    title: '6. Preparing Results',
    desc: 'Compiling category breakdown, confidence bars, and comparative verification view',
    latency: '00:02.10s',
  },
];

export const AnalysisProgressScreen: React.FC<AnalysisProgressScreenProps> = ({
  features,
  onComplete,
  onAbort,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [progressPercent, setProgressPercent] = useState(16);
  const [logs, setLogs] = useState<string[]>([
    `[00:00.12] [VALIDATION] Schema check passed for target: ${features.websiteUrl}`,
  ]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    // Generate the deterministic result
    const result = runReconInference(features, false);
    setAnalysisResult(result);

    // Timed progression through the 6 stages
    const timer1 = setTimeout(() => {
      setCurrentStep(2);
      setProgressPercent(33);
      setLogs((prev) => [
        ...prev,
        `[00:00.45] [RECON_ENCODER] Parsing 7 feature groups (DNS, WHOIS, Security Headers, Public Exposure)...`,
      ]);
    }, 450);

    const timer2 = setTimeout(() => {
      setCurrentStep(3);
      setProgressPercent(50);
      setLogs((prev) => [
        ...prev,
        `[00:00.91] [FEATURE_ENG] 24 dimensions vectorized. Normalized min-max range [0.0, 1.0].`,
      ]);
    }, 900);

    const timer3 = setTimeout(() => {
      setCurrentStep(4);
      setProgressPercent(68);
      setLogs((prev) => [
        ...prev,
        `[00:01.34] [INFERENCE_CORE] Executing Random Forest + XGBoost calibrated ensemble weights...`,
      ]);
    }, 1400);

    const timer4 = setTimeout(() => {
      setCurrentStep(5);
      setProgressPercent(85);
      setLogs((prev) => [
        ...prev,
        `[00:01.82] [INFERENCE_CORE] Computing probability vectors for XSS, SQLi, Misconfig, Info Disclosure, Auth Risk...`,
      ]);
    }, 1900);

    const timer5 = setTimeout(() => {
      setCurrentStep(6);
      setProgressPercent(100);
      setLogs((prev) => [
        ...prev,
        `[00:02.20] [STATUS] Deterministic scoring resolved. Ready to render assessment results.`,
      ]);
    }, 2400);

    const timerComplete = setTimeout(() => {
      onComplete(result);
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timerComplete);
    };
  }, [features, onComplete]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Runtime Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <span>PIPELINE</span>
          <span>/</span>
          <span>SIMULATION EXECUTION</span>
          <span>/</span>
          <span className="text-indigo-400">STAGE 0{currentStep}: {STAGES[currentStep - 1]?.title.replace(/^\d+\.\s*/, '').toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            HEURISTIC ENGINE ACTIVE
          </span>
          <span>·</span>
          <span>RUNTIME: SCIKIT-LEARN SIMULATOR</span>
        </div>
      </div>

      {/* Screen Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Analyzing Website
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/50 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              PROCESSING DEMO ANALYSIS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            The simulator is processing the supplied website characteristics and generating a
            machine-learning-based risk assessment.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-[#0F172A] border border-slate-800 text-right shrink-0">
          <span className="text-[10px] font-mono text-slate-500 block">ELAPSED TIME</span>
          <span className="text-sm font-bold font-mono text-white">00:02.4s</span>
          <span className="text-[10px] font-mono text-emerald-400 block">Ready</span>
        </div>
      </div>

      {/* Target Domain Ingestion Card */}
      <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#0B101B] border border-slate-700 flex items-center justify-center text-indigo-400 font-mono text-sm">
            #
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 block uppercase">
              Target Domain Under Evaluation
            </span>
            <span className="text-sm font-semibold font-mono text-white">
              {features.websiteUrl}
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 ml-2">
            ACADEMIC SCOPE
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0B101B] border border-slate-800">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            24 Recon Features Ingested
          </span>
          <span className="px-2.5 py-1 rounded bg-[#0B101B] border border-slate-800">
            Job ID: #SIM-2024-8821
          </span>
          <span className="px-2.5 py-1 rounded bg-[#0B101B] border border-slate-800">
            Seed: 0x8F32C
          </span>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium">
            Total Pipeline Completion <span className="text-indigo-400 font-mono">Phase {currentStep} of 6 Active</span>
          </span>
          <span className="text-lg font-bold font-mono text-white">
            {progressPercent}% <span className="text-xs text-slate-500 font-normal">{currentStep}/6 STAGES RESOLVED</span>
          </span>
        </div>

        <div className="h-2 w-full bg-slate-800/90 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Recon parsing finished in 450ms</span>
          <span>Ensemble prediction matrix latency: ~340ms</span>
        </div>
      </div>

      {/* Grid: 6 Stages (Left) & Telemetry Console (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stages List (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-3">
            <h2 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Inference Pipeline Stages
            </h2>
            <span className="text-[10px] font-mono text-slate-500">
              ESTIMATED CYCLE: 2.6 SEC
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {STAGES.map((s) => {
              const isCompleted = s.step < currentStep || progressPercent === 100;
              const isCurrent = s.step === currentStep && progressPercent < 100;

              return (
                <div
                  key={s.step}
                  className={`p-3 rounded-md border transition-all ${
                    isCurrent
                      ? 'bg-indigo-950/20 border-indigo-500/50 shadow-sm shadow-indigo-950'
                      : isCompleted
                      ? 'bg-[#0B101B]/80 border-slate-800'
                      : 'bg-[#0B101B]/40 border-slate-800/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span
                        className={`font-medium ${
                          isCurrent
                            ? 'text-white'
                            : isCompleted
                            ? 'text-slate-300'
                            : 'text-slate-500'
                        }`}
                      >
                        {s.title}
                      </span>
                      {isCompleted && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/40">
                          COMPLETED
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-950/50 text-indigo-300 border border-indigo-800/40">
                          IN PROGRESS
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{s.latency}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 pl-6 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Console & Model Topology (5 cols) */}
        <div className="lg:col-span-5 space-y-4 flex flex-col">
          {/* Telemetry Stream Box */}
          <div className="p-4 rounded-lg bg-[#0B101B] border border-slate-800 font-mono text-[11px] flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-3">
              <span className="flex items-center gap-2 text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                SIMULATOR_TELEMETRY.LOG
              </span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                STREAMING
              </span>
            </div>

            <div className="space-y-1.5 text-slate-400 overflow-y-auto max-h-56 flex-1">
              {logs.map((log, index) => (
                <div key={index} className="leading-relaxed">
                  <span className="text-indigo-400">{log.slice(0, 11)}</span>
                  <span className="text-slate-300">{log.slice(11)}</span>
                </div>
              ))}
              {progressPercent < 100 && (
                <div className="text-slate-500 animate-pulse">&gt; Platt calibration active...</div>
              )}
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/80 text-[10px] text-slate-500 flex justify-between">
              <span>BUFFER: 4.2 KB / 64 KB</span>
              <span>PARALLEL THREADS: 8</span>
            </div>
          </div>

          {/* Model Topology Card */}
          <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800 text-xs font-mono space-y-2.5">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                Active Model Topology
              </span>
              <span className="text-indigo-400">ENSEMBLE HYBRID</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">BASE ESTIMATOR 1</span>
                <span className="text-slate-200 font-semibold">Random Forest</span>
                <span className="text-slate-400 block text-[10px]">n_estimators: 300</span>
              </div>
              <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">BASE ESTIMATOR 2</span>
                <span className="text-slate-200 font-semibold">XGBoost Classifier</span>
                <span className="text-slate-400 block text-[10px]">learning_rate: 0.05</span>
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 pt-1">
              <span>Vector Dimension: 24 Features</span>
              <span>Encoding: MinMax + OneHot</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="p-4 rounded-lg bg-[#0B101B] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 text-xs text-slate-400">
          <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            Evaluation Lock Active — Do not close this window while model inference is running.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAbort}
            className="px-4 py-2 text-xs rounded bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/80 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Abort Simulation</span>
          </button>

          <button
            onClick={() => analysisResult && onComplete(analysisResult)}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Proceed to Results</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
