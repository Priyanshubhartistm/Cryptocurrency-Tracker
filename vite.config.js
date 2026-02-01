import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Cryptocurrency-App/',
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  }
});