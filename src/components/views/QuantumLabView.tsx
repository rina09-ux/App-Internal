import React from 'react';
import {
  FlaskConical,
  Activity,
  Cpu,
  Zap,
  Play,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Terminal,
} from 'lucide-react';
import { QuantumLabProject } from '../../types/security';

interface QuantumLabViewProps {
  projects: QuantumLabProject[];
  showToast: (msg: string) => void;
}

export const QuantumLabView: React.FC<QuantumLabViewProps> = ({ projects, showToast }) => {
  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Quantum Cryptanalysis &amp; Lattice R&amp;D Lab
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 border border-indigo-500/30">
              Q-Lab Active Runs
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Side-channel fault injection resistance testing, ML-KEM assembly masking verification, and Shor algorithm logical qubit horizons.
          </p>
        </div>

        <button
          onClick={() => showToast('Dispatched new Lattice Reduction benchmark job to HPC Cluster')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Launch Cryptanalysis Job</span>
        </button>
      </div>

      {/* Lab Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-slate-200/90 rounded-2xl p-5 bg-white shadow-2xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {project.id}
                </span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {project.category}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mt-2.5">{project.title}</h3>
              <div className="text-xs text-slate-500 mt-1">Lead: {project.leadResearcher}</div>

              {/* Benchmark Result Box */}
              <div className="mt-3 p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] border border-slate-800">
                <div className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider mb-1">
                  Benchmark Observation
                </div>
                {project.benchmarkResult}
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Execution Progress</span>
                  <span className="font-mono font-bold text-slate-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {project.status}
              </span>
              <button
                onClick={() => showToast(`Full telemetry logs for ${project.id} opened`)}
                className="text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
              >
                Inspect Telemetry →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
