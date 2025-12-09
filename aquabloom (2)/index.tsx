import React from 'react';
import ReactDOM from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import App from './App';

// Initialize Capacitor for mobile app features
if (Capacitor.isNativePlatform()) {
  // Mobile-specific initialization
  import('@capacitor/status-bar').then(({ StatusBar }) => {
    StatusBar.setStyle({ style: 'light' });
    StatusBar.setBackgroundColor({ color: '#006D77' });
  });

  import('@capacitor/app').then(({ App: CapacitorApp }) => {
    // Handle app state changes
    CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active?', isActive);
    });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);