<template>
  <div class="bottom-bar-view">
    <TaskBarModernTheme
      class="bottom-bar-view__task-bar"
      :programs="activeApplications" />
    <ChatBottomBarTheme class="bottom-bar-view__chat" />
    <ClockModernTheme class="bottom-bar-view__clock" />
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useApplicationStore } from '@/stores/application.store';
import TaskBarModernTheme from '@/components/task-bar/modern/TaskBar.vue';
import ClockModernTheme from '@/components/clock/modern/Clock.vue';
import ChatBottomBarTheme from '@/components/bottom-bar/Chat.vue';
import { useTwitchChat } from '@/composables/twitch-chat.composable';
import { useEventStreamComposable } from '@/composables/event-stream.composable';
import { useTwitchStreamInfoComposable } from '@/composables/twitch-stream-info.composable';
import { onMounted } from 'vue';

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

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
  max-height: 68px;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;

  background-color: black;
  margin-top: 200px;

  &__chat {
    display: flex;
    flex-direction: row-reverse;
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 0;
    overflow: hidden;
  }

  &__clock,
  &__task-bar {
    z-index: 1;
    flex-shrink: 0;
  }
}
</style>
