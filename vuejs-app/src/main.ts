import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { setupGlobalErrorHandling } from './utils/errorHandler';
import './style.css';
// Import the TraceForge Vue Plugin
import { TraceForgeVue } from "usetraceforge/vue";


const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);

// Setup user's error handling first!
setupGlobalErrorHandling(app);

app.use(TraceForgeVue, {
  apiKey: import.meta.env.VITE_TRACEFORGE_API_KEY,
  endpoint: import.meta.env.VITE_TRACEFORGE_INGEST_URL,
  autoCapture: true
});


app.mount('#app');
