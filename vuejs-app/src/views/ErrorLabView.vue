<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import ErrorCard from '../components/ErrorCard.vue';
import api from '../services/api';
import { useUserStore } from '../stores/user.store';

const userStore = useUserStore();

// 1. Runtime Error (Null)
const triggerNullError = () => {
  const user: any = null;
  console.log(user.name);
};

// 2. Runtime Error (Undefined Access)
const triggerUndefinedError = () => {
  const profile: any = {};
  console.log(profile.address.city);
};

// 3. API Failure (Network Error)
const triggerNetworkError = async () => {
  await api.get('https://invalid-api-domain.com/users');
};

// 4. API Failure (404)
const trigger404Error = async () => {
  await api.get('/api/not-found');
};

// 5. Async Error
const triggerAsyncError = async () => {
  await Promise.reject(new Error("Async request failed"));
};

// 6. JSON Parse Error
const triggerJSONError = () => {
  JSON.parse("{bad json}");
};

// 7. Infinite Re-render Demo
const infiniteState = ref(0);
const triggerInfiniteRerender = () => {
  infiniteState.value++;
};
// Guarded watch to avoid crashing the whole tab while demonstrating
watch(() => infiniteState.value, (val) => {
  if (val > 0 && val < 1000) { // Safety limit
    infiniteState.value++;
  } else if (val >= 1000) {
    console.warn('Infinite loop caught by safety guard at 1000 iterations.');
  }
});

// 8. Memory Leak Demo
let leakInterval: number | undefined;
const triggerMemoryLeak = () => {
  leakInterval = window.setInterval(() => {
    console.log('Interval running... (Leaking memory)');
    // Allocate some memory
    new Array(10000).fill('leak');
  }, 100);
  alert('Memory leak started! Check performance tab.');
};

const fixMemoryLeak = () => {
  if (leakInterval) {
    window.clearInterval(leakInterval);
    leakInterval = undefined;
    alert('Memory leak fixed (interval cleared)!');
  }
};

onUnmounted(() => {
  // We intentionally DO NOT clear the leakInterval here to demonstrate the leak
  // unless fixMemoryLeak was called.
});

// 9. Event Listener Leak Demo
const dummyListener = () => console.log('Window resized! (Leaked Listener)');
const triggerEventListenerLeak = () => {
  window.addEventListener('resize', dummyListener);
  alert('Event listener added without cleanup!');
};

const fixEventListenerLeak = () => {
  window.removeEventListener('resize', dummyListener);
  alert('Event listener removed!');
};

// 10. Slow Render Demo
const slowElements = ref<number[]>([]);
const renderTime = ref(0);
const triggerSlowRender = () => {
  const start = performance.now();
  slowElements.value = Array.from({ length: 15000 }, (_, i) => i);
  // Give Vue time to update DOM, then measure
  setTimeout(() => {
    renderTime.value = Math.round(performance.now() - start);
  }, 0);
};

// 11. Large State Demo
const triggerLargeState = () => {
  userStore.loadLargeState();
};
</script>

<template>
  <div class="error-lab">
    <h1>Error Lab Sandbox</h1>
    <p>Intentionally trigger errors to observe how they are caught and handled.</p>

    <div class="card-grid">
      <ErrorCard 
        title="Runtime Error (Null Access)"
        description="Attempts to access a property on a null object."
        expected-error="TypeError: Cannot read properties of null"
        suggested-fix="Use optional chaining (user?.name) or check if null."
        @trigger="triggerNullError"
      />

      <ErrorCard 
        title="Runtime Error (Undefined Access)"
        description="Attempts to access deeply nested properties."
        expected-error="Cannot read properties of undefined"
        suggested-fix="Use optional chaining (profile.address?.city)."
        @trigger="triggerUndefinedError"
      />

      <ErrorCard 
        title="API Failure (Network Error)"
        description="Makes a request to an invalid domain."
        expected-error="Network Error"
        suggested-fix="Check network connection and domain validity."
        @trigger="triggerNetworkError"
      />

      <ErrorCard 
        title="API Failure (404 Not Found)"
        description="Requests a non-existent endpoint."
        expected-error="404 Not Found"
        suggested-fix="Ensure the API route exists and is spelled correctly."
        @trigger="trigger404Error"
      />

      <ErrorCard 
        title="Unhandled Async Error"
        description="Rejects a promise without catching it."
        expected-error="Unhandled Promise Rejection"
        suggested-fix="Wrap in try/catch or use .catch()."
        @trigger="triggerAsyncError"
      />

      <ErrorCard 
        title="JSON Parse Error"
        description="Parses malformed JSON string."
        expected-error="SyntaxError: Expected property name or '}' in JSON"
        suggested-fix="Wrap JSON.parse in try/catch."
        @trigger="triggerJSONError"
      />
    </div>

    <hr class="divider" />

    <h2>Performance & Leak Demos</h2>
    
    <div class="demo-section">
      <h3>Infinite Re-render</h3>
      <p>Current state value: {{ infiniteState }}</p>
      <button class="danger" @click="triggerInfiniteRerender">Trigger Watch Loop</button>
      <p><small>(Capped at 1000 iterations to prevent browser crash)</small></p>
    </div>

    <div class="demo-section">
      <h3>Memory Leak (setInterval)</h3>
      <div class="button-group">
        <button class="danger" @click="triggerMemoryLeak">Start Leak</button>
        <button class="primary" @click="fixMemoryLeak">Fix / Cleanup</button>
      </div>
    </div>

    <div class="demo-section">
      <h3>Event Listener Leak</h3>
      <div class="button-group">
        <button class="danger" @click="triggerEventListenerLeak">Add Global Listener</button>
        <button class="primary" @click="fixEventListenerLeak">Remove Listener</button>
      </div>
    </div>

    <div class="demo-section">
      <h3>Slow Render Demo</h3>
      <button class="danger" @click="triggerSlowRender">Render 15,000 Nodes</button>
      <p v-if="renderTime > 0">Rendered in ~{{ renderTime }}ms</p>
      <div class="slow-render-container">
        <span v-for="item in slowElements" :key="item" class="tiny-box"></span>
      </div>
    </div>

    <div class="demo-section">
      <h3>Large State Demo (Pinia)</h3>
      <button class="danger" @click="triggerLargeState">Load 100k Records into Pinia</button>
      <p>Records loaded: {{ userStore.data.length }}</p>
    </div>

  </div>
</template>

<style scoped>
.error-lab {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.divider {
  margin: 2rem 0;
  border: 0;
  border-top: 1px solid #e5e7eb;
}

.demo-section {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.demo-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.button-group {
  display: flex;
  gap: 1rem;
}

.slow-render-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-top: 1rem;
  max-height: 200px;
  overflow-y: auto;
}

.tiny-box {
  width: 4px;
  height: 4px;
  background-color: var(--primary-color);
}
</style>
