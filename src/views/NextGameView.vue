<template>
  <section class="next-game-view">
      <NextGame :active />
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import NextGame from '@/components/next-game/NextGame.vue';
import { useApplicationStore } from '@/stores/application.store';

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

const active = computed(() => activeApplications.value.find(application => application.id === 'next-game')?.active);
</script>
