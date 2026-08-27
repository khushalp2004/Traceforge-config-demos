<script setup lang="ts">
import { version } from 'vue';
</script>

<template>
  <div class="home-view">
    <h1>Dashboard Home</h1>
    <div class="status-card">
      <h2>App Status: 🟢 Online</h2>
      <p><strong>Vue Version:</strong> {{ version }}</p>
      <p><strong>Environment Variables:</strong></p>
      <pre><code>{
  VITE_API_BASE_URL: "{{ 'import.meta.env.VITE_API_BASE_URL' }}"
}</code></pre>
      <p>Navigate to the <router-link to="/error-lab">Error Lab</router-link> to start testing error scenarios.</p>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.status-card {
  background-color: var(--card-bg);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

pre {
  background-color: #1f2937;
  color: #f3f4f6;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
