<template>
  <WindowFrame
    :active
    class="intermission-window">
    <div
      class="intermission"
      :class="`intermission--${mode}`">
      <span class="intermission__text">{{ intermissionText }}</span>
      <img
        alt=""
        class="intermission__image"
        :src="startingSoonImage" />
    </div>
  </WindowFrame>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import WindowFrame from '@/components/desktop/WindowFrame.vue';
import { useTwitchStore } from '@/stores/twitch.store';
import { GAME_METADATA } from '@/common/constants/game-metadata.constant';

const props = defineProps<{ active?: boolean; mode?: 'end' | 'break' | 'start' }>();

const store = useTwitchStore();
const { category } = storeToRefs(store);

const intermissionText = computed(() => {
  if (props.mode === 'end') {
    return 'Danke fürs Zuschauen, bis zum nächsten Mal 👋';
  }

  const { intermissionTextMode } = GAME_METADATA[category.value] ?? 'default';

  switch (props.mode) {
    case 'break':
      if (intermissionTextMode === 'chatting') {
        return '⏰ Kurze Pause, gleich geht es weiter';
      }
      return '⏰ Kurze Pause, gleich geht es weiter mit';
    case 'start':
    default:
      if (intermissionTextMode === 'chatting') {
        return '🥳 Gleich gehts los';
      }
      return '🥳 Gleich gehts los mit';
  }
});

const startingSoonTextBackgroundColor = computed(() => {
  return GAME_METADATA[category.value]?.color ?? 'rgba(115, 117, 80, 0.35)';
});
const startingSoonImage = computed(() => {
  if (props.mode === 'end') {
    return '/bamboechop.png';
  }

  return GAME_METADATA[category.value]?.backgroundImagePath ?? '/modern/game-backgrounds/default.jpg';
});
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

:global(body) {
  overflow: hidden; // for some reason within OBS the body sometimes overflows without any reason
}

.intermission {
  aspect-ratio: 16 / 9;
  background-color: #121212;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: $window-frame-border-radius - $window-frame-padding;
  overflow: hidden;
  position: relative;
  width: 100%;

  &__image {
    animation: scaleUpDown 15s ease-in-out infinite alternate;
    height: 100%;
    position: absolute;
    width: 100%;

    @keyframes scaleUpDown {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(1.05);
      }
    }
  }

  &__text {
    left: 0;
    position: absolute;
    right: 0;
    z-index: 1;
  }
}

.intermission--end {
  .intermission__image {
    animation: none;
    bottom: 0;
    height: auto;
    left: 0;
    opacity: .25;
    width: 600px;
  }

  .intermission__text {
    color: #fff;
    display: block;
    font-size: 60px;
    padding: 32px 24px;
    text-align: center;
    text-shadow: 0 0 10px #000;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
  }
}

.intermission--break,
.intermission--start {
  .intermission__text {
    background-color: v-bind(startingSoonTextBackgroundColor);
    color: #fff;
    display: block;
    font-size: 60px;
    padding: 32px 24px;
    text-align: center;
    text-shadow: 0 0 10px #000;
    top: 0;
    width: 100%;
  }
}

.intermission-window {
  width: 100%;
}
</style>
