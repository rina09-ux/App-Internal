import React, { useState } from 'react';
import {
  Radio,
  ShieldAlert,
  Globe,
  AlertTriangle,
  Lock,
  Search,
  ExternalLink,
  Users,
  Shield,
  BadgeCheck,
  Key,
  Cpu,
  Server,
  FileCheck2,
  CheckCircle2,
  Settings as SettingsIcon,
  RefreshCw,
  Plus,
  Zap,
} from 'lucide-react';
import { SecurityClearance, CryptoAsset } from '../../types/security';

export const ThreatIntelView: React.FC<{ showToast: (msg: string) => void }> = ({ showToast }) => {
  const threatFeeds = [
    {
      actor: 'APT-Q44 (Quantum Harvesting Nexus)',
      target: 'Trans-Atlantic Optical Undersea Backbones',
      method: 'Harvest-Now-Decrypt-Later (HNDL) continuous encrypted payload interception',
      risk: 'CRITICAL',
      status: 'Active Intercept Observed',
    },
    {
      actor: 'State-Sponsored Advanced Cryptanalytic Group',
      target: 'Commercial Banking RSA-2048 / ECDSA Roots',
      method: 'Simulated Shor Quantum Circuit Pre-computation & Key Factorization Indexing',
      risk: 'HIGH',
      status: 'Under Continuous Monitoring',
    },
    {
      actor: 'CVE-2026-8819 Downgrade Vector',
      target: 'Legacy SSLv3/TLS1.2 Handshake Negotiators',
      method: 'Forced fallback attack to bypass ML-KEM-768 hybrid cipher negotiation',
      risk: 'HIGH',
      status: 'Patch Deployed to Gateway Mesh',
    },
  ];

  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-white min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Threat Intelligence &amp; HNDL Defense Radar
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/30">
              CRQC Horizon Radar
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptanalytically Relevant Quantum Computer (CRQC) threat projections and adversary HNDL campaigns.
          </p>
        </div>

        <button
          onClick={() => showToast('Pulled latest quantum adversary IOC signatures from CISA & NSA feeds')}
          className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
        >
          Refresh IOC Threat Feed
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
          <span className="text-slate-400 text-xs block">Estimated CRQC Risk Window</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">2029 – 2032</span>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">4,000+ Logical Qubit Threshold</span>
        </div>
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
          <span className="text-slate-400 text-xs block">HNDL Dark-Data Intercept Index</span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">Level 4 (Elevated)</span>
          <span className="text-[11px] text-slate-500 mt-1 block">PQC Mandatory For Data in Transit</span>
        </div>
        <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
          <span className="text-slate-400 text-xs block">Active Automated PQC Enforcements</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">1,842 / sec</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Non-PQC Handshakes Blocked</span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Active Quantum Threat Actors &amp; Campaigns
        </h3>
        {threatFeeds.map((t, idx) => (
          <div key={idx} className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">{t.actor}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-700 font-mono">
                {t.risk}
              </span>
            </div>
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Target Vector:</span> {t.target}
            </div>
            <div className="text-xs text-slate-500">{t.method}</div>
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="text-slate-700 font-mono font-medium text-[11px]">{t.status}</span>
              <button
                onClick={() => showToast(`Loaded IOC signature block for ${t.actor}`)}
                className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
              >
                Inspect IOC Rule →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TeamClearanceView: React.FC<{ showToast: (msg: string) => void }> = ({ showToast }) => {
  const officers = [
    {
      name: 'Dr. Victor Danilov',
      role: 'Chief Cryptographer & PQC Architect',
      clearance: 'Q-Clearance' as SecurityClearance,
      access: 'HSM Master Root Keys, PQC Algorithm Verification, FIPS 203/204 Signoff',
      status: 'ACTIVE_VAULT',
    },
    {
      name: 'Ahmad Rahman',
      role: 'SOC Commander & Incident Responder',
      clearance: 'Top Secret (SCI)' as SecurityClearance,
      access: 'Real-time Intercept Feeds, Network Isolation, Quantum Quarantine Controls',
      status: 'ON_DUTY',
    },
    {
      name: 'Sarah Takahashi',
      role: 'Lead Photonic & QKD Hardware Engineer',
      clearance: 'Top Secret (SCI)' as SecurityClearance,
      access: 'QKD Transceivers, Fiber Polarization Calibration, Dark Fiber Ring Splice',
      status: 'ON_DUTY',
    },
    {
      name: 'Maya Chen',
      role: 'Security Governance & FIPS Auditor',
      clearance: 'Secret' as SecurityClearance,
      access: 'CBOM Inventory Auditing, CNSA 2.0 Compliance Certification',
      status: 'ACTIVE_VAULT',
    },
  ];

  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-white min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Security Clearances &amp; Cryptographic Officers
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/30">
              RBAC Cryptographic Enclave
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-Based Access Control, Q-Clearance authorizations, and two-person rule enforcement for HSM Master Root Rekeying.
          </p>
        </div>

        <button
          onClick={() => showToast('Audit trail for all active Q-Clearance sessions exported')}
          className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-slate-800 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
        >
          Export Clearance Audit Log
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {officers.map((officer, i) => (
          <div key={i} className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-cyan-300 font-mono font-bold flex items-center justify-center text-xs">
                  {officer.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{officer.name}</h4>
                  <p className="text-xs text-slate-500">{officer.role}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-50 text-amber-600 border border-amber-500/30">
                {officer.clearance}
              </span>
            </div>

            <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Enclave Authorizations</span>
              <span className="text-slate-700 font-medium">{officer.access}</span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {officer.status}
              </span>
              <button
                onClick={() => showToast(`Inspected HSM cryptographic signing keys for ${officer.name}`)}
                className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
              >
                Inspect Credentials →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const OtherSecurityViews: React.FC<{
  viewId: string;
  assets: CryptoAsset[];
  onOpenRekeyModal: (asset: CryptoAsset) => void;
  onOpenScanModal: () => void;
  showToast: (msg: string) => void;
}> = ({ viewId, assets, onOpenRekeyModal, onOpenScanModal, showToast }) => {
  if (viewId === 'hsm-clusters') {
    return (
      <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-white min-w-0 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Hardware Security Modules (HSM) &amp; KMS Vaults
            </h1>
            <p className="text-xs text-slate-500">
              FIPS 140-3 Level 4 hardware partitions with Lattice PQC root key generation.
            </p>
          </div>
          <button
            onClick={() => showToast('Generated fresh Quantum-Entropy Entropy Seed for HSM-01')}
            className="px-3.5 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-2xs transition cursor-pointer"
          >
            Refresh Entropy Pool
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">ONLINE</span>
            </div>
            <div className="font-bold text-sm text-slate-900">HSM Primary Cluster DC-1</div>
            <div className="text-xs text-slate-500">Thales Luna 7000 • FIPS 140-3 L4</div>
            <div className="pt-2 text-[11px] font-mono text-slate-700 border-t border-slate-100">
              TRNG Entropy: 8.000 bits/byte
            </div>
          </div>

          <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">SYNCD</span>
            </div>
            <div className="font-bold text-sm text-slate-900">HSM Secondary DR Vault DC-2</div>
            <div className="text-xs text-slate-500">Entrust nShield XC • FIPS 140-3 L3</div>
            <div className="pt-2 text-[11px] font-mono text-slate-700 border-t border-slate-100">
              Replication Lag: 0.12 ms
            </div>
          </div>

          <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <Server className="w-5 h-5 text-indigo-600" />
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600">ENCLAVE</span>
            </div>
            <div className="font-bold text-sm text-slate-900">AWS CloudHSM PQC Partition</div>
            <div className="text-xs text-slate-500">ML-KEM-1024 Hardware Accelerated</div>
            <div className="pt-2 text-[11px] font-mono text-slate-700 border-t border-slate-100">
              Active Keys: 1,420
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (viewId === 'settings') {
    return (
      <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-white min-w-0 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Security &amp; Policy Settings</h1>
          <p className="text-xs text-slate-500">
            Configure automated cryptographic enforcement, downgrade attack protection, and alert webhooks.
          </p>
        </div>

        <div className="space-y-4 max-w-3xl">
          <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Automated Downgrade Attack Prevention</h3>
            <p className="text-xs text-slate-500">
              Strictly drop TLS client hello requests offering RSA-2048 or ECC-P256 without ML-KEM encapsulation support.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => showToast('Enforced Strict Quantum-Safe Cipher Negotiation')}
                className="px-4 py-2 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-2xs"
              >
                Enforce Strict Quantum-Safe Ciphers
              </button>
            </div>
          </div>

          <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">NIST FIPS 203/204 Key Lifecycle Management</h3>
            <p className="text-xs text-slate-500">
              Automated re-keying rotation interval for symmetric session keys and ML-DSA root signing certificates.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block">Symmetric Rotation Interval</span>
                <span className="font-bold text-slate-900 mt-1 block">15 Minutes (Active)</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block">ML-DSA Root Expiry</span>
                <span className="font-bold text-slate-900 mt-1 block">365 Days (Auto-renewed)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-white min-w-0 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight capitalize">
            {viewId.replace('-', ' ')}
          </h1>
          <p className="text-xs text-slate-500">
            Cryptographic enterprise assets and configuration for {viewId}.
          </p>
        </div>
        <button
          onClick={onOpenScanModal}
          className="px-3.5 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-2xs transition cursor-pointer"
        >
          Scan &amp; Audit
        </button>
      </div>

      <div className="border border-slate-200/90 rounded-2xl p-5 bg-white shadow-2xs">
        <div className="text-xs text-slate-600 font-medium">
          Showing {assets.length} registered cryptographic assets in active cluster.
        </div>
      </div>
    </div>
  );
};
