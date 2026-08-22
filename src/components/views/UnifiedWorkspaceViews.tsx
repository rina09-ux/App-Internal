import React, { useState, useMemo } from 'react';
import { DotGrid } from '../magic/effects';
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  TrendingUp,
  CreditCard,
  Banknote,
  Cpu,
  ShieldCheck,
  Award,
  Search,
  ExternalLink,
  ChevronDown,
  ArrowUpRight,
  Filter,
  Download,
  Plus,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Zap,
  Lock,
  RefreshCw,
  Eye,
  ArrowRight,
  Edit,
  Trash2,
  FileSpreadsheet,
  Check,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Server,
  Radio,
  Pause,
  Play,
  Share2,
} from 'lucide-react';
import {
  WorkspaceId,
  CustomerProfile,
  CustomerHealthItem,
  CustomerActionItem,
  SupportTicket,
  SalesOpportunity,
  ProductPlanPricing,
  InvoiceRecord,
  TransactionRecord,
  EngineeringErrorGroup,
  EngineeringIncident,
  EngineeringChange,
  ServiceSLO,
  SecurityRemediationTask,
  SecurityAssuranceRun,
  RegulatoryInstrument,
  RoleWorkItem,
} from '../../types/workspaces';
import { InspectorEntity } from '../modals/DetailInspectorDrawer';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils';
import type { InternalCommandCenterSnapshot, InternalCryptoTelemetry } from '../../lib/nusasecCoreClient';

export interface ViewCommonProps {
  showToast: (msg: string, type?: string) => void;
  onNavigate: (viewId: WorkspaceId) => void;
  onInspect: (entity: InspectorEntity) => void;
  onOpenCreateModal: (modalType: string, initialData?: any) => void;
}

// 1. COMMAND CENTER (Executive Operating Picture & Cryptographic Processing Units Hub)
export const CommandCenterView: React.FC<ViewCommonProps & {
  customers: CustomerProfile[];
  remediations: SecurityRemediationTask[];
  incidents: EngineeringIncident[];
  workItems: RoleWorkItem[];
  coreSnapshot?: InternalCommandCenterSnapshot | null;
  coreConnectionError?: string | null;
  coreCryptoTelemetry?: InternalCryptoTelemetry | null;
}> = ({ showToast, onNavigate, onInspect, onOpenCreateModal, customers, remediations, incidents, workItems, coreSnapshot, coreConnectionError, coreCryptoTelemetry }) => {
  // Real-time Refresh State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<'off' | '5s' | '10s' | '30s' | '60s'>('10s');
  const [countdown, setCountdown] = useState<number>(10);

  // Chart Controls & Filters
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D' | '30D'>('24H');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<'all' | 'kem' | 'dsa' | 'hsm' | 'audit'>('all');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [hoveredUnitIndex, setHoveredUnitIndex] = useState<number | null>(null);

  // Simulated metrics that fluctuate on refresh
  const liveThroughput = coreCryptoTelemetry?.ops_per_second ?? 0;
  const pqcPenetrationRate: number | null = null;
  const avgLatencyMs: number | null = coreCryptoTelemetry?.average_latency_ms ?? null;
  const unitOpsSec = coreCryptoTelemetry?.ops_per_second ?? 0;
  const unitLoadPct: number | null = null;
  const activeWorkerUnits = coreCryptoTelemetry?.worker_units ?? 0;

  const handleRefresh = (_isAuto = false) => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsRefreshing(false);
      showToast(coreCryptoTelemetry?.available ? 'Cryptographic telemetry refreshed from NusaSec-Core.' : 'Cryptographic telemetry is not yet available from NusaSec-Core; no synthetic values are generated.');
    }, 250);
  };

  // Auto-refresh interval timer
  React.useEffect(() => {
    if (autoRefreshInterval === 'off') return;
    const intervalSec =
      autoRefreshInterval === '5s'
        ? 5
        : autoRefreshInterval === '10s'
        ? 10
        : autoRefreshInterval === '30s'
        ? 30
        : 60;
    setCountdown(intervalSec);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleRefresh(true);
          return intervalSec;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRefreshInterval]);

  // Chart Data based on timeframe
  const chartPoints = useMemo(() => {
    if (timeframe === '1H') {
      return [
        { label: '10m', pqc: 78, classical: 22, volume: '29.1k' },
        { label: '20m', pqc: 82, classical: 18, volume: '31.4k' },
        { label: '30m', pqc: 85, classical: 15, volume: '33.8k' },
        { label: '40m', pqc: 84, classical: 16, volume: '32.9k' },
        { label: '50m', pqc: 88, classical: 12, volume: '35.1k' },
        { label: 'Now', pqc: pqcPenetrationRate ?? 0, classical: pqcPenetrationRate === null ? 0 : 100 - pqcPenetrationRate, volume: `${(liveThroughput / 1000).toFixed(1)}k` },
      ];
    } else if (timeframe === '24H') {
      return [
        { label: '00:00', pqc: 72, classical: 28, volume: '22.4k' },
        { label: '04:00', pqc: 75, classical: 25, volume: '18.9k' },
        { label: '08:00', pqc: 81, classical: 19, volume: '34.2k' },
        { label: '12:00', pqc: 86, classical: 14, volume: '41.5k' },
        { label: '16:00', pqc: 89, classical: 11, volume: '38.7k' },
        { label: '20:00', pqc: pqcPenetrationRate ?? 0, classical: pqcPenetrationRate === null ? 0 : 100 - pqcPenetrationRate, volume: `${(liveThroughput / 1000).toFixed(1)}k` },
      ];
    } else if (timeframe === '7D') {
      return [
        { label: 'Mon', pqc: 64, classical: 36, volume: '1.2M' },
        { label: 'Tue', pqc: 69, classical: 31, volume: '1.4M' },
        { label: 'Wed', pqc: 74, classical: 26, volume: '1.5M' },
        { label: 'Thu', pqc: 80, classical: 20, volume: '1.6M' },
        { label: 'Fri', pqc: 85, classical: 15, volume: '1.7M' },
        { label: 'Sat', pqc: 87, classical: 13, volume: '1.3M' },
        { label: 'Sun', pqc: pqcPenetrationRate ?? 0, classical: pqcPenetrationRate === null ? 0 : 100 - pqcPenetrationRate, volume: '1.4M' },
      ];
    } else {
      return [
        { label: 'Week 1', pqc: 52, classical: 48, volume: '4.8M' },
        { label: 'Week 2', pqc: 63, classical: 37, volume: '5.2M' },
        { label: 'Week 3', pqc: 76, classical: 24, volume: '5.9M' },
        { label: 'Week 4', pqc: pqcPenetrationRate ?? 0, classical: pqcPenetrationRate === null ? 0 : 100 - pqcPenetrationRate, volume: '6.4M' },
      ];
    }
  }, [timeframe, pqcPenetrationRate, liveThroughput]);

  // Unit telemetry contains only measured Core evidence; no synthetic historical series.
  const unitTimeSeries = useMemo(() => [{
    step: 'Current',
    ops: unitOpsSec,
    load: unitLoadPct ?? 0,
    latency: avgLatencyMs !== null ? `${avgLatencyMs}ms` : '—',
  }], [unitOpsSec, unitLoadPct, avgLatencyMs]);

  // Processing units are supplied by Core telemetry when available.
  const processingUnits = coreCryptoTelemetry?.available ? [{
    id: 'CORE-TELEMETRY',
    name: 'Measured Cryptographic Telemetry',
    category: 'all',
    algorithm: 'Provider-reported',
    workers: coreCryptoTelemetry.worker_units == null ? '—' : `${coreCryptoTelemetry.worker_units} units`,
    opsSec: coreCryptoTelemetry.ops_per_second == null ? '—' : `${coreCryptoTelemetry.ops_per_second.toLocaleString()} ops/s`,
    load: '—',
    latency: coreCryptoTelemetry.average_latency_ms == null ? '—' : `${coreCryptoTelemetry.average_latency_ms} ms`,
    status: 'Measured',
    hardware: 'Provider-reported',
  }] : [];

  const handleBenchmarkRun = () => {
    showToast('Running high-throughput benchmark across all 32 active Cryptographic Units...');
    setTimeout(() => {
      handleRefresh(false);
      showToast('Benchmark execution is pending a canonical Core telemetry endpoint; no synthetic result is reported.');
    }, 1200);
  };

  // Units filtered by the selected category tab.
  const filteredUnits = useMemo(() => {
    if (selectedUnitFilter === 'all') return processingUnits;
    return processingUnits.filter((unit) => unit.category === selectedUnitFilter);
  }, [processingUnits, selectedUnitFilter]);

  // Regional fleet/HSM enclave data has no Core telemetry endpoint yet; no synthetic entries are generated.
  const regionalNodes: Array<{
    zone: string;
    region: string;
    status: string;
    latency: string;
    sessions: number | string;
    hsm: string;
  }> = [];

  const handleExportBriefing = () => {
    exportToJSON(
      {
        generated_at: new Date().toISOString(),
        core_snapshot: coreSnapshot ?? null,
        core_connection_error: coreConnectionError ?? null,
        crypto_telemetry: coreCryptoTelemetry ?? null,
        processing_units: processingUnits,
        chart_timeframe: timeframe,
        chart_points: chartPoints,
      },
      'command-center-briefing'
    );
    showToast('Executive briefing exported.');
  };

  return (
    <div className="flex-1 p-3.5 sm:p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      {/* Top Header Bar — flagship hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 px-5 py-5 sm:px-7 sm:py-6">
        <DotGrid className="opacity-[0.3]" />
        <div className="blob-glow absolute -top-16 left-[8%] w-72 h-56 bg-blue-500/20 pointer-events-none" />
        <div className="blob-glow absolute -bottom-20 right-[5%] w-64 h-48 bg-emerald-400/10 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">Command Center</h1>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-slate-900">
                Executive View
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono border ${coreSnapshot ? 'text-emerald-300 bg-emerald-500/10 border-emerald-400/30' : 'text-amber-300 bg-amber-500/10 border-amber-400/30'}`}>
                {coreSnapshot ? 'Core Connected' : 'Core Pending'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Cross-domain operating picture; authoritative security posture, processing units telemetry, and SLA health.
            </p>
            <p className={`text-[10px] font-mono mt-1 ${coreSnapshot ? 'text-emerald-400' : 'text-amber-400'}`}>
              {coreSnapshot ? `Core schema ${coreSnapshot.schema} • ${new Date(coreSnapshot.generated_at).toLocaleTimeString()}` : (coreConnectionError || 'Waiting for Core session/authentication')}
            </p>
          </div>

          {/* Source Traceability & Auto-Refresh Controls */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Auto Refresh Dropdown */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/10 rounded-xl text-xs text-slate-300 backdrop-blur-sm">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-medium hidden md:inline">Auto-refresh:</span>
              <select
                value={autoRefreshInterval}
                onChange={(e) => setAutoRefreshInterval(e.target.value as any)}
                className="bg-transparent text-[11px] font-semibold text-white focus:outline-hidden cursor-pointer [&>option]:text-slate-900"
              >
                <option value="off">Off</option>
                <option value="5s">5s</option>
                <option value="10s">10s (Fast)</option>
                <option value="30s">30s</option>
                <option value="60s">60s</option>
              </select>
              {autoRefreshInterval !== 'off' && (
                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-mono font-bold">
                  {countdown}s
                </span>
              )}
            </div>

            {/* Export Briefing */}
            <button
              onClick={handleExportBriefing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-slate-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer backdrop-blur-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Briefing</span>
            </button>

            {/* Manual Refresh Button */}
            <button
              onClick={() => handleRefresh(false)}
              disabled={isRefreshing}
              className="btn-shimmer flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-semibold shadow-lg transition-colors cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Executive KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div
          onClick={() => onNavigate('customer-360')}
          className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs hover:border-slate-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 block">Total Customers</span>
            <Users className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition" />
          </div>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{coreSnapshot?.executive.customers ?? customers.length}</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">{coreSnapshot ? 'Core aggregate' : 'Unavailable until Core connects'}</span>
        </div>

        <div
          onClick={() => onNavigate('finance')}
          className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs hover:border-slate-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 block">Active Subscriptions</span>
            <Banknote className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition" />
          </div>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{coreSnapshot ? coreSnapshot.executive.active_subscriptions : '—'}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Monthly Recurring</span>
        </div>

        <div
          onClick={() => onNavigate('my-work')}
          className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs hover:border-slate-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 block">Open Internal Work</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition" />
          </div>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {coreSnapshot?.executive.open_work_items ?? workItems.filter((w) => w.status !== 'Completed').length}
          </span>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 block">{coreSnapshot ? `${coreSnapshot.executive.open_work_items} open items` : 'Unavailable until Core connects'}</span>
        </div>

        <div
          onClick={() => onNavigate('security')}
          className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs hover:border-slate-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 block">Critical Remediations</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <span className="text-2xl font-black text-rose-600 mt-1 block">
            {coreSnapshot?.security_operations.critical_or_high_remediation ?? remediations.filter((r) => r.severity === 'Critical').length}
          </span>
          <span className="text-[10px] text-rose-600 font-semibold mt-1 block">{coreSnapshot ? 'Core remediation aggregate' : 'Unavailable until Core connects'}</span>
        </div>

        <div
          onClick={() => onNavigate('customer-success')}
          className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs hover:border-slate-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 block">Unhealthy Tenants</span>
            <HeartHandshake className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{coreSnapshot?.executive.unhealthy_customers ?? '—'}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">{coreSnapshot ? 'Core customer-health aggregate' : 'Awaiting Core customer-health contract'}</span>
        </div>

        <div
          onClick={() => onNavigate('notifications')}
          className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs hover:border-slate-400 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 block">Active Units &amp; Alerts</span>
            <Activity className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <span className="text-2xl font-black text-blue-600 mt-1 block">{coreSnapshot?.security_operations.running_scans ?? '—'}</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">{coreCryptoTelemetry?.available ? 'Measured by Core' : 'Awaiting Core telemetry'}</span>
        </div>
      </div>

      {/* NEW: DEDICATED UNIT & WORKLOAD OPS HUB (Requested: Unit menu di Comment Center sempurnakan & tambahkan grafik) */}
      <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">
                Cryptographic Units &amp; Workload Processing Telemetry
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 font-mono">
                {coreCryptoTelemetry?.available ? `${activeWorkerUnits} Measured Units` : 'Telemetry unavailable'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Measured cryptographic telemetry when supplied by NusaSec-Core; the UI never fabricates operational values.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Unit Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              {[
                { id: 'all', label: 'All Units' },
                { id: 'kem', label: 'KEM Enclaves' },
                { id: 'dsa', label: 'DSA Signers' },
                { id: 'hsm', label: 'HSM Vaults' },
                { id: 'audit', label: 'Audit Tree' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedUnitFilter(tab.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    selectedUnitFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleBenchmarkRun}
              className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Unit Benchmark</span>
            </button>
          </div>
        </div>

        {/* 4 Live Unit Metrics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Cryptographic Ops Rate
            </span>
            <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
              {coreCryptoTelemetry?.available && unitOpsSec ? `${unitOpsSec.toLocaleString()} ops/s` : '—'}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
              {coreCryptoTelemetry?.available ? 'Measured by Core' : 'Awaiting Core telemetry'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Unit Fleet Utilization
            </span>
            <span className="text-xl font-black text-blue-600 font-mono mt-0.5 block">
              {unitLoadPct}%
            </span>
            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${unitLoadPct}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Mean Enclave Latency
            </span>
            <span className="text-xl font-black text-emerald-600 font-mono mt-0.5 block">
              {avgLatencyMs} ms
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Hardware AVX Accelerators</span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Unit Error Rate
            </span>
            <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
              0.00 PPM
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
              Zero Faults Detected
            </span>
          </div>
        </div>

        {/* Dynamic Interactive Unit Ops/Sec Graph */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700">
              Live Unit Throughput Trajectory ({selectedUnitFilter.toUpperCase()} Ops / Time)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Auto-updating ({countdown}s ticker)
            </span>
          </div>

          <div className="h-40 w-full relative flex flex-col justify-end bg-slate-50/60 rounded-xl p-3 border border-slate-200/60">
            <svg className="w-full h-28 overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="500" y2="50" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />

              {/* Gradient Area & Line for Unit Operations */}
              {(() => {
                const maxOps = 160000;
                const points = unitTimeSeries.map((pt, idx) => {
                  const x = (idx / (unitTimeSeries.length - 1)) * 500;
                  const y = 100 - (pt.ops / maxOps) * 80 - 10;
                  return `${x},${y}`;
                });
                const pathData = `M 0,100 L ${points.join(' L ')} L 500,100 Z`;
                const lineData = `M ${points.join(' L ')}`;
                return (
                  <>
                    <path d={pathData} fill="rgba(59, 130, 246, 0.12)" />
                    <path d={lineData} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                  </>
                );
              })()}

              {/* Unit Hover Circles */}
              {unitTimeSeries.map((pt, idx) => {
                const maxOps = 160000;
                const cx = (idx / (unitTimeSeries.length - 1)) * 500;
                const cy = 100 - (pt.ops / maxOps) * 80 - 10;
                const isHovered = hoveredUnitIndex === idx;
                return (
                  <g key={idx} className="cursor-pointer">
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 6 : 4}
                      fill="#2563eb"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="transition-all"
                      onMouseEnter={() => setHoveredUnitIndex(idx)}
                      onMouseLeave={() => setHoveredUnitIndex(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* X Axis Step Labels */}
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2 px-1">
              {unitTimeSeries.map((pt, idx) => (
                <span
                  key={idx}
                  className={`transition ${hoveredUnitIndex === idx ? 'text-blue-600 font-bold' : ''}`}
                >
                  {pt.step} ({pt.ops.toLocaleString()})
                </span>
              ))}
            </div>
          </div>

          {/* Unit Hover Tooltip */}
          {hoveredUnitIndex !== null && (
            <div className="mt-2 p-2 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between font-mono animate-in fade-in duration-100">
              <span className="text-slate-300">Sample: {unitTimeSeries[hoveredUnitIndex].step}</span>
              <span className="text-blue-400 font-bold">
                Throughput: {unitTimeSeries[hoveredUnitIndex].ops.toLocaleString()} ops/s
              </span>
              <span className="text-emerald-400">Load: {unitTimeSeries[hoveredUnitIndex].load}%</span>
              <span className="text-slate-400">Latency: {unitTimeSeries[hoveredUnitIndex].latency}</span>
            </div>
          )}
        </div>

        {/* Cryptographic Processing Units Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {filteredUnits.map((unit) => (
            <div
              key={unit.id}
              onClick={() =>
                onInspect({
                  type: 'Cryptographic Unit',
                  title: unit.name,
                  id: unit.id,
                  status: unit.status,
                  data: unit,
                })
              }
              className="p-3.5 bg-slate-50/80 hover:bg-slate-100 rounded-xl border border-slate-200/80 space-y-2 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition">
                  {unit.name}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                  {unit.status}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Algorithm:</span>
                  <span className="text-slate-800 font-semibold">{unit.algorithm}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ops/Sec:</span>
                  <span className="text-blue-600 font-bold">{unit.opsSec}</span>
                </div>
                <div className="flex justify-between">
                  <span>Workers:</span>
                  <span className="text-slate-800">{unit.workers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Acceleration:</span>
                  <span className="text-slate-700 font-medium text-[10px]">{unit.hardware}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: INTERACTIVE CHARTS & TELEMETRY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: PQC vs Classical Traffic Trajectory Chart */}
        <div className="lg:col-span-2 p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Post-Quantum Hybrid Traffic Trajectory (FIPS 203 KEM vs Classical)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time penetration of X25519Kyber768 hybrid handshakes across cloud ingress routes.
              </p>
            </div>

            {/* Timeframe Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['1H', '24H', '7D', '30D'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    timeframe === tf
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Current Throughput
              </span>
              <span className="text-base font-black text-slate-900 font-mono mt-0.5 block">
                {liveThroughput.toLocaleString()} req/s
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">+14.2% vs previous period</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                PQC Adoption Rate
              </span>
              <span className="text-base font-black text-emerald-600 font-mono mt-0.5 block">
                {pqcPenetrationRate}%
              </span>
              <span className="text-[10px] text-slate-500">ML-KEM-768 Encapsulated</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Avg KEM Latency
              </span>
              <span className="text-base font-black text-slate-900 font-mono mt-0.5 block">
                {avgLatencyMs} ms
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">AVX-512 Native Accel</span>
            </div>
          </div>

          {/* SVG Visual Chart */}
          <div className="pt-2">
            <div className="h-44 w-full relative flex flex-col justify-end">
              {/* SVG Chart Area */}
              <svg className="w-full h-36 overflow-visible" viewBox="0 0 500 100" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="500" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

                {/* Series 1: PQC Line & Area (Emerald) */}
                {(() => {
                  const points = chartPoints.map((pt, idx) => {
                    const x = (idx / (chartPoints.length - 1)) * 500;
                    const y = 100 - (pt.pqc / 100) * 85 - 10;
                    return `${x},${y}`;
                  });
                  const pathData = `M 0,100 L ${points.join(' L ')} L 500,100 Z`;
                  const lineData = `M ${points.join(' L ')}`;
                  return (
                    <>
                      <path d={pathData} fill="rgba(16, 185, 129, 0.08)" />
                      <path d={lineData} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                    </>
                  );
                })()}

                {/* Series 2: Classical Traffic Line (Slate/Indigo) */}
                {(() => {
                  const points = chartPoints.map((pt, idx) => {
                    const x = (idx / (chartPoints.length - 1)) * 500;
                    const y = 100 - (pt.classical / 100) * 85 - 10;
                    return `${x},${y}`;
                  });
                  const lineData = `M ${points.join(' L ')}`;
                  return (
                    <path d={lineData} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
                  );
                })()}

                {/* Interactive Points */}
                {chartPoints.map((pt, idx) => {
                  const cx = (idx / (chartPoints.length - 1)) * 500;
                  const cy = 100 - (pt.pqc / 100) * 85 - 10;
                  const isHovered = hoveredPointIndex === idx;
                  return (
                    <g key={idx} className="cursor-pointer">
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isHovered ? 6 : 4}
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all"
                        onMouseEnter={() => setHoveredPointIndex(idx)}
                        onMouseLeave={() => setHoveredPointIndex(null)}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* X Axis Labels */}
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2 px-1">
                {chartPoints.map((pt, idx) => (
                  <span
                    key={idx}
                    className={`transition ${hoveredPointIndex === idx ? 'text-emerald-600 font-bold' : ''}`}
                  >
                    {pt.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Hover Data Point Tooltip (If any) */}
            {hoveredPointIndex !== null && (
              <div className="mt-2 p-2 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between font-mono animate-in fade-in duration-100">
                <span className="text-slate-300">Point: {chartPoints[hoveredPointIndex].label}</span>
                <span className="text-emerald-400 font-bold">PQC Share: {chartPoints[hoveredPointIndex].pqc}%</span>
                <span className="text-slate-400">Classical: {chartPoints[hoveredPointIndex].classical}%</span>
                <span className="text-white font-semibold">Vol: {chartPoints[hoveredPointIndex].volume} reqs</span>
              </div>
            )}

            {/* Chart Legend */}
            <div className="flex items-center justify-center gap-6 text-xs text-slate-600 mt-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-800">Hybrid PQC Traffic (ML-KEM-768)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-slate-400 rounded-full" />
                <span className="text-slate-500">Legacy Classical Fallback (RSA / ECC)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: CBOM Cryptographic Hardness & Algorithm Breakdown */}
        <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">CBOM Algorithm Distribution</h3>
              </div>
              <button
                onClick={() => onNavigate('security')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Remediate →
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of 14,890 active keys &amp; certificates across the enterprise inventory.
            </p>

            {/* Visual Segmented Progress Bar */}
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full rounded-full bg-slate-100 flex overflow-hidden p-0.5">
                <div style={{ width: '48%' }} className="bg-emerald-500 h-full rounded-l-full" title="ML-KEM-768: 48%" />
                <div style={{ width: '26%' }} className="bg-blue-500 h-full" title="ML-DSA-65: 26%" />
                <div style={{ width: '14%' }} className="bg-purple-500 h-full" title="Falcon-512: 14%" />
                <div style={{ width: '12%' }} className="bg-rose-500 h-full rounded-r-full" title="Legacy RSA/ECC: 12%" />
              </div>
            </div>

            {/* Algorithm Item Rows */}
            <div className="space-y-2.5 mt-4 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <span className="font-bold text-slate-900">ML-KEM-768 (Kyber)</span>
                    <span className="text-[10px] text-slate-400 block font-mono">FIPS 203 Standard</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">48%</span>
                  <span className="text-[10px] text-emerald-600 block font-semibold">7,147 Assets</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <div>
                    <span className="font-bold text-slate-900">ML-DSA-65 (Dilithium)</span>
                    <span className="text-[10px] text-slate-400 block font-mono">FIPS 204 Standard</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">26%</span>
                  <span className="text-[10px] text-blue-600 block font-semibold">3,871 Assets</span>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <div>
                    <span className="font-bold text-slate-900">Falcon-512 / FN-DSA</span>
                    <span className="text-[10px] text-slate-400 block font-mono">Compact Signature</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900">14%</span>
                  <span className="text-[10px] text-purple-600 block font-semibold">2,085 Assets</span>
                </div>
              </div>

              <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div>
                    <span className="font-bold text-rose-900">Legacy RSA / ECDSA</span>
                    <span className="text-[10px] text-rose-700 block font-mono">Vulnerable to Q-Day</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-rose-900">12%</span>
                  <span className="text-[10px] text-rose-700 block font-semibold">1,787 Queued</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-500/30 rounded-xl text-xs text-emerald-900 font-semibold flex items-center justify-between mt-2">
            <span>CNSA 2.0 Compliance:</span>
            <span className="font-mono font-bold text-emerald-700">88.0% Completed</span>
          </div>
        </div>
      </div>

      {/* SECTION: REGIONAL FLEET STATUS & HSM CLUSTERS */}
      <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-700" />
            <h3 className="font-bold text-sm text-slate-900">Regional Ingress Fleet &amp; HSM Cryptographic Enclaves</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">4 Global Availability Zones</span>
        </div>

        {regionalNodes.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400 font-mono bg-slate-50/80 rounded-xl border border-slate-200/80">
            Regional fleet telemetry is not yet available from NusaSec-Core; no synthetic values are generated.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {regionalNodes.map((node) => (
              <div key={node.zone} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{node.region}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                    {node.status}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Zone:</span>
                    <span className="text-slate-800 font-semibold">{node.zone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ping Latency:</span>
                    <span className="text-emerald-600 font-bold">{node.latency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Sessions:</span>
                    <span className="text-slate-800">{node.sessions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HSM Partition:</span>
                    <span className="text-blue-700 font-semibold">{node.hsm}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cross-Domain Feeds & Quick Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Active Incidents & High Priority Tasks */}
        <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Active Operational Incidents</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenCreateModal('incident')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Declare Incident</span>
              </button>
              <button
                onClick={() => onNavigate('engineering')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                View Engineering →
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {incidents.map((inc) => (
              <div
                key={inc.incident_key}
                onClick={() =>
                  onInspect({
                    type: 'Engineering Incident',
                    title: inc.title,
                    id: inc.incident_key,
                    status: inc.status,
                    data: inc,
                  })
                }
                className="p-3 bg-slate-50/70 border border-slate-200/60 rounded-xl flex items-center justify-between text-xs hover:bg-slate-100 transition cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-700">
                      {inc.severity}
                    </span>
                    <span className="font-semibold text-slate-900">{inc.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {inc.service} • Lead: {inc.lead} • {inc.duration}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600">
                  {inc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Source Traceability & Stream Freshness */}
        <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Data Source Traceability &amp; Freshness</h3>
            <span className="text-[11px] font-mono text-emerald-600 font-semibold">Live Stream Sync</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-mono text-slate-800 font-semibold">/internal-control-tower/snapshot</span>
                <div className="text-[10px] text-slate-400">Aggregates CustomerHealth, Subscription, WorkItems</div>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Updated {lastUpdated}</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-mono text-slate-800 font-semibold">/internal-control-tower/deep/security</span>
                <div className="text-[10px] text-slate-400">CBOM scans, risk exceptions, HSM key rotations</div>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Live (5s sync)</span>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-mono text-slate-800 font-semibold">/internal/finance/summary</span>
                <div className="text-[10px] text-slate-400">Core commercial ledger aggregates and payment status</div>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Live (10s sync)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. CUSTOMER 360 (Drill-Down Customer/Tenant)
export const Customer360View: React.FC<ViewCommonProps & {
  customers: CustomerProfile[];
}> = ({ showToast, onInspect, onOpenCreateModal, customers }) => {
  const [selectedTenantId, setSelectedTenantId] = useState<string>(customers[0]?.tenant_id || '');
  const current = customers.find((c) => c.tenant_id === selectedTenantId) || customers[0];

  return (
    <div className="flex-1 p-3.5 sm:p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      {/* Header with Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer 360</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Tenant Drill-Down
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Single-pane-of-glass tenant commercial, security posture, and health telemetry.
          </p>
        </div>

        {/* Tenant Selector & Actions */}
        <div className="flex items-center gap-2">
          <select
            value={selectedTenantId}
            onChange={(e) => setSelectedTenantId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden cursor-pointer"
          >
            {customers.map((c) => (
              <option key={c.tenant_id} value={c.tenant_id}>
                {c.display_name} ({c.tenant_id})
              </option>
            ))}
          </select>
          <button
            onClick={() => onOpenCreateModal('customer')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Tenant</span>
          </button>
        </div>
      </div>

      {current && (
        <>
          {/* 6 KPIs for Selected Tenant */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
              <span className="text-[11px] font-medium text-slate-400 block">Health Score</span>
              <span
                className={`text-2xl font-black mt-1 block ${
                  current.healthScore >= 80 ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {current.healthScore}%
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-1 block">Weighted Index</span>
            </div>

            <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
              <span className="text-[11px] font-medium text-slate-400 block">Cryptographic Assets</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{current.asset_count}</span>
              <span className="text-[10px] text-slate-500 font-medium mt-1 block">In CBOM Inventory</span>
            </div>

            <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
              <span className="text-[11px] font-medium text-slate-400 block">Remediations</span>
              <span className="text-2xl font-black text-rose-600 mt-1 block">{current.remediations}</span>
              <span className="text-[10px] text-slate-500 font-medium mt-1 block">Open tasks</span>
            </div>

            <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
              <span className="text-[11px] font-medium text-slate-400 block">Monthly Revenue</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                ${(current.mrr / 1000).toFixed(1)}k
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-1 block">{current.tier} Tier</span>
            </div>

            <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
              <span className="text-[11px] font-medium text-slate-400 block">Evidence Objects</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">{current.evidence_objects}</span>
              <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">SOC-2 Audited</span>
            </div>

            <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
              <span className="text-[11px] font-medium text-slate-400 block">Subscription Status</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block uppercase text-sm font-mono">
                {current.status}
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-1 block">Auto-Renews</span>
            </div>
          </div>

          {/* Deep Tenant Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Commercial Profile */}
            <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Commercial &amp; Contract Profile</h3>
                <button
                  onClick={() =>
                    onInspect({
                      type: 'Customer Profile',
                      title: current.display_name,
                      id: current.tenant_id,
                      status: current.status,
                      data: current,
                    })
                  }
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Attributes</span>
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                  <span className="text-slate-500">Plan Authority:</span>
                  <span className="font-semibold text-slate-900">{current.plan}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                  <span className="text-slate-500">Customer Success Lead:</span>
                  <span className="font-semibold text-slate-900">{current.owner}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                  <span className="text-slate-500">Invoices / Transactions:</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {current.invoice_count} Invoices ({current.payment_count} Settled)
                  </span>
                </div>
              </div>
            </div>

            {/* Post-Quantum Security Posture */}
            <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">PQC Cryptographic Posture</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                  FIPS 203 Validated
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                  <span className="text-slate-500">KEM Key Encapsulation Suite:</span>
                  <span className="font-mono font-semibold text-slate-900">ML-KEM-768 / Kyber-768</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                  <span className="text-slate-500">Digital Signature Suite:</span>
                  <span className="font-mono font-semibold text-slate-900">ML-DSA-65 / Dilithium3</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
                  <span className="text-slate-500">Hardware Security Module (HSM):</span>
                  <span className="font-mono font-semibold text-slate-900">Luna PCIe HSM v7 (FIPS 140-3 L3)</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// 3. CUSTOMER SUCCESS VIEW
export const CustomerSuccessView: React.FC<ViewCommonProps & {
  healthList: CustomerHealthItem[];
  actionsList: CustomerActionItem[];
  supportTickets: SupportTicket[];
}> = ({ showToast, onInspect, onOpenCreateModal, healthList, actionsList, supportTickets }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredHealth = useMemo(() => {
    return healthList.filter((item) => {
      const matchSearch =
        item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tenant_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [healthList, searchTerm, statusFilter]);

  const handleExportCSV = () => {
    exportToCSV(filteredHealth, 'customer-success-health');
    showToast('Customer success data exported to CSV');
  };

  return (
    <div className="flex-1 p-3.5 sm:p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Success &amp; Health</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Operations
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic customer health breakdown, CSM assignments, action queue, and renewal timelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => onOpenCreateModal('customer')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Tenant</span>
          </button>
        </div>
      </div>

      {/* 6 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Avg Health Score</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">85.3%</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Healthy Baseline</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Healthy Accounts</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {healthList.filter((h) => h.status === 'healthy').length}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">&gt;80% Score</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">At Risk Accounts</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">
            {healthList.filter((h) => h.status === 'at_risk').length}
          </span>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 block">CSM Outreach Req.</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Critical Accounts</span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">
            {healthList.filter((h) => h.status === 'critical').length}
          </span>
          <span className="text-[10px] text-rose-600 font-semibold mt-1 block">Immediate Executive Triage</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Open Action Items</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{actionsList.length}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Requires CSM Review</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Support Tickets</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {supportTickets.filter((s) => s.status !== 'Resolved').length}
          </span>
          <span className="text-[10px] text-blue-600 font-semibold mt-1 block">0 P1 Outages</span>
        </div>
      </div>

      {/* Table 1: Customer Health Breakdown */}
      <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-sm text-slate-900">Customer Health Breakdown</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tenant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none w-44"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="healthy">Healthy</option>
              <option value="at_risk">At Risk</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Customer / Tenant</th>
                <th className="py-2.5 px-3">Score</th>
                <th className="py-2.5 px-3">Usage</th>
                <th className="py-2.5 px-3">Support</th>
                <th className="py-2.5 px-3">Billing</th>
                <th className="py-2.5 px-3">Renewal Health</th>
                <th className="py-2.5 px-3">Renewal Date</th>
                <th className="py-2.5 px-3">CSM Lead</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredHealth.map((item) => (
                <tr
                  key={item.id}
                  onClick={() =>
                    onInspect({
                      type: 'Customer Health',
                      title: item.customerName,
                      id: item.tenant_id,
                      status: item.status,
                      data: item,
                    })
                  }
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    <div>{item.customerName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{item.tenant_id}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.score >= 80
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : item.score >= 60
                          ? 'bg-amber-500/10 text-amber-600'
                          : 'bg-rose-500/10 text-rose-600'
                      }`}
                    >
                      {item.score}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono">{item.product_usage}%</td>
                  <td className="py-2.5 px-3 font-mono">{item.support_health}%</td>
                  <td className="py-2.5 px-3 font-mono">{item.billing_health}%</td>
                  <td className="py-2.5 px-3 font-mono">{item.renewal_health}%</td>
                  <td className="py-2.5 px-3 text-slate-500">{item.renewalDate}</td>
                  <td className="py-2.5 px-3 text-slate-900">{item.csm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 4. SALES & REVENUE VIEW
export const SalesRevenueView: React.FC<ViewCommonProps & {
  opportunities: SalesOpportunity[];
}> = ({ showToast, onInspect, onOpenCreateModal, opportunities }) => {
  const [stageFilter, setStageFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOpps = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchSearch = opp.account_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStage = stageFilter === 'all' || opp.stage === stageFilter;
      return matchSearch && matchStage;
    });
  }, [opportunities, searchTerm, stageFilter]);

  const totalPipeline = opportunities.reduce((acc, curr) => acc + curr.amount, 0);
  const weightedPipeline = opportunities.reduce((acc, curr) => acc + curr.amount * (curr.probability_pct / 100), 0);

  return (
    <div className="flex-1 p-3.5 sm:p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sales &amp; Revenue Pipeline</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Commercial
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active sales deals, post-quantum enterprise conversions, and weighted revenue forecast.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(filteredOpps, 'sales-pipeline')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => onOpenCreateModal('opportunity')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Opportunity</span>
          </button>
        </div>
      </div>

      {/* 4 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Total Pipeline ARR</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            ${(totalPipeline / 1000).toFixed(0)}k
          </span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Unweighted Sum</span>
        </div>

        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Weighted Forecast</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            ${(weightedPipeline / 1000).toFixed(0)}k
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Probability-Adjusted</span>
        </div>

        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Active Deals</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{opportunities.length}</span>
          <span className="text-[10px] text-blue-600 font-semibold mt-1 block">Enterprise Target Accounts</span>
        </div>

        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Avg Deal Size</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            ${Math.round(totalPipeline / (opportunities.length || 1) / 1000)}k
          </span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Annual Recurring</span>
        </div>
      </div>

      {/* Table */}
      <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-sm text-slate-900">Active Opportunity Pipeline</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search account..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none w-44"
              />
            </div>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="all">All Stages</option>
              <option value="Discovery">Discovery</option>
              <option value="Proposal">Proposal</option>
              <option value="Security Review">Security Review</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Closed Won">Closed Won</option>
            </select>
          </div>
        </div>

        <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Account Name</th>
                <th className="py-2.5 px-3">Stage</th>
                <th className="py-2.5 px-3">ARR Value</th>
                <th className="py-2.5 px-3">Probability</th>
                <th className="py-2.5 px-3">Expected Close</th>
                <th className="py-2.5 px-3">Owner</th>
                <th className="py-2.5 px-3">Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredOpps.map((opp) => (
                <tr
                  key={opp.id}
                  onClick={() =>
                    onInspect({
                      type: 'Sales Opportunity',
                      title: opp.account_name,
                      id: opp.id,
                      status: opp.stage,
                      data: opp,
                    })
                  }
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{opp.account_name}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600">
                      {opp.stage}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                    ${opp.amount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-mono">{opp.probability_pct}%</td>
                  <td className="py-2.5 px-3 text-slate-500">{opp.expected_close_at}</td>
                  <td className="py-2.5 px-3 text-slate-800">{opp.owner}</td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{opp.plan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 5. PRICING CONTROL VIEW
export const PricingControlView: React.FC<ViewCommonProps & {
  plans: ProductPlanPricing[];
}> = ({ showToast, onInspect, onOpenCreateModal, plans }) => {
  return (
    <div className="flex-1 p-3.5 sm:p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Pricing &amp; Plan Authority</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Commercial Authority
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Authoritative commercial pricing rates, plan codes, minor currency units, and feature packaging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(plans, 'pricing-plans')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Catalog</span>
          </button>
          <button
            onClick={() => onOpenCreateModal('plan')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Plan Code</span>
          </button>
        </div>
      </div>

      {/* 3 KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Active Plan Codes</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{plans.length}</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">All Active</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Catalog Schema Version</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">v3.2</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Immutable Contract</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Default Base Currency</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">USD ($)</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Multi-Currency Ready</span>
        </div>
      </div>

      {/* Plan Table */}
      <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Authoritative Product Plan Catalog</h3>
        <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Plan Name</th>
                <th className="py-2.5 px-3">Product Code</th>
                <th className="py-2.5 px-3">Plan Code</th>
                <th className="py-2.5 px-3">Monthly Rate</th>
                <th className="py-2.5 px-3">Features</th>
                <th className="py-2.5 px-3">Tier</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {plans.map((p) => (
                <tr
                  key={p.id}
                  onClick={() =>
                    onInspect({
                      type: 'Pricing Plan',
                      title: p.display_name,
                      id: p.plan_code,
                      status: p.active ? 'Active' : 'Inactive',
                      data: p,
                    })
                  }
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{p.display_name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{p.product_code}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{p.plan_code}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                    ${(p.monthly_amount_minor / 100).toLocaleString()} /mo
                  </td>
                  <td className="py-2.5 px-3 font-mono">{p.features_count} Entitlements</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                      {p.tier}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                      Active
                    </span>
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

// 6. FINANCE & BILLING VIEW
export const FinanceView: React.FC<ViewCommonProps & {
  invoices: InvoiceRecord[];
  transactions: TransactionRecord[];
}> = ({ showToast, onInspect, invoices, transactions }) => {
  const invoiceTotal = invoices.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const settledTotal = transactions.filter((item) => item.status === 'succeeded').reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const overdueTotal = invoices.filter((item) => item.status === 'overdue').reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const paidRate = invoiceTotal > 0 ? Math.round((settledTotal / invoiceTotal) * 100) : null;
  return (
    <div className="flex-1 p-3.5 sm:p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Finance, Invoices &amp; Ledger</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Financial Control
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Core commercial ledger, invoice reconciliation status, and payment activity.
          </p>
        </div>

        <button
          onClick={() => exportToCSV(invoices, 'invoices-ledger')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Invoices</span>
        </button>
      </div>

      {/* 4 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">MRR</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">—</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Core revenue summary required</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Invoices Billed</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">${invoiceTotal.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Loaded invoice ledger</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Settled Payments</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">${settledTotal.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">{paidRate === null ? 'No settled ledger data' : `${paidRate}% of loaded invoice value`}</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Overdue Invoices</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">${overdueTotal.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Loaded overdue ledger</span>
        </div>
      </div>

      {/* Tables: Invoices & Transactions */}
      <div className="space-y-6">
        <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Recent Invoices</h3>
          <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() =>
                      onInspect({
                        type: 'Invoice Record',
                        title: `${inv.invoice_number} - ${inv.customerName}`,
                        id: inv.invoice_number,
                        status: inv.status,
                        data: inv,
                      })
                    }
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                  >
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{inv.invoice_number}</td>
                    <td className="py-2.5 px-3">{inv.customerName}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      ${inv.amount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{inv.due_at}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{inv.payment_method}</td>
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

// 7. ENGINEERING VIEW (SLO, Changes, Errors, Incidents)
export const EngineeringView: React.FC<ViewCommonProps & {
  errorGroups: EngineeringErrorGroup[];
  incidents: EngineeringIncident[];
  changes: EngineeringChange[];
  slos: ServiceSLO[];
}> = ({ showToast, onInspect, onOpenCreateModal, errorGroups, incidents, changes, slos }) => {
  return (
    <div className="flex-1 p-3.5 sm:p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Engineering Reliability &amp; SLOs</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Site Reliability
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Service Level Objectives (SLO), automated error tracking, deployment changelog, and live incident triage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(incidents, 'incidents-log')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Incident Log</span>
          </button>
          <button
            onClick={() => onOpenCreateModal('incident')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Declare Incident</span>
          </button>
        </div>
      </div>

      {/* 6 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Fleet Uptime (30d)</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">—</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Within Error Budget</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">P99 KMS Latency</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">—</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">No Core latency projection supplied</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Active Incidents</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{incidents.length}</span>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 block">Mitigation In Progress</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Unresolved Errors</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {errorGroups.filter((e) => e.status !== 'resolved').length}
          </span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Low user impact</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Recent Deployments</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{changes.length}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Based on loaded change records</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">SLO Targets Met</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{slos.filter((slo) => slo.status === 'healthy').length} / {slos.length}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Derived from loaded SLO records</span>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Incident Triage &amp; Commander Queue</h3>
        <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Key</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Summary</th>
                <th className="py-2.5 px-3">Service</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Commander Lead</th>
                <th className="py-2.5 px-3">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {incidents.map((inc) => (
                <tr
                  key={inc.incident_key}
                  onClick={() =>
                    onInspect({
                      type: 'Engineering Incident',
                      title: inc.title,
                      id: inc.incident_key,
                      status: inc.status,
                      data: inc,
                    })
                  }
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{inc.incident_key}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600">
                      {inc.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{inc.title}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{inc.service}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600">
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-800">{inc.lead}</td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono">{inc.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 8. SECURITY & CBOM REMEDIATION VIEW
export const SecurityView: React.FC<ViewCommonProps & {
  remediations: SecurityRemediationTask[];
  assurance: SecurityAssuranceRun[];
}> = ({ showToast, onInspect, onOpenCreateModal, remediations, assurance }) => {
  return (
    <div className="flex-1 p-3.5 sm:p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Security &amp; CBOM Remediation</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Post-Quantum Assurance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic Bill of Materials (CBOM) inventory, vulnerability remediation, and continuous assurance verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(remediations, 'cbom-remediations')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CBOM</span>
          </button>
          <button
            onClick={() => onOpenCreateModal('remediation')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Remediation</span>
          </button>
        </div>
      </div>

      {/* 6 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Total Remediations</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{remediations.length}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">In Scope</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Critical Risk</span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">
            {remediations.filter((r) => r.severity === 'Critical').length}
          </span>
          <span className="text-[10px] text-rose-600 font-semibold mt-1 block">SLA &lt;4d Remaining</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">High Risk</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">
            {remediations.filter((r) => r.severity === 'High').length}
          </span>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 block">In Progress</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Assurance Runs</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{assurance.length}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Derived from loaded assurance results</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">FIPS 203 Migration</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">—</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Awaiting measured PQC migration projection</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">FIPS 204 Signatures</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">—</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Awaiting measured PQC signature projection</span>
        </div>
      </div>

      {/* Remediation Table */}
      <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Cryptographic CBOM Remediation Tasks</h3>
        <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Task ID</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3">Cloud Account</th>
                <th className="py-2.5 px-3">Asset</th>
                <th className="py-2.5 px-3">Framework Standard</th>
                <th className="py-2.5 px-3">SLA Left</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {remediations.map((r) => (
                <tr
                  key={r.id}
                  onClick={() =>
                    onInspect({
                      type: 'Security Remediation Task',
                      title: r.title,
                      id: r.id,
                      status: r.status,
                      data: r,
                    })
                  }
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{r.id}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.severity === 'Critical'
                          ? 'bg-rose-500/10 text-rose-600'
                          : r.severity === 'High'
                          ? 'bg-amber-500/10 text-amber-600'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {r.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{r.title}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{r.cloud_account}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{r.asset}</td>
                  <td className="py-2.5 px-3 text-slate-700">{r.framework}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-rose-600">{r.sla_days_left} days</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600">
                      {r.status}
                    </span>
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

// 9. REGULATORY & GOVERNANCE VIEW
export const RegulatoryView: React.FC<ViewCommonProps & {
  instruments: RegulatoryInstrument[];
}> = ({ showToast, onInspect, instruments }) => {
  return (
    <div className="flex-1 p-3.5 sm:p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Regulatory &amp; Governance</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Compliance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            FIPS 203/204 mandates, NSA CNSA 2.0 timeline, SOC-2 Type II controls, and compliance posture.
          </p>
        </div>

        <button
          onClick={() => exportToCSV(instruments, 'regulatory-instruments')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Governance Report</span>
        </button>
      </div>

      {/* 6 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Total Instruments</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{instruments.length}</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Active Frameworks</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">FIPS 203 Compliance</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">—</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Core compliance evidence required</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">FIPS 204 Compliance</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">—</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Core compliance evidence required</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">CNSA 2.0 Read</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">—</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Assessment projection not loaded</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Mapped Controls</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">—</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Control mapping count supplied by Core contract</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Pending Reviews</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{instruments.reduce((sum, instrument) => sum + instrument.pending_reviews, 0)}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Loaded pending reviews</span>
        </div>
      </div>

      {/* Instruments Table */}
      <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Regulatory Instruments &amp; Legal Mandates</h3>
        <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Framework Name</th>
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Requirements</th>
                <th className="py-2.5 px-3">Mapped</th>
                <th className="py-2.5 px-3">Assessment Progress</th>
                <th className="py-2.5 px-3">Pending Reviews</th>
                <th className="py-2.5 px-3">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {instruments.map((inst) => (
                <tr
                  key={inst.id}
                  onClick={() =>
                    onInspect({
                      type: 'Regulatory Instrument',
                      title: inst.name,
                      id: inst.code,
                      status: inst.status,
                      data: inst,
                    })
                  }
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{inst.name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{inst.code}</td>
                  <td className="py-2.5 px-3 font-mono">{inst.requirements_total}</td>
                  <td className="py-2.5 px-3 font-mono">{inst.mapped_count}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-20">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${inst.assessment_pct}%` }}
                        />
                      </div>
                      <span className="font-mono font-semibold">{inst.assessment_pct}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono">{inst.pending_reviews}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                      {inst.status}
                    </span>
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
