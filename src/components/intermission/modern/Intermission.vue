<template>
  <WindowFrame class="intermission-window">
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
import { useTwitchStreamInfo } from '@/composables/twitch-stream-info.composable';

const props = defineProps<{ mode?: 'end' | 'break' | 'start' }>();

const store = useTwitchStore();
const { category } = storeToRefs(store);

useTwitchStreamInfo();

const intermissionText = computed(() => {
  if (props.mode === 'end') {
    return 'Danke fürs Zuschauen, bis zum nächsten Mal 👋';
  }

  let text: string = '';

  switch (category.value) {
    case 'Bloons TD 6':
    case 'Brotato':
    case 'Cities: Skylines II':
    case 'Cult of the Lamb':
    case 'Dorfromantik':
    case 'Deep Rock Galactic: Survivor':
    case 'Golf It!':
    case 'Minecraft':
    case 'Project Zomboid':
    case 'Pokémon Trading Card Game Live':
    case 'shapez':
    case 'Stray':
      switch (props.mode) {
        case 'break':
          text = '⏰ Kurze Pause, gleich geht es weiter mit';
          break;
        case 'start':
          text = '🥳 Gleich gehts los mit';
          break;
      }
      break;
    case 'Just Chatting':
    default:
      switch (props.mode) {
        case 'break':
          text = '⏰ Kurze Pause, gleich geht es weiter';
          break;
        case 'start':
          text = '🥳 Gleich gehts los';
          break;
      }
  }

  return text;
});

const startingSoonTextBackgroundColor = computed(() => {
  switch (category.value) {
    case 'Bloons TD 6':
      return 'rgba(1, 229, 255, 0.5)';
    case 'Brotato':
      return 'transparent';
    case 'Cities: Skylines II':
      return 'rgba(30, 71, 159, 0.5)';
    case 'Cult of the Lamb':
      return 'rgba(239, 17, 30, 0.35)';
    case 'Dorfromantik':
      return 'rgba(130, 186, 209, 0.75)';
    case 'Deep Rock Galactic: Survivor':
      return 'transparent';
    case 'Golf It!':
      return 'rgba(135, 80, 5, 0.5)';
    case 'Minecraft':
      return 'rgba(20, 5, 2, 0.5)';
    case 'Project Zomboid':
      return 'rgba(0, 0, 0, 1)';
    case 'Pokémon Trading Card Game Live':
      return 'rgba(78, 101, 151, 0.5)';
    case 'shapez':
      return 'rgba(62, 62, 74, 1)';
    case 'Stray':
      return 'rgba(41,26,26,0.75)';
    case 'Just Chatting':
    default:
      return 'rgba(115, 117, 80, 0.35)';
  }
});
const startingSoonImage = computed(() => {
  if (props.mode === 'end') {
    return undefined;
  }

  switch (category.value) {
    case 'Bloons TD 6':
      return '/modern/game-backgrounds/bloons-td-6.jpg';
    case 'Brotato':
      return '/modern/game-backgrounds/brotato.jpg';
    case 'Cities: Skylines II':
      return '/modern/game-backgrounds/cities-skylines-ii.jpg';
    case 'Cult of the Lamb':
      return '/modern/game-backgrounds/cult-of-the-lamb.jpg';
    case 'Dorfromantik':
      return '/modern/game-backgrounds/dorfromantik.jpg';
    case 'Deep Rock Galactic: Survivor':
      return '/modern/game-backgrounds/drg-survivor.jpg';
    case 'Golf It!':
      return '/modern/game-backgrounds/golf-it.jpg';
    case 'Minecraft':
      return '/modern/game-backgrounds/minecraft.jpg';
    case 'Mini Metro':
      return '/modern/game-backgrounds/mini-metro.jpg';
    case 'Mini Motorways':
      return '/modern/game-backgrounds/mini-motorways.jpg';
    case 'Project Zomboid':
      return '/modern/game-backgrounds/project-zomboid.jpg';
    case 'Pokémon Trading Card Game Live':
      return '/modern/game-backgrounds/ptcgl.jpg';
    case 'shapez':
      return '/modern/game-backgrounds/shapez.jpg';
    case 'Stray':
      return '/modern/game-backgrounds/stray.jpg';
    case 'Just Chatting':
    default:
      return '/modern/game-backgrounds/default.jpg';
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.intermission {
  aspect-ratio: 16 / 9;
  background-color: #121212;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: $window-frame-border-radius - $window-frame-padding;
  overflow: hidden;
  position: relative;

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
  .intermission__text {
    align-self: center;
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

.intermission--break {
  .intermission__text {
    bottom: 0;
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
    width: 100%;
  }
}

.intermission--start {
  .intermission__text {
    top: 0;
  }
}

.intermission-window {
  width: 100%;
}
</style>
