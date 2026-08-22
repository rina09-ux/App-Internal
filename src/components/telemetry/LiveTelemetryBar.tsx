import React, { useEffect, useState } from 'react';
import { coreRequest } from '../../lib/nusasecCoreClient';
import {
  Activity,
  Zap,
  Cpu,
  Pause,
  Play,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface LiveTelemetryBarProps {
  onOpenSandbox: () => void;
  onTriggerScan: () => void;
  onShowToast: (msg: string) => void;
}


type TelemetryItem = { source?: string; action?: string; status?: string; occurred_at?: string };


export const LiveTelemetryBar: React.FC<LiveTelemetryBarProps> = ({
  onOpenSandbox,
  onTriggerScan,
  onShowToast,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentEvent, setCurrentEvent] = useState<TelemetryItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const body = await coreRequest<{ items?: TelemetryItem[] }>('/api/v1/internal-experience/traffic?limit=1');
        if (!cancelled) setCurrentEvent(body.items?.[0] || null);
      } catch {
        if (!cancelled) setCurrentEvent(null);
      }
    };
    if (isPlaying) {
      void load();
      const timer = window.setInterval(load, 10000);
      return () => { cancelled = true; window.clearInterval(timer); };
    }
    return () => { cancelled = true; };
  }, [isPlaying]);


  return (
    <div className="h-9 px-4 bg-slate-900 text-white flex items-center justify-between text-[11px] font-mono border-t border-slate-800 shrink-0 select-none">
      {/* Left: Stream Indicator & Current Event */}
      <div className="flex items-center gap-3 overflow-hidden min-w-0">
        <div className="flex items-center gap-1.5 shrink-0 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-[10px]">LIVE FEED</span>
        </div>

        <div className="flex items-center gap-2 truncate text-slate-300">
          {currentEvent?.status && ['SUCCEEDED','SUCCESS','COMPLETED'].includes(String(currentEvent.status).toUpperCase()) && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
          {currentEvent?.status && ['FAILED','OVERDUE','BLOCKED'].includes(String(currentEvent.status).toUpperCase()) && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
          {currentEvent && !['SUCCEEDED','SUCCESS','COMPLETED','FAILED','OVERDUE','BLOCKED'].includes(String(currentEvent.status || '').toUpperCase()) && <Radio className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
          <span className="truncate">{currentEvent ? `${currentEvent.source || 'Core'} · ${currentEvent.action || 'activity'} · ${currentEvent.status || 'observed'}` : 'No Core telemetry event is currently available. No synthetic events are generated.'}</span>
        </div>
      </div>

      {/* Right: Quick Interactive Controls */}
      <div className="flex items-center gap-3 shrink-0 ml-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Pause telemetry stream' : 'Resume telemetry stream'}
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-emerald-400" />}
        </button>

        <div className="h-3 w-px bg-slate-700 hidden sm:block" />

        <button
          onClick={onOpenSandbox}
          className="hidden sm:flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer transition"
        >
          <Cpu className="w-3 h-3" />
          <span>PQC Sandbox</span>
        </button>

        <button
          onClick={onTriggerScan}
          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer transition"
        >
          <Zap className="w-3 h-3" />
          <span>Quick Scan</span>
        </button>
      </div>
    </div>
  );
};
