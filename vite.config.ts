import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

const portalTarget = 'https://fsd.teslaandroid.com';
const packageJson = JSON.parse(
  readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'),
) as { version?: string };
const packageVersion = packageJson.version ?? '0.0.0';

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(packageVersion),
  },
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: portalTarget,
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
      },
      '/__portal__': {
        target: portalTarget,
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
        rewrite: (path) => path.replace(/^\/__portal__/, ''),
      },
    },
  },
});
