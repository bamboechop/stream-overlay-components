<template>
  <li
    class="action"
    :class="{ 'action--me': isMeMessage }">
    <div class="action__images">
      <img
        :alt="displayName"
        class="action__avatar"
        :src="userImage" />
      <template
        v-for="(badge, index) of userBadges"
        :key="`badge-${badge.description}-${index}`">
        <img
          :alt="badge.description"
          class="action__badge"
          :src="badge.imageUrl" />
      </template>
    </div>
    <div class="action__content-grid">
      <header class="action__header">
        <span class="action__name">
          {{ displayName }}
          <template v-if="displayName?.toLowerCase() !== userName?.toLowerCase()">
            <span class="action__name action__name--readable">({{ userName }})</span>
          </template>
        </span>
        <span class="action__timestamp">{{ humanReadableTimestamp }}</span>
      </header>
      <main class="action__text">
        <template
          v-for="(part, index) of messageParts"
          :key="`message-${part.value}-part-${index}`">
          <template v-if="part.type === 'text'">
            <span>{{ part.value }}</span>
          </template>
          <template v-if="part.type === 'emote'">
            <img
              :alt="part.raw"
              class="action__emote"
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
import MessageInteraction from '@/components/chat/cities-skylines-ii/MessageInteraction.vue';
import type { IAction, IBadge } from '@/common/interfaces/index.interface';
import { parseMessage, parseUserBadges } from '@/common/helpers/twitch-message.helper';
import { BOT_ACCOUNT_USERNAMES } from '@/common/constants/bot-accounts.constant';

const props = defineProps<IAction>();

const audioPlayer = ref<HTMLAudioElement>();
const humanReadableTimestamp = ref('');
const isMeMessage = ref(false);
const messageParts = ref<Record<string, string | undefined>[]>([]);
const userBadges = ref<IBadge[]>([]);

onMounted(() => {
  messageParts.value = parseMessage(props.emotes, props.text);

  if (props.userName) {
    isMeMessage.value = !(BOT_ACCOUNT_USERNAMES.includes(props.userName.toLowerCase()));
  }

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

.action {
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

.action--me::before {
  bottom: 8px;
  content: '/me';
  color: #47515c;
  font-size: 28px;
  opacity: .5;
  left: 8px;
  position: absolute;
}
</style>
