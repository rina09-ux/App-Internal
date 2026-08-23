import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  const demoMode = env.VITE_NUSASEC_INTERNAL_DEMO_MODE === 'true';

  if (isProduction && demoMode) {
    throw new Error('VITE_NUSASEC_INTERNAL_DEMO_MODE must be disabled for production builds');
  }

  return {
    // Relative assets keep the build working on GitHub Pages (/App-Internal/)
    // as well as on a custom root domain or alternate host.
    base: env.VITE_BASE_PATH || './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: env.DISABLE_HMR !== 'true',
      watch: env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
