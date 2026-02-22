<template>
  <section class="schedule-view">
    <Schedule :active />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useApplicationStore } from '@/stores/application.store';
import Schedule from '@/components/schedule/Schedule.vue';

const applicationStore = useApplicationStore();
const { activeProgramId } = storeToRefs(applicationStore);

const active = computed(() => activeProgramId.value === 'schedule');
</script>

<style scoped lang="scss">
  .schedule-view {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
  }
</style>
