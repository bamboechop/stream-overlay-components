<template>
  <template v-if="theme === 'modern'">
    <ModernTheme />
  </template>
</template>

<script lang="ts" setup>
import ModernTheme from '@/components/ad-view/modern/Ad.vue';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import { useTwitchStreamInfoComposable } from '@/composables/twitch-stream-info.composable';
import { useEventStreamComposable } from '@/composables/event-stream.composable';

const { theme } = useSearchParamsComposable();

useEventStreamComposable();
useTwitchStreamInfoComposable();
</script>
