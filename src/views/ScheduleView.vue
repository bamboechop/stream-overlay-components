<template>
  <section class="schedule-view">
    <template v-if="theme === 'modern'">
      <ModernTheme :active />
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import { useApplicationStore } from '@/stores/application.store';
import ModernTheme from '@/components/schedule/modern/Schedule.vue';

const { theme } = useSearchParamsComposable();

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

const active = computed(() => activeApplications.value.find((application) => {
  console.log(application);
  return application.id === 'schedule';
})?.active);
</script>
