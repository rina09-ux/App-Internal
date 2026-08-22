import React, { useState } from 'react';
import {
  Network,
  Zap,
  Activity,
  Radio,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import { QKDNode } from '../../types/security';

interface QKDNetworkViewProps {
  nodes: QKDNode[];
  onTriggerRecalibration: (nodeId: string) => void;
  showToast: (msg: string) => void;
}

export const QKDNetworkView: React.FC<QKDNetworkViewProps> = ({
  nodes,
  onTriggerRecalibration,
  showToast,
}) => {
  const [selectedNode, setSelectedNode] = useState<QKDNode>(nodes[0]);

  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Quantum Key Distribution (QKD) Optical Mesh
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 border border-cyan-500/30">
              Photonic Entanglement
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time monitoring of BB84 / E91 protocol dark fiber spans, photon generation rates, and Quantum Bit Error Rate (QBER).
          </p>
        </div>

        <button
          onClick={() => showToast('All QKD optical transceivers synchronized with atomic clock')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Optical Hubs</span>
        </button>
      </div>

      {/* Optical Topology Map & Key Generation Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Visual Optical Topology Diagram (SVG) */}
        <div className="lg:col-span-2 border border-slate-200/90 rounded-2xl p-5 bg-white shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Active Optical QKD Mesh Topology
              </h3>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Photon Lock: ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select node to inspect polarization controllers and key pools
            </p>

            {/* Interactive SVG Topology */}
            <div className="my-4 h-64 bg-slate-950 rounded-xl relative p-4 flex items-center justify-center overflow-hidden border border-slate-800">
              <svg viewBox="0 0 600 240" className="w-full h-full">
                {/* Connecting Laser Beams (Glow lines) */}
                <line x1="120" y1="120" x2="300" y2="60" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5 5" className="animate-pulse" />
                <line x1="300" y1="60" x2="480" y2="120" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5 5" className="animate-pulse" />
                <line x1="120" y1="120" x2="300" y2="180" stroke="#06b6d4" strokeWidth="2" strokeDasharray="5 5" />
                <line x1="300" y1="180" x2="480" y2="120" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="300" y1="60" x2="300" y2="180" stroke="#3b82f6" strokeWidth="1.5" />

                {/* Center Pulse ring */}
                <circle cx="300" cy="60" r="28" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.3" className="animate-ping" />

                {/* Node 1: Jakarta HQ */}
                <g className="cursor-pointer" onClick={() => setSelectedNode(nodes[0])}>
                  <circle cx="120" cy="120" r="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
                  <text x="120" y="124" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">JKT</text>
                  <text x="120" y="152" fill="#94a3b8" fontSize="9" textAnchor="middle">Jakarta HQ</text>
                  <text x="120" y="164" fill="#38bdf8" fontSize="8" textAnchor="middle">1.82% QBER</text>
                </g>

                {/* Node 2: Singapore Link */}
                <g className="cursor-pointer" onClick={() => setSelectedNode(nodes[1])}>
                  <circle cx="300" cy="60" r="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
                  <text x="300" y="64" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">SG</text>
                  <text x="300" y="36" fill="#94a3b8" fontSize="9" textAnchor="middle">Singapore Equinix</text>
                </g>

                {/* Node 3: Bandung DR Vault */}
                <g className="cursor-pointer" onClick={() => setSelectedNode(nodes[2])}>
                  <circle cx="300" cy="180" r="18" fill="#1e293b" stroke="#10b981" strokeWidth="2.5" />
                  <text x="300" y="184" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">BDG</text>
                  <text x="300" y="210" fill="#94a3b8" fontSize="9" textAnchor="middle">Bandung Vault</text>
                </g>

                {/* Node 4: Surabaya Repeater */}
                <g className="cursor-pointer" onClick={() => setSelectedNode(nodes[3])}>
                  <circle cx="480" cy="120" r="18" fill="#1e293b" stroke="#f59e0b" strokeWidth="2.5" />
                  <text x="480" y="124" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">SBY</text>
                  <text x="480" y="152" fill="#94a3b8" fontSize="9" textAnchor="middle">Surabaya Repeater</text>
                  <text x="480" y="164" fill="#f59e0b" fontSize="8" textAnchor="middle">3.88% (Degraded)</text>
                </g>
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Optimal Optical Span</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Recalibrating</span>
            </div>
            <span className="font-mono text-[11px]">Protocol: Decoy-State BB84 + E91</span>
          </div>
        </div>

        {/* Node Inspector Panel */}
        <div className="border border-slate-200/90 rounded-2xl p-5 bg-white shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                {selectedNode.id}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedNode.status === 'ONLINE_OPTIMAL'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-500/30'
                    : 'bg-amber-50 text-amber-700 border border-amber-500/30'
                }`}
              >
                {selectedNode.status}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 mt-2">{selectedNode.nodeName}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{selectedNode.location}</p>

            <div className="mt-4 space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Quantum Bit Error Rate (QBER)</span>
                  <span className="font-mono font-bold text-slate-900">{selectedNode.qberPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      selectedNode.qberPercent > 3.0 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(selectedNode.qberPercent / 5.0) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Security Threshold: &lt; 4.5%</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Photon Rate</span>
                  <span className="font-mono font-bold text-slate-900">{selectedNode.photonRateHz}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Key Pool</span>
                  <span className="font-mono font-bold text-cyan-700">
                    {selectedNode.keyPoolCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onTriggerRecalibration(selectedNode.id);
              showToast(`Recalibrating polarization on ${selectedNode.nodeName}`);
            }}
            className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition cursor-pointer shadow-xs"
          >
            Auto-Calibrate Polarization
          </button>
        </div>
      </div>

      {/* Nodes Table */}
      <div className="border border-slate-200/90 rounded-2xl p-5 bg-white shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">All Optical QKD Nodes &amp; Key Vaults</h3>
        <div className="border border-slate-200/80 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Node Name / Location</th>
                <th className="py-2.5 px-3">Protocol</th>
                <th className="py-2.5 px-3">QBER (%)</th>
                <th className="py-2.5 px-3">Photon Frequency</th>
                <th className="py-2.5 px-3">Key Pool Count</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {nodes.map((node) => (
                <tr
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="hover:bg-slate-50/70 transition cursor-pointer"
                >
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{node.nodeName}</div>
                    <div className="text-[10px] text-slate-400">{node.id} • {node.location}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-700">{node.protocol}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{node.qberPercent}%</td>
                  <td className="py-3 px-3 font-mono text-slate-700">{node.photonRateHz}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-blue-600">
                    {node.keyPoolCount.toLocaleString()} keys
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        node.status === 'ONLINE_OPTIMAL'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-500/30'
                          : 'bg-amber-50 text-amber-700 border border-amber-500/30'
                      }`}
                    >
                      {node.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTriggerRecalibration(node.id);
                        showToast(`Recalibrating node ${node.id}`);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[11px] transition cursor-pointer"
                    >
                      Calibrate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
