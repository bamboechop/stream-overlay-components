<template>
  <section class="scroll-emotes-view">
    <template v-if="theme === 'modern'">
      <ModernTheme />
    </template>
  </section>
</template>

<script setup lang="ts">
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import ModernTheme from '@/components/scroll-emotes/modern/ScrollEmotes.vue';

const { theme } = useSearchParamsComposable();
</script>

<style scoped lang="scss">
  .scroll-emotes-view {
    align-items: end;
    display: flex;
    height: 100%;
    justify-content: center;
  }
</style>
