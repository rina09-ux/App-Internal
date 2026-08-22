import React, { useState } from 'react';
import { DotGrid } from '../magic/effects';
import {
  X,
  Search,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Shield,
  Loader2,
  ArrowRight,
  Lock,
} from 'lucide-react';

interface QuantumScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (newAssetEndpoint: string) => void;
}

export const QuantumScanModal: React.FC<QuantumScanModalProps> = ({
  isOpen,
  onClose,
  onScanComplete,
}) => {
  if (!isOpen) return null;

  const [targetEndpoint, setTargetEndpoint] = useState('vpn-gateway-apac.qshield.internal');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleRunScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEndpoint) return;

    setScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setScanning(false);
      setScanResult({
        endpoint: targetEndpoint,
        tlsVersion: 'TLS 1.3 (Draft Hybrid)',
        currentCipher: 'ECDHE-ECDSA-AES256-GCM-SHA384',
        pqcCompatibility: 'Partially Vulnerable (Non-PQC Key Exchange)',
        quantumRiskScore: 'HIGH (Vulnerable to HNDL)',
        recommendedAction: 'Upgrade to X25519MLKEM768 Cipher Suite (NIST FIPS 203)',
      });
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Dark console header */}
        <div className="relative overflow-hidden bg-slate-900 px-6 py-5">
          <DotGrid className="opacity-[0.3]" />
          <div className="blob-glow absolute -top-10 right-[10%] w-48 h-40 bg-cyan-400/15 pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0">
              <span className="absolute inset-0 rounded-full border border-cyan-400/40 animate-radar" style={{ borderStyle: 'dashed' }} />
              <Zap className="w-5 h-5 fill-cyan-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Quantum Cryptographic Vulnerability Audit
              </h3>
              <p className="text-xs text-slate-400">
                Deep packet probe for cipher suite, certificate chain, and HNDL susceptibility
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <form onSubmit={handleRunScan} className="space-y-3">
            <div>
              <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wide block mb-1">
                Target Endpoint / FQDN / IP Address
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={targetEndpoint}
                  onChange={(e) => setTargetEndpoint(e.target.value)}
                  placeholder="e.g. auth.internal.company.com:443"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={scanning || !targetEndpoint}
              className="btn-shimmer btn-shimmer-dark w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
            >
              {scanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Probing Handshake &amp; Cipher Suite...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                  <span>Run Live Quantum Probe</span>
                </>
              )}
            </button>
          </form>

          {/* Result Output */}
          {scanResult && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-900 font-mono">{scanResult.endpoint}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 font-mono">
                  {scanResult.quantumRiskScore.split(' ')[0]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Cipher Suite</span>
                  <span className="font-mono text-slate-800 font-medium text-[11px] truncate block">
                    {scanResult.currentCipher}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">PQC Status</span>
                  <span className="text-amber-700 font-semibold block text-[11px]">
                    {scanResult.pqcCompatibility}
                  </span>
                </div>
              </div>

              <div className="p-2.5 bg-blue-500/10 rounded-lg text-xs text-blue-900 border border-blue-500/30">
                <span className="font-bold block text-[11px]">Mitigation Path:</span>
                <span className="text-[11px] text-blue-600">{scanResult.recommendedAction}</span>
              </div>

              <button
                onClick={() => {
                  onScanComplete(scanResult.endpoint);
                  onClose();
                }}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
              >
                Add Endpoint to CBOM &amp; Schedule PQC Migration →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
