// vite.config.js
/*import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
  base: 'https://production-optimiser.github.io/production-optimiser/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: { // or whatever port you prefer
    hmr: {
      overlay: false
    }
  }
});*/ 

// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      hmr: {
        overlay: false
      }
    }
  };

  if (command === 'serve') {
    // Development-specific config
    config.base = '/';
  } else {
    // Production-specific config
    config.base = '/production-optimiser/';
  }

  return config;
});
