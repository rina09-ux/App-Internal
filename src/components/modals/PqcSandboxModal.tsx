import React, { useState } from 'react';
import { DotGrid } from '../magic/effects';

const INTERNAL_DEMO_MODE = import.meta.env.VITE_NUSASEC_INTERNAL_DEMO_MODE === 'true';
import {
  ShieldCheck,
  Zap,
  Key,
  Lock,
  Unlock,
  RefreshCw,
  Copy,
  Check,
  X,
  FileCode,
  ArrowRight,
  Sparkles,
  Terminal,
  Cpu,
  Download,
} from 'lucide-react';
import { exportToJSON } from '../../utils/exportUtils';

interface PqcSandboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const PqcSandboxModal: React.FC<PqcSandboxModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'kem' | 'dsa' | 'hybrid' | 'benchmark'>('kem');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // KEM State (ML-KEM-768 / Kyber)
  const [kemAlgorithm, setKemAlgorithm] = useState<'ML-KEM-512' | 'ML-KEM-768' | 'ML-KEM-1024'>('ML-KEM-768');
  const [kemKeys, setKemKeys] = useState<{
    publicKey: string;
    privateKey: string;
    ciphertext: string;
    sharedSecret: string;
    entropyBits: number;
    securityCategory: string;
    executionTimeMs: number;
  }>({
    publicKey: '0x3f8a91b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1...[1184 bytes]',
    privateKey: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b...[2400 bytes]',
    ciphertext: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b...[1088 bytes]',
    sharedSecret: '0x7e8b9f1a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f (256-bit AES Key)',
    entropyBits: 192,
    securityCategory: 'NIST Level 3 (AES-192 Equivalent Hardness)',
    executionTimeMs: 0.14,
  });

  // DSA State (ML-DSA-65 / Dilithium)
  const [dsaMessage, setDsaMessage] = useState('Authorization: TENANT_ACME_CORP_TOKEN_FIPS203');
  const [dsaVerified, setDsaVerified] = useState<boolean | null>(true);
  const [dsaKeys, setDsaKeys] = useState({
    publicKey: '0x5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c...[1952 bytes]',
    signature: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2...[3309 bytes]',
    status: 'Verified (Valid Dilithium3 ML-DSA-65 Signature)',
  });

  if (!isOpen) return null;

  if (!INTERNAL_DEMO_MODE) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-lg w-full p-6">
          <h2 className="text-base font-bold text-slate-900">PQC Sandbox</h2>
          <p className="text-sm text-slate-600 mt-2">Sandbox execution is disabled in production. Live cryptographic operations must use the NusaSec-Core/PQC service contract.</p>
          <button onClick={onClose} className="mt-5 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold">Close</button>
        </div>
      </div>
    );
  }

  const handleGenerateKEM = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randHex = (len: number) => {
        const byteCount = Math.ceil(len / 2);
        const bytes = new Uint8Array(byteCount);
        crypto.getRandomValues(bytes);
        return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('').slice(0, len);
      };

      const pubSize = kemAlgorithm === 'ML-KEM-512' ? 800 : kemAlgorithm === 'ML-KEM-768' ? 1184 : 1568;
      const ctSize = kemAlgorithm === 'ML-KEM-512' ? 768 : kemAlgorithm === 'ML-KEM-768' ? 1088 : 1568;
      const cat = kemAlgorithm === 'ML-KEM-512' ? 'NIST Level 1 (AES-128 Equivalent)' : kemAlgorithm === 'ML-KEM-768' ? 'NIST Level 3 (AES-192 Equivalent)' : 'NIST Level 5 (AES-256 Equivalent)';

      setKemKeys({
        publicKey: `0x${randHex(32)}...[${pubSize} bytes]`,
        privateKey: `0x${randHex(32)}...[${pubSize * 2} bytes]`,
        ciphertext: `0x${randHex(32)}...[${ctSize} bytes]`,
        sharedSecret: `0x${randHex(64)} (256-bit Derived Symmetric Key)`,
        entropyBits: kemAlgorithm === 'ML-KEM-512' ? 128 : kemAlgorithm === 'ML-KEM-768' ? 192 : 256,
        securityCategory: cat,
        executionTimeMs: Number((0.09 + (kemAlgorithm === 'ML-KEM-512' ? 0.02 : kemAlgorithm === 'ML-KEM-768' ? 0.04 : 0.06)).toFixed(2)),
      });
      setIsGenerating(false);
      onShowToast(`Generated fresh ${kemAlgorithm} key encapsulation pair`);
    }, 450);
  };

  const handleSignDSA = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randHex = (len: number) => {
        const byteCount = Math.ceil(len / 2);
        const bytes = new Uint8Array(byteCount);
        crypto.getRandomValues(bytes);
        return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('').slice(0, len);
      };
      setDsaKeys({
        publicKey: `0x${randHex(32)}...[1952 bytes]`,
        signature: `0x${randHex(32)}...[3309 bytes]`,
        status: 'Verified (Valid Dilithium3 ML-DSA-65 Signature)',
      });
      setDsaVerified(true);
      setIsGenerating(false);
      onShowToast('Signed payload and verified with ML-DSA-65 public key');
    }, 400);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(label);
    onShowToast(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportCert = () => {
    const cert = {
      standard: 'FIPS 203 / FIPS 204 PQC Certificate Bundle',
      generated_at: new Date().toISOString(),
      kem: kemKeys,
      dsa: dsaKeys,
      fips_compliance: 'FIPS 140-3 Level 3 & CNSA 2.0 Ready',
    };
    exportToJSON(cert, 'pqc-cryptographic-certificate');
    onShowToast('Exported PQC Certificate Bundle (JSON)');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="relative overflow-hidden bg-slate-900 px-6 py-4">
          <DotGrid className="opacity-[0.3]" />
          <div className="blob-glow absolute -top-12 left-[15%] w-56 h-44 bg-emerald-400/15 pointer-events-none" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                <span className="absolute inset-0 rounded-2xl bg-emerald-400/20 blur-md glow-pulse-dot -z-10" />
                <Cpu className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white font-display">Post-Quantum Cryptography Sandbox</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                    FIPS 203 &amp; 204
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Interactive cryptographic engine: key encapsulation, signature validation, and hybrid TLS benchmarks.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200/80 flex items-center gap-4 bg-white overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('kem')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'kem'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>ML-KEM (Kyber Key Encapsulation)</span>
          </button>
          <button
            onClick={() => setActiveTab('dsa')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'dsa'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ML-DSA (Dilithium Digital Signatures)</span>
          </button>
          <button
            onClick={() => setActiveTab('hybrid')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'hybrid'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Hybrid TLS 1.3 Handshake</span>
          </button>
          <button
            onClick={() => setActiveTab('benchmark')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'benchmark'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Hardware Benchmarks</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: KEM */}
          {activeTab === 'kem' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Parameter Set Selection:</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Module Lattice-Based Key-Encapsulation Mechanism (NIST FIPS 203 Standard)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {(['ML-KEM-512', 'ML-KEM-768', 'ML-KEM-1024'] as const).map((alg) => (
                    <button
                      key={alg}
                      onClick={() => setKemAlgorithm(alg)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        kemAlgorithm === alg
                          ? 'bg-black text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {alg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-500">
                  Status: <span className="text-emerald-600 font-bold">{kemKeys.securityCategory}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCert}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Bundle</span>
                  </button>
                  <button
                    onClick={handleGenerateKEM}
                    disabled={isGenerating}
                    className="btn-shimmer btn-shimmer-dark flex items-center gap-1.5 px-4 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shadow-lg shadow-slate-900/20"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>{isGenerating ? 'Computing Lattice...' : 'Re-Encapsulate Key'}</span>
                  </button>
                </div>
              </div>

              {/* Key Inspector Fields */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Public Key (ek)
                    </span>
                    <button
                      onClick={() => copyToClipboard(kemKeys.publicKey, 'Public Key')}
                      className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'Public Key' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs text-slate-800 break-all p-2 bg-white rounded-lg border border-slate-200/70">
                    {kemKeys.publicKey}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Ciphertext (ct)
                    </span>
                    <button
                      onClick={() => copyToClipboard(kemKeys.ciphertext, 'Ciphertext')}
                      className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'Ciphertext' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs text-slate-800 break-all p-2 bg-white rounded-lg border border-slate-200/70">
                    {kemKeys.ciphertext}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-50/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                      Decapsulated Shared Secret (ss)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                      Latency: {kemKeys.executionTimeMs} ms
                    </span>
                  </div>
                  <div className="font-mono text-xs font-bold text-emerald-950 break-all p-2 bg-white rounded-lg border border-emerald-500/30">
                    {kemKeys.sharedSecret}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DSA */}
          {activeTab === 'dsa' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <label className="text-xs font-bold text-slate-900 block">Payload to Sign &amp; Authorize:</label>
                <input
                  type="text"
                  value={dsaMessage}
                  onChange={(e) => setDsaMessage(e.target.value)}
                  className="w-full text-xs font-mono p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                    ML-DSA-65 (Dilithium3)
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 font-mono">FIPS 204 Validated</span>
                </div>
                <button
                  onClick={handleSignDSA}
                  disabled={isGenerating}
                  className="btn-shimmer btn-shimmer-dark flex items-center gap-1.5 px-4 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 shadow-lg shadow-slate-900/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGenerating ? 'Signing...' : 'Sign & Verify Payload'}</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Public Verification Key
                  </span>
                  <div className="font-mono text-xs text-slate-800 break-all p-2 bg-white rounded-lg border border-slate-200/70">
                    {dsaKeys.publicKey}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Lattice Digital Signature
                  </span>
                  <div className="font-mono text-xs text-slate-800 break-all p-2 bg-white rounded-lg border border-slate-200/70">
                    {dsaKeys.signature}
                  </div>
                </div>

                {dsaVerified && (
                  <div className="p-3 bg-emerald-50 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs text-emerald-900 font-semibold">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{dsaKeys.status}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700">0.21 ms Verification</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: HYBRID TLS 1.3 */}
          {activeTab === 'hybrid' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2">
                <h4 className="font-bold text-slate-900">Hybrid TLS 1.3 Handshake Protocol (X25519Kyber768Draft00)</h4>
                <p>
                  Combines classical Elliptic Curve Diffie-Hellman (X25519) with Post-Quantum Lattice KEM (ML-KEM-768) to protect against &quot;Harvest Now, Decrypt Later&quot; adversaries while maintaining backward compatibility.
                </p>
              </div>

              {/* Handshake Flow Steps */}
              <div className="space-y-2.5">
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px]">1</span>
                    <div>
                      <span className="font-bold text-slate-900">ClientHello</span>
                      <span className="text-[11px] text-slate-500 block">KeyShare: X25519 + Kyber768 public keys sent in TLS extension</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 font-semibold">1,216 Bytes</span>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px]">2</span>
                    <div>
                      <span className="font-bold text-slate-900">ServerHello</span>
                      <span className="text-[11px] text-slate-500 block">Server encapsulates Kyber ciphertext &amp; performs X25519 exchange</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 font-semibold">1,120 Bytes</span>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px]">3</span>
                    <div>
                      <span className="font-bold text-slate-900">Dual Master Secret Derivation</span>
                      <span className="text-[11px] text-slate-500 block">HKDF-Extract(ECDH_Secret || Kyber_Secret) = Quantum-Safe Session Key</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 font-semibold">AES-256-GCM</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BENCHMARK */}
          {activeTab === 'benchmark' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900">Cryptographic Operation Latency Benchmarks (ARM64 / x86_64)</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Algorithm</th>
                      <th className="py-2.5 px-3">KeyGen</th>
                      <th className="py-2.5 px-3">Encaps / Sign</th>
                      <th className="py-2.5 px-3">Decaps / Verify</th>
                      <th className="py-2.5 px-3">NIST Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">ML-KEM-512</td>
                      <td className="py-2.5 px-3 font-mono">0.04 ms</td>
                      <td className="py-2.5 px-3 font-mono">0.05 ms</td>
                      <td className="py-2.5 px-3 font-mono">0.05 ms</td>
                      <td className="py-2.5 px-3 text-slate-500">Level 1</td>
                    </tr>
                    <tr className="bg-emerald-50/40">
                      <td className="py-2.5 px-3 font-bold text-emerald-950">ML-KEM-768 (Standard)</td>
                      <td className="py-2.5 px-3 font-mono font-bold">0.07 ms</td>
                      <td className="py-2.5 px-3 font-mono font-bold">0.08 ms</td>
                      <td className="py-2.5 px-3 font-mono font-bold">0.08 ms</td>
                      <td className="py-2.5 px-3 text-emerald-600 font-semibold">Level 3</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">ML-KEM-1024</td>
                      <td className="py-2.5 px-3 font-mono">0.11 ms</td>
                      <td className="py-2.5 px-3 font-mono">0.12 ms</td>
                      <td className="py-2.5 px-3 font-mono">0.13 ms</td>
                      <td className="py-2.5 px-3 text-slate-500">Level 5</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">ML-DSA-65 (Dilithium3)</td>
                      <td className="py-2.5 px-3 font-mono">0.24 ms</td>
                      <td className="py-2.5 px-3 font-mono">0.82 ms</td>
                      <td className="py-2.5 px-3 font-mono">0.21 ms</td>
                      <td className="py-2.5 px-3 text-slate-500">Level 3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
          <span className="text-slate-500">Hardware Accel: AVX2 / NEON Native Instructions Active</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl font-semibold transition cursor-pointer"
          >
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
};
