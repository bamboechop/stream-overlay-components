<template>
  <WindowFrame
    :active
    class="webcam-window"
    :icon-path="programInformation.webcam.iconPath"
    :title="title ?? 'Webcam'">
    <div class="webcam"></div>
  </WindowFrame>
</template>

<script lang="ts" setup>
import WindowFrame from '@/components/desktop/WindowFrame.vue';
import { useProgramInformationComposable } from '@/composables/program-information.composable';

defineProps<{
  active?: boolean;
  aspectRatio: string;
  title?: string;
}>();

const { programInformation } = useProgramInformationComposable();
</script>

<style lang="scss" scoped>
@use 'sass:math';

@import '@/assets/modern.variables';

.webcam {
  aspect-ratio: v-bind(aspectRatio);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  width: 100%;
}

.webcam-window {
  border-top-right-radius: calc($window-frame-border-radius - $window-frame-padding);
  max-width: 1920px;
}
</style>
