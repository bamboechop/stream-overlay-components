<template>
  <div class="chat-messages">
    <ul class="chat-messages__list">
      <template
        v-for="message of messages"
        :key="message.id">
        <template v-if="message.msgType === 'action'">
          <ActionMessage v-bind="message" />
        </template>
        <template v-if="message.msgType === 'chat'">
          <ChatMessage v-bind="message" />
        </template>
        <template v-if="message.msgType === 'raid'">
          <RaidMessage v-bind="message" />
        </template>
        <template v-if="message.msgType === 'resub'">
          <ResubMessage v-bind="message" />
        </template>
        <template v-if="message.msgType === 'subgift'">
          <SubGiftMessage v-bind="message" />
        </template>
        <template v-if="message.msgType === 'subscription'">
          <SubscriptionMessage v-bind="message" />
        </template>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useTwitchStore } from '@/stores/twitch.store';
import ActionMessage from '@/components/chat/modern/messages/Action.vue';
import ChatMessage from '@/components/chat/modern/messages/Message.vue';
import RaidMessage from '@/components/chat/modern/messages/Raid.vue';
import ResubMessage from '@/components/chat/modern/messages/Resub.vue';
import SubGiftMessage from '@/components/chat/modern/messages/SubGift.vue';
import SubscriptionMessage from '@/components/chat/modern/messages/Subscription.vue';

const store = useTwitchStore();
const { messages } = storeToRefs(store);
</script>

<style lang="scss" scoped>
.chat-messages {
  color: #fff;
  display: flex;
  flex-direction: column-reverse;
  font-size: 14px;
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
