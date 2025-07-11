<template>
  <li class="raid">
    <header class="raid__header">
      <span class="raid__name">{{ userName }}</span> raidet uns mit {{ viewerCount }} Zusehern!
    </header>
    <main>
      Vielen Dank, wie war dein Stream?
      <img
        :alt="LOVE_EMOTE?.name"
        class="raid__emote"
        :src="LOVE_EMOTE?.url" />
    </main>
  </li>
</template>

<script lang="ts" setup>
import type { IRaid } from '@/common/interfaces/index.interface';
import { EMOTES } from '@/common/constants/emotes.constant';

defineProps<IRaid>();

const LOVE_EMOTE = EMOTES.find(emote => emote.name === 'bamboe1Love');
</script>

<style lang="scss" scoped>
@import '@/assets/windows95.variables';

.raid {
  line-height: 1;
  padding: 0 calc(2px + #{$highlight-element-size}) 7px 0;
  position: relative;
  text-align: left;
  width: 100%;

  &:not(:last-of-type) {
    border-bottom: 1px solid #868a8e;
    box-shadow: 0 1px 0 #fff;
  }

  &::before {
    background-color: #9ab800;
    bottom: 0;
    content: '';
    position: absolute;
    right: 0;
    top: -9px;
    width: $highlight-element-size;
  }

  &__emote {
    max-height: $emote-size;
    max-width: $emote-size;
  }

  &__name {
    text-decoration: underline;
  }
}
</style>
