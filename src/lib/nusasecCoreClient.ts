import { NUSASEC_CORE_URL } from '../config/platform';

const CORE_REQUEST_TIMEOUT_MS = 20000;

export class CoreApiError extends Error {
  status: number;
  details: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'CoreApiError';
    this.status = status;
    this.details = details;
  }
}

function requestId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
}

function timeoutSignal(existing?: AbortSignal | null): AbortSignal {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), CORE_REQUEST_TIMEOUT_MS);
  if (existing) {
    if (existing.aborted) controller.abort();
    else existing.addEventListener('abort', () => controller.abort(), { once: true });
  }
  controller.signal.addEventListener('abort', () => window.clearTimeout(timeout), { once: true });
  return controller.signal;
}

let csrfToken: string | null = null;

async function getCsrfToken(): Promise<string> {
  if (csrfToken) return csrfToken;
  const response = await fetch(`${NUSASEC_CORE_URL.replace(/\/$/, '')}/api/v1/auth/csrf`, {
    credentials: 'include',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    signal: timeoutSignal(),
  });
  if (!response.ok) throw new CoreApiError(response.status, `Unable to obtain Core CSRF token (${response.status})`);
  const body = await response.json() as { csrf_token?: string };
  if (!body.csrf_token) throw new CoreApiError(502, 'Core did not return a valid CSRF token');
  csrfToken = body.csrf_token;
  return csrfToken;
}

export function clearCoreCsrfToken() { csrfToken = null; }

export async function coreRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${NUSASEC_CORE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  headers.set('X-Request-ID', requestId());
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const method = (init.method || 'GET').toUpperCase();
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const token = await getCsrfToken();
    headers.set('X-CSRF-Token', token);
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      method,
      headers,
      credentials: 'include',
      cache: 'no-store',
      signal: timeoutSignal(init.signal),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new CoreApiError(408, 'NusaSec-Core request timed out or was cancelled');
    }
    throw error;
  }

  const text = await response.text();
  let body: unknown = null;
  if (text) {
    try { body = JSON.parse(text); } catch { body = text; }
  }

  if (!response.ok) {
    const detail = typeof body === 'object' && body !== null && 'detail' in body
      ? String((body as { detail?: unknown }).detail ?? response.statusText)
      : response.statusText || `Core request failed (${response.status})`;
    if (response.status === 401 || response.status === 403) csrfToken = null;
    throw new CoreApiError(response.status, detail, body);
  }

  return body as T;
}

export type InternalCommandCenterSnapshot = { schema: string; generated_at: string; executive: { customers: number; active_subscriptions: number; open_work_items: number; unhealthy_customers: number; open_opportunities: number; }; security_operations: { critical_or_high_remediation: number; overdue_remediation: number; expired_risk_exceptions: number; running_scans: number; evidence_objects: number; }; governance: { active_regulatory_changes: number; unread_internal_notifications: number; }; };
export type InternalCryptoTelemetry = { schema: string; available: boolean; generated_at: string; window_minutes: number; events_observed: number; critical_or_error: number; average_latency_ms: number | null; ops_per_second: number | null; worker_units: number | null; };
export type CoreApiKey = { id: number; name: string; description?: string; product_code: string; key_prefix: string; status: string; created_at?: string; revoked_at?: string | null; last_used_at?: string | null; };

export const coreApi = {
  listApiKeys: () => coreRequest<{ items: CoreApiKey[] }>('/api/v1/developer/api-keys'),
  createApiKey: (name: string, productCode = 'PQC_API') => coreRequest<{ id: number; api_key: string; key_prefix: string }>('/api/v1/developer/api-keys', { method: 'POST', body: JSON.stringify({ name, product_code: productCode }) }),
  revokeApiKey: (id: number) => coreRequest<{ id: number; status: string }>(`/api/v1/developer/api-keys/${id}/revoke`, { method: 'POST' }),
  getCustomers: () => coreRequest<{ items: any[] }>('/api/v1/internal/customers?limit=500'),
  getCustomerHealth: () => coreRequest<{ items: any[] }>('/api/v1/internal/customer-success/health?limit=500'),
  getSupportTickets: () => coreRequest<{ items: any[] }>('/api/v1/internal/support/tickets?limit=500'),
  getSalesOpportunities: () => coreRequest<{ items: any[] }>('/api/v1/internal/sales/opportunities?limit=500'),
  getInvoices: () => coreRequest<{ items: any[] }>('/api/v1/internal/finance/invoices?limit=500'),
  getTransactions: () => coreRequest<{ items: any[] }>('/api/v1/internal/finance/transactions?limit=500'),
  getPricing: () => coreRequest<{ items: any[] }>('/api/v1/internal-ops/pricing?limit=500'),
  getEngineeringDomain: () => coreRequest<any>('/api/v1/internal-control-tower/deep/engineering?limit=300'),
  getEngineeringErrors: () => coreRequest<any>('/api/v1/internal-control-tower/deep/engineering/errors?limit=300'),
  getSecurityDomain: () => coreRequest<any>('/api/v1/internal-control-tower/deep/security?limit=300'),
  getProductDomain: () => coreRequest<any>('/api/v1/internal-control-tower/deep/product?limit=300'),
  getDataDomain: () => coreRequest<any>('/api/v1/internal-control-tower/deep/data?limit=300'),
  getMigrationDomain: () => coreRequest<any>('/api/v1/internal-control-tower/deep/data/migration?limit=300'),
  getCoverageDomain: () => coreRequest<any>('/api/v1/internal-control-tower/deep/coverage?limit=300'),
  getCmsOverview: () => coreRequest<any>('/api/v1/internal-control-tower/cms/overview'),
  getCmsPages: () => coreRequest<any>('/api/v1/internal-control-tower/cms/pages?limit=500'),
  getCmsMedia: () => coreRequest<any>('/api/v1/internal-control-tower/cms/media?limit=500'),
  getReports: () => coreRequest<any>('/api/v1/internal-control-tower/reports'),
  getExports: () => coreRequest<any>('/api/v1/internal-control-tower/exports'),
  getNotifications: () => coreRequest<{ items: any[] }>('/api/v1/internal/notifications?limit=500'),
  getOrganization: () => coreRequest<{ organization: any; members: any[] }>('/api/v1/commercial/organization'),
  getInternalAccounts: () => coreRequest<{ items: any[] }>('/api/v1/internal/identity/accounts'),
  getPeople: () => coreRequest<{ items: any[] }>('/api/v1/internal/people?limit=500'),
  inviteMember: (payload: { email: string; display_name: string; role?: string; scopes?: string[] }) => coreRequest<{ status: string; expires_at: string; email: string }>('/api/v1/commercial/organization/invitations', { method: 'POST', body: JSON.stringify(payload) }),
  getWorkItems: () => coreRequest<{ items: any[] }>('/api/v1/internal/work'),
  getOperations: () => coreRequest<any>('/api/v1/internal-experience/operations'),
  getCompanyOverview: () => coreRequest<any>('/api/v1/internal/company/overview'),
  getPlatformDomain: () => coreRequest<any>('/api/v1/internal-control-tower/platform'),
  getAuditLog: () => coreRequest<any>('/audit-log?limit=500'),
  getRevenue: () => coreRequest<any>('/api/v1/internal-experience/revenue'),
  getCommandCenter: () => coreRequest<InternalCommandCenterSnapshot>('/api/v1/internal-experience/command-center'),
  getCryptoTelemetry: () => coreRequest<InternalCryptoTelemetry>('/api/v1/platform/internal-crypto-telemetry'),
  createSalesOpportunity: (payload: Record<string, unknown>) => coreRequest<any>('/api/v1/internal/sales/opportunities', { method: 'POST', body: JSON.stringify(payload) }),
  updateSalesOpportunity: (id: number, payload: Record<string, unknown>) => coreRequest<any>(`/api/v1/internal/sales/opportunities/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  createCustomerHealth: (payload: Record<string, unknown>) => coreRequest<any>('/api/v1/internal/customer-success/health', { method: 'POST', body: JSON.stringify(payload) }),
  createSupportTicket: (payload: Record<string, unknown>) => coreRequest<any>('/api/v1/internal/support/tickets', { method: 'POST', body: JSON.stringify(payload) }),
  createInvoice: (payload: Record<string, unknown>) => coreRequest<any>('/api/v1/internal/finance/invoices', { method: 'POST', body: JSON.stringify(payload) }),
  createSubscription: (payload: Record<string, unknown>) => coreRequest<any>('/api/v1/internal/finance/subscriptions', { method: 'POST', body: JSON.stringify(payload) }),
  createPaymentTransaction: (payload: Record<string, unknown>) => coreRequest<any>('/api/v1/internal/finance/transactions', { method: 'POST', body: JSON.stringify(payload) }),
  createEngineeringChange: (payload: Record<string, unknown>) => coreRequest<any>('/api/v1/internal/engineering/changes', { method: 'POST', body: JSON.stringify(payload) }),
  approveEngineeringChange: (id: number) => coreRequest<any>(`/api/v1/internal/engineering/changes/${id}/approve`, { method: 'POST' }),
  createProductInitiative: (payload: Record<string, unknown>) => coreRequest<any>('/api/v1/internal/product/initiatives', { method: 'POST', body: JSON.stringify(payload) }),
  createWorkItem: (payload: Record<string, unknown>) => coreRequest<any>('/api/v1/internal/work', { method: 'POST', body: JSON.stringify(payload) }),
  updateWorkItem: (id: number, payload: Record<string, unknown>) => coreRequest<any>(`/api/v1/internal/work/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  createDocument: (payload: Record<string, unknown>) => coreRequest<any>('/api/v1/internal/documents', { method: 'POST', body: JSON.stringify(payload) }),
  updatePricing: (productCode: string, planCode: string, payload: Record<string, unknown>) => coreRequest<any>(`/api/v1/internal-ops/pricing/${encodeURIComponent(productCode)}/${encodeURIComponent(planCode)}`, { method: 'PUT', body: JSON.stringify(payload) }),
  updateAccountStatus: (id: number, status: 'ACTIVE' | 'SUSPENDED' | 'OFFBOARDING') => coreRequest<any>(`/api/v1/internal/identity/accounts/${id}/status`, { method: 'POST', body: JSON.stringify({ status }) }),
  updateCustomer: (tenantId: string, payload: Record<string, unknown>) => coreRequest<any>(`/api/v1/internal/customers/${encodeURIComponent(tenantId)}`, { method: 'PUT', body: JSON.stringify(payload) }),
  createRemediation: (payload: Record<string, unknown>) => coreRequest<any>('/api/v1/internal/security/remediations', { method: 'POST', body: JSON.stringify(payload) }),
  updateRemediation: (id: number, payload: Record<string, unknown>) => coreRequest<any>(`/api/v1/internal/security/remediations/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
};