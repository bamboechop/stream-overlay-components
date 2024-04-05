<template>
  <ChatMessages :loading="loading" />
</template>

<script lang="ts" setup>
import ChatMessages from '@/components/chat/cities-skylines-ii/ChatMessages.vue';

defineProps<{ loading: boolean }>();
</script>

<style lang="scss" scoped>
:global(body[data-theme="cities-skylines-ii"] .chat) {
  max-width: calc(480px + 62px + 10px + 13px); /* 480px chat message, 62px twitch button, 10px gap between message and button, 13px spacing to right edge */
}
</style>
