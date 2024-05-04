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
  background-color: $chroma-key-color;
  border-radius: $window-frame-border-radius - $window-frame-padding;
  color: #fff;
  height: 100%;
  width: 100%;
}

.media-player-window {
  height: 100%;
  width: 100%;
}
</style>
