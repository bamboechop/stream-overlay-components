import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useEventStreamStore = defineStore('Event Stream Store', () => {
  const eventSource = ref<EventSource | null>(null);

  return {
    eventSource,
  };
});
