import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.advithya.chefscircle',
  appName: 'ChefsCircle',
  webDir: 'dist',
  server: {
    url: 'https://chefscircle.in', 
    cleartext: true
  }
};

export default config;
