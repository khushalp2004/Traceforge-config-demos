<script setup lang="ts">
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you are looking for does not exist or an error occurred.</p>
    <router-link to="/">Return to Home</router-link>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
}

h1 {
  font-size: 6rem;
  color: var(--error-color);
  margin-bottom: 0;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}
</style>
