import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import TraceForge from "usetraceforge";
import { TraceForgeProvider } from "usetraceforge/react";

// For Vite use import.meta.env, for CRA use process.env
TraceForge.init({ 
  apiKey: import.meta.env.VITE_TRACEFORGE_API_KEY, 
  endpoint: import.meta.env.VITE_TRACEFORGE_INGEST_URL,
  autoCapture: true // automatically catches onClick and promise errors!
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TraceForgeProvider>
      <App />
    </TraceForgeProvider>
  </StrictMode>,
);
