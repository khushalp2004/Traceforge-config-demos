import { ref } from 'vue';
import api from '../services/api';
import { logger } from '../utils/logger';

export function useFetch<T>() {
  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const execute = async (url: string) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(url);
      data.value = response.data;
    } catch (err: any) {
      error.value = err.message || 'An error occurred';
      logger.error('useFetch error', err);
      throw err; // Re-throw to simulate uncaught async behavior in testing
    } finally {
      loading.value = false;
    }
  };

  return { data, loading, error, execute };
}
