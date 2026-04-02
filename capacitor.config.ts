import type { CapacitorConfig } from '@capacitor/cli';

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
