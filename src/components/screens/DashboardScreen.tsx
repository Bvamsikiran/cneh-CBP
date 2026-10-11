import React from 'react';
import {
  Plus,
  ArrowUpRight,
  Shield,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { AnalysisResult, ScreenId } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { RECENT_ACTIVITY_STREAM } from '../../data/sampleData';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectAnalysis: (analysis: AnalysisResult) => void;
  analyses: AnalysisResult[];
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onSelectAnalysis,
  analyses,
}) => {
  const highRiskTotal = analyses.filter((a) => a.overallRiskLevel === 'High').length;
  const medRiskTotal = analyses.filter((a) => a.overallRiskLevel === 'Medium').length;
  const lowRiskTotal = analyses.filter((a) => a.overallRiskLevel === 'Low').length;

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Scope Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              ML-Based Website Vulnerability Detection Simulator
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
              ACADEMIC CNEH SIMULATOR
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Website security assessment using reconnaissance features and machine learning.
          </p>
        </div>

        <button
          onClick={() => onNavigate('new-analysis')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/50 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Analysis</span>
        </button>
      </div>

      {/* Architecture Context Banner */}
      <div className="flex flex-wrap items-center gap-3 py-2 px-3 rounded-md bg-[#0F172A]/70 border border-slate-800 text-xs text-slate-400">
        <span className="flex items-center gap-1.5 text-slate-300 font-medium">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          Model: RF-XGBoost Ensemble v2.4
        </span>
        <span className="text-slate-600">·</span>
        <span className="font-mono text-slate-400">Dataset: CNEH-Recon-2024.1</span>
        <span className="text-slate-600">·</span>
        <span className="text-amber-400/90 font-mono text-[11px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          Controlled Synthetic Sandbox (DEMO DATA)
        </span>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyses */}
        <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Analyses</span>
            <span className="font-mono text-[10px] text-indigo-400 bg-indigo-950/50 px-1.5 py-0.5 rounded border border-indigo-800/40">
              +12 this week
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tracking-tight">
              142
            </span>
            <span className="text-xs text-slate-500">targets</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Sample benchmark pool n=142
          </div>
        </div>

        {/* High Risk */}
        <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>High Risk</span>
            <span className="font-mono text-[10px] text-rose-400 bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-800/40">
              HIGH RISK
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-400 tracking-tight">
              {28 + highRiskTotal - 1}
            </span>
            <span className="text-xs text-slate-500">prob &gt; 80%</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Avg Risk Score: 88.4%</span>
            <span className="font-mono text-slate-500">19.7% of pool</span>
          </div>
        </div>

        {/* Medium Risk */}
        <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Medium Risk</span>
            <span className="font-mono text-[10px] text-amber-400 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-800/40">
              MED RISK
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-400 tracking-tight">
              {64 + medRiskTotal - 2}
            </span>
            <span className="text-xs text-slate-500">prob 40–80%</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Avg Security: 68/100</span>
            <span className="font-mono text-slate-500">45.1% of pool</span>
          </div>
        </div>

        {/* Low Risk */}
        <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Low Risk</span>
            <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-800/40">
              LOW RISK
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tracking-tight">
              {50 + lowRiskTotal - 2}
            </span>
            <span className="text-xs text-slate-500">prob &lt; 40%</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Synthetic test domains</span>
            <span className="font-mono text-slate-500">35.2% of pool</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Category Distributions & Live Telemetry Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Predicted Vulnerabilities by Category (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-lg bg-[#0F172A] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Predicted Vulnerabilities by Category
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cross-feature vector prevalence across simulated website sample pool
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">
                  Platt Calibration
                </span>
                <span className="text-xs font-mono text-indigo-300 font-semibold">
                  78.5% – 94.2%
                </span>
              </div>
            </div>

            {/* Category Bars List */}
            <div className="mt-4 space-y-4">
              {/* Category 1 */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-200">Security Misconfiguration</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-rose-500/10 text-rose-300 rounded border border-rose-500/30">
                      Highest Prevalence
                    </span>
                  </div>
                  <span className="font-mono text-slate-400">74 detected (52% freq)</span>
                </div>
                <div className="mt-1.5 h-2 w-full bg-slate-800/90 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '52%' }} />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Recon indicators: Missing headers, debug endpoints</span>
                  <span className="font-mono text-slate-400">Confidence: 93.8%</span>
                </div>
              </div>

              {/* Category 2 */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">Information Disclosure</span>
                  <span className="font-mono text-slate-400">62 detected (44% freq)</span>
                </div>
                <div className="mt-1.5 h-2 w-full bg-slate-800/90 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '44%' }} />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Recon indicators: Directory listings, banner exposure</span>
                  <span className="font-mono text-slate-400">Confidence: 89.1%</span>
                </div>
              </div>

              {/* Category 3 */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">Cross-Site Scripting (XSS)</span>
                  <span className="font-mono text-slate-400">58 detected (41% freq)</span>
                </div>
                <div className="mt-1.5 h-2 w-full bg-slate-800/90 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: '41%' }} />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Recon indicators: Reflected parameters, DOM sinks</span>
                  <span className="font-mono text-slate-400">Confidence: 86.4%</span>
                </div>
              </div>

              {/* Category 4 */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">Authentication-related Risk</span>
                  <span className="font-mono text-slate-400">38 detected (27% freq)</span>
                </div>
                <div className="mt-1.5 h-2 w-full bg-slate-800/90 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '27%' }} />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Recon indicators: Unprotected login forms, cookie flags</span>
                  <span className="font-mono text-slate-400">Confidence: 81.0%</span>
                </div>
              </div>

              {/* Category 5 */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">SQL Injection</span>
                  <span className="font-mono text-slate-400">19 detected (13% freq)</span>
                </div>
                <div className="mt-1.5 h-2 w-full bg-slate-800/90 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '13%' }} />
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Recon indicators: Dynamic query signatures, error echoes</span>
                  <span className="font-mono text-slate-400">Confidence: 78.5%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/70 text-[11px] text-slate-400 flex items-center gap-2">
            <span className="text-slate-500 font-mono">ℹ</span>
            <span>
              Notation: Derived from Week 8 reconnaissance feature vector distributions. Statistical risk projections only; not proof of exploitability.
            </span>
          </div>
        </div>

        {/* Right: Recent Activity / Evaluation Stream (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-lg bg-[#0F172A] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h2 className="text-sm font-semibold text-white">Recent Activity / Stream</h2>
                <p className="text-xs text-slate-400 mt-0.5">Live telemetry and pipeline logs</p>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                SIM STREAM
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {RECENT_ACTIVITY_STREAM.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-md bg-[#0B101B]/70 border border-slate-800/70 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{item.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/70 grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400">
            <div>
              <span className="text-slate-500 block">Ensemble Loss:</span>
              <span className="text-slate-300">0.142</span>
            </div>
            <div>
              <span className="text-slate-500 block">Validation Split:</span>
              <span className="text-slate-300">80/20</span>
            </div>
            <div>
              <span className="text-slate-500 block">Batch Size:</span>
              <span className="text-slate-300">64</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Analyses Table */}
      <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white">
              Recent Website Security Analyses (Simulation Data)
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/30">
              SAMPLE DEMO DATASET
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Showing {analyses.length} simulated rows
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">TARGET</th>
                <th className="py-2.5 px-3">RISK LEVEL</th>
                <th className="py-2.5 px-3">SECURITY POSTURE SCORE</th>
                <th className="py-2.5 px-3">DATE</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {analyses.map((analysis) => {
                const scoreColor =
                  analysis.securityPostureScore > 75
                    ? 'text-emerald-400'
                    : analysis.securityPostureScore > 50
                    ? 'text-amber-400'
                    : 'text-rose-400';

                return (
                  <tr
                    key={analysis.id}
                    className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                    onClick={() => {
                      onSelectAnalysis(analysis);
                      onNavigate('results');
                    }}
                  >
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {analysis.websiteUrl}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {analysis.targetName}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <RiskBadge level={analysis.overallRiskLevel} size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-semibold ${scoreColor}`}>
                          {analysis.securityPostureScore}/100
                        </span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              analysis.securityPostureScore > 75
                                ? 'bg-emerald-500'
                                : analysis.securityPostureScore > 50
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${analysis.securityPostureScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {new Date(analysis.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
                        {analysis.status === 'Verified (OWASP ZAP)' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Verified (OWASP ZAP)</span>
                          </>
                        ) : (
                          <>
                            <Activity className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{analysis.status}</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAnalysis(analysis);
                          onNavigate('results');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-indigo-600 hover:text-white text-slate-300 font-medium transition-colors"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Academic Protocol Notice */}
        <div className="p-3 rounded bg-[#090D16] border border-slate-800/80 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Academic Rubric Component: CNEH-SecOps Validation Protocol (Fall Term)</span>
          </span>
          <span className="font-mono text-slate-500">Confidence Interval: 95% Bootstrap</span>
        </div>
      </div>
    </div>
  );
};
