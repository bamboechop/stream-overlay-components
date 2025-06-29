<template>
  <section class="bsky-posts-view">
    <template v-if="theme === 'modern'">
      <ModernTheme :active />
    </template>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import ModernTheme from '@/components/bsky-posts/modern/BskyPostsWindow.vue';
import { useApplicationStore } from '@/stores/application.store';

const { theme } = useSearchParamsComposable();

const applicationStore = useApplicationStore();
const { activeApplications } = storeToRefs(applicationStore);

const active = computed(() => activeApplications.value.find(application => application.id === 'bsky-posts')?.active);
</script>

<style scoped lang="scss">
.bsky-posts-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}
</style>
