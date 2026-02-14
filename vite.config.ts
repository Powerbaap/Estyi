import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isPages = !!env.VITE_BASE; // set by workflow when deploying to Pages
  return {
    plugins: [react()],
    base: isPages ? env.VITE_BASE : '/',
    server: {
      port: 5177,
      strictPort: true,
      host: true
    },
    build: {
      outDir: 'dist'
    }
  };
});
