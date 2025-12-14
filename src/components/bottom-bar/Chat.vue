<template>
  <div class="chat">
    <div class="chat__reverse-wrapper">
      <ul class="chat__list">
        <template
          v-for="message of messages"
          :key="message.id">
          <ChatMessage v-bind="message" />
          <template v-if="message.msgType === 'action'"></template>
          <template v-if="message.msgType === 'chat'"></template>
          <template v-if="message.msgType === 'raid'"></template>
          <template v-if="message.msgType === 'resub'"></template>
          <template v-if="message.msgType === 'subgift'"></template>
          <template v-if="message.msgType === 'subscription'"></template>
        </template>
      </ul>
    </div>
    <audio
      ref="chatNotificationAudio"
      style="display: none;"></audio>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useMediaControls } from '@vueuse/core';
import { useTwitchStore } from '@/stores/twitch.store';
import type { IChat } from '@/common/interfaces/index.interface';
import { PRIMARY_BOT_ACCOUNT_USERNAME } from '@/common/constants/bot-accounts.constant';
import { broadcasterInfo } from '@/composables/twitch-chat.composable';
import ChatMessage from '@/components/bottom-bar/ChatMessage.vue';

const store = useTwitchStore();
const { messages } = storeToRefs(store);

const chatNotificationAudio = ref<HTMLAudioElement | null>(null);
const isSoundPlaying = ref(false);
const shouldPlaySoundOnNextMessage = ref(false);
let silenceTimeout: number | null = null;

const { currentTime, playing, volume } = useMediaControls(chatNotificationAudio, {
  src: '/audio/chat-notification.mp3',
});

function shouldPlayNotificationSound(message: IChat) {
  return message.msgType === 'chat' && ![broadcasterInfo.name.toLowerCase(), PRIMARY_BOT_ACCOUNT_USERNAME.toLowerCase()].includes(message.userName?.toLowerCase() ?? '');
}

function startSilenceDetection() {
  if (silenceTimeout) {
    clearTimeout(silenceTimeout);
  }
  
  shouldPlaySoundOnNextMessage.value = false;
  
  silenceTimeout = setTimeout(() => {
    shouldPlaySoundOnNextMessage.value = true;
  }, 5 * 60 * 1000);
}

function playNotificationSound() {
  if (!shouldPlaySoundOnNextMessage.value || isSoundPlaying.value) {
    return;
  }

  isSoundPlaying.value = true;

  try {
    currentTime.value = 0;
    playing.value = true;

    shouldPlaySoundOnNextMessage.value = false;
    
    startSilenceDetection();

  } catch (error) {
    console.warn('Error playing chat notification sound:', error);
  } finally {
    isSoundPlaying.value = false;
  }
}

onMounted(() => {
  volume.value = 0.25;
  startSilenceDetection();
});

watch(messages, () => {
  const latestMessage = messages.value.at(-1);
  if (latestMessage && shouldPlayNotificationSound(latestMessage as IChat)) {
    if (shouldPlaySoundOnNextMessage.value) {
      playNotificationSound();
    } else {
      startSilenceDetection();
    }
  }
}, { deep: true });
</script>

<style lang="scss" scoped>
.chat {
  &__list {
    align-items: end;
    column-gap: 20px;
    display: flex;
    flex-direction: row;
    height: 100%;
    justify-content: end;
    margin: 0;
    padding: 0;
  }

  &__reverse-wrapper {
    display: flex;
    flex-direction: row-reverse;
    height: 100%;
  }
}
</style>
