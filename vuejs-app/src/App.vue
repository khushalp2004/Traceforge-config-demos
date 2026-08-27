<script setup lang="ts">
import Navbar from './components/Navbar.vue';
</script>

<template>
  <div class="app-container">
    <Navbar />
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
/* Basic Global Styles */
:root {
  --primary-color: #4f46e5;
  --bg-color: #f3f4f6;
  --text-color: #1f2937;
  --card-bg: #ffffff;
  --error-color: #ef4444;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

button {
  cursor: pointer;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

button.primary {
  background-color: var(--primary-color);
  color: white;
}

button.primary:hover {
  background-color: #4338ca;
}

button.danger {
  background-color: var(--error-color);
  color: white;
}

button.danger:hover {
  background-color: #dc2626;
}

h1, h2, h3 {
  margin-top: 0;
}
</style>
