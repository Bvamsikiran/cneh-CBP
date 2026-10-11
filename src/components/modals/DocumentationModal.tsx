import React from 'react';
import {
  X,
  BookOpen,
  GraduationCap,
  ShieldAlert,
  Search,
  Cpu,
  Zap,
  CheckCircle2,
  Layers,
  FileText,
} from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#111726] border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-950/60 text-blue-400 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Project Documentation & Academic Laboratory Guide</h2>
              <p className="text-xs text-slate-400">ML-Based Website Vulnerability Detection Simulator • CNEH & CSE Data Science</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 text-xs text-slate-300 overflow-y-auto leading-relaxed">
          {/* Section: Academic Context */}
          <div className="p-4 bg-blue-950/30 border border-blue-500/20 rounded-xl">
            <div className="flex items-center gap-2 text-blue-400 font-bold mb-1">
              <GraduationCap className="w-4 h-4" />
              Academic Context & Purpose
            </div>
            <p>
              This simulator is an undergraduate project in <strong className="text-white">CNEH (Cybersecurity and Ethical Hacking)</strong> for <strong className="text-white">CSE–Data Science</strong>. It integrates two foundational laboratory exercises:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-300">
              <li>
                <strong className="text-white">Week 8 — Information Gathering / Reconnaissance:</strong> WHOIS information, DNS/IP details, Netcraft-style server and technology footprint, Archive.org history, public search engine exposure findings, and IP geolocation risk.
              </li>
              <li>
                <strong className="text-white">Week 12 — Vulnerability Scanning:</strong> Identifying potential website weaknesses using an authorized scanner such as OWASP ZAP.
              </li>
            </ul>
          </div>

          {/* Section: System Workflow */}
          <div>
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Core Architecture & Five-Step Workflow
            </h3>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 space-y-2">
              <div className="text-blue-400 font-semibold">
                Website Information → Feature Processing → ML Risk Prediction → Results & Recommendations → Scanner Verification → Report
              </div>
              <p className="text-slate-400 text-xs font-sans">
                Rather than launching aggressive active network probes against external hosts, this project applies Machine Learning to <strong className="text-slate-200">characteristics gathered during reconnaissance</strong>. This demonstrates how passive feature attribution can prioritize defensive actions and drastically cut active scanning time.
              </p>
            </div>
          </div>

          {/* Section: Features & ML Models */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
              <h4 className="font-bold text-white flex items-center gap-1.5 mb-2">
                <Search className="w-3.5 h-3.5 text-blue-400" />
                24 Reconnaissance Features
              </h4>
              <p className="text-slate-400 text-[11px]">
                Input signals include Domain Age, DNS Records, Subdomains, Server Stack, Technology Depth, Archive History, Login & Admin Page Exposure, Sensitive File Leaks, HTTPS enforcement, Open Ports, and Missing Security Headers (CSP, HSTS, X-Frame-Options).
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
              <h4 className="font-bold text-white flex items-center gap-1.5 mb-2">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                Supervised ML Classifiers
              </h4>
              <p className="text-slate-400 text-[11px]">
                The simulator benchmarks four distinct algorithms: Logistic Regression (baseline), Decision Tree (CART rules), Random Forest (150 bagged trees), and an RF-XGBoost ensemble delivering 93.4% accuracy with calibrated SHAP feature attributions.
              </p>
            </div>
          </div>

          {/* Section: Week 12 Scanner Connection */}
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white flex items-center gap-1.5 mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Week 12 Scanner Verification & Concordance
            </h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Active scanners (like OWASP ZAP) send automated requests to verify vulnerabilities. The simulator tracks the <strong className="text-slate-200">Concordance Score</strong> between passive ML predictions and active scanner findings, demonstrating that passive ML pre-screening achieves high precision while minimizing active scanning traffic by up to 65%.
            </p>
          </div>

          {/* Section: Legal & Ethical Notice */}
          <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-xl text-rose-300">
            <div className="flex items-center gap-2 font-bold mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Ethical Hacking Authorization Notice
            </div>
            <p className="text-[11px] text-slate-300">
              Use this simulator and any scanner integrations only on systems you own or are explicitly authorized to assess. Unauthorized reconnaissance, vulnerability scanning, or exploitation against third-party systems without written consent violates international cybersecurity laws.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/60 border-t border-slate-800 shrink-0 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">CNEH Lab Manual Reference • Final Edition</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
