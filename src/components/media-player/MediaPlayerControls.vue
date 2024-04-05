<template>
  <div class="media-player-controls">
    <template
      v-for="(control, controlsIndex) of controls"
      :key="`media-player-controls-${controlsIndex}`">
      <template
        v-for="(button, controlIndex) of control"
        :key="`media-player-control-button-${controlIndex}`">
        <button
          class="media-player-controls__button"
          :class="{ 'media-player-controls__button--enabled': button.enabled }"
          type="button">
          <img
            alt=""
            class="media-player-controls__icon"
            :class="{ 'media-player-controls__icon--enabled': button.enabled }"
            :src="button.iconPath" />
        </button>
      </template>
      <hr
        v-if="controlsIndex + 1 < controls.length"
        class="media-player-controls__divider" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const controls = ref([
  [
    {
      enabled: false,
      iconPath: '/windows-95/play.icon.png',
    },
    {
      enabled: true,
      iconPath: '/windows-95/pause.icon.png',
    },
    {
      enabled: false,
      iconPath: '/windows-95/stop.icon.png',
    },
  ],
  [
    {
      enabled: false,
      iconPath: '/windows-95/begin.icon.png',
    },
    {
      enabled: false,
      iconPath: '/windows-95/back.icon.png',
    },
    {
      enabled: false,
      iconPath: '/windows-95/forward.icon.png',
    },
    {
      enabled: false,
      iconPath: '/windows-95/end.icon.png',
    },
  ],
  [
    {
      enabled: true,
      iconPath: '/windows-95/fullscreen.icon.png',
    },
  ],
]);
</script>

<style lang="scss" scoped>
.media-player-controls {
  align-items: center;
  display: flex;
  gap: 4px;

  &__button {
    appearance: none;
    background-color: transparent;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #7f7f7f;
    border-right: 1px solid #fff;
    border-top: 1px solid #7f7f7f;
    height: 24px;
    padding: 4px;
  }

  &__button--enabled {
    border-bottom-color: #7f7f7f;
    border-left-color: #fff;
    border-right-color: #7f7f7f;
    border-top-color: #fff;
  }

  &__icon {
    opacity: .25;
  }

  &__icon--enabled {
    opacity: 1;
  }

  &__divider {
    border-left: 1px solid #808080;
    border-right: 1px solid #fff;
    height: 100%;
    width: 2px;
  }
}
</style>
