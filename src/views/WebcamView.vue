<template>
  <template v-if="theme === 'modern'">
    <ModernTheme />
  </template>
</template>

<script setup lang="ts">
import ModernTheme from '@/components/webcam/modern/Webcam.vue';
import { useSearchParamsComposable } from '@/composables/theme.composable';

const { theme } = useSearchParamsComposable();
</script>
