<template>
  <li
    class="sub-gift"
    :class="{ 'sub-gift--mounted': mounted }">
    <strong :style="{ color: '#ff7512' }">{{ sender.displayName }}</strong>
    <template v-if="sender.userName && sender.displayName?.toLowerCase() !== sender.userName.toLowerCase()">
      <span class="sub-gift__username"> ({{ sender.userName }})</span>
    </template>
    hat im Garten einen Platz für
    <strong :style="{ color: '#ffdf12' }">{{ recipient.displayName }}</strong>
    <template v-if="recipient.userName && recipient.displayName?.toLowerCase() !== recipient.userName.toLowerCase()">
      <span class="sub-gift__username"> ({{ recipient.userName }})</span>
    </template>
    vorbereitet. Vielen Dank.
  </li>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { ISubGift } from '@/common/interfaces/index.interface';

defineProps<ISubGift & { messageIndex?: number; messageOffset?: number }>();

const mounted = ref(false);

onMounted(() => {
  window.setTimeout(() => {
    mounted.value = true;
  }, 0);
});
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.sub-gift {
  background-color: rgba(255, 117, 18, 0.075);
  border: 2px solid #ff7512;
  border-radius: $window-frame-border-radius;
  bottom: 0;
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

  &__username {
    font-size: 12px;
  }
}

.sub-gift--mounted {
  transform: translateY(calc(v-bind(messageOffset) * -1px));
}
</style>
