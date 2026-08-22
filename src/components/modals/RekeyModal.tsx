import React, { useState } from 'react';
import {
  X,
  Zap,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  Shield,
  Loader2,
} from 'lucide-react';
import { CryptoAsset } from '../../types/security';

interface RekeyModalProps {
  asset: CryptoAsset | null;
  onClose: () => void;
  onConfirmRekey: (assetId: string, targetAlgorithm: string) => void;
}

export const RekeyModal: React.FC<RekeyModalProps> = ({
  asset,
  onClose,
  onConfirmRekey,
}) => {
  if (!asset) return null;

  const [selectedAlgo, setSelectedAlgo] = useState<string>(
    asset.pqcTargetAlgorithm || 'ML-KEM-768 (FIPS 203)'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'SELECT' | 'GENERATING' | 'SUCCESS'>('SELECT');

  const algorithmOptions = [
    {
      name: 'ML-KEM-768 (NIST FIPS 203 / Kyber-768)',
      category: 'Key Encapsulation Mechanism (KEM)',
      securityLevel: 'AES-192 Equivalent (NIST Level 3)',
      recommended: true,
    },
    {
      name: 'ML-KEM-1024 (NIST FIPS 203 / Kyber-1024)',
      category: 'High-Security KEM',
      securityLevel: 'AES-256 Equivalent (NIST Level 5)',
      recommended: false,
    },
    {
      name: 'ML-DSA-65 (NIST FIPS 204 / Dilithium-3)',
      category: 'Lattice Digital Signature',
      securityLevel: 'NIST Level 3 Signature',
      recommended: false,
    },
    {
      name: 'SLH-DSA-SHAKE-256s (NIST FIPS 205 / SPHINCS+)',
      category: 'Stateless Hash Signature',
      securityLevel: 'Conservative Fallback (Zero Lattice Assumption)',
      recommended: false,
    },
  ];

  const handleExecuteRekey = () => {
    setIsProcessing(true);
    setStep('GENERATING');

    setTimeout(() => {
      setIsProcessing(false);
      setStep('SUCCESS');
      setTimeout(() => {
        onConfirmRekey(asset.id, selectedAlgo);
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl max-w-lg w-full p-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'SELECT' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Execute Post-Quantum Rekeying
                </h3>
                <p className="text-xs text-slate-500 font-mono">{asset.name}</p>
              </div>
            </div>

            {/* Current vs Target Comparison */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Algorithm</span>
                <span className="font-mono text-rose-600 font-bold block truncate">{asset.currentAlgorithm}</span>
                <span className="text-[10px] text-rose-500 font-medium">Vulnerable to Shor's Algo</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Target PQC Suite</span>
                <span className="font-mono text-emerald-600 font-bold block truncate">{selectedAlgo.split(' ')[0]}</span>
                <span className="text-[10px] text-emerald-600 font-medium">NIST FIPS Validated</span>
              </div>
            </div>

            {/* PQC Algorithm Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">
                Select NIST Post-Quantum Algorithm Standard:
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {algorithmOptions.map((opt) => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setSelectedAlgo(opt.name)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between ${
                      selectedAlgo === opt.name
                        ? 'border-blue-600 bg-blue-50/50 text-slate-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold font-mono text-[11px] flex items-center gap-1.5">
                        {opt.name}
                        {opt.recommended && (
                          <span className="bg-blue-600 text-white text-[9px] px-1.5 py-0.2 rounded font-sans font-semibold">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{opt.category} • {opt.securityLevel}</div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedAlgo === opt.name
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {selectedAlgo === opt.name && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rekey Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteRekey}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Deploy PQC Lattice Keys</span>
              </button>
            </div>
          </div>
        )}

        {step === 'GENERATING' && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              <KeyRound className="w-5 h-5 text-blue-600 absolute inset-0 m-auto" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Generating PQC Lattice Keys...
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Injecting Quantum TRNG entropy and binding ML-KEM encapsulation to HSM
              </p>
            </div>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                PQC Rekeying Successful!
              </h3>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                Endpoint {asset.name} is now protected against quantum cryptanalysis.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
