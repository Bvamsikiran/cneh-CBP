import React from 'react';
import {
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  FileText,
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { AnalysisResult, CategoryPrediction, ScreenId } from '../../types';
import { RiskBadge } from '../common/RiskBadge';

interface ResultsScreenProps {
  analysis: AnalysisResult;
  onNavigate: (screen: ScreenId) => void;
  onSelectCategory: (category: CategoryPrediction) => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  analysis,
  onNavigate,
  onSelectCategory,
}) => {
  const {
    targetName,
    websiteUrl,
    securityPostureScore,
    overallRiskLevel,
    categories,
    featureAttributions,
    id,
    timestamp,
    status,
  } = analysis;

  const scoreColor =
    securityPostureScore > 75
      ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20'
      : securityPostureScore > 50
      ? 'text-amber-400 border-amber-500/40 bg-amber-950/20'
      : 'text-rose-400 border-rose-500/40 bg-rose-950/20';

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Target Banner */}
      <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {targetName}
            </h1>
            <a
              href={`https://${websiteUrl}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-[#0B101B] px-2 py-1 rounded border border-slate-800"
            >
              <span>{websiteUrl}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {status}
            </span>
          </div>

          <div className="text-left md:text-right text-[11px] font-mono text-slate-400">
            <span className="block text-slate-300">Calibration Method</span>
            <span className="text-indigo-300">Platt-Calibrated RF-XGB</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 pt-1 border-t border-slate-800/60">
          <span>
            Analysis Date:{' '}
            <strong className="text-slate-300 font-normal">
              {new Date(timestamp).toUTCString()}
            </strong>
          </span>
          <span>·</span>
          <span>
            Job ID: <strong className="text-slate-300 font-normal">#{id}</strong>
          </span>
          <span>·</span>
          <span className="text-indigo-300">
            Feature Vector: 24 Dimensions (Extracted from Week 8 Recon)
          </span>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Composite Security Posture Score */}
        <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              Internal Security Score
            </span>
            <RiskBadge level={overallRiskLevel} size="sm" />
          </div>

          <div className="my-4 flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full border-2 flex items-center justify-center font-mono font-bold text-2xl ${scoreColor}`}
            >
              {securityPostureScore}
            </div>
            <div className="text-xs">
              <span className="text-slate-200 font-semibold block">
                {securityPostureScore < 50
                  ? 'Elevated Vulnerability Potential'
                  : securityPostureScore < 75
                  ? 'Moderate Defense Posture'
                  : 'Robust Defensive Posture'}
              </span>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Score ranges from 0 (Weak) to 100 (Hardened).
              </span>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-800/80 flex items-center gap-1.5">
            <Info className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Internal project metric, not an official industry standard.</span>
          </div>
        </div>

        {/* High Risk Count */}
        <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-rose-400">HIGH RISK</span>
            <span className="text-slate-500 text-[10px]">P(risk) &gt; 80%</span>
          </div>

          <div className="my-3">
            <div className="text-3xl font-bold font-mono text-rose-400 tracking-tight">
              {analysis.highRiskCount}
            </div>
            <span className="text-xs text-slate-400">Categories Identified</span>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 space-y-0.5">
            {categories
              .filter((c) => c.riskLevel === 'High')
              .map((c) => (
                <div key={c.category} className="truncate text-slate-300">
                  · {c.category}
                </div>
              ))}
            {analysis.highRiskCount === 0 && (
              <div className="text-slate-500">None observed</div>
            )}
          </div>
        </div>

        {/* Medium Risk Count */}
        <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-amber-400">MEDIUM RISK</span>
            <span className="text-slate-500 text-[10px]">P(risk) 40–80%</span>
          </div>

          <div className="my-3">
            <div className="text-3xl font-bold font-mono text-amber-400 tracking-tight">
              {analysis.mediumRiskCount}
            </div>
            <span className="text-xs text-slate-400">Categories Identified</span>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 space-y-0.5">
            {categories
              .filter((c) => c.riskLevel === 'Medium')
              .map((c) => (
                <div key={c.category} className="truncate text-slate-300">
                  · {c.category}
                </div>
              ))}
            {analysis.mediumRiskCount === 0 && (
              <div className="text-slate-500">None observed</div>
            )}
          </div>
        </div>

        {/* Low Risk Count */}
        <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400">LOW RISK</span>
            <span className="text-slate-500 text-[10px]">P(risk) &lt; 40%</span>
          </div>

          <div className="my-3">
            <div className="text-3xl font-bold font-mono text-emerald-400 tracking-tight">
              {analysis.lowRiskCount}
            </div>
            <span className="text-xs text-slate-400">Category Identified</span>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 space-y-0.5">
            {categories
              .filter((c) => c.riskLevel === 'Low')
              .map((c) => (
                <div key={c.category} className="truncate text-slate-300">
                  · {c.category}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* 5 Categories Prediction Table */}
      <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Machine-Learning Vulnerability Category Predictions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Statistical risk estimates generated by the model. Visually indicates model predictions, not proven exploits.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Ensemble Count: 5 Classes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">VULNERABILITY CATEGORY</th>
                <th className="py-2.5 px-3">RISK INDICATOR</th>
                <th className="py-2.5 px-3">PREDICTION CONFIDENCE</th>
                <th className="py-2.5 px-3">EVIDENCE / RECON FEATURES</th>
                <th className="py-2.5 px-3">VERIFICATION STATUS</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {categories.map((cat) => (
                <tr
                  key={cat.category}
                  className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                  onClick={() => {
                    onSelectCategory(cat);
                    onNavigate('vuln-details');
                  }}
                >
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                      {cat.category}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {cat.cwe} · {cat.owaspTop10}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <RiskBadge level={cat.riskLevel} size="sm" />
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="space-y-1 w-32">
                      <div className="flex justify-between text-[11px] font-mono">
                        <span className="text-slate-300 font-semibold">{cat.confidencePercent}%</span>
                        <span className="text-slate-500">
                          {cat.confidencePercent > 80 ? 'High Sig.' : cat.confidencePercent > 50 ? 'Mod. Sig.' : 'Low Sig.'}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            cat.riskLevel === 'High'
                              ? 'bg-rose-500'
                              : cat.riskLevel === 'Medium'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${cat.confidencePercent}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 max-w-xs text-slate-400 text-[11px] leading-relaxed">
                    {cat.evidence}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[11px]">
                    <span
                      className={`inline-flex items-center gap-1.5 ${
                        cat.scannerStatus === 'Confirmed by Scanner'
                          ? 'text-emerald-400'
                          : cat.scannerStatus === 'Not Detected by Scanner'
                          ? 'text-slate-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {cat.scannerStatus === 'Confirmed by Scanner' && (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      {cat.scannerStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCategory(cat);
                        onNavigate('vuln-details');
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 font-medium transition-colors"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 rounded bg-[#090D16] border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            Note: Confidence percentages indicate statistical classifier certainty based on feature vector correlation from synthetic academic training benchmarks. Reconnaissance features alone do not prove exploitability.
          </span>
        </div>
      </div>

      {/* SHAP / Key Influencing Reconnaissance Features */}
      <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Why These Results? — Key Influencing Reconnaissance Features
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Analysis of the input characteristics that exerted the highest weight on the ensemble classifier.
            </p>
          </div>
          <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/40">
            SHAP-style Feature Attribution
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {featureAttributions.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-[#0B101B] border border-slate-800/80 flex flex-col justify-between space-y-2"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-200 truncate" title={item.featureName}>
                    {item.featureName}
                  </span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      item.isProtective
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                        : 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                    }`}
                  >
                    {item.contributionPercent > 0 ? `+${item.contributionPercent}%` : `${item.contributionPercent}%`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
                Component: {item.classifierComponent}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-2 text-xs rounded bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/80 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (categories.length > 0) onSelectCategory(categories[0]);
              onNavigate('vuln-details');
            }}
            className="px-4 py-2 text-xs rounded bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>View Vulnerability Details</span>
          </button>

          <button
            onClick={() => onNavigate('scanner-verification')}
            className="px-4 py-2 text-xs rounded bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-750 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scanner Verification</span>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
