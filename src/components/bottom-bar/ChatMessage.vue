<template>
  <div class="chat-message">
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
  </div>
</template>

<script lang="ts" setup>
import { darkenHex, hexToRgb, parseMessage, parseUserBadges } from '@/common/helpers/twitch-message.helper';
import type { TMessage } from '@/common/types/index.type';
import { computed, nextTick, onMounted, ref } from 'vue';

const TOASTEREI_BASE_URL = import.meta.env.VITE_DIE_TOASTEREI_BASE_URL;

const props = defineProps<TMessage>();

const isGigantifiedEmoteMessage = props.msgId?.value === 'gigantified-emote-message';
const messageParts = ref<Record<string, string | undefined>[]>([]);
const userBadges = ref<{ description: string; id: string; imageUrl: string; title: string }[]>([]);
const userImage = ref<string>('');

const scrollDistance = ref<number>(0);
const shouldMarquee = ref<boolean>(false);
const textElement = ref<HTMLSpanElement | null>(null);
const textWrapper = ref<HTMLDivElement | null>(null);

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
});
</script>

<style lang="scss" scoped>
.chat-message {
  background-color: v-bind(messageBackgroundColor);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border: 1px solid v-bind(messageBorderColor);
  border-bottom: none;
  flex-shrink: 0;
  max-width: 656px;
  padding-top: 4px;
  position: relative;

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
    overflow: hidden;
  }

  &__text {
    color: #fff;
    display: inline-block;
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    font-weight: 600;
    line-height: 16px;

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
