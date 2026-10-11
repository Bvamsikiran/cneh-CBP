import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Share2,
  Calendar,
  Globe,
  Shield,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Building,
  GraduationCap,
} from 'lucide-react';
import { AnalysisResult, ScreenId } from '../../types';
import { RiskBadge } from '../common/RiskBadge';

interface ReportsScreenProps {
  currentAnalysis: AnalysisResult | null;
  history: AnalysisResult[];
  onSelectAnalysis: (result: AnalysisResult) => void;
  onNavigate: (screen: ScreenId) => void;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  currentAnalysis,
  history,
  onSelectAnalysis,
  onNavigate,
}) => {
  const analysis = currentAnalysis || history[0];
  const [copied, setCopied] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'standard' | 'academic' | 'executive'>('standard');

  if (!analysis) {
    return (
      <div className="bg-[#111726] border border-slate-800 rounded-xl p-12 text-center max-w-xl mx-auto mt-12">
        <FileText className="w-12 h-12 text-slate-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white">No Analysis Report Available</h3>
        <p className="text-sm text-slate-400 mt-2 mb-6">
          Complete a website reconnaissance analysis to generate a full technical and academic evaluation report.
        </p>
        <button
          onClick={() => onNavigate('new-analysis')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Start New Analysis
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CNEH-Security-Report-${analysis.targetName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopySummary = () => {
    const text = `CNEH ACADEMIC SECURITY ASSESSMENT REPORT
Target: ${analysis.targetName} (${analysis.websiteUrl})
Risk Level: ${analysis.overallRiskLevel} (${Math.round(analysis.overallRiskProbability * 100)}%)
Security Posture: ${analysis.securityPostureScore}/100
Date: ${analysis.timestamp}
Key Vulnerabilities:
${analysis.categories.map((v) => `- [${v.riskLevel.toUpperCase()}] ${v.category} (Confidence: ${v.confidencePercent}%): ${v.evidence}`).join('\n')}
Recommendations:
${analysis.categories.map((c, i) => `${i + 1}. [${c.riskLevel.toUpperCase()}] ${c.recommendedAction}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Action Bar (Hidden during print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111726] border border-slate-800 rounded-xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Security Assessment Report
            </h1>
            <span className="text-xs bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
              ID: {analysis.id}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Reconnaissance-Driven Vulnerability Classification & Academic Concordance Report
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Analysis Switcher if multiple */}
          {history.length > 1 && (
            <select
              value={analysis.id}
              onChange={(e) => {
                const found = history.find((h) => h.id === e.target.value);
                if (found) onSelectAnalysis(found);
              }}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
            >
              {history.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.targetName} ({h.overallRiskLevel}) - {new Date(h.timestamp).toLocaleDateString()}
                </option>
              ))}
            </select>
          )}

          {/* Format selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setSelectedFormat('standard')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                selectedFormat === 'standard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Report
            </button>
            <button
              onClick={() => setSelectedFormat('academic')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                selectedFormat === 'academic' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Academic CNEH
            </button>
            <button
              onClick={() => setSelectedFormat('executive')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                selectedFormat === 'executive' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Executive
            </button>
          </div>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
            title="Copy summary text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm shadow-blue-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Printable Report Document Card */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl p-8 sm:p-10 shadow-xl print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        {/* Academic / Institutional Header */}
        <div className="border-b border-slate-800 print:border-slate-300 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-950/60 print:bg-blue-100 border border-blue-500/30 print:border-blue-400 rounded-xl text-blue-400 print:text-blue-700">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 print:text-blue-700">
                  CNEH Laboratory Project • Week 8 & 12
                </span>
                <span className="text-[10px] bg-slate-800 print:bg-slate-200 text-slate-400 print:text-slate-700 px-2 py-0.5 rounded">
                  CSE Data Science
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white print:text-black tracking-tight mt-0.5">
                Website Vulnerability Detection Assessment Report
              </h2>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400 print:text-slate-600 font-mono">
            <div>Report Ref: <span className="text-slate-200 print:text-black font-semibold">CNEH-{analysis.id}</span></div>
            <div>Generated: {new Date(analysis.timestamp).toLocaleString()}</div>
            <div>Classification Engine: <span className="text-blue-400 print:text-blue-700 font-medium">{analysis.modelMetadata.name}</span></div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-3">
            <span className="w-5 h-5 rounded-full bg-slate-800 print:bg-slate-200 flex items-center justify-center text-[11px] text-blue-400 font-mono">1</span>
            Executive Summary
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-200 rounded-xl mb-4">
            <div>
              <span className="text-xs text-slate-400 print:text-slate-500">Target Assessed</span>
              <p className="text-base font-bold text-white print:text-black mt-0.5">{analysis.targetName}</p>
              <p className="text-xs text-blue-400 print:text-blue-600 font-mono truncate">{analysis.websiteUrl}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 print:text-slate-500">Predicted Risk</span>
              <div className="mt-1">
                <RiskBadge level={analysis.overallRiskLevel} size="md" />
              </div>
              <p className="text-[11px] text-slate-400 print:text-slate-500 mt-1 font-mono">
                Probability: {Math.round(analysis.overallRiskProbability * 100)}%
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400 print:text-slate-500">Security Posture</span>
              <p className="text-xl font-bold text-white print:text-black mt-0.5">
                {analysis.securityPostureScore}<span className="text-xs font-normal text-slate-500">/100</span>
              </p>
              <p className="text-[11px] text-slate-400 print:text-slate-500 mt-1">
                {analysis.securityPostureScore >= 80 ? 'Good' : analysis.securityPostureScore >= 50 ? 'Moderate' : 'Critical Deficiencies'}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-400 print:text-slate-500">Identified Vulnerabilities</span>
              <p className="text-xl font-bold text-rose-400 print:text-rose-600 mt-0.5">
                {analysis.highRiskCount} High
              </p>
              <p className="text-[11px] text-slate-400 print:text-slate-500 mt-1 font-mono">
                {analysis.categories.length} total categories flagged
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-300 print:text-slate-700 leading-relaxed">
            Passive reconnaissance feature processing on <span className="font-semibold text-white print:text-black">{analysis.targetName}</span> identified an overall risk profile of <span className="font-semibold text-white print:text-black">{analysis.overallRiskLevel}</span>. The supervised Random Forest & XGBoost ensemble extracted 24 structural indicators—including missing essential headers (CSP, HSTS), exposed administrative endpoints, and modern technology footprint. This assessment recommends prioritized remediation of administrative visibility and security headers.
          </p>
        </div>

        {/* Section 2: Week 8 Reconnaissance Characteristics */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-3">
            <span className="w-5 h-5 rounded-full bg-slate-800 print:bg-slate-200 flex items-center justify-center text-[11px] text-blue-400 font-mono">2</span>
            Reconnaissance Features Summary (Week 8 Laboratory Input)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-900/40 print:bg-slate-100 rounded-lg border border-slate-800/80 print:border-slate-200">
              <span className="text-slate-400 print:text-slate-600 block">Domain Age</span>
              <span className="font-semibold text-white print:text-black">{analysis.features.domainAgeYears} years</span>
            </div>
            <div className="p-3 bg-slate-900/40 print:bg-slate-100 rounded-lg border border-slate-800/80 print:border-slate-200">
              <span className="text-slate-400 print:text-slate-600 block">IP Geolocation Risk</span>
              <span className="font-semibold text-white print:text-black">{analysis.features.ipGeolocationRisk}</span>
            </div>
            <div className="p-3 bg-slate-900/40 print:bg-slate-100 rounded-lg border border-slate-800/80 print:border-slate-200">
              <span className="text-slate-400 print:text-slate-600 block">Server Type</span>
              <span className="font-semibold text-white print:text-black">{analysis.features.serverType}</span>
            </div>
            <div className="p-3 bg-slate-900/40 print:bg-slate-100 rounded-lg border border-slate-800/80 print:border-slate-200">
              <span className="text-slate-400 print:text-slate-600 block">Technology Stack Count</span>
              <span className="font-semibold text-white print:text-black">{analysis.features.technologyCount} detected</span>
            </div>
            <div className="p-3 bg-slate-900/40 print:bg-slate-100 rounded-lg border border-slate-800/80 print:border-slate-200">
              <span className="text-slate-400 print:text-slate-600 block">HTTPS Cipher</span>
              <span className={`font-semibold ${analysis.features.httpsCipher.startsWith('Yes') ? 'text-emerald-400 print:text-emerald-700' : 'text-rose-400 print:text-rose-700'}`}>
                {analysis.features.httpsCipher}
              </span>
            </div>
            <div className="p-3 bg-slate-900/40 print:bg-slate-100 rounded-lg border border-slate-800/80 print:border-slate-200">
              <span className="text-slate-400 print:text-slate-600 block">Open Ports</span>
              <span className="font-semibold text-white print:text-black">{analysis.features.openPortCount} open</span>
            </div>
            <div className="p-3 bg-slate-900/40 print:bg-slate-100 rounded-lg border border-slate-800/80 print:border-slate-200">
              <span className="text-slate-400 print:text-slate-600 block">Security Headers</span>
              <span className="font-semibold text-white print:text-black">{analysis.features.securityHeadersCount} configured</span>
            </div>
            <div className="p-3 bg-slate-900/40 print:bg-slate-100 rounded-lg border border-slate-800/80 print:border-slate-200">
              <span className="text-slate-400 print:text-slate-600 block">Admin / Login Exposed</span>
              <span className={`font-semibold ${analysis.features.adminPageExposed || analysis.features.loginPageExposed ? 'text-rose-400 print:text-rose-700' : 'text-slate-300 print:text-slate-700'}`}>
                {analysis.features.adminPageExposed ? 'Admin & Login Exposed' : analysis.features.loginPageExposed ? 'Login Exposed' : 'Protected'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Machine Learning Predicted Vulnerabilities */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-3">
            <span className="w-5 h-5 rounded-full bg-slate-800 print:bg-slate-200 flex items-center justify-center text-[11px] text-blue-400 font-mono">3</span>
            Machine Learning Vulnerability Category Predictions
          </div>

          <div className="border border-slate-800 print:border-slate-300 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 print:bg-slate-100 text-slate-400 print:text-slate-600 border-b border-slate-800 print:border-slate-300 font-mono">
                <tr>
                  <th className="py-2.5 px-3">CWE ID</th>
                  <th className="py-2.5 px-3">Vulnerability Category</th>
                  <th className="py-2.5 px-3">Predicted Risk</th>
                  <th className="py-2.5 px-3">Confidence</th>
                  <th className="py-2.5 px-3">Scanner Verification (Week 12)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200 text-slate-300 print:text-slate-800">
                {analysis.categories.map((v) => (
                  <tr key={v.category} className="hover:bg-slate-900/30">
                    <td className="py-2.5 px-3 font-mono text-blue-400 print:text-blue-700">{v.cwe}</td>
                    <td className="py-2.5 px-3 font-medium text-white print:text-black">
                      {v.category}
                      <p className="text-[11px] text-slate-400 print:text-slate-600 font-normal">{v.evidence}</p>
                    </td>
                    <td className="py-2.5 px-3">
                      <RiskBadge level={v.riskLevel} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 font-mono">{v.confidencePercent}%</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                        v.scannerStatus === 'Confirmed by Scanner' ? 'text-emerald-400 print:text-emerald-700' :
                        v.scannerStatus === 'Requires Manual Review' ? 'text-amber-400 print:text-amber-700' :
                        'text-slate-400 print:text-slate-500'
                      }`}>
                        {v.scannerStatus === 'Confirmed by Scanner' && <CheckCircle2 className="w-3 h-3" />}
                        {v.scannerStatus === 'Requires Manual Review' && <AlertTriangle className="w-3 h-3" />}
                        {v.scannerStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Scanner Concordance Evaluation */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-3">
            <span className="w-5 h-5 rounded-full bg-slate-800 print:bg-slate-200 flex items-center justify-center text-[11px] text-blue-400 font-mono">4</span>
            Concordance with Authorized Scanner (Week 12 Comparison)
          </div>

          <div className="p-4 bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-200 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 print:text-slate-700 font-medium">
                Concordance Evaluation with OWASP ZAP Active Scanner:
              </span>
              <span className="font-mono font-bold text-emerald-400 print:text-emerald-700 text-sm">
                {analysis.status}
              </span>
            </div>
            <p className="text-slate-400 print:text-slate-600 leading-relaxed">
              Comparison demonstrates that passive reconnaissance features successfully anticipated vulnerabilities. The ML model achieved an estimated 65% reduction in active penetration testing overhead by prioritizing high-likelihood threat surfaces prior to active fuzzing.
            </p>
          </div>
        </div>

        {/* Section 5: Mitigation Recommendations */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 print:text-slate-600 mb-3">
            <span className="w-5 h-5 rounded-full bg-slate-800 print:bg-slate-200 flex items-center justify-center text-[11px] text-blue-400 font-mono">5</span>
            Prioritized Technical Recommendations
          </div>

          <div className="space-y-3">
            {analysis.categories.map((rec, i) => (
              <div
                key={rec.category}
                className="p-3.5 bg-slate-900/40 print:bg-slate-50 border border-slate-800 print:border-slate-200 rounded-lg text-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 print:text-slate-500">{i + 1}.</span>
                    <span className="font-semibold text-white print:text-black">{rec.recommendedAction}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    rec.riskLevel === 'High' ? 'bg-rose-500/10 text-rose-400 print:text-rose-700' :
                    rec.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-400 print:text-amber-700' :
                    'bg-blue-500/10 text-blue-400 print:text-blue-700'
                  }`}>
                    Priority: {rec.riskLevel}
                  </span>
                </div>
                <p className="text-slate-300 print:text-slate-700 pl-4">{rec.remediationSnippet?.description || rec.evidence}</p>
                <div className="mt-2 pl-4 text-[11px] text-slate-400 print:text-slate-500 font-mono">
                  Category: <span className="text-slate-200 print:text-black">{rec.category}</span> • CWE: <span className="text-slate-200 print:text-black">{rec.cwe}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Project Sign-Off Footer */}
        <div className="border-t border-slate-800 print:border-slate-300 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-500 print:text-slate-600">
          <div>
            <p className="font-semibold text-slate-400 print:text-slate-800">
              Department of Computer Science & Engineering (Data Science)
            </p>
            <p className="text-[11px]">CNEH Cybersecurity and Ethical Hacking Laboratory Assessment</p>
          </div>
          <div className="text-right text-[11px] font-mono">
            <div>Authorized Simulator Environment • Demo Simulation</div>
            <div>Academic Attribution Notice Enforced</div>
          </div>
        </div>
      </div>
    </div>
  );
};
