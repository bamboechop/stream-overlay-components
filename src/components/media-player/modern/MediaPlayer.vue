<template>
  <WindowFrame
    class="media-player-window"
    title="TODO Twitch Category Name">
    <div class="media-player"></div>
  </WindowFrame>
</template>

<script lang="ts" setup>
import WindowFrame from '@/components/desktop/WindowFrame.vue';
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
