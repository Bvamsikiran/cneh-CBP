import React from 'react';
import {
  Bell,
  Code2,
  SlidersHorizontal,
  Download,
  Plus,
  Terminal,
  Activity,
} from 'lucide-react';
import { ScreenId } from '../../types';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  isBackendConnected: boolean;
  onExportEvaluation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  isBackendConnected,
  onExportEvaluation,
}) => {
  return (
    <header className="h-14 bg-[#0B101B] border-b border-slate-800/80 px-6 flex items-center justify-between gap-4 shrink-0 text-slate-300">
      {/* Title & Academic Scope Badges */}
      <div className="flex items-center gap-3 min-w-0">
        <h2 className="text-xs sm:text-sm font-semibold text-white truncate">
          ML-Based Website Vulnerability Detection Simulator
        </h2>

        <div className="hidden lg:flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">
            Academic CNEH Simulator
          </span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1.5 border ${
              isBackendConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'
              }`}
            />
            {isBackendConnected ? 'ML Backend Connected' : 'Simulator Mode — Academic CNEH'}
          </span>
        </div>
      </div>

      {/* Action Zone */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={() => onNavigate('model-performance')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          title="View Model Weights & Cross-Validation Metrics"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Model Weights</span>
        </button>

        <button
          onClick={() => onNavigate('scanner-verification')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          title="View CNEH Week 12 Scanner Benchmarks"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>CNEH Benchmarks</span>
        </button>

        <button
          onClick={onExportEvaluation}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700/80 transition-colors"
          title="Export Evaluation Metrics (CSV/JSON)"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Evaluation</span>
        </button>

        {currentScreen !== 'new-analysis' && (
          <button
            onClick={() => onNavigate('new-analysis')}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </button>
        )}

        <div className="w-px h-5 bg-slate-800 mx-1 hidden sm:block" />

        {/* Evaluator Badge */}
        <div className="hidden sm:flex items-center gap-2 pl-1">
          <div className="w-7 h-7 rounded bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center text-xs font-bold font-mono">
            LR
          </div>
          <div className="text-left hidden xl:block">
            <div className="text-[11px] font-semibold text-slate-200 leading-tight">Lead Researcher</div>
            <div className="text-[9px] text-slate-500 font-mono">CSE-DS Lab #04</div>
          </div>
        </div>
      </div>
    </header>
  );
};
