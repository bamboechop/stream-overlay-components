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
import { onBeforeUnmount, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import ModernTheme from '@/components/media-player/modern/MediaPlayer.vue';
import Windows95Theme from '@/components/media-player/windows95/MediaPlayer.vue';
import type { TTheme } from '@/common/types/index.type';
import type { IEventStreamData } from '@/components/media-player/media-player.interface';
import { useTwitchStore } from '@/stores/twitch.store';

const searchParams = useUrlSearchParams('history');
const theme: TTheme = searchParams.theme as TTheme ?? import.meta.env.VITE_THEME;

let eventSource: EventSource | null = null;

const store = useTwitchStore();
const { getChannelInformation } = store;
const { category } = storeToRefs(store);

function eventSourceSetup() {
  eventSource = new EventSource(`${import.meta.env.VITE_BAMBBOT_API_TWITCH_URL}/eventstream`);

  eventSource.addEventListener('channel.update', (event) => {
    const data = JSON.parse(event.data) as IEventStreamData;
    category.value = data.category_name;
  });

  eventSource.onerror = (error) => {
    console.error(error);
    eventSource?.close();
  };
}

onMounted(async () => {
  eventSourceSetup();
  await getChannelInformation();
});

onBeforeUnmount(() => {
  eventSource?.close();
});
</script>

<style lang="scss" scoped>
.media-player-view {
  height: 100vh;
  width: 100vw;
}
</style>
