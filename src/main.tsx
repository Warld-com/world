import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {ErrorBoundary} from './ErrorBoundary.tsx';
import './index.css';

// Suppress benign Vite/WebSocket errors and user-cancelled auth popups that occur in this environment
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reasonMsg = event.reason?.message || event.reason?.code || '';
    if (
      reasonMsg.includes('WebSocket') ||
      reasonMsg.includes('vite') ||
      reasonMsg.includes('popup-closed-by-user') ||
      reasonMsg.includes('cancelled-popup-request')
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });

  const originalError = console.error;
  console.error = (...args) => {
    const errorStr = args.map(a => typeof a === 'string' ? a : (a?.message || a?.code || a?.toString() || '')).join(' ');
    if (
      errorStr.includes('failed to connect to websocket') ||
      errorStr.includes('popup-closed-by-user') ||
      errorStr.includes('cancelled-popup-request')
    ) {
      return;
    }
    originalError.apply(console, args);
  };

  const originalWarn = console.warn;
  console.warn = (...args) => {
    const warnStr = args.map(a => typeof a === 'string' ? a : (a?.message || a?.toString() || '')).join(' ');
    if (warnStr.includes('maximum backoff delay')) return;
    originalWarn.apply(console, args);
  };
}

// Register Service Worker for PWA offline capabilities and installability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      const swUrl = new URL('sw.js', window.location.href).href;
      const scopeUrl = new URL('./', window.location.href).href;
      navigator.serviceWorker
        .register(swUrl, { scope: scopeUrl })
        .then((reg) => {
          console.log('[PWA] Service worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service worker registration relative fallback:', err);
          navigator.serviceWorker.register('./sw.js').catch(() => {});
        });
    } catch {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
