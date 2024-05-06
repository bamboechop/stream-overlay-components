<template>
  <WindowFrame
    class="media-player-window"
    :title="category">
    <div class="media-player"></div>
  </WindowFrame>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import WindowFrame from '@/components/desktop/WindowFrame.vue';
import { useTwitchStore } from '@/stores/twitch.store';

const store = useTwitchStore();
const { category } = storeToRefs(store);
</script>

<style lang="scss" scoped>
@import '@/assets/desktop.variables';

.media-player {
  aspect-ratio: 16 / 9;
  background-color: $chroma-key-color;
  border-radius: $window-frame-border-radius - $window-frame-padding;
  color: #fff;
}

.media-player-window {
  width: 100%;
}
</style>
