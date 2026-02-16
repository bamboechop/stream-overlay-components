<template>
  <section class="media-player-view">
      <MediaPlayer :active />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import MediaPlayer from '@/components/media-player/MediaPlayer.vue';
import { useTwitchStreamInfoComposable } from '@/composables/twitch-stream-info.composable';
import { useApplicationStore } from '@/stores/application.store';

useTwitchStreamInfoComposable();

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

const active = computed(() => activeApplications.value.find(application => application.id === 'media-player')?.active);
</script>

<style lang="scss" scoped>
.media-player-view {
  height: 100vh;
  width: 100vw;
}
</style>
