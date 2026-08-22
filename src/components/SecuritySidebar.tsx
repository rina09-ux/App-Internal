import React from 'react';
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
  Gem,
  Plus,
  Radio,
} from 'lucide-react';
import { WorkspaceId } from '../types/workspaces';

interface SecuritySidebarProps {
  activeWorkspace: WorkspaceId;
  onSelectWorkspace: (id: WorkspaceId) => void;
  onOpenCommandPalette: () => void;
  onTriggerAction: () => void;
  onOpenSandbox?: () => void;
  unreadNotificationsCount?: number;
  openIncidentsCount?: number;
}

export const SecuritySidebar: React.FC<SecuritySidebarProps> = ({
  activeWorkspace,
  onSelectWorkspace,
  onOpenCommandPalette,
  onTriggerAction,
  onOpenSandbox,
  unreadNotificationsCount = 2,
  openIncidentsCount = 1,
}) => {
  // Category 1: Executive & Daily
  const executiveItems: { id: WorkspaceId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string; isDiamond?: boolean }[] = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard, isDiamond: true },
    { id: 'my-work', label: 'My Work', icon: Briefcase },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : undefined },
    { id: 'audit', label: 'Audit Trail', icon: History },
  ];

  // Category 2: Customers & Commercial
  const customerItems: { id: WorkspaceId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'customer-360', label: 'Customer 360', icon: Users },
    { id: 'customer-success', label: 'Customer Success', icon: HeartHandshake },
    { id: 'sales-revenue', label: 'Sales & Revenue', icon: TrendingUp },
    { id: 'pricing-control', label: 'Pricing Control', icon: CreditCard },
    { id: 'finance', label: 'Finance & Billing', icon: Banknote },
  ];

  // Category 3: Engineering & Security
  const engineeringItems: { id: WorkspaceId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'engineering', label: 'Engineering (SLO)', icon: Cpu, badge: openIncidentsCount > 0 ? `${openIncidentsCount}` : undefined },
    { id: 'security', label: 'Security & Scans', icon: ShieldCheck },
    { id: 'platform', label: 'Platform Runtime', icon: Server },
    { id: 'data-intelligence', label: 'Data & Lineage', icon: Database },
  ];

  // Category 4: Governance, Product & CMS
  const governanceItems: { id: WorkspaceId; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'regulatory', label: 'Regulatory & FIPS', icon: Award },
    { id: 'product', label: 'Product Catalog', icon: Box },
    { id: 'people-rbac', label: 'People & RBAC', icon: UserCheck },
    { id: 'reports-downloads', label: 'Reports & Exports', icon: FileText },
    { id: 'coverage', label: 'Domain Coverage', icon: Layers },
    { id: 'cms', label: 'CMS Publishing', icon: Globe },
  ];

  return (
    <aside className="hidden md:flex w-56 lg:w-60 shrink-0 border-r border-slate-200 p-3.5 flex-col justify-between select-none bg-white h-full overflow-hidden">
      <div className="flex flex-col gap-4 overflow-y-auto pr-1">
        {/* Search Bar with Cmd+K */}
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 hover:border-blue-300/70 rounded-xl text-slate-400 text-sm transition-colors group cursor-pointer"
          aria-label="Search Workspaces & Data"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="text-xs font-medium text-slate-500">Quick search...</span>
          </div>
          <kbd className="text-[10px] font-mono font-semibold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Section 1: Executive & Daily */}
        <div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-2.5 mb-1">
            Executive &amp; Operations
          </div>
          <div className="space-y-0.5">
            {executiveItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeWorkspace === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectWorkspace(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.isDiamond ? (
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-black text-white' : 'text-slate-700'
                        }`}
                      >
                        <Gem className="w-3 h-3 stroke-[2.2]" />
                      </div>
                    ) : (
                      <Icon className="w-4 h-4 text-slate-500 stroke-[1.8] shrink-0" />
                    )}
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Customers & Commercial */}
        <div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-2.5 mb-1">
            Customer &amp; Revenue
          </div>
          <div className="space-y-0.5">
            {customerItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeWorkspace === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectWorkspace(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 text-slate-500 stroke-[1.8] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Engineering & Security */}
        <div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-2.5 mb-1">
            Tech &amp; Security
          </div>
          <div className="space-y-0.5">
            {engineeringItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeWorkspace === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectWorkspace(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 text-slate-500 stroke-[1.8] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Governance & Product */}
        <div>
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-2.5 mb-1">
            Governance &amp; Product
          </div>
          <div className="space-y-0.5">
            {governanceItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeWorkspace === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectWorkspace(item.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 text-slate-500 stroke-[1.8] shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Live Telemetry Indicator & Trigger Action */}
      <div className="pt-2 border-t border-slate-200 mt-2 space-y-2">
        <div className="cyber-card px-2.5 py-1.5 rounded-xl flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 glow-pulse-dot" />
            <span className="font-semibold text-slate-100">Control Tower</span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400">v11 Live</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {onOpenSandbox && (
            <button
              onClick={onOpenSandbox}
              className="flex items-center justify-center gap-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>PQC Lab</span>
            </button>
          )}

          <button
            onClick={onTriggerAction}
            className={`btn-shimmer flex items-center justify-center gap-1 py-2 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-md shadow-slate-900/20 transition-colors cursor-pointer active:scale-[0.98] ${
              !onOpenSandbox ? 'col-span-2' : ''
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Scan Action</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
