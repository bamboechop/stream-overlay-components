<template>
  <li
    ref="messageElement"
    class="chat-message"
    :class="{ 'chat-message--mounted': mounted }"
    :style="{ transform: transformStyle }">
    <template v-if="msgType === 'chat'">
      <img
        :alt="displayName"
        class="chat-message__avatar"
        :src="userImage"
        />
        <div class="chat-message__content">
          <header class="chat-message__header">
            <span class="chat-message__timestamp">{{ humanReadableTimestamp }}</span>
            <template v-if="userBadges.length > 0">
              <template
                v-for="(badge, index) of userBadges"
                :key="`badge-${badge.description}-${index}`">
                <img
                  :alt="badge.description"
                  class="chat-message__badge"
                  :src="badge.imageUrl" />
              </template>
            </template>
            <span class="chat-message__name">
              {{ displayName }}
              <template v-if="userName && displayName?.toLowerCase() !== userName.toLowerCase()">
                ({{ userName }})
              </template>
            </span>
          </header>
          <div
            ref="textWrapper"
            class="chat-message__text-wrapper">
            <span
              ref="textElement"
              class="chat-message__text"
              :class="{ 'chat-message__text--marquee': shouldMarquee }"
              :style="shouldMarquee ? { '--scroll-distance': `-${scrollDistance}px` } : {}">
              <template
                v-for="(part, index) of messageParts"
                :key="`message-${part.value}-part-${index}`">
                <template v-if="part.type === 'text'">
                  {{ part.value }}
                </template>
              </template>
            <!--<template
              v-for="(part, index) of messageParts"
              :key="`message-${part.value}-part-${index}`">
              <template v-if="part.type === 'text'">
                {{ part.value }}
              </template>
            </template>
            <template v-if="part.type === 'emote'">
              <template v-if="messageParts.length > 1 && index === messageParts.length - 1 && isGigantifiedEmoteMessage">
                <br />
              </template>
              <img
                :alt="part.raw"
                class="chat-message__emote"
                :class="{ 'message__emote--gigantified': index === messageParts.length - 1 && isGigantifiedEmoteMessage }"
                :src="part.value" />
            </template>-->
            </span>
          </div>
        </div>
    </template>
  </li>
</template>

<script lang="ts" setup>
import { darkenHex, hexToRgb, parseMessage, parseUserBadges } from '@/common/helpers/twitch-message.helper';
import type { TMessage } from '@/common/types/index.type';
import { computed, nextTick, onMounted, ref } from 'vue';

const TOASTEREI_BASE_URL = import.meta.env.VITE_DIE_TOASTEREI_BASE_URL;

const props = defineProps<TMessage & { messageIndex?: number; messageOffset?: number }>();

const isGigantifiedEmoteMessage = props.msgType === 'chat' && 'msgId' in props && props.msgId === 'gigantified-emote-message';
const messageParts = ref<Record<string, string | undefined>[]>([]);
const userBadges = ref<{ description: string; id: string; imageUrl: string; title: string }[]>([]);
const userImage = ref<string>('');

const scrollDistance = ref<number>(0);
const shouldMarquee = ref<boolean>(false);
const textElement = ref<HTMLSpanElement | null>(null);
const textWrapper = ref<HTMLDivElement | null>(null);
const mounted = ref(false);

const messageBackgroundColor = computed(() => {
  if (props.msgType === 'chat' && props.color) {
    const rgb = hexToRgb(props.color);
    if (rgb) {
      return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.3)`;
    }
  }
});

const messageBorderColor = computed(() => {
  if (props.msgType === 'chat' && props.color) {
    const rgb = hexToRgb(props.color);
    if (rgb) {
      return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.45)`;
    }
  }
});

const nameColor = computed(() => {
  if (props.msgType === 'chat' && props.color) {
    return props.color;
  }
});

const timestampBackgroundColor = computed(() => {
  if (props.msgType === 'chat' && props.color) {
    return darkenHex(props.color);
  }
});

const strokeColor = computed(() => {
  if (props.msgType === 'chat' && props.color) {
    return darkenHex(props.color);
  }
});

const humanReadableTimestamp = computed(() => {
  return new Date(props.timestamp ?? Date.now()).toLocaleTimeString('de', {
    hour: '2-digit',
    minute: '2-digit',
  });
});

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
  if (props.msgType === 'chat') {
    userImage.value = `${TOASTEREI_BASE_URL}/avatars/${props.userId}.png`;

    messageParts.value = parseMessage(props.emotes, props.text, 'dark', isGigantifiedEmoteMessage ? '3.0' : '2.0');
    if (props.userBadges) {
      userBadges.value = parseUserBadges(props.userBadges, props.availableBadges);
    }

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
  }
  
  await nextTick();
  mounted.value = true;
});
</script>

<style lang="scss" scoped>
.chat-message {
  background-color: v-bind(messageBackgroundColor);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border: 1px solid v-bind(messageBorderColor);
  border-bottom: none;
  bottom: 0;
  max-width: 656px;
  min-width: fit-content;
  padding-top: 5px;
  position: absolute;
  right: 0;
  transition: transform 400ms ease;
  width: max-content;

  &__avatar {
    aspect-ratio: 1 / 1;
    bottom: 0;
    height: 64px;
    left: -16px;
    position: absolute;
    width: 64px;
  }

  &__badge {
    aspect-ratio: 1 / 1;
    height: 16px;
    width: 16px;
  }

  &__content {
    padding-left: 52px;
    padding-right: 4px;
    width: 100%;
  }

  &__header {
    align-items: center;
    column-gap: 2px;
    display: flex;
  }

  &__name {
    color: v-bind(nameColor);
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    paint-order: stroke fill;
    -webkit-text-stroke: 1px v-bind(strokeColor);
  }

  &__text-wrapper {
    max-height: 46px;
    max-width: 600px; // 656px - 52px (avatar padding) - 4px (right padding)
    overflow: hidden;
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

    &--marquee {
      animation: scroll-up 20s linear infinite;
      will-change: transform;
    }
  }

  &__timestamp {
    align-items: center;
    background-color: v-bind(timestampBackgroundColor);
    border-radius: 4px;
    color: #eee;
    display: flex;
    font-family: 'Geist Mono', monospace;
    font-size: 9px;
    font-weight: 600;
    height: 16px;
    justify-content: center;
    min-width: 32px;
    padding: 2px;
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
