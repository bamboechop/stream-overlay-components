import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useStreamStatusStore = defineStore('Stream Status', () => {
  const live = ref(false);

  return {
    live,
  };
}, {
  share: {
    enable: false,
  },
});
