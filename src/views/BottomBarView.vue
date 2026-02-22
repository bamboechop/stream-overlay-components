<template>
  <div class="bottom-bar-view">
    <TaskBarModernTheme class="bottom-bar-view__task-bar" />
    <ChatBottomBarTheme class="bottom-bar-view__chat" />
    <Clock class="bottom-bar-view__clock" />
  </div>
</template>

<script lang="ts" setup>
import TaskBarModernTheme from '@/components/task-bar/TaskBar.vue';
import Clock from '@/components/clock/Clock.vue';
import ChatBottomBarTheme from '@/components/bottom-bar/Chat.vue';
import { useTwitchChat } from '@/composables/twitch-chat.composable';
import { useEventStreamComposable } from '@/composables/event-stream.composable';
import { useTwitchStreamInfoComposable } from '@/composables/twitch-stream-info.composable';
import { onMounted } from 'vue';

const { initChat, initTwitch } = useTwitchChat();

useEventStreamComposable();
useTwitchStreamInfoComposable();

onMounted(async () => {
  await initTwitch();
  await initChat();
});
</script>

<style lang="scss" scoped>
.bottom-bar-view {
  display: flex;
  margin-top: 38px; // to accomodate gigantified emotes
  max-height: 68px;
  width: 100%;
  max-width: 100vw;

  &__chat {
    display: flex;
    flex-direction: row-reverse;
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 0;
  }

  &__clock,
  &__task-bar {
    background: #fff;
    flex-shrink: 0;
    z-index: 1;
  }
}
</style>
