<template>
  <template v-if="theme === 'modern'">
    <ModernTheme />
  </template>
</template>

<script setup lang="ts">
import { useUrlSearchParams } from '@vueuse/core';
import ModernTheme from '@/components/webcam/modern/Webcam.vue';
import type { TTheme } from '@/common/types/index.type';

const searchParams = useUrlSearchParams('history');
const theme: TTheme = searchParams.theme as TTheme ?? import.meta.env.VITE_THEME;
</script>
