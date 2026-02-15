<template>
  <Transition name="fade">
    <template v-if="imageLoaded">
      <div class="show-toasty">
        <img
          alt=""
          class="show-toasty__avatar"
          :src="userImage"
          :style="{ opacity: imageLoaded ? 1 : 0 }"
        />
      </div>
    </template>
  </Transition>
  <audio
    ref="audioPlayer"
    preload="auto"></audio>
</template>

<script lang="ts" setup>
import { preloadImage } from '@/common/helpers/common.helper';
import type { IEventStreamToasteryChannelPointsShowData } from '@/common/interfaces/event-stream.interface';
import { useEventStreamComposable } from '@/composables/event-stream.composable';
import { useMediaControls } from '@vueuse/core';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const AUDIO_COUNT = 10;
const DISPLAY_DURATION = 10000; // How long each toasty is shown (ms)
const FADE_DURATION = 500; // Matches the CSS transition duration (ms)
const QUEUE_GAP = 10000; // Pause between consecutive toasties (ms)

const queue: IEventStreamToasteryChannelPointsShowData[] = [];
let queueTimerId: ReturnType<typeof setTimeout> | null = null;

const TOASTEREI_BASE_URL = import.meta.env.VITE_DIE_TOASTEREI_BASE_URL;
const defaultAvatarUrl = `${TOASTEREI_BASE_URL}/avatars/default.png`;

const { on } = useEventStreamComposable();

const audioPlayer = ref<HTMLAudioElement>();
const { currentTime, playing } = useMediaControls(audioPlayer, { src: '/audio/show-toasty/1.mp3' });

const isProcessing = ref(false);
const imageLoaded = ref(false);
const userImage = ref<string>('');

async function handleData(data: IEventStreamToasteryChannelPointsShowData) {
  playAudio();
  const avatarUrl = `${TOASTEREI_BASE_URL}/avatars/${data.userId}.png?${Date.now()}`;

  userImage.value = avatarUrl;

  try {
    await preloadImage(avatarUrl);
  } catch {
    userImage.value = defaultAvatarUrl;
  }

  imageLoaded.value = true;

  // Keep the toasty visible for the display duration, then hide and schedule the next item
  queueTimerId = setTimeout(() => {
    imageLoaded.value = false;
    playing.value = false;
    currentTime.value = 0;

    // Wait for the fade-out transition + the gap before processing the next queued item
    queueTimerId = setTimeout(() => {
      isProcessing.value = false;
      processQueue();
    }, FADE_DURATION + QUEUE_GAP);
  }, DISPLAY_DURATION);
}

function playAudio() {
  audioPlayer.value!.src = `/audio/show-toasty/${Math.floor(Math.random() * AUDIO_COUNT) + 1}.mp3`;
  currentTime.value = 0;
  playing.value = true;
}

function processQueue() {
  if (isProcessing.value || queue.length === 0) {
    return;
  }

  isProcessing.value = true;
  const data = queue.shift()!;
  handleData(data);
}

onMounted(() => {
  on<IEventStreamToasteryChannelPointsShowData>('toastery.channel-points.show', (data) => {
    queue.push(data);
    processQueue();
  });
});

onBeforeUnmount(() => {
  if (queueTimerId !== null) {
    clearTimeout(queueTimerId);
    queueTimerId = null;
  }
});
</script>

<style lang="scss" scoped>
.show-toasty {
  align-items: center;
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;

  &__avatar {
    filter: drop-shadow(0 0 20px #000) drop-shadow(0 0 40px #000);
    max-height: 512px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>