<template>
  <template v-if="gigantifiedEmoteQueue.length > 0">
    <img
      class="gigantified-emote"
      :class="{
        'animate-slide-through': isAnimating && !isLurkEmote,
        'animate-lurk': isAnimating && isLurkEmote,
        'gigantified-emote--lurk': isLurkEmote,
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
import { useSearchParamsComposable } from '@/composables/search-params-composable.composable';

const store = useTwitchStore();
const { messages } = storeToRefs(store);

const { gigantifiedEmoteVolume } = useSearchParamsComposable();

const gigantifiedEmoteQueue = ref<{ emote: string; messageId: string; url: string }[]>([]);
const isAnimating = ref(false);
const audioPlayer = ref<HTMLAudioElement>();

const { currentTime, playing, volume } = useMediaControls(audioPlayer, { src: '/audio/woosh.mp3' });

const isLurkEmote = computed(() => {
  return gigantifiedEmoteQueue.value[0]?.emote === 'bamboe1Lurk';
});

function startAnimation() {
  isAnimating.value = true;
  audioPlayer.value!.src = isLurkEmote.value ? '/audio/mission-impossible.mp3' : '/audio/woosh.mp3';
  currentTime.value = 0;
  playing.value = true;
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
      if (emote?.startsWith('bamboe1')) {
        const fileEnding = emote === 'bamboe1Lurk' ? 'gif' : 'png';
        url = `/emotes/${emote}.${fileEnding}`;
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

  &.animate-lurk {
    animation: lurk-animation 3.6s ease-in-out forwards;
  }
}

.gigantified-emote--lurk {
  margin: 0 auto;
  max-width: 1920px;
}

@keyframes slide-up {
  0% {
    transform: translateX(-50%) translateY(100vh);
  }
  to {
    transform: translateX(-50%) translateY(-200vh);
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
</style>
