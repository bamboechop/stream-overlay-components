<template>
  <li
    class="message"
    :class="[
      { 'message--highlighted': msgId === 'highlighted-message' },
      { 'message--rainbow-eclipse': animationId === 'rainbow-eclipse' },
    ]">
    <template v-if="animationId === 'rainbow-eclipse'">
      <div class="message__rainbow-eclipse"></div>
    </template>
    <div class="message__container">
      <div class="message__images">
        <img
          :alt="displayName"
          class="message__avatar"
          :src="userImage" />
        <template
          v-for="(badge, index) of userBadges"
          :key="`badge-${badge.description}-${index}`">
          <img
            :alt="badge.description"
            class="message__badge"
            :src="badge.imageUrl" />
        </template>
      </div>
      <div class="message__content-grid">
        <header class="message__header">
          <span class="message__name">
            {{ displayName }}
            <template v-if="displayName?.toLowerCase() !== userName?.toLowerCase()">
              <span class="message__name message__name--readable">({{ userName }})</span>
            </template>
          </span>
          <span class="message__timestamp">{{ humanReadableTimestamp }}</span>
        </header>
        <main class="message__text">
          <template
            v-for="(part, index) of messageParts"
            :key="`message-${part.value}-part-${index}`">
            <template v-if="part.type === 'text'">
              <span>{{ part.value }}</span>
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
        </main>
        <MessageInteraction :viewer-count="viewerCount" />
      </div>
    </div>
    <audio
      ref="audioPlayer"
      src="/chirper.mp3"
      style="display: none"></audio>
  </li>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRefs } from 'vue';
import type { IMessage } from '@/common/interfaces/index.interface';
import { parseMessage, parseUserBadges } from '@/common/helpers/twitch-message.helper';
import MessageInteraction from '@/components/chat/cities-skylines-ii/MessageInteraction.vue';

const props = defineProps<IMessage>();
const { animationId, msgId } = toRefs(props);

const audioPlayer = ref<HTMLAudioElement>();
const humanReadableTimestamp = ref('');
const isGigantifiedEmoteMessage = msgId.value === 'gigantified-emote-message';
const messageParts = ref<Record<string, any>[]>([]);
const userBadges = ref<{ description: string; id: string; imageUrl: string; title: string }[]>([]);

onMounted(() => {
  messageParts.value = parseMessage(props.emotes, props.text, 'dark', isGigantifiedEmoteMessage ? '3.0' : '2.0');

  if (props.userBadges) {
    userBadges.value = parseUserBadges(props.userBadges, props.availableBadges);
  }

  const parsedTimestamp = new Date(props.timestamp ?? Date.now());
  const hours = parsedTimestamp.getHours();
  const minutes = parsedTimestamp.getMinutes();
  humanReadableTimestamp.value = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;

  audioPlayer.value?.play();
});
</script>

<style lang="scss" scoped>
@import '@/assets/cities-skylines-ii.variables';

.message {
  background-color: $background-color;
  border-radius: 5px;
  position: relative;
  width: calc(450px - 14px - 14px); // desired width minus 2*padding

  &:last-of-type::after {
    border-bottom: $triangle-short-side solid transparent;
    border-left: $triangle-long-size solid $background-color;
    border-top: $triangle-short-side solid transparent;
    bottom: calc($twitch-button-offset + calc(#{$triangle-short-side} / 2));
    content: '';
    position: absolute;
    height: 0;
    right: -$triangle-long-size;
    width: 0;
  }

  &__avatar {
    border-radius: 50%;
    height: $avatar-size;
    width: $avatar-size;
  }

  &__container {
    column-gap: 15px;
    display: grid;
    grid-template-columns: $avatar-size 1fr;
    margin: 0;
    padding: 13px 14px 15px 14px;
    position: relative;
    z-index: 1;
  }

  &__content-grid {
    color: #47515c;
    display: grid;
    grid-template-rows: repeat(3, min-content);
    row-gap: 12px;
  }

  &__emote {
    max-height: $emote-size;
    max-width: $emote-size;
  }

  &__emote--gigantified {
    max-height: $emote-size * 4;
    max-width: $emote-size * 4;
  }

  &__header {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    margin-top: 5px;
    width: 100%;
  }

  &__images {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 5px;
    z-index: 1;
  }

  &__name {
    color: #196a89;
    font-size: 20px;
    font-weight: 500;
    line-height: 1.1;
    text-align: left;
  }

  &__name--readable {
    font-size: 16px;
  }

  &__rainbow-eclipse {
    border-radius: 8px;
    bottom: 0;
    filter: blur(4px);
    left: 0;
    overflow: hidden;
    position: absolute;
    right: 0;
    top: 0;

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

  &__text {
    font-size: 19px;
    letter-spacing: -.4px;
    line-height: 27px;
    text-align: left;
  }

  &__timestamp {
    align-self: start;
    font-size: 16px;
    margin: 0 0 2px auto;
  }
}

.message--highlighted {
  position: relative;

  &::before {
    content: '';
    position: absolute;
    border-width: 70px 0 0 70px;
    border-color: transparent transparent transparent #755ebc;
    bottom: 0;
    border-style: solid;
    left: 0;
    border-bottom-left-radius: 5px;
  }
}

.message--rainbow-eclipse {
  padding: 4px;

  &:last-of-type::after {
    right: -($triangle-long-size - 4px);
  }

  .message__container {
    background-color: $background-color;
    padding: 10px;
  }
}
</style>
