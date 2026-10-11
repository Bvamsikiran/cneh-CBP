import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  BarChart2,
  Cpu,
  ShieldCheck,
  FileText,
  History,
  Settings,
  Activity,
  BookOpen,
  Play,
  ShieldAlert,
} from 'lucide-react';
import { ScreenId } from '../../types';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenDiagnostics: () => void;
  onOpenDocs: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  onOpenDiagnostics,
  onOpenDocs,
}) => {
  const navItems: { id: ScreenId; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'new-analysis', label: 'New Analysis', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'results', label: 'Results', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'model-performance', label: 'Model Performance', icon: <Cpu className="w-4 h-4" /> },
    { id: 'scanner-verification', label: 'Scanner Verification', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-[#090D16] border-r border-slate-800/80 flex flex-col shrink-0 min-h-screen text-slate-300 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-tight leading-tight">
              ML Vuln Simulator
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">Academic CNEH Framework</p>
          </div>
        </div>

        {/* Primary Inference Action */}
        <button
          onClick={() => onNavigate('new-analysis')}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-md bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-950 transition-colors"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Run Inference</span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            currentScreen === item.id ||
            (item.id === 'results' && currentScreen === 'vuln-details') ||
            (item.id === 'new-analysis' && currentScreen === 'progress');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-all ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 font-semibold border-l-2 border-indigo-500 pl-2.5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Diagnostic Controls */}
      <div className="p-4 border-t border-slate-800/60 space-y-2 text-xs text-slate-400">
        <button
          onClick={onOpenDiagnostics}
          className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-slate-800/40 hover:text-slate-200 transition-colors text-left"
        >
          <Activity className="w-3.5 h-3.5 text-slate-400" />
          <span>System Diagnostics</span>
        </button>

        <button
          onClick={onOpenDocs}
          className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-slate-800/40 hover:text-slate-200 transition-colors text-left"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span>Documentation / Rubric</span>
        </button>

        <div className="pt-2">
          <div className="px-2.5 py-1.5 rounded bg-slate-900/80 border border-slate-800 flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              INFERENCE ENGINE
            </span>
            <span className="text-slate-300 font-medium">STANDBY</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
