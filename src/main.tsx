import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n/i18n';

// Dev fallback: avoid importing Tailwind CSS when offline mode is on
if (import.meta.env.VITE_OFFLINE_MODE !== 'true') {
  // Dynamically import to keep CDN-based CSS working in offline dev
  import('./index.css');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
