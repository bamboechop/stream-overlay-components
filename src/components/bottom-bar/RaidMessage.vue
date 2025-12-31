<template>
  <li
    ref="messageElement"
    class="raid-message"
    :style="{ transform: transformStyle }">
    <img
      alt=""
      class="raid-message__avatar"
      src="/toastys/raid-bot.png"
      />
      <div class="raid-message__content">
        💨🎐 Ein frischer Wind trägt <strong>{{ viewerCount > 1 ? `${viewerCount} Gäste` : 'einen Gast' }}</strong> in den Garten.
        <br />
        Willkommen, und danke für den Raid, <strong class="raid-message__name">{{ userName }}</strong>.
        <br />
        Wie war eure Reise?
        <img
          :alt="LOVE_EMOTE?.name"
          class="raid-message__emote"
          :src="LOVE_EMOTE?.url" />
      </div>
  </li>
</template>

<script lang="ts" setup>
import type { TRaidMessage } from '@/common/types/index.type';
import { computed, onMounted, ref } from 'vue';
import { EMOTES } from '@/common/constants/emotes.constant';

const props = defineProps<TRaidMessage & { messageIndex?: number; messageOffset?: number }>();

const mounted = ref(false);

const LOVE_EMOTE = EMOTES.find(emote => emote.name === 'bamboe1Love');

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
.raid-message {
  background-color: rgba(255, 54, 155, 0.075);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border: 1px solid #ff369b;
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
    color: #ff369b;
    font-weight: 700;
  }
}
</style>
