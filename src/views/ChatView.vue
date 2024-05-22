<template>
  <section class="chat-view">
    <template v-if="theme === 'cities-skylines-ii'">
      <CitiesSkylinesIITheme :loading="loading" />
    </template>
    <template v-if="theme === 'windows-95'">
      <Windows95Theme :active="active" />
    </template>
    <template v-if="theme === 'modern'">
      <ModernTheme :active="active" />
    </template>
  </section>
</template>

<script setup lang="ts">
import CitiesSkylinesIITheme from '@/components/chat/cities-skylines-ii/ChatMessages.vue';
import ModernTheme from '@/components/chat/modern/ChatWindow.vue';
import Windows95Theme from '@/components/chat/windows95/ChatWindow.vue';
import { useTwitchChat } from '@/composables/twitch-chat.composable';
import { useSearchParamsComposable } from '@/composables/theme.composable';

const { active, theme } = useSearchParamsComposable();

const { loading } = await useTwitchChat(theme.value);
</script>

<style lang="scss" scoped>
:global(html[data-theme="windows-95"]) {
  --background-color: #c3c3c3;
}

:global(html[data-theme="windows-95"]) {
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
  text-align: center;
  width: 100vw;
}

:global(html[data-theme="cities-skylines-ii"] .chat-view) {
  max-width: 565px;
}
</style>
