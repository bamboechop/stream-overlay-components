<template>
  <div class="main-area">
    <TabletShell />
    <ChatPhone />
  </div>
</template>

<script lang="ts" setup>
import TabletShell from '@/components/coworking/TabletShell.vue';
import ChatPhone from '@/components/chat/coworking/ChatPhone.vue';
</script>

<style lang="scss" scoped>
.main-area {
  position: relative;
}
</style>
