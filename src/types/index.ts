/**
 * ML-Based Website Vulnerability Detection Simulator
 * Academic CNEH (Cybersecurity & Ethical Hacking) Data Types
 */

export type ScreenId =
  | 'dashboard'
  | 'new-analysis'
  | 'progress'
  | 'results'
  | 'vuln-details'
  | 'model-performance'
  | 'scanner-verification'
  | 'reports'
  | 'history'
  | 'settings';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type VulnerabilityCategory =
  | 'Cross-Site Scripting (XSS)'
  | 'SQL Injection'
  | 'Security Misconfiguration'
  | 'Information Disclosure'
  | 'Authentication-related Risk';

export type ScannerStatus =
  | 'Confirmed by Scanner'
  | 'Not Detected by Scanner'
  | 'Requires Manual Review'
  | 'Pending Verification'
  | 'Scanner Not Connected';

export type GeolocationRisk =
  | 'Low (US / Enterprise ASN)'
  | 'Medium (Shared Hosting / Foreign CDN)'
  | 'High (Bulletproof / Untrusted ASN)';

export type ServerType =
  | 'Nginx 1.18.0 (Ubuntu)'
  | 'Apache/2.4.52 (Debian)'
  | 'Cloudflare Edge Proxy'
  | 'Microsoft-IIS/10.0'
  | 'LiteSpeed Web Server'
  | 'Custom / Obfuscated Gateway';

export type HttpsCipher =
  | 'Yes (TLS 1.3 - Modern Cipher)'
  | 'Yes (TLS 1.2 - Legacy)'
  | 'No (Insecure HTTP)';

export type HttpStatus =
  | '200 OK'
  | '301/302 Redirect'
  | '403 Forbidden'
  | '500 Server Error';

/**
 * 24 Reconnaissance Features gathered during Week 8 Recon lab
 */
export interface ReconFeatures {
  // Target Information
  targetName: string;
  websiteUrl: string;

  // WHOIS Information
  domainAgeYears: number;

  // DNS / IP Information
  ipAddress: string;
  dnsRecordCount: number;
  subdomainCount: number;
  ipGeolocationRisk: GeolocationRisk;

  // Technology / Server Information
  serverType: ServerType;
  technologyCount: number;

  // Archive / History
  historicalPagesCount: number;
  oldEndpointExposure: boolean;

  // Public Exposure
  loginPageExposed: boolean;
  adminPageExposed: boolean;
  sensitiveFileExposure: boolean;
  directoryListingDetected: boolean;

  // Security Configuration
  httpsCipher: HttpsCipher;
  httpStatus: HttpStatus;
  openPortCount: number;
  securityHeadersCount: number;
  missingSecurityHeaders: string[];
  cookieSecurityScore: number; // 0-100
}

export interface FeatureAttribution {
  featureName: string;
  contributionPercent: number; // e.g. +28% or -12%
  isProtective: boolean;
  description: string;
  classifierComponent: string;
}

export interface CategoryPrediction {
  category: VulnerabilityCategory;
  cwe: string;
  owaspTop10: string;
  riskLevel: RiskLevel;
  confidencePercent: number; // e.g. 87.2
  probability: number; // 0.0 - 1.0
  evidence: string;
  scannerStatus: ScannerStatus;
  scannerAlertDetail?: string;
  recommendedAction: string;
  whatWasPredicted: string;
  whyWasPredicted: string;
  potentialImpact: string;
  remediationSnippet?: {
    language: string;
    code: string;
    description: string;
  };
  shapContributions: { name: string; weight: number; impact: string }[];
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  targetName: string;
  websiteUrl: string;
  resolvedIp: string;
  features: ReconFeatures;
  securityPostureScore: number; // 0-100 (Internal academic metric, higher = stronger)
  overallRiskLevel: RiskLevel;
  overallRiskProbability: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  categories: CategoryPrediction[];
  featureAttributions: FeatureAttribution[];
  status: 'Completed' | 'Pending Verification' | 'Verified (OWASP ZAP)';
  isDemoData: boolean;
  modelMetadata: {
    name: string;
    version: string;
    vectorDimension: number;
    inferenceLatencyMs: number;
    seed: string;
  };
}

export interface ModelMetrics {
  name: string;
  type: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  latencyMs: number;
  estimators?: number;
  maxDepth?: number;
  splitCriterion?: string;
  serialization: string;
  deploymentStatus: 'Active In Simulator' | 'Archived Baseline' | 'Pruned Alternative';
  varianceRisk: string;
}

export interface ConfusionMatrixData {
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  tpRate: number;
  fpRate: number;
  fnRate: number;
  tnRate: number;
  total: number;
}

export interface FeatureImportanceItem {
  rank: number;
  featureName: string;
  importance: number; // 0.0 - 1.0
  percentage: number;
}
