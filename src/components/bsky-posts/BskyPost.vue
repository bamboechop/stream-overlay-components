<template>
  <div class="bsky-post">
    <div class="bsky-post__text">
      {{ post.text }}
    </div>

    <template v-if="post.type === 'image'">
      <slot
        name="carousel"
        :images="post.images"></slot>
    </template>

    <template v-else-if="post.type === 'external'">
      <div
        class="bsky-post__external"
        :class="{ 'bsky-post__external--has-thumb': post.external.thumb }">
        <img
          v-if="post.external.thumb"
          :src="post.external.thumb"
          class="bsky-post__external-thumb"
          :alt="post.external.title" />
        <div class="bsky-post__external-content">
          <div class="bsky-post__external-title">
            {{ post.external.title }}
          </div>
          <template v-if="post.external.description">
            <div class="bsky-post__external-description">
              {{ post.external.description }}
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { BlueskyPost } from '@/composables/bluesky.composable';

defineProps<{ post: BlueskyPost }>();
</script>

<style lang="scss" scoped>
.bsky-post {
  background: #fff;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: flex;
  flex-direction: column;

  &__external {
    position: relative;
  }

  &__external--has-thumb {
    .bsky-post__external-content {
      position: absolute;
    }
  }

  &__external-content {
    background-color: rgba(0, 0, 0, 0.5);
    bottom: 0;
    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 4px;
    left: 0;
    padding: 12px;
    right: 0;
  }

  &__external-description {
    font-size: 14px;
  }

  &__external-thumb {
    object-fit: cover;
    width: 100%;
    aspect-ratio: 16 / 9;
  }

  &__external-title {
    font-size: 16px;
    font-weight: 600;
  }

  &__text {
    font-size: 16px;
    padding: 8px;
    white-space: pre-line;
  }
}
</style>
