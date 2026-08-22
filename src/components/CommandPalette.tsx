import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  Zap,
} from 'lucide-react';
import { PlanTier } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onUpgradePlan: (plan: PlanTier) => void;
  onOpenTryAI: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onUpgradePlan,
  onOpenTryAI,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle will be handled by parent or opened
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'billing', title: 'Go to Billing & Plan', category: 'Navigation', icon: Gem, action: () => onNavigate('billing') },
    { id: 'try-ai', title: 'Try Workspace AI Assistant', category: 'AI Tools', icon: Sparkles, action: onOpenTryAI },
    { id: 'upgrade-plus', title: 'Upgrade to Plus Plan ($12/user/mo)', category: 'Plans', icon: Zap, action: () => onUpgradePlan('plus') },
    { id: 'upgrade-premium', title: 'Upgrade to Premium Plan ($16/user/mo)', category: 'Plans', icon: Zap, action: () => onUpgradePlan('premium') },
    { id: 'overview', title: 'Workspace Overview & Metrics', category: 'Navigation', icon: LayoutGrid, action: () => onNavigate('overview') },
    { id: 'members', title: 'Manage Team Members & Seats', category: 'Navigation', icon: Users2, action: () => onNavigate('members') },
    { id: 'projects', title: 'View Active Projects Kanban', category: 'Navigation', icon: FolderKanban, action: () => onNavigate('projects') },
    { id: 'integrations', title: 'Connected Apps & Integrations', category: 'Navigation', icon: Sparkles, action: () => onNavigate('integrations') },
    { id: 'api', title: 'Manage Developer API Keys', category: 'Settings', icon: Code2, action: () => onNavigate('api') },
    { id: 'security', title: 'Security & 2-Factor Authentication', category: 'Settings', icon: CheckCircle2, action: () => onNavigate('security') },
    { id: 'team-goodwriter', title: 'Switch to GoodWriter Team', category: 'Teams', icon: Layers, action: () => onNavigate('team-GoodWriter') },
    { id: 'team-invoicer', title: 'Switch to Invoicer Team', category: 'Teams', icon: Layers, action: () => onNavigate('team-Invoicer') },
  ];

  const filtered = actions.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-white">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search commands, plans, settings, or teams..."
            className="flex-1 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
          />
          <kbd className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching commands or pages found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-slate-50 transition cursor-pointer text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-600 flex items-center justify-center transition">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-medium text-slate-800 group-hover:text-slate-900">
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {item.category}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-slate-500 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
