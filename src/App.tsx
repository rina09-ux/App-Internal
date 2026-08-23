import React, { useState, useEffect } from 'react';
import { SecurityNavRail } from './components/SecurityNavRail';
import { SecuritySidebar } from './components/SecuritySidebar';
import { MobileHeader, MobileNavDrawer } from './components/MobileNavigation';
import {
  CommandCenterView,
  Customer360View,
  CustomerSuccessView,
  SalesRevenueView,
  PricingControlView,
  FinanceView,
  EngineeringView,
  SecurityView,
  RegulatoryView,
} from './components/views/UnifiedWorkspaceViews';
import {
  ProductView,
  PeopleRBACView,
  PlatformView,
  DataIntelligenceView,
  ReportsDownloadsView,
  NotificationsView,
  MyWorkView,
  AuditView,
  CoverageView,
  CMSView,
} from './components/views/UnifiedWorkspaceViews2';
import { CommandPaletteModal } from './components/modals/CommandPaletteModal';
import { QuantumScanModal } from './components/modals/QuantumScanModal';
import { PqcSandboxModal } from './components/modals/PqcSandboxModal';
import { LiveTelemetryBar } from './components/telemetry/LiveTelemetryBar';
import { coreApi, InternalCommandCenterSnapshot, InternalCryptoTelemetry } from './lib/nusasecCoreClient';

const INTERNAL_DEMO_MODE = import.meta.env.VITE_NUSASEC_INTERNAL_DEMO_MODE === 'true';
import { DetailInspectorDrawer, InspectorEntity } from './components/modals/DetailInspectorDrawer';
import {
  CustomerEditorModal,
  IncidentEditorModal,
  SecurityRemediationModal,
  PricingPlanEditorModal,
  UserAccountEditorModal,
  CMSArticleEditorModal,
  DataMigrationEditorModal,
  SalesOpportunityEditorModal,
  WorkItemEditorModal,
  ProductEditorModal,
  AddOnEditorModal,
  ClientUserModal,
  ClientSeatUpgradeModal,
  CMSPageEditorModal,
  CMSBlockEditorModal,
  CMSNavEditorModal,
  CMSMediaUploadModal,
  LiveWebsitePreviewModal,
} from './components/modals/EntityEditorModals';

import {
  WorkspaceId,
  CustomerProfile,
  EngineeringIncident,
  SecurityRemediationTask,
  ProductPlanPricing,
  ProductDefinitionItem,
  ProductAddOn,
  ProductReleaseItem,
  ClientTenantUser,
  UserAccountRecord,
  CMSContentItem,
  CMSPageItem,
  CMSSectionBlock,
  CMSNavigationItem,
  CMSMediaAssetItem,
  CMSInboundLeadItem,
  CMSAnnouncementBanner,
  DataMigrationPlan,
  SalesOpportunity,
  RoleWorkItem,
  InvoiceRecord,
  TransactionRecord,
  EngineeringChange,
  ReportContractItem,
  DomainCoverageMetric,
} from './types/workspaces';
import {
  mockCustomerProfiles,
  mockCustomerHealth,
  mockCustomerActions,
  mockSupportTickets,
  mockSalesOpportunities,
  mockPricingPlans,
  mockInvoices,
  mockTransactions,
  mockErrorGroups,
  mockIncidents,
  mockEngineeringChanges,
  mockSLOs,
  mockSecurityRemediations,
  mockSecurityAssurance,
  mockRegulatoryInstruments,
  mockProducts,
  mockProductReleases,
  mockProductAddOns,
  mockClientTenantUsers,
  mockUserAccounts,
  mockPlatformServices,
  mockDataMigrations,
  mockReportContracts,
  mockExports,
  mockNotifications,
  mockWorkItems,
  mockAuditEvents,
  mockDomainCoverage,
  mockCMSContent,
  mockCMSPages,
  mockCMSBlocks,
  mockCMSNav,
  mockCMSMedia,
  mockCMSLeads,
  mockCMSBanner,
} from './data/workspaceData';

export function App() {
  // Active workspace state (defaults to 1. Command Center)
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceId>('command-center');

  // Application Data States with CRUD mutators
  const [customers, setCustomers] = useState<CustomerProfile[]>(INTERNAL_DEMO_MODE ? mockCustomerProfiles : []);
  const [customerHealth, setCustomerHealth] = useState(INTERNAL_DEMO_MODE ? mockCustomerHealth : []);
  const [customerActions, setCustomerActions] = useState(INTERNAL_DEMO_MODE ? mockCustomerActions : []);
  const [supportTickets, setSupportTickets] = useState(INTERNAL_DEMO_MODE ? mockSupportTickets : []);
  const [opportunities, setOpportunities] = useState<SalesOpportunity[]>(INTERNAL_DEMO_MODE ? mockSalesOpportunities : []);
  const [pricingPlans, setPricingPlans] = useState<ProductPlanPricing[]>(INTERNAL_DEMO_MODE ? mockPricingPlans : []);
  const [invoices, setInvoices] = useState(INTERNAL_DEMO_MODE ? mockInvoices : []);
  const [transactions, setTransactions] = useState(INTERNAL_DEMO_MODE ? mockTransactions : []);
  const [errorGroups, setErrorGroups] = useState(INTERNAL_DEMO_MODE ? mockErrorGroups : []);
  const [incidents, setIncidents] = useState(INTERNAL_DEMO_MODE ? mockIncidents : []);
  const [changes, setChanges] = useState(INTERNAL_DEMO_MODE ? mockEngineeringChanges : []);
  const [slos, setSlos] = useState(INTERNAL_DEMO_MODE ? mockSLOs : []);
  const [remediations, setRemediations] = useState<SecurityRemediationTask[]>(INTERNAL_DEMO_MODE ? mockSecurityRemediations : []);
  const [assurance, setAssurance] = useState(INTERNAL_DEMO_MODE ? mockSecurityAssurance : []);
  const [instruments, setInstruments] = useState(INTERNAL_DEMO_MODE ? mockRegulatoryInstruments : []);
  const [products, setProducts] = useState<ProductDefinitionItem[]>(INTERNAL_DEMO_MODE ? mockProducts : []);
  const [releases, setReleases] = useState(INTERNAL_DEMO_MODE ? mockProductReleases : []);
  const [addOns, setAddOns] = useState<ProductAddOn[]>(INTERNAL_DEMO_MODE ? mockProductAddOns : []);
  const [clientUsers, setClientUsers] = useState<ClientTenantUser[]>(INTERNAL_DEMO_MODE ? mockClientTenantUsers : []);
  const [users, setUsers] = useState<UserAccountRecord[]>(INTERNAL_DEMO_MODE ? mockUserAccounts : []);
  const [services, setServices] = useState(INTERNAL_DEMO_MODE ? mockPlatformServices : []);
  const [migrations, setMigrations] = useState<DataMigrationPlan[]>(INTERNAL_DEMO_MODE ? mockDataMigrations : []);
  const [reports, setReports] = useState(INTERNAL_DEMO_MODE ? mockReportContracts : []);
  const [exportsList, setExportsList] = useState(INTERNAL_DEMO_MODE ? mockExports : []);
  const [notifications, setNotifications] = useState(INTERNAL_DEMO_MODE ? mockNotifications : []);
  const [workItems, setWorkItems] = useState<RoleWorkItem[]>(INTERNAL_DEMO_MODE ? mockWorkItems : []);
  const [auditEvents, setAuditEvents] = useState(INTERNAL_DEMO_MODE ? mockAuditEvents : []);
  const [coverage, setCoverage] = useState(INTERNAL_DEMO_MODE ? mockDomainCoverage : []);
  const [cmsArticles, setCmsArticles] = useState<CMSContentItem[]>(INTERNAL_DEMO_MODE ? mockCMSContent : []);
  const [cmsPages, setCmsPages] = useState<CMSPageItem[]>(INTERNAL_DEMO_MODE ? mockCMSPages : []);
  const [cmsBlocks, setCmsBlocks] = useState<CMSSectionBlock[]>(INTERNAL_DEMO_MODE ? mockCMSBlocks : []);
  const [cmsNavItems, setCmsNavItems] = useState<CMSNavigationItem[]>(INTERNAL_DEMO_MODE ? mockCMSNav : []);
  const [cmsMedia, setCmsMedia] = useState<CMSMediaAssetItem[]>(INTERNAL_DEMO_MODE ? mockCMSMedia : []);
  const [cmsLeads, setCmsLeads] = useState<CMSInboundLeadItem[]>(INTERNAL_DEMO_MODE ? mockCMSLeads : []);
  const [cmsBanner, setCmsBanner] = useState<CMSAnnouncementBanner | null>(INTERNAL_DEMO_MODE ? mockCMSBanner : null);

  // Live Website Preview modal state
  const [isLivePreviewOpen, setIsLivePreviewOpen] = useState<boolean>(false);
  const [livePreviewPage, setLivePreviewPage] = useState<CMSPageItem | null>(null);
  const [livePreviewArticle, setLivePreviewArticle] = useState<CMSContentItem | null>(null);

  // Upgrade Modal Tenant Target
  const [upgradeTargetTenantId, setUpgradeTargetTenantId] = useState<string>(customers[0]?.tenant_id || '');

  // Modals & Drawers
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(false);
  const [inspectedEntity, setInspectedEntity] = useState<InspectorEntity | null>(null);

  // Dynamic Editor Modals
  const [activeEditorModal, setActiveEditorModal] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authoritative Core snapshot for Internal Command Center.
  const [coreSnapshot, setCoreSnapshot] = useState<InternalCommandCenterSnapshot | null>(null);
  const [coreConnectionError, setCoreConnectionError] = useState<string | null>(null);
  const [coreCryptoTelemetry, setCoreCryptoTelemetry] = useState<InternalCryptoTelemetry | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [snapshotResult, cryptoResult, customerResult, customerHealthResult, supportResult, salesResult, invoicesResult, transactionsResult, engineeringResult, engineeringErrorsResult, securityResult, productResult, dataResult, migrationResult, platformResult, reportsResult, exportsResult, notificationsResult, workResult, coverageResult, peopleResult, accountsResult, cmsOverviewResult, cmsPagesResult, cmsMediaResult, auditResult] = await Promise.allSettled([
          coreApi.getCommandCenter(),
          coreApi.getCryptoTelemetry(),
          coreApi.getCustomers(),
          coreApi.getCustomerHealth(),
          coreApi.getSupportTickets(),
          coreApi.getSalesOpportunities(),
          coreApi.getInvoices(),
          coreApi.getTransactions(),
          coreApi.getEngineeringDomain(),
          coreApi.getEngineeringErrors(),
          coreApi.getSecurityDomain(),
          coreApi.getProductDomain(),
          coreApi.getDataDomain(),
          coreApi.getMigrationDomain(),
          coreApi.getPlatformDomain(),
          coreApi.getReports(),
          coreApi.getExports(),
          coreApi.getNotifications(),
          coreApi.getWorkItems(),
          coreApi.getCoverageDomain(),
          coreApi.getPeople(),
          coreApi.getInternalAccounts(),
          coreApi.getCmsOverview(),
          coreApi.getCmsPages(),
          coreApi.getCmsMedia(),
          coreApi.getAuditLog(),
        ]);
        if (cancelled) return;
        if (snapshotResult.status === 'fulfilled') setCoreSnapshot(snapshotResult.value);
        if (cryptoResult.status === 'fulfilled') setCoreCryptoTelemetry(cryptoResult.value);
        if (customerResult.status === 'fulfilled') {
          setCustomers((customerResult.value.items ?? []).map((x: any): CustomerProfile => ({ tenant_id: String(x.tenant_id), display_name: x.display_name ?? x.tenant_id ?? '—', plan: x.plan ?? '—', status: (x.status ? String(x.status).toLowerCase() : 'active') as CustomerProfile['status'], healthScore: Number(x.healthScore ?? x.health_score ?? 0), asset_count: Number(x.asset_count ?? 0), remediations: Number(x.remediations ?? 0), evidence_objects: Number(x.evidence_objects ?? 0), subscriptionPlan: x.subscriptionPlan ?? x.plan ?? '—', subscriptionStatus: x.subscriptionStatus ?? '—', mrr: Number(x.mrr ?? 0), invoice_count: Number(x.invoice_count ?? 0), payment_count: Number(x.payment_count ?? 0), tier: (x.tier ?? 'Starter') as CustomerProfile['tier'], owner: x.owner ?? '—', seats_allocated: Number(x.seats_allocated ?? x.seats_total ?? 0), seats_used: Number(x.seats_used ?? 0), billing_model: (x.billing_model ?? 'flat_monthly') as CustomerProfile['billing_model'], billing_cycle: (x.billing_cycle ?? 'monthly') as CustomerProfile['billing_cycle'], price_per_seat_monthly: x.price_per_seat_monthly != null ? Number(x.price_per_seat_monthly) : undefined, active_addons: x.active_addons ?? [] })));
        }
        if (customerHealthResult.status === 'fulfilled') setCustomerHealth((customerHealthResult.value.items ?? []).map((x: any) => ({ tenant_id: x.tenant_id, score: Number(x.score ?? 0), status: x.status ?? 'Unknown', product_usage: Number(x.product_usage ?? 0), support_health: Number(x.support_health ?? 0), billing_health: Number(x.billing_health ?? 0), renewal_health: Number(x.renewal_health ?? 0), updated_at: x.updated_at ?? '' })) as any);
        if (supportResult.status === 'fulfilled') setSupportTickets((supportResult.value.items ?? []).map((x: any) => ({ id: String(x.id), ticket_number: x.ticket_number, tenant_id: x.tenant_id, subject: x.subject, priority: x.priority, status: String(x.status).toLowerCase(), created_at: x.created_at, updated_at: x.updated_at, assigned_to: x.assigned_to ?? '—', description: x.description ?? '' })) as any);
        if (engineeringErrorsResult.status === 'fulfilled') { const data = engineeringErrorsResult.value; setErrorGroups((data.error_groups ?? data.items ?? []).map((x: any) => ({ id: String(x.id ?? x.group_key ?? x.error_key), message: x.message ?? x.title ?? '—', service: x.service ?? 'Core', occurrences: Number(x.occurrences ?? x.count ?? 0), last_seen: x.last_seen ?? x.updated_at ?? '', severity: x.severity ?? 'Unknown', status: x.status ?? 'Open' })) as any); }
        if (dataResult.status === 'fulfilled') { const d = dataResult.value ?? {}; if (Array.isArray(d.migrations)) setMigrations(d.migrations as any); }
        if (migrationResult.status === 'fulfilled') { const d = migrationResult.value ?? {}; setMigrations((d.items ?? d.migrations ?? []).map((x: any) => ({ plan_key: String(x.plan_key ?? x.id), dataset: x.dataset ?? x.name ?? 'Migration', status: x.status ?? 'Unknown', progress_pct: Number(x.progress_pct ?? x.progress ?? 0), owner: x.owner_principal_id ?? '—', started_at: x.started_at ?? x.created_at ?? '', completed_at: x.completed_at ?? '', notes: x.notes ?? '' })) as DataMigrationPlan[]); }
        if (platformResult.status === 'fulfilled') { const d = platformResult.value ?? {}; const rows = d.services ?? d.items ?? []; setServices(rows.map((x: any) => ({ id: String(x.id ?? x.service_key), service_key: x.service_key ?? x.key ?? String(x.id ?? ''), name: x.name ?? x.display_name ?? '—', status: x.status ?? 'Unknown', latency_ms: x.latency_ms ?? null, last_checked_at: x.last_checked_at ?? x.checked_at ?? '' })) as any); }
        if (exportsResult.status === 'fulfilled') { const d = exportsResult.value ?? {}; setExportsList((d.items ?? d.exports ?? []).map((x: any) => ({ id: String(x.id ?? x.export_key), name: x.name ?? x.label ?? 'Export', format: x.format ?? 'JSON', status: x.status ?? 'Unknown', created_at: x.created_at ?? '', completed_at: x.completed_at ?? '', download_url: x.download_url ?? x.url ?? '' })) as any); }
        if (peopleResult.status === 'fulfilled' || accountsResult.status === 'fulfilled') { const rows = peopleResult.status === 'fulfilled' ? peopleResult.value.items ?? [] : accountsResult.status === 'fulfilled' ? accountsResult.value.items ?? [] : []; setUsers(rows.map((x: any) => ({ id: String(x.id), display_name: x.display_name ?? x.email ?? '—', email: x.email ?? '', role: x.role ?? '—', status: x.status ?? 'ACTIVE', department: x.department ?? '—', title: x.title ?? '—', mfa_enabled: Boolean(x.mfa_enabled), last_login: x.last_login ?? x.last_login_at ?? '—', scopes: x.scopes ?? [] })) as UserAccountRecord[]); }
        if (cmsPagesResult.status === 'fulfilled') { const d = cmsPagesResult.value ?? {}; setCmsPages((d.items ?? []).map((x: any) => ({ id: String(x.id), title: x.title ?? x.content_key ?? x.canonical_slug ?? 'Page', path: x.canonical_slug ?? '/', status: x.status ?? 'DRAFT', updated_at: x.updated_at ?? '', content_key: x.content_key ?? '', source_locale: x.source_locale ?? 'en' })) as CMSPageItem[]); }
        if (cmsMediaResult.status === 'fulfilled') { const d = cmsMediaResult.value ?? {}; setCmsMedia((d.items ?? []).map((x: any) => ({ id: String(x.id), name: x.filename ?? x.asset_key ?? 'Media', url: x.storage_ref ?? '', type: x.media_type ?? 'unknown', status: x.status ?? 'ACTIVE', created_at: x.created_at ?? '' })) as any); }
        if (auditResult.status === 'fulfilled') { const d = auditResult.value ?? {}; setAuditEvents((d.items ?? []).map((x: any) => ({ id: String(x.id), action: x.action ?? 'event', actor: x.actor ?? '—', target: x.resource_ref ?? '—', timestamp: x.created_at ?? '', decision: x.decision ?? '—', event_hash: x.event_hash ?? '' })) as any); }
        if (salesResult.status === 'fulfilled') { const items = salesResult.value.items ?? []; setOpportunities(items.map((x: any) => ({ id: String(x.id), account_name: x.account_name ?? '—', stage: x.stage ?? 'Discovery', amount: Number(x.amount?.major ?? 0), probability_pct: Number(x.probability_pct ?? 0), expected_close_at: x.expected_close_at ?? '', owner: x.owner_principal_id ?? '—', plan: x.plan ?? '—' })) as SalesOpportunity[]); }
        if (invoicesResult.status === 'fulfilled') { const items = invoicesResult.value.items ?? []; setInvoices(items.map((x: any) => ({ id: String(x.id), invoice_number: x.invoice_number, tenant_id: x.tenant_id, customerName: x.tenant_id ?? '—', status: String(x.status).toLowerCase() === 'paid' ? 'paid' : String(x.status).toLowerCase() === 'overdue' ? 'overdue' : String(x.status).toLowerCase() === 'void' ? 'void' : 'open', amount: Number(x.amount?.major ?? 0), due_at: x.due_at ?? '', created_at: x.issued_at ?? '', external_reference: x.invoice_number ?? '', payment_method: '—' })) as InvoiceRecord[]); }
        if (transactionsResult.status === 'fulfilled') { const items = transactionsResult.value.items ?? []; setTransactions(items.map((x: any) => ({ id: String(x.id), reference: x.external_reference ?? String(x.id), invoice_number: x.invoice_id ? String(x.invoice_id) : '—', tenant_id: x.tenant_id, amount: Number(x.amount?.major ?? 0), status: String(x.status).toLowerCase() === 'succeeded' ? 'succeeded' : String(x.status).toLowerCase() === 'failed' ? 'failed' : 'processing', payment_method: x.payment_method ?? '—', gateway: 'Core payment ledger', timestamp: x.created_at ?? '' })) as TransactionRecord[]); }
        if (engineeringResult.status === 'fulfilled') { const data = engineeringResult.value; setChanges((data.changes ?? []).map((x: any) => ({ change_key: String(x.change_key), title: x.title ?? '—', service: 'Core', status: String(x.status).toUpperCase() === 'APPROVED' ? 'deployed' : 'in_progress', risk: String(x.risk_level ?? 'MEDIUM').toLowerCase(), author: x.requested_by ?? '—', timestamp: x.updated_at ?? '' })) as EngineeringChange[]); setIncidents((data.incidents ?? []).map((x: any) => ({ id: String(x.id), incident_key: x.incident_key, title: x.title, severity: x.severity, status: x.status, tenant_id: x.tenant_id ?? '', created_at: x.created_at, updated_at: x.updated_at, owner: x.owner_principal_id ?? '—', description: '' })) as EngineeringIncident[]); setSlos((data.slos ?? []).map((x: any) => ({ service_key: x.service_key, metric: x.metric, target_pct: Number(x.target ?? 0), current_pct: Number(x.target ?? 0), burn_rate: 0, status: 'healthy' })) as any); }
        if (securityResult.status === 'fulfilled') { const data = securityResult.value; setRemediations((data.remediations ?? []).map((x: any) => ({ id: String(x.id), title: x.title ?? x.finding_key ?? 'Remediation', severity: x.severity ?? 'Medium', cloud_account: '—', asset: x.asset_external_id ?? '—', status: String(x.status).toUpperCase() === 'RESOLVED' ? 'Resolved' : 'Open', sla_days_left: x.due_at ? Math.ceil((new Date(x.due_at).getTime() - Date.now()) / 86400000) : 0, framework: 'Core' })) as SecurityRemediationTask[]); setAssurance((data.assurance_runs ?? []).map((x: any) => ({ id: String(x.run_id), title: x.mode ?? 'Assurance run', scope: 'Core', result: String(x.overall).toLowerCase() === 'pass' ? 'Pass' : String(x.overall).toLowerCase() === 'fail' ? 'Fail' : 'Partial', last_run: x.created_at ?? '', evidence_count: 0, automated: true })) as any); }
        if (productResult.status === 'fulfilled') { const data = productResult.value; setProducts((data.products ?? []).map((x: any) => ({ id: x.product_code, name: x.display_name, code: x.product_code, category: x.category ?? 'Discovery & CBOM', description: '', features: [], features_count: Number(data.features?.filter((f: any) => f.product_code === x.product_code).length ?? 0), active_plans: Number(data.plans?.filter((p: any) => p.product_code === x.product_code && p.active).length ?? 0), entitlements_count: Number(data.entitlements?.filter((e: any) => e.product_code === x.product_code).length ?? 0), status: String(x.status).toUpperCase() === 'ACTIVE' ? 'GA' : 'Beta', lead: '—', sla_target: '—', supported_addons: [], supported_billing_models: [], price_range_display: '—', created_at: '' })) as ProductDefinitionItem[]); setReleases((data.releases ?? []).map((x: any) => ({ version: x.version_label, title: x.title ?? x.product_code ?? 'Release', target_date: x.released_at ?? '', status: String(x.status).toUpperCase() === 'SHIPPED' ? 'Shipped' : String(x.status).toUpperCase() === 'IN_PROGRESS' ? 'In Progress' : 'Planned', initiatives: '' })) as ProductReleaseItem[]); setAddOns((data.addons ?? []).map((x: any) => ({ id: `${x.product_code}:${x.addon_code}`, code: x.addon_code, name: x.display_name, category: 'Storage & Vault', description: '', pricing_model: 'flat_monthly', price_monthly: Number(x.monthly_amount_minor ?? 0), price_annual: Number(x.annual_amount_minor ?? 0), unit_label: '—', min_quantity: 1, compatible_products: [x.product_code], active: Boolean(x.active), features_included: [] })) as ProductAddOn[]); }
        if (reportsResult.status === 'fulfilled') setReports((reportsResult.value.available ?? []).map((x: any) => ({ id: x.key, title: x.label, type: 'Executive Brief', format: x.formats?.[0] ?? 'JSON', frequency: 'On-Demand', last_generated: '', available: true })) as ReportContractItem[]);
        if (notificationsResult.status === 'fulfilled') setNotifications((notificationsResult.value.items ?? []).map((x: any) => ({ id: String(x.id), status: x.read_at ? 'read' : 'unread', title: x.title ?? x.subject ?? 'Notification', category: x.category ?? 'Operations', created_at: x.created_at ?? '', details: x.details ?? x.body ?? '', action_url: x.action_url })) as any);
        if (workResult.status === 'fulfilled') setWorkItems((workResult.value.items ?? []).map((x: any) => ({ id: String(x.id), status: x.status ?? 'Pending', title: x.title ?? 'Work item', domain: x.domain ?? 'Core', priority: x.priority ?? 'Normal', created_at: x.created_at ?? '', due_date: x.due_date ?? '' })) as RoleWorkItem[]);
        if (coverageResult.status === 'fulfilled') { const sections = coverageResult.value ?? {}; const coverageItems: DomainCoverageMetric[] = []; for (const [domain, value] of Object.entries(sections)) { if (!value || typeof value !== 'object' || Array.isArray(value)) continue; const total = Object.values(value as Record<string, unknown>).filter((v) => typeof v === 'number').reduce((a, v) => a + Number(v), 0); coverageItems.push({ domain, entities_mapped: total, coverage_pct: total > 0 ? 100 : 0, freshness_seconds: 0, status: total > 0 ? 'Optimal' : 'Partial' }); } setCoverage(coverageItems); }
        const coreCalls = [snapshotResult, cryptoResult, customerResult, customerHealthResult, supportResult, salesResult, invoicesResult, transactionsResult, engineeringResult, engineeringErrorsResult, securityResult, productResult, dataResult, migrationResult, platformResult, reportsResult, exportsResult, notificationsResult, workResult, coverageResult, peopleResult, accountsResult, cmsOverviewResult, cmsPagesResult, cmsMediaResult, auditResult];
        const failures = coreCalls.filter((x) => x.status === 'rejected');
        setCoreConnectionError(failures.length === coreCalls.length ? 'Core tidak dapat menyediakan data Internal.' : failures.length > 0 ? `${failures.length} dari ${coreCalls.length} sumber Core tidak tersedia. Data yang gagal tidak diisi dari fixture atau fallback sintetis.` : null);
      } catch (error) { if (!cancelled) setCoreConnectionError(error instanceof Error ? error.message : 'Core connection failed'); }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  const showToast = (message: string, _type?: string) => { setToastMessage(message); setTimeout(() => { setToastMessage(null); }, 4000); };
  const handleOpenCreateModal = (modalType: string, initialData?: any) => { setEditingData(initialData || null); setActiveEditorModal(modalType); };
  const handleCloseEditor = () => { setActiveEditorModal(null); setEditingData(null); };

  // Local-only editors remain explicitly blocked in production until their Core contracts are wired.
  const ensureProductionMutationContract = () => {
    if (INTERNAL_DEMO_MODE) return true;
    showToast('This local editor is disabled in production until its Core mutation contract is wired.');
    return false;
  };

  const handleSaveCustomer = (customer: CustomerProfile) => { if (!ensureProductionMutationContract()) return; setCustomers((prev) => { const idx = prev.findIndex((c) => c.tenant_id === customer.tenant_id); if (idx >= 0) { const next = [...prev]; next[idx] = customer; return next; } return [customer, ...prev]; }); showToast(`Tenant "${customer.display_name}" updated successfully`); };
  const handleSaveIncident = (incident: EngineeringIncident) => { if (!ensureProductionMutationContract()) return; setIncidents((prev) => { const idx = prev.findIndex((i) => i.incident_key === incident.incident_key); if (idx >= 0) { const next = [...prev]; next[idx] = incident; return next; } return [incident, ...prev]; }); showToast(`Incident "${incident.incident_key}" saved to active triage`); };
  const handleSaveRemediation = (rem: SecurityRemediationTask) => { if (!ensureProductionMutationContract()) return; setRemediations((prev) => { const idx = prev.findIndex((r) => r.id === rem.id); if (idx >= 0) { const next = [...prev]; next[idx] = rem; return next; } return [rem, ...prev]; }); showToast(`Remediation task "${rem.id}" updated`); };

  const handleSavePlan = async (plan: ProductPlanPricing) => {
    if (INTERNAL_DEMO_MODE) {
      setPricingPlans((prev) => { const idx = prev.findIndex((p) => p.id === plan.id || p.plan_code === plan.plan_code); if (idx >= 0) { const next = [...prev]; next[idx] = plan; return next; } return [plan, ...prev]; });
      showToast(`Plan "${plan.display_name}" updated in demo mode`);
      return;
    }
    if (!plan.product_code || !plan.plan_code) { showToast('Pricing plan is missing product_code or plan_code.'); return; }
    try {
      await coreApi.updatePricing(plan.product_code, plan.plan_code, {
        monthly_amount_minor: Number(plan.monthly_amount_minor ?? 0),
        annual_amount_minor: Number(plan.annual_amount_minor ?? 0),
        active: Boolean(plan.active),
      });
      const readback = await coreApi.getPricing();
      const row = (readback.items ?? []).find((x: any) => x.product_code === plan.product_code && x.plan_code === plan.plan_code);
      if (!row) throw new Error('Core pricing readback did not contain the updated plan');
      const authoritative: ProductPlanPricing = {
        ...plan,
        display_name: row.display_name ?? plan.display_name,
        currency: row.currency ?? plan.currency,
        monthly_amount_minor: Number(row.monthly?.minor ?? plan.monthly_amount_minor ?? 0),
        annual_amount_minor: Number(row.annual?.minor ?? plan.annual_amount_minor ?? 0),
        active: Boolean(row.active),
        version: String(row.version ?? plan.version),
      };
      setPricingPlans((prev) => { const idx = prev.findIndex((p) => p.product_code === authoritative.product_code && p.plan_code === authoritative.plan_code); if (idx >= 0) { const next = [...prev]; next[idx] = authoritative; return next; } return [authoritative, ...prev]; });
      showToast(`Plan "${authoritative.display_name}" saved to NusaSec-Core`);
    } catch (error) {
      showToast(`Pricing save failed: ${error instanceof Error ? error.message : 'Core request failed'}`);
    }
  };

  const handleSaveUser = (user: UserAccountRecord) => { if (!ensureProductionMutationContract()) return; setUsers((prev) => { const idx = prev.findIndex((u) => u.id === user.id); if (idx >= 0) { const next = [...prev]; next[idx] = user; return next; } return [user, ...prev]; }); showToast(`User account "${user.display_name}" saved`); };
  const handleSaveCMS = (art: CMSContentItem) => { if (!ensureProductionMutationContract()) return; setCmsArticles((prev) => { const idx = prev.findIndex((a) => a.id === art.id); if (idx >= 0) { const next = [...prev]; next[idx] = art; return next; } return [art, ...prev]; }); showToast(`Article "${art.title}" updated in CMS`); };
  const handleSaveCMSPage = (page: CMSPageItem) => { if (!ensureProductionMutationContract()) return; setCmsPages((prev) => { const idx = prev.findIndex((p) => p.id === page.id); if (idx >= 0) { const next = [...prev]; next[idx] = page; return next; } return [page, ...prev]; }); showToast(`Website page "${page.title}" (${page.path}) updated successfully`); };
  const handleSaveCMSBlock = (block: CMSSectionBlock) => { if (!ensureProductionMutationContract()) return; setCmsBlocks((prev) => { const idx = prev.findIndex((b) => b.id === block.id); if (idx >= 0) { const next = [...prev]; next[idx] = block; return next; } return [block, ...prev]; }); showToast(`Section block "${block.name}" saved to component registry`); };
  const handleSaveCMSNav = (nav: CMSNavigationItem) => { if (!ensureProductionMutationContract()) return; setCmsNavItems((prev) => { const idx = prev.findIndex((n) => n.id === nav.id); if (idx >= 0) { const next = [...prev]; next[idx] = nav; return next; } return [...prev, nav]; }); showToast(`Navigation item "${nav.label}" updated`); };
  const handleSaveCMSMedia = (media: CMSMediaAssetItem) => { if (!ensureProductionMutationContract()) return; setCmsMedia((prev) => [media, ...prev]); showToast(`Media asset "${media.name}" uploaded to CDN`); };
  const handleCreateLead = (lead: CMSInboundLeadItem) => { if (!ensureProductionMutationContract()) return; setCmsLeads((prev) => [lead, ...prev]); showToast(`🚀 Inbound inquiry received from ${lead.full_name} (${lead.company})! Added to pipeline.`, 'success'); };
  const handleUpdateLeadStatus = (leadId: string, newStatus: any) => { if (!ensureProductionMutationContract()) return; setCmsLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))); };
  const handleOpenLivePreview = (page?: CMSPageItem | null, article?: CMSContentItem | null) => { setLivePreviewPage(page || cmsPages[0] || null); setLivePreviewArticle(article || null); setIsLivePreviewOpen(true); };
  const handleSaveMigration = (mig: DataMigrationPlan) => { if (!ensureProductionMutationContract()) return; setMigrations((prev) => { const idx = prev.findIndex((m) => m.plan_key === mig.plan_key); if (idx >= 0) { const next = [...prev]; next[idx] = mig; return next; } return [mig, ...prev]; }); showToast(`Data migration plan "${mig.dataset}" saved`); };

  const handleSaveOpportunity = async (opp: SalesOpportunity) => {
    if (INTERNAL_DEMO_MODE) {
      setOpportunities((prev) => { const idx = prev.findIndex((o) => o.id === opp.id); if (idx >= 0) { const next = [...prev]; next[idx] = opp; return next; } return [opp, ...prev]; });
      showToast(`Opportunity for "${opp.account_name}" updated in demo mode`);
      return;
    }
    const payload: Record<string, unknown> = {
      account_name: opp.account_name,
      stage: opp.stage,
      amount_minor: Math.round(Number(opp.amount ?? 0) * 100),
      probability_pct: Number(opp.probability_pct ?? 0),
      expected_close_at: opp.expected_close_at || null,
      owner_principal_id: opp.owner || null,
    };
    try {
      const rawId = Number(opp.id);
      const result = Number.isFinite(rawId) && rawId > 0
        ? await coreApi.updateSalesOpportunity(rawId, payload)
        : await coreApi.createSalesOpportunity(payload);
      const authoritative: SalesOpportunity = {
        id: String(result.id),
        account_name: result.account_name ?? opp.account_name,
        stage: result.stage ?? opp.stage,
        amount: Number(result.amount?.major ?? (Number(result.amount_minor ?? payload.amount_minor ?? 0) / 100)),
        probability_pct: Number(result.probability_pct ?? opp.probability_pct ?? 0),
        expected_close_at: result.expected_close_at ?? opp.expected_close_at ?? '',
        owner: result.owner_principal_id ?? opp.owner ?? '—',
        plan: opp.plan ?? '—',
      };
      setOpportunities((prev) => { const idx = prev.findIndex((o) => o.id === authoritative.id); if (idx >= 0) { const next = [...prev]; next[idx] = authoritative; return next; } return [authoritative, ...prev]; });
      showToast(`Opportunity for "${authoritative.account_name}" saved to NusaSec-Core`);
    } catch (error) {
      showToast(`Opportunity save failed: ${error instanceof Error ? error.message : 'Core request failed'}`);
    }
  };

  const handleSaveProduct = (prod: ProductDefinitionItem) => { if (!ensureProductionMutationContract()) return; setProducts((prev) => { const idx = prev.findIndex((p) => p.id === prod.id || p.code === prod.code); if (idx >= 0) { const next = [...prev]; next[idx] = prod; return next; } return [prod, ...prev]; }); showToast(`Product "${prod.name}" catalog definition saved`); };
  const handleSaveAddOn = (addon: ProductAddOn) => { if (!ensureProductionMutationContract()) return; setAddOns((prev) => { const idx = prev.findIndex((a) => a.id === addon.id || a.code === addon.code); if (idx >= 0) { const next = [...prev]; next[idx] = addon; return next; } return [addon, ...prev]; }); showToast(`Add-On "${addon.name}" scheme published`); };
  const handleSaveClientUser = (user: ClientTenantUser) => { if (!ensureProductionMutationContract()) return; setClientUsers((prev) => { const idx = prev.findIndex((u) => u.id === user.id); if (idx >= 0) { const next = [...prev]; next[idx] = user; return next; } return [user, ...prev]; }); setCustomers((prev) => prev.map((c) => { if (c.tenant_id === user.tenant_id) { const tenantUsers = clientUsers.filter((u) => u.tenant_id === user.tenant_id && u.id !== user.id); const newTotal = tenantUsers.length + (user.status === 'active' ? 1 : 0); return { ...c, seats_used: newTotal }; } return c; })); if (user.status === 'seat_locked') showToast(`User ${user.name} added as SEAT LOCKED (Tenant over quota limit). Upgrade seats to unlock.`); else showToast(`Client team member "${user.name}" assigned active seat`); };
  const handleUpgradeSeats = (tenantId: string, additionalSeats: number, selectedAddOnCode?: string) => { if (!ensureProductionMutationContract()) return; setCustomers((prev) => prev.map((c) => { if (c.tenant_id === tenantId) { const currentAddons = c.active_addons || []; const updatedAddons = selectedAddOnCode && !currentAddons.includes(selectedAddOnCode) ? [...currentAddons, selectedAddOnCode] : currentAddons; return { ...c, seats_allocated: (c.seats_allocated || 10) + additionalSeats, active_addons: updatedAddons }; } return c; })); setClientUsers((prev) => { const tenantUsers = prev.filter((u) => u.tenant_id === tenantId); const lockedUsers = tenantUsers.filter((u) => u.status === 'seat_locked'); if (lockedUsers.length > 0) return prev.map((u) => u.tenant_id === tenantId && u.status === 'seat_locked' ? { ...u, status: 'active' as const, seat_assigned: true } : u); return prev; }); showToast(`Successfully expanded tenant quota by +${additionalSeats} seats and applied Add-On`); };
  const handleOpenUpgradeModal = (tenantId: string) => { setUpgradeTargetTenantId(tenantId); setActiveEditorModal('client_seat_upgrade'); };

  const handleSaveWorkItem = async (item: RoleWorkItem) => {
    if (INTERNAL_DEMO_MODE) {
      setWorkItems((prev) => { const idx = prev.findIndex((w) => w.id === item.id); if (idx >= 0) { const next = [...prev]; next[idx] = item; return next; } return [item, ...prev]; });
      showToast(`Work item "${item.id}" updated in demo mode`);
      return;
    }
    const payload: Record<string, unknown> = {
      work_key: item.id ? `UI-${item.id}` : `UI-${Date.now()}`,
      domain: item.domain,
      title: item.title,
      status: item.status,
      priority: item.priority,
      due_at: item.due_date || null,
      metadata_json: {},
    };
    try {
      const rawId = Number(item.id);
      const result = Number.isFinite(rawId) && rawId > 0
        ? await coreApi.updateWorkItem(rawId, { domain: item.domain, title: item.title, status: item.status, priority: item.priority, due_at: item.due_date || null })
        : await coreApi.createWorkItem(payload);
      const authoritative: RoleWorkItem = {
        id: String(result.id),
        status: result.status ?? item.status,
        title: result.title ?? item.title,
        domain: result.domain ?? item.domain,
        priority: result.priority ?? item.priority,
        created_at: item.created_at ?? '',
        due_date: result.due_at ?? item.due_date ?? '',
      };
      setWorkItems((prev) => { const idx = prev.findIndex((w) => w.id === authoritative.id); if (idx >= 0) { const next = [...prev]; next[idx] = authoritative; return next; } return [authoritative, ...prev]; });
      showToast(`Work item "${authoritative.id}" saved to NusaSec-Core`);
    } catch (error) {
      showToast(`Work item save failed: ${error instanceof Error ? error.message : 'Core request failed'}`);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsCommandPaletteOpen((prev) => !prev); } };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openQuantumScan = () => { if (!INTERNAL_DEMO_MODE) { showToast('Live Quantum Probe belum memiliki contract produksi yang terhubung ke Core; aksi dinonaktifkan.'); return; } setIsScanModalOpen(true); };
  const handleScanComplete = (endpoint: string) => { if (!INTERNAL_DEMO_MODE) return; showToast(`Demo scan discovered endpoint ${endpoint}`); };
  const unreadNotificationsCount = notifications.filter((n) => n.status === 'unread').length;
  const activeIncidentsCount = incidents.filter((i) => i.status !== 'Resolved').length;
  const viewCommonProps = { showToast, onNavigate: (id: WorkspaceId) => setActiveWorkspace(id), onInspect: (entity: InspectorEntity) => setInspectedEntity(entity), onOpenCreateModal: handleOpenCreateModal };

  return (
    <main className="w-full h-screen min-h-screen bg-white flex flex-col md:flex-row overflow-hidden relative select-none">
      <MobileHeader activeWorkspace={activeWorkspace} onSelectWorkspace={(id) => setActiveWorkspace(id)} onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} onTriggerAction={openQuantumScan} onOpenSandbox={() => setIsSandboxOpen(true)} unreadNotificationsCount={unreadNotificationsCount} openIncidentsCount={activeIncidentsCount} isDrawerOpen={isMobileDrawerOpen} setIsDrawerOpen={setIsMobileDrawerOpen} />
      <MobileNavDrawer activeWorkspace={activeWorkspace} onSelectWorkspace={(id) => setActiveWorkspace(id)} onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} onTriggerAction={openQuantumScan} onOpenSandbox={() => setIsSandboxOpen(true)} unreadNotificationsCount={unreadNotificationsCount} openIncidentsCount={activeIncidentsCount} isOpen={isMobileDrawerOpen} onClose={() => setIsMobileDrawerOpen(false)} />
      <SecurityNavRail activeWorkspace={activeWorkspace} onSelectWorkspace={(id) => setActiveWorkspace(id)} onOpenNotifications={() => setActiveWorkspace('notifications')} unreadNotificationsCount={unreadNotificationsCount} />
      <SecuritySidebar activeWorkspace={activeWorkspace} onSelectWorkspace={(id) => setActiveWorkspace(id)} onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} onTriggerAction={openQuantumScan} onOpenSandbox={() => setIsSandboxOpen(true)} unreadNotificationsCount={unreadNotificationsCount} openIncidentsCount={activeIncidentsCount} />
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden h-full">
        {activeWorkspace === 'command-center' && <CommandCenterView {...viewCommonProps} customers={customers} remediations={remediations} incidents={incidents} workItems={workItems} coreSnapshot={coreSnapshot} coreConnectionError={coreConnectionError} coreCryptoTelemetry={coreCryptoTelemetry} />}
        {activeWorkspace === 'customer-360' && <Customer360View {...viewCommonProps} customers={customers} />}
        {activeWorkspace === 'customer-success' && <CustomerSuccessView {...viewCommonProps} healthList={customerHealth} actionsList={customerActions} supportTickets={supportTickets} />}
        {activeWorkspace === 'sales-revenue' && <SalesRevenueView {...viewCommonProps} opportunities={opportunities} />}
        {activeWorkspace === 'pricing-control' && <PricingControlView {...viewCommonProps} plans={pricingPlans} />}
        {activeWorkspace === 'finance' && <FinanceView {...viewCommonProps} invoices={invoices} transactions={transactions} />}
        {activeWorkspace === 'engineering' && <EngineeringView {...viewCommonProps} errorGroups={errorGroups} incidents={incidents} changes={changes} slos={slos} />}
        {activeWorkspace === 'security' && <SecurityView {...viewCommonProps} remediations={remediations} assurance={assurance} />}
        {activeWorkspace === 'regulatory' && <RegulatoryView {...viewCommonProps} instruments={instruments} />}
        {activeWorkspace === 'product' && <ProductView {...viewCommonProps} products={products} plans={pricingPlans} releases={releases} addOns={addOns} clientUsers={clientUsers} customers={customers} />}
        {activeWorkspace === 'people-rbac' && <PeopleRBACView {...viewCommonProps} users={users} />}
        {activeWorkspace === 'platform' && <PlatformView {...viewCommonProps} services={services} />}
        {activeWorkspace === 'data-intelligence' && <DataIntelligenceView {...viewCommonProps} migrations={migrations} coverage={coverage} />}
        {activeWorkspace === 'reports-downloads' && <ReportsDownloadsView {...viewCommonProps} reports={reports} exports={exportsList} />}
        {activeWorkspace === 'notifications' && <NotificationsView {...viewCommonProps} notifications={notifications} />}
        {activeWorkspace === 'my-work' && <MyWorkView {...viewCommonProps} workItems={workItems} />}
        {activeWorkspace === 'audit' && <AuditView {...viewCommonProps} auditEvents={auditEvents} />}
        {activeWorkspace === 'coverage' && <CoverageView {...viewCommonProps} coverage={coverage} />}
        {activeWorkspace === 'cms' && <CMSView {...viewCommonProps} articles={cmsArticles} pages={cmsPages} blocks={cmsBlocks} navItems={cmsNavItems} mediaAssets={cmsMedia} inboundLeads={cmsLeads} announcement={cmsBanner} onOpenPageEditor={(page) => handleOpenCreateModal('cms_page', page)} onOpenBlockEditor={(block) => handleOpenCreateModal('cms_block', block)} onOpenNavEditor={(nav) => handleOpenCreateModal('cms_nav', nav)} onOpenMediaUpload={() => handleOpenCreateModal('cms_media')} onOpenLivePreview={handleOpenLivePreview} onUpdateLeadStatus={handleUpdateLeadStatus} />}
        <LiveTelemetryBar onOpenSandbox={() => setIsSandboxOpen(true)} onTriggerScan={() => setIsScanModalOpen(true)} onShowToast={showToast} />
      </div>
      <CommandPaletteModal isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} onSelectAction={(workspaceId) => { setActiveWorkspace(workspaceId); setIsCommandPaletteOpen(false); }} onTriggerScan={() => { setIsCommandPaletteOpen(false); setIsScanModalOpen(true); }} onOpenSandbox={() => { setIsCommandPaletteOpen(false); setIsSandboxOpen(true); }} onInspectEntity={(entity) => { setInspectedEntity(entity); }} customers={customers} incidents={incidents} remediations={remediations} plans={pricingPlans} />
      <PqcSandboxModal isOpen={isSandboxOpen} onClose={() => setIsSandboxOpen(false)} onShowToast={showToast} />
      {isScanModalOpen && <QuantumScanModal isOpen={isScanModalOpen} onClose={() => setIsScanModalOpen(false)} onScanComplete={handleScanComplete} />}
      {inspectedEntity && <DetailInspectorDrawer isOpen={!!inspectedEntity} entity={inspectedEntity} onClose={() => setInspectedEntity(null)} onAction={(action, ent) => { showToast(`Executed "${action}" on ${ent.title}`); }} />}
      <CustomerEditorModal isOpen={activeEditorModal === 'customer'} onClose={handleCloseEditor} onSave={handleSaveCustomer} initialData={editingData} />
      <IncidentEditorModal isOpen={activeEditorModal === 'incident'} onClose={handleCloseEditor} onSave={handleSaveIncident} initialData={editingData} />
      <SecurityRemediationModal isOpen={activeEditorModal === 'remediation'} onClose={handleCloseEditor} onSave={handleSaveRemediation} initialData={editingData} />
      <PricingPlanEditorModal isOpen={activeEditorModal === 'plan'} onClose={handleCloseEditor} onSave={handleSavePlan} initialData={editingData} />
      <UserAccountEditorModal isOpen={activeEditorModal === 'user'} onClose={handleCloseEditor} onSave={handleSaveUser} initialData={editingData} />
      <CMSArticleEditorModal isOpen={activeEditorModal === 'cms_article'} onClose={handleCloseEditor} onSave={handleSaveCMS} initialData={editingData} />
      <DataMigrationEditorModal isOpen={activeEditorModal === 'migration'} onClose={handleCloseEditor} onSave={handleSaveMigration} initialData={editingData} />
      <SalesOpportunityEditorModal isOpen={activeEditorModal === 'opportunity'} onClose={handleCloseEditor} onSave={handleSaveOpportunity} initialData={editingData} />
      <WorkItemEditorModal isOpen={activeEditorModal === 'work_item'} onClose={handleCloseEditor} onSave={handleSaveWorkItem} initialData={editingData} />
      <ProductEditorModal isOpen={activeEditorModal === 'product'} onClose={handleCloseEditor} onSave={handleSaveProduct} product={editingData} />
      <AddOnEditorModal isOpen={activeEditorModal === 'addon'} onClose={handleCloseEditor} onSave={handleSaveAddOn} addOn={editingData} />
      <ClientUserModal isOpen={activeEditorModal === 'client_user'} onClose={handleCloseEditor} customers={customers} onSave={handleSaveClientUser} onUpgradeSeats={handleOpenUpgradeModal} user={editingData} />
      <ClientSeatUpgradeModal isOpen={activeEditorModal === 'client_seat_upgrade'} onClose={handleCloseEditor} tenantId={upgradeTargetTenantId} customers={customers} addOns={addOns} onApplyUpgrade={handleUpgradeSeats} />
      <CMSPageEditorModal isOpen={activeEditorModal === 'cms_page'} onClose={handleCloseEditor} onSave={handleSaveCMSPage} initialData={editingData} allBlocks={cmsBlocks} />
      <CMSBlockEditorModal isOpen={activeEditorModal === 'cms_block'} onClose={handleCloseEditor} onSave={handleSaveCMSBlock} initialData={editingData} />
      <CMSNavEditorModal isOpen={activeEditorModal === 'cms_nav'} onClose={handleCloseEditor} onSave={handleSaveCMSNav} initialData={editingData} />
      <CMSMediaUploadModal isOpen={activeEditorModal === 'cms_media'} onClose={handleCloseEditor} onSave={handleSaveCMSMedia} />
      <LiveWebsitePreviewModal isOpen={isLivePreviewOpen} onClose={() => setIsLivePreviewOpen(false)} page={livePreviewPage} article={livePreviewArticle} allPages={cmsPages} allBlocks={cmsBlocks} navItems={cmsNavItems} announcement={cmsBanner} onNavigatePage={(p) => setLivePreviewPage(p)} onCreateLead={handleCreateLead} />
      {toastMessage && <div className="cyber-card absolute bottom-6 right-6 z-50 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200"><span className="w-2 h-2 rounded-full bg-cyan-400 glow-pulse-dot" /><span>{toastMessage}</span></div>}
    </main>
  );
}

export default App;
