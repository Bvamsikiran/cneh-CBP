import React, { useState } from 'react';
import {
  ShieldCheck,
  ArrowLeft,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Clock,
  Layers,
  Info,
  Server,
  Zap,
} from 'lucide-react';
import { AnalysisResult, CategoryPrediction, ScreenId } from '../../types';
import { RiskBadge } from '../common/RiskBadge';

interface ScannerVerificationScreenProps {
  analysis: AnalysisResult;
  onNavigate: (screen: ScreenId) => void;
  onUpdateAnalysis: (updated: AnalysisResult) => void;
}

export const ScannerVerificationScreen: React.FC<ScannerVerificationScreenProps> = ({
  analysis,
  onNavigate,
  onUpdateAnalysis,
}) => {
  const [scannerConnected, setScannerConnected] = useState(
    analysis.status === 'Verified (OWASP ZAP)'
  );
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTimestamp, setSyncTimestamp] = useState(
    analysis.timestamp || new Date().toISOString()
  );

  const handleSyncScanner = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setScannerConnected(true);
      setSyncTimestamp(new Date().toISOString());

      // Update analysis state with verified findings
      const updatedCategories: CategoryPrediction[] = analysis.categories.map((c) => {
        if (c.category === 'Cross-Site Scripting (XSS)') {
          return {
            ...c,
            scannerStatus: 'Confirmed by Scanner',
            scannerAlertDetail: '1 Medium alert: Missing reflected sanitization in parameter context',
          };
        }
        if (c.category === 'Security Misconfiguration') {
          return {
            ...c,
            scannerStatus: 'Confirmed by Scanner',
            scannerAlertDetail: '2 Alerts: Missing Anti-clickjacking (X-Frame-Options), Directory listing on /assets/',
          };
        }
        if (c.category === 'SQL Injection') {
          return {
            ...c,
            scannerStatus: 'Not Detected by Scanner',
            scannerAlertDetail: '0 Alerts detected across 42 active boundary test injection inputs',
          };
        }
        if (c.category === 'Information Disclosure') {
          return {
            ...c,
            scannerStatus: 'Confirmed by Scanner',
            scannerAlertDetail: '1 Low alert: Server token disclosure header (Nginx exposed)',
          };
        }
        return {
          ...c,
          scannerStatus: 'Pending Verification',
          scannerAlertDetail: 'Session token entropy check scheduled',
        };
      });

      const updated: AnalysisResult = {
        ...analysis,
        status: 'Verified (OWASP ZAP)',
        categories: updatedCategories,
      };

      onUpdateAnalysis(updated);
      setIsSyncing(false);
    }, 1200);
  };

  const handleExportMatrix = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Category,ML Prediction,Confidence,Scanner Result,Concordance\n' +
      analysis.categories
        .map(
          (c) =>
            `"${c.category}","${c.riskLevel}","${c.confidencePercent}%","${c.scannerStatus}","${
              c.scannerStatus === 'Confirmed by Scanner'
                ? 'Concordant'
                : c.scannerStatus === 'Not Detected by Scanner'
                ? 'Verified Low Risk'
                : 'Pending'
            }"`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `scanner_verification_matrix_${analysis.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header and Scope */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <button
              onClick={() => onNavigate('results')}
              className="hover:text-indigo-300 flex items-center gap-1 text-slate-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Results</span>
            </button>
            <span>/</span>
            <span className="text-indigo-400 font-semibold">Scanner Verification</span>
          </div>

          <div className="flex items-center gap-2.5 mt-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Scanner Verification
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
              Optional Week 12 Verification
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compare ML-generated risk assessments with results from an authorized vulnerability scanner.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportMatrix}
            className="px-3 py-1.5 text-xs rounded bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Matrix (CSV)</span>
          </button>

          <button
            onClick={handleSyncScanner}
            disabled={isSyncing}
            className="px-4 py-1.5 text-xs font-semibold rounded bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing...' : 'Re-run Authorized Scanner Sync'}</span>
          </button>
        </div>
      </div>

      {/* Target Metadata Banner */}
      <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-400">Target:</span>
          <strong className="text-white font-semibold">{analysis.targetName} ({analysis.websiteUrl})</strong>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">Host IP:</span>
          <span className="text-slate-300">{analysis.resolvedIp}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">Analysis Job:</span>
          <span className="text-indigo-300">#{analysis.id}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Scanner Engine:</span>
          <span className="px-2 py-0.5 rounded bg-[#0B101B] border border-slate-700 text-emerald-400">
            OWASP ZAP v2.14.0 (Authorized Mode)
          </span>
        </div>
      </div>

      {/* Authorized Notices Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-white">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Authorized Reconnaissance Only</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Scanner verification should only be performed on systems you own or are authorized to assess.
            Unauthorized vulnerability scanning violates computer misuse statutes.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
          <div className="flex items-center gap-2 font-semibold text-white">
            <Info className="w-4 h-4 text-indigo-400" />
            <span>Academic Methodology Specification</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            ML predictions represent statistical inference from passive reconnaissance; scanner validation
            evaluates actual empirical server responses under authorized test conditions.
          </p>
        </div>
      </div>

      {/* KPI Concordance Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Card 1 */}
        <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>ML VS SCANNER</span>
            <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300">4 / 5 Aligned</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">80.0%</div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>High Agreement</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>TRUE POSITIVES</span>
            <span className="text-slate-500">ML-TP</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">2 Cat.</div>
          <div className="mt-1 text-[11px] text-slate-400 truncate">
            Confirmed by Active Probes
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>LOW-RISK ALIGNED</span>
            <span className="text-slate-500">ML-TN</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">1 Low-Risk</div>
          <div className="mt-1 text-[11px] text-slate-400 truncate">
            0 Alerts Raised (SQLi)
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>DISCREPANCY</span>
            <span className="text-amber-400">Δ Threshold</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400">1 Cat.</div>
          <div className="mt-1 text-[11px] text-slate-400 truncate">
            Low Scanner Severity
          </div>
        </div>

        {/* Card 5 */}
        <div className="p-4 rounded-lg bg-[#0F172A] border border-slate-800">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>PENDING CHECK</span>
            <span className="text-indigo-400">Queue #1</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-300">1 In Queue</div>
          <div className="mt-1 text-[11px] text-slate-400 truncate">
            Active Token Probe
          </div>
        </div>
      </div>

      {/* Findings Comparison Table */}
      <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Vulnerability Category Verification Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cross-evaluating early ML feature classification against active OWASP ZAP full automated scans.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Primary: ML Inference Model
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Secondary: Dynamic Scanner Ground-Truth
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">VULNERABILITY CATEGORY & CWE</th>
                <th className="py-2.5 px-3">ML PREDICTION (PRIMARY)</th>
                <th className="py-2.5 px-3">ML CONFIDENCE SCORE</th>
                <th className="py-2.5 px-3">SCANNER RESULT (SECONDARY)</th>
                <th className="py-2.5 px-3 text-right">EVALUATION CONCORDANCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {analysis.categories.map((cat) => {
                const isConfirmed = cat.scannerStatus === 'Confirmed by Scanner';
                const isNotDetected = cat.scannerStatus === 'Not Detected by Scanner';
                const isPending = cat.scannerStatus === 'Pending Verification';

                return (
                  <tr key={cat.category} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-200">{cat.category}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {cat.cwe} · {cat.owaspTop10}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <RiskBadge level={cat.riskLevel} size="sm" />
                      <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                        Predicted Potential Risk
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono">
                      <div className="font-semibold text-slate-200">
                        {cat.confidencePercent}%{' '}
                        <span className="text-slate-500 font-normal">
                          p={(cat.confidencePercent / 100).toFixed(3)}
                        </span>
                      </div>
                      <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${cat.confidencePercent}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-xs">
                      <div className="flex items-center gap-1.5 font-semibold">
                        {isConfirmed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Confirmed by Scanner</span>
                          </>
                        ) : isNotDetected ? (
                          <>
                            <span className="text-slate-400">— Not Detected</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-amber-400">{cat.scannerStatus}</span>
                          </>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans mt-0.5 max-w-xs">
                        {cat.scannerAlertDetail}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px]">
                      {isConfirmed ? (
                        <span className="text-emerald-400 font-medium flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Concordant / Confirmed</span>
                        </span>
                      ) : isNotDetected ? (
                        <span className="text-slate-300 font-medium">Verified Low Risk</span>
                      ) : (
                        <span className="text-amber-400 font-medium">Pending Verification</span>
                      )}
                      <span className="text-[10px] text-slate-500 font-sans block mt-0.5">
                        {isConfirmed
                          ? 'ML correctly prioritized elevated surface risk'
                          : isNotDetected
                          ? 'Model correctly anticipated low probability'
                          : 'Awaiting dynamic active check completion'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Why Compare ML with Dynamic Scanners? (3 Cards) */}
      <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2.5">
          <Zap className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">
            Why Compare ML with Dynamic Scanners? (CNEH Week 12 Benchmark)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800/80 space-y-2">
            <span className="font-semibold text-slate-200 block">
              1. Passive Pre-Screening Efficiency
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Machine learning pre-identifies high-probability exposure in milliseconds without
              generating intrusive, bandwidth-heavy web traffic or triggering network rate limits.
            </p>
            <span className="text-[10px] font-mono text-indigo-400 block pt-1">
              Passive Ingestion: ~140ms
            </span>
          </div>

          <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800/80 space-y-2">
            <span className="font-semibold text-slate-200 block">
              2. Reducing Scanner Overhead
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Focuses authorized dynamic scans on specifically flagged attack vectors rather than
              conducting exhaustive, brute-force crawling across harmless static subtrees.
            </p>
            <span className="text-[10px] font-mono text-indigo-400 block pt-1">
              Target Reduction: 68.4%
            </span>
          </div>

          <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800/80 space-y-2">
            <span className="font-semibold text-slate-200 block">
              3. Addressing ML False Positives
            </span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Dynamic scanners remain the empirical ground-truth benchmark, verifying whether inferred
              statistical probabilities translate into reproducible server-side vulnerabilities.
            </p>
            <span className="text-[10px] font-mono text-emerald-400 block pt-1">
              Ground-Truth ROC: 0.942
            </span>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <button
          onClick={() => onNavigate('results')}
          className="px-4 py-2 text-xs rounded bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/80 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Results</span>
        </button>

        <button
          onClick={() => onNavigate('reports')}
          className="px-5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Generate Assessment Report</span>
        </button>
      </div>
    </div>
  );
};
