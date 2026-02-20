import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isPages = !!env.VITE_BASE;
  return {
    plugins: [react()],
    base: isPages ? env.VITE_BASE : '/',
    server: { port: 5177, strictPort: true, host: true },
    build: { outDir: 'dist' }
  };
});
