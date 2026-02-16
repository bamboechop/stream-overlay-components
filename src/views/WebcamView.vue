<template>
  <template v-if="theme === 'modern'">
    <ModernTheme
      :active
      :aspect-ratio="webcamAspectRatio"
      :title />
  </template>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import ModernTheme from '@/components/webcam/modern/Webcam.vue';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import { useApplicationStore } from '@/stores/application.store';

const { theme, title, webcamAspectRatio } = useSearchParamsComposable();

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

const active = computed(() => activeApplications.value.find(application => application.id === 'webcam')?.active);
</script>
