import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://fitness-tracker-backend.onrender.com',
        changeOrigin: true,
        secure: true
      }
    }
  }
});
