<template>
  <div class="chat-messages">
    <div class="chat-messages__container">
      <ul class="chat-messages__list">
        <!-- v-for="message of internalMessages" -->
        <template
          v-for="message of messages"
          :key="message.id">
          <template v-if="message.msgType === 'action'">
            <Transition appear>
              <ActionMessage
                v-show="message.show"
                v-bind="message" />
            </Transition>
          </template>
          <template v-if="message.msgType === 'chat'">
            <Transition appear>
              <ChatMessage
                v-show="message.show"
                v-bind="message" />
            </Transition>
          </template>
          <template v-if="message.msgType === 'raid'">
            <Transition appear>
              <RaidMessage
                v-show="message.show"
                v-bind="message" />
            </Transition>
          </template>
          <template v-if="message.msgType === 'resub'">
            <Transition appear>
              <ResubMessage
                v-show="message.show"
                v-bind="message" />
            </Transition>
          </template>
          <template v-if="message.msgType === 'subgift'">
            <Transition appear>
              <SubGiftMessage
                v-show="message.show"
                v-bind="message" />
            </Transition>
          </template>
          <template v-if="message.msgType === 'subscription'">
            <Transition appear>
              <SubscriptionMessage
                v-show="message.show"
                v-bind="message" />
            </Transition>
          </template>
        </template>
      </ul>
    </div>
    <div class="chat-messages__twitch">
      <template v-if="loading">
        <CitiesSkylinesIILoader />
      </template>
      <template v-if="!loading">
        <TwitchSvg />
      </template>
    </div>
    <audio
      ref="audioPlayer"
      style="display: none"></audio>
  </div>
</template>

<script setup lang="ts">
import { type DebuggerEvent, onMounted, ref } from 'vue';
import { useMediaControls } from '@vueuse/core';
import { storeToRefs } from 'pinia';
// @ts-expect-error "cannot find module or its corresponding type declarations", I just want the icon ;_;
import TwitchSvg from '@/assets/twitch.svg?component';
import CitiesSkylinesIILoader from '@/components/chat/cities-skylines-ii/Loader.vue';
import ActionMessage from '@/components/chat/cities-skylines-ii/messages/Action.vue';
import ChatMessage from '@/components/chat/cities-skylines-ii/messages/Message.vue';
import RaidMessage from '@/components/chat/cities-skylines-ii/messages/Raid.vue';
import ResubMessage from '@/components/chat/cities-skylines-ii/messages/Resub.vue';
import SubGiftMessage from '@/components/chat/cities-skylines-ii/messages/SubGift.vue';
import SubscriptionMessage from '@/components/chat/cities-skylines-ii/messages/Subscription.vue';
import { useTwitchStore } from '@/stores/twitch.store';

defineProps<{ loading: boolean }>();

const store = useTwitchStore();
const { messages } = storeToRefs(store);
const { removeMessageByMessageId } = store;

const audioPlayer = ref<HTMLAudioElement>();
const { playing } = useMediaControls(audioPlayer, { src: 'chirper.mp3' });

onMounted(async () => {
  window.setInterval(async () => {
    for (const message of messages.value) {
      if (!message.show && 'id' in message) {
        removeMessageByMessageId(message.id as string);
      }

      // set stale messages to be hidden
      if (!message.timestamp || Date.now() - message.timestamp >= 7000) {
        message.show = false;
      }
    }
  }, 1000);
});

store.$subscribe((mutation) => {
  if (audioPlayer.value && !playing.value && (mutation.events as DebuggerEvent).type === 'add') {
    playing.value = true;
  }
});
</script>

<style scoped lang="scss">
@import '@/assets/cities-skylines-ii.variables';

$button-icon-size: 38px;

.chat-messages {
  display: grid;
  gap: 10px;
  grid-template-columns: 480px 1fr;

  &__container {
    display: flex;
    flex-direction: column-reverse;
    height: 100vh;
    overflow-anchor: auto;
    position: relative;
  }

  &__list {
    align-items: start;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: start;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__twitch {
    align-items: center;
    align-self: end;
    background-color: rgba(0,0,0,.6);
    border-radius: 50%;
    display: flex;
    height: $twitch-button-size;
    justify-content: center;
    margin-bottom: $twitch-button-offset;
    width: $twitch-button-size;

    svg {
      height: $button-icon-size;
      margin-top: 5px;
      width: $button-icon-size;
    }
  }
}
</style>
