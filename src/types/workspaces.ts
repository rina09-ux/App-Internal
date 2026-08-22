export type WorkspaceId =
  | 'command-center'
  | 'customer-360'
  | 'customer-success'
  | 'sales-revenue'
  | 'pricing-control'
  | 'finance'
  | 'engineering'
  | 'security'
  | 'regulatory'
  | 'product'
  | 'people-rbac'
  | 'platform'
  | 'data-intelligence'
  | 'reports-downloads'
  | 'notifications'
  | 'my-work'
  | 'audit'
  | 'coverage'
  | 'cms';

export interface WorkspaceMetadata {
  id: WorkspaceId;
  title: string;
  category: 'executive' | 'customer' | 'engineering' | 'governance' | 'organization';
  endpoint: string;
  goal: string;
  uiFormat: string;
}

export interface CustomerProfile {
  tenant_id: string;
  display_name: string;
  plan: string;
  status: 'active' | 'trialing' | 'delinquent' | 'suspended';
  healthScore: number;
  asset_count: number;
  remediations: number;
  evidence_objects: number;
  subscriptionPlan: string;
  subscriptionStatus: string;
  mrr: number;
  invoice_count: number;
  payment_count: number;
  tier: 'Enterprise' | 'Growth' | 'Scale' | 'Starter';
  owner: string;
  // Multi-user & Seat Licensing Attributes
  seats_allocated: number;
  seats_used: number;
  billing_model: 'per_user_monthly' | 'per_user_annual' | 'flat_monthly' | 'flat_annual' | 'unit_usage';
  billing_cycle: 'monthly' | 'annual';
  price_per_seat_monthly?: number;
  active_addons?: TenantAddOnSubscription[];
}

export interface TenantAddOnSubscription {
  addon_id: string;
  addon_code: string;
  name: string;
  category: string;
  quantity: number;
  price_monthly: number;
  price_annual: number;
  billing_cycle: 'monthly' | 'annual';
  activated_at: string;
}

export interface ClientTenantUser {
  id: string;
  tenant_id: string;
  tenant_name: string;
  name: string;
  email: string;
  role: 'Tenant Admin' | 'Crypto Security Officer' | 'Platform Engineer' | 'Audit Reader' | 'Developer';
  status: 'active' | 'seat_locked' | 'invited' | 'suspended';
  seat_assigned: boolean;
  mfa_enforced: boolean;
  joined_at: string;
  last_active: string;
}

export type PricingBillingModel =
  | 'per_user_monthly'
  | 'per_user_annual'
  | 'flat_monthly'
  | 'flat_annual'
  | 'unit_usage_monthly';

export type BillingCycle = 'monthly' | 'annual';

export interface ProductAddOn {
  id: string;
  code: string;
  name: string;
  category: 'HSM & Hardware' | 'Seat Booster' | 'Compliance & Audit' | 'Threat Simulation' | 'High-Bandwidth' | 'Storage & Vault';
  description: string;
  pricing_model: 'per_user_monthly' | 'per_user_annual' | 'flat_monthly' | 'flat_annual' | 'per_unit';
  price_monthly: number;
  price_annual: number;
  unit_label: string; // e.g. 'per user / month', 'per HSM cluster', 'per 5 seats pack', 'per 1M queries'
  min_quantity: number;
  max_quantity?: number;
  compatible_products: string[]; // product codes
  active: boolean;
  features_included: string[];
}

export interface CustomerHealthItem {
  id: string;
  tenant_id: string;
  customerName: string;
  score: number;
  status: 'healthy' | 'at_risk' | 'critical';
  product_usage: number; // %
  support_health: number; // %
  billing_health: number; // %
  renewal_health: number; // %
  renewalDate: string;
  csm: string;
}

export interface CustomerActionItem {
  id: string;
  tenant_id: string;
  customerName: string;
  action: string;
  priority: 'urgent' | 'high' | 'medium';
  due_date: string;
  owner: string;
  type: 'Executive Check-in' | 'Security Review' | 'Contract Renewal' | 'Escalation';
}

export interface SupportTicket {
  id: string;
  tenant_id: string;
  customerName: string;
  subject: string;
  severity: 'P1' | 'P2' | 'P3' | 'P4';
  status: 'Open' | 'Pending Engineering' | 'Resolved';
  created_at: string;
}

export interface SalesOpportunity {
  id: string;
  account_name: string;
  stage: 'Discovery' | 'Proposal' | 'Security Review' | 'Negotiation' | 'Closed Won';
  amount: number;
  probability_pct: number;
  expected_close_at: string;
  owner: string;
  plan: string;
}

export interface ProductPlanPricing {
  id: string;
  product_code: string;
  plan_code: string;
  display_name: string;
  currency: string;
  monthly_amount_minor: number; // e.g. base monthly amount or flat
  annual_amount_minor?: number; // e.g. discounted annual amount
  active: boolean;
  version: string;
  features_count: number;
  tier: string;
  // Multi-user & Pricing Model Specifications
  billing_model: 'per_user_monthly' | 'per_user_annual' | 'flat_monthly' | 'flat_annual' | 'unit_usage_monthly';
  price_per_user_monthly?: number; // USD per user / month
  price_per_user_annual?: number; // USD per user / year (e.g. 2 months free discount)
  included_seats: number; // default base seats included (e.g. 5, 20, 50, Unlimited)
  max_seats?: number; // hard ceiling before requiring enterprise upgrade
  unit_name?: string; // e.g. 'Users / Seats', 'KEM Handshake Units (10k)', 'Endpoints'
  supported_addons?: string[]; // Add-on codes supported
  annual_discount_pct?: number; // e.g. 15% - 20%
  description?: string;
}

export interface InvoiceRecord {
  id: string;
  invoice_number: string;
  tenant_id: string;
  customerName: string;
  status: 'paid' | 'open' | 'overdue' | 'void';
  amount: number;
  due_at: string;
  created_at: string;
  external_reference: string;
  payment_method: string;
}

export interface TransactionRecord {
  id: string;
  reference: string;
  invoice_number: string;
  tenant_id: string;
  amount: number;
  status: 'succeeded' | 'processing' | 'failed';
  payment_method: string;
  gateway: string;
  timestamp: string;
}

export interface EngineeringErrorGroup {
  id: string;
  service: string;
  environment: string;
  title: string;
  occurrences: number;
  users_affected: number;
  first_seen: string;
  last_seen: string;
  status: 'unresolved' | 'investigating' | 'resolved';
}

export interface EngineeringIncident {
  incident_key: string;
  severity: 'SEV-1' | 'SEV-2' | 'SEV-3' | 'SEV-4';
  title: string;
  service: string;
  status: 'Triggered' | 'Acknowledged' | 'Mitigating' | 'Resolved';
  lead: string;
  duration: string;
}

export interface EngineeringChange {
  change_key: string;
  title: string;
  service: string;
  status: 'deployed' | 'in_progress' | 'canary' | 'scheduled';
  risk: 'low' | 'medium' | 'high';
  author: string;
  timestamp: string;
}

export interface ServiceSLO {
  service_key: string;
  metric: string;
  target_pct: number;
  current_pct: number;
  burn_rate: number;
  status: 'healthy' | 'warning' | 'breached';
}

export interface SecurityRemediationTask {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  cloud_account: string;
  asset: string;
  status: 'Open' | 'In Progress' | 'Validating' | 'Resolved';
  sla_days_left: number;
  framework: string;
}

export interface SecurityAssuranceRun {
  id: string;
  title: string;
  scope: string;
  result: 'Pass' | 'Fail' | 'Partial';
  last_run: string;
  evidence_count: number;
  automated: boolean;
}

export interface RegulatoryInstrument {
  id: string;
  name: string;
  code: string;
  requirements_total: number;
  mapped_count: number;
  assessment_pct: number;
  pending_reviews: number;
  changes_detected: number;
  status: 'Compliant' | 'Review Required' | 'Non-Compliant';
}

export interface ProductDefinitionItem {
  id: string;
  name: string;
  code: string;
  category: 'Cryptography & Enclave' | 'Network & TLS Mesh' | 'Discovery & CBOM' | 'Identity & Zero Trust' | 'Hardware Security';
  description: string;
  features: string[];
  features_count: number;
  active_plans: number;
  entitlements_count: number;
  status: 'GA' | 'Beta' | 'Deprecated';
  lead: string;
  sla_target: string; // e.g. '99.999%'
  supported_addons: string[]; // Add-on codes
  supported_billing_models: string[];
  price_range_display: string; // e.g. '$45/user/mo or $450/user/yr'
  created_at: string;
}

export interface ProductReleaseItem {
  version: string;
  title: string;
  target_date: string;
  status: 'Planned' | 'In Progress' | 'Shipped';
  initiatives: string;
}

export interface UserAccountRecord {
  id: string;
  email: string;
  display_name: string;
  role: string;
  department: string;
  status: 'active' | 'invited' | 'suspended';
  mfa_enabled: boolean;
  last_login: string;
  scopes: string[];
}

export interface PlatformServiceStatus {
  service_name: string;
  group: 'Core Gateway' | 'Control Plane' | 'Data Pipeline' | 'Edge CDN' | 'Auth & KMS';
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  latency_ms: number;
  uptime_30d: number;
  updated: string;
}

export interface DataMigrationPlan {
  plan_key: string;
  dataset: string;
  current_algorithm: string;
  target_algorithm: string;
  records_total: number;
  records_migrated: number;
  state: 'In Progress' | 'Completed' | 'Pending Approval' | 'Blocked';
  approved_by: string;
  eta: string;
}

export interface ReportContractItem {
  id: string;
  title: string;
  type: 'SOC-2 Type II' | 'ISO 27001' | 'NIST PQC CBOM' | 'Financial Audit' | 'Executive Brief';
  format: 'PDF' | 'JSON' | 'CSV' | 'XLSX';
  frequency: 'Monthly' | 'Quarterly' | 'On-Demand';
  last_generated: string;
  available: boolean;
}

export interface ExportJobItem {
  id: string;
  export_type: string;
  format: string;
  status: 'Completed' | 'Processing' | 'Failed';
  created_at: string;
  size: string;
  requester: string;
}

export interface OperationalNotification {
  id: string;
  status: 'unread' | 'read';
  title: string;
  category: 'Security' | 'Finance' | 'Engineering' | 'Compliance' | 'Customer';
  created_at: string;
  details: string;
  action_url?: string;
}

export interface RoleWorkItem {
  id: string;
  status: 'Pending' | 'In Progress' | 'Blocked' | 'Completed';
  title: string;
  domain: string;
  priority: 'Urgent' | 'High' | 'Normal';
  created_at: string;
  due_date: string;
}

export interface AuditEventRecord {
  id: string;
  created_at: string;
  action: string;
  actor: string;
  resource_type: string;
  resource_id: string;
  decision: 'ALLOW' | 'DENY' | 'AUDITED';
  ip_address: string;
}

export interface DomainCoverageMetric {
  domain: string;
  entities_mapped: number;
  coverage_pct: number;
  freshness_seconds: number;
  status: 'Optimal' | 'Partial' | 'Stale';
}

export interface CMSContentItem {
  id: string;
  title: string;
  slug: string;
  locale: string;
  status: 'Published' | 'Draft' | 'In Review' | 'Archived';
  last_updated: string;
  author: string;
  seo_score: number;
  category?: string;
  read_time_minutes?: number;
  content?: string;
}

export interface CMSPageItem {
  id: string;
  title: string;
  slug: string;
  path: string; // e.g. '/', '/solutions/defense-cryptography', '/pricing'
  category: 'Core Landing' | 'Product & Solution' | 'Technology & Standards' | 'Trust & Compliance' | 'Resources & Docs' | 'Company & Legal';
  template: 'Landing Hero + Grid' | 'Product Deep Dive' | 'Solutions Matrix' | 'Pricing & Calculator' | 'Trust Center' | 'Documentation / Article' | 'Contact & Lead Form';
  meta_title: string;
  meta_description: string;
  og_image: string;
  status: 'Published' | 'Staged' | 'Draft' | 'Archived';
  locale: string;
  section_blocks: string[]; // block IDs or block names
  seo_score: number;
  visits_30d: number;
  conversion_rate_pct: number;
  last_published_at: string;
  author: string;
}

export interface CMSSectionBlock {
  id: string;
  name: string;
  block_type: 'Hero Banner' | 'Feature Grid' | 'Terminal Code Demo' | 'Customer Logos & Trust' | 'Algorithm Benchmark Matrix' | 'Pricing Configurator' | 'Testimonials' | 'FAQ Accordion' | 'Lead Capture Form' | 'CTA Ribbon';
  heading: string;
  subheading: string;
  badge_text?: string;
  cta_primary_label?: string;
  cta_primary_link?: string;
  attached_pages_count: number;
  status: 'Active' | 'Draft' | 'A/B Testing';
  last_modified: string;
}

export interface CMSNavigationItem {
  id: string;
  location: 'Header Top Bar' | 'Header Mega Menu' | 'Footer Column 1 (Solutions)' | 'Footer Column 2 (Developers)' | 'Footer Column 3 (Trust & Legal)' | 'Announcement Bar';
  label: string;
  url: string;
  badge?: string;
  is_external?: boolean;
  order_index: number;
  active: boolean;
  parent_id?: string;
}

export interface CMSMediaAssetItem {
  id: string;
  name: string;
  file_name: string;
  file_type: 'SVG Diagram' | 'PNG Graphic' | 'PDF Whitepaper' | 'WebP Hero' | 'JSON Schema';
  size_kb: number;
  cdn_url: string;
  category: 'Architecture Diagrams' | 'Product Screenshots' | 'Partner Badges' | 'Whitepapers' | 'Logos & Icons';
  alt_text: string;
  uploaded_at: string;
}

export interface CMSInboundLeadItem {
  id: string;
  form_type: 'Book Enterprise Demo' | 'Quantum Assessment Request' | 'Whitepaper Download' | 'Contact Sales' | 'Contact Support';
  full_name: string;
  email: string;
  company: string;
  role: string;
  country: string;
  message?: string;
  lead_score: 'Hot (Enterprise)' | 'Warm' | 'Evaluation' | 'Spam';
  status: 'New' | 'Qualified' | 'Contacted' | 'Closed Won' | 'Archived';
  page_source: string;
  submitted_at: string;
}

export interface CMSAnnouncementBanner {
  id: string;
  headline: string;
  cta_label: string;
  cta_url: string;
  variant: 'quantum_accent' | 'critical_security' | 'neutral' | 'emerald_compliance';
  active: boolean;
  start_date: string;
}
