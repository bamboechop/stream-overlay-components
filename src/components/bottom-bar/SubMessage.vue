<template>
  <li
    ref="messageElement"
    class="sub-message"
    :style="{ transform: transformStyle }">
    <img
      alt=""
      class="sub-message__avatar"
      src="/toastys/sub-bot.png"
      />
      <div class="sub-message__content">
        <strong class="sub-message__name">{{ displayName }}</strong>
        <template v-if="userName && displayName?.toLowerCase() !== userName.toLowerCase()">
          <span class="sub-message__username"> ({{ userName }})</span>
        </template>
        hat einen Kirschbaum gepflanzt und das Gleichgewicht gestärkt.
        <img
          :alt="COZY_EMOTE?.name"
          class="sub-message__emote"
          :src="COZY_EMOTE?.url" />
      </div>
  </li>
</template>

<script lang="ts" setup>
import { EMOTES } from '@/common/constants/emotes.constant';
import type { ISubscription } from '@/common/interfaces/index.interface';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<ISubscription & { messageIndex?: number; messageOffset?: number }>();

const COZY_EMOTE = EMOTES.find(emote => emote.name === 'bamboe1Cozy');

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
.sub-message {
  background-color: rgba(255, 223, 18, 0.075);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border: 1px solid #ffdf12;
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

  &__emote {
    max-height: 18px;
    max-width: 18px;
  }

  &__name {
    color: v-bind(color);
  }

  &__username {
    font-size: 12px;
  }
}
</style>
