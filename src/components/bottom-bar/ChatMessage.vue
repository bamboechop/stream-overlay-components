<template>
  <li
    ref="messageElement"
    class="chat-message"
    :class="{
      'chat-message--highlighted': msgId === 'highlighted-message',
      'chat-message--mounted': mounted,
    }"
    :style="{ transform: transformStyle }">
    <img
      alt=""
      class="chat-message__avatar"
      :class="{ 'chat-message__avatar--highlighted': msgId === 'highlighted-message' }"
      :src="userImage"
      :style="{ opacity: imageLoaded ? 1 : 0 }"
      @error="handleUserImageError"
    />
      <div
        class="chat-message__content"
        :class="{ 'chat-message__content--no-content': !$slots.content }">
        <slot name="header"></slot>
        <slot name="content"></slot>
      </div>
      <img
        v-if="messageParts.at(-1)?.type === 'emote' && isGigantifiedEmoteMessage"
        :alt="messageParts.at(-1)!.raw"
        class="chat-message__gigantified-emote"
        :src="messageParts.at(-1)!.value" />
  </li>
</template>

<script lang="ts" setup>
import { preloadImage } from '@/common/helpers/common.helper';
import { hexToRgb, parseMessage } from '@/common/helpers/twitch-message.helper';
import type { IAction, IChat } from '@/common/interfaces/index.interface';
import { computed, nextTick, onMounted, ref } from 'vue';

const TOASTEREI_BASE_URL = import.meta.env.VITE_DIE_TOASTEREI_BASE_URL;

const props = defineProps<(IAction | IChat) & { messageIndex?: number; messageOffset?: number }>();

const messageParts = ref<Record<string, string | undefined>[]>([]);
const mounted = ref(false);
const userImage = ref<string>('');
const imageLoaded = ref(false);

const defaultAvatarUrl = `${TOASTEREI_BASE_URL}/avatars/default.png`;

const isGigantifiedEmoteMessage = props.msgType === 'chat' && 'msgId' in props && props.msgId === 'gigantified-emote-message';

const isActionOrChatMessage = computed(() => ['action', 'chat'].includes(props.msgType));

const messageBackgroundColor = computed(() => {
  if (isActionOrChatMessage.value && props.color) {
    const rgb = hexToRgb(props.color);
    if (rgb) {
      return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.3)`;
    }
  }
});

const messageBorderColor = computed(() => {
  if (isActionOrChatMessage.value && props.color) {
    const rgb = hexToRgb(props.color);
    if (rgb) {
      return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.45)`;
    }
  }
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

function handleUserImageError() {
  // Safety net: if image fails to load in template (shouldn't happen after preload, but edge cases exist)
  userImage.value = defaultAvatarUrl;
  imageLoaded.value = true; // Show default image immediately on error
}

onMounted(async () => {
  // Parse message parts first (needed for gigantified emote check)
  if (props.msgType === 'chat') {
    messageParts.value = parseMessage(props.emotes, props.text, 'dark', isGigantifiedEmoteMessage ? '3.0' : '2.0');
  }

  // Build the user avatar URL
  const avatarUrl = `${TOASTEREI_BASE_URL}/avatars/${props.userId}.png?${Date.now()}`;

  // Set the image URL immediately (browser starts loading, but we keep it invisible until preload completes)
  userImage.value = avatarUrl;

  // Start preload in parallel (don't await) - animation will start immediately
  (async () => {
    try {
      await preloadImage(avatarUrl);
      // Image is ready, fade it in
      imageLoaded.value = true;
    } catch {
      // If avatar fails to load, fall back to default and preload it
      try {
        await preloadImage(defaultAvatarUrl);
        userImage.value = defaultAvatarUrl;
        imageLoaded.value = true;
      } catch {
        // If default also fails, set it anyway and show it
        userImage.value = defaultAvatarUrl;
        imageLoaded.value = true;
      }
    }
  })();

  // Preload gigantified emote if applicable (also in parallel)
  if (isGigantifiedEmoteMessage && messageParts.value.at(-1)?.type === 'emote') {
    const emoteUrl = messageParts.value.at(-1)!.value;
    if (emoteUrl) {
      preloadImage(emoteUrl).catch(() => {
        // Silently fail - emote will still try to load in the template
      });
    }
  }

  // Start animation immediately after nextTick (in sync with other messages)
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
    transition: opacity 200ms ease;
    width: 64px;
  }

  &__avatar--highlighted {
    filter: invert(1);
  }

  &__content {
    padding-left: 52px;
    padding-right: 4px;
    width: 100%;
  }

  &__content--no-content {
    padding-bottom: 5px;
  }

  &__gigantified-emote {
    left: 50%;
    max-height: 64px;
    max-width: 64px;
    position: absolute;
    top: -64px;
    transform: translateX(-50%);
  }
}

.chat-message--highlighted {
  filter: invert(1);
} 
</style>
