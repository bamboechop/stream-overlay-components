<template>
  <WindowFrame
    :active="active"
    class="media-player-window"
    :icon-path="iconPath"
    :title="category">
    <div class="media-player"></div>
  </WindowFrame>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import WindowFrame from '@/components/desktop/WindowFrame.vue';
import { useTwitchStore } from '@/stores/twitch.store';
import { useProgramInformationComposable } from '@/composables/program-information.composable';

defineProps<{ active?: boolean }>();

const store = useTwitchStore();
const { category } = storeToRefs(store);

const { iconPath } = useProgramInformationComposable();
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.media-player {
  aspect-ratio: 16 / 9;
  background-color: $chroma-key-color;
  border-radius: $window-frame-border-radius - $window-frame-padding;
  color: #fff;
  max-height: calc(100vh - 38px);
}

.media-player-window {
  width: 100%;
}
</style>
