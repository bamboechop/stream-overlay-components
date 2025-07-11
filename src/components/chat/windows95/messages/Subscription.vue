<template>
  <li class="subscription">
    <span class="subscription__name">{{ displayName }}</span>
    <template v-if="userName && displayName?.toLowerCase() !== userName.toLowerCase()">
      ({{ userName }})
    </template>
    hat soeben ein Stufe {{ plan }} Abonnement abgeschlossen! Dankeschön!
    <img
      :alt="LOVE_EMOTE?.name"
      class="subscription__emote"
      :src="LOVE_EMOTE?.url" />
  </li>
</template>

<script lang="ts" setup>
import type { ISubscription } from '@/common/interfaces/index.interface';
import { EMOTES } from '@/common/constants/emotes.constant';

defineProps<ISubscription>();

const LOVE_EMOTE = EMOTES.find(emote => emote.name === 'bamboe1Love');
</script>

<style lang="scss" scoped>
@import '@/assets/windows95.variables';

.subscription {
  color: #000;
  padding-right: calc(2px + #{$highlight-element-size});
  position: relative;
  text-align: left;
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
