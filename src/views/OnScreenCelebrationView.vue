<template>
  <template v-if="theme === 'modern'">
    <ModernTheme />
  </template>
</template>

<script lang="ts" setup>
import ModernTheme from '@/components/on-screen-celebration/modern/OnScreenCelebration.vue';
import { useSearchParamsComposable } from '@/composables/search-params-composable.composable';
import { useTwitchStreamInfo } from '@/composables/twitch-stream-info.composable';

const { theme } = useSearchParamsComposable();

useTwitchStreamInfo();
</script>
