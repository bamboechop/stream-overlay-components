<template>
  <section class="bsky-posts-view">
    <BskyPostsWindow :active />
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import BskyPostsWindow from '@/components/bsky-posts/modern/BskyPostsWindow.vue';
import { useApplicationStore } from '@/stores/application.store';

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
