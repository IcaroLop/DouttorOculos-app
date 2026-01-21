import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Registrar Service Worker para PWA apenas em produção
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registrado com sucesso:', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker falhou ao registrar:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
