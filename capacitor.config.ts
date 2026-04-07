import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { CapacitorConfig } from '@capacitor/cli';

const packageJson = JSON.parse(
  readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'),
) as { version?: string };
const packageVersion = packageJson.version ?? '0.0.0';
const capgoAutoUpdate = process.env.CAPGO_AUTO_UPDATE !== 'false';
const capgoAppId = process.env.CAPGO_APP_ID ?? 'com.autosteerplus.app';
const capgoDefaultChannel = process.env.CAPGO_DEFAULT_CHANNEL ?? 'production';

const config: CapacitorConfig = {
  appId: 'com.autosteerplus.app',
  appName: 'autosteerplus',
  webDir: 'dist',
  plugins: {
    CapacitorCookies: {
      enabled: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
    SplashScreen: {
      launchAutoHide: false,
    },
    SystemBars: {
      insetsHandling: 'css',
    },
    CapacitorUpdater: {
      appId: capgoAppId,
      version: packageVersion,
      defaultChannel: capgoDefaultChannel,
      autoUpdate: capgoAutoUpdate,
      directUpdate: 'onLaunch',
      autoSplashscreen: true,
      autoSplashscreenLoader: true,
      autoSplashscreenTimeout: 10000,
      appReadyTimeout: 10000,
      responseTimeout: 20,
      autoDeleteFailed: true,
      autoDeletePrevious: true,
      resetWhenUpdate: true,
      keepUrlPathAfterReload: true,
      allowSetDefaultChannel: true,
      osLogging: true,
    },
    BluetoothLe: {
      displayStrings: {
        scanning: 'Scanning for Tesla FSD devices...',
        cancel: 'Cancel',
        availableDevices: 'Available Devices',
        noDeviceFound: 'No compatible device found',
      },
    },
  },
};

export default config;
