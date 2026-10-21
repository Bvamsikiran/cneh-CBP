from typing import List, Optional, Literal
from pydantic import BaseModel, Field

RiskLevel = Literal['Low', 'Medium', 'High']
ScannerStatus = Literal[
    'Confirmed by Scanner',
    'Not Detected by Scanner',
    'Requires Manual Review',
    'Pending Verification',
    'Scanner Not Connected'
]
GeolocationRisk = Literal[
    'Low (US / Enterprise ASN)',
    'Medium (Shared Hosting / Foreign CDN)',
    'High (Bulletproof / Untrusted ASN)'
]
ServerType = Literal[
    'Nginx 1.18.0 (Ubuntu)',
    'Apache/2.4.52 (Debian)',
    'Cloudflare Edge Proxy',
    'Microsoft-IIS/10.0',
    'LiteSpeed Web Server',
    'Custom / Obfuscated Gateway'
]
HttpsCipher = Literal[
    'Yes (TLS 1.3 - Modern Cipher)',
    'Yes (TLS 1.2 - Legacy)',
    'No (Insecure HTTP)'
]
HttpStatus = Literal[
    '200 OK',
    '301/302 Redirect',
    '403 Forbidden',
    '500 Server Error'
]
VulnerabilityCategory = Literal[
    'Cross-Site Scripting (XSS)',
    'SQL Injection',
    'Security Misconfiguration',
    'Information Disclosure',
    'Authentication-related Risk'
]

class ReconFeatures(BaseModel):
    targetName: str = "Demo Target"
    websiteUrl: str = "example.com"
    domainAgeYears: float = 1.0
    ipAddress: str = "127.0.0.1"
    dnsRecordCount: int = 1
    subdomainCount: int = 0
    ipGeolocationRisk: GeolocationRisk = "Low (US / Enterprise ASN)"
    serverType: ServerType = "Nginx 1.18.0 (Ubuntu)"
    technologyCount: int = 3
    historicalPagesCount: int = 50
    oldEndpointExposure: bool = False
    loginPageExposed: bool = False
    adminPageExposed: bool = False
    sensitiveFileExposure: bool = False
    directoryListingDetected: bool = False
    httpsCipher: HttpsCipher = "Yes (TLS 1.3 - Modern Cipher)"
    httpStatus: HttpStatus = "200 OK"
    openPortCount: int = 2
    securityHeadersCount: int = 4
    missingSecurityHeaders: List[str] = Field(default_factory=list)
    cookieSecurityScore: int = 80

class ReconExtractRequest(BaseModel):
    url: str
    mode: Literal['passive', 'active'] = 'active'

class ReconExtractStep(BaseModel):
    step: str
    status: Literal['pending', 'in-progress', 'completed', 'failed']
    detail: str

class ReconExtractResponse(BaseModel):
    success: bool
    features: ReconFeatures
    detectedDetails: dict
    steps: List[ReconExtractStep] = Field(default_factory=list)
    durationMs: float = 0.0
    error: Optional[str] = None

class FeatureAttribution(BaseModel):
    featureName: str
    contributionPercent: float
    isProtective: bool
    description: str
    classifierComponent: str

class RemediationSnippet(BaseModel):
    language: str
    code: str
    description: str

class ShapContribution(BaseModel):
    name: str
    weight: float
    impact: str

class CategoryPrediction(BaseModel):
    category: VulnerabilityCategory
    cwe: str
    owaspTop10: str
    riskLevel: RiskLevel
    confidencePercent: float
    probability: float
    evidence: str
    scannerStatus: ScannerStatus
    scannerAlertDetail: Optional[str] = None
    recommendedAction: str
    whatWasPredicted: str
    whyWasPredicted: str
    potentialImpact: str
    remediationSnippet: Optional[RemediationSnippet] = None
    shapContributions: List[ShapContribution] = Field(default_factory=list)

class ModelMetadata(BaseModel):
    name: str
    version: str
    vectorDimension: int
    inferenceLatencyMs: float
    seed: str

class AnalysisResult(BaseModel):
    id: str
    timestamp: str
    targetName: str
    websiteUrl: str
    resolvedIp: str
    features: ReconFeatures
    securityPostureScore: int
    overallRiskLevel: RiskLevel
    overallRiskProbability: float
    highRiskCount: int
    mediumRiskCount: int
    lowRiskCount: int
    categories: List[CategoryPrediction]
    featureAttributions: List[FeatureAttribution]
    status: Literal['Completed', 'Pending Verification', 'Verified (OWASP ZAP)'] = 'Completed'
    isDemoData: bool = False
    modelMetadata: ModelMetadata
