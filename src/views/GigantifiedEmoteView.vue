<template>
  <GigantifiedEmote />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import GigantifiedEmote from '@/components/gigantified-emote/GigantifiedEmote.vue';
import { useTwitchChat } from '@/composables/twitch-chat.composable';

const { initChat, initTwitch } = useTwitchChat();

onMounted(async () => {
  await initTwitch();
  await initChat();
});
</script>
