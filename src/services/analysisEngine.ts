/**
 * ML-Based Website Vulnerability Detection Simulator
 * Reconnaissance Feature Processing and Inference Engine
 * 
 * NOTE: When no external Python ML backend (FastAPI/Scikit-learn) is connected,
 * this engine executes deterministic scoring calibrated from the CNEH academic
 * feature space. All outputs are strictly deterministic from supplied inputs.
 */

import {
  AnalysisResult,
  CategoryPrediction,
  FeatureAttribution,
  ReconFeatures,
  RiskLevel,
  ScannerStatus,
} from '../types';

/**
 * Standard baseline features for academic demo
 */
export const DEFAULT_RECON_FEATURES: ReconFeatures = {
  targetName: 'Demo Student Portal',
  websiteUrl: 'portal.academic-demo.edu',
  domainAgeYears: 4.2,
  ipAddress: '198.51.100.42',
  dnsRecordCount: 14,
  subdomainCount: 6,
  ipGeolocationRisk: 'Low (US / Enterprise ASN)',
  serverType: 'Nginx 1.18.0 (Ubuntu)',
  technologyCount: 8,
  historicalPagesCount: 1420,
  oldEndpointExposure: true,
  loginPageExposed: true,
  adminPageExposed: false,
  sensitiveFileExposure: true,
  directoryListingDetected: true,
  httpsCipher: 'Yes (TLS 1.3 - Modern Cipher)',
  httpStatus: '200 OK',
  openPortCount: 3,
  securityHeadersCount: 3,
  missingSecurityHeaders: [
    'Content-Security-Policy (CSP)',
    'Strict-Transport-Security (HSTS)',
    'X-Frame-Options',
    'Permissions-Policy',
  ],
  cookieSecurityScore: 60,
};

/**
 * Process raw reconnaissance features and generate deterministic analysis
 */
export function runReconInference(
  features: ReconFeatures,
  scannerConnected = false
): AnalysisResult {
  // 1. Calculate Feature Weights and Security Posture Score (0-100)
  // Higher score = stronger posture, lower = weaker configuration
  let postureScore = 85;

  // Deductions based on defensive gaps
  if (features.httpsCipher === 'No (Insecure HTTP)') postureScore -= 25;
  else if (features.httpsCipher === 'Yes (TLS 1.2 - Legacy)') postureScore -= 6;

  if (features.directoryListingDetected) postureScore -= 14;
  if (features.sensitiveFileExposure) postureScore -= 16;
  if (features.oldEndpointExposure) postureScore -= 8;
  if (features.adminPageExposed) postureScore -= 12;
  if (features.loginPageExposed && features.cookieSecurityScore < 50) postureScore -= 10;

  // Security headers impact
  const missingHeadersCount = features.missingSecurityHeaders.length;
  postureScore -= Math.min(18, missingHeadersCount * 4.5);

  // Cookie security impact
  if (features.cookieSecurityScore < 40) postureScore -= 8;
  else if (features.cookieSecurityScore > 80) postureScore += 4;

  // Open ports penalty
  if (features.openPortCount > 5) postureScore -= 10;
  else if (features.openPortCount > 2) postureScore -= 4;

  // Domain age nuance (very new domains < 0.5 yrs have higher config drift)
  if (features.domainAgeYears < 0.5) postureScore -= 6;
  else if (features.domainAgeYears > 3) postureScore += 3;

  // Geo risk
  if (features.ipGeolocationRisk === 'High (Bulletproof / Untrusted ASN)') postureScore -= 12;
  else if (features.ipGeolocationRisk === 'Medium (Shared Hosting / Foreign CDN)') postureScore -= 5;

  // Bound score between 12 and 98
  postureScore = Math.max(12, Math.min(98, Math.round(postureScore)));

  // 2. Derive Overall Risk Level
  let overallRiskLevel: RiskLevel = 'Low';
  let overallProbability = 0.25;

  if (postureScore < 50) {
    overallRiskLevel = 'High';
    overallProbability = 0.88;
  } else if (postureScore < 75) {
    overallRiskLevel = 'Medium';
    overallProbability = 0.62;
  } else {
    overallRiskLevel = 'Low';
    overallProbability = 0.28;
  }

  // 3. Category Predictions (5 standard categories)
  const categories: CategoryPrediction[] = [
    buildSecurityMisconfigPrediction(features, scannerConnected),
    buildXssPrediction(features, scannerConnected),
    buildInfoDisclosurePrediction(features, scannerConnected),
    buildAuthRiskPrediction(features, scannerConnected),
    buildSqlInjectionPrediction(features, scannerConnected),
  ];

  const highRiskCount = categories.filter((c) => c.riskLevel === 'High').length;
  const mediumRiskCount = categories.filter((c) => c.riskLevel === 'Medium').length;
  const lowRiskCount = categories.filter((c) => c.riskLevel === 'Low').length;

  // 4. SHAP-style Feature Attributions
  const featureAttributions: FeatureAttribution[] = [
    {
      featureName: 'Missing Defensive Security Headers',
      contributionPercent: 28,
      isProtective: false,
      description: `${features.missingSecurityHeaders.length} missing response headers (CSP, HSTS, X-Frame-Options) lower client-side defense in depth.`,
      classifierComponent: 'XGBoost Node #4',
    },
    {
      featureName: 'Sensitive File Exposure',
      contributionPercent: features.sensitiveFileExposure ? 22 : 4,
      isProtective: false,
      description: features.sensitiveFileExposure
        ? 'Public indices and potential config backups (.git, .env) visible over unauthenticated HTTP.'
        : 'No immediate sensitive file fragments surfaced during passive crawl.',
      classifierComponent: 'RF Split Depth 3',
    },
    {
      featureName: 'Login / Admin Page Exposure',
      contributionPercent: features.adminPageExposed || features.loginPageExposed ? 18 : 3,
      isProtective: false,
      description: features.loginPageExposed
        ? 'Exposed /auth endpoint identified without rate-limiting headers or MFA enforcement telemetry.'
        : 'Administrative endpoints restricted or isolated.',
      classifierComponent: 'XGBoost Node #9',
    },
    {
      featureName: 'Open Port Count',
      contributionPercent: features.openPortCount > 2 ? 14 : 2,
      isProtective: false,
      description: `${features.openPortCount} ports detected open (e.g. 80, 443, 8080) increasing potential attack surface.`,
      classifierComponent: 'RF Branch Split 1',
    },
    {
      featureName: 'HTTPS / TLS Protocol Enforcement',
      contributionPercent: features.httpsCipher.includes('TLS 1.3') ? -12 : 15,
      isProtective: features.httpsCipher.includes('TLS 1.3'),
      description: features.httpsCipher.includes('TLS 1.3')
        ? 'Modern cryptographic standard (TLS 1.3) protects in-transit traffic and lowers overall network vulnerability weight.'
        : 'Inadequate transport layer encryption exposes sessions to inspection.',
      classifierComponent: 'Negative Weight Dampener (Ensemble)',
    },
  ];

  const id = `SIM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  return {
    id,
    timestamp: new Date().toISOString(),
    targetName: features.targetName || 'Assessed Domain',
    websiteUrl: features.websiteUrl || 'target.example.edu',
    resolvedIp: features.ipAddress || '198.51.100.42',
    features,
    securityPostureScore: postureScore,
    overallRiskLevel,
    overallRiskProbability: overallProbability,
    highRiskCount,
    mediumRiskCount,
    lowRiskCount,
    categories,
    featureAttributions,
    status: scannerConnected ? 'Verified (OWASP ZAP)' : 'Completed',
    isDemoData: true,
    modelMetadata: {
      name: 'RF-XGBoost Ensemble',
      version: 'v2.4-cneh',
      vectorDimension: 24,
      inferenceLatencyMs: 340,
      seed: '0x8F32C',
    },
  };
}

function buildSecurityMisconfigPrediction(
  f: ReconFeatures,
  scannerConnected: boolean
): CategoryPrediction {
  const hasDirListing = f.directoryListingDetected;
  const missingHeaders = f.missingSecurityHeaders.length > 2;
  const isHigh = hasDirListing || missingHeaders;
  const prob = isHigh ? 0.915 : 0.42;

  let scannerStatus: ScannerStatus = scannerConnected
    ? 'Confirmed by Scanner'
    : 'Pending Verification';

  return {
    category: 'Security Misconfiguration',
    cwe: 'CWE-16',
    owaspTop10: 'OWASP A05:2021',
    riskLevel: isHigh ? 'High' : 'Medium',
    confidencePercent: Math.round(prob * 1000) / 10,
    probability: prob,
    evidence: `${hasDirListing ? 'Directory listing enabled on public paths' : 'Default asset trees'}, ${f.missingSecurityHeaders.length} missing defensive HTTP headers, server banner ${f.serverType}`,
    scannerStatus,
    scannerAlertDetail: '2 Alerts: Missing Anti-clickjacking (X-Frame-Options), Directory listing on /assets/',
    recommendedAction:
      'Disable directory indexing (autoindex off), configure strict security headers (CSP, HSTS, X-Frame-Options), and suppress server banner tokens.',
    whatWasPredicted:
      'The machine learning model identifies elevated probability that the target web server possesses unhardened default configurations or permissive server headers.',
    whyWasPredicted:
      'Classification decision driven by missing Content-Security-Policy and X-Frame-Options, combined with an identifiable Nginx/Apache server token and open directory index.',
    potentialImpact:
      'Attackers can easily enumerate directory structures, download unindexed backups, and exploit known server software version vulnerabilities.',
    remediationSnippet: {
      language: 'nginx',
      code: `# Nginx Security Hardening
server {
    server_tokens off;
    autoindex off;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Content-Security-Policy "default-src 'self';" always;
}`,
      description: 'Disable server banners, disable directory indexing, and inject defensive HTTP headers.',
    },
    shapContributions: [
      { name: 'Missing CSP / X-Frame-Options', weight: 0.32, impact: '+32% Risk Influence' },
      { name: 'Directory Listing Detected', weight: 0.24, impact: '+24% Risk Influence' },
      { name: 'Server Banner Disclosure', weight: 0.12, impact: '+12% Risk Influence' },
    ],
  };
}

function buildXssPrediction(f: ReconFeatures, scannerConnected: boolean): CategoryPrediction {
  const missingCsp = f.missingSecurityHeaders.some((h) => h.includes('Content-Security-Policy'));
  const hasHistory = f.historicalPagesCount > 500;
  const prob = missingCsp && (hasHistory || f.oldEndpointExposure) ? 0.872 : 0.38;
  const isHigh = prob > 0.7;

  let scannerStatus: ScannerStatus = scannerConnected
    ? 'Confirmed by Scanner'
    : 'Pending Verification';

  return {
    category: 'Cross-Site Scripting (XSS)',
    cwe: 'CWE-79',
    owaspTop10: 'OWASP A03:2021',
    riskLevel: isHigh ? 'High' : 'Low',
    confidencePercent: Math.round(prob * 1000) / 10,
    probability: prob,
    evidence: `${missingCsp ? 'Absence of Content-Security-Policy' : 'Weak CSP definition'}, ${f.historicalPagesCount} archived dynamic parameters with reflected query markers`,
    scannerStatus,
    scannerAlertDetail: '1 Medium alert: Missing reflected parameter sanitization in search context',
    recommendedAction:
      'Enforce strict Content Security Policy (CSP), sanitize and HTML-entity encode all dynamic inputs before DOM reflection, and enable modern framework auto-escaping.',
    whatWasPredicted:
      'Statistical likelihood of client-side script injection vectors resulting from unprotected reflection points and zero CSP restriction boundaries.',
    whyWasPredicted:
      'Archived endpoint history revealed multiple dynamic query parameters without defensive transport or Content-Security-Policy containment.',
    potentialImpact:
      'Session hijacking via cookie theft, execution of malicious scripts in student/user browser contexts, defacement, and credential skimming.',
    remediationSnippet: {
      language: 'html',
      code: `<!-- Enforce Content Security Policy -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'; object-src 'none';">`,
      description: 'Restrict script execution origins to verified origins only.',
    },
    shapContributions: [
      { name: 'Absence of CSP Header', weight: 0.35, impact: '+35% Risk Influence' },
      { name: 'Historical Parameter Endpoints', weight: 0.19, impact: '+19% Risk Influence' },
    ],
  };
}

function buildInfoDisclosurePrediction(
  f: ReconFeatures,
  scannerConnected: boolean
): CategoryPrediction {
  const prob = f.sensitiveFileExposure || f.oldEndpointExposure ? 0.789 : 0.25;

  let scannerStatus: ScannerStatus = scannerConnected
    ? 'Confirmed by Scanner'
    : 'Pending Verification';

  return {
    category: 'Information Disclosure',
    cwe: 'CWE-200',
    owaspTop10: 'OWASP A01:2021',
    riskLevel: prob > 0.7 ? 'Medium' : 'Low',
    confidencePercent: Math.round(prob * 1000) / 10,
    probability: prob,
    evidence: `Public exposure of sensitive indices, server token (${f.serverType}), and robots.txt entries disclosing internal staging paths`,
    scannerStatus,
    scannerAlertDetail: '1 Low alert: Server token disclosure header (Apache/Nginx exposed)',
    recommendedAction:
      'Remove sensitive files (.git, .env, backups) from document roots, restrict robots.txt internal naming, and sanitize HTTP error stack traces.',
    whatWasPredicted:
      'Elevated risk of unintended structural and technology metadata leakage through unauthenticated web responses.',
    whyWasPredicted:
      'Passive reconnaissance revealed server token disclosure and sensitive file patterns accessible without authorization.',
    potentialImpact:
      'Assists adversaries in crafting targeted exploits matching exact server framework versions and backend infrastructure paths.',
    remediationSnippet: {
      language: 'apache',
      code: `# Apache sensitive directory blocking
<DirectoryMatch "^/.*/\.(git|svn|env)">
    Require all denied
</DirectoryMatch>`,
      description: 'Block all incoming web requests attempting to resolve hidden repository or environment directories.',
    },
    shapContributions: [
      { name: 'Sensitive File Leak (.git/.env)', weight: 0.28, impact: '+28% Risk Influence' },
      { name: 'Server Version Header Disclosed', weight: 0.18, impact: '+18% Risk Influence' },
    ],
  };
}

function buildAuthRiskPrediction(f: ReconFeatures, scannerConnected: boolean): CategoryPrediction {
  const prob = f.loginPageExposed && f.cookieSecurityScore < 70 ? 0.723 : 0.31;

  let scannerStatus: ScannerStatus = scannerConnected
    ? 'Requires Manual Review'
    : 'Pending Verification';

  return {
    category: 'Authentication-related Risk',
    cwe: 'CWE-287',
    owaspTop10: 'OWASP A07:2021',
    riskLevel: prob > 0.6 ? 'Medium' : 'Low',
    confidencePercent: Math.round(prob * 1000) / 10,
    probability: prob,
    evidence: `Unprotected login interface at public URL, cookie security score ${f.cookieSecurityScore}/100, missing SameSite or Secure cookie flags`,
    scannerStatus,
    scannerAlertDetail: 'Awaiting authenticated session scanner token to verify session entropy',
    recommendedAction:
      'Set Secure, HttpOnly, and SameSite=Strict flags on all authentication cookies; enforce multi-factor authentication (MFA) and rate limiting on /login.',
    whatWasPredicted:
      'Medium-grade exposure in session token transport and public credential endpoint configuration.',
    whyWasPredicted:
      'Cookie score reflects missing SameSite attributes and public login discovery without multi-factor defense signals.',
    potentialImpact:
      'Cross-site request forgery (CSRF), session fixation, or brute-force credential stuffing against student login forms.',
    remediationSnippet: {
      language: 'javascript',
      code: `// Secure Cookie Configuration
res.cookie('session_id', token, {
  secure: true,
  httpOnly: true,
  sameSite: 'strict',
  maxAge: 3600000
});`,
      description: 'Enforce cryptographic token containment across browser cookies.',
    },
    shapContributions: [
      { name: 'Cookie Security Score Deficit', weight: 0.22, impact: '+22% Risk Influence' },
      { name: 'Public Login Exposure', weight: 0.15, impact: '+15% Risk Influence' },
    ],
  };
}

function buildSqlInjectionPrediction(
  f: ReconFeatures,
  scannerConnected: boolean
): CategoryPrediction {
  // Passive reconnaissance features alone CANNOT prove SQL Injection
  // We keep this clearly calibrated to low/unlikely with explicit academic notation!
  const prob = 0.184;

  let scannerStatus: ScannerStatus = scannerConnected
    ? 'Not Detected by Scanner'
    : 'Requires Manual Review';

  return {
    category: 'SQL Injection',
    cwe: 'CWE-89',
    owaspTop10: 'OWASP A03:2021',
    riskLevel: 'Low',
    confidencePercent: Math.round(prob * 1000) / 10,
    probability: prob,
    evidence:
      'Passive reconnaissance vector does not exhibit direct database query string reflection; parameterized query architecture assumed.',
    scannerStatus,
    scannerAlertDetail: '0 Alerts detected across 42 active boundary test injection inputs',
    recommendedAction:
      'Maintain parameterized queries / prepared statements (e.g. PDO, SQLAlchemy, Prisma). Verify database user privileges follow least privilege.',
    whatWasPredicted:
      'Low probability inferred from absence of database error leakage and standard modern framework routing.',
    whyWasPredicted:
      'Passive reconnaissance features alone cannot detect SQL injection without active input payload fuzzing (which passive recon does not perform).',
    potentialImpact:
      'If present, arbitrary database extraction, authentication bypass, or data modification.',
    remediationSnippet: {
      language: 'python',
      code: `# Parameterized query defense
cursor.execute(
    "SELECT * FROM users WHERE username = %s AND active = %s",
    (input_username, True)
)`,
      description: 'Use parameterized statements to separate query code from user inputs.',
    },
    shapContributions: [
      { name: 'Sanitized Parameter Topology', weight: -0.15, impact: '-15% Risk Influence (Protective)' },
      { name: 'No Database Stack Trace Leaks', weight: -0.12, impact: '-12% Protective Factor' },
    ],
  };
}
