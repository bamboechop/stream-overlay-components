<template>
  <li
    ref="messageElement"
    class="message"
    :class="[
      { 'message--highlighted': msgId === 'highlighted-message' },
      { [`message--${animationId}`]: animationId },
      { 'message--mounted': mounted },
    ]">
    <template v-if="animationId">
      <div
        :class="[
          { [`message__${animationId}`]: animationId },
          animationId,
        ]">
        <template v-if="animationId === 'simmer'">
          <template
            v-for="(emote, index) of emotes"
            :key="`emote-${emote}-${index}`">
            <div
              class="simmer__emote-container"
              :style="{
                animationDelay: `${delays[index]}s`,
                animationDuration: `${durations[index]}s`,
                left: `${offsets[index]}%`,
              }">
              <img
                alt=""
                class="simmer__emote"
                :src="emote"
                :style="{
                  transform: `rotate(${rotations[index]}deg) scale(${sizes[index]})`,
                }" />
            </div>
          </template>
        </template>
        <template v-if="animationId === 'cosmic-abyss'">
          <video
            autoplay
            class="cosmic-abyss__video"
            loop
            muted
            playsinline
            preload="auto"
            src="/cosmic-abyss-tall.mp4"></video>
        </template>
      </div>
    </template>
    <div class="message__container">
      <div
        class="message__info"
        :class="{ 'message__info--has-emote': messageParts.find(part => part.type === 'emote') }">
        <template v-if="userBadges.length > 0">
          <template
            v-for="(badge, index) of userBadges"
            :key="`badge-${badge.description}-${index}`">
            <img
              :alt="badge.description"
              class="message__badge"
              :src="badge.imageUrl" />
          </template>
        </template>
        <span
          class="message__name"
          :style="{ color }">
          <strong>{{ displayName }}</strong>
          <template v-if="userName && displayName?.toLowerCase() !== userName.toLowerCase()">
            ({{ userName }})
          </template>
        </span>
        <template v-if="isOtherChannel && props.channelImage">
          <OtherChannelIndicator
            :channel="props.channel"
            :channel-image="props.channelImage"
            class="message__other-channel-indicator"
            :stream-together-channels="streamTogetherChannels" />
        </template>
      </div>
      <span class="message__text">
        <template
          v-for="(part, index) of messageParts"
          :key="`message-${part.value}-part-${index}`">
          <template v-if="part.type === 'text'">
            {{ part.value }}
          </template>
          <template v-if="part.type === 'emote'">
            <template v-if="messageParts.length > 1 && index === messageParts.length - 1 && isGigantifiedEmoteMessage">
              <br />
            </template>
            <img
              :alt="part.raw"
              class="message__emote"
              :class="{ 'message__emote--gigantified': index === messageParts.length - 1 && isGigantifiedEmoteMessage }"
              :src="part.value" />
          </template>
        </template>
      </span>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { computed, defineEmits, nextTick, onMounted, ref, toRefs } from 'vue';
import { storeToRefs } from 'pinia';
import OtherChannelIndicator from '../OtherChannelIndicator.vue';
import type { IChat } from '@/common/interfaces/index.interface';
import { parseMessage, parseUserBadges } from '@/common/helpers/twitch-message.helper';
import { broadcasterInfo } from '@/composables/twitch-chat.composable';
import { useTwitchStore } from '@/stores/twitch.store';
import { EMOTES } from '@/common/constants/emotes.constant';

const props = defineProps<IChat & { messageIndex?: number; messageOffset?: number }>();
const emits = defineEmits<{
  (e: 'imagesLoaded'): void;
}>();

const { animationId, msgId } = toRefs(props);

const twitchStore = useTwitchStore();
const { streamTogetherChannels } = storeToRefs(twitchStore);

const isOtherChannel = computed(() => props.channel !== broadcasterInfo.name && props.channelImage);

const isGigantifiedEmoteMessage = msgId.value === 'gigantified-emote-message';
const messageParts = ref<Record<string, string | undefined>[]>([]);
const userBadges = ref<{ description: string; id: string; imageUrl: string; title: string }[]>([]);

const emotes = EMOTES.map(emote => emote.url);

const durations = ref<number[]>(emotes.map(() => Number.parseFloat((Math.random() * 0.75 + 0.5).toFixed(2)))); // Random duration between 0.5 and 1.25 seconds
const delays = ref<number[]>(emotes.map(() => Number.parseFloat((Math.random() * 3).toFixed(2)))); // Random delay up to 3 seconds
const offsets = ref<number[]>(emotes.map(() => Number.parseFloat((Math.random() * 96).toFixed(2)))); // Random left offset between 0 and 96%
const rotations = ref<number[]>(emotes.map(() => Number.parseFloat((Math.random() * 20 - 10).toFixed(2)))); // Random rotation between -10 and 10 degrees
const sizes = ref<number[]>(emotes.map(() => Number.parseFloat((Math.random() * 0.75 + 0.25).toFixed(2)))); // Random size between 0.25 and 1.0

const mounted = ref(false);
const messageElement = ref<HTMLElement | null>(null);

onMounted(async () => {
  messageParts.value = parseMessage(props.emotes, props.text, 'dark', isGigantifiedEmoteMessage ? '3.0' : '2.0');
  if (props.userBadges) {
    userBadges.value = parseUserBadges(props.userBadges, props.availableBadges);
  }
  await nextTick();
  const images = Array.from((messageElement.value as HTMLElement).querySelectorAll<HTMLImageElement>('.message__emote'));
  if (images.length === 0) {
    mounted.value = true;
    emits('imagesLoaded');
    return;
  }
  let loaded = 0;
  images.forEach((img) => {
    if (img.complete) {
      loaded++;
      if (loaded === images.length) {
        mounted.value = true;
        emits('imagesLoaded');
      }
    } else {
      img.addEventListener('load', () => {
        loaded++;
        if (loaded === images.length) {
          mounted.value = true;
          emits('imagesLoaded');
        }
      });
    }
  });
});
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.message {
  bottom: 0;
  left: 0;
  overflow: hidden;
  position: absolute;
  right: 0;
  transform: translateY(100%);
  transition: transform 400ms ease;
  width: 100%;

  &__badge {
    height: $badge-size;
    width: $badge-size;
  }

  &__container {
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    position: relative;
    text-align: left;
    z-index: 1;
  }

  &__emote {
    max-height: $emote-size;
    max-width: $emote-size;
    vertical-align: middle;
  }

  &__emote--gigantified {
    max-height: $emote-size * 4;
    max-width: $emote-size * 4;
  }

  &__info {
    align-items: end;
    display: flex;
    float: left;
    gap: 4px;
    margin: -3px 4px 0 0;
  }

  &__info--has-emote {
    margin-top: -1px;
  }

  &__other-channel-indicator {
    margin: 3px 0 0 auto; // 3px to offset the negative margin of the message__info
  }
}

.message--mounted {
  transform: translateY(calc(v-bind(messageOffset) * -1px));
}

.message__rainbow-eclipse {
  border-radius: 12px;
  bottom: 6px;
  filter: blur(4px);
  left: 6px;
  overflow: hidden;
  position: absolute;
  right: 6px;
  top: 6px;

  &::before {
    animation: rotate 4s linear infinite;
    background-image: conic-gradient(#b23ff8, #3cc890, #38a7ca, #b23ff8);
    background-position: 0 0;
    background-repeat: no-repeat;
    content: '';
    height: 99999px;
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%) rotate(0deg);
    width: 99999px;
  }

  @keyframes rotate {
    to {
      transform: translate(-50%, -50%) rotate(1turn)
    }
  }
}

.cosmic-abyss {
  &__video {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
}

.simmer {
  background: linear-gradient(90deg, #3866dd, #ff4c5b);
  border-radius: 8px 8px 12px 12px;
  bottom: 0;
  left: 0;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 0;

  &__emote-container {
    animation-iteration-count: infinite;
    animation-name: jump;
    animation-timing-function: ease-in-out;
    bottom: 8px;
    position: absolute;
  }

  &__emote {
    bottom: 8px;
    max-height: $emote-size * 2;
    max-width: $emote-size * 2;
    position: absolute;

    @keyframes jump {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-30px); /* Adjust this value to control the height of the "jump" */
      }
      90% {
        transform: translateY(0);
      }
    }
  }
}

.message--highlighted {
  background-color: rgba(170, 204, 0, 0.05);
  border: 2px solid #aacc00;
  border-radius: $window-frame-border-radius;
  padding: $window-frame-padding $window-frame-padding * 2;
  width: 100%;
}

.message--cosmic-abyss {
  border-radius: 8px;
  padding: 18px 10px;

  .message__container {
    background-color: rgba(14, 14, 16, 0.95);
    padding: 10px;
  }
}

.message--rainbow-eclipse {
  padding: 12px;

  .message__container {
    background-color: rgba(14, 14, 16, 0.95);
    padding: 10px;
  }
}

.message--simmer {
  padding: 30px 4px 4px 4px;

  .message__container {
    background-color: rgb(14, 14, 16);
    padding: 10px;
  }
}
</style>
