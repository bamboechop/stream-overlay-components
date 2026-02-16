<template>
  <section
    class="chat-view"
    :class="{ 'chat-view--show': showChat }">
    <template v-if="theme === 'cities-skylines-ii'">
      <CitiesSkylinesIITheme :loading="loading" />
    </template>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import CitiesSkylinesIITheme from '@/components/chat/cities-skylines-ii/ChatMessages.vue';
import { useTwitchChat } from '@/composables/twitch-chat.composable';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import { useTwitchStore } from '@/stores/twitch.store';
import { useApplicationStore } from '@/stores/application.store';
import { BOT_ACCOUNT_USERNAMES } from '@/common/constants/bot-accounts.constant';
import { useEventStreamComposable } from '@/composables/event-stream.composable';
import { useTwitchStreamInfoComposable } from '@/composables/twitch-stream-info.composable';

const { chatVisibleTimeoutInSeconds, messageDebug, theme } = useSearchParamsComposable();

const { initChat, initTwitch, loading } = useTwitchChat(theme.value);

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);
const { setApplicationActive } = applicationStore;

useEventStreamComposable();
useTwitchStreamInfoComposable();

const store = useTwitchStore();
const { messages } = storeToRefs(store);

const active = computed(() => activeApplications.value.find(application => application.id === 'chat')?.active ?? false);
const hideTimeout = ref<number | null>(null);
const showChat = ref(messageDebug);

onMounted(async () => {
  await initTwitch();
  await initChat();

  // Set initial active state based on messageDebug
  if (messageDebug) {
    setApplicationActive('chat', true);
  }
});

function resetHideTimeout() {
  if (hideTimeout.value) {
    clearTimeout(hideTimeout.value);
  }
  hideTimeout.value = window.setTimeout(() => {
    showChat.value = false;
    hideTimeout.value = null;
    setApplicationActive('chat', false);
  }, chatVisibleTimeoutInSeconds * 1000);
}

if (theme.value === 'modern') {
  watch(() => messages.value.length, (newValue) => {
    if (newValue > 0) {
      const newestMessage = messages.value.at(-1);
      if (newestMessage && 'userName' in newestMessage) {
        const userName = newestMessage.userName;
        if (userName && !BOT_ACCOUNT_USERNAMES.includes(userName)) {
          showChat.value = true;
          setApplicationActive('chat', true);
          if (!messageDebug) {
            resetHideTimeout();
          }
        }
      }
    }
  });
}
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
