import React from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Download,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ComplianceMilestone } from '../../types/security';

interface ComplianceStandardsViewProps {
  milestones: ComplianceMilestone[];
  showToast: (msg: string) => void;
}

export const ComplianceStandardsView: React.FC<ComplianceStandardsViewProps> = ({
  milestones,
  showToast,
}) => {
  const handleGenerateAuditReport = () => {
    showToast('Generated Official NIST & CNSA 2.0 Compliance Audit Certificate (PDF)');
  };

  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Post-Quantum Compliance &amp; Standards Tracker
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
              Audited 2026
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Validation milestones against NIST FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), FIPS 205 (SLH-DSA), and NSA CNSA 2.0 timelines.
          </p>
        </div>

        <button
          onClick={handleGenerateAuditReport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Export Compliance Audit Report</span>
        </button>
      </div>

      {/* Compliance Overview Banner */}
      <div className="border border-slate-200/90 rounded-2xl p-5 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Enterprise Post-Quantum Posture: 82% CNSA 2.0 Compliant
              </h3>
              <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                Tier-1 Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              All TLS Edge Load Balancers, VPN gateways, and Code-Signing roots meet or exceed the mandatory NIST 2026 PQC baseline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            Next Audit: Nov 2026
          </span>
        </div>
      </div>

      {/* Standards Milestones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {milestones.map((milestone) => (
          <div
            key={milestone.id}
            className="border border-slate-200/90 rounded-2xl p-5 bg-white shadow-2xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono">
                  {milestone.id}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    milestone.status === 'Compliant'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-500/30'
                      : 'bg-blue-50 text-blue-700 border border-blue-500/30'
                  }`}
                >
                  {milestone.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-2">{milestone.standard}</h3>
              <p className="text-xs text-slate-600 mt-1">{milestone.requiredScope}</p>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Implementation Readiness</span>
                  <span className="font-mono font-bold text-slate-900">{milestone.completionPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all"
                    style={{ width: `${milestone.completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Deadline: {milestone.deadline}
              </span>
              <button
                onClick={() => showToast(`Inspection logs for ${milestone.standard} loaded`)}
                className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
              >
                Inspect Scope →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
