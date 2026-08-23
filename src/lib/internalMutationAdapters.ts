import { coreApi } from './nusasecCoreClient';
import type { CustomerProfile, SecurityRemediationTask } from '../types/workspaces';

export async function saveCustomerToCore(customer: CustomerProfile): Promise<CustomerProfile> {
  const result = await coreApi.updateCustomer(customer.tenant_id, {
    display_name: customer.display_name,
    industry: undefined,
    plan: customer.plan,
    timezone: 'UTC',
  });

  return {
    ...customer,
    tenant_id: String(result.tenant_id ?? customer.tenant_id),
    display_name: result.display_name ?? customer.display_name,
    plan: result.plan ?? customer.plan,
  };
}

export async function saveRemediationToCore(remediation: SecurityRemediationTask): Promise<SecurityRemediationTask> {
  const numericId = Number(remediation.id);
  const payload = {
    title: remediation.title,
    severity: String(remediation.severity ?? 'MEDIUM').toUpperCase(),
    status: String(remediation.status ?? 'OPEN').toUpperCase().replace(/ /g, '_'),
    asset_external_id: remediation.asset ?? null,
    source_rule_id: remediation.framework ?? null,
    remediation_text: remediation.title,
  };

  const result = Number.isFinite(numericId) && numericId > 0
    ? await coreApi.updateRemediation(numericId, payload)
    : await coreApi.createRemediation(payload);

  return {
    ...remediation,
    id: String(result.id ?? remediation.id),
    title: result.title ?? remediation.title,
    severity: result.severity ?? remediation.severity,
    status: String(result.status ?? remediation.status),
    asset: result.asset_external_id ?? remediation.asset,
  };
}
