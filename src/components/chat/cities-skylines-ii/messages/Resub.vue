<template>
  <li class="resub">
    <div class="resub__images">
      <img
        :alt="displayName"
        class="resub__avatar"
        :src="userImage" />
    </div>
    <div class="resub__content-grid">
      <header class="resub__header">
        <span class="resub__name">
          {{ displayName }}
          <template v-if="userName && displayName?.toLowerCase() !== userName.toLowerCase()">
            <span class="resub__name resub__name--readable">({{ userName }})</span>
          </template>
        </span>
        <span class="resub__timestamp">{{ humanReadableTimestamp }}</span>
      </header>
      <main class="resub__text">
        <p class="resub__duration">
          ist seit {{ months }} Monaten mit einem Stufe {{ plan }} Abonnement dabei!
        </p>
        <template
          v-for="(part, index) of messageParts"
          :key="`message-${part.value}-part-${index}`">
          <template v-if="part.type === 'text'">
            <span>{{ part.value }}</span>
          </template>
          <template v-if="part.type === 'emote'">
            <img
              :alt="part.raw"
              class="resub__emote"
              :src="part.value" />
          </template>
        </template>
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
import type { IResub } from '@/common/interfaces/index.interface';
import { parseMessage } from '@/common/helpers/twitch-message.helper';
import MessageInteraction from '@/components/chat/cities-skylines-ii/MessageInteraction.vue';

const props = defineProps<IResub>();

const audioPlayer = ref<HTMLAudioElement>();
const humanReadableTimestamp = ref('');
const messageParts = ref<Record<string, any>[]>([]);

onMounted(() => {
  messageParts.value = parseMessage(props.emotes, props.text);

  const parsedTimestamp = new Date(props.timestamp ?? Date.now());
  const hours = parsedTimestamp.getHours();
  const minutes = parsedTimestamp.getMinutes();
  humanReadableTimestamp.value = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;

  audioPlayer.value?.play();
});
</script>

<style lang="scss" scoped>
@import '@/assets/cities-skylines-ii.variables';

.resub {
  background-color: $background-color;
  border-radius: 5px;
  column-gap: 15px;
  display: grid;
  grid-template-columns: $avatar-size 1fr;
  margin: 0;
  padding: 13px 14px 15px 14px;
  position: relative;
  width: calc(450px - 14px - 14px); // desired width minus 2*padding

  &::before {
    content: '';
    position: absolute;
    border-width: 70px 0 0 70px;
    border-color: transparent transparent transparent #ffac12;
    bottom: 0;
    border-style: solid;
    left: 0;
    border-bottom-left-radius: 5px;
  }

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

  &__content-grid {
    color: #47515c;
    display: grid;
    grid-template-rows: repeat(3, min-content);
    row-gap: 12px;
  }

  &__duration {
    font-size: 18px;
    font-style: italic;
    margin: -12px 0 0 0;
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
    line-height: 1.1;
    text-align: left;
  }

  &__name--readable {
    font-size: 16px;
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
</style>
