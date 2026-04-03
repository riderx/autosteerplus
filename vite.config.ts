import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const portalTarget = 'https://fsd.teslaandroid.com';

export default defineConfig({
  plugins: [vue()],
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
