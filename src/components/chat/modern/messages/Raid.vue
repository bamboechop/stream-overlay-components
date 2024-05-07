<template>
  <li class="raid">
    <div class="raid__info">
      <span class="raid__name">{{ userName }}</span> raidet uns mit {{ viewerCount }} Zusehern!
    </div>
    <span class="raid__text">
      Vielen Dank, wie war dein Stream?
      <img
        alt="bamboe1LOVE"
        class="raid__emote"
        src="/bamboe1LOVE.png" />
    </span>
  </li>
</template>

<script lang="ts" setup>
import type { IRaid } from '@/common/interfaces/index.interface';

defineProps<IRaid>();
</script>

<style lang="scss" scoped>
@use 'sass:math';

@import '@/assets/modern.variables';

.raid {
  background-color: rgba(255, 54, 155, 0.075);
  border: 2px solid #ff369b;
  border-radius: $window-frame-border-radius;
  display: flex;
  flex-direction: column;
  padding: $window-frame-padding $window-frame-padding * 2;
  text-align: left;
  width: 100%;

  &__emote {
    max-height: $emote-size;
    max-width: $emote-size;
    vertical-align: middle;
  }

  &__info {
    display: flex;
    float: left;
    gap: 4px;
  }

  &__name {
    color: #ff369b;
    font-weight: 700;
  }
}
</style>
