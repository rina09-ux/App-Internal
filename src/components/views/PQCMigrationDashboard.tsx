import React, { useState } from 'react';
import {
  Gem,
  Check,
  Sparkles,
  Binary,
  ShieldAlert,
  Zap,
  Download,
  KeyRound,
  Lock,
  Search,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { CryptoAsset, QuantumRiskLevel } from '../../types/security';

interface PQCMigrationDashboardProps {
  assets: CryptoAsset[];
  onOpenRekeyModal: (asset: CryptoAsset) => void;
  onOpenScanModal: () => void;
  onSelectView: (view: string) => void;
  showToast: (msg: string) => void;
}

export const PQCMigrationDashboard: React.FC<PQCMigrationDashboardProps> = ({
  assets,
  onOpenRekeyModal,
  onOpenScanModal,
  onSelectView,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'NIST_FIPS' | 'CNSA_2' | 'HYBRID'>('NIST_FIPS');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAddons, setActiveAddons] = useState<{ [key: string]: boolean }>({
    qkd: true,
    hsm: true,
    rekey: true,
    sidechannel: false,
  });

  const toggleAddon = (key: string) => {
    setActiveAddons((prev) => {
      const updated = !prev[key];
      showToast(`${key.toUpperCase()} Enclave Policy ${updated ? 'Enabled' : 'Disabled'}`);
      return { ...prev, [key]: updated };
    });
  };

  const handleExportCBOM = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(assets, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Q-Shield_CBOM_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported Cryptography Bill of Materials (CBOM) in JSON format');
  };

  const level1Features = [
    'Hybrid TLS 1.3 Key Encapsulation',
    'X25519 + ML-KEM-768 Handshake',
    'Zero latency overhead (< 1.5ms)',
    'Backward compatible with legacy clients',
    'Automated TLS certificate renewal',
    'Standard AES-256-GCM symmetric session',
  ];

  const level2Features = [
    'Everything in Hybrid PQC',
    'Pure ML-KEM-1024 (FIPS 203 Level 5)',
    'ML-DSA-87 (Dilithium-5) Signatures',
    'SLH-DSA-256s Firmware Secure Boot',
    'Automated Harvest-Now-Decrypt-Later Defense',
    'FIPS 140-3 Cryptographic Boundary',
    'Tamper-resistant TRNG Entropy source',
  ];

  const level3Features = [
    'Everything in Pure Lattice PQC',
    'Photonic QKD Optical BB84/E91 Mesh',
    'Quantum One-Time-Pad Subsea Link',
    'Dual-redundant Hardware HSM Enclave',
    'Continuous QBER Real-time Intercept Alarm',
    'Two-Person Cryptographic Officer signoff',
    'National Security CNSA 2.0 Certified',
  ];

  const filteredAssets = assets.filter((asset) =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.currentAlgorithm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.environment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-white min-w-0">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center shadow-2xs">
              <Gem className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Post-Quantum Security &amp; CBOM
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCBOM}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-semibold hover:bg-slate-50 transition shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CBOM</span>
            </button>
            <button
              onClick={onOpenScanModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-semibold hover:bg-slate-50 transition shadow-2xs cursor-pointer group"
            >
              <span>Audit Endpoint</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>

        {/* Standard Switcher Pill */}
        <div className="flex items-center justify-center">
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl text-xs font-semibold select-none border border-slate-200/50">
            <button
              onClick={() => setActiveTab('NIST_FIPS')}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'NIST_FIPS'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              NIST FIPS 203/204 Standard
            </button>
            <button
              onClick={() => setActiveTab('CNSA_2')}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'CNSA_2'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              NSA CNSA 2.0 Mandate
            </button>
            <button
              onClick={() => setActiveTab('HYBRID')}
              className={`px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'HYBRID'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Hybrid Transition Mesh
            </button>
          </div>
        </div>

        {/* 3 Cryptographic Defense Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {/* Tier 1: Hybrid PQC */}
          <div className="border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 transition shadow-2xs bg-white">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Hybrid PQC Layer</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dual X25519 &amp; ML-KEM-768 key encapsulation for edge gateways.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 tracking-tight">Level 3</span>
                <span className="text-xs text-slate-400 font-medium">/ NIST Security</span>
              </div>

              <button
                onClick={() => showToast('Hybrid TLS 1.3 policy deployed to edge load balancers')}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
              >
                Deploy Hybrid Policy
              </button>

              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800">Key Capabilities:</div>
                <ul className="space-y-2 text-xs text-slate-600">
                  {level1Features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-slate-800 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Tier 2: Pure Lattice PQC (Active Featured Tier) */}
          <div className="border-2 border-black rounded-2xl p-5 flex flex-col justify-between relative shadow-sm bg-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Pure Lattice PQC</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    FIPS 203 (ML-KEM) &amp; FIPS 204 (ML-DSA) complete migration.
                  </p>
                </div>
                <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold rounded-md uppercase tracking-wider">
                  Active
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 tracking-tight">Level 5</span>
                <span className="text-xs text-slate-400 font-medium">/ FIPS 203 Max</span>
              </div>

              <button
                onClick={() => showToast('Pure Lattice PQC enforced across all internal microservices')}
                className="w-full py-2 px-3 rounded-xl bg-black hover:bg-slate-800 text-xs font-semibold text-white transition cursor-pointer shadow-xs"
              >
                Enforce FIPS 203/204
              </button>

              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800">Key Capabilities:</div>
                <ul className="space-y-2 text-xs text-slate-600">
                  {level2Features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-slate-800 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Tier 3: Photonic QKD & HSM Enclave */}
          <div className="border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 transition shadow-2xs bg-white">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Photonic QKD Mesh</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Quantum Entanglement (E91) &amp; Decoy-State BB84 dark fiber spans.
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 tracking-tight">Optic QKD</span>
                <span className="text-xs text-slate-400 font-medium">/ 0-Latency OTP</span>
              </div>

              <button
                onClick={() => onSelectView('qkd-network')}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
              >
                Inspect QKD Mesh →
              </button>

              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800">Key Capabilities:</div>
                <ul className="space-y-2 text-xs text-slate-600">
                  {level3Features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-slate-800 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Cryptographic Add-ons & Defense Modules */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Quantum Security Modules &amp; Add-ons</h2>
              <p className="text-xs text-slate-500">
                Configure real-time automated defense pipelines for the enterprise cryptographic perimeter.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Addon 1 */}
            <div className="border border-slate-200/80 rounded-xl p-4 bg-white shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">QKD Optical Sync</h4>
                  <input
                    type="checkbox"
                    checked={activeAddons.qkd}
                    onChange={() => toggleAddon('qkd')}
                    className="cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Continuous photon stream injection for subsea trans-border links.
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-slate-800 mt-3">4.8 MHz Stream</div>
            </div>

            {/* Addon 2 */}
            <div className="border border-slate-200/80 rounded-xl p-4 bg-white shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">HSM Master Partition</h4>
                  <input
                    type="checkbox"
                    checked={activeAddons.hsm}
                    onChange={() => toggleAddon('hsm')}
                    className="cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  FIPS 140-3 Level 4 physical tamper-resistant enclave sync.
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-slate-800 mt-3">Dual DR Vault</div>
            </div>

            {/* Addon 3 */}
            <div className="border border-slate-200/80 rounded-xl p-4 bg-white shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">HNDL Auto-Rekey</h4>
                  <input
                    type="checkbox"
                    checked={activeAddons.rekey}
                    onChange={() => toggleAddon('rekey')}
                    className="cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Rotate symmetric session keys every 15 minutes automatically.
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-slate-800 mt-3">Active (900s)</div>
            </div>

            {/* Addon 4 */}
            <div className="border border-slate-200/80 rounded-xl p-4 bg-white shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Side-Channel Masking</h4>
                  <input
                    type="checkbox"
                    checked={activeAddons.sidechannel}
                    onChange={() => toggleAddon('sidechannel')}
                    className="cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  1st-order Boolean masking on ARM Cortex-M4 assembly code.
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-slate-800 mt-3">0 Leakage Verified</div>
            </div>
          </div>
        </div>

        {/* Cryptography Bill of Materials (CBOM) Table */}
        <div className="border border-slate-200/80 rounded-2xl p-5 bg-white shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Cryptography Bill of Materials (CBOM)
              </h3>
              <p className="text-xs text-slate-500">
                Live inventory of certificates, host keys, HSM roots, and database encryption layers.
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter endpoints, keys..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-slate-400 transition"
              />
            </div>
          </div>

          <div className="border border-slate-200/80 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Asset ID / Endpoint</th>
                  <th className="py-2.5 px-3">Environment</th>
                  <th className="py-2.5 px-3">Current Algorithm</th>
                  <th className="py-2.5 px-3">Target PQC Standard</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 font-mono text-[11px]">{asset.name}</div>
                      <div className="text-[10px] text-slate-400">{asset.id} • {asset.type}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-medium">
                        {asset.environment}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono text-[11px] text-slate-900 font-medium">
                        {asset.currentAlgorithm}
                      </div>
                      <div className="text-[10px] text-slate-400">{asset.family}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono text-[11px] text-blue-700 font-semibold">
                        {asset.pqcTargetAlgorithm}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                          asset.migrationStatus === 'PQC Validated'
                            ? 'text-emerald-600'
                            : asset.migrationStatus === 'In Hybrid Transition'
                            ? 'text-blue-600'
                            : 'text-rose-600 font-bold'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            asset.migrationStatus === 'PQC Validated'
                              ? 'bg-emerald-500'
                              : asset.migrationStatus === 'In Hybrid Transition'
                              ? 'bg-blue-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        {asset.migrationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {asset.migrationStatus !== 'PQC Validated' ? (
                        <button
                          onClick={() => onOpenRekeyModal(asset)}
                          className="px-2.5 py-1 rounded-lg bg-black hover:bg-slate-800 text-white font-semibold text-[11px] transition cursor-pointer"
                        >
                          Rekey PQC →
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-mono font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          Secured ✓
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
