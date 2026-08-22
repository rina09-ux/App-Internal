import React from 'react';
import {
  Search,
  LayoutGrid,
  Users2,
  FolderKanban,
  Gem,
  Bell,
  Sparkles,
  User,
  SlidersHorizontal,
  CheckCircle2,
  Lock,
  Code2,
  Layers,
  Plus,
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onSelectView: (view: string) => void;
  onOpenCommandPalette: () => void;
  onAddNewTeam: () => void;
  currentTeam: string;
  onSelectTeam: (teamName: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  onOpenCommandPalette,
  onAddNewTeam,
  currentTeam,
  onSelectTeam,
}) => {
  const workplaceItems = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'members', label: 'Members', icon: Users2 },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'billing', label: 'Billing', icon: Gem, isDiamond: true },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Sparkles },
  ];

  const accountItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preference', label: 'Preference', icon: SlidersHorizontal },
    { id: 'security', label: 'Security', icon: CheckCircle2 },
    { id: 'passwords', label: 'Passwords', icon: Lock },
    { id: 'api', label: 'API', icon: Code2 },
  ];

  const teamItems = [
    { id: 'GoodWriter', label: 'GoodWriter' },
    { id: 'Invoicer', label: 'Invoicer' },
  ];

  return (
    <aside className="w-56 lg:w-60 shrink-0 border-r border-slate-100 p-3.5 flex flex-col justify-between select-none bg-white">
      <div className="flex flex-col gap-5 overflow-y-auto pr-1">
        {/* Search Bar with Cmd+K */}
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 rounded-xl text-slate-400 text-sm transition group cursor-pointer"
          aria-label="Search workspace"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition" />
            <span className="text-xs font-medium text-slate-500">Search</span>
          </div>
          <kbd className="text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Group 1: WORKPLACE */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2.5 mb-1.5">
            Workplace
          </div>
          <div className="space-y-0.5">
            {workplaceItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-[#f3f4f6] text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.isDiamond ? (
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center ${
                        isActive ? 'bg-black text-white' : 'text-slate-700'
                      }`}
                    >
                      <Gem className="w-3.5 h-3.5 stroke-[2.2]" />
                    </div>
                  ) : (
                    <Icon className="w-4 h-4 text-slate-500 stroke-[1.8]" />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Group 2: MY ACCOUNT */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2.5 mb-1.5">
            My Account
          </div>
          <div className="space-y-0.5">
            {accountItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-[#f3f4f6] text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-500 stroke-[1.8]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Group 3: TEAM */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2.5 mb-1.5">
            Team
          </div>
          <div className="space-y-0.5">
            {teamItems.map((team) => {
              const isCurrent = currentTeam === team.label;
              return (
                <button
                  key={team.id}
                  onClick={() => onSelectTeam(team.label)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-100/80 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-4 h-4 text-slate-500 stroke-[1.8]" />
                  <span>{team.label}</span>
                </button>
              );
            })}

            <button
              onClick={onAddNewTeam}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-slate-400 stroke-[2]" />
              <span>Add new team</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
