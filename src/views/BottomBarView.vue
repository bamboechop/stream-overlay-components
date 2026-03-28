<template>
  <div class="flex mt-[38px] max-h-[68px] w-full max-w-dvw">
    <TaskBarModernTheme class="bg-white/75 border-transparent shrink-0 z-1" />
    <ChatBottomBarTheme class="flex flex-row-reverse grow shrink min-w-0" />
    <Clock class="bg-white/75 border-transparent shrink-0 z-1" />
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
useTwitchStreamInfoComposable(true);

onMounted(async () => {
  await initTwitch();
  await initChat();
});
</script>
