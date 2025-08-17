<template>
  <div class="chat-messages">
    <StreamTogetherInfoBox />
    <ul
      ref="messagesList"
      class="chat-messages__list">
      <template
        v-for="(message, index) of messages"
        :key="message.id">
        <template v-if="message.msgType === 'action'">
          <ActionMessage
            :ref="(el) => messageRefs[messages.length - (index + 1)] = el as ComponentPublicInstance<typeof ActionMessage>"
            v-bind="message"
            :message-index="messages.length - (index + 1)"
            :message-offset="getMessageOffset(messages.length - (index + 1))"
            @images-loaded="calculateMessageHeights" />
        </template>
        <template v-if="message.msgType === 'chat'">
          <ChatMessage
            :ref="(el) => messageRefs[messages.length - (index + 1)] = el as ComponentPublicInstance<typeof ChatMessage>"
            v-bind="message"
            :message-index="messages.length - (index + 1)"
            :message-offset="getMessageOffset(messages.length - (index + 1))"
            @images-loaded="calculateMessageHeights" />
        </template>
        <template v-if="message.msgType === 'raid'">
          <RaidMessage
            :ref="(el) => messageRefs[messages.length - (index + 1)] = el as ComponentPublicInstance<typeof RaidMessage>"
            v-bind="message"
            :message-index="messages.length - (index + 1)"
            :message-offset="getMessageOffset(messages.length - (index + 1))"
            @images-loaded="calculateMessageHeights" />
        </template>
        <template v-if="message.msgType === 'resub'">
          <ResubMessage
            :ref="(el) => messageRefs[messages.length - (index + 1)] = el as ComponentPublicInstance<typeof ResubMessage>"
            v-bind="message"
            :message-index="messages.length - (index + 1)"
            :message-offset="getMessageOffset(messages.length - (index + 1))"
            @images-loaded="calculateMessageHeights" />
        </template>
        <template v-if="message.msgType === 'subgift'">
          <SubGiftMessage
            :ref="(el) => messageRefs[messages.length - (index + 1)] = el as ComponentPublicInstance<typeof SubGiftMessage>"
            v-bind="message"
            :message-index="messages.length - (index + 1)"
            :message-offset="getMessageOffset(messages.length - (index + 1))"
            @images-loaded="calculateMessageHeights" />
        </template>
        <template v-if="message.msgType === 'subscription'">
          <SubscriptionMessage
            :ref="(el) => messageRefs[messages.length - (index + 1)] = el as ComponentPublicInstance<typeof SubscriptionMessage>"
            v-bind="message"
            :message-index="messages.length - (index + 1)"
            :message-offset="getMessageOffset(messages.length - (index + 1))"
            @images-loaded="calculateMessageHeights" />
        </template>
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
import StreamTogetherInfoBox from './StreamTogetherInfoBox.vue';
import { useTwitchStore } from '@/stores/twitch.store';
import ActionMessage from '@/components/chat/modern/messages/Action.vue';
import ChatMessage from '@/components/chat/modern/messages/Message.vue';
import RaidMessage from '@/components/chat/modern/messages/Raid.vue';
import ResubMessage from '@/components/chat/modern/messages/Resub.vue';
import SubGiftMessage from '@/components/chat/modern/messages/SubGift.vue';
import SubscriptionMessage from '@/components/chat/modern/messages/Subscription.vue';
import { broadcasterInfo } from '@/composables/twitch-chat.composable';
import { PRIMARY_BOT_ACCOUNT_USERNAME } from '@/common/constants/bot-accounts.constant';
import type { IChat } from '@/common/interfaces/index.interface';

const store = useTwitchStore();
const { messages } = storeToRefs(store);

const messagesList = ref<HTMLElement>();
const messageRefs = ref<ComponentPublicInstance<typeof ActionMessage | typeof ChatMessage | typeof RaidMessage | typeof ResubMessage | typeof SubGiftMessage | typeof SubscriptionMessage>[]>([]);
const messageHeights = ref<number[]>([]);

const chatNotificationAudio = ref<HTMLAudioElement | null>(null);
const canPlayNotificationSound = ref(false);
const isSoundPlaying = ref(false);
let notificationCooldownTimeout: number | null = null;

const { currentTime, playing, volume } = useMediaControls(chatNotificationAudio, {
  src: '/audio/chat-notification.mp3',
});

function getMessageOffset(index: number): number {
  let offset = 0;

  for (let i = 0; i < index; i++) {
    offset += (messageHeights.value[i] || 0) + 8;
  }

  return offset;
}

async function calculateMessageHeights() {
  await nextTick();

  const newHeights: number[] = [];

  messageRefs.value.forEach((messageRef, index) => {
    if (!messageRef?.$el) {
      // can trigger when a message is deleted on Twitch
      return;
    }
    newHeights[index] = messageRef.$el.getBoundingClientRect().height;
  });

  messageHeights.value = newHeights;
}

function shouldPlayNotificationSound(message: IChat) {
  return message.msgType === 'chat' && ![broadcasterInfo.name.toLowerCase(), PRIMARY_BOT_ACCOUNT_USERNAME.toLowerCase()].includes(message.userName?.toLowerCase() ?? '');
}

function playNotificationSound() {
  if (!canPlayNotificationSound.value || isSoundPlaying.value) {
    return;
  }

  isSoundPlaying.value = true;

  try {
    currentTime.value = 0;
    playing.value = true;

    canPlayNotificationSound.value = false;
    
    if (notificationCooldownTimeout) {
      clearTimeout(notificationCooldownTimeout);
    }
    
    notificationCooldownTimeout = setTimeout(() => {
      canPlayNotificationSound.value = true;
      isSoundPlaying.value = false;
    }, 10 * 1000);

  } catch (error) {
    console.warn('Error playing chat notification sound:', error);
    isSoundPlaying.value = false;
  }
}

watch(messages, () => {
  calculateMessageHeights();
 
  const latestMessage = messages.value.at(-1);
  if (latestMessage && shouldPlayNotificationSound(latestMessage as IChat)) {
    playNotificationSound();
  }
}, { deep: true });

onMounted(() => {
  calculateMessageHeights();
  volume.value = 0.25;
 
  notificationCooldownTimeout = setTimeout(() => {
    canPlayNotificationSound.value = true;
  }, 10 * 1000);
});
</script>

<style lang="scss" scoped>
.chat-messages {
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
  line-height: 1.5;
  overflow-anchor: auto;
  overflow: hidden;
  position: relative;
  width: 100%;

  &__list {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
  }
}
</style>
