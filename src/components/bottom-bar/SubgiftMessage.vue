<template>
  <li
    ref="messageElement"
    class="subgift-message"
    :style="{ transform: transformStyle }">
    <img
      alt=""
      class="subgift-message__avatar"
      src="/toastys/subgift-bot.png"
      />
      <div class="subgift-message__content">
        <strong :style="{ color: '#ff7512' }">{{ sender.displayName }}</strong>
        <template v-if="sender.userName && sender.displayName?.toLowerCase() !== sender.userName.toLowerCase()">
          <span class="sub-gift__username"> ({{ sender.userName }})</span>
        </template>
        hat im Garten einen Platz für
        <strong :style="{ color: '#ffdf12' }">{{ recipient.displayName }}</strong>
        <template v-if="recipient.userName && recipient.displayName?.toLowerCase() !== recipient.userName.toLowerCase()">
          <span class="sub-gift__username"> ({{ recipient.userName }})</span>
        </template>
        vorbereitet.
        <br />
        Vielen Dank.
      </div>
  </li>
</template>

<script lang="ts" setup>
import type { ISubGift } from '@/common/interfaces/index.interface';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<ISubGift & { messageIndex?: number; messageOffset?: number }>();

const mounted = ref(false);

const transformStyle = computed(() => {
  if (!mounted.value) {
    // Before mounting, slide in from the right
    return 'translateX(100%)';
  }
  // After mounting, use the offset to position the message
  // The offset is calculated from the right edge, so we move left by that amount
  const offset = props.messageOffset ?? 0;
  return `translateX(-${offset}px)`;
});

onMounted(async () => {
  window.setTimeout(() => {
    mounted.value = true;
  }, 0);
});
</script>

<style lang="scss" scoped>
.subgift-message {
  background-color: rgba(255, 117, 18, 0.075);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border: 1px solid #ff7512;
  border-bottom: none;
  bottom: 0;
  color: #fff;
  font-family: 'Geist Mono', monospace;
  font-weight: 600;
  max-width: 656px;
  min-width: fit-content;
  padding-top: 5px;
  position: absolute;
  right: 0;
  transition: transform 400ms ease;
  width: max-content;

  &::after {
    background: rgba(17,17,17,.7);
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    bottom: 0;
    content: '';
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
  }

  &__avatar {
    aspect-ratio: 1 / 1;
    bottom: 0;
    height: 64px;
    left: -16px;
    position: absolute;
    width: 64px;
  }

  &__content {
    padding-left: 52px;
    padding-right: 4px;
    width: 100%;
  }
}
</style>
