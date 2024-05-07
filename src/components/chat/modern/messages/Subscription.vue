<template>
  <li class="subscription">
    <div class="subscription__info">
      <span class="subscription__name">
        <strong :style="{ color }">{{ displayName }}</strong>
        <template v-if="displayName?.toLowerCase() !== userName?.toLowerCase()">
          ({{ userName }})
        </template>
        hat soeben ein Stufe {{ plan }} Abonnement abgeschlossen! Dankeschön!
        <img
          alt="bamboe1LOVE"
          class="subscription__emote"
          src="/bamboe1LOVE.png" />
      </span>
    </div>
  </li>
</template>

<script lang="ts" setup>
import type { ISubscription } from '@/common/interfaces/index.interface';

defineProps<ISubscription>();
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.subscription {
  background-color: rgba(255, 223, 18, 0.075);
  border: 2px solid #ffdf12;
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
