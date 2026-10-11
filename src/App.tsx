/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenId, AnalysisResult, ReconFeatures, CategoryPrediction } from './types';
import { apiService } from './services/apiService';
import { DEFAULT_RECON_FEATURES } from './services/analysisEngine';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { NewAnalysisScreen } from './components/screens/NewAnalysisScreen';
import { AnalysisProgressScreen } from './components/screens/AnalysisProgressScreen';
import { ResultsScreen } from './components/screens/ResultsScreen';
import { VulnerabilityDetailsScreen } from './components/screens/VulnerabilityDetailsScreen';
import { ModelPerformanceScreen } from './components/screens/ModelPerformanceScreen';
import { ScannerVerificationScreen } from './components/screens/ScannerVerificationScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { DiagnosticsModal } from './components/modals/DiagnosticsModal';
import { DocumentationModal } from './components/modals/DocumentationModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [activeFeatures, setActiveFeatures] = useState<ReconFeatures>(DEFAULT_RECON_FEATURES);
  const [selectedCategory, setSelectedCategory] = useState<CategoryPrediction | null>(null);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Initialize history on mount
  useEffect(() => {
    const loadedHistory = apiService.getHistory();
    setHistory(loadedHistory);
    if (loadedHistory.length > 0) {
      setCurrentAnalysis(loadedHistory[0]);
      if (loadedHistory[0].categories.length > 0) {
        setSelectedCategory(loadedHistory[0].categories[0]);
      }
    }

    // Ping check
    apiService.checkBackendHealth().then((status) => {
      setIsBackendConnected(status.online);
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Start analysis flow: navigate to progress screen
  const handleStartAnalysis = (features: ReconFeatures) => {
    setActiveFeatures(features);
    setCurrentScreen('progress');
  };

  // Completion from progress screen: save and show results
  const handleAnalysisComplete = (result: AnalysisResult) => {
    const updatedHistory = apiService.saveAnalysis(result);
    setHistory(updatedHistory);
    setCurrentAnalysis(result);
    if (result.categories.length > 0) {
      setSelectedCategory(result.categories[0]);
    }
    setCurrentScreen('results');
    showToast(`Analysis completed for ${result.targetName}: ${result.overallRiskLevel} Risk predicted.`);
  };

  // Vulnerability category inspection
  const handleSelectCategory = (category: CategoryPrediction) => {
    setSelectedCategory(category);
    setCurrentScreen('vuln-details');
  };

  // Delete analysis
  const handleDeleteAnalysis = (id: string) => {
    const updated = apiService.deleteAnalysis(id);
    setHistory(updated);
    if (currentAnalysis?.id === id) {
      const next = updated[0] || null;
      setCurrentAnalysis(next);
      if (next && next.categories.length > 0) {
        setSelectedCategory(next.categories[0]);
      } else {
        setSelectedCategory(null);
      }
    }
    showToast('Assessment record deleted.');
  };

  // Clear all
  const handleClearAllHistory = () => {
    apiService.clearHistory();
    setHistory([]);
    setCurrentAnalysis(null);
    setSelectedCategory(null);
    showToast('Assessment history cleared.');
  };

  // Reset benchmark data
  const handleResetBenchmarkData = () => {
    const updated = apiService.resetBenchmarkData();
    setHistory(updated);
    if (updated.length > 0) {
      setCurrentAnalysis(updated[0]);
      setSelectedCategory(updated[0].categories[0]);
    }
    showToast('Academic benchmark targets restored.');
  };

  // Re-run an analysis
  const handleRerunAnalysis = (result: AnalysisResult) => {
    setActiveFeatures(result.features);
    setCurrentScreen('progress');
  };

  const handleUpdateAnalysis = (updated: AnalysisResult) => {
    const list = apiService.saveAnalysis(updated);
    setHistory(list);
    setCurrentAnalysis(updated);
    showToast('Analysis record updated.');
  };

  const handleExportEvaluation = () => {
    const target = currentAnalysis || history[0];
    if (!target) {
      showToast('No assessment data available to export.');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(target, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CNEH-Evaluation-${target.targetName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Evaluation exported successfully.');
  };

  const activeTarget = currentAnalysis || history[0] || null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b101b] text-slate-100 font-sans">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        onOpenDiagnostics={() => setDiagnosticsOpen(true)}
        onOpenDocs={() => setDocsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <Header
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
          isBackendConnected={isBackendConnected}
          onExportEvaluation={handleExportEvaluation}
        />

        {/* Dynamic Screen Viewport */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-6">
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              analyses={history}
              onNavigate={setCurrentScreen}
              onSelectAnalysis={(result) => {
                setCurrentAnalysis(result);
                if (result.categories.length > 0) {
                  setSelectedCategory(result.categories[0]);
                }
                setCurrentScreen('results');
              }}
            />
          )}

          {currentScreen === 'new-analysis' && (
            <NewAnalysisScreen
              onStartAnalysis={handleStartAnalysis}
            />
          )}

          {currentScreen === 'progress' && (
            <AnalysisProgressScreen
              features={activeFeatures}
              onComplete={handleAnalysisComplete}
              onAbort={() => setCurrentScreen('new-analysis')}
            />
          )}

          {currentScreen === 'results' && activeTarget && (
            <ResultsScreen
              analysis={activeTarget}
              onNavigate={setCurrentScreen}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {currentScreen === 'vuln-details' && activeTarget && (
            <VulnerabilityDetailsScreen
              analysis={activeTarget}
              selectedCategory={selectedCategory || activeTarget.categories[0]}
              onNavigate={setCurrentScreen}
              onSelectCategory={setSelectedCategory}
            />
          )}

          {currentScreen === 'model-performance' && (
            <ModelPerformanceScreen
              isBackendConnected={isBackendConnected}
            />
          )}

          {currentScreen === 'scanner-verification' && activeTarget && (
            <ScannerVerificationScreen
              analysis={activeTarget}
              onNavigate={setCurrentScreen}
              onUpdateAnalysis={handleUpdateAnalysis}
            />
          )}

          {currentScreen === 'reports' && (
            <ReportsScreen
              currentAnalysis={activeTarget}
              history={history}
              onSelectAnalysis={(result) => {
                setCurrentAnalysis(result);
                if (result.categories.length > 0) {
                  setSelectedCategory(result.categories[0]);
                }
              }}
              onNavigate={setCurrentScreen}
            />
          )}

          {currentScreen === 'history' && (
            <HistoryScreen
              history={history}
              onSelectAnalysis={(result) => {
                setCurrentAnalysis(result);
                if (result.categories.length > 0) {
                  setSelectedCategory(result.categories[0]);
                }
              }}
              onNavigate={setCurrentScreen}
              onClearHistory={handleClearAllHistory}
              onDeleteAnalysis={handleDeleteAnalysis}
              onRerunAnalysis={handleRerunAnalysis}
            />
          )}

          {currentScreen === 'settings' && (
            <SettingsScreen
              onResetBenchmarkData={handleResetBenchmarkData}
              onClearAll={handleClearAllHistory}
            />
          )}
        </main>
      </div>

      {/* Diagnostics Modal */}
      <DiagnosticsModal
        isOpen={diagnosticsOpen}
        onClose={() => setDiagnosticsOpen(false)}
        datasetCount={history.length}
      />

      {/* Documentation Modal */}
      <DocumentationModal
        isOpen={docsOpen}
        onClose={() => setDocsOpen(false)}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-slate-200 text-xs px-4 py-2.5 rounded-lg shadow-xl animate-fade-in flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
