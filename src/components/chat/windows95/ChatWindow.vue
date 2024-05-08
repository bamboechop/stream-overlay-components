<template>
  <div class="chat-window">
    <ProgramTitleBar
      :active="active"
      icon-path="/programs/windows-95/chat.icon.png"
      title="Chat" />
    <ProgramButtonBar />
    <ChatMessages />
    <EnterMessage />
    <ProgramBottomBar show-viewers />
  </div>
</template>

<script lang="ts" setup>
import EnterMessage from './EnterMessage.vue';
import ChatMessages from './ChatMessages.vue';
import ProgramTitleBar from '@/components/general/windows95/ProgramTitleBar.vue';
import ProgramButtonBar from '@/components/general/windows95/ProgramButtonBar.vue';
import ProgramBottomBar from '@/components/general/windows95/ProgramBottomBar.vue';

defineProps<{ active?: boolean }>();
</script>

<style lang="scss" scoped>
.chat-window {
  border-bottom: 2px solid #000;
  border-left: 2px solid #efefef;
  border-right: 2px solid #000;
  border-top: 2px solid #efefef;
  display: grid;
  gap: 2px;
  grid-template-rows: 18px 18px 1fr 20px 20px;
  height: 100%;
  padding: 2px;

  * {
    font-family: 'Windows-95', Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  }
}
</style>
