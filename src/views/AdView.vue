<template>
  <template v-if="theme === 'modern'">
    <ModernTheme />
  </template>
</template>

<script lang="ts" setup>
import ModernTheme from '@/components/ad-view/modern/Ad.vue';
import { useSearchParamsComposable } from '@/composables/search-params-composable.composable';
import { useObsComposable } from '@/composables/obs.composable';
import { useTwitchStreamInfo } from '@/composables/twitch-stream-info.composable';

const { theme } = useSearchParamsComposable();

useObsComposable();
useTwitchStreamInfo();
</script>
