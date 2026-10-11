/**
 * ML-Based Website Vulnerability Detection Simulator
 * Academic Datasets and Pre-calculated Evaluation Benchmarks
 * 
 * ALL DATA IN THIS MODULE IS DEMO/BENCHMARK DATA FOR ACADEMIC PREVIEW.
 */

import {
  AnalysisResult,
  ConfusionMatrixData,
  FeatureImportanceItem,
  ModelMetrics,
} from '../types';
import { runReconInference, DEFAULT_RECON_FEATURES } from '../services/analysisEngine';

/**
 * Supervised Classifier Benchmarks comparing classical algorithms (CNEH Coursework)
 */
export const MODEL_BENCHMARKS: ModelMetrics[] = [
  {
    name: 'Random Forest Ensemble',
    type: 'Supervised Ensemble (300 Trees)',
    accuracy: 92.4,
    precision: 89.8,
    recall: 91.2,
    f1Score: 90.5,
    latencyMs: 3.14,
    estimators: 300,
    maxDepth: 18,
    splitCriterion: 'gini',
    serialization: 'cneh_rf_2024.joblib (14.2 MB)',
    deploymentStatus: 'Active In Simulator',
    varianceRisk: 'Optimal (Bagged Subspace)',
  },
  {
    name: 'Decision Tree (CART)',
    type: 'Single Estimator Tree',
    accuracy: 83.5,
    precision: 81.0,
    recall: 82.4,
    f1Score: 81.7,
    latencyMs: 0.68,
    maxDepth: 14,
    splitCriterion: 'gini',
    serialization: 'cneh_cart_baseline.joblib (1.1 MB)',
    deploymentStatus: 'Pruned Alternative',
    varianceRisk: 'High (High Variance)',
  },
  {
    name: 'Logistic Regression',
    type: 'Linear Probabilistic Baseline',
    accuracy: 78.1,
    precision: 74.6,
    recall: 76.3,
    f1Score: 75.4,
    latencyMs: 0.42,
    splitCriterion: 'L2 Regularization (C=1.0)',
    serialization: 'cneh_logit_baseline.joblib (0.2 MB)',
    deploymentStatus: 'Archived Baseline',
    varianceRisk: 'Low (High Bias)',
  },
];

/**
 * Supervised Confusion Matrix (Binary High Risk vs Low/Med on Held-out test fold n=996)
 */
export const SAMPLE_CONFUSION_MATRIX: ConfusionMatrixData = {
  tp: 412,
  fn: 33,
  fp: 47,
  tn: 504,
  tpRate: 92.6,
  fnRate: 7.4,
  fpRate: 8.5,
  tnRate: 91.5,
  total: 996,
};

/**
 * Feature Importance Attribution (Mean Decrease in Impurity / Gini)
 */
export const FEATURE_IMPORTANCE_LIST: FeatureImportanceItem[] = [
  { rank: 1, featureName: 'Missing Security Headers (CSP, HSTS, X-Frame)', importance: 0.245, percentage: 24.5 },
  { rank: 2, featureName: 'Sensitive File Exposure (.git, .env, backups)', importance: 0.198, percentage: 19.8 },
  { rank: 3, featureName: 'Login / Admin Page Exposed', importance: 0.152, percentage: 15.2 },
  { rank: 4, featureName: 'HTTPS / TLS Protocol Enforcement', importance: 0.128, percentage: 12.8 },
  { rank: 5, featureName: 'Open Port Count (Passive Recon)', importance: 0.104, percentage: 10.4 },
  { rank: 6, featureName: 'Directory Listing / Indexing Enabled', importance: 0.076, percentage: 7.6 },
  { rank: 7, featureName: 'Domain Age (WHOIS Delta in Years)', importance: 0.058, percentage: 5.8 },
  { rank: 8, featureName: 'Historical Indexed Pages Count (Archive.org)', importance: 0.039, percentage: 3.9 },
];

/**
 * Initial historical benchmark analysis targets
 */
export function generateInitialHistory(): AnalysisResult[] {
  // Baseline demo student portal
  const target1 = runReconInference(DEFAULT_RECON_FEATURES, true);
  target1.id = 'SIM-2024-8821';
  target1.timestamp = '2024-10-24T14:32:00Z';
  target1.status = 'Verified (OWASP ZAP)';
  target1.securityPostureScore = 42;
  target1.overallRiskLevel = 'High';

  // Target 2: Staging API
  const f2 = {
    ...DEFAULT_RECON_FEATURES,
    targetName: 'Staging API Gateway',
    websiteUrl: 'staging-api.lab-sandbox.local',
    ipAddress: '198.51.100.89',
    directoryListingDetected: false,
    sensitiveFileExposure: false,
    domainAgeYears: 2.1,
    cookieSecurityScore: 75,
  };
  const target2 = runReconInference(f2, false);
  target2.id = 'SIM-2024-8819';
  target2.timestamp = '2024-10-24T10:15:00Z';
  target2.status = 'Completed';
  target2.securityPostureScore = 64;
  target2.overallRiskLevel = 'Medium';

  // Target 3: Library Catalog
  const f3 = {
    ...DEFAULT_RECON_FEATURES,
    targetName: 'University Library Catalog',
    websiteUrl: 'library-catalog.uni-test.org',
    ipAddress: '198.51.100.12',
    directoryListingDetected: false,
    sensitiveFileExposure: false,
    oldEndpointExposure: false,
    loginPageExposed: false,
    missingSecurityHeaders: ['Permissions-Policy'],
    cookieSecurityScore: 92,
    domainAgeYears: 7.8,
    openPortCount: 1,
  };
  const target3 = runReconInference(f3, true);
  target3.id = 'SIM-2024-8804';
  target3.timestamp = '2024-10-23T16:45:00Z';
  target3.status = 'Verified (OWASP ZAP)';
  target3.securityPostureScore = 88;
  target3.overallRiskLevel = 'Low';

  // Target 4: Alumni Portal
  const f4 = {
    ...DEFAULT_RECON_FEATURES,
    targetName: 'Alumni Directory Portal',
    websiteUrl: 'alumni-portal.demo-sandbox.internal',
    ipAddress: '198.51.100.33',
    directoryListingDetected: false,
    sensitiveFileExposure: false,
    domainAgeYears: 3.5,
    cookieSecurityScore: 80,
  };
  const target4 = runReconInference(f4, false);
  target4.id = 'SIM-2024-8798';
  target4.timestamp = '2024-10-21T11:20:00Z';
  target4.status = 'Pending Verification';
  target4.securityPostureScore = 76;
  target4.overallRiskLevel = 'Medium';

  // Target 5: E-Commerce Sandbox
  const f5 = {
    ...DEFAULT_RECON_FEATURES,
    targetName: 'Dev E-Commerce Sandbox',
    websiteUrl: 'ecommerce-dev.cneh-lab.test',
    ipAddress: '198.51.100.77',
    directoryListingDetected: false,
    sensitiveFileExposure: false,
    oldEndpointExposure: false,
    loginPageExposed: false,
    missingSecurityHeaders: [],
    cookieSecurityScore: 95,
    domainAgeYears: 5.0,
    openPortCount: 1,
  };
  const target5 = runReconInference(f5, true);
  target5.id = 'SIM-2024-8792';
  target5.timestamp = '2024-10-21T09:10:00Z';
  target5.status = 'Verified (OWASP ZAP)';
  target5.securityPostureScore = 91;
  target5.overallRiskLevel = 'Low';

  return [target1, target2, target3, target4, target5];
}

/**
 * Live Activity stream logs
 */
export const RECENT_ACTIVITY_STREAM = [
  {
    id: 1,
    title: 'Recon Pipeline Ingestion',
    time: '3 min ago',
    detail: 'Recon feature vector extracted for test-staging-app.internal (24 features ingested)',
    tag: 'RECON',
  },
  {
    id: 2,
    title: 'Ground Truth DAST Benchmark',
    time: '18 min ago',
    detail: 'OWASP ZAP cross-verification completed for target #138 (4/5 categories aligned)',
    tag: 'DAST',
  },
  {
    id: 3,
    title: 'Inference Engine Execution',
    time: '42 min ago',
    detail: 'Inference executed: RF-XGBoost ensemble calibrated in 310ms with 0.89 MCC score',
    tag: 'INFERENCE',
  },
  {
    id: 4,
    title: 'Benchmark Audit Export',
    time: '2 hours ago',
    detail: 'Batch benchmark report exported for CNEH Week 12 evaluation metrics review',
    tag: 'AUDIT',
  },
];
