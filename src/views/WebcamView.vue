<template>
  <template v-if="theme === 'modern'">
    <ModernTheme />
  </template>
  <template v-if="theme === 'windows-95'">
    <Windows95Theme />
  </template>
</template>

<script setup lang="ts">
import ModernTheme from '@/components/webcam/modern/Webcam.vue';
import Windows95Theme from '@/components/webcam/windows-95/Webcam.vue';
import { useSearchParamsComposable } from '@/composables/search-params-composable.composable';

const { theme } = useSearchParamsComposable();
</script>
