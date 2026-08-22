import React from 'react';
import {
  Home,
  BarChart2,
  Users,
  Folder,
  Database,
  Calendar,
  Download,
  Settings,
  Bell,
} from 'lucide-react';

interface NavigationRailProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  unreadCount?: number;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  activeTab,
  onSelectTab,
  onOpenNotifications,
  onOpenProfile,
  unreadCount = 2,
}) => {
  const navItems = [
    { id: 'overview', icon: Home, label: 'Home' },
    { id: 'analytics', icon: BarChart2, label: 'Analytics' },
    { id: 'members', icon: Users, label: 'Members' },
    { id: 'projects', icon: Folder, label: 'Projects' },
    { id: 'billing', icon: Database, label: 'Storage & Billing' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'downloads', icon: Download, label: 'Downloads' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-16 shrink-0 border-r border-slate-100 flex flex-col items-center py-4 justify-between select-none bg-white">
      {/* Top Logo */}
      <div className="flex flex-col items-center gap-6 w-full">
        <button
          onClick={() => onSelectTab('overview')}
          className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-xs hover:opacity-90 active:scale-95 transition-transform group"
          title="Workspace Home"
          aria-label="Workspace logo"
        >
          {/* Custom 3-stripe logo from design */}
          <div className="flex items-center gap-[3px]">
            <span className="w-[3.5px] h-4 bg-white rounded-full transition-all group-hover:h-4.5" />
            <span className="w-[3.5px] h-5 bg-white rounded-full transition-all group-hover:h-5.5" />
            <span className="w-[3.5px] h-4 bg-white rounded-full transition-all group-hover:h-4.5" />
          </div>
        </button>

        {/* Nav Icons List */}
        <nav className="flex flex-col items-center gap-1.5 w-full px-2" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={item.label}
                aria-label={item.label}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isActive
                    ? 'text-slate-950 bg-slate-100 font-semibold'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[1.8]" />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Notifications */}
      <div className="flex flex-col items-center gap-3 w-full px-2">
        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          title="Notifications"
          aria-label="Notifications"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition relative"
        >
          <Bell className="w-5 h-5 stroke-[1.8]" />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
          )}
        </button>

        {/* Iridescent Squircle Avatar from design */}
        <button
          onClick={onOpenProfile}
          title="Account Profile"
          aria-label="User Profile"
          className="w-9 h-9 rounded-xl p-[2px] hover:ring-2 hover:ring-slate-300 active:scale-95 transition-all shadow-xs overflow-hidden"
        >
          <div
            className="w-full h-full rounded-[9px]"
            style={{
              background:
                'linear-gradient(135deg, #ff4e50 0%, #f9d423 35%, #00c6ff 70%, #0072ff 100%)',
            }}
          />
        </button>
      </div>
    </aside>
  );
};
