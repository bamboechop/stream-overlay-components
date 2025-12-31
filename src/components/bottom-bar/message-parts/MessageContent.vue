<template>
  <div
    ref="textWrapper"
    class="message-content">
    <span
      ref="textElement"
      class="message-content__text"
      :class="{
        'message-content__text--marquee': shouldMarquee,
      }"
      :style="shouldMarquee ? { '--scroll-distance': `-${scrollDistance}px` } : {}">
      <template
        v-for="(part, index) of messageParts"
        :key="`message-${part.value}-part-${index}`">
        <template v-if="part.type === 'text'">
          {{ part.value }}
        </template>
        <template v-if="part.type === 'emote'">
          <img
            :alt="part.raw"
            class="message-content__emote"
            :class="{ 'message-content__emote--highlighted': msgId === 'highlighted-message' }"
            :src="part.value" />
        </template>
      </template>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, ref } from 'vue';
import { parseMessage } from '@/common/helpers/twitch-message.helper';

const props = defineProps<{
  emotes?: { [emoteid: string]: string[] };
  msgId?: 'highlighted-message';
  msgType: 'chat' | 'action';
  text: string;
  userId: string;
}>();

const textWrapper = ref<HTMLDivElement | null>(null);
const shouldMarquee = ref<boolean>(false);
const scrollDistance = ref<number>(0);
const textElement = ref<HTMLSpanElement | null>(null);
const messageParts = ref<Record<string, string | undefined>[]>([]);

const isGigantifiedEmoteMessage = props.msgType === 'chat' && 'msgId' in props && props.msgId === 'gigantified-emote-message';

onMounted(async () => {
  messageParts.value = parseMessage(props.emotes, props.text, 'dark', isGigantifiedEmoteMessage ? '3.0' : '2.0');

  await nextTick();
  if (textElement.value && textWrapper.value) {
    const contentHeight = textElement.value.scrollHeight;
    const visibleHeight = textWrapper.value.clientHeight;
    const hasOverflow = contentHeight > visibleHeight;
    shouldMarquee.value = hasOverflow;
    if (hasOverflow) {
      scrollDistance.value = contentHeight - visibleHeight;
    }
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.message-content {
  max-height: 46px;
  max-width: 600px; // 656px - 52px (avatar padding) - 4px (right padding)
  overflow: hidden;

  &__emote {
    max-height: 18px;
    max-width: 18px;
  }

  &__emote--highlighted {
    filter: invert(1);
  }

  &__text {
    color: #fff;
    display: block;
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    font-weight: 600;
    line-height: 16px;
    max-width: 100%;
    word-wrap: break-word;
  }

  &__text--marquee {
    animation: scroll-up 20s linear infinite;
    will-change: transform;
  }
}

@keyframes scroll-up {
  0% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(var(--scroll-distance, 0));
  }
  100% {
    transform: translateY(var(--scroll-distance, 0));
  }
}
</style>