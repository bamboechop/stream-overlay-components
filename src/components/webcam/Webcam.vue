<template>
  <WindowFrame
    :active
    class="webcam-window"
    :title="title ?? 'Webcam'">
    <div class="webcam"></div>
  </WindowFrame>
</template>

<script lang="ts" setup>
import WindowFrame from '@/components/desktop/WindowFrame.vue';

defineProps<{
  active?: boolean;
  aspectRatio: string;
  title?: string;
}>();
</script>

<style lang="scss" scoped>
@use 'sass:math';

@import '@/assets/modern.variables';

.webcam {
  aspect-ratio: v-bind(aspectRatio);
  background-color: $chroma-key-color;
  border-radius: 4px;
  border-top-right-radius: 2px;
  width: 100%;
}

.webcam-window {
  border-top-right-radius: calc($window-frame-border-radius - $window-frame-padding);
  max-width: 1920px;
}
</style>
