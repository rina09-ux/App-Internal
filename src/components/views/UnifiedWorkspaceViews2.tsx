import React, { useState, useMemo } from 'react';
import {
  WorkspaceId,
  ProductDefinitionItem,
  ProductReleaseItem,
  ProductPlanPricing,
  ProductAddOn,
  ClientTenantUser,
  CustomerProfile,
  UserAccountRecord,
  PlatformServiceStatus,
  DataMigrationPlan,
  ReportContractItem,
  ExportJobItem,
  OperationalNotification,
  RoleWorkItem,
  AuditEventRecord,
  DomainCoverageMetric,
  CMSContentItem,
  CMSPageItem,
  CMSSectionBlock,
  CMSNavigationItem,
  CMSMediaAssetItem,
  CMSInboundLeadItem,
  CMSAnnouncementBanner,
} from '../../types/workspaces';
import {
  Download,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Globe,
  FileCode,
  FileCheck,
  Radio,
  Layers,
  Send,
  Eye,
  Edit3,
  Check,
  Filter,
  Trash2,
  ArrowRight,
  Shield,
  UserPlus,
  Users,
  Sparkles,
  Package,
  Calendar,
  Lock,
  Unlock,
  Key,
  DollarSign,
  TrendingUp,
  Monitor,
  Smartphone,
  Tablet,
  Code,
  Image,
  Compass,
  Share2,
  Copy,
  Layout,
  FileText,
  Sliders,
  Terminal,
} from 'lucide-react';
import { InspectorEntity } from '../modals/DetailInspectorDrawer';
import { exportToCSV, exportToJSON } from '../../utils/exportUtils';
import { ViewCommonProps } from './UnifiedWorkspaceViews';

// 10. PRODUCT MANAGEMENT (Products, Multi-User Seat Pricing, Add-Ons Schemes & Tenant Licensing)
export const ProductView: React.FC<ViewCommonProps & {
  products: ProductDefinitionItem[];
  plans: ProductPlanPricing[];
  releases: ProductReleaseItem[];
  addOns?: ProductAddOn[];
  clientUsers?: ClientTenantUser[];
  customers?: CustomerProfile[];
}> = ({
  showToast,
  onInspect,
  onOpenCreateModal,
  products,
  plans,
  releases,
  addOns = [],
  clientUsers = [],
  customers = [],
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'plans' | 'addons' | 'licensing'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [billingToggle, setBillingToggle] = useState<'monthly' | 'annual'>('monthly');

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Filtered Add-Ons
  const filteredAddOns = useMemo(() => {
    return addOns.filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [addOns, searchTerm]);

  // Total allocated seats across all customer tenants
  const totalAllocatedSeats = useMemo(() => {
    return customers.reduce((acc, c) => acc + (c.seats_allocated || 10), 0);
  }, [customers]);

  const totalUsedSeats = useMemo(() => {
    return customers.reduce((acc, c) => acc + (c.seats_used || 0), 0);
  }, [customers]);

  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      {/* Header with Sub-Tabs & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Products, Multi-User &amp; Add-Ons</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-500/30">
              Commercial Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic products, per-user/seat licensing models, Add-Ons catalog, and client tenant seat quota enforcement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(activeTab === 'addons' ? addOns : activeTab === 'plans' ? plans : products, `catalog-${activeTab}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {activeTab === 'catalog' && (
            <button
              onClick={() => onOpenCreateModal('product')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          )}

          {activeTab === 'plans' && (
            <button
              onClick={() => onOpenCreateModal('plan')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Pricing Plan</span>
            </button>
          )}

          {activeTab === 'addons' && (
            <button
              onClick={() => onOpenCreateModal('addon')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create Add-On Scheme</span>
            </button>
          )}

          {activeTab === 'licensing' && (
            <button
              onClick={() => onOpenCreateModal('client_user')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Client User</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'catalog'
              ? 'border-black text-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'plans'
              ? 'border-black text-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Multi-User Plans &amp; Pricing ({plans.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addons')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'addons'
              ? 'border-black text-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Add-Ons Scheme ({addOns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('licensing')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'licensing'
              ? 'border-black text-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-blue-600" />
          <span>Tenant Multi-Seat Licensing ({clientUsers.length} Users)</span>
        </button>
      </div>

      {/* 6 High-Density Commercial KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Total Products</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{products.length}</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">2 GA • 1 Beta</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Add-On Schemes</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{addOns.length}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">HSM, Seats, Audit</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Total Seat Capacity</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{totalAllocatedSeats}</span>
          <span className="text-[10px] text-blue-600 font-semibold mt-1 block">Across Client Tenants</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Active Seat Utilization</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">{totalUsedSeats} / {totalAllocatedSeats}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">
            {Math.round((totalUsedSeats / (totalAllocatedSeats || 1)) * 100)}% Seat Fill Rate
          </span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Licensing Model</span>
          <span className="text-sm font-bold text-slate-900 mt-2 block">Unit / User / Period</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Monthly &amp; Annual</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">SLA Commitment</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">99.999%</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Hardware Enc Enforced</span>
        </div>
      </div>

      {/* TAB 1: PRODUCT DEFINITIONS & DETAILED SPECIFICATIONS */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((prod) => (
              <div
                key={prod.id}
                onClick={() =>
                  onInspect({
                    type: 'Product Definition',
                    title: prod.name,
                    id: prod.code,
                    status: prod.status,
                    data: prod,
                  })
                }
                className="p-5 border border-slate-200/90 rounded-2xl bg-white hover:border-slate-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {prod.category || 'Cryptography'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prod.status === 'GA' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {prod.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{prod.name}</h3>
                    <span className="text-[11px] font-mono text-slate-400 block mt-0.5">{prod.code}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {prod.description || 'Enterprise post-quantum cryptographic appliance.'}
                  </p>

                  {/* Feature Tags Preview */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {(prod.features || ['FIPS 203 ML-KEM', 'Multi-Seat RBAC']).slice(0, 3).map((f, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-50 border border-slate-200/70 rounded text-[10px] text-slate-600 font-medium">
                        {f}
                      </span>
                    ))}
                    {(prod.features?.length || 0) > 3 && (
                      <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500 font-semibold">
                        +{(prod.features?.length || 0) - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Lead Architect</span>
                    <span className="font-semibold text-slate-800">{prod.lead}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">SLA</span>
                    <span className="font-mono font-bold text-emerald-600">{prod.sla_target || '—'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Product Definitions Table */}
          <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Product Architectural Catalog &amp; Add-On Compatibility</h3>
              <span className="text-xs text-slate-500">{products.length} Products Registered</span>
            </div>

            <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Product Name</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Supported Add-Ons</th>
                    <th className="py-2.5 px-3">Billing Schemes</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Product Lead</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {products.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() =>
                        onInspect({
                          type: 'Product Definition',
                          title: p.name,
                          id: p.code,
                          status: p.status,
                          data: p,
                        })
                      }
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                    >
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{p.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{p.category || 'Cryptography'}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{p.code}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-100 font-bold">
                          {p.supported_addons?.length || 3} Compatible Add-Ons
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-600">
                        Per User / Bulan &amp; Tahunan
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.status === 'GA' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-800">{p.lead}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-USER PRICING PLANS (Per User/Month or Year) */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {/* Monthly / Annual Billing Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Multi-User Seat Licensing &amp; Billing Cycles</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pricing is calculated strictly on a unit/user/month or unit/user/year scheme with hard seat quota enforcement.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => setBillingToggle('monthly')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  billingToggle === 'monthly' ? 'bg-black text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly (Bulanan)
              </button>
              <button
                onClick={() => setBillingToggle('annual')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  billingToggle === 'annual' ? 'bg-black text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annual (Tahunan)</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500 text-white">
                  Save 18%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((pln) => {
              const perUserPrice =
                billingToggle === 'annual'
                  ? pln.price_per_user_annual || Math.round((pln.price_per_user_monthly || 95) * 10)
                  : pln.price_per_user_monthly || 95;

              return (
                <div
                  key={pln.id}
                  onClick={() =>
                    onInspect({
                      type: 'Product Plan Pricing',
                      title: pln.display_name,
                      id: pln.plan_code,
                      status: pln.active ? 'active' : 'inactive',
                      data: pln,
                    })
                  }
                  className="p-5 border border-slate-200 rounded-2xl bg-white hover:border-slate-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {pln.tier || 'Enterprise Tier'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{pln.plan_code}</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900">{pln.display_name}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {pln.description || 'Complete post-quantum sovereign security.'}
                      </p>
                    </div>

                    {/* Pricing Rate Display */}
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-slate-900 font-mono">
                          ${perUserPrice.toLocaleString()}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          / user / {billingToggle === 'annual' ? 'year' : 'month'}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block font-mono">
                        Base: ${(pln.monthly_amount_minor / 100).toLocaleString()}/mo • Includes {pln.included_seats || 10} Seats
                      </span>
                    </div>

                    {/* Seat Limits & Specifications */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          Included Base Seats:
                        </span>
                        <span className="font-bold text-slate-900">{pln.included_seats || 10} Users</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          Max Capacity Limit:
                        </span>
                        <span className="font-bold text-slate-900">{pln.max_seats || 500} Users Max</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          Supported Add-Ons:
                        </span>
                        <span className="font-bold text-blue-600">
                          {pln.supported_addons?.length || 5} Available
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      FIPS 203 Validated
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCreateModal('plan', pln);
                      }}
                      className="text-xs font-bold text-black hover:underline"
                    >
                      Edit Plan →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Plans Detailed Table */}
          <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Commercial Catalog Matrix</h3>
            <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Plan Name</th>
                    <th className="py-2.5 px-3">Tier</th>
                    <th className="py-2.5 px-3">Rate / User / Mo</th>
                    <th className="py-2.5 px-3">Rate / User / Yr</th>
                    <th className="py-2.5 px-3">Included Seats</th>
                    <th className="py-2.5 px-3">Max Hard Cap</th>
                    <th className="py-2.5 px-3">Annual Discount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {plans.map((pl) => (
                    <tr
                      key={pl.id}
                      onClick={() =>
                        onInspect({
                          type: 'Product Plan Pricing',
                          title: pl.display_name,
                          id: pl.plan_code,
                          status: pl.active ? 'active' : 'inactive',
                          data: pl,
                        })
                      }
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                    >
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{pl.display_name}</td>
                      <td className="py-2.5 px-3">{pl.tier}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        ${pl.price_per_user_monthly || 95} / user / mo
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                        ${pl.price_per_user_annual || 950} / user / yr
                      </td>
                      <td className="py-2.5 px-3 font-mono">{pl.included_seats || 10} Seats</td>
                      <td className="py-2.5 px-3 font-mono">{pl.max_seats || 500} Seats</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-600 font-bold">
                        {pl.annual_discount_pct || 18}% OFF
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADD-ONS SCHEME & EXPANSIONS */}
      {activeTab === 'addons' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50/60 border border-amber-500/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h3 className="font-bold text-sm text-amber-950">Add-Ons Expansion Architecture</h3>
                <p className="text-xs text-amber-600 mt-0.5">
                  Attachable modular add-ons for multi-seat expansion, dedicated HSM hardware enclaves, SOC-2 compliance automation, and red-team simulations.
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenCreateModal('addon')}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              + New Add-On
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredAddOns.map((add) => (
              <div
                key={add.id}
                onClick={() =>
                  onInspect({
                    type: 'Product Add-On Scheme',
                    title: add.name,
                    id: add.code,
                    status: add.active ? 'active' : 'inactive',
                    data: add,
                  })
                }
                className="p-5 border border-slate-200 rounded-2xl bg-white hover:border-slate-300 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-900">
                      {add.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{add.code}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{add.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{add.description}</p>
                  </div>

                  {/* Pricing Scheme */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-slate-900 font-mono">
                        ${add.price_monthly.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        / {add.unit_label}
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-mono font-bold block">
                      Annual: ${add.price_annual.toLocaleString()} / yr
                    </span>
                  </div>

                  {/* Included features in this Add-on */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 block">Includes:</span>
                    <div className="space-y-1">
                      {add.features_included.map((feat, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {add.compatible_products.length} Products Compatible
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCreateModal('addon', add);
                    }}
                    className="font-bold text-black hover:underline"
                  >
                    Edit Add-On →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CLIENT TENANT MULTI-SEAT LICENSING & SEAT QUOTA ENFORCEMENT */}
      {activeTab === 'licensing' && (
        <div className="space-y-6">
          {/* Tenant Seat Allocation Matrix */}
          <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Client Tenant Multi-User Quota &amp; Seat Utilization</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Clients are limited to their contracted seat capacity. Extra members are locked until license expansion or Add-On booster pack purchase.
                </p>
              </div>
              <button
                onClick={() => onOpenCreateModal('client_user')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Team Member</span>
              </button>
            </div>

            {/* Tenant Seat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {customers.map((cust) => {
                const allocated = cust.seats_allocated || 10;
                const used = cust.seats_used || 0;
                const pct = Math.min(100, Math.round((used / allocated) * 100));
                const isFull = used >= allocated;

                return (
                  <div
                    key={cust.tenant_id}
                    className={`p-4 border rounded-2xl transition ${
                      isFull ? 'border-rose-500/30 bg-rose-50/20' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{cust.display_name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isFull ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'
                        }`}
                      >
                        {isFull ? 'Quota Maxed' : 'Seats OK'}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Seat Utilization</span>
                        <span className="font-mono font-bold text-slate-900">
                          {used} / {allocated} Seats ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            isFull ? 'bg-rose-600' : pct > 75 ? 'bg-amber-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500 font-mono">${cust.mrr?.toLocaleString()}/mo</span>
                      <button
                        onClick={() => onOpenCreateModal('upgrade_seats', { tenant_id: cust.tenant_id })}
                        className="text-xs font-bold text-blue-600 hover:text-blue-600 hover:underline"
                      >
                        + Upgrade Capacity
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Client Tenant Team Members Table */}
          <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Active Client Tenant Team Members</h3>
              <span className="text-xs text-slate-500">{clientUsers.length} Operators Registered</span>
            </div>

            <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Team Member</th>
                    <th className="py-2.5 px-3">Client Tenant</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Seat Status</th>
                    <th className="py-2.5 px-3">Hardware MFA</th>
                    <th className="py-2.5 px-3">Last Active</th>
                    <th className="py-2.5 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {clientUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() =>
                        onInspect({
                          type: 'Client Tenant User',
                          title: user.name,
                          id: user.id,
                          status: user.status,
                          data: user,
                        })
                      }
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                    >
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 block">{user.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{user.email}</span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{user.tenant_name}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : user.status === 'seat_locked'
                              ? 'bg-rose-500/10 text-rose-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {user.status === 'seat_locked' ? (
                            <>
                              <Lock className="w-3 h-3" />
                              <span>Seat Locked (No License)</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Active Seat</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {user.mfa_enforced ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                            <Key className="w-3 h-3" /> Enforced
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Optional</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{user.last_active}</td>
                      <td className="py-2.5 px-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenCreateModal('client_user', user);
                          }}
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 11. PEOPLE & RBAC VIEW
export const PeopleRBACView: React.FC<ViewCommonProps & {
  users: UserAccountRecord[];
}> = ({ showToast, onInspect, onOpenCreateModal, users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, searchTerm, roleFilter]);

  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">People, Clearance &amp; RBAC</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Identity &amp; Access
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic clearances, scoped internal roles, hardware MFA tokens, and operator accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(filteredUsers, 'users-rbac')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Accounts</span>
          </button>
          <button
            onClick={() => onOpenCreateModal('user')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Operator</span>
          </button>
        </div>
      </div>

      {/* 4 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Total Operators</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{users.length}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">{users.length ? Math.round((users.filter((u) => u.status === 'active').length / users.length) * 100) : 0}% active</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">FIDO2 Hardware MFA</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{users.length ? Math.round((users.filter((u) => u.mfa_enabled).length / users.length) * 100) : 0}%</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">MFA enabled in loaded operator records</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Q-Clearance Operators</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{users.filter((u) => /crypto|q-clearance|key/i.test(u.role)).length}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Derived from loaded role records</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">RBAC Scopes Assigned</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{users.reduce((sum, u) => sum + u.scopes.length, 0)}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Loaded assigned scopes</span>
        </div>
      </div>

      {/* Table */}
      <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-bold text-sm text-slate-900">Operator Directory &amp; RBAC Roles</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search operator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none w-44"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="Executive / Operator">Executive / Operator</option>
              <option value="Security Lead">Security Lead</option>
              <option value="Cryptographic Engineer">Cryptographic Engineer</option>
              <option value="Customer Success Lead">Customer Success Lead</option>
            </select>
          </div>
        </div>

        <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Display Name</th>
                <th className="py-2.5 px-3">Email Address</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Hardware MFA</th>
                <th className="py-2.5 px-3">Scopes Count</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  onClick={() =>
                    onInspect({
                      type: 'RBAC User Account',
                      title: u.display_name,
                      id: u.id,
                      status: u.status,
                      data: u,
                    })
                  }
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{u.display_name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{u.email}</td>
                  <td className="py-2.5 px-3">{u.role}</td>
                  <td className="py-2.5 px-3 text-slate-600">{u.department}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                      FIDO2 Hardware Key
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono">{u.scopes.length} Scopes</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 12. PLATFORM RUNTIME VIEW
export const PlatformView: React.FC<ViewCommonProps & {
  services: PlatformServiceStatus[];
}> = ({ showToast, onInspect, services }) => {
  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Platform Runtime &amp; Fleet</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Infrastructure
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Microservices fleet status, edge latency telemetry, high-availability clusters, and HSM endpoints.
          </p>
        </div>

        <button
          onClick={() => showToast('Dispatched automated health check to all clusters')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Fleet Health Check</span>
        </button>
      </div>

      {/* 6 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Total Services</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{services.length}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">{services.length ? Math.round((services.filter((s) => s.status === 'OPERATIONAL').length / services.length) * 100) : 0}% operational</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Avg Edge Latency</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{services.length ? (services.reduce((sum, service) => sum + service.latency_ms, 0) / services.length).toFixed(1) : '—'}ms</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Derived service telemetry</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Availability SLA</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{services.length ? (services.reduce((sum, service) => sum + service.uptime_30d, 0) / services.length).toFixed(2) + '%' : '—'}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Derived 30-day service uptime</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Active Nodes</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">—</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Node inventory not supplied by Core contract</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">HSM Partitions</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">—</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">FIPS 140-3 L3</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Auto-Failover</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">Enabled</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">BGP Anycast</span>
        </div>
      </div>

      {/* Table */}
      <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Microservice Runtime Inventory</h3>
        <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Service Name</th>
                <th className="py-2.5 px-3">Service Group</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">P99 Latency</th>
                <th className="py-2.5 px-3">30-Day Uptime</th>
                <th className="py-2.5 px-3">Last Health Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {services.map((s) => (
                <tr
                  key={s.service_name}
                  onClick={() =>
                    onInspect({
                      type: 'Platform Service',
                      title: s.service_name,
                      id: s.service_name,
                      status: s.status,
                      data: s,
                    })
                  }
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{s.service_name}</td>
                  <td className="py-2.5 px-3 text-slate-600">{s.group}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                      {s.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{s.latency_ms} ms</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-600">{s.uptime_30d}%</td>
                  <td className="py-2.5 px-3 text-slate-500">{s.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 13. DATA & INTELLIGENCE VIEW
export const DataIntelligenceView: React.FC<ViewCommonProps & {
  migrations: DataMigrationPlan[];
  coverage: DomainCoverageMetric[];
}> = ({ showToast, onInspect, onOpenCreateModal, migrations }) => {
  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Data Intelligence &amp; PQC Migration</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Data Lineage
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Post-quantum data migration tracking, dataset re-encryption pipelines, and cryptographic lineage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(migrations, 'pqc-data-migrations')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Migration Plans</span>
          </button>
          <button
            onClick={() => onOpenCreateModal('migration')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Migration Plan</span>
          </button>
        </div>
      </div>

      {/* 6 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Total Datasets</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{migrations.length}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">In Scope</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Total Records Migrated</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{migrations.reduce((sum, migration) => sum + migration.records_migrated, 0).toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Loaded migration records</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Active Pipelines</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{migrations.filter((migration) => migration.state === 'In Progress').length}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">In-progress migration plans</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Completed Vaults</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{migrations.filter((migration) => migration.state === 'Completed').length}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Completed migration plans</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Pending Sign-off</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{migrations.filter((migration) => migration.state === 'Pending Approval').length}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Pending approval plans</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Lineage Integrity</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">—</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Lineage verification comes from Core evidence contract</span>
        </div>
      </div>

      {/* Table */}
      <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Post-Quantum Data Migration Pipelines</h3>
        <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Plan Key</th>
                <th className="py-2.5 px-3">Dataset Name</th>
                <th className="py-2.5 px-3">Current Crypto</th>
                <th className="py-2.5 px-3">Target PQC Suite</th>
                <th className="py-2.5 px-3">Migrated / Total</th>
                <th className="py-2.5 px-3">Progress</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {migrations.map((m) => {
                const pct = Math.round((m.records_migrated / m.records_total) * 100);
                return (
                  <tr
                    key={m.plan_key}
                    onClick={() =>
                      onInspect({
                        type: 'Data Migration Pipeline',
                        title: m.dataset,
                        id: m.plan_key,
                        status: m.state,
                        data: m,
                      })
                    }
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{m.plan_key}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{m.dataset}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{m.current_algorithm}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{m.target_algorithm}</td>
                    <td className="py-2.5 px-3 font-mono">
                      {(m.records_migrated / 1000).toFixed(0)}k / {(m.records_total / 1000).toFixed(0)}k
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-16">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px]">{pct}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.state === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : m.state === 'In Progress'
                            ? 'bg-blue-500/10 text-blue-600'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        {m.state}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{m.eta}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 14. REPORTS & DOWNLOADS VIEW
export const ReportsDownloadsView: React.FC<ViewCommonProps & {
  reports: ReportContractItem[];
  exports: ExportJobItem[];
}> = ({ showToast, onInspect, reports, exports }) => {
  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Reports, Exports &amp; Contracts</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Audit Exports
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Formal compliance report generation, immutable evidence exports, and contract archives.
          </p>
        </div>

        <button
          onClick={() => showToast('Generated fresh compliance bundle package')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate Report Bundle</span>
        </button>
      </div>

      {/* 6 KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Available Reports</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{reports.length}</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">All Ready</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">SOC-2 Type II Package</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">Certified</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Audited 2026</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">NIST CBOM Export</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">CycloneDX</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">v1.6 Schema</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Total Export Jobs</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{exports.length}</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Historical</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Export Format</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">PDF / JSON</span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">Cryptographically Signed</span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Contract SLA</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">100%</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Guaranteed Delivery</span>
        </div>
      </div>

      {/* Tables */}
      <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Authoritative Compliance &amp; Audit Reports</h3>
        <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Report Title</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Format</th>
                <th className="py-2.5 px-3">Cadence</th>
                <th className="py-2.5 px-3">Last Generated</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {reports.map((r) => (
                <tr
                  key={r.id}
                  onClick={() =>
                    onInspect({
                      type: 'Report Contract',
                      title: r.title,
                      id: r.id,
                      status: r.available ? 'Available' : 'Pending',
                      data: r,
                    })
                  }
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{r.title}</td>
                  <td className="py-2.5 px-3 text-slate-600">{r.type}</td>
                  <td className="py-2.5 px-3 font-mono">{r.format}</td>
                  <td className="py-2.5 px-3 text-slate-500">{r.frequency}</td>
                  <td className="py-2.5 px-3 text-slate-500">{r.last_generated}</td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportToJSON(r, `report-${r.id}`);
                        showToast(`Downloaded ${r.title}`);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 15. NOTIFICATIONS VIEW
export const NotificationsView: React.FC<ViewCommonProps & {
  notifications: OperationalNotification[];
}> = ({ showToast, onInspect, onNavigate, notifications }) => {
  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Operational Notifications Feed</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Alerts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time security alerts, billing events, engineering warnings, and compliance milestones.
          </p>
        </div>

        <button
          onClick={() => showToast('All notifications marked as read')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark All as Read</span>
        </button>
      </div>

      <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() =>
              onInspect({
                type: 'Operational Notification',
                title: n.title,
                id: n.id,
                status: n.status,
                data: n,
              })
            }
            className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition cursor-pointer ${
              n.status === 'unread'
                ? 'bg-blue-50/40 border-blue-500/30 hover:bg-blue-50/70'
                : 'bg-white border-slate-200/70 hover:bg-slate-50'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    n.category === 'Security'
                      ? 'bg-rose-500/10 text-rose-600'
                      : n.category === 'Finance'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-blue-500/10 text-blue-600'
                  }`}
                >
                  {n.category}
                </span>
                <span className="font-bold text-xs text-slate-900">{n.title}</span>
              </div>
              <p className="text-xs text-slate-600">{n.details}</p>
              <span className="text-[10px] text-slate-400 font-mono block mt-1">{n.created_at}</span>
            </div>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                n.status === 'unread' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {n.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 16. MY WORK VIEW
export const MyWorkView: React.FC<ViewCommonProps & {
  workItems: RoleWorkItem[];
}> = ({ showToast, onInspect, onOpenCreateModal, workItems }) => {
  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">My Work Queue</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Role Queue
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-scoped tasks, approval queues, key rotation sign-offs, and customer check-ins.
          </p>
        </div>

        <button
          onClick={() => onOpenCreateModal('work_item')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Work Item</span>
        </button>
      </div>

      <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-3">
        {workItems.map((w) => (
          <div
            key={w.id}
            onClick={() =>
              onInspect({
                type: 'Internal Work Item',
                title: w.title,
                id: w.id,
                status: w.status,
                data: w,
              })
            }
            className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl flex items-center justify-between gap-4 hover:bg-slate-100 transition cursor-pointer text-xs"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-slate-400">{w.id}</span>
                <span className="font-bold text-slate-900">{w.title}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    w.priority === 'Urgent'
                      ? 'bg-rose-500/10 text-rose-600'
                      : w.priority === 'High'
                      ? 'bg-amber-500/10 text-amber-600'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {w.priority}
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Domain: {w.domain} • Due: {w.due_date}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  w.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 text-slate-800'
                }`}
              >
                {w.status}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  showToast(`Work item ${w.id} marked as completed`);
                }}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg text-xs font-semibold transition"
              >
                Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 17. AUDIT TRAIL VIEW
export const AuditView: React.FC<ViewCommonProps & {
  auditEvents: AuditEventRecord[];
}> = ({ showToast, onInspect, auditEvents }) => {
  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Immutable Audit Log</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Audit Stream
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically verifiable operator activity, authorization decisions, and access records.
          </p>
        </div>

        <button
          onClick={() => exportToCSV(auditEvents, 'immutable-audit-trail')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log</span>
        </button>
      </div>

      <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Authoritative Event Ledger</h3>
        <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Timestamp (UTC)</th>
                <th className="py-2.5 px-3">Actor / Principal</th>
                <th className="py-2.5 px-3">Action Event</th>
                <th className="py-2.5 px-3">Resource Target</th>
                <th className="py-2.5 px-3">Policy Decision</th>
                <th className="py-2.5 px-3">Source IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {auditEvents.map((evt) => (
                <tr
                  key={evt.id}
                  onClick={() =>
                    onInspect({
                      type: 'Audit Event Log',
                      title: evt.action,
                      id: evt.id,
                      status: evt.decision,
                      data: evt,
                    })
                  }
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-mono text-slate-500">{evt.created_at}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{evt.actor}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-800">{evt.action}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{evt.resource_id}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                      {evt.decision}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{evt.ip_address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// 18. DOMAIN COVERAGE VIEW
export const CoverageView: React.FC<ViewCommonProps & {
  coverage: DomainCoverageMetric[];
}> = ({ showToast, onInspect, coverage }) => {
  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cross-Domain Coverage &amp; Health</h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Architecture
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Entity mapping depth, stream synchronization freshness, and data completeness across all 19 subsystems.
          </p>
        </div>

        <button
          onClick={() => showToast('All domain coverage metrics refreshed')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coverage.map((c) => (
          <div
            key={c.domain}
            onClick={() =>
              onInspect({
                type: 'Domain Coverage Metric',
                title: c.domain,
                id: c.domain.toLowerCase().replace(/\s+/g, '-'),
                status: c.status,
                data: c,
              })
            }
            className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-3 hover:border-slate-400 transition cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">{c.domain}</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                {c.status}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">Coverage Completion</span>
                <span className="font-bold font-mono">{c.coverage_pct}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 rounded-full"
                  style={{ width: `${c.coverage_pct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>{c.entities_mapped} Entities Mapped</span>
              <span className="font-mono">{c.freshness_seconds}s latency</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 19. FULL-WEBSITE CMS VIEW (Pages, Reusable Blocks, Navigation, Media, Advisories & Inbound Leads)
export const CMSView: React.FC<ViewCommonProps & {
  articles: CMSContentItem[];
  pages?: CMSPageItem[];
  blocks?: CMSSectionBlock[];
  navItems?: CMSNavigationItem[];
  mediaAssets?: CMSMediaAssetItem[];
  inboundLeads?: CMSInboundLeadItem[];
  announcement?: CMSAnnouncementBanner;
  onOpenPageEditor?: (page?: CMSPageItem | null) => void;
  onOpenBlockEditor?: (block?: CMSSectionBlock | null) => void;
  onOpenNavEditor?: (navItem?: CMSNavigationItem | null) => void;
  onOpenMediaUpload?: () => void;
  onOpenLivePreview?: (page?: CMSPageItem | null, article?: CMSContentItem | null) => void;
  onUpdateLeadStatus?: (leadId: string, newStatus: any) => void;
}> = ({
  showToast,
  onInspect,
  onOpenCreateModal,
  articles,
  pages = [],
  blocks = [],
  navItems = [],
  mediaAssets = [],
  inboundLeads = [],
  announcement,
  onOpenPageEditor,
  onOpenBlockEditor,
  onOpenNavEditor,
  onOpenMediaUpload,
  onOpenLivePreview,
  onUpdateLeadStatus,
}) => {
  const [activeTab, setActiveTab] = useState<
    'pages' | 'blocks' | 'articles' | 'navigation' | 'media' | 'leads'
  >('pages');

  const [pageSearch, setPageSearch] = useState('');
  const [pageCategoryFilter, setPageCategoryFilter] = useState('All');
  const [leadStatusFilter, setLeadStatusFilter] = useState('All');
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState('All');

  // Filtered pages
  const filteredPages = useMemo(() => {
    return pages.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(pageSearch.toLowerCase()) ||
        p.path.toLowerCase().includes(pageSearch.toLowerCase());
      const matchCategory =
        pageCategoryFilter === 'All' || p.category === pageCategoryFilter;
      return matchSearch && matchCategory;
    });
  }, [pages, pageSearch, pageCategoryFilter]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return inboundLeads.filter((l) => {
      return leadStatusFilter === 'All' || l.status === leadStatusFilter;
    });
  }, [inboundLeads, leadStatusFilter]);

  // Filtered media
  const filteredMedia = useMemo(() => {
    return mediaAssets.filter((m) => {
      return mediaCategoryFilter === 'All' || m.category === mediaCategoryFilter;
    });
  }, [mediaAssets, mediaCategoryFilter]);

  const totalVisits = useMemo(() => {
    return pages.reduce((acc, p) => acc + (p.visits_30d || 0), 0);
  }, [pages]);

  const avgConversionRate = useMemo(() => {
    if (pages.length === 0) return 0;
    const total = pages.reduce((acc, p) => acc + (p.conversion_rate_pct || 0), 0);
    return (total / pages.length).toFixed(1);
  }, [pages]);

  const handleDeployCdn = () => {
    showToast('🚀 Deploying full website build to Global Anycast Edge CDN...', 'info');
    setTimeout(() => {
      showToast('✔ Website successfully deployed across 32 Edge PoPs worldwide! Cache purged.', 'success');
    }, 1200);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard?.writeText(url);
    showToast(`Copied to clipboard: ${url}`, 'success');
  };

  return (
    <div className="flex-1 p-5 lg:p-7 overflow-y-auto bg-slate-50 min-w-0 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Website CMS &amp; Public Experience Manager
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 text-white">
              Full Site Scope
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage public marketing pages, modular visual blocks, navigation menus, technical whitepapers, media CDN assets, and inbound lead captures.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenLivePreview && onOpenLivePreview(pages[0] || null, null)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Live Site Preview</span>
          </button>

          <button
            onClick={handleDeployCdn}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Deploy to Edge CDN</span>
          </button>
        </div>
      </div>

      {/* 4 Global Website KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Active Website Pages</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {pages.length}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            {pages.filter((p) => p.status === 'Published').length} Live on Edge • {pages.filter((p) => p.status === 'Staged').length} Staged
          </span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">30-Day Unique Visitors</span>
          <span className="text-2xl font-black text-blue-600 mt-1 block">
            {totalVisits.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 font-medium mt-1 block">
            +18.4% MoM organic growth
          </span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">Inbound Form Conversion</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {avgConversionRate}%
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            {inboundLeads.length} Qualified Inquiries
          </span>
        </div>
        <div className="p-4 border border-slate-200/90 rounded-2xl bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-slate-400 block">SEO &amp; Core Web Vitals</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">96 / 100</span>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
            Grade A • 100% Mobile Ready
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200/90 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pages')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'pages'
              ? 'bg-black text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Pages &amp; Routes ({pages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('blocks')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'blocks'
              ? 'bg-black text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Modular Blocks ({blocks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'articles'
              ? 'bg-black text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Advisories &amp; Whitepapers ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('navigation')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'navigation'
              ? 'bg-black text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Navigation &amp; Menus ({navItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'media'
              ? 'bg-black text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Image className="w-3.5 h-3.5" />
          <span>Media CDN ({mediaAssets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'leads'
              ? 'bg-black text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Inbound Leads ({inboundLeads.length})</span>
        </button>
      </div>

      {/* TAB 1: PAGES & ROUTES */}
      {activeTab === 'pages' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter pages by path or title..."
                  value={pageSearch}
                  onChange={(e) => setPageSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <select
                value={pageCategoryFilter}
                onChange={(e) => setPageCategoryFilter(e.target.value)}
                className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl"
              >
                <option value="All">All Categories</option>
                <option value="Core Landing">Core Landing</option>
                <option value="Product & Solution">Product &amp; Solution</option>
                <option value="Technology & Standards">Technology &amp; Standards</option>
                <option value="Trust & Compliance">Trust &amp; Compliance</option>
                <option value="Company & Legal">Company &amp; Legal</option>
              </select>
            </div>

            <button
              onClick={() => {
                if (onOpenPageEditor) onOpenPageEditor(null);
                else onOpenCreateModal('cms_page');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Page</span>
            </button>
          </div>

          <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Page Title &amp; Category</th>
                    <th className="py-3 px-3">Public Route</th>
                    <th className="py-3 px-3">Layout Template</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">30D Traffic</th>
                    <th className="py-3 px-3">Conv. %</th>
                    <th className="py-3 px-3">SEO</th>
                    <th className="py-3 px-3">Last Deployed</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredPages.map((page) => (
                    <tr
                      key={page.id}
                      onClick={() =>
                        onInspect({
                          type: 'CMS Website Page',
                          title: page.title,
                          id: page.id,
                          status: page.status,
                          data: page,
                        })
                      }
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block">{page.title}</span>
                          <span className="inline-block text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {page.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {page.path}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 text-[11px]">{page.template}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            page.status === 'Published'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : page.status === 'Staged'
                              ? 'bg-blue-500/10 text-blue-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {page.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-800">
                        {page.visits_30d.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-700 font-bold">
                        {page.conversion_rate_pct}%
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {page.seo_score}/100
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-400">
                        {page.last_published_at}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title="Live Preview Page"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onOpenLivePreview) onOpenLivePreview(page, null);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            title="Edit Page"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onOpenPageEditor) onOpenPageEditor(page);
                              else onOpenCreateModal('cms_page', page);
                            }}
                            className="p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 rounded-lg transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MODULAR SECTION BLOCKS */}
      {activeTab === 'blocks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-xs text-slate-900">Reusable Visual Section Blocks</h3>
              <p className="text-[11px] text-slate-500">
                Modular components dynamically assembled across the main website.
              </p>
            </div>
            <button
              onClick={() => {
                if (onOpenBlockEditor) onOpenBlockEditor(null);
                else onOpenCreateModal('cms_block');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Section Block</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blocks.map((block) => (
              <div
                key={block.id}
                onClick={() =>
                  onInspect({
                    type: 'CMS Section Block',
                    title: block.name,
                    id: block.id,
                    status: block.status,
                    data: block,
                  })
                }
                className="p-4 border border-slate-200 rounded-2xl bg-white shadow-2xs hover:border-slate-300 transition space-y-3 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      <Package className="w-3 h-3" />
                      {block.block_type}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{block.name}</h4>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenBlockEditor) onOpenBlockEditor(block);
                      else onOpenCreateModal('cms_block', block);
                    }}
                    className="p-1.5 text-slate-400 hover:text-black rounded-lg hover:bg-slate-50 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{block.heading}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{block.subheading}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Attached on <strong>{block.attached_pages_count} pages</strong></span>
                  <span className="font-mono text-slate-400">Modified: {block.last_modified}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ADVISORIES, WHITEPAPERS & ARTICLES */}
      {activeTab === 'articles' && (
        <div className="p-5 border border-slate-200/90 rounded-2xl bg-white shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Technical Advisories, Whitepapers &amp; Blog</h3>
              <p className="text-xs text-slate-500">Authoritative cryptography advisories and post-quantum migration blueprints.</p>
            </div>
            <button
              onClick={() => onOpenCreateModal('cms_article')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Article / Advisory</span>
            </button>
          </div>

          <div className="border border-slate-200/80 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Title &amp; Category</th>
                  <th className="py-2.5 px-3">Slug</th>
                  <th className="py-2.5 px-3">Locale</th>
                  <th className="py-2.5 px-3">Read Time</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Author</th>
                  <th className="py-2.5 px-3">SEO Score</th>
                  <th className="py-2.5 px-3">Last Updated</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {articles.map((art) => (
                  <tr
                    key={art.id}
                    onClick={() =>
                      onInspect({
                        type: 'CMS Content Article',
                        title: art.title,
                        id: art.id,
                        status: art.status,
                        data: art,
                      })
                    }
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                  >
                    <td className="py-2.5 px-3">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-900 block">{art.title}</span>
                        {art.category && (
                          <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-semibold">
                            {art.category}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">/{art.slug}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{art.locale}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono">
                      {art.read_time_minutes || 10}m
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          art.status === 'Published'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}
                      >
                        {art.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-800">{art.author}</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-600 font-bold">{art.seo_score} / 100</td>
                    <td className="py-2.5 px-3 text-slate-500">{art.last_updated}</td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="Preview Advisory"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenLivePreview) onOpenLivePreview(null, art);
                          }}
                          className="p-1 text-slate-500 hover:text-blue-600 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Edit Advisory"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenCreateModal('cms_article', art);
                          }}
                          className="p-1 text-slate-500 hover:text-black transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: NAVIGATION, MEGA-MENUS & ANNOUNCEMENTS */}
      {activeTab === 'navigation' && (
        <div className="space-y-4">
          {/* Announcement Banner Panel */}
          {announcement && (
            <div className="p-4 border border-blue-500/30 bg-blue-50/70 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                  Active Top Announcement Banner
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                  Live on CDN
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900">{announcement.headline}</p>
              <div className="flex items-center gap-3 text-[11px] text-slate-600">
                <span>CTA: <strong>{announcement.cta_label}</strong></span>
                <span>URL: <code className="font-mono text-blue-600">{announcement.cta_url}</code></span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-xs text-slate-900">Header &amp; Footer Menu Links Architecture</h3>
              <p className="text-[11px] text-slate-500">Configure global website navigation structure.</p>
            </div>
            <button
              onClick={() => {
                if (onOpenNavEditor) onOpenNavEditor(null);
                else onOpenCreateModal('cms_nav');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Menu Link</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="py-2.5 px-4">Menu Location</th>
                  <th className="py-2.5 px-3">Label</th>
                  <th className="py-2.5 px-3">Target Route</th>
                  <th className="py-2.5 px-3">Pill Badge</th>
                  <th className="py-2.5 px-3">Order</th>
                  <th className="py-2.5 px-3">Active</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {navItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-4 font-bold text-slate-900">{item.location}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{item.label}</td>
                    <td className="py-2.5 px-3 font-mono text-blue-600">{item.url}</td>
                    <td className="py-2.5 px-3">
                      {item.badge ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-500/30">
                          {item.badge}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono">{item.order_index}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {item.active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (onOpenNavEditor) onOpenNavEditor(item);
                          else onOpenCreateModal('cms_nav', item);
                        }}
                        className="p-1 text-slate-400 hover:text-black transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: MEDIA & ARCHITECTURE DIAGRAMS CDN */}
      {activeTab === 'media' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <select
                value={mediaCategoryFilter}
                onChange={(e) => setMediaCategoryFilter(e.target.value)}
                className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
              >
                <option value="All">All Categories ({mediaAssets.length})</option>
                <option value="Architecture Diagrams">Architecture Diagrams</option>
                <option value="Product Screenshots">Product Screenshots</option>
                <option value="Partner Badges">Partner Badges</option>
                <option value="Whitepapers">Whitepapers</option>
              </select>
            </div>

            <button
              onClick={() => {
                if (onOpenMediaUpload) onOpenMediaUpload();
                else onOpenCreateModal('cms_media');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload CDN Media</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredMedia.map((asset) => (
              <div
                key={asset.id}
                className="p-4 border border-slate-200 rounded-2xl bg-white shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {asset.file_type}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{asset.name}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{asset.size_kb} KB</span>
                </div>

                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <p className="text-[11px] text-slate-500 line-clamp-2">{asset.alt_text}</p>
                  <p className="text-[10px] font-mono text-slate-400 truncate">{asset.cdn_url}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400">{asset.uploaded_at}</span>
                  <button
                    onClick={() => handleCopyUrl(asset.cdn_url)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy CDN URL</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: INBOUND WEBSITE LEADS & INQUIRIES */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <select
                value={leadStatusFilter}
                onChange={(e) => setLeadStatusFilter(e.target.value)}
                className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
              >
                <option value="All">All Lead Statuses ({inboundLeads.length})</option>
                <option value="New">New ({inboundLeads.filter((l) => l.status === 'New').length})</option>
                <option value="Qualified">Qualified</option>
                <option value="Contacted">Contacted</option>
                <option value="Closed Won">Closed Won</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportToCSV(inboundLeads, 'website-inbound-leads.csv')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Leads CSV</span>
              </button>
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Inquirer &amp; Organization</th>
                    <th className="py-3 px-3">Form Type</th>
                    <th className="py-3 px-3">Lead Score</th>
                    <th className="py-3 px-3">Page Source</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Submitted At</th>
                    <th className="py-3 px-4">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() =>
                        onInspect({
                          type: 'Website Inbound Lead',
                          title: `${lead.full_name} (${lead.company})`,
                          id: lead.id,
                          status: lead.status,
                          data: lead,
                        })
                      }
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block">{lead.full_name}</span>
                          <span className="text-[11px] text-slate-500 font-mono block">{lead.email}</span>
                          <span className="text-[10px] text-slate-600 font-semibold block">
                            {lead.company} • {lead.role} ({lead.country})
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-800">{lead.form_type}</span>
                        {lead.message && (
                          <p className="text-[11px] text-slate-500 line-clamp-1 max-w-xs mt-0.5">
                            "{lead.message}"
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            lead.lead_score.includes('Hot')
                              ? 'bg-rose-500/10 text-rose-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {lead.lead_score}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-blue-600">{lead.page_source}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            lead.status === 'New'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : lead.status === 'Qualified'
                              ? 'bg-blue-500/10 text-blue-600'
                              : lead.status === 'Contacted'
                              ? 'bg-purple-500/10 text-purple-600'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">{lead.submitted_at}</td>
                      <td className="py-3 px-4">
                        <select
                          value={lead.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            e.stopPropagation();
                            if (onUpdateLeadStatus) onUpdateLeadStatus(lead.id, e.target.value);
                            showToast(`Updated lead ${lead.full_name} to ${e.target.value}`, 'success');
                          }}
                          className="text-[11px] px-2 py-1 bg-white border border-slate-200 rounded-lg font-semibold"
                        >
                          <option value="New">New</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Closed Won">Closed Won</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

