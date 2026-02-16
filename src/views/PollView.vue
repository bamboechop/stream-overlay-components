<template>
  <section class="poll-view">
    <PollWindow />
  </section>
</template>

<script setup lang="ts">
import PollWindow from '@/components/poll/modern/PollWindow.vue';
</script>

<style scoped lang="scss">
  .poll-view {
    height: 100%;
  }
</style>
