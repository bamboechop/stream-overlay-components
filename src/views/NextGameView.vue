<template>
  <section class="next-game-view">
    <template v-if="theme === 'modern'">
      <ModernTheme :active />
    </template>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import ModernTheme from '@/components/next-game/modern/NextGame.vue';
import { useApplicationStore } from '@/stores/application.store';

const { theme } = useSearchParamsComposable();

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

const active = computed(() => activeApplications.value.find(application => application.id === 'next-game')?.active);
</script>
