import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Save,
  Check,
  Trash2,
  AlertTriangle,
  Layers,
  Shield,
  User,
  Users,
  Globe,
  Tag,
  DollarSign,
  Cpu,
  FileText,
  Lock,
  Unlock,
  Sparkles,
  Package,
  Calendar,
  Key,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  Eye,
  Code,
  Image,
  Compass,
  Search,
  Share2,
  Send,
  Layout,
  FileCode,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import {
  CustomerProfile,
  EngineeringIncident,
  SecurityRemediationTask,
  ProductPlanPricing,
  ProductAddOn,
  ClientTenantUser,
  ProductDefinitionItem,
  UserAccountRecord,
  DataMigrationPlan,
  CMSContentItem,
  CMSPageItem,
  CMSSectionBlock,
  CMSNavigationItem,
  CMSMediaAssetItem,
  CMSInboundLeadItem,
  SalesOpportunity,
  RoleWorkItem,
} from '../../types/workspaces';

// Generates a short, unique identifier for newly-created draft entities.
// When a prefix is given, returns "<prefix>-<unique>"; otherwise returns just "<unique>"
// (for callers that build their own compound key, e.g. `INC-${draftId('')}`).
function draftId(prefix: string): string {
  const unique = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
  return prefix ? `${prefix}-${unique}` : unique;
}

// 1. CUSTOMER PROFILE EDITOR
export const CustomerEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  customer?: CustomerProfile | null;
  onSave: (customer: CustomerProfile) => Promise<boolean>;
}> = ({ isOpen, onClose, customer, onSave }) => {
  const [formData, setFormData] = useState<CustomerProfile>({
    tenant_id: draftId('cust'),
    display_name: '',
    plan: 'Enterprise PQC Sovereign',
    status: 'active',
    healthScore: 92,
    asset_count: 450,
    remediations: 2,
    evidence_objects: 34,
    subscriptionPlan: 'Enterprise PQC Sovereign',
    subscriptionStatus: 'ACTIVE_ANNUAL',
    mrr: 28500,
    invoice_count: 12,
    payment_count: 12,
    tier: 'Enterprise',
    owner: 'Elena Rostova (CSM Lead)',
    seats_allocated: 50,
    seats_used: 12,
    billing_model: 'per_user_monthly',
    billing_cycle: 'annual',
    price_per_seat_monthly: 450,
    active_addons: [],
  });

  useEffect(() => {
    if (customer) {
      setFormData(customer);
    } else {
      setFormData({
        tenant_id: draftId('cust'),
        display_name: '',
        plan: 'Enterprise PQC Sovereign',
        status: 'active',
        healthScore: 92,
        asset_count: 450,
        remediations: 2,
        evidence_objects: 34,
        subscriptionPlan: 'Enterprise PQC Sovereign',
        subscriptionStatus: 'ACTIVE_ANNUAL',
        mrr: 28500,
        invoice_count: 12,
        payment_count: 12,
        tier: 'Enterprise',
        owner: 'Elena Rostova (CSM Lead)',
        seats_allocated: 50,
        seats_used: 12,
        billing_model: 'per_user_monthly',
        billing_cycle: 'annual',
        price_per_seat_monthly: 450,
        active_addons: [],
      });
    }
  }, [customer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.display_name.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <h3 className="font-bold text-sm text-slate-900">
            {customer ? 'Edit Customer Tenant & Multi-Seat Plan' : 'Add New Customer Tenant'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Organization / Display Name *</label>
            <input
              type="text"
              required
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              placeholder="e.g. Apex Sovereign Bank"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Tenant ID</label>
              <input
                type="text"
                disabled={!!customer}
                value={formData.tenant_id}
                onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value })}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Scale">Scale</option>
                <option value="Growth">Growth</option>
                <option value="Starter">Starter</option>
              </select>
            </div>
          </div>

          {/* Multi-User Seat Quota & Billing Model */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                Multi-User Licensing &amp; Seats Quota
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase font-mono">
                {formData.seats_used} / {formData.seats_allocated} Seats Used
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Allocated Seat Limit</label>
                <input
                  type="number"
                  min="1"
                  value={formData.seats_allocated}
                  onChange={(e) => setFormData({ ...formData, seats_allocated: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Billing Model</label>
                <select
                  value={formData.billing_model}
                  onChange={(e) => setFormData({ ...formData, billing_model: e.target.value as any })}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="per_user_monthly">Per User / Bulan ($/seat/mo)</option>
                  <option value="per_user_annual">Per User / Tahunan ($/seat/yr)</option>
                  <option value="flat_monthly">Flat Enterprise Monthly</option>
                  <option value="flat_annual">Flat Enterprise Annual</option>
                  <option value="unit_usage">Metered Unit Usage</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Billing Frequency</label>
                <select
                  value={formData.billing_cycle}
                  onChange={(e) => setFormData({ ...formData, billing_cycle: e.target.value as any })}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="monthly">Monthly (Bulanan)</option>
                  <option value="annual">Annual (Tahunan - Save ~18%)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Price Per Seat / Mo ($)</label>
                <input
                  type="number"
                  value={formData.price_per_seat_monthly || 0}
                  onChange={(e) => setFormData({ ...formData, price_per_seat_monthly: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">MRR ($ USD)</label>
              <input
                type="number"
                value={formData.mrr}
                onChange={(e) => setFormData({ ...formData, mrr: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Health Score (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.healthScore}
                onChange={(e) => setFormData({ ...formData, healthScore: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="active">active</option>
                <option value="trialing">trialing</option>
                <option value="delinquent">delinquent</option>
                <option value="suspended">suspended</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Assigned Account Owner</label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-shimmer btn-shimmer-dark px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-colors active:scale-[0.98]"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. INCIDENT DECLARATION & EDIT MODAL
export const IncidentEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  incident?: EngineeringIncident | null;
  onSave: (incident: EngineeringIncident) => void;
}> = ({ isOpen, onClose, incident, onSave }) => {
  const [formData, setFormData] = useState<EngineeringIncident>({
    incident_key: `INC-${draftId('')}`,
    severity: 'SEV-2',
    title: '',
    service: 'auth-kms-v2',
    status: 'Triggered',
    lead: 'Dr. Victor Danilov',
    duration: '0m',
  });

  useEffect(() => {
    if (incident) {
      setFormData(incident);
    } else {
      setFormData({
        incident_key: `INC-${draftId('')}`,
        severity: 'SEV-2',
        title: '',
        service: 'auth-kms-v2',
        status: 'Triggered',
        lead: 'Dr. Victor Danilov',
        duration: '0m',
      });
    }
  }, [incident, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h3 className="font-bold text-sm text-slate-900">
              {incident ? `Edit ${incident.incident_key}` : 'Declare Engineering Incident'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Incident Title / Summary *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. KMS Key Decapsulation Latency Spike in us-east-1"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="SEV-1">SEV-1 (Critical Outage)</option>
                <option value="SEV-2">SEV-2 (Major Degradation)</option>
                <option value="SEV-3">SEV-3 (Moderate Impact)</option>
                <option value="SEV-4">SEV-4 (Minor Issue)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Service Impacted</label>
              <input
                type="text"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Incident Commander / Lead</label>
              <input
                type="text"
                value={formData.lead}
                onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="Triggered">Triggered</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Mitigating">Mitigating</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              Save Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. SECURITY REMEDIATION MODAL
export const SecurityRemediationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  remediation?: SecurityRemediationTask | null;
  onSave: (task: SecurityRemediationTask) => Promise<boolean>;
}> = ({ isOpen, onClose, remediation, onSave }) => {
  const [formData, setFormData] = useState<SecurityRemediationTask>({
    id: `REM-${draftId('')}`,
    title: '',
    severity: 'High',
    cloud_account: 'aws-us-east-prod',
    asset: 'alb-edge-crypto-gateway',
    status: 'Open',
    sla_days_left: 14,
    framework: 'FIPS 203 (ML-KEM)',
  });

  useEffect(() => {
    if (remediation) {
      setFormData(remediation);
    } else {
      setFormData({
        id: `REM-${draftId('')}`,
        title: '',
        severity: 'High',
        cloud_account: 'aws-us-east-prod',
        asset: 'alb-edge-crypto-gateway',
        status: 'Open',
        sla_days_left: 14,
        framework: 'FIPS 203 (ML-KEM)',
      });
    }
  }, [remediation, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
  
    const success = await onSave(formData);
  
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-800" />
            <h3 className="font-bold text-sm text-slate-900">
              {remediation ? `Edit ${remediation.id}` : 'Add Security Remediation Task'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Remediation Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Upgrade RSA-2048 Root to Dilithium3 / ML-DSA"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Target Framework</label>
              <select
                value={formData.framework}
                onChange={(e) => setFormData({ ...formData, framework: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="FIPS 203 (ML-KEM)">FIPS 203 (ML-KEM)</option>
                <option value="FIPS 204 (ML-DSA)">FIPS 204 (ML-DSA)</option>
                <option value="NSA CNSA 2.0">NSA CNSA 2.0</option>
                <option value="NIST SP 800-208 (LMS)">NIST SP 800-208 (LMS)</option>
                <option value="SOC-2 Type II">SOC-2 Type II</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Cloud Account</label>
              <input
                type="text"
                value={formData.cloud_account}
                onChange={(e) => setFormData({ ...formData, cloud_account: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Asset / Resource</label>
              <input
                type="text"
                value={formData.asset}
                onChange={(e) => setFormData({ ...formData, asset: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Validating">Validating</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">SLA Days Remaining</label>
              <input
                type="number"
                value={formData.sla_days_left}
                onChange={(e) => setFormData({ ...formData, sla_days_left: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-shimmer btn-shimmer-dark px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-colors active:scale-[0.98]"
            >
              Save Remediation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 4. USER & RBAC ACCOUNT MODAL
export const UserAccountEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user?: UserAccountRecord | null;
  onSave: (user: UserAccountRecord) => void;
}> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState<UserAccountRecord>({
    id: draftId('usr'),
    email: '',
    display_name: '',
    role: 'Cryptographic Engineer',
    department: 'Engineering',
    status: 'active',
    mfa_enabled: true,
    last_login: '2026-08-19 18:00',
    scopes: ['security:read', 'remediation:write'],
  });

  const [scopeInput, setScopeInput] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        id: draftId('usr'),
        email: '',
        display_name: '',
        role: 'Cryptographic Engineer',
        department: 'Engineering',
        status: 'active',
        mfa_enabled: true,
        last_login: '2026-08-19 18:00',
        scopes: ['security:read', 'remediation:write'],
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.display_name.trim()) return;
    onSave(formData);
    onClose();
  };

  const handleAddScope = () => {
    if (scopeInput.trim() && !formData.scopes.includes(scopeInput.trim())) {
      setFormData({
        ...formData,
        scopes: [...formData.scopes, scopeInput.trim()],
      });
      setScopeInput('');
    }
  };

  const handleRemoveScope = (scopeToRemove: string) => {
    setFormData({
      ...formData,
      scopes: formData.scopes.filter((s) => s !== scopeToRemove),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-800" />
            <h3 className="font-bold text-sm text-slate-900">
              {user ? 'Edit RBAC User Account' : 'Provision New Operator Account'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Display Name *</label>
              <input
                type="text"
                required
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="e.g. Dr. Maya Lin"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="maya.lin@enterprise.gov"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Clearance Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="Executive / Operator">Executive / Operator</option>
                <option value="Security Lead">Security Lead</option>
                <option value="Cryptographic Engineer">Cryptographic Engineer</option>
                <option value="Platform Architect">Platform Architect</option>
                <option value="Governance Officer">Governance Officer</option>
                <option value="Auditor (Read-Only)">Auditor (Read-Only)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="active">Active</option>
                <option value="invited">Invited</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.mfa_enabled}
                  onChange={(e) => setFormData({ ...formData, mfa_enabled: e.target.checked })}
                  className="rounded border-slate-300 text-black focus:ring-slate-900"
                />
                <span>Hardware MFA (FIDO2) Enforced</span>
              </label>
            </div>
          </div>

          {/* RBAC Scopes builder */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-700">RBAC Clearance Scopes</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={scopeInput}
                onChange={(e) => setScopeInput(e.target.value)}
                placeholder="e.g. quantum:deploy, kms:read"
                className="flex-1 text-xs px-3 py-1.5 border border-slate-200 rounded-xl font-mono"
              />
              <button
                type="button"
                onClick={handleAddScope}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl"
              >
                Add Scope
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
              {formData.scopes.map((scope) => (
                <span
                  key={scope}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[11px] font-mono text-slate-700"
                >
                  {scope}
                  <button
                    type="button"
                    onClick={() => handleRemoveScope(scope)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-shimmer btn-shimmer-dark px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-colors active:scale-[0.98]"
            >
              Save User Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 5. CMS ARTICLE & CONTENT EDITOR
export const CMSArticleEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  article?: CMSContentItem | null;
  onSave: (article: CMSContentItem) => void;
}> = ({ isOpen, onClose, article, onSave }) => {
  const [formData, setFormData] = useState<CMSContentItem & { content?: string }>({
    id: draftId('cms'),
    title: '',
    slug: '',
    locale: 'en-US',
    status: 'Draft',
    last_updated: '2026-08-19',
    author: 'Dr. Victor Danilov',
    seo_score: 95,
    content: `# Post-Quantum Migration Whitepaper\n\n## Executive Summary\nFIPS 203 (ML-KEM) and FIPS 204 (ML-DSA) represent standard benchmarks for post-quantum defense.`,
  });

  useEffect(() => {
    if (article) {
      setFormData({
        ...article,
        content:
          (article as any).content ||
          `# ${article.title}\n\nAuthoritative documentation and publication draft.`,
      });
    } else {
      setFormData({
        id: draftId('cms'),
        title: '',
        slug: '',
        locale: 'en-US',
        status: 'Draft',
        last_updated: '2026-08-19',
        author: 'Dr. Victor Danilov',
        seo_score: 95,
        content: `# New Quantum Security Advisory\n\n## Overview\nProvide technical advisory and compliance specifications here.`,
      });
    }
  }, [article, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    const finalSlug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    onSave({ ...formData, slug: finalSlug });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-800" />
            <h3 className="font-bold text-sm text-slate-900">
              {article ? 'CMS Content & Publishing Editor' : 'Create Technical Content / Advisory'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Article Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. NIST FIPS 203/204 Post-Quantum Cryptography Migration Guide"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">URL Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="pqc-migration-guide"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-600"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Locale</label>
              <select
                value={formData.locale}
                onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="en-US">en-US (English)</option>
                <option value="id-ID">id-ID (Indonesian)</option>
                <option value="ja-JP">ja-JP (Japanese)</option>
                <option value="de-DE">de-DE (German)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Publication Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="Draft">Draft</option>
                <option value="In Review">In Review</option>
                <option value="Published">Published</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Authoritative Markdown / HTML Body</label>
            <textarea
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full text-xs font-mono p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">SEO Score (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.seo_score}
                onChange={(e) => setFormData({ ...formData, seo_score: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-shimmer btn-shimmer-dark px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-colors active:scale-[0.98]"
            >
              Publish / Save Content
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 6. PRICING PLAN EDITOR MODAL (Multi-User, Per-Seat, Add-Ons & Billing Models)
export const PricingPlanEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  plan?: ProductPlanPricing | null;
  onSave: (plan: ProductPlanPricing) => void;
}> = ({ isOpen, onClose, plan, onSave }) => {
  const [formData, setFormData] = useState<ProductPlanPricing>({
    id: draftId('pln'),
    product_code: 'Q_SHIELD_LATTICE',
    plan_code: 'PQC_ENT_MAX',
    display_name: 'Enterprise Quantum Sovereign (Multi-User)',
    currency: 'USD',
    monthly_amount_minor: 450000,
    annual_amount_minor: 4500000,
    active: true,
    version: 'v4.2.0',
    features_count: 48,
    tier: 'Enterprise',
    billing_model: 'per_user_monthly',
    price_per_user_monthly: 450,
    price_per_user_annual: 4500,
    included_seats: 50,
    max_seats: 500,
    unit_name: 'Licensed Operators / Seats',
    supported_addons: ['ADDON_DEDICATED_HSM', 'ADDON_SEAT_PACK_10', 'ADDON_SOC2_EVIDENCE', 'ADDON_REDTEAM_SIM', 'ADDON_HIGH_THROUGHPUT'],
    annual_discount_pct: 18,
    description: 'Comprehensive post-quantum sovereign protection with full multi-seat orchestration, dedicated HSM compatibility, and custom SLA.',
  });

  useEffect(() => {
    if (plan) {
      setFormData(plan);
    }
  }, [plan, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.display_name.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">
              {plan ? 'Edit Commercial Pricing Plan & Seat Packaging' : 'Create Multi-User Pricing Plan'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Plan Display Name *</label>
            <input
              type="text"
              required
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              placeholder="e.g. Enterprise Quantum Sovereign (Multi-Seat)"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Product Code</label>
              <input
                type="text"
                value={formData.product_code}
                onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Plan Code</label>
              <input
                type="text"
                value={formData.plan_code}
                onChange={(e) => setFormData({ ...formData, plan_code: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Tier</label>
              <select
                value={formData.tier}
                onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-xl"
              >
                <option value="Enterprise">Enterprise Tier</option>
                <option value="Scale">Scale Tier</option>
                <option value="Growth">Growth Tier</option>
                <option value="Starter">Starter Tier</option>
              </select>
            </div>
          </div>

          {/* Pricing Model & Multi-User Seat Configuration */}
          <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                Billing Scheme &amp; Multi-User Seat Unit
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600">
                Seat / User Model
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Billing Model Scheme</label>
                <select
                  value={formData.billing_model}
                  onChange={(e) => setFormData({ ...formData, billing_model: e.target.value as any })}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-medium"
                >
                  <option value="per_user_monthly">Per User / Bulan ($/seat/mo)</option>
                  <option value="per_user_annual">Per User / Tahunan ($/seat/yr)</option>
                  <option value="flat_monthly">Flat Enterprise Monthly</option>
                  <option value="flat_annual">Flat Enterprise Annual</option>
                  <option value="unit_usage_monthly">Metered Usage Units / Bulan</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Licensing Unit Name</label>
                <input
                  type="text"
                  value={formData.unit_name || 'Licensed Operators / Seats'}
                  onChange={(e) => setFormData({ ...formData, unit_name: e.target.value })}
                  placeholder="e.g. Licensed Operators / Seats"
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            {/* Per-User Rates */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Rate / User / Bulan ($)</label>
                <input
                  type="number"
                  value={formData.price_per_user_monthly || 0}
                  onChange={(e) => setFormData({ ...formData, price_per_user_monthly: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-slate-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Rate / User / Tahun ($)</label>
                <input
                  type="number"
                  value={formData.price_per_user_annual || 0}
                  onChange={(e) => setFormData({ ...formData, price_per_user_annual: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-emerald-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Annual Discount (%)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.annual_discount_pct || 18}
                  onChange={(e) => setFormData({ ...formData, annual_discount_pct: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* Base Seats Included & Max Quota */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Included Base Seats</label>
                <input
                  type="number"
                  min="1"
                  value={formData.included_seats || 10}
                  onChange={(e) => setFormData({ ...formData, included_seats: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Max Seat Hard Limit</label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_seats || 500}
                  onChange={(e) => setFormData({ ...formData, max_seats: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Base Monthly Amount Minor ($ Cents)</label>
              <input
                type="number"
                value={formData.monthly_amount_minor}
                onChange={(e) => setFormData({ ...formData, monthly_amount_minor: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
              <span className="text-[10px] text-slate-400 block">
                = ${(formData.monthly_amount_minor / 100).toLocaleString()} / month
              </span>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Features Count</label>
              <input
                type="number"
                value={formData.features_count}
                onChange={(e) => setFormData({ ...formData, features_count: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Plan Description</label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Describe target market, cryptographic capabilities, and multi-user quota constraints..."
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-shimmer btn-shimmer-dark px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-colors active:scale-[0.98]"
            >
              Save Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 6B. PRODUCT DEFINITION EDITOR MODAL
export const ProductEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  product?: ProductDefinitionItem | null;
  onSave: (product: ProductDefinitionItem) => void;
}> = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState<ProductDefinitionItem>({
    id: draftId('prod'),
    name: '',
    code: 'Q_SHIELD_PRO',
    category: 'Cryptography & Enclave',
    description: '',
    features: [
      'NIST FIPS 203 ML-KEM Support',
      'Multi-User Team Clearance & RBAC',
      'Zero-Downtime Key Rotation',
    ],
    features_count: 24,
    active_plans: 3,
    entitlements_count: 45,
    status: 'GA',
    lead: 'Dr. Victor Danilov',
    sla_target: '99.999%',
    supported_addons: ['ADDON_DEDICATED_HSM', 'ADDON_SEAT_PACK_10', 'ADDON_SOC2_EVIDENCE'],
    supported_billing_models: ['per_user_monthly', 'per_user_annual', 'flat_monthly'],
    price_range_display: 'From $95 / user / mo or $950 / user / yr',
    created_at: new Date().toISOString().split('T')[0],
  });

  const [featureTagInput, setFeatureTagInput] = useState('');

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        id: draftId('prod'),
        name: '',
        code: 'Q_SHIELD_PRO',
        category: 'Cryptography & Enclave',
        description: '',
        features: [
          'NIST FIPS 203 ML-KEM Support',
          'Multi-User Team Clearance & RBAC',
          'Zero-Downtime Key Rotation',
        ],
        features_count: 24,
        active_plans: 3,
        entitlements_count: 45,
        status: 'GA',
        lead: 'Dr. Victor Danilov',
        sla_target: '99.999%',
        supported_addons: ['ADDON_DEDICATED_HSM', 'ADDON_SEAT_PACK_10', 'ADDON_SOC2_EVIDENCE'],
        supported_billing_models: ['per_user_monthly', 'per_user_annual', 'flat_monthly'],
        price_range_display: 'From $95 / user / mo or $950 / user / yr',
        created_at: new Date().toISOString().split('T')[0],
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (!featureTagInput.trim()) return;
    setFormData({
      ...formData,
      features: [...formData.features, featureTagInput.trim()],
      features_count: formData.features_count + 1,
    });
    setFeatureTagInput('');
  };

  const handleRemoveFeature = (index: number) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updated, features_count: Math.max(1, updated.length) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">
              {product ? 'Edit Cryptographic Product' : 'Add New Product & Specifications'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Q-Shield Post-Quantum Mesh"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Product Code (ID) *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                placeholder="e.g. Q_SHIELD_MESH"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-xl"
              >
                <option value="Cryptography & Enclave">Cryptography &amp; Enclave</option>
                <option value="Network & TLS Mesh">Network &amp; TLS Mesh</option>
                <option value="Discovery & CBOM">Discovery &amp; CBOM</option>
                <option value="Identity & Zero Trust">Identity &amp; Zero Trust</option>
                <option value="Hardware Security">Hardware Security</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Lifecycle Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-xl"
              >
                <option value="GA">General Availability (GA)</option>
                <option value="Beta">Public Beta</option>
                <option value="Deprecated">Deprecated</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">SLA Commitment</label>
              <input
                type="text"
                value={formData.sla_target}
                onChange={(e) => setFormData({ ...formData, sla_target: e.target.value })}
                placeholder="99.999%"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Description &amp; Overview</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Cryptographic capabilities, target security posture, and architecture..."
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Product Technical Lead</label>
              <input
                type="text"
                value={formData.lead}
                onChange={(e) => setFormData({ ...formData, lead: e.target.value })}
                placeholder="e.g. Dr. Victor Danilov"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Price Display Range</label>
              <input
                type="text"
                value={formData.price_range_display}
                onChange={(e) => setFormData({ ...formData, price_range_display: e.target.value })}
                placeholder="From $95 / user / mo or $950 / user / yr"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Features Builder */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Included Product Features &amp; Standards</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={featureTagInput}
                onChange={(e) => setFeatureTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="e.g. Multi-User Team Clearance & RBAC (Press Enter)"
                className="flex-1 text-xs px-3 py-1.5 border border-slate-200 rounded-xl"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Add Tag
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.features.map((feat, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium border border-slate-200/80"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-shimmer btn-shimmer-dark px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-colors active:scale-[0.98]"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 6C. ADD-ON CREATOR & EDITOR MODAL (Add-Ons Scheme)
export const AddOnEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  addOn?: ProductAddOn | null;
  onSave: (addon: ProductAddOn) => void;
}> = ({ isOpen, onClose, addOn, onSave }) => {
  const [formData, setFormData] = useState<ProductAddOn>({
    id: draftId('addon'),
    code: 'ADDON_CUSTOM_PACK',
    name: 'Multi-User Operator Expansion Pack (+10 Seats)',
    category: 'Seat Booster',
    description: 'Add extra user seat capacity to client tenant accounts with granular role scoping.',
    pricing_model: 'per_user_monthly',
    price_monthly: 45,
    price_annual: 450,
    unit_label: 'per user / month (or $450/yr)',
    min_quantity: 1,
    max_quantity: 100,
    compatible_products: ['Q_SHIELD_LATTICE', 'CBOM_SCANNER_AI', 'QKD_MESH_CTRL'],
    active: true,
    features_included: ['+10 Active Clearance Seats', 'Dedicated Audit Export Rights'],
  });

  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    if (addOn) {
      setFormData(addOn);
    }
  }, [addOn, isOpen]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFormData({
      ...formData,
      features_included: [...formData.features_included, featureInput.trim()],
    });
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData({
      ...formData,
      features_included: formData.features_included.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900">
              {addOn ? 'Edit Product Add-On Scheme' : 'Add New Product Add-On Scheme'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Add-On Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dedicated FIPS 140-3 HSM Cloud Cluster"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Add-On Code *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                placeholder="ADDON_CODE"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-xl"
              >
                <option value="Seat Booster">Seat Booster (Multi-User Expansion)</option>
                <option value="HSM & Hardware">HSM &amp; Hardware</option>
                <option value="Compliance & Audit">Compliance &amp; Audit</option>
                <option value="Threat Simulation">Threat Simulation</option>
                <option value="High-Bandwidth">High-Bandwidth</option>
                <option value="Storage & Vault">Storage &amp; Vault</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="What functionality or capacity does this Add-On unlock?"
            />
          </div>

          {/* Pricing Scheme for Add-On */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <span className="text-xs font-bold text-slate-900 block">Add-On Pricing Scheme</span>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Pricing Model</label>
                <select
                  value={formData.pricing_model}
                  onChange={(e) => setFormData({ ...formData, pricing_model: e.target.value as any })}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
                >
                  <option value="per_user_monthly">Per User / Bulan ($/seat/mo)</option>
                  <option value="per_user_annual">Per User / Tahunan ($/seat/yr)</option>
                  <option value="flat_monthly">Flat Monthly per Tenant</option>
                  <option value="flat_annual">Flat Annual per Tenant</option>
                  <option value="per_unit">Per Usage Unit Pack</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Unit Label</label>
                <input
                  type="text"
                  value={formData.unit_label}
                  onChange={(e) => setFormData({ ...formData, unit_label: e.target.value })}
                  placeholder="e.g. per 10 seats pack / mo"
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Monthly Price ($ USD)</label>
                <input
                  type="number"
                  value={formData.price_monthly}
                  onChange={(e) => setFormData({ ...formData, price_monthly: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Annual Price ($ USD Discounted)</label>
                <input
                  type="number"
                  value={formData.price_annual}
                  onChange={(e) => setFormData({ ...formData, price_annual: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-emerald-700"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-shimmer btn-shimmer-dark px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-colors active:scale-[0.98]"
            >
              Save Add-On
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 6D. CLIENT TENANT USER MODAL (With Seat Quota Limit Protection)
export const ClientUserModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  user?: ClientTenantUser | null;
  customers: CustomerProfile[];
  onSave: (user: ClientTenantUser) => void;
  onUpgradeSeats: (tenantId: string) => void;
}> = ({ isOpen, onClose, user, customers, onSave, onUpgradeSeats }) => {
  const [formData, setFormData] = useState<ClientTenantUser>({
    id: draftId('cl_user'),
    tenant_id: customers[0]?.tenant_id || 'cust_apex_901',
    tenant_name: customers[0]?.display_name || 'Apex Global Financial',
    name: '',
    email: '',
    role: 'Developer',
    status: 'active',
    seat_assigned: true,
    mfa_enforced: true,
    joined_at: new Date().toISOString().split('T')[0],
    last_active: 'Just now',
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      const firstCust = customers[0];
      setFormData({
        id: draftId('cl_user'),
        tenant_id: firstCust?.tenant_id || 'cust_apex_901',
        tenant_name: firstCust?.display_name || 'Apex Global Financial',
        name: '',
        email: '',
        role: 'Developer',
        status: 'active',
        seat_assigned: true,
        mfa_enforced: true,
        joined_at: new Date().toISOString().split('T')[0],
        last_active: 'Just now',
      });
    }
  }, [user, isOpen, customers]);

  if (!isOpen) return null;

  const currentTenant = customers.find((c) => c.tenant_id === formData.tenant_id);
  const seatsAllocated = currentTenant?.seats_allocated || 10;
  const seatsUsed = currentTenant?.seats_used || 0;
  const isOverQuota = !user && seatsUsed >= seatsAllocated;

  const handleTenantChange = (tenantId: string) => {
    const cust = customers.find((c) => c.tenant_id === tenantId);
    setFormData({
      ...formData,
      tenant_id: tenantId,
      tenant_name: cust?.display_name || tenantId,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    
    // If over quota and user wants active seat, force seat_locked status unless overridden
    const finalUser = {
      ...formData,
      status: isOverQuota && formData.status === 'active' ? ('seat_locked' as const) : formData.status,
      seat_assigned: !(isOverQuota && formData.status === 'active'),
    };

    onSave(finalUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">
              {user ? 'Edit Client Account Team Member' : 'Add Team Member to Client Account'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Tenant Selector & Seat Capacity Bar */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Client Tenant Account *</label>
            <select
              value={formData.tenant_id}
              onChange={(e) => handleTenantChange(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {customers.map((c) => (
                <option key={c.tenant_id} value={c.tenant_id}>
                  {c.display_name} ({c.seats_used}/{c.seats_allocated} seats used)
                </option>
              ))}
            </select>
          </div>

          {/* Seat Limit Warning / Status banner */}
          {isOverQuota ? (
            <div className="p-3.5 bg-rose-50 border border-rose-500/30 rounded-xl space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-rose-900 block">Seat License Quota Reached!</span>
                  <p className="text-rose-700 text-[11px] mt-0.5">
                    Tenant <strong>{currentTenant?.display_name}</strong> is at max capacity ({seatsUsed}/{seatsAllocated} seats). New users cannot access cryptographic workloads until seat capacity is expanded.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onUpgradeSeats(formData.tenant_id);
                }}
                className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add +10 Multi-User Booster Pack</span>
              </button>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50/70 border border-emerald-500/30 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-900 font-medium">
                  Seat License Available ({seatsAllocated - seatsUsed} remaining)
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-700">
                {seatsUsed} / {seatsAllocated} Allocated
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">User Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Maria Santos"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Corporate Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@clientcompany.com"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Role &amp; Permissions</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-xl"
              >
                <option value="Tenant Admin">Tenant Admin (Full Control)</option>
                <option value="Crypto Security Officer">Crypto Security Officer</option>
                <option value="Platform Engineer">Platform Engineer</option>
                <option value="Developer">Developer</option>
                <option value="Audit Reader">Audit Reader (SOC-2 Access)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">License Seat Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-xl"
              >
                <option value="active">Active (Seat Assigned)</option>
                <option value="seat_locked">Seat Locked (Over Limit)</option>
                <option value="invited">Invited (Pending Confirmation)</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="mfa_chk"
              checked={formData.mfa_enforced}
              onChange={(e) => setFormData({ ...formData, mfa_enforced: e.target.checked })}
              className="rounded text-black focus:ring-slate-900"
            />
            <label htmlFor="mfa_chk" className="text-xs text-slate-700 font-medium cursor-pointer">
              Enforce Hardware FIDO2 / PQC Multi-Factor Authentication
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-shimmer btn-shimmer-dark px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-colors active:scale-[0.98]"
            >
              {isOverQuota ? 'Save (Seat Locked)' : 'Assign Seat & Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 6E. TENANT SEAT & ADD-ON UPGRADE MODAL
export const ClientSeatUpgradeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
  customers: CustomerProfile[];
  addOns: ProductAddOn[];
  onApplyUpgrade: (tenantId: string, additionalSeats: number, selectedAddOnCode?: string) => void;
}> = ({ isOpen, onClose, tenantId, customers, addOns, onApplyUpgrade }) => {
  const current = customers.find((c) => c.tenant_id === tenantId) || customers[0];
  const [selectedSeatPack, setSelectedSeatPack] = useState<number>(10);
  const [selectedAddOn, setSelectedAddOn] = useState<string>('ADDON_SEAT_PACK_10');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  if (!isOpen || !current) return null;

  const handleConfirm = () => {
    onApplyUpgrade(current.tenant_id, selectedSeatPack, selectedAddOn);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Upgrade Multi-User Capacity: {current.display_name}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Current Seat Allocation:</span>
              <span className="font-bold text-slate-900">
                {current.seats_used} / {current.seats_allocated} Seats
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Current Base Plan:</span>
              <span className="font-mono text-slate-800 font-semibold">{current.plan}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-800 block">Select Seat Expansion Package</label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { seats: 5, priceMo: 200, priceYr: 2000, label: '+5 Seats Pack' },
                { seats: 10, priceMo: 380, priceYr: 3800, label: '+10 Seats Pack (Popular)' },
                { seats: 25, priceMo: 850, priceYr: 8500, label: '+25 Seats Pack' },
              ].map((pack) => (
                <button
                  key={pack.seats}
                  type="button"
                  onClick={() => setSelectedSeatPack(pack.seats)}
                  className={`p-3 text-left rounded-xl border transition cursor-pointer ${
                    selectedSeatPack === pack.seats
                      ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="block text-xs font-bold text-slate-900">{pack.label}</span>
                  <span className="block text-[11px] font-mono text-blue-600 font-bold mt-1">
                    ${billingCycle === 'annual' ? pack.priceYr : pack.priceMo}
                    <span className="text-[9px] text-slate-400 font-normal">
                      /{billingCycle === 'annual' ? 'yr' : 'mo'}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-800 block">Attach Add-On Scheme (Optional)</label>
            <select
              value={selectedAddOn}
              onChange={(e) => setSelectedAddOn(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
            >
              <option value="">None (Seats only)</option>
              {addOns.map((add) => (
                <option key={add.id} value={add.code}>
                  {add.name} (${add.price_monthly}/mo)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs">
            <div>
              <span className="font-semibold text-blue-950 block">New Total Capacity:</span>
              <span className="text-blue-700 text-[11px]">
                {current.seats_allocated + selectedSeatPack} Allocated Seats
              </span>
            </div>
            <span className="text-base font-black text-blue-900 font-mono">
              +${selectedSeatPack * (billingCycle === 'annual' ? 380 : 40)}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="btn-shimmer btn-shimmer-dark px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-colors active:scale-[0.98]"
            >
              Confirm Capacity Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 7. DATA MIGRATION PLAN MODAL
export const DataMigrationEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  migration?: DataMigrationPlan | null;
  onSave: (migration: DataMigrationPlan) => void;
}> = ({ isOpen, onClose, migration, onSave }) => {
  const [formData, setFormData] = useState<DataMigrationPlan>({
    plan_key: `MIG-${draftId('')}`,
    dataset: 'Customer Payment Vaults',
    current_algorithm: 'RSA-4096 / AES-GCM-256',
    target_algorithm: 'ML-KEM-768 (FIPS 203)',
    records_total: 1240000,
    records_migrated: 980000,
    state: 'In Progress',
    approved_by: 'Dr. Victor Danilov (Q-Clearance)',
    eta: 'Oct 2026',
  });

  useEffect(() => {
    if (migration) {
      setFormData(migration);
    }
  }, [migration, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <h3 className="font-bold text-sm text-slate-900">
            {migration ? 'Edit Post-Quantum Migration Pipeline' : 'Initiate Migration Pipeline'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Dataset Name *</label>
            <input
              type="text"
              required
              value={formData.dataset}
              onChange={(e) => setFormData({ ...formData, dataset: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Current Cryptographic Suite</label>
              <input
                type="text"
                value={formData.current_algorithm}
                onChange={(e) => setFormData({ ...formData, current_algorithm: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Target PQC Suite</label>
              <select
                value={formData.target_algorithm}
                onChange={(e) => setFormData({ ...formData, target_algorithm: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono"
              >
                <option value="ML-KEM-768 (FIPS 203)">ML-KEM-768 (FIPS 203)</option>
                <option value="ML-KEM-1024 (FIPS 203)">ML-KEM-1024 (FIPS 203)</option>
                <option value="ML-DSA-65 (FIPS 204)">ML-DSA-65 (FIPS 204)</option>
                <option value="Falcon-512 (FIPS 206)">Falcon-512 (FIPS 206)</option>
                <option value="LMS / XMSS (NIST SP 800-208)">LMS / XMSS (NIST SP 800-208)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Total Records</label>
              <input
                type="number"
                value={formData.records_total}
                onChange={(e) => setFormData({ ...formData, records_total: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Migrated Records</label>
              <input
                type="number"
                value={formData.records_migrated}
                onChange={(e) => setFormData({ ...formData, records_migrated: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">State</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Blocked">Blocked</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Target ETA</label>
              <input
                type="text"
                value={formData.eta}
                onChange={(e) => setFormData({ ...formData, eta: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-shimmer btn-shimmer-dark px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-colors active:scale-[0.98]"
            >
              Save Pipeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 8. SALES OPPORTUNITY MODAL
export const SalesOpportunityEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  opportunity?: SalesOpportunity | null;
  onSave: (deal: SalesOpportunity) => void;
}> = ({ isOpen, onClose, opportunity, onSave }) => {
  const [formData, setFormData] = useState<SalesOpportunity>({
    id: `opp-${draftId('')}`,
    account_name: '',
    stage: 'Discovery',
    amount: 150000,
    probability_pct: 40,
    expected_close_at: '2026-11-30',
    owner: 'Elena Rostova',
    plan: 'Enterprise Sovereign Shield',
  });

  useEffect(() => {
    if (opportunity) {
      setFormData(opportunity);
    }
  }, [opportunity, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.account_name.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <h3 className="font-bold text-sm text-slate-900">
            {opportunity ? 'Edit Sales Opportunity' : 'Create Sales Opportunity'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Account / Prospect Name *</label>
            <input
              type="text"
              required
              value={formData.account_name}
              onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Deal Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              >
                <option value="Discovery">Discovery</option>
                <option value="Proposal">Proposal</option>
                <option value="Security Review">Security Review</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed Won">Closed Won</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">ARR Amount ($ USD)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Win Probability (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.probability_pct}
                onChange={(e) => setFormData({ ...formData, probability_pct: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Expected Close Date</label>
              <input
                type="date"
                value={formData.expected_close_at}
                onChange={(e) => setFormData({ ...formData, expected_close_at: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-shimmer btn-shimmer-dark px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-colors active:scale-[0.98]"
            >
              Save Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 9. WORK ITEM EDITOR MODAL
export const WorkItemEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  workItem?: RoleWorkItem | null;
  onSave: (item: RoleWorkItem) => void;
}> = ({ isOpen, onClose, workItem, onSave }) => {
  const [formData, setFormData] = useState<RoleWorkItem>({
    id: `WRK-${draftId('')}`,
    status: 'Pending',
    title: '',
    domain: 'Security',
    priority: 'High',
    created_at: '2026-08-19',
    due_date: '2026-08-25',
  });

  useEffect(() => {
    if (workItem) {
      setFormData(workItem);
    }
  }, [workItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <h3 className="font-bold text-sm text-slate-900">
            {workItem ? 'Edit Work Queue Item' : 'Create Internal Work Item'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Work Item Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Domain</label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              >
                <option value="Security">Security</option>
                <option value="Engineering">Engineering</option>
                <option value="Commercial">Commercial</option>
                <option value="Governance">Governance</option>
                <option value="Platform">Platform</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Blocked">Blocked</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Due Date</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-shimmer btn-shimmer-dark px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-colors active:scale-[0.98]"
            >
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 10. CMS PAGE EDITOR MODAL (Full Website Page Management)
export const CMSPageEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  page?: CMSPageItem | null;
  onSave: (page: CMSPageItem) => void;
}> = ({ isOpen, onClose, page, onSave }) => {
  const [formData, setFormData] = useState<CMSPageItem>({
    id: draftId('page'),
    title: '',
    slug: '',
    path: '/',
    category: 'Product & Solution',
    template: 'Product Deep Dive',
    meta_title: '',
    meta_description: '',
    og_image: 'https://cdn.quantumshield.io/assets/og-default.png',
    status: 'Draft',
    locale: 'en-US',
    section_blocks: ['blk-hero-main', 'blk-features-matrix', 'blk-trust-marquee', 'blk-lead-capture'],
    seo_score: 95,
    visits_30d: 0,
    conversion_rate_pct: 0,
    last_published_at: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    author: 'Dr. Victor Danilov',
  });

  const [newBlockInput, setNewBlockInput] = useState('');

  useEffect(() => {
    if (page) {
      setFormData(page);
    } else {
      setFormData({
        id: draftId('page'),
        title: '',
        slug: '',
        path: '/solutions/new-offering',
        category: 'Product & Solution',
        template: 'Product Deep Dive',
        meta_title: '',
        meta_description: '',
        og_image: 'https://cdn.quantumshield.io/assets/og-default.png',
        status: 'Draft',
        locale: 'en-US',
        section_blocks: ['blk-hero-main', 'blk-features-matrix', 'blk-trust-marquee', 'blk-lead-capture'],
        seo_score: 95,
        visits_30d: 0,
        conversion_rate_pct: 0,
        last_published_at: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
        author: 'Dr. Victor Danilov',
      });
    }
  }, [page, isOpen]);

  if (!isOpen) return null;

  const handleAddBlock = () => {
    if (!newBlockInput.trim()) return;
    if (!formData.section_blocks.includes(newBlockInput.trim())) {
      setFormData({
        ...formData,
        section_blocks: [...formData.section_blocks, newBlockInput.trim()],
      });
    }
    setNewBlockInput('');
  };

  const handleRemoveBlock = (blockId: string) => {
    setFormData({
      ...formData,
      section_blocks: formData.section_blocks.filter((b) => b !== blockId),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.path.trim()) return;
    const finalSlug = formData.slug || formData.path.replace(/^\//, '').replace(/\//g, '-') || 'home';
    const finalMetaTitle = formData.meta_title || `${formData.title} | QuantumShield Sovereign Cryptography`;
    onSave({ ...formData, slug: finalSlug, meta_title: finalMetaTitle });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">
              {page ? 'Edit Main Website Page Architecture' : 'Create New Website Page'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[78vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Page Internal Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Critical Infrastructure & Power Grid PQC Solution"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Route Path URL *</label>
              <input
                type="text"
                required
                value={formData.path}
                onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                placeholder="/solutions/critical-infra"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono text-blue-600 font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Site Section / Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-xl"
              >
                <option value="Core Landing">Core Landing</option>
                <option value="Product & Solution">Product &amp; Solution</option>
                <option value="Technology & Standards">Technology &amp; Standards</option>
                <option value="Trust & Compliance">Trust &amp; Compliance</option>
                <option value="Resources & Docs">Resources &amp; Docs</option>
                <option value="Company & Legal">Company &amp; Legal</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Layout Template</label>
              <select
                value={formData.template}
                onChange={(e) => setFormData({ ...formData, template: e.target.value as any })}
                className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-xl"
              >
                <option value="Landing Hero + Grid">Landing Hero + Grid</option>
                <option value="Product Deep Dive">Product Deep Dive</option>
                <option value="Solutions Matrix">Solutions Matrix</option>
                <option value="Pricing & Calculator">Pricing &amp; Calculator</option>
                <option value="Trust Center">Trust Center</option>
                <option value="Documentation / Article">Documentation / Article</option>
                <option value="Contact & Lead Form">Contact &amp; Lead Form</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-xl"
              >
                <option value="Published">Published (Live On CDN)</option>
                <option value="Staged">Staged (Preview Only)</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          {/* SEO & Social Metadata */}
          <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-slate-900 block">SEO, OpenGraph &amp; Social Previews</span>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Meta Title (Browser Tab &amp; Google)</label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="Quantum-Safe Defense Cryptography | QuantumShield"
                className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-700">Meta Description (140-160 chars)</label>
              <textarea
                rows={2}
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                placeholder="Protect vital operational networks with NIST FIPS 203 ML-KEM lattice key encapsulation..."
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">OG Preview Image URL</label>
                <input
                  type="text"
                  value={formData.og_image}
                  onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-slate-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">SEO Target Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.seo_score}
                  onChange={(e) => setFormData({ ...formData, seo_score: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono font-bold text-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* Section Blocks attached */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-800 block">Attached Modular Section Blocks</label>
            <div className="flex gap-2">
              <select
                value={newBlockInput}
                onChange={(e) => setNewBlockInput(e.target.value)}
                className="flex-1 text-xs px-3 py-1.5 border border-slate-200 rounded-xl"
              >
                <option value="">Select block to attach...</option>
                <option value="blk-hero-main">Main Hero Banner (blk-hero-main)</option>
                <option value="blk-terminal-demo">Terminal Code Demo (blk-terminal-demo)</option>
                <option value="blk-features-matrix">Features Grid (blk-features-matrix)</option>
                <option value="blk-algo-benchmarks">NIST Benchmarks Matrix (blk-algo-benchmarks)</option>
                <option value="blk-trust-marquee">Sovereign Trust Marquee (blk-trust-marquee)</option>
                <option value="blk-pricing-preview">Seat Pricing Matrix (blk-pricing-preview)</option>
                <option value="blk-lead-capture">Lead Assessment Form (blk-lead-capture)</option>
                <option value="blk-faq-main">FAQ Accordion (blk-faq-main)</option>
              </select>
              <button
                type="button"
                onClick={handleAddBlock}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl"
              >
                Attach Block
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              {formData.section_blocks.map((blk) => (
                <span
                  key={blk}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-mono text-slate-800 font-semibold"
                >
                  <Package className="w-3 h-3 text-blue-600" />
                  {blk}
                  <button
                    type="button"
                    onClick={() => handleRemoveBlock(blk)}
                    className="text-slate-400 hover:text-rose-600 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-shimmer btn-shimmer-dark px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-colors active:scale-[0.98]"
            >
              Save &amp; Deploy Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 11. CMS SECTION BLOCK EDITOR MODAL
export const CMSBlockEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  block?: CMSSectionBlock | null;
  onSave: (block: CMSSectionBlock) => void;
}> = ({ isOpen, onClose, block, onSave }) => {
  const [formData, setFormData] = useState<CMSSectionBlock>({
    id: draftId('blk'),
    name: '',
    block_type: 'Hero Banner',
    heading: '',
    subheading: '',
    badge_text: 'POST-QUANTUM STANDARD',
    cta_primary_label: 'Get Started',
    cta_primary_link: '/products/q-shield',
    attached_pages_count: 1,
    status: 'Active',
    last_modified: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (block) {
      setFormData(block);
    } else {
      setFormData({
        id: draftId('blk'),
        name: '',
        block_type: 'Hero Banner',
        heading: '',
        subheading: '',
        badge_text: 'POST-QUANTUM STANDARD',
        cta_primary_label: 'Get Started',
        cta_primary_link: '/products/q-shield',
        attached_pages_count: 1,
        status: 'Active',
        last_modified: new Date().toISOString().split('T')[0],
      });
    }
  }, [block, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.heading.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">
              {block ? 'Edit Visual Section Block' : 'Create Reusable Section Block'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Block Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Enterprise Hero Banner with Lattice Background"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Block Type</label>
              <select
                value={formData.block_type}
                onChange={(e) => setFormData({ ...formData, block_type: e.target.value as any })}
                className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-xl"
              >
                <option value="Hero Banner">Hero Banner</option>
                <option value="Feature Grid">Feature Grid</option>
                <option value="Terminal Code Demo">Terminal Code Demo</option>
                <option value="Customer Logos & Trust">Customer Logos &amp; Trust</option>
                <option value="Algorithm Benchmark Matrix">Algorithm Benchmark Matrix</option>
                <option value="Pricing Configurator">Pricing Configurator</option>
                <option value="Testimonials">Testimonials</option>
                <option value="FAQ Accordion">FAQ Accordion</option>
                <option value="Lead Capture Form">Lead Capture Form</option>
                <option value="CTA Ribbon">CTA Ribbon</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-xl"
              >
                <option value="Active">Active (In Production)</option>
                <option value="Draft">Draft</option>
                <option value="A/B Testing">A/B Testing Variant</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Section Eyebrow / Badge Text</label>
            <input
              type="text"
              value={formData.badge_text || ''}
              onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
              placeholder="e.g. NIST FIPS 203 OFFICIAL COMPLIANT"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono text-blue-600 font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Main Heading Text *</label>
            <input
              type="text"
              required
              value={formData.heading}
              onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
              placeholder="e.g. Sovereign Post-Quantum Cryptography For Global Infrastructure"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Subheading / Body Description</label>
            <textarea
              rows={3}
              value={formData.subheading}
              onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
              placeholder="Describe what the block communicates to technical leaders and enterprise customers..."
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Primary CTA Button Label</label>
              <input
                type="text"
                value={formData.cta_primary_label || ''}
                onChange={(e) => setFormData({ ...formData, cta_primary_label: e.target.value })}
                placeholder="e.g. Book Architecture Briefing"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">CTA Target Link</label>
              <input
                type="text"
                value={formData.cta_primary_link || ''}
                onChange={(e) => setFormData({ ...formData, cta_primary_link: e.target.value })}
                placeholder="/contact or /products/q-shield"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-shimmer btn-shimmer-dark px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-colors active:scale-[0.98]"
            >
              Save Block
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 12. CMS NAVIGATION & MENU EDITOR MODAL
export const CMSNavEditorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  navItem?: CMSNavigationItem | null;
  onSave: (navItem: CMSNavigationItem) => void;
}> = ({ isOpen, onClose, navItem, onSave }) => {
  const [formData, setFormData] = useState<CMSNavigationItem>({
    id: draftId('nav'),
    location: 'Header Top Bar',
    label: '',
    url: '/',
    badge: '',
    is_external: false,
    order_index: 1,
    active: true,
  });

  useEffect(() => {
    if (navItem) {
      setFormData(navItem);
    } else {
      setFormData({
        id: draftId('nav'),
        location: 'Header Top Bar',
        label: '',
        url: '/',
        badge: '',
        is_external: false,
        order_index: 1,
        active: true,
      });
    }
  }, [navItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim() || !formData.url.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">
              {navItem ? 'Edit Navigation Link' : 'Add Navigation Menu Link'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Menu Location</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value as any })}
              className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-xl"
            >
              <option value="Header Top Bar">Header Top Bar</option>
              <option value="Header Mega Menu">Header Mega Menu</option>
              <option value="Footer Column 1 (Solutions)">Footer Column 1 (Solutions)</option>
              <option value="Footer Column 2 (Developers)">Footer Column 2 (Developers)</option>
              <option value="Footer Column 3 (Trust & Legal)">Footer Column 3 (Trust &amp; Legal)</option>
              <option value="Announcement Bar">Announcement Bar</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Display Label *</label>
              <input
                type="text"
                required
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g. Solutions"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Target URL / Route *</label>
              <input
                type="text"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="/solutions"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Pill Badge (Optional)</label>
              <input
                type="text"
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. FIPS 203"
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono text-emerald-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Order Sort Index</label>
              <input
                type="number"
                min="1"
                max="99"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded border-slate-300 text-black focus:ring-slate-900"
              />
              <span>Active in live navigation</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_external || false}
                onChange={(e) => setFormData({ ...formData, is_external: e.target.checked })}
                className="rounded border-slate-300 text-black focus:ring-slate-900"
              />
              <span>Open in new tab</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-shimmer btn-shimmer-dark px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-colors active:scale-[0.98]"
            >
              Save Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 13. CMS MEDIA UPLOAD MODAL
export const CMSMediaUploadModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: CMSMediaAssetItem) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<CMSMediaAssetItem>({
    id: draftId('media'),
    name: '',
    file_name: '',
    file_type: 'SVG Diagram',
    size_kb: 45.2,
    cdn_url: 'https://cdn.quantumshield.io/assets/',
    category: 'Architecture Diagrams',
    alt_text: '',
    uploaded_at: new Date().toISOString().split('T')[0],
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    const finalFileName = formData.file_name || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.svg';
    const finalCdn = formData.cdn_url.endsWith('/')
      ? formData.cdn_url + finalFileName
      : formData.cdn_url;
    onSave({ ...formData, file_name: finalFileName, cdn_url: finalCdn });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Upload Media Asset to Global Edge CDN</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Asset Display Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Quantum Key Mesh Satellite Optical Transceiver Diagram"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Media Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-xl"
              >
                <option value="Architecture Diagrams">Architecture Diagrams</option>
                <option value="Product Screenshots">Product Screenshots</option>
                <option value="Partner Badges">Partner Badges</option>
                <option value="Whitepapers">Whitepapers (PDF)</option>
                <option value="Logos & Icons">Logos &amp; Icons</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">File Type Format</label>
              <select
                value={formData.file_type}
                onChange={(e) => setFormData({ ...formData, file_type: e.target.value as any })}
                className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-xl"
              >
                <option value="SVG Diagram">SVG Vector Diagram</option>
                <option value="PNG Graphic">PNG Graphic</option>
                <option value="WebP Hero">WebP Hero Raster</option>
                <option value="PDF Whitepaper">PDF Whitepaper / Document</option>
                <option value="JSON Schema">JSON Schema Specification</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Accessibility Alt Text (Screen Readers &amp; SEO)</label>
            <input
              type="text"
              value={formData.alt_text}
              onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
              placeholder="Describe the visual content accurately..."
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">File Size (KB)</label>
              <input
                type="number"
                value={formData.size_kb}
                onChange={(e) => setFormData({ ...formData, size_kb: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">CDN Storage Path</label>
              <input
                type="text"
                value={formData.cdn_url}
                onChange={(e) => setFormData({ ...formData, cdn_url: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-600"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-shimmer btn-shimmer-dark px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-slate-900/20 transition-colors active:scale-[0.98]"
            >
              Publish to CDN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 14. LIVE WEBSITE PAGE PREVIEW MODAL (Interactive Device Viewport Preview)
export const LiveWebsitePreviewModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  page?: CMSPageItem | null;
  article?: CMSContentItem | null;
  navItems?: CMSNavigationItem[];
  blocks?: CMSSectionBlock[];
  onTestLeadForm?: (name: string, email: string, company: string) => void;
}> = ({ isOpen, onClose, page, article, navItems = [], blocks = [], onTestLeadForm }) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  if (!isOpen) return null;

  const currentPath = page ? page.path : article ? `/advisories/${article.slug}` : '/';
  const pageTitle = page ? page.title : article ? article.title : 'QuantumShield';
  const metaDesc = page ? page.meta_description : 'Authoritative Sovereign Post-Quantum Cryptography Platform';

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail) return;
    if (onTestLeadForm) {
      onTestLeadForm(leadName || 'Dr. Evaluator', leadEmail, leadCompany || 'Enterprise Corp');
    }
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        {/* Browser Top Chrome Header */}
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 max-w-md truncate">
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-slate-500">https://</span>
              <span className="text-white font-semibold">quantumshield.io</span>
              <span className="text-blue-400 font-bold">{currentPath}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
              TLS 1.3 ML-KEM-768
            </span>
          </div>

          {/* Viewport controls */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewport === 'desktop' ? 'bg-black text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewport === 'tablet' ? 'bg-black text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewport === 'mobile' ? 'bg-black text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Website Content Sandbox Viewport Frame */}
        <div className="flex-1 bg-slate-950/60 p-4 sm:p-6 overflow-y-auto flex justify-center">
          <div
            className={`transition-all duration-300 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col ${
              viewport === 'desktop'
                ? 'w-full max-w-5xl min-h-full'
                : viewport === 'tablet'
                ? 'w-[768px] min-h-full'
                : 'w-[375px] min-h-full'
            }`}
          >
            {/* Website Public Top Header */}
            <header className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white/95 backdrop-blur-md sticky top-0 z-30">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center font-black text-xs">
                  Q
                </div>
                <span className="font-bold text-sm tracking-tight text-slate-900">QuantumShield</span>
              </div>

              {viewport !== 'mobile' && (
                <nav className="flex items-center gap-5 text-xs font-medium text-slate-600">
                  <span className="hover:text-black cursor-pointer">Solutions</span>
                  <span className="hover:text-black cursor-pointer">Products</span>
                  <span className="hover:text-black cursor-pointer">Technology</span>
                  <span className="hover:text-black cursor-pointer">Pricing</span>
                  <span className="hover:text-black cursor-pointer">Trust</span>
                </nav>
              )}

              <div className="flex items-center gap-2">
                <button className="btn-shimmer btn-shimmer-dark px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-slate-900/20 active:scale-[0.98]">
                  {viewport === 'mobile' ? 'Demo' : 'Book Demo'}
                </button>
              </div>
            </header>

            {/* Announcement Banner */}
            <div className="bg-slate-900 text-white px-4 py-2 text-center text-xs font-medium border-b border-slate-800 flex items-center justify-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-blue-600 text-[10px] font-bold">NIST FIPS 203</span>
              <span className="truncate">Immediate Drop-In Protection Across Hybrid Clouds</span>
            </div>

            {/* Page Hero Section */}
            <main className="flex-1 space-y-8 p-6 sm:p-10">
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-500/30 text-[11px] font-bold text-blue-700">
                  <Shield className="w-3 h-3" />
                  {page?.category || 'SOVEREIGN CRYPTOGRAPHY'}
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {pageTitle}
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
                  {metaDesc}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button className="btn-shimmer btn-shimmer-dark px-5 py-2.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-slate-900/20 active:scale-[0.98] flex items-center gap-2">
                    <span>Deploy Hybrid PQC Sandbox</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold transition">
                    View FIPS 203 Whitepaper
                  </button>
                </div>
              </div>

              {/* Interactive Code Terminal Demo Preview */}
              <div className="max-w-3xl mx-auto rounded-2xl bg-slate-950 border border-slate-800 p-5 text-white shadow-xl space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>quantumshield-lattice-handshake.sh</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">
                    ML-KEM-768 (FIPS 203)
                  </span>
                </div>
                <div className="space-y-1 text-slate-300">
                  <p className="text-slate-500"># Initializing Dual-Key Hybrid Ingress Handshake</p>
                  <p className="text-blue-400">$ quantumshield --cipher ML-KEM-768+X25519 --hsm-level 4</p>
                  <p className="text-emerald-400">✔ Generated Kyber Matrix Encapsulation (ct: 1088 bytes, ss: 32 bytes)</p>
                  <p className="text-emerald-400">✔ Zero-Downtime Session Established in 0.84ms (P99)</p>
                  <p className="text-slate-400">✔ FIPS 140-3 Hardware Tamper Zeroization Enclave: READY</p>
                </div>
              </div>

              {/* Interactive Lead Capture Form in Preview */}
              <div className="max-w-xl mx-auto p-6 border border-slate-200 rounded-2xl bg-slate-50 space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="font-bold text-base text-slate-900">Request Quantum Readiness Assessment</h3>
                  <p className="text-xs text-slate-500">
                    Test live submission into the CMS Inbound Leads pipeline.
                  </p>
                </div>

                {submittedMessage ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-500/30 rounded-xl text-center text-xs font-bold text-emerald-600 animate-in fade-in">
                    ✔ Test Inbound Lead Captured! Stored in CMS Inquiries.
                  </div>
                ) : (
                  <form onSubmit={handleTestSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Work Email *"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Company / Government Organization"
                      value={leadCompany}
                      onChange={(e) => setLeadCompany(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl"
                    />
                    <button
                      type="submit"
                      className="btn-shimmer btn-shimmer-dark w-full py-2.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-slate-900/20 transition-colors active:scale-[0.98]"
                    >
                      Submit Assessment Request
                    </button>
                  </form>
                )}
              </div>
            </main>

            {/* Public Footer */}
            <footer className="px-6 py-8 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <div className="w-5 h-5 rounded-md bg-black text-white flex items-center justify-center font-bold text-[10px]">
                    Q
                  </div>
                  <span>QuantumShield Sovereign Architecture</span>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <span>© 2026 QuantumShield Inc.</span>
                  <span>SOC-2 Type II</span>
                  <span>FIPS 140-3 L4</span>
                  <span>CNSA 2.0</span>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};
