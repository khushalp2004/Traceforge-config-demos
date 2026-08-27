<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  expectedError: string;
  suggestedFix: string;
  triggerText?: string;
}>();

const emit = defineEmits(['trigger']);
</script>

<template>
  <div class="error-card">
    <h3>{{ title }}</h3>
    <p class="desc">{{ description }}</p>
    <div class="details">
      <p><strong>Expected:</strong> <code>{{ expectedError }}</code></p>
      <p><strong>Fix:</strong> {{ suggestedFix }}</p>
    </div>
    <button class="danger" @click="emit('trigger')">
      {{ triggerText || 'Trigger Error' }}
    </button>
  </div>
</template>

<style scoped>
.error-card {
  background-color: var(--card-bg);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border-left: 4px solid var(--error-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h3 {
  margin: 0;
  color: var(--text-color);
}

.desc {
  margin: 0;
  color: #4b5563;
}

.details {
  font-size: 0.875rem;
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 4px;
}

.details code {
  background-color: #fee2e2;
  color: #991b1b;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}
</style>
