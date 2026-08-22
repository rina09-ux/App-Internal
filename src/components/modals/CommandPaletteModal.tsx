import React, { useState } from 'react';
import {
  Search,
  LayoutDashboard,
  Users,
  HeartHandshake,
  TrendingUp,
  CreditCard,
  Banknote,
  Cpu,
  ShieldCheck,
  Award,
  Box,
  UserCheck,
  Server,
  Database,
  FileText,
  Bell,
  Briefcase,
  History,
  Layers,
  Globe,
  Zap,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  Receipt,
  FileCode,
} from 'lucide-react';
import { WorkspaceId, CustomerProfile, EngineeringIncident, SecurityRemediationTask, ProductPlanPricing } from '../../types/workspaces';
import { InspectorEntity } from '../modals/DetailInspectorDrawer';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (workspaceId: WorkspaceId) => void;
  onTriggerScan: () => void;
  onOpenSandbox?: () => void;
  onInspectEntity?: (entity: InspectorEntity) => void;
  customers?: CustomerProfile[];
  incidents?: EngineeringIncident[];
  remediations?: SecurityRemediationTask[];
  plans?: ProductPlanPricing[];
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
  onTriggerScan,
  onOpenSandbox,
  onInspectEntity,
  customers = [],
  incidents = [],
  remediations = [],
  plans = [],
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const workspaces: {
    id: WorkspaceId;
    title: string;
    category: string;
    endpoint: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'command-center', title: 'Command Center (Executive Operating Picture)', category: 'Executive', endpoint: '/internal-experience/command-center', icon: LayoutDashboard },
    { id: 'customer-360', title: 'Customer 360 (Drill-down tenant profile)', category: 'Customer', endpoint: '/internal/customers', icon: Users },
    { id: 'customer-success', title: 'Customer Success (Health, actions & renewals)', category: 'Customer', endpoint: '/internal-control-tower/deep/customer-success', icon: HeartHandshake },
    { id: 'sales-revenue', title: 'Sales & Revenue (Deal pipeline & ARR)', category: 'Customer', endpoint: '/internal/sales/opportunities', icon: TrendingUp },
    { id: 'pricing-control', title: 'Pricing Control (Plan authority & rates)', category: 'Customer', endpoint: '/internal-control-tower/commercial', icon: CreditCard },
    { id: 'finance', title: 'Finance & Billing (MRR, Invoices & ledger)', category: 'Executive', endpoint: '/internal/finance/summary', icon: Banknote },
    { id: 'engineering', title: 'Engineering (SLO, changes, errors & incidents)', category: 'Tech', endpoint: '/internal-control-tower/deep/engineering', icon: Cpu },
    { id: 'security', title: 'Security & Remediation (CBOM & assurance)', category: 'Tech', endpoint: '/internal-control-tower/deep/security', icon: ShieldCheck },
    { id: 'regulatory', title: 'Regulatory & Governance (FIPS 203/204 & CNSA)', category: 'Governance', endpoint: '/internal-control-tower/governance', icon: Award },
    { id: 'product', title: 'Product Management (Entitlements & releases)', category: 'Product', endpoint: '/internal-control-tower/deep/product', icon: Box },
    { id: 'people-rbac', title: 'People & RBAC (Accounts & clearance roles)', category: 'Identity', endpoint: '/internal/identity/accounts', icon: UserCheck },
    { id: 'platform', title: 'Platform Runtime (Fleet status & latency)', category: 'Tech', endpoint: '/internal-control-tower/platform', icon: Server },
    { id: 'data-intelligence', title: 'Data & Intelligence (Lineage & migration)', category: 'Tech', endpoint: '/internal-control-tower/deep/data', icon: Database },
    { id: 'reports-downloads', title: 'Reports & Downloads (Contracts & exports)', category: 'Governance', endpoint: '/internal-control-tower/reports', icon: FileText },
    { id: 'notifications', title: 'Operational Notifications Feed', category: 'Executive', endpoint: '/internal/notifications', icon: Bell },
    { id: 'my-work', title: 'My Work (Role-scoped work item queue)', category: 'Executive', endpoint: '/internal/work', icon: Briefcase },
    { id: 'audit', title: 'Audit Trail (Immutable audit event log)', category: 'Executive', endpoint: '/internal/audit-log', icon: History },
    { id: 'coverage', title: 'Cross-Domain Coverage Counts', category: 'Analytics', endpoint: '/internal-control-tower/deep/coverage', icon: Layers },
    { id: 'cms', title: 'CMS & Publishing Application Surface', category: 'Publishing', endpoint: '/internal/cms', icon: Globe },
  ];

  const filteredWorkspaces = workspaces.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase()) ||
      c.endpoint.toLowerCase().includes(query.toLowerCase())
  );

  // Filter specific entities if query length > 1
  const matchingCustomers = query.trim().length > 1
    ? customers.filter(
        (c) =>
          c.display_name.toLowerCase().includes(query.toLowerCase()) ||
          c.tenant_id.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchingIncidents = query.trim().length > 1
    ? incidents.filter(
        (i) =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.incident_key.toLowerCase().includes(query.toLowerCase()) ||
          i.service.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchingRemediations = query.trim().length > 1
    ? remediations.filter(
        (r) =>
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.id.toLowerCase().includes(query.toLowerCase()) ||
          r.asset.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchingPlans = query.trim().length > 1
    ? plans.filter(
        (p) =>
          p.display_name.toLowerCase().includes(query.toLowerCase()) ||
          p.plan_code.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-20 p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="border-beam-wrap bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-4 h-4 text-blue-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workspaces, tenants, incidents, CBOM assets, or plans..."
            className="flex-1 text-sm bg-transparent border-none focus:outline-hidden text-slate-900 placeholder:text-slate-400"
          />
          <kbd className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-slate-500 font-mono shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Scrollable Command / Entity List */}
        <div className="overflow-y-auto p-3 space-y-3 flex-1">
          {/* Quick Sandbox & Scan Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => {
                onTriggerScan();
                onClose();
              }}
              className="flex items-center justify-between p-2.5 rounded-xl text-xs text-left cursor-pointer transition text-blue-700 bg-blue-50/70 hover:bg-blue-500/10 border border-blue-500/30"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
                <span className="font-bold">Trigger CBOM Scan</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            </button>

            {onOpenSandbox && (
              <button
                onClick={() => {
                  onOpenSandbox();
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs text-left cursor-pointer transition text-emerald-600 bg-emerald-50/70 hover:bg-emerald-500/10 border border-emerald-500/30"
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold">Launch PQC Key Sandbox</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
              </button>
            )}
          </div>

          {/* Section: Specific Matched Entities (If Searching) */}
          {matchingCustomers.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 px-2">
                Matched Tenants ({matchingCustomers.length})
              </div>
              {matchingCustomers.map((c) => (
                <button
                  key={c.tenant_id}
                  onClick={() => {
                    if (onInspectEntity) {
                      onInspectEntity({
                        type: 'Customer Profile',
                        title: c.display_name,
                        id: c.tenant_id,
                        status: c.status,
                        data: c,
                      });
                    }
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 text-xs text-left cursor-pointer transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-900 truncate">{c.display_name}</span>
                    <span className="text-[10px] font-mono text-slate-400">({c.tenant_id})</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                    {c.healthScore}% Health
                  </span>
                </button>
              ))}
            </div>
          )}

          {matchingIncidents.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 px-2">
                Matched Incidents ({matchingIncidents.length})
              </div>
              {matchingIncidents.map((i) => (
                <button
                  key={i.incident_key}
                  onClick={() => {
                    if (onInspectEntity) {
                      onInspectEntity({
                        type: 'Engineering Incident',
                        title: i.title,
                        id: i.incident_key,
                        status: i.status,
                        data: i,
                      });
                    }
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 text-xs text-left cursor-pointer transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span className="font-semibold text-slate-900 truncate">{i.title}</span>
                    <span className="text-[10px] font-mono text-slate-400">({i.incident_key})</span>
                  </div>
                  <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold">
                    {i.severity}
                  </span>
                </button>
              ))}
            </div>
          )}

          {matchingRemediations.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 px-2">
                Matched CBOM Remediations ({matchingRemediations.length})
              </div>
              {matchingRemediations.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    if (onInspectEntity) {
                      onInspectEntity({
                        type: 'Security Remediation Task',
                        title: r.title,
                        id: r.id,
                        status: r.status,
                        data: r,
                      });
                    }
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 text-xs text-left cursor-pointer transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-semibold text-slate-900 truncate">{r.title}</span>
                  </div>
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-mono">
                    {r.target_algorithm}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Section: Workspaces Navigation */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 px-2">
              Workspaces &amp; Subsystems ({filteredWorkspaces.length})
            </div>
            {filteredWorkspaces.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    onSelectAction(cmd.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 text-xs text-left cursor-pointer transition text-slate-800"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{cmd.title}</div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">{cmd.endpoint}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-mono shrink-0">
                    {cmd.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
