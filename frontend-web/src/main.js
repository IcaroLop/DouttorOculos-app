import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './redux/store';
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
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(Provider, { store: store, children: _jsx(App, {}) }) }));
