<template>
  <div
    ref="chatContainer"
    class="chat">
    <ul class="chat__list">
      <template
        v-for="(message, index) of messages"
        :key="message.id">
        <ChatMessage
          v-if="message.msgType === 'action' || message.msgType === 'chat'"
          :ref="(el) => messageRefs[index] = el as ComponentPublicInstance<typeof ChatMessage>"
          v-bind="message"
          :message-index="index"
          :message-offset="getMessageOffset(index)">
            <template #header>
              <MessageHeader
                :availableBadges="message.availableBadges"
                :color="message.color"
                :displayName="message.displayName"
                :msgType="message.msgType"
                :timestamp="message.timestamp"
                :userBadges="message.userBadges"
                :userName="message.userName" />
            </template>
            <template #content>
              <MessageContent
                :emotes="message.emotes"
                :msgId="message.msgId"
                :msgType="message.msgType"
                :text="message.text"
                :userId="message.userId" />
            </template>
        </ChatMessage>
        <RaidMessage
          v-if="message.msgType === 'raid'"
          :ref="(el) => messageRefs[index] = el as ComponentPublicInstance<typeof RaidMessage>"
          v-bind="message"
          :message-index="index"
          :message-offset="getMessageOffset(index)" />
          <ResubMessage
            v-if="message.msgType === 'resub'"
            :ref="(el) => messageRefs[index] = el as ComponentPublicInstance<typeof ResubMessage>"
            v-bind="message"
            :message-index="index"
            :message-offset="getMessageOffset(index)" />
          <SubMessage
            v-if="message.msgType === 'subscription'"
            :ref="(el) => messageRefs[index] = el as ComponentPublicInstance<typeof SubMessage>"
            v-bind="message"
            :message-index="index"
            :message-offset="getMessageOffset(index)" />
          <SubgiftMessage
            v-if="message.msgType === 'subgift'"
            :ref="(el) => messageRefs[index] = el as ComponentPublicInstance<typeof SubgiftMessage>"
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
import RaidMessage from '@/components/bottom-bar/RaidMessage.vue';
import MessageHeader from '@/components/bottom-bar/message-parts/MessageHeader.vue';
import MessageContent from '@/components/bottom-bar/message-parts/MessageContent.vue';
import SubgiftMessage from './SubgiftMessage.vue';
import SubMessage from './SubMessage.vue';
import ResubMessage from './ResubMessage.vue';

const store = useTwitchStore();
const { messages } = storeToRefs(store);

const messageRefs = ref<ComponentPublicInstance<typeof ChatMessage | typeof RaidMessage | typeof ResubMessage | typeof SubMessage | typeof SubgiftMessage>[]>([]);
const messageWidths = ref<number[]>([]);
const chatContainer = ref<HTMLDivElement | null>(null);

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

const SECURITY_OFFSET = 600;

function removeOffscreenMessages() {
  if (!chatContainer.value) {
    return;
  }

  const containerWidth = chatContainer.value.getBoundingClientRect().width;
  const messagesToRemove: string[] = [];

  // Iterate through messages from oldest (index 0) to newest
  for (let i = 0; i < messages.value.length; i++) {
    const message = messages.value[i];
    
    if (!('id' in message) || !message.id) {
      continue;
    }

    const messageWidth = messageWidths.value[i];
    if (!messageWidth || messageWidth === 0) {
      continue;
    }

    const messageRef = messageRefs.value[i];
    if (!messageRef?.$el) {
      continue;
    }

    // Calculate if message has slid off-screen
    // Message's left edge position: containerWidth - offset - messageWidth
    // Remove if: offset + messageWidth > containerWidth + SECURITY_OFFSET
    const offset = getMessageOffset(i);
    if (offset + messageWidth > containerWidth + SECURITY_OFFSET) {
      messagesToRemove.push(message.id);
    }
  }

  // Remove messages that are off-screen
  messagesToRemove.forEach((id) => {
    store.removeMessageByMessageId(id);
  });
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

onMounted(async () => {
  volume.value = 0.25;
  startSilenceDetection();
  await calculateMessageWidths();
  removeOffscreenMessages();
});

watch(messages, async () => {
  await calculateMessageWidths();
  removeOffscreenMessages();
  
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
