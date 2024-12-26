<template>
  <section class="starting-soon-view">
    <template v-if="theme === 'modern'">
      <ModernTheme :mode="mode" />
    </template>
    <template v-if="theme === 'windows-95'"></template>
  </section>
</template>

<script lang="ts" setup>
import { useSearchParamsComposable } from '@/composables/search-params-composable.composable';
import { useTwitchStreamInfo } from '@/composables/twitch-stream-info.composable';
import ModernTheme from '@/components/intermission/modern/Intermission.vue';

const { mode, theme } = useSearchParamsComposable();

useTwitchStreamInfo();
</script>
