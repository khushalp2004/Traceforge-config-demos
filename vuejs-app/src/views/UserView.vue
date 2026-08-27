<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div class="user-view">
    <h1>User Profile</h1>
    <p>Dynamic Route Parameter ID: {{ route.params.id }}</p>
  </div>
</template>
