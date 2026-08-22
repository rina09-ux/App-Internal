import React, { useEffect, useState } from 'react';
import {
  Users2,
  FolderKanban,
  Sparkles,
  User,
  SlidersHorizontal,
  CheckCircle2,
  Lock,
  Code2,
  HardDrive,
  CreditCard,
  Plus,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Key,
  Trash2,
  Calendar,
  Download,
  Activity,
  Layers,
} from 'lucide-react';
import { WorkspaceMember, WorkspaceIntegration } from '../types';
import { coreApi } from '../lib/nusasecCoreClient';

interface OtherViewsProps {
  currentView: string;
  onNavigateToBilling: () => void;
  currentPlan: string;
  showToast: (msg: string) => void;
}

export const OtherViews: React.FC<OtherViewsProps> = ({
  currentView,
  onNavigateToBilling,
  currentPlan,
  showToast,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [apiKey, setApiKey] = useState('');

  const [members, setMembers] = useState<WorkspaceMember[]>([]);


  const [integrations, setIntegrations] = useState<WorkspaceIntegration[]>([]);
  const [memberLoadError, setMemberLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    coreApi.getOrganization()
      .then((result) => {
        if (cancelled) return;
        setMembers(result.members.map((member) => ({
          id: String(member.id),
          name: member.display_name || member.email,
          email: member.email,
          role: member.role || 'Member',
          avatar: String(member.display_name || member.email).slice(0, 2).toUpperCase(),
          lastActive: member.status || 'Active',
          seatCost: 0,
        })));
        setMemberLoadError(null);
      })
      .catch((error) => {
        if (cancelled) return;
        setMembers([]);
        setMemberLoadError(error instanceof Error ? error.message : 'Tidak dapat memuat anggota dari Core.');
      });
    return () => { cancelled = true; };
  }, []);

  const toggleIntegration = (_id: string) => {
    showToast('Integration changes must be performed through the Core integration contract; local UI toggles are disabled.');
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    showToast('API key copied to clipboard');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleGenerateNewKey = async () => {
    try {
      const result = await coreApi.createApiKey('Internal workspace API key', 'PQC_API');
      setApiKey(result.api_key);
      showToast('API key dibuat oleh NusaSec-Core. Simpan secret ini sekarang; Core tidak akan menampilkan ulang secret penuh.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Gagal membuat API key di Core.');
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;
    try {
      await coreApi.inviteMember({
        email,
        display_name: email.split('@')[0] || email,
        role: 'CUSTOMER_VIEWER',
      });
      const refreshed = await coreApi.getOrganization();
      setMembers(refreshed.members.map((member) => ({
        id: String(member.id),
        name: member.display_name || member.email,
        email: member.email,
        role: member.role || 'Member',
        avatar: String(member.display_name || member.email).slice(0, 2).toUpperCase(),
        lastActive: member.status || 'Active',
        seatCost: 0,
      })));
      setInviteEmail('');
      showToast(`Invitation sent to ${email}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : `Gagal mengundang ${email}`);
    }
  };

  // OVERVIEW VIEW
  if (currentView === 'overview') {
    return (
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-white">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Workspace Overview</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Current health, team activity, and resource utilization.
              </p>
            </div>
            <button
              onClick={onNavigateToBilling}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs cursor-pointer"
            >
              Manage Subscription ({currentPlan.toUpperCase()})
            </button>
          </div>

          {/* Quick Metrics Grid */}
          {memberLoadError && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-50 px-3 py-2 text-xs text-amber-600">
              Core organization data unavailable: {memberLoadError}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-slate-200/90 rounded-2xl p-4 bg-slate-50/50">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Active Seats</span>
                <Users2 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">
                {members.length}{' '}
                <span className="text-xs font-normal text-slate-500">live Core members</span>
              </div>
              <div className="text-[11px] text-emerald-600 mt-1 font-medium">
                1 seat available
              </div>
            </div>

            <div className="border border-slate-200/90 rounded-2xl p-4 bg-slate-50/50">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Storage Utilization</span>
                <HardDrive className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2">
                0.42 <span className="text-xs font-normal text-slate-500">/ 1.00 GB</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-purple-600 h-full w-[42%]" />
              </div>
            </div>

            <div className="border border-slate-200/90 rounded-2xl p-4 bg-slate-50/50">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>Current Plan</span>
                <CreditCard className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-2 capitalize">
                {currentPlan}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Renews automatically next cycle
              </div>
            </div>
          </div>

          {/* Recent Workspace Events */}
          <div className="border border-slate-200/90 rounded-2xl p-5 bg-white">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Recent Team Activity</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                    SC
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Sarah Connor</span>{' '}
                    <span className="text-slate-600">created a new workflow in GoodWriter</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400">14m ago</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-700 font-bold flex items-center justify-center text-[10px]">
                    DK
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">David Kim</span>{' '}
                    <span className="text-slate-600">exported billing report for August 2026</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400">2h ago</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-700 font-bold flex items-center justify-center text-[10px]">
                    AM
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Alex Morgan</span>{' '}
                    <span className="text-slate-600">enabled 2-Factor Authentication</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400">1d ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MEMBERS VIEW
  if (currentView === 'members') {
    return (
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-white">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Workspace Members</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage roles, invite colleagues, and monitor seat allocations.
              </p>
            </div>
            <button
              onClick={onNavigateToBilling}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Add more seats in Billing →
            </button>
          </div>

          {/* Invite Form */}
          <form
            onSubmit={handleInvite}
            className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200/90 rounded-2xl"
          >
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter teammate email (e.g. colleague@company.com)..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Member</span>
            </button>
          </form>

          {/* Members Table */}
          <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white">
            <div className="divide-y divide-slate-100">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{member.name}</div>
                      <div className="text-slate-500 text-[11px]">{member.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {member.role}
                    </span>
                    <span className="text-slate-400 text-[11px] hidden sm:inline">
                      Active: {member.lastActive}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PROJECTS VIEW
  if (currentView === 'projects') {
    return (
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-white">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Projects</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Organized tasks, workflows, and automated pipeline outputs.
              </p>
            </div>
            <button
              onClick={() => showToast('Created new project folder')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-200/90 rounded-2xl p-4 bg-white hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                  In Progress
                </span>
                <span className="text-xs text-slate-400">8 items</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-3">Q3 Brand Refresh</h3>
              <p className="text-xs text-slate-500 mt-1">Design system updates, token sync with Figma</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Team: GoodWriter</span>
                <span>Due Sep 12</span>
              </div>
            </div>

            <div className="border border-slate-200/90 rounded-2xl p-4 bg-white hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded">
                  Completed
                </span>
                <span className="text-xs text-slate-400">14 items</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-3">Invoice Parser Automation</h3>
              <p className="text-xs text-slate-500 mt-1">AI-assisted OCR ingestion for accounts payable</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Team: Invoicer</span>
                <span>Live</span>
              </div>
            </div>

            <div className="border border-slate-200/90 rounded-2xl p-4 bg-white hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-50 text-amber-600 rounded">
                  Planning
                </span>
                <span className="text-xs text-slate-400">4 items</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-3">SOC2 Compliance Audit</h3>
              <p className="text-xs text-slate-500 mt-1">Security logs, ACL enforcement, access logs</p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Security Group</span>
                <span>Due Oct 01</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // INTEGRATIONS VIEW
  if (currentView === 'integrations') {
    return (
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-white">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Integrations</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect external services to automate workspace actions.
            </p>
          </div>

          <div className="space-y-3">
            {integrations.map((item) => (
              <div
                key={item.id}
                className="border border-slate-200/90 rounded-2xl p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-lg shrink-0">
                    {item.iconName}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleIntegration(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                    item.connected
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {item.connected ? 'Connected ✓' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // API VIEW
  if (currentView === 'api') {
    return (
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-white">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Developer API Keys</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Authenticate requests to your workspace automation API endpoints.
            </p>
          </div>

          <div className="border border-slate-200/90 rounded-2xl p-5 bg-white space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-900">Live Secret Key</div>
              <div className="text-xs text-slate-500">Do not share your live secret key in client-side code.</div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
              <span className="flex-1 truncate">{apiKey}</span>
              <button
                onClick={handleCopyKey}
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer text-slate-600"
                title="Copy API Key"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleGenerateNewKey}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition cursor-pointer"
              >
                Roll / Regenerate Key
              </button>
              <span className="text-[11px] text-slate-400">Created: Aug 19, 2026</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GENERAL SETTINGS / PROFILE / PREFERENCE / SECURITY / PASSWORDS / TEAMS
  return (
    <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-white">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 capitalize">
              {currentView.startsWith('team-')
                ? `Team: ${currentView.replace('team-', '')}`
                : currentView}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Workspace configuration and account preferences.
            </p>
          </div>
          <button
            onClick={onNavigateToBilling}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition cursor-pointer"
          >
            View Billing & Plan →
          </button>
        </div>

        <div className="border border-slate-200/90 rounded-2xl p-5 bg-white space-y-4">
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
              <div>
                <div className="font-semibold text-slate-900">Two-Factor Authentication (2FA)</div>
                <div className="text-slate-500">Require an authenticator app or SMS code on sign in.</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-500/30">
                Enabled
              </span>
            </div>

            <div className="flex items-center justify-between py-2.5 border-b border-slate-100">
              <div>
                <div className="font-semibold text-slate-900">Google Single Sign-On (SSO)</div>
                <div className="text-slate-500">Allow team members to authenticate with Google accounts.</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-500/30">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between py-2.5">
              <div>
                <div className="font-semibold text-slate-900">Data Loss Prevention (DLP)</div>
                <div className="text-slate-500">Scan sensitive files and prevent unauthorized external sharing.</div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                Available on Premium
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
