<template>
  <section class="schedule-view">
    <Schedule :active />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useApplicationStore } from '@/stores/application.store';
import Schedule from '@/components/schedule/modern/Schedule.vue';

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

const active = computed(() => activeApplications.value.find(application => application.id === 'schedule')?.active);
</script>

<style scoped lang="scss">
  .schedule-view {
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
  }
</style>
