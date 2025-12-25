<template>
  <WindowFrame
    :active
    class="intermission-window">
    <div
      class="intermission"
      :class="`intermission--${mode}`">
      <span class="intermission__text">{{ intermissionText }}</span>
      <template v-if="mode === 'start' && selectedTrailerData">
        <span
          class="intermission__video-text"
          :class="{ 'intermission__video-text--visible': isVideoTextVisible }">
          {{ selectedTrailerData.title }}
        </span>
      </template>
      <img
        alt=""
        class="intermission__image"
        :src="startingSoonImage" />
      <video
        v-if="mode === 'start' && selectedTrailerData"
        ref="trailerVideoRef"
        class="intermission__video"
        :class="{ 'intermission__video--visible': isVideoVisible }"
        playsinline
        preload="auto"
        :src="selectedTrailerData.url" />
    </div>
  </WindowFrame>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useMediaControls } from '@vueuse/core';
import WindowFrame from '@/components/desktop/WindowFrame.vue';
import { useTwitchStore } from '@/stores/twitch.store';
import { useStreamStatusStore } from '@/stores/stream-status.store';
import { useCiderComposable } from '@/composables/cider.composable';
import { GAME_METADATA } from '@/common/constants/game-metadata.constant';
import { TRAILERS_METADATA } from '@/common/constants/trailers-metadata.constant';
import { useApplicationStore } from '@/stores/application.store';

const props = defineProps<{ active?: boolean; mode?: 'end' | 'break' | 'start' }>();

const VIDEO_PLAYBACK_DELAY = 30 * 1000; // 30 seconds after ad ends

const applicationStore = useApplicationStore();
const { intermissionVideoPlaying } = storeToRefs(applicationStore);

const store = useTwitchStore();
const { category, isAdRunning } = storeToRefs(store);

const streamStatusStore = useStreamStatusStore();
const { live } = storeToRefs(streamStatusStore);

const { setVolume } = useCiderComposable();

const trailerVideoRef = ref<HTMLVideoElement | null>(null);
const isVideoVisible = ref(false);
const isVideoTextVisible = ref(false);
let playTimeout: ReturnType<typeof setTimeout> | null = null;
let hideTextTimeout: ReturnType<typeof setTimeout> | null = null;
let hasStartedPlayback = ref(false);
const firstAdFinished = ref(false);

// Initialize ad break listener when component mounts
onMounted(() => {
  store.initializeAdBreakListener();
});

const { playing, ended } = useMediaControls(trailerVideoRef);

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
const selectedTrailerData = computed(() => {
  if (props.mode !== 'start') {
    return null;
  }

  const trailers = TRAILERS_METADATA[category.value as keyof typeof TRAILERS_METADATA];
  if (!trailers) {
    return null;
  }

  // Randomly select a trailer
  const randomIndex = Math.floor(Math.random() * trailers.length);
  return trailers[randomIndex];
});

const startingSoonImage = computed(() => {
  if (props.mode === 'end') {
    return '/bamboechop.png';
  }

  return GAME_METADATA[category.value]?.backgroundImagePath ?? '/modern/game-backgrounds/default.jpg';
});

const startTrailerPlayback = async () => {
  // Only start playback if stream is live and we haven't started yet
  if (props.mode === 'start' && selectedTrailerData.value && live.value && !hasStartedPlayback.value) {
    hasStartedPlayback.value = true;
    
    // Wait for the video element to be created
    await nextTick();
    // Wait a bit more to ensure the video element is fully ready
    await new Promise(resolve => setTimeout(resolve, 100));
    if (trailerVideoRef.value) {
      // Reset visibility state
      isVideoVisible.value = false;
      isVideoTextVisible.value = false;
      
      // Clear any existing timeouts
      if (playTimeout) {
        clearTimeout(playTimeout);
      }
      if (hideTextTimeout) {
        clearTimeout(hideTextTimeout);
      }
      // Start playback after delay
      playTimeout = setTimeout(() => {
        if (trailerVideoRef.value) {
          trailerVideoRef.value.play().catch((error) => {
            console.error('Failed to play trailer video:', error);
          });
        }
      }, VIDEO_PLAYBACK_DELAY);
    }
  }
};

// Fade in when video starts playing
watch(playing, (isPlaying) => {
  intermissionVideoPlaying.value = isPlaying;
  if (isPlaying && props.mode === 'start') {
    isVideoVisible.value = true;
    // Fade in video text when playback starts
    isVideoTextVisible.value = true;
    // Lower Cider volume to 0.1 when trailer starts (from current volume 1.0)
    setVolume(1.0, 0.1);
    // Fade out video text 10 seconds after playback starts
    hideTextTimeout = setTimeout(() => {
      isVideoTextVisible.value = false;
    }, 10000); // 10 seconds
  }
});

// Fade out when video ends
watch(ended, (isEnded) => {
  if (isEnded && props.mode === 'start') {
    isVideoVisible.value = false;
    // Restore Cider volume to 1.0 when trailer ends (from current volume 0.1)
    setVolume(0.1, 1.0);
  }
});

// Watch for ad finishing to start trailer playback
watch(isAdRunning, (isRunning, wasRunning) => {
  // When ad finishes (goes from true to false) and it's the first ad
  if (wasRunning && !isRunning && !firstAdFinished.value && live.value) {
    firstAdFinished.value = true;
    // Start trailer playback 30 seconds after ad ends
    startTrailerPlayback();
  }
});

// Reset when stream goes offline
watch(live, (isLive) => {
  if (!isLive) {
    hasStartedPlayback.value = false;
    firstAdFinished.value = false;
    if (playTimeout) {
      clearTimeout(playTimeout);
      playTimeout = null;
    }
    if (hideTextTimeout) {
      clearTimeout(hideTextTimeout);
      hideTextTimeout = null;
    }
  }
});

// Watch for changes in selectedTrailerData or mode to handle category/scene changes
// Only trigger if stream is already live and first ad has finished
watch([() => props.mode, selectedTrailerData], () => {
  if (live.value && firstAdFinished.value) {
    hasStartedPlayback.value = false; // Reset to allow restarting with new trailer
    startTrailerPlayback();
  }
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
    object-fit: cover;
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

  &__video {
    animation: scaleUpDown 15s ease-in-out infinite alternate;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    position: absolute;
    transition: opacity 1s ease-in-out;
    width: 100%;

    @keyframes scaleUpDown {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(1.05);
      }
    }

    &--visible {
      opacity: 1;
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
    padding: 32px 24px 32px 256px;
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

.intermission--start {
  .intermission__video-text {
    border-radius: $window-frame-border-radius - $window-frame-padding;
    background-color: rgba(0, 0, 0, 0.75);
    bottom: 200px;
    color: #fff;
    font-size: 24px;
    left: 50%;
    opacity: 0;
    padding: 12px 20px;
    pointer-events: none;
    position: absolute;
    transform: translateX(-50%);
    transition: opacity 1s ease-in-out;
    z-index: 1;

    &--visible {
      opacity: 1;
    }
  }
}

.intermission-window {
  width: 100%;
}
</style>
