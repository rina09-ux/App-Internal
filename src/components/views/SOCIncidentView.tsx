import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Lock,
  Filter,
  Eye,
  RefreshCw,
  Zap,
  Activity,
  Terminal,
} from 'lucide-react';
import { SecurityIncident } from '../../types/security';

interface SOCIncidentViewProps {
  incidents: SecurityIncident[];
  onTriageIncident: (incident: SecurityIncident, newStatus: SecurityIncident['status']) => void;
  showToast: (msg: string) => void;
}

export const SOCIncidentView: React.FC<SOCIncidentViewProps> = ({
  incidents,
  onTriageIncident,
  showToast,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [liveLogs, setLiveLogs] = useState<string[]>([
    '[SOC-STREAM] 17:31:02.194 - QKD-JKT-01 photon stream locked at 4.82 MHz (QBER 1.82%)',
    '[SOC-STREAM] 17:31:44.802 - TLS Intercept Alert: AS41228 attempted SSLv3/TLS1.1 handshake fallback',
    '[SOC-STREAM] 17:32:10.450 - Automated PQC Enforcement: Dropped unauthenticated RSA-2048 client hello',
    '[SOC-STREAM] 17:32:39.912 - HSM Cluster 01: TRNG quantum vacuum fluctuation entropy verified 8.000 bits/byte',
  ]);

  const filteredIncidents = incidents.filter(
    (inc) => selectedSeverity === 'ALL' || inc.severity === selectedSeverity
  );

  const getSeverityBadge = (sev: SecurityIncident['severity']) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500 text-white';
      case 'HIGH':
        return 'bg-amber-500 text-white';
      case 'MEDIUM':
        return 'bg-yellow-500 text-slate-900';
      case 'LOW':
        return 'bg-blue-500 text-white';
    }
  };

  const getStatusBadge = (st: SecurityIncident['status']) => {
    switch (st) {
      case 'Investigating':
        return 'bg-rose-50 text-rose-700 border border-rose-500/30';
      case 'Contained':
        return 'bg-amber-50 text-amber-700 border border-amber-500/30';
      case 'Mitigated':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-500/30';
      case 'False Positive':
        return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              SOC &amp; Quantum Threat Response Center
            </h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active threat triage, HNDL intercept alarms, optical QBER anomalies, and automated quarantine triggers.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-hidden cursor-pointer shadow-2xs"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Severity</option>
            <option value="MEDIUM">Medium / Optical</option>
            <option value="LOW">Low Severity</option>
          </select>
        </div>
      </div>

      {/* Live Stream Terminal Box */}
      <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950 text-slate-300 font-mono text-xs shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Terminal className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold tracking-wider uppercase">Live Cryptographic SOC Intercept Stream</span>
          </div>
          <span className="text-[10px] text-slate-500 font-sans">Stream: /dev/quantum_soc_events0</span>
        </div>
        <div className="space-y-1 text-[11px]">
          {liveLogs.map((log, i) => (
            <div key={i} className="leading-relaxed flex items-start gap-2">
              <span className="text-cyan-500 shrink-0">❯</span>
              <span className={log.includes('Alert') || log.includes('RSA') ? 'text-amber-300' : 'text-slate-300'}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Active Security Incidents Queue ({filteredIncidents.length})
          </h3>
          <span className="text-xs text-slate-400">Auto-refresh active (3s)</span>
        </div>

        {filteredIncidents.map((incident) => (
          <div
            key={incident.id}
            className="border border-slate-200/90 rounded-2xl p-5 bg-white shadow-2xs hover:border-slate-300 transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${getSeverityBadge(
                    incident.severity
                  )}`}
                >
                  {incident.severity}
                </span>
                <span className="font-mono text-xs text-slate-500 font-semibold">{incident.id}</span>
                <h4 className="text-sm font-bold text-slate-900">{incident.title}</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${getStatusBadge(incident.status)}`}>
                  {incident.status}
                </span>
                <span className="text-xs text-slate-400 font-mono">{incident.detectedAt}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Threat Source</span>
                <span className="font-mono text-slate-800 font-semibold truncate block">{incident.source}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Vector</span>
                <span className="font-mono text-slate-800 font-semibold truncate block">{incident.targetEndpoint}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Crypto Officer</span>
                <span className="text-slate-800 font-semibold truncate block">{incident.assignedOfficer}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-800">Recommendation: </span>
                <span>{incident.mitigationRecommendation}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {incident.status !== 'Mitigated' && (
                  <button
                    onClick={() => {
                      onTriageIncident(incident, 'Mitigated');
                      showToast(`Incident ${incident.id} marked as Mitigated & Quantum Policy Enforced`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-2xs transition cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Enforce Mitigation</span>
                  </button>
                )}
                {incident.status === 'Investigating' && (
                  <button
                    onClick={() => {
                      onTriageIncident(incident, 'Contained');
                      showToast(`Incident ${incident.id} isolated into Quantum Quarantine`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs transition cursor-pointer"
                  >
                    Quarantine Endpoint
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
