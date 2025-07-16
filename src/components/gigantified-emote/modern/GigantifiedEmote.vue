<template>
  <template v-if="gigantifiedEmoteQueue.length > 0">
    <img
      class="gigantified-emote"
      :class="{
        'animate-slide-through': isAnimating && !isBlaEmote && !isClapEmote && !isLurkEmote && !isNotedEmote && !isSteerEmote,
        'animate-bla': isAnimating && isBlaEmote,
        'animate-clap': isAnimating && isClapEmote,
        'animate-lurk': isAnimating && isLurkEmote,
        'animate-noted': isAnimating && isNotedEmote,
        'animate-steer': isAnimating && isSteerEmote,
        'gigantified-emote--bla': isBlaEmote,
        'gigantified-emote--clap': isClapEmote,
        'gigantified-emote--lurk': isLurkEmote,
        'gigantified-emote--noted': isNotedEmote,
        'gigantified-emote--steer': isSteerEmote,
      }"
      :src="gigantifiedEmoteQueue[0].url"
      :alt="gigantifiedEmoteQueue[0].emote"
      @load="startAnimation"
      @animationend="onAnimationEnd" />
  </template>
  <audio
    ref="audioPlayer"
    preload="auto"></audio>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { useMediaControls } from '@vueuse/core';
import { useTwitchStore } from '@/stores/twitch.store';
import type { IChat } from '@/common/interfaces/index.interface';
import { parseMessage } from '@/common/helpers/twitch-message.helper';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import { EMOTES } from '@/common/constants/emotes.constant';

const store = useTwitchStore();
const { messages } = storeToRefs(store);

const { gigantifiedEmoteVolume } = useSearchParamsComposable();

const gigantifiedEmoteQueue = ref<{ emote: string; messageId: string; url: string }[]>([]);
const isAnimating = ref(false);
const audioPlayer = ref<HTMLAudioElement>();

const { currentTime, playing, volume } = useMediaControls(audioPlayer, { src: '/audio/woosh.mp3' });

const isBlaEmote = computed(() => gigantifiedEmoteQueue.value[0]?.emote === 'bamboe1Bla');

const isClapEmote = computed(() => gigantifiedEmoteQueue.value[0]?.emote === 'bamboe1Clap');

const isLurkEmote = computed(() => gigantifiedEmoteQueue.value[0]?.emote === 'bamboe1Lurk');

const isNotedEmote = computed(() => gigantifiedEmoteQueue.value[0]?.emote === 'bamboe1Noted');

const isSteerEmote = computed(() => gigantifiedEmoteQueue.value[0]?.emote === 'bamboe1Steer');

function getAudioSrc() {
  if (isBlaEmote.value) {
    return '/audio/bla.wav';
  }

  if (isClapEmote.value) {
    return '/audio/clap.mp3';
  }

  if (isLurkEmote.value) {
    return '/audio/mission-impossible.mp3';
  }
  if (isNotedEmote.value) {
    return '/audio/noted.wav';
  }

  if (isSteerEmote.value) {
    return '/audio/crash.wav';
  }

  return '/audio/woosh.mp3';
}

function startAnimation() {
  audioPlayer.value!.src = getAudioSrc();
  currentTime.value = 0;
  playing.value = true;
  isAnimating.value = true;
}

function onAnimationEnd() {
  isAnimating.value = false;
}

onMounted(() => {
  volume.value = gigantifiedEmoteVolume.value;
});

watch([isAnimating, playing], ([isAnimating, isPlaying]) => {
  if (!isAnimating && !isPlaying && gigantifiedEmoteQueue.value.length > 0) {
    gigantifiedEmoteQueue.value.shift();
  }
});

watch(messages, () => {
  const newestMessage = (messages.value as IChat[]).at(-1);

  if (newestMessage && newestMessage.msgId === 'gigantified-emote-message') {
    const emotes = parseMessage(newestMessage.emotes, newestMessage.text, 'dark', '3.0').filter(part => part.type === 'emote');
    if (emotes.length > 0) {
      let { raw: emote, value: url } = emotes.at(-1)! as { raw: string; value: string };
      const emoteObject = EMOTES.find(e => e.name === emote);
      if (emoteObject) {
        url = emoteObject.url;
      }
      if (!gigantifiedEmoteQueue.value.find(item => item.messageId === newestMessage.msgId)) {
        gigantifiedEmoteQueue.value.push({ emote, messageId: newestMessage.msgId, url });
      }
    }
  }
}, { deep: true, immediate: true });
</script>

<style lang="scss" scoped>
.gigantified-emote {
  position: fixed;
  left: 50%;
  transform: translateX(-50%) translateY(100vh);
  width: 100%;
  z-index: 9999;
  filter: drop-shadow(0 75px 20px rgba(0, 0, 0, 0.75));

  &.animate-slide-through {
    animation: slide-up 2.201s ease-in-out forwards;
  }

  &.animate-bla {
    animation: bla-animation 6.5s ease-in-out forwards;
  }

  &.animate-clap {
    animation: clap-animation 4.5s ease-in-out forwards;
  }

  &.animate-lurk {
    animation: lurk-animation 3.6s ease-in-out forwards;
  }

  &.animate-noted {
    animation: noted-animation 1.9s ease-in-out forwards;
  }

  &.animate-steer {
    animation: steer-animation 3.9s ease-in-out forwards;
  }
}

.gigantified-emote--bla {
  max-height: 900px;
  width: auto;
}

.gigantified-emote--lurk {
  margin: 0 auto;
  max-width: 1920px;
}

.gigantified-emote--clap {
  max-height: 720px;
  width: auto;
}

.gigantified-emote--noted {
  left: auto;
  max-height: 720px;
  right: 10px;
  transform: translateY(100vh);
  width: auto;
}

.gigantified-emote--steer {
  bottom: 0;
  filter: none;
  left: 0;
  max-height: 1080px;
  opacity: 0;
  transform: none;
  width: auto;
}

@keyframes slide-up {
  0% {
    transform: translateX(-50%) translateY(100vh);
  }
  to {
    transform: translateX(-50%) translateY(-200vh);
  }
}

@keyframes bla-animation {
  // bottom left
  0%,
  14.27% {
    transform: translateX(-125%) translateY(55vh);
    scale: 0.8;
  }

  // top left
  14.28%,
  28.56% {
    transform: translateX(-225%) translateY(0vh) rotate(90deg);
    scale: 0.7;
  }

  // bottom right
  28.57%,
  42.89% {
    transform: translateX(50%) translateY(40vh) rotate(270deg);
    scale: 0.9;
  }

  // bottom left
  42.90%,
  57.13% {
    transform: translateX(-100%) translateY(37vw) rotate(0deg);
    scale: 0.75;
  }

  // bottom left diagonal
  57.14%,
  71.44% {
    transform: translateX(-100vw) translateY(95vh) rotate(45deg);
    scale: 0.6;
  }

  // top middle
  71.45%,
  85.70% {
    transform: translateX(-50%) translateY(-5vh) rotate(180deg);
    scale: 1;
  }

  // top right diagonal
  85.71%,
  100% {
    transform: translateX(67%) translateY(-37%) rotate(225deg);
    scale: 0.8;
  }
}

@keyframes clap-animation {
  0% {
    transform: translateX(-50%) translateY(calc(100vh));
    opacity: 0;
  }
  5% {
    transform: translateX(-50%) translateY(calc(100vh - 100%));
    opacity: 1;
  }
  90% {
    transform: translateX(-50%) translateY(calc(100vh - 100%));
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(calc(100vh + 150px));
    opacity: 1;
  }
}

@keyframes lurk-animation {
  0% {
    transform: translateX(-50%) translateY(calc(100vh));
    opacity: 0;
  }
  10% {
    transform: translateX(-50%) translateY(calc(100vh - 100%));
    opacity: 1;
  }
  90% {
    transform: translateX(-50%) translateY(calc(100vh - 100%));
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(calc(100vh + 150px));
    opacity: 1;
  }
}

@keyframes noted-animation {
  0% {
    transform: translateY(calc(100vh));
    opacity: 0;
  }
  10% {
    transform: translateY(calc(100vh - 100%));
    opacity: 1;
  }
  90% {
    transform: translateY(calc(100vh - 100%));
    opacity: 1;
  }
  100% {
    transform: translateY(calc(100vh + 150px));
    opacity: 1;
  }
}

@keyframes steer-animation {
  0% {
    opacity: 0;
  }

  40%,
  99% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
