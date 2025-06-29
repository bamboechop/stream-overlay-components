<template>
  <template v-if="posts.length > 0">
    <WindowFrame
      :active
      class="bsky-posts-window"
      :class="{ 'bsky-posts-window--collapsed': isCollapsed }">
      <div
        class="bsky-posts-window__content">
        <div
          :key="currentIndex"
          class="bsky-posts-window__post">
          <BskyPost :post="currentPost">
            <template #carousel="{ images }">
              <ImageCarousel :images="images" />
            </template>
          </BskyPost>
        </div>
      </div>
      <div
        v-if="authorHandle"
        class="bsky-posts-window__follow-cta">
        Folge @{{ authorHandle }} auf Bluesky
      </div>
    </WindowFrame>
  </template>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import BskyPost from './BskyPost.vue';
import ImageCarousel from './ImageCarousel.vue';
import WindowFrame from '@/components/desktop/WindowFrame.vue';
import { type BlueskyPost, fetchLatestPosts, filterPosts } from '@/composables/bluesky.composable';

defineProps<{ active?: boolean }>();

const posts = ref<BlueskyPost[]>([]);
const currentIndex = ref(0);
let cycleTimer: number | null = null;
const isCollapsed = ref(true);
const TRANSITION_DURATION = 500; // ms, should match CSS - TODO ask AI if we can use v-bind in CSS

const currentPost = computed(() => posts.value[currentIndex.value]);
const authorHandle = computed(() => {
  if (posts.value.length > 0 && posts.value[0].author) {
    return posts.value[0].author;
  }
  return import.meta.env.VITE_BSKY_TARGET_HANDLE || '';
});

async function loadPosts() {
  const handle = import.meta.env.VITE_BSKY_TARGET_HANDLE;
  if (!handle) {
    posts.value = [];
    return;
  }
  const fetchedPosts = await fetchLatestPosts(handle, 10);
  posts.value = filterPosts(fetchedPosts, 'Der Garten kommt zur Ruhe.');
  currentIndex.value = 0;
}

function startCycling() {
  if (cycleTimer) {
    clearInterval(cycleTimer);
  }
  if (posts.value.length <= 1) {
    return;
  }
  cycleTimer = window.setInterval(() => {
    isCollapsed.value = true;
    setTimeout(() => {
      currentIndex.value = (currentIndex.value + 1) % posts.value.length;
      setTimeout(() => {
        isCollapsed.value = false;
      }, 1500);
    }, TRANSITION_DURATION);
  }, 30 * 1000);
}

function stopCycling() {
  if (cycleTimer) {
    clearInterval(cycleTimer);
    cycleTimer = null;
  }
}

onMounted(async () => {
  await loadPosts();
  startCycling();
  setTimeout(() => {
    isCollapsed.value = false;
  }, 1500);
});

watch(posts, () => {
  stopCycling();
  startCycling();
});
</script>

<style scoped lang="scss">
.bsky-posts-window {
  width: 100%;

  &__content {
    display: grid;
    grid-template-rows: 1fr;
    transition: grid-template-rows .3s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden;
    min-width: 0;
  }

  &__post {
    overflow: hidden;
  }

  &__follow-cta {
    background: #1877f2;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.02em;
    margin-top: -4px;
    padding: 12px;
    transition: border-top-left-radius .3s cubic-bezier(0.4,0,0.2,1), border-top-right-radius .3s cubic-bezier(0.4,0,0.2,1), margin-top .3s cubic-bezier(0.4,0,0.2,1);
  }
}

.bsky-posts-window--collapsed {
  .bsky-posts-window__content {
    grid-template-rows: 0fr;
  }

  .bsky-posts-window__follow-cta {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    margin-top: -4px;
  }
}
</style>
