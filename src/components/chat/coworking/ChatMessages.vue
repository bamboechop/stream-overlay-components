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
import { useMessagesStore } from '@/stores/twitch.store';
import ChatMessage from '@/components/chat/coworking/messages/Message.vue';

const store = useMessagesStore();
const { messages } = storeToRefs(store);
</script>

<style lang="scss" scoped>
.chat-messages {
  color: #fff;
  display: flex;
  flex-direction: column-reverse;
  font-size: 13px;
  height: 370px;
  line-height: 1.5;
  overflow-anchor: auto;
  overflow: hidden;
  padding: 4px 8px 8px 8px;
  position: relative;

  &__list {
    align-items: start;
    display: flex;
    flex-direction: column;
    gap: 16px;
    justify-content: start;
    list-style: none;
    margin: 0;
    padding: 0;
  }
}
</style>
