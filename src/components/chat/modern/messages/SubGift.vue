<template>
  <li class="sub-gift">
    <div class="sub-gift__info">
      <span class="sub-gift__name">
        <strong :style="{ color: '#ff7512' }">{{ sender.displayName }}</strong>
        <template v-if="sender.displayName?.toLowerCase() !== sender.userName?.toLowerCase()">
          ({{ sender.userName }})
        </template>
        hat gerade
        <strong :style="{ color: '#ffdf12' }">{{ recipient.displayName }}</strong>
        <template v-if="recipient.displayName?.toLowerCase() !== recipient.userName?.toLowerCase()">
          ({{ recipient.userName }})
        </template>
        ein Stufe {{ plan }} Abonnement geschenkt! Vielen Dank!
        <img
          alt="bamboe1LOVE"
          class="sub-gift__emote"
          src="/bamboe1LOVE.png" />
      </span>
    </div>
  </li>
</template>

<script lang="ts" setup>
import type { ISubGift } from '@/common/interfaces/index.interface';

defineProps<ISubGift>();
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.sub-gift {
  background-color: rgba(255, 117, 18, 0.075);
  border: 2px solid #ff7512;
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
    align-items: end;
    display: flex;
    float: left;
    gap: 4px;
    text-align: left;
  }
}
</style>
