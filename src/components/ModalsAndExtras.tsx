import React, { useState } from 'react';
import { X, Check, Bell, User, Shield, CreditCard, Layers, Plus } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-slate-900 text-white rounded-xl shadow-xl text-xs font-medium border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-150">
      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-slate-400 hover:text-white transition cursor-pointer"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTeam: (name: string) => void;
}

export const AddTeamModal: React.FC<AddTeamModalProps> = ({ isOpen, onClose, onAddTeam }) => {
  const [teamName, setTeamName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;
    onAddTeam(teamName.trim());
    setTeamName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-100">
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Create New Team</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Team Workspace Name
            </label>
            <input
              type="text"
              required
              autoFocus
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Design Systems, Marketing Ops..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-blue-500 bg-slate-50 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Free 2-Month Trial Available',
      desc: 'Upgrade your workspace to annual billing and get 2 months free.',
      time: '1h ago',
      unread: true,
    },
    {
      id: 2,
      title: 'AI Intelligence Add-on is now Live',
      desc: 'Connect AI to query data across all your workspace folders.',
      time: '3h ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Monthly Invoice Generated',
      desc: 'Your receipt for August 2026 is ready for download in Billing.',
      time: '1d ago',
      unread: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-100">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 hover:bg-slate-50 transition text-xs ${
                n.unread ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{n.title}</span>
                <span className="text-[10px] text-slate-400">{n.time}</span>
              </div>
              <p className="text-slate-600 text-xs mt-1">{n.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
