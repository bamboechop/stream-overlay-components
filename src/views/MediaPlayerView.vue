<template>
  <section class="media-player-view">
    <template v-if="theme === 'windows-95'">
      <Windows95Theme />
    </template>
    <template v-if="theme === 'modern'">
      <ModernTheme />
    </template>
  </section>
</template>

<script setup lang="ts">
import ModernTheme from '@/components/media-player/modern/MediaPlayer.vue';
import Windows95Theme from '@/components/media-player/windows95/MediaPlayer.vue';
import { useTwitchStreamInfo } from '@/composables/twitch-stream-info.composable';
import { useSearchParamsComposable } from '@/composables/search-params-composable.composable';

const { theme } = useSearchParamsComposable();

useTwitchStreamInfo();
</script>

<style lang="scss" scoped>
.media-player-view {
  height: 100vh;
  width: 100vw;
}
</style>
