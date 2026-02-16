<template>
  <section class="scroll-emotes-view">
    <ScrollEmotes />
  </section>
</template>

<script setup lang="ts">
import ScrollEmotes from '@/components/scroll-emotes/ScrollEmotes.vue';
</script>

<style scoped lang="scss">
  .scroll-emotes-view {
    align-items: end;
    display: flex;
    height: 100%;
    justify-content: center;
  }
</style>
