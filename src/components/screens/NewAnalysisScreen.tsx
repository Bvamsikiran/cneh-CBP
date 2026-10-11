import React, { useState } from 'react';
import {
  ShieldAlert,
  RotateCcw,
  Save,
  ArrowRight,
  Database,
  Globe,
  Server,
  FileSearch,
  Lock,
  Eye,
  Info,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  GeolocationRisk,
  HttpsCipher,
  HttpStatus,
  ReconFeatures,
  ServerType,
} from '../../types';
import { DEFAULT_RECON_FEATURES } from '../../services/analysisEngine';

interface NewAnalysisScreenProps {
  onStartAnalysis: (features: ReconFeatures) => void;
}

const AVAILABLE_SECURITY_HEADERS = [
  'Content-Security-Policy (CSP)',
  'Strict-Transport-Security (HSTS)',
  'X-Frame-Options',
  'X-Content-Type-Options',
  'Referrer-Policy',
  'Permissions-Policy',
  'Cross-Origin-Embedder-Policy',
  'Cross-Origin-Opener-Policy',
];

export const NewAnalysisScreen: React.FC<NewAnalysisScreenProps> = ({
  onStartAnalysis,
}) => {
  const [formData, setFormData] = useState<ReconFeatures>({ ...DEFAULT_RECON_FEATURES });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draftSavedMessage, setDraftSavedMessage] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.targetName.trim()) {
      newErrors.targetName = 'Target name is required.';
    }

    if (!formData.websiteUrl.trim()) {
      newErrors.websiteUrl = 'Website URL is required.';
    } else if (
      !/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/.*)?$/.test(
        formData.websiteUrl.trim()
      ) &&
      !formData.websiteUrl.includes('localhost') &&
      !formData.websiteUrl.includes('.local') &&
      !formData.websiteUrl.includes('.internal') &&
      !formData.websiteUrl.includes('.test')
    ) {
      newErrors.websiteUrl = 'Please enter a valid domain format (e.g., portal.academic-demo.edu).';
    }

    if (formData.domainAgeYears < 0 || formData.domainAgeYears > 40) {
      newErrors.domainAgeYears = 'Domain age must be between 0 and 40 years.';
    }

    if (formData.dnsRecordCount < 0) {
      newErrors.dnsRecordCount = 'DNS record count cannot be negative.';
    }

    if (formData.subdomainCount < 0) {
      newErrors.subdomainCount = 'Subdomain count cannot be negative.';
    }

    if (formData.technologyCount < 0) {
      newErrors.technologyCount = 'Technology count cannot be negative.';
    }

    if (formData.openPortCount < 0) {
      newErrors.openPortCount = 'Open port count cannot be negative.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    setFormData({
      targetName: '',
      websiteUrl: '',
      domainAgeYears: 1.0,
      ipAddress: '198.51.100.1',
      dnsRecordCount: 4,
      subdomainCount: 2,
      ipGeolocationRisk: 'Low (US / Enterprise ASN)',
      serverType: 'Nginx 1.18.0 (Ubuntu)',
      technologyCount: 4,
      historicalPagesCount: 150,
      oldEndpointExposure: false,
      loginPageExposed: false,
      adminPageExposed: false,
      sensitiveFileExposure: false,
      directoryListingDetected: false,
      httpsCipher: 'Yes (TLS 1.3 - Modern Cipher)',
      httpStatus: '200 OK',
      openPortCount: 2,
      securityHeadersCount: 4,
      missingSecurityHeaders: ['Permissions-Policy'],
      cookieSecurityScore: 80,
    });
    setErrors({});
  };

  const handleLoadDemoData = () => {
    setFormData({ ...DEFAULT_RECON_FEATURES });
    setErrors({});
  };

  const handleSaveDraft = () => {
    localStorage.setItem('cneh_analysis_draft', JSON.stringify(formData));
    setDraftSavedMessage(true);
    setTimeout(() => setDraftSavedMessage(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onStartAnalysis(formData);
    }
  };

  const toggleMissingHeader = (header: string) => {
    setFormData((prev) => {
      const exists = prev.missingSecurityHeaders.includes(header);
      const nextList = exists
        ? prev.missingSecurityHeaders.filter((h) => h !== header)
        : [...prev.missingSecurityHeaders, header];
      const nextHeadersCount = Math.max(0, 8 - nextList.length);
      return {
        ...prev,
        missingSecurityHeaders: nextList,
        securityHeadersCount: nextHeadersCount,
      };
    });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Title & Pipeline Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              New Website Analysis
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
              INFERENCE PIPELINE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enter website characteristics gathered during authorized reconnaissance.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadDemoData}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-indigo-500/30 transition-all shrink-0 cursor-pointer shadow-sm"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Load Demo Benchmark Data (academic-sample.edu)</span>
        </button>
      </div>

      {/* Pipeline Status Subheaders */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
        <span className="px-2 py-1 rounded bg-[#0F172A] border border-slate-800 text-indigo-300">
          CNEH Week 8 Recon Ingestion Pipeline
        </span>
        <span className="px-2 py-1 rounded bg-[#0F172A] border border-slate-800 text-slate-300">
          Features to be encoded into Vector: 24 Dimensions
        </span>
        <span className="px-2 py-1 rounded bg-[#0F172A] border border-slate-800 text-slate-400">
          Academic Simulator Mode
        </span>
      </div>

      {draftSavedMessage && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Draft configuration successfully stored in local session cache.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION A: Target Information */}
        <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-2.5">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">1. Target Information</h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Features: [target_id, domain_uri]
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Basic domain identification and target scope for the security evaluation model.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.targetName}
                onChange={(e) => setFormData({ ...formData, targetName: e.target.value })}
                placeholder="e.g., Demo Student Portal"
                className="w-full px-3 py-2 text-xs rounded bg-[#0B101B] border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
              {errors.targetName && (
                <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.targetName}
                </p>
              )}
              <span className="text-[10px] text-slate-500 mt-1 block">
                Descriptive label used in the inference report
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Website / URL <span className="text-rose-400">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-2.5 text-xs bg-slate-800/80 border border-r-0 border-slate-800 text-slate-400 rounded-l font-mono">
                  https://
                </span>
                <input
                  type="text"
                  value={formData.websiteUrl.replace(/^https?:\/\//, '')}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="portal.academic-demo.edu"
                  className="w-full px-3 py-2 text-xs rounded-r bg-[#0B101B] border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              {errors.websiteUrl && (
                <p className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.websiteUrl}
                </p>
              )}
              <span className="text-[10px] text-slate-500 mt-1 block">
                Fully qualified domain name without trailing paths
              </span>
            </div>
          </div>
        </div>

        {/* SECTION B & C: WHOIS & DNS/IP */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Section B: WHOIS (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/70 pb-2.5">
              <div className="flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-white">2. WHOIS Information</h2>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Feature: [domain_age_years]
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Registration and domain longevity metrics indicating domain maturity.
            </p>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Domain Age (years)</span>
                <span className="font-mono text-indigo-300 font-semibold">
                  {formData.domainAgeYears} years
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="20"
                step="0.1"
                value={formData.domainAgeYears}
                onChange={(e) =>
                  setFormData({ ...formData, domainAgeYears: parseFloat(e.target.value) })
                }
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0.1 yr (New)</span>
                <span>10 yrs</span>
                <span>20+ yrs (Established)</span>
              </div>
              {errors.domainAgeYears && (
                <p className="mt-1 text-[11px] text-rose-400">{errors.domainAgeYears}</p>
              )}
            </div>

            <div className="p-3 rounded bg-[#0B101B]/70 border border-slate-800/70 text-[11px] text-slate-400 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                Older domains often exhibit different configuration drift patterns, whereas newly
                registered domains hold atypical anomaly distribution.
              </span>
            </div>
          </div>

          {/* Section C: DNS / IP (7 cols) */}
          <div className="lg:col-span-7 p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/70 pb-2.5">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-white">3. DNS / IP Information</h2>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Features: [ip_addr, dns_cnt, sub_cnt, geo_risk]
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Network infrastructure footprint and domain name resolution topology.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">IP Address</label>
                <input
                  type="text"
                  value={formData.ipAddress}
                  onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded bg-[#0B101B] border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Primary A record resolution</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  DNS Record Count
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.dnsRecordCount}
                  onChange={(e) =>
                    setFormData({ ...formData, dnsRecordCount: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-xs rounded bg-[#0B101B] border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Sum of A, MX, TXT, NS, CNAME</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Subdomain Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.subdomainCount}
                  onChange={(e) =>
                    setFormData({ ...formData, subdomainCount: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 text-xs rounded bg-[#0B101B] border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Passive certificate enumeration
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  IP Geolocation Risk
                </label>
                <select
                  value={formData.ipGeolocationRisk}
                  onChange={(e) =>
                    setFormData({ ...formData, ipGeolocationRisk: e.target.value as GeolocationRisk })
                  }
                  className="w-full px-3 py-2 text-xs rounded bg-[#0B101B] border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Low (US / Enterprise ASN)">Low (US / Enterprise ASN)</option>
                  <option value="Medium (Shared Hosting / Foreign CDN)">
                    Medium (Shared Hosting / Foreign CDN)
                  </option>
                  <option value="High (Bulletproof / Untrusted ASN)">
                    High (Bulletproof / Untrusted ASN)
                  </option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Autonomous System reputation
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION D & E: Tech & Archive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section D: Tech / Server */}
          <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/70 pb-2.5">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-white">
                  4. Technology / Server Information
                </h2>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Features: [srv_banner, tech_stack_count]
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Server Type</label>
                <select
                  value={formData.serverType}
                  onChange={(e) =>
                    setFormData({ ...formData, serverType: e.target.value as ServerType })
                  }
                  className="w-full px-3 py-2 text-xs rounded bg-[#0B101B] border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Nginx 1.18.0 (Ubuntu)">Nginx 1.18.0 (Ubuntu)</option>
                  <option value="Apache/2.4.52 (Debian)">Apache/2.4.52 (Debian)</option>
                  <option value="Cloudflare Edge Proxy">Cloudflare Edge Proxy</option>
                  <option value="Microsoft-IIS/10.0">Microsoft-IIS/10.0</option>
                  <option value="LiteSpeed Web Server">LiteSpeed Web Server</option>
                  <option value="Custom / Obfuscated Gateway">Custom / Obfuscated Gateway</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Reported in HTTP response 'Server'
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Technology Count
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.technologyCount}
                  onChange={(e) =>
                    setFormData({ ...formData, technologyCount: parseInt(e.target.value) || 1 })
                  }
                  className="w-full px-3 py-2 text-xs rounded bg-[#0B101B] border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Detected frameworks, libraries & CMS
                </span>
              </div>
            </div>
          </div>

          {/* Section E: Archive / History */}
          <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/70 pb-2.5">
              <div className="flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-white">5. Archive / History</h2>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Features: [wayback_pages, old_endpoints]
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Historical Pages Count
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.historicalPagesCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      historicalPagesCount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded bg-[#0B101B] border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Wayback snapshots indexed
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Old Endpoint Exposure
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        oldEndpointExposure: !formData.oldEndpointExposure,
                      })
                    }
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      formData.oldEndpointExposure ? 'bg-indigo-600' : 'bg-slate-800'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        formData.oldEndpointExposure ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-mono text-slate-300">
                    {formData.oldEndpointExposure ? 'Yes (Deprecated /v1/ routes)' : 'No (Clean)'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  e.g. deprecated /v1/api or /backup links
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION F: Public Exposure */}
        <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-2.5">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">6. Public Exposure</h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Features: [login_exp, admin_exp, file_leak, dir_listing]
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Sensitive endpoints or directories inadvertently visible to unauthenticated requests.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Login Page Exposed */}
            <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-200">Login Page Exposed</span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, loginPageExposed: !formData.loginPageExposed })
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    formData.loginPageExposed ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      formData.loginPageExposed ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {formData.loginPageExposed ? 'Yes (/auth/portal detected)' : 'No (Hidden/MFA)'}
              </p>
            </div>

            {/* Admin Page Exposed */}
            <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-200">Admin Page Exposed</span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, adminPageExposed: !formData.adminPageExposed })
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    formData.adminPageExposed ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      formData.adminPageExposed ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {formData.adminPageExposed ? 'Yes (/admin route public)' : 'No (Filtered / Restricted)'}
              </p>
            </div>

            {/* Sensitive File Exposure */}
            <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-200">Sensitive File Exposure</span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      sensitiveFileExposure: !formData.sensitiveFileExposure,
                    })
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    formData.sensitiveFileExposure ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      formData.sensitiveFileExposure ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {formData.sensitiveFileExposure ? 'Yes (.git/HEAD partial leak)' : 'No (Filtered)'}
              </p>
            </div>

            {/* Directory Listing Detected */}
            <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-200">Directory Listing Detected</span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      directoryListingDetected: !formData.directoryListingDetected,
                    })
                  }
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    formData.directoryListingDetected ? 'bg-indigo-600' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      formData.directoryListingDetected ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {formData.directoryListingDetected
                  ? 'Yes (/assets/backup/ indexable)'
                  : 'No (Autoindex disabled)'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION G: Security Configuration */}
        <div className="p-5 rounded-lg bg-[#0F172A] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-2.5">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-white">7. Security Configuration</h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Features: [https_tls, http_st, open_ports, sec_hdr_cnt, missing_hdr, cookie_score]
            </span>
          </div>
          <p className="text-xs text-slate-400">
            HTTP transport encryption, defense headers, and active session protection parameters.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                HTTPS Enabled / Cipher
              </label>
              <select
                value={formData.httpsCipher}
                onChange={(e) =>
                  setFormData({ ...formData, httpsCipher: e.target.value as HttpsCipher })
                }
                className="w-full px-3 py-2 text-xs rounded bg-[#0B101B] border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Yes (TLS 1.3 - Modern Cipher)">Yes (TLS 1.3 - Modern Cipher)</option>
                <option value="Yes (TLS 1.2 - Legacy)">Yes (TLS 1.2 - Legacy)</option>
                <option value="No (Insecure HTTP)">No (Insecure HTTP)</option>
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Negotiated cryptographic standard
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">HTTP Status</label>
              <select
                value={formData.httpStatus}
                onChange={(e) =>
                  setFormData({ ...formData, httpStatus: e.target.value as HttpStatus })
                }
                className="w-full px-3 py-2 text-xs rounded bg-[#0B101B] border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="200 OK">200 OK</option>
                <option value="301/302 Redirect">301/302 Redirect</option>
                <option value="403 Forbidden">403 Forbidden</option>
                <option value="500 Server Error">500 Server Error</option>
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">Root document response header</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Open Port Count
              </label>
              <input
                type="number"
                min="0"
                value={formData.openPortCount}
                onChange={(e) =>
                  setFormData({ ...formData, openPortCount: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 text-xs rounded bg-[#0B101B] border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                e.g. 3 ports open (80, 443, 8080)
              </span>
            </div>
          </div>

          {/* Missing Security Headers Interactive Checklist */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-300">
                Missing Security Headers (Select to mark as missing)
              </label>
              <span className="text-[11px] font-mono text-indigo-300">
                {formData.missingSecurityHeaders.length} missing ({formData.securityHeadersCount} / 8 active)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SECURITY_HEADERS.map((header) => {
                const isMissing = formData.missingSecurityHeaders.includes(header);
                return (
                  <button
                    key={header}
                    type="button"
                    onClick={() => toggleMissingHeader(header)}
                    className={`px-2.5 py-1 text-[11px] rounded font-mono transition-colors border ${
                      isMissing
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/40 hover:bg-rose-500/25'
                        : 'bg-slate-800/60 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {isMissing ? '✕ ' : '✓ '} {header}
                  </button>
                );
              })}
            </div>
            <span className="text-[10px] text-slate-500 mt-1.5 block">
              Red indicates defensive header missing from server response.
            </span>
          </div>

          {/* Cookie Security Score Slider */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Cookie Security Score</span>
              <span className="font-mono text-indigo-300 font-semibold">
                {formData.cookieSecurityScore} / 100
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.cookieSecurityScore}
              onChange={(e) =>
                setFormData({ ...formData, cookieSecurityScore: parseInt(e.target.value) || 0 })
              }
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0 (No flags, cleartext)</span>
              <span>50 (HttpOnly only)</span>
              <span>100 (Secure, HttpOnly, SameSite=Strict)</span>
            </div>
          </div>
        </div>

        {/* Safety Notice Callout */}
        <div className="p-4 rounded-lg bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-200 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-white">Academic Safety Notice</div>
            <p className="mt-0.5 text-slate-300 leading-relaxed">
              Use this simulator and any scanner integrations only on systems you own or are
              authorized to assess. Unapproved port scanning, automated exploitation, or unauthorized
              reconnaissance violates computer misuse legislation.
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-xs rounded bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/80 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Form</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2 text-xs rounded bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/80 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Analyze Website</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
