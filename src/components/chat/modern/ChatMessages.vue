<template>
  <div class="chat-messages">
    <ul class="chat-messages__list">
      <template
        v-for="message of messages"
        :key="message.id">
        <template v-if="message.msgType === 'chat'">
          <ChatMessage v-bind="message" />
        </template>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useTwitchStore } from '@/stores/twitch.store';
import ChatMessage from '@/components/chat/coworking/messages/Message.vue';

const store = useTwitchStore();
const { messages } = storeToRefs(store);
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
    align-items: start;
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: start;
    list-style: none;
    margin: 0;
    padding: 0;
  }
}
</style>
