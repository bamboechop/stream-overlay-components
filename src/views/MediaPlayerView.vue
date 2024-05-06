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
import { useUrlSearchParams } from '@vueuse/core';
import ModernTheme from '@/components/media-player/modern/MediaPlayer.vue';
import Windows95Theme from '@/components/media-player/windows95/MediaPlayer.vue';
import type { TTheme } from '@/common/types/index.type';
import { useTwitchStreamInfo } from '@/composables/twitch-stream-info.composable';

const searchParams = useUrlSearchParams('history');
const theme: TTheme = searchParams.theme as TTheme ?? import.meta.env.VITE_THEME;

useTwitchStreamInfo();
</script>

<style lang="scss" scoped>
.media-player-view {
  height: 100vh;
  width: 100vw;
}
</style>
