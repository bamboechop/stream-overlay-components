<template>
  <section
    class="chat-view"
    :class="{ 'chat-view--show': showChat }">
    <CitiesSkylinesIITheme :loading="loading" />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CitiesSkylinesIITheme from '@/components/chat/cities-skylines-ii/ChatMessages.vue';
import { useTwitchChat } from '@/composables/twitch-chat.composable';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import { useEventStreamComposable } from '@/composables/event-stream.composable';
import { useTwitchStreamInfoComposable } from '@/composables/twitch-stream-info.composable';

const { messageDebug } = useSearchParamsComposable();

const { initChat, initTwitch, loading } = useTwitchChat(true);

useEventStreamComposable();
useTwitchStreamInfoComposable();

const showChat = ref(messageDebug);

onMounted(async () => {
  await initTwitch();
  await initChat();
});
</script>

<style lang="scss" scoped>
:global(html[data-theme="windows-95"]) {
  --background-color: #c3c3c3;

  color: #000;
  font-family: 'Windows-95', Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  font-size: 12px;
  line-height: 1.1;
}

:global(html[data-theme="cities-skylines-ii"]),
:global(html[data-theme="modern"]) {
  --background-color: transparent;
}

.chat-view {
  height: 100vh;
  margin: 0 auto;
  opacity: 0;
  text-align: center;
  transition: opacity 0.5s ease-out;
  width: 100vw;
}

.chat-view--show {
  opacity: 1;
}

:global(html[data-theme="cities-skylines-ii"] .chat-view) {
  max-width: 565px;
}
</style>
