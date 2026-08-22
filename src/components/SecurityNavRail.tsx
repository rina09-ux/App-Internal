import React from 'react';
import {
  LayoutDashboard,
  Users,
  Banknote,
  ShieldCheck,
  Award,
  Bell,
  Briefcase,
} from 'lucide-react';
import { WorkspaceId } from '../types/workspaces';

interface SecurityNavRailProps {
  activeWorkspace: WorkspaceId;
  onSelectWorkspace: (id: WorkspaceId) => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
}

export const SecurityNavRail: React.FC<SecurityNavRailProps> = ({
  activeWorkspace,
  onSelectWorkspace,
  onOpenNotifications,
  unreadNotificationsCount = 2,
}) => {
  const primaryNavGroups: { id: WorkspaceId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'command-center', label: 'Command Center', icon: LayoutDashboard },
    { id: 'customer-360', label: 'Customer 360 & CS', icon: Users },
    { id: 'sales-revenue', label: 'Revenue & Finance', icon: Banknote },
    { id: 'security', label: 'Security & Engineering', icon: ShieldCheck },
    { id: 'regulatory', label: 'Governance & Product', icon: Award },
    { id: 'my-work', label: 'My Work Queue', icon: Briefcase },
  ];

  return (
    <aside className="hidden md:flex w-14 lg:w-16 shrink-0 border-r border-slate-200 flex-col items-center py-4 justify-between select-none bg-white h-full z-10">
      {/* Top Logo */}
      <div className="flex flex-col items-center gap-6 w-full">
        <button
          onClick={() => onSelectWorkspace('command-center')}
          className="relative w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-xs hover:opacity-90 active:scale-95 transition-transform group cursor-pointer overflow-visible"
          title="Command Center"
          aria-label="Command Center Logo"
        >
          <span className="absolute inset-0 rounded-xl bg-blue-400/25 blur-md glow-pulse-dot -z-10" />
          {/* Elegant 3-bar logo with center lock node */}
          <div className="flex items-center gap-[3px]">
            <span className="w-[3px] h-3.5 bg-white rounded-full transition-all group-hover:h-4" />
            <span className="w-[3.5px] h-5 bg-cyan-300 rounded-full transition-all group-hover:h-5.5" />
            <span className="w-[3px] h-3.5 bg-white rounded-full transition-all group-hover:h-4" />
          </div>
        </button>

        {/* Nav Icons List */}
        <nav className="flex flex-col items-center gap-1.5 w-full px-2" aria-label="Primary navigation">
          {primaryNavGroups.map((item) => {
            const Icon = item.icon;
            const isActive = activeWorkspace === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectWorkspace(item.id)}
                title={item.label}
                aria-label={item.label}
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isActive && (
                  <span className="absolute left-[-9px] top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-full bg-blue-600" />
                )}
                <Icon className="w-5 h-5 stroke-[1.8]" />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Notifications */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        {/* Incident Alerts Bell */}
        <button
          onClick={onOpenNotifications}
          title="Operational Notifications"
          aria-label="Notifications"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition relative cursor-pointer"
        >
          <Bell className="w-5 h-5 stroke-[1.8]" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white glow-pulse-dot" />
          )}
        </button>

        {/* Profile Avatar */}
        <button
          onClick={() => onSelectWorkspace('people-rbac')}
          title="Dr. Victor Danilov (Q-Clearance)"
          className="w-9 h-9 rounded-xl p-[2px] bg-gradient-to-tr from-amber-400 via-rose-400 to-indigo-500 hover:opacity-90 active:scale-95 transition-all shadow-xs overflow-hidden cursor-pointer"
        >
          <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white text-[11px] font-bold">
            VD
          </div>
        </button>
      </div>
    </aside>
  );
};
