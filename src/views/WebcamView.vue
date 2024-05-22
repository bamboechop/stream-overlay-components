<template>
  <template v-if="theme === 'modern'">
    <ModernTheme />
  </template>
  <template v-if="theme === 'windows-95'">
    <Windows95Theme />
  </template>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ModernTheme from '@/components/webcam/modern/Webcam.vue';
import Windows95Theme from '@/components/webcam/windows-95/Webcam.vue';
import { useSearchParamsComposable } from '@/composables/theme.composable';
import { useApplicationStore } from '@/stores/application.store';

const { theme, themePath } = useSearchParamsComposable();

const applicationStore = useApplicationStore();
const { addActiveApplication, removeActiveApplication } = applicationStore;

onMounted(() => {
  addActiveApplication({
    active: false,
    iconPath: `/programs/${themePath}/webcam.icon.png`,
    id: 'webcam',
    text: 'Webcam',
  });

  window.addEventListener('beforeunload', () => {
    removeActiveApplication('webcam');
  });
});
</script>
