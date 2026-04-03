import { createApp } from 'vue';
import { Capacitor } from '@capacitor/core';
import App from './App.vue';
import './features/portal/theme.css';
import './features/portal/styles.css';
import { bootstrapPortalSession, installPortalFetchBridge } from './runtime/portal-session';
import { installWebBluetoothShim } from './runtime/web-bluetooth-shim';

function renderFatalError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  const banner = document.createElement('div');
  banner.setAttribute(
    'style',
    [
      'position:sticky',
      'top:calc(env(safe-area-inset-top, 0px) + 0.5rem)',
      'z-index:9999',
      'margin:1rem auto 0',
      'width:min(1180px,calc(100% - 2rem))',
      'padding:1rem 1.25rem',
      'border-radius:18px',
      'border:1px solid rgba(235,94,85,0.35)',
      'background:rgba(57,14,11,0.92)',
      'color:#fff3ef',
      'font:600 0.95rem/1.4 "Space Grotesk","Avenir Next","Segoe UI",sans-serif',
      'box-shadow:0 18px 40px rgba(15,24,29,0.22)',
    ].join(';'),
  );
  banner.textContent = `Portal bootstrap failed: ${message}`;
  document.body.prepend(banner);
}

async function bootstrapEnvironment(): Promise<void> {
  document.documentElement.dataset.platform = Capacitor.getPlatform();

  if (Capacitor.isNativePlatform()) {
    installPortalFetchBridge();
    await bootstrapPortalSession();
    installWebBluetoothShim();
    return;
  }

  await bootstrapPortalSession();
}

async function main(): Promise<void> {
  await bootstrapEnvironment();
  createApp(App).mount('#app');
}

void main().catch((error) => {
  console.error(error);
  renderFatalError(error);
});
