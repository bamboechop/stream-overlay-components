<template>
  <section class="bsky-posts-view">
    <BskyPostsWindow :active />
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import BskyPostsWindow from '@/components/bsky-posts/BskyPostsWindow.vue';
import { useApplicationStore } from '@/stores/application.store';

const applicationStore = useApplicationStore();
const { activeProgramId } = storeToRefs(applicationStore);

const active = computed(() => activeProgramId.value === 'bsky-posts');
</script>

<style scoped lang="scss">
.bsky-posts-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}
</style>
