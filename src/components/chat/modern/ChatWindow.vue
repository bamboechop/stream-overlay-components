<template>
  <WindowFrame
    :active="active"
    class="chat-window-window"
    title="Chat">
    <div class="chat-window">
      <ChatMessages />
      <EnterMessage />
    </div>
  </WindowFrame>
</template>

<script lang="ts" setup>
import WindowFrame from '@/components/desktop/WindowFrame.vue';
import ChatMessages from '@/components/chat/modern/ChatMessages.vue';
import EnterMessage from '@/components/chat/modern/EnterMessage.vue';

defineProps<{ active?: boolean }>();
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.chat-window {
  background-color: rgba(14, 14, 16, 0.95);
  border-radius: $window-frame-border-radius - $window-frame-padding;
  color: #fff;
  display: grid;
  gap: 16px;
  grid-template-rows: 1fr auto;
  font-size: 16px;
  height: 100%;
  padding: 4px 8px 8px 8px;
}

.chat-window-window {
  height: 100%;
  width: 100%;
}
</style>
