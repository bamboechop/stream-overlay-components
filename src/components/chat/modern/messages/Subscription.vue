<template>
  <li
    class="subscription"
    :class="{ 'subscription--mounted': mounted }">
    <div class="subscription__info">
      <span class="subscription__name">
        <strong :style="{ color }">{{ displayName }}</strong>
        <template v-if="userName && displayName?.toLowerCase() !== userName.toLowerCase()">
          ({{ userName }})
        </template>
        hat soeben ein Stufe {{ plan }} Abonnement abgeschlossen! Dankeschön!
        <img
          :alt="LOVE_EMOTE?.name"
          class="subscription__emote"
          :src="LOVE_EMOTE?.url" />
      </span>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { ISubscription } from '@/common/interfaces/index.interface';
import { EMOTES } from '@/common/constants/emotes.constant';

defineProps<ISubscription & { messageIndex?: number; messageOffset?: number }>();

const mounted = ref(false);

const LOVE_EMOTE = EMOTES.find(emote => emote.name === 'bamboe1Love');

onMounted(() => {
  window.setTimeout(() => {
    mounted.value = true;
  }, 0);
});
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.subscription {
  background-color: rgba(255, 223, 18, 0.075);
  border: 2px solid #ffdf12;
  border-radius: $window-frame-border-radius;
  bottom: 0;
  display: flex;
  flex-direction: column;
  left: 0;
  padding: $window-frame-padding $window-frame-padding * 2;
  position: absolute;
  right: 0;
  text-align: left;
  transform: translateY(100%);
  transition: transform 400ms ease;
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

.subscription--mounted {
  transform: translateY(calc(v-bind(messageOffset) * -1px));
}
</style>
