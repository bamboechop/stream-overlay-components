<template>
  <section class="media-player-view">
    <template v-if="theme === 'modern'">
      <ModernTheme :active />
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import ModernTheme from '@/components/media-player/modern/MediaPlayer.vue';
import { useTwitchStreamInfoComposable } from '@/composables/twitch-stream-info.composable';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import { useApplicationStore } from '@/stores/application.store';

const { theme } = useSearchParamsComposable();

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
