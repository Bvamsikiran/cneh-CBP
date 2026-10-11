/**
 * ML-Based Website Vulnerability Detection Simulator
 * API & Storage Service Layer
 * 
 * Supports both:
 * 1. Future Python/FastAPI backend (http://localhost:8000/api/*)
 * 2. Deterministic client-side academic simulation with localStorage persistence
 */

import {
  AnalysisResult,
  ConfusionMatrixData,
  FeatureImportanceItem,
  ModelMetrics,
  ReconFeatures,
} from '../types';
import { runReconInference } from './analysisEngine';
import {
  FEATURE_IMPORTANCE_LIST,
  generateInitialHistory,
  MODEL_BENCHMARKS,
  SAMPLE_CONFUSION_MATRIX,
} from '../data/sampleData';

const STORAGE_KEY = 'cneh_vuln_sim_history_v2';
const SETTINGS_KEY = 'cneh_vuln_sim_settings';

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  reportFormat: 'pdf' | 'json' | 'csv';
  includeAcademicDisclaimer: boolean;
  backendApiUrl: string;
  scannerApiUrl: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  reportFormat: 'pdf',
  includeAcademicDisclaimer: true,
  backendApiUrl: 'http://localhost:8000',
  scannerApiUrl: 'http://localhost:8080',
};

class AnalysisApiService {
  private isBackendOnline = false;

  /**
   * Health check for Python/FastAPI ML Backend
   */
  async checkBackendHealth(): Promise<{ online: boolean; message: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const res = await fetch('/api/health', { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        this.isBackendOnline = true;
        return { online: true, message: 'ML Model Connected (FastAPI Scikit-Learn)' };
      }
    } catch {
      // Backend not running in this environment
    }
    this.isBackendOnline = false;
    return {
      online: false,
      message: 'DEMO MODE (Academic Heuristic Simulator — No Python Server)',
    };
  }

  isOnline(): boolean {
    return this.isBackendOnline;
  }

  /**
   * Submit 24 reconnaissance features for inference
   */
  async analyzeWebsite(features: ReconFeatures): Promise<AnalysisResult> {
    const result = runReconInference(features, false);
    this.saveAnalysis(result);
    return result;
  }

  /**
   * Retrieve all saved analyses from localStorage
   */
  getHistory(): AnalysisResult[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load history from storage:', e);
    }
    // Initialize with standard academic demo targets
    const initial = generateInitialHistory();
    this.saveHistory(initial);
    return initial;
  }

  saveAnalysis(item: AnalysisResult): AnalysisResult[] {
    const list = this.getHistory();
    const existingIndex = list.findIndex((a) => a.id === item.id);
    let updated: AnalysisResult[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = item;
    } else {
      updated = [item, ...list];
    }
    this.saveHistory(updated);
    return updated;
  }

  saveAnalysisToHistory(item: AnalysisResult): void {
    this.saveAnalysis(item);
  }

  deleteAnalysis(id: string): AnalysisResult[] {
    const list = this.getHistory().filter((a) => a.id !== id);
    this.saveHistory(list);
    return list;
  }

  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  resetBenchmarkData(): AnalysisResult[] {
    const fresh = generateInitialHistory();
    this.saveHistory(fresh);
    return fresh;
  }

  private saveHistory(list: AnalysisResult[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save history to storage:', e);
    }
  }

  /**
   * Optional Scanner Verification (OWASP ZAP integration point)
   */
  async verifyWithScanner(analysis: AnalysisResult): Promise<AnalysisResult> {
    const updated = runReconInference(analysis.features, true);
    updated.id = analysis.id;
    updated.timestamp = analysis.timestamp;
    updated.targetName = analysis.targetName;
    updated.websiteUrl = analysis.websiteUrl;
    updated.resolvedIp = analysis.resolvedIp;
    updated.status = 'Verified (OWASP ZAP)';

    this.saveAnalysis(updated);
    return updated;
  }

  /**
   * Retrieve Model Performance benchmarks
   */
  getModelBenchmarks(): ModelMetrics[] {
    return MODEL_BENCHMARKS;
  }

  getConfusionMatrix(): ConfusionMatrixData {
    return SAMPLE_CONFUSION_MATRIX;
  }

  getFeatureImportance(): FeatureImportanceItem[] {
    return FEATURE_IMPORTANCE_LIST;
  }

  getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load settings:', e);
    }
    return DEFAULT_SETTINGS;
  }

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }
}

export const apiService = new AnalysisApiService();
