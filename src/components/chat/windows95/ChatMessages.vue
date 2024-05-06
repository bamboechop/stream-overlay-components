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
import ActionMessage from '@/components/chat/windows95/messages/Action.vue';
import ChatMessage from '@/components/chat/windows95/messages/Message.vue';
import RaidMessage from '@/components/chat/windows95/messages/Raid.vue';
import ResubMessage from '@/components/chat/windows95/messages/Resub.vue';
import SubGiftMessage from '@/components/chat/windows95/messages/SubGift.vue';
import SubscriptionMessage from '@/components/chat/windows95/messages/Subscription.vue';
import { useTwitchStore } from '@/stores/twitch.store';

const store = useTwitchStore();
const { messages } = storeToRefs(store);
</script>

<style lang="scss" scoped>
.chat-messages {
  border-bottom: 1px solid #fff;
  border-left: 1px solid #7f7f7f;
  border-right: 1px solid #fff;
  border-top: 1px solid #7f7f7f;
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
  overflow-anchor: auto;
  overflow: hidden;
  padding: 4px;
  position: relative;

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
}
</style>
