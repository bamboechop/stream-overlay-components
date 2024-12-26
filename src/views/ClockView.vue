<template>
  <template v-if="theme === 'modern'">
    <ModernTheme />
  </template>
</template>

<script lang="ts" setup>
import ModernTheme from '@/components/clock/modern/Clock.vue';
import { useSearchParamsComposable } from '@/composables/search-params-composable.composable';

const { theme } = useSearchParamsComposable();
</script>
