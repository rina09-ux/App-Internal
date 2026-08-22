const configuredCoreUrl = import.meta.env.VITE_NUSASEC_CORE_URL;
const configuredAiUrl = import.meta.env.VITE_NUSASEC_AI_URL;
const configuredCustomerUrl = import.meta.env.VITE_NUSASEC_CUSTOMER_URL;
const configuredPublicUrl = import.meta.env.VITE_NUSASEC_PUBLIC_URL;

export const NUSASEC_CORE_URL = configuredCoreUrl || (import.meta.env.DEV ? 'http://localhost:8000' : '');
export const NUSASEC_AI_URL = configuredAiUrl || (import.meta.env.DEV ? 'http://localhost:8001' : '');
export const NUSASEC_CUSTOMER_URL = configuredCustomerUrl || (import.meta.env.DEV ? 'http://localhost:5173' : '');
export const NUSASEC_PUBLIC_URL = configuredPublicUrl || (import.meta.env.DEV ? 'http://localhost:4173' : '');

for (const [name, value] of [
  ['VITE_NUSASEC_CORE_URL', NUSASEC_CORE_URL],
  ['VITE_NUSASEC_AI_URL', NUSASEC_AI_URL],
  ['VITE_NUSASEC_CUSTOMER_URL', NUSASEC_CUSTOMER_URL],
  ['VITE_NUSASEC_PUBLIC_URL', NUSASEC_PUBLIC_URL],
] as const) {
  if (!value) throw new Error(`${name} must be explicitly configured for production/preview builds`);
}

export const coreUrl = (path: string) => `${NUSASEC_CORE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const aiUrl = (path: string) => `${NUSASEC_AI_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
