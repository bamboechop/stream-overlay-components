<template>
  <section class="poll-view">
    <template v-if="theme === 'modern'">
      <ModernTheme />
    </template>
  </section>
</template>

<script setup lang="ts">
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import ModernTheme from '@/components/poll/modern/PollWindow.vue';

const { theme } = useSearchParamsComposable();
</script>

<style scoped lang="scss">
  .poll-view {
    height: 100%;
  }
</style>
