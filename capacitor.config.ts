import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.warld.app',
  appName: 'warld',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
