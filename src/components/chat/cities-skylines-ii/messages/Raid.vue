<template>
  <li class="raid">
    <div class="raid__images">
      <img
        :alt="userName"
        class="raid__avatar"
        :src="userImage" />
    </div>
    <div class="raid__content-grid">
      <header class="raid__header">
        <span class="raid__name">
          {{ userName }}
        </span>
        <span class="raid__timestamp">{{ humanReadableTimestamp }}</span>
      </header>
      <main class="raid__text">
        raidet uns mit {{ viewerCount }} Zusehern! Vielen Dank, wie war dein Stream?
        <img
          alt="bamboe1Love"
          class="raid__emote"
          src="/emotes/bamboe1Love.png" />
      </main>
      <MessageInteraction :viewer-count="viewerCount" />
    </div>
    <audio
      ref="audioPlayer"
      src="/chirper.mp3"
      style="display: none"></audio>
  </li>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { TRaidMessage } from '@/common/types/index.type';
import MessageInteraction from '@/components/chat/cities-skylines-ii/MessageInteraction.vue';

const props = defineProps<TRaidMessage>();

const audioPlayer = ref<HTMLAudioElement>();
const heartFilled = Math.random() > 0.9;
const humanReadableTimestamp = ref('');
const interactionCount = ref('0');

// TODO check if raid message is fading out after older messages and before newer messages

onMounted(() => {
  const parsedTimestamp = new Date(props.timestamp ?? Date.now());
  const hours = parsedTimestamp.getHours();
  const minutes = parsedTimestamp.getMinutes();
  humanReadableTimestamp.value = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
});

const count = Math.floor(Math.random() * (props.viewerCount + 1));
// noinspection TypeScriptValidateTypes - WebStorm seems to not be up2date for NumberFormat
interactionCount.value = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
}).format(heartFilled ? count + 1 : count);

audioPlayer.value?.play();
</script>

<style lang="scss" scoped>
@import '@/assets/cities-skylines-ii.variables';

$avatar-size: 42px;
$background-color: rgba(225, 225, 225, 0.85);
$emote-size: 28px;
$triangle-long-size: 30px;
$triangle-short-side: 20px;

.raid {
  background-color: $background-color;
  border-radius: 5px;
  column-gap: 15px;
  display: grid;
  grid-template-columns: $avatar-size 1fr;
  margin: 0;
  padding: 13px 14px 15px 14px;
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

  &::before {
    content: '';
    position: absolute;
    border-width: 70px 0 0 70px;
    border-color: transparent transparent transparent #9ab800;
    bottom: 0;
    border-style: solid;
    left: 0;
    border-bottom-left-radius: 5px;
  }

  &__avatar {
    border-radius: 50%;
    height: $avatar-size;
    width: $avatar-size;
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
    text-align: left;
  }

  &__text {
    font-size: 19px;
    letter-spacing: -.4px;
    line-height: 27px;
    margin-top: -12px;
    text-align: left;
  }

  &__timestamp {
    font-size: 16px;
    margin: 0 0 2px auto;
  }
}
</style>
