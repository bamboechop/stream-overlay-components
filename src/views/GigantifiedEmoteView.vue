<template>
  <template v-if="theme === 'modern'">
    <ModernTheme />
  </template>
</template>

<script lang="ts" setup>
import ModernTheme from '@/components/gigantified-emote/modern/GigantifiedEmote.vue';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import { useTwitchChat } from '@/composables/twitch-chat.composable';

const { theme } = useSearchParamsComposable();

await useTwitchChat();
</script>
