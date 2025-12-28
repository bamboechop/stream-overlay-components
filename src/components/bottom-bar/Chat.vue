<template>
  <div class="chat">
    <ul class="chat__list">
      <template
        v-for="(message, index) of messages"
        :key="message.id">
        <ChatMessage
          :ref="(el) => messageRefs[index] = el as ComponentPublicInstance<typeof ChatMessage>"
          v-bind="message"
          :message-index="index"
          :message-offset="getMessageOffset(index)" />
      </template>
    </ul>
    <audio
      ref="chatNotificationAudio"
      style="display: none;"></audio>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { type ComponentPublicInstance, nextTick, onMounted, ref, watch } from 'vue';
import { useMediaControls } from '@vueuse/core';
import { useTwitchStore } from '@/stores/twitch.store';
import type { IChat } from '@/common/interfaces/index.interface';
import { PRIMARY_BOT_ACCOUNT_USERNAME } from '@/common/constants/bot-accounts.constant';
import { broadcasterInfo } from '@/composables/twitch-chat.composable';
import ChatMessage from '@/components/bottom-bar/ChatMessage.vue';

const store = useTwitchStore();
const { messages } = storeToRefs(store);

const messageRefs = ref<ComponentPublicInstance<typeof ChatMessage>[]>([]);
const messageWidths = ref<number[]>([]);

const chatNotificationAudio = ref<HTMLAudioElement | null>(null);
const isSoundPlaying = ref(false);
const shouldPlaySoundOnNextMessage = ref(false);
let silenceTimeout: number | null = null;

const { currentTime, playing, volume } = useMediaControls(chatNotificationAudio, {
  src: '/audio/chat-notification.mp3',
});

function getMessageOffset(index: number): number {
  let offset = 0;
  const totalMessages = messages.value.length;
  for (let i = index + 1; i < totalMessages; i++) {
    offset += (messageWidths.value[i] || 0) + 4; // 4px gap
  }
  return offset;
}

async function calculateMessageWidths() {
  await nextTick();
  const newWidths: number[] = [];
  messageRefs.value.forEach((messageRef, index) => {
    if (!messageRef?.$el) {
      // can trigger when a message is deleted on Twitch
      newWidths[index] = 0;
      return;
    }
    const measuredWidth = messageRef.$el.getBoundingClientRect().width;
    newWidths[index] = measuredWidth + 16; // 16px for avatar overflow
  });
  messageWidths.value = newWidths;
}

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
  calculateMessageWidths();
});

watch(messages, () => {
  calculateMessageWidths();
  
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
    height: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
  }
}
</style>
