<script setup lang="ts">
import { version } from 'vue';
</script>

<template>
  <nav class="navbar">
    <div class="nav-brand">Vue Testing App v{{ version }}</div>
    <ul class="nav-links">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/error-lab">Error Lab</router-link></li>
      <li><router-link to="/users/1">User Profile</router-link></li>
      <li><router-link to="/not-found">404 Demo</router-link></li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--card-bg);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.nav-brand {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover, .nav-links a.router-link-active {
  color: var(--primary-color);
}
</style>
