import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export const useUserStore = defineStore('user', () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const data = ref<any[]>([]);

  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      // Just a mock API or use JSON placeholder
      const response = await api.get('https://jsonplaceholder.typicode.com/users');
      data.value = response.data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch users';
      throw err; // Re-throw to be caught by component or global handler
    } finally {
      loading.value = false;
    }
  };

  const loadLargeState = () => {
    // Large State Demo: 100000 records
    const largeData = [];
    for (let i = 0; i < 100000; i++) {
      largeData.push({ id: i, name: `User ${i}`, email: `user${i}@example.com`, status: 'active' });
    }
    data.value = largeData;
  };

  const reset = () => {
    loading.value = false;
    error.value = null;
    data.value = [];
  };

  return {
    loading,
    error,
    data,
    fetchUsers,
    loadLargeState,
    reset
  };
});
