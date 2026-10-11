import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  FileText,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  PlusCircle,
  Eye,
} from 'lucide-react';
import { AnalysisResult, RiskLevel, ScreenId } from '../../types';
import { RiskBadge } from '../common/RiskBadge';

interface HistoryScreenProps {
  history: AnalysisResult[];
  onSelectAnalysis: (result: AnalysisResult) => void;
  onNavigate: (screen: ScreenId) => void;
  onClearHistory: () => void;
  onDeleteAnalysis: (id: string) => void;
  onRerunAnalysis: (result: AnalysisResult) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onSelectAnalysis,
  onNavigate,
  onClearHistory,
  onDeleteAnalysis,
  onRerunAnalysis,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'risk-desc' | 'posture-desc'>('date-desc');

  const filtered = history.filter((item) => {
    const matchesSearch =
      item.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.websiteUrl.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || item.overallRiskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  }).sort((a, b) => {
    if (sortBy === 'date-desc') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    if (sortBy === 'date-asc') return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    if (sortBy === 'risk-desc') return Math.round(b.overallRiskProbability * 100) - Math.round(a.overallRiskProbability * 100);
    if (sortBy === 'posture-desc') return b.securityPostureScore - a.securityPostureScore;
    return 0;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-blue-400" />
            Analysis History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Archived reconnaissance datasets, inference runs, and scanner verification concordance records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('new-analysis')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm shadow-blue-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            New Assessment
          </button>
          {history.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear stored analysis history? (Default demo benchmark items can be re-initialized from Settings)')) {
                  onClearHistory();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/50 text-slate-400 hover:text-rose-400 rounded-lg text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search targets or URLs..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Risk:</span>
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              {(['ALL', 'High', 'Medium', 'Low'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRiskFilter(r)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    riskFilter === r ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="risk-desc">Highest Risk Probability</option>
              <option value="posture-desc">Highest Security Posture</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table or Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-12 text-center">
          <History className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Analyses Match Criteria</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or risk filter, or run a new reconnaissance analysis.
          </p>
        </div>
      ) : (
        <div className="bg-[#111726] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800 text-[11px]">
                <tr>
                  <th className="py-3 px-4">Target Information</th>
                  <th className="py-3 px-4">Predicted Risk</th>
                  <th className="py-3 px-4">Posture Score</th>
                  <th className="py-3 px-4">Vuln Categories</th>
                  <th className="py-3 px-4">Scanner Status</th>
                  <th className="py-3 px-4">Assessment Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-900/40 transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {item.targetName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="truncate max-w-[200px]">{item.websiteUrl}</span>
                        {item.isDemoData && (
                          <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-sans uppercase">
                            DEMO
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <RiskBadge level={item.overallRiskLevel} size="sm" />
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono">{item.securityPostureScore}/100</span>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.securityPostureScore >= 80 ? 'bg-emerald-500' :
                              item.securityPostureScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${item.securityPostureScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-300">
                        {item.categories.length} categories
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {item.highRiskCount} High • {item.mediumRiskCount} Med
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-mono text-emerald-400 text-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                      {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            onSelectAnalysis(item);
                            onNavigate('results');
                          }}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-md transition-colors"
                          title="View Results"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            onSelectAnalysis(item);
                            onNavigate('reports');
                          }}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-blue-400 rounded-md transition-colors"
                          title="View Report"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onRerunAnalysis(item)}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded-md transition-colors"
                          title="Re-run Reconnaissance Simulation"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteAnalysis(item.id)}
                          className="p-1.5 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 rounded-md transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Showing {filtered.length} of {history.length} assessment records</span>
            <span className="font-mono text-[11px]">Storage: Local Browser Persistence (Simulated REST Sync)</span>
          </div>
        </div>
      )}
    </div>
  );
};
