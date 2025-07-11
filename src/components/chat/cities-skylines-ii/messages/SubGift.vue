<template>
  <li class="sub-gift">
    <div class="sub-gift__images">
      <img
        :alt="sender.displayName"
        class="sub-gift__avatar"
        :src="sender.image" />
      <GiftSvg class="sub-gift__gift" />
      <CornerDownRightSvg class="sub-gift__corner-down-right" />
      <img
        :alt="recipient.displayName"
        class="sub-gift__avatar"
        :src="recipient.image" />
    </div>
    <div class="sub-gift__content-grid">
      <header class="sub-gift__header">
        <div class="sub-gift__names">
          <span class="sub-gift__name">
            {{ sender.displayName }}
            <template v-if="sender.userName && sender.displayName?.toLowerCase() !== sender.userName.toLowerCase()">
              <span class="sub-gift__name sub-gift__name--readable">({{ sender.userName }})</span>
            </template>
          </span>
        </div>
        <span class="sub-gift__timestamp">{{ humanReadableTimestamp }}</span>
      </header>
      <main class="sub-gift__text">
        hat gerade
        <span class="sub-gift__name">
          {{ recipient.displayName }}
          <template v-if="recipient.userName && recipient.displayName?.toLowerCase() !== recipient.userName.toLowerCase()">
            <span class="sub-gift__name sub-gift__name--readable">({{ recipient.userName }})</span>
          </template>
        </span>
        ein Stufe {{ plan }} Abonnement geschenkt! Vielen Dank!
        <img
          :alt="LOVE_EMOTE?.name"
          class="sub-gift__emote"
          :src="LOVE_EMOTE?.url" />
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
// @ts-expect-error "cannot find module or its corresponding type declarations", I just want the icon ;_;
import GiftSvg from '@/assets/gift.svg?component';
// @ts-expect-error "cannot find module or its corresponding type declarations", I just want the icon ;_;
import CornerDownRightSvg from '@/assets/corner-down-right.svg?component';
import type { ISubGift } from '@/common/interfaces/index.interface';
import MessageInteraction from '@/components/chat/cities-skylines-ii/MessageInteraction.vue';
import { EMOTES } from '@/common/constants/emotes.constant';

const props = defineProps<ISubGift>();

const audioPlayer = ref<HTMLAudioElement>();
const humanReadableTimestamp = ref('');

const LOVE_EMOTE = EMOTES.find(emote => emote.name === 'bamboe1Love');

onMounted(() => {
  const parsedTimestamp = new Date(props.timestamp ?? Date.now());
  const hours = parsedTimestamp.getHours();
  const minutes = parsedTimestamp.getMinutes();
  humanReadableTimestamp.value = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;

  audioPlayer.value?.play();
});
</script>

<style lang="scss" scoped>
@import '@/assets/cities-skylines-ii.variables';

.sub-gift {
  background-color: $background-color;
  border-radius: 5px;
  column-gap: 15px;
  display: grid;
  grid-template-columns: 90px 1fr;
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

  &__avatar {
    border-radius: 50%;
    height: $avatar-size;
    width: $avatar-size;
  }

  &__avatar:last-of-type {
    margin-left: 48px;
  }

  &__content-grid {
    color: #47515c;
    display: grid;
    grid-template-rows: repeat(3, min-content);
    row-gap: 12px;
  }

  &__corner-down-right {
    height: 32px;
    left: 14px;
    position: absolute;
    top: $avatar-size + 12px;
    width: 32px;
  }

  &__emote {
    max-height: $emote-size;
    max-width: $emote-size;
  }

  &__gift {
    height: 20px;
    left: 22px;
    position: absolute;
    top: $avatar-size + 2px;
    width: 20px;
  }

  &__header {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    margin-top: 5px;
    width: 100%;
  }

  &__images {
    color: #000;
    display: flex;
    flex-direction: column;
    gap: 11px;
    position: relative;
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

  &__names {
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
    align-self: start;
    font-size: 16px;
    margin: 0 0 2px auto;
  }
}
</style>
