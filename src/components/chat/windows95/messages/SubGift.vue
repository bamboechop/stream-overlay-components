<template>
  <li class="sub-gift">
    <span class="sub-gift__name">{{ sender.displayName }}</span>
    <template v-if="sender.userName && sender.displayName?.toLowerCase() !== sender.userName.toLowerCase()">
      ({{ sender.userName }})
    </template>
    hat gerade
    <span class="sub-gift__name">{{ recipient.displayName }}</span>
    <template v-if="recipient.userName && recipient.displayName?.toLowerCase() !== recipient.userName.toLowerCase()">
      ({{ recipient.userName }})
    </template>
    ein Stufe {{ plan }} Abonnement geschenkt! Vielen Dank!
    <img
      alt="bamboe1Love"
      class="sub-gift__emote"
      src="/emotes/bamboe1Love.png" />
  </li>
</template>

<script lang="ts" setup>
import type { ISubGift } from '@/common/interfaces/index.interface';

defineProps<ISubGift>();
</script>

<style lang="scss" scoped>
@import '@/assets/windows95.variables';

.sub-gift {
  color: #000;
  text-align: left;
  padding-right: calc(2px + #{$highlight-element-size});
  position: relative;
  width: 100%;

  &::before {
    background-color: #ffac12;
    bottom: 0;
    content: '';
    position: absolute;
    right: 0;
    top: -9px;
    width: $highlight-element-size;
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid #868a8e;
    box-shadow: 0 1px 0 #fff;
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
