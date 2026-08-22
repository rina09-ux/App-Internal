import React, { useState } from 'react';
import {
  Menu,
  X,
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
  ChevronRight,
} from 'lucide-react';
import { WorkspaceId } from '../types/workspaces';

interface MobileNavigationProps {
  activeWorkspace: WorkspaceId;
  onSelectWorkspace: (id: WorkspaceId) => void;
  onOpenCommandPalette: () => void;
  onTriggerAction: () => void;
  onOpenSandbox?: () => void;
  unreadNotificationsCount?: number;
  openIncidentsCount?: number;
}

export const MobileHeader: React.FC<
  MobileNavigationProps & {
    isDrawerOpen: boolean;
    setIsDrawerOpen: (open: boolean) => void;
  }
> = ({
  activeWorkspace,
  onSelectWorkspace,
  onOpenCommandPalette,
  onTriggerAction,
  unreadNotificationsCount = 0,
  isDrawerOpen,
  setIsDrawerOpen,
}) => {
  // Format human-readable title for current workspace
  const getWorkspaceTitle = (id: WorkspaceId) => {
    switch (id) {
      case 'command-center':
        return 'Command Center';
      case 'customer-360':
        return 'Customer 360';
      case 'customer-success':
        return 'Customer Success';
      case 'sales-revenue':
        return 'Sales & Revenue';
      case 'pricing-control':
        return 'Pricing Control';
      case 'finance':
        return 'Finance & Billing';
      case 'engineering':
        return 'Engineering (SLO)';
      case 'security':
        return 'Security & Scans';
      case 'platform':
        return 'Platform Runtime';
      case 'data-intelligence':
        return 'Data & Lineage';
      case 'regulatory':
        return 'Regulatory & FIPS';
      case 'product':
        return 'Product Catalog';
      case 'people-rbac':
        return 'People & RBAC';
      case 'reports-downloads':
        return 'Reports & Exports';
      case 'coverage':
        return 'Domain Coverage';
      case 'cms':
        return 'CMS Publishing';
      case 'notifications':
        return 'Notifications';
      case 'my-work':
        return 'My Work Queue';
      case 'audit':
        return 'Audit Trail';
      default:
        return 'Workspace';
    }
  };

  return (
    <header className="md:hidden flex items-center justify-between px-3.5 py-2.5 bg-white border-b border-slate-200 shrink-0 z-30 select-none shadow-2xs">
      {/* Left: Hamburger & Brand */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          aria-label="Toggle navigation drawer"
          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition active:scale-95 cursor-pointer"
        >
          {isDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div
          onClick={() => onSelectWorkspace('command-center')}
          className="flex items-center gap-1.5 cursor-pointer min-w-0"
        >
          <div className="relative w-7 h-7 bg-black rounded-lg flex items-center justify-center text-white shrink-0">
            <span className="absolute inset-0 rounded-lg bg-blue-400/25 blur-md glow-pulse-dot -z-10" />
            <div className="flex items-center gap-[2px]">
              <span className="w-[2px] h-2.5 bg-white rounded-full" />
              <span className="w-[2.5px] h-3.5 bg-cyan-300 rounded-full" />
              <span className="w-[2px] h-2.5 bg-white rounded-full" />
            </div>
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-900 truncate block leading-tight font-display">
              {getWorkspaceTitle(activeWorkspace)}
            </span>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block leading-none">
              Q-SHIELD Control Tower
            </span>
          </div>
        </div>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onOpenCommandPalette}
          title="Quick Search (Cmd+K)"
          className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors active:scale-95"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={() => onSelectWorkspace('notifications')}
          title="Notifications"
          className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors relative active:scale-95"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white glow-pulse-dot" />
          )}
        </button>

        <button
          onClick={onTriggerAction}
          title="Fast Scan Action"
          className="btn-shimmer flex items-center gap-1 px-2.5 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/20 active:scale-95 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Action</span>
        </button>
      </div>
    </header>
  );
};

export const MobileNavDrawer: React.FC<
  MobileNavigationProps & {
    isOpen: boolean;
    onClose: () => void;
  }
> = ({
  activeWorkspace,
  onSelectWorkspace,
  onOpenCommandPalette,
  onTriggerAction,
  onOpenSandbox,
  unreadNotificationsCount = 0,
  openIncidentsCount = 0,
  isOpen,
  onClose,
}) => {
  const [drawerSearch, setDrawerSearch] = useState('');

  if (!isOpen) return null;

  const handleSelect = (id: WorkspaceId) => {
    onSelectWorkspace(id);
    onClose();
  };

  const navCategories = [
    {
      title: 'Executive & Operations',
      items: [
        { id: 'command-center' as WorkspaceId, label: 'Command Center', icon: LayoutDashboard, isDiamond: true },
        { id: 'my-work' as WorkspaceId, label: 'My Work Queue', icon: Briefcase },
        { id: 'notifications' as WorkspaceId, label: 'Notifications', icon: Bell, badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : undefined },
        { id: 'audit' as WorkspaceId, label: 'Audit Trail', icon: History },
      ],
    },
    {
      title: 'Customer & Revenue',
      items: [
        { id: 'customer-360' as WorkspaceId, label: 'Customer 360', icon: Users },
        { id: 'customer-success' as WorkspaceId, label: 'Customer Success', icon: HeartHandshake },
        { id: 'sales-revenue' as WorkspaceId, label: 'Sales & Revenue', icon: TrendingUp },
        { id: 'pricing-control' as WorkspaceId, label: 'Pricing Control', icon: CreditCard },
        { id: 'finance' as WorkspaceId, label: 'Finance & Billing', icon: Banknote },
      ],
    },
    {
      title: 'Tech & Security',
      items: [
        { id: 'engineering' as WorkspaceId, label: 'Engineering (SLO)', icon: Cpu, badge: openIncidentsCount > 0 ? `${openIncidentsCount}` : undefined },
        { id: 'security' as WorkspaceId, label: 'Security & Scans', icon: ShieldCheck },
        { id: 'platform' as WorkspaceId, label: 'Platform Runtime', icon: Server },
        { id: 'data-intelligence' as WorkspaceId, label: 'Data & Lineage', icon: Database },
      ],
    },
    {
      title: 'Governance & Product',
      items: [
        { id: 'regulatory' as WorkspaceId, label: 'Regulatory & FIPS', icon: Award },
        { id: 'product' as WorkspaceId, label: 'Product Catalog', icon: Box },
        { id: 'people-rbac' as WorkspaceId, label: 'People & RBAC', icon: UserCheck },
        { id: 'reports-downloads' as WorkspaceId, label: 'Reports & Exports', icon: FileText },
        { id: 'coverage' as WorkspaceId, label: 'Domain Coverage', icon: Layers },
        { id: 'cms' as WorkspaceId, label: 'CMS Publishing Engine', icon: Globe },
      ],
    },
  ];

  return (
    <div className="md:hidden fixed inset-0 z-50 overflow-hidden flex animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-out Sheet */}
      <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-200 border-r border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 bg-black rounded-xl flex items-center justify-center text-white">
              <span className="absolute inset-0 rounded-xl bg-blue-400/25 blur-md glow-pulse-dot -z-10" />
              <div className="flex items-center gap-[2px]">
                <span className="w-[2px] h-3 bg-white rounded-full" />
                <span className="w-[3px] h-4 bg-cyan-300 rounded-full" />
                <span className="w-[2px] h-3 bg-white rounded-full" />
              </div>
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 font-display">Q-SHIELD Tower</h2>
              <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">19 Workspaces v11</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close navigation drawer"
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search inside drawer */}
        <div className="p-3 border-b border-slate-200 bg-white">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search workspaces..."
              value={drawerSearch}
              onChange={(e) => setDrawerSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Scrollable Workspace Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {navCategories.map((cat) => {
            const filteredItems = cat.items.filter((item) =>
              item.label.toLowerCase().includes(drawerSearch.toLowerCase())
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={cat.title} className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-2 block">
                  {cat.title}
                </span>
                <div className="space-y-0.5">
                  {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeWorkspace === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                          isActive
                            ? 'bg-black text-white font-bold shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {item.isDiamond ? (
                            <Gem className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-300' : 'text-slate-800'}`} />
                          ) : (
                            <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          )}
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge ? (
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                              isActive ? 'bg-white text-slate-900' : 'bg-blue-600 text-white'
                            }`}
                          >
                            {item.badge}
                          </span>
                        ) : (
                          <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white/70' : 'text-slate-300'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Drawer Bottom Status & Triggers */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
          <div className="cyber-card flex items-center justify-between text-[11px] px-2.5 py-1.5 rounded-xl">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 glow-pulse-dot" />
              <span className="font-semibold text-slate-100">Control Tower Live</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400">PQC Ready</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {onOpenSandbox && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSandbox();
                }}
                className="flex items-center justify-center gap-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>PQC Lab</span>
              </button>
            )}

            <button
              onClick={() => {
                onClose();
                onTriggerAction();
              }}
              className={`btn-shimmer flex items-center justify-center gap-1 py-2 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/20 transition-colors active:scale-[0.98] ${
                !onOpenSandbox ? 'col-span-2' : ''
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Fast Scan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
