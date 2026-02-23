<template>
  <section
    class="cities-skylines-ii-chat-view"
    :class="{ 'cities-skylines-ii-chat-view--show': showChat }">
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
useTwitchStreamInfoComposable(true);

const showChat = ref(messageDebug);

onMounted(async () => {
  await initTwitch();
  await initChat();
});
</script>

<style lang="scss" scoped>
.cities-skylines-ii-chat-view {
  height: 100vh;
  margin: 0 auto;
  opacity: 0;
  text-align: center;
  transition: opacity 0.5s ease-out;
  width: 100vw;
}

.cities-skylines-ii-chat-view--show {
  opacity: 1;
}

:global(html) {
  --background-color: transparent;
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}

:global(html .cities-skylines-ii-chat-view) {
  max-width: 565px;
}
</style>
