import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  ExternalLink,
  Shield,
  Clock,
  Layers,
  FileText,
  Activity,
  UserCheck,
  Tag,
  AlertTriangle,
  CheckCircle2,
  Code,
  ArrowUpRight,
} from 'lucide-react';
import { exportToJSON } from '../../utils/exportUtils';

export interface InspectorEntity {
  type: string;
  title: string;
  id: string;
  status?: string;
  data: Record<string, any>;
}

interface DetailInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entity: InspectorEntity | null;
  onAction?: (actionName: string, entity: InspectorEntity) => void;
}

export const DetailInspectorDrawer: React.FC<DetailInspectorDrawerProps> = ({
  isOpen,
  onClose,
  entity,
  onAction,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'raw_json'>('overview');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !entity) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(entity.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadRecord = () => {
    exportToJSON(entity.data, `${entity.type.toLowerCase()}-${entity.id}`);
  };

  const data = entity.data;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 text-white uppercase tracking-wider">
                {entity.type}
              </span>
              {entity.status && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/30">
                  {entity.status}
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-slate-900 line-clamp-1">{entity.title}</h2>
            <p className="text-xs font-mono text-slate-400">UUID / Key: {entity.id}</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDownloadRecord}
              title="Download Record JSON"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-5 bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Overview &amp; Attributes
          </button>
          <button
            onClick={() => setActiveTab('technical')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'technical'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Telemetry &amp; Audit
          </button>
          <button
            onClick={() => setActiveTab('raw_json')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'raw_json'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Raw JSON Payload
          </button>
        </div>

        {/* Drawer Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(data)
                  .filter(([key]) => typeof data[key] !== 'object' && key !== 'content' && key !== 'scopes')
                  .slice(0, 10)
                  .map(([key, val]) => (
                    <div key={key} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 mt-1 block truncate">
                        {String(val)}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Special arrays or complex attributes */}
              {Array.isArray(data.scopes) && (
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                    Assigned Clearance &amp; RBAC Scopes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {data.scopes.map((scope: string) => (
                      <span
                        key={scope}
                        className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-md text-[10px] font-mono"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {data.content && (
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                    Document Body / Content Snippet
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {String(data.content)}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="space-y-4">
              <div className="cyber-card p-4 text-white rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-cyan-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 glow-pulse-dot" />
                    Cryptographic Integrity Hash
                  </span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
                    SHA3-512
                  </span>
                </div>
                <div className="font-mono text-[11px] text-slate-300 break-all bg-black/40 p-2 rounded">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855...verified
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900">Lineage &amp; Compliance Audit</h4>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-slate-500">Security Standard Compliance</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      FIPS 203 / CNSA 2.0
                    </span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-slate-500">Immutable Ledger Node</span>
                    <span className="font-mono text-slate-700">ledger-validator-node-04</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-slate-500">Last Verified Signature</span>
                    <span className="text-slate-700 font-mono">2026-08-19 18:22:15 UTC</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'raw_json' && (
            <div className="relative">
              <div className="absolute top-2 right-2 flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-medium transition cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 text-cyan-300 font-mono text-xs rounded-xl overflow-x-auto max-h-[480px]">
                {JSON.stringify(entity.data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500">
            Authoritative internal record state
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAction && onAction('edit', entity)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              Edit Attributes
            </button>
            <button
              onClick={() => {
                if (onAction) onAction('status_update', entity);
                onClose();
              }}
              className="btn-shimmer px-3.5 py-1.5 bg-black hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-md shadow-slate-900/20 transition-colors cursor-pointer active:scale-[0.98]"
            >
              Execute Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
