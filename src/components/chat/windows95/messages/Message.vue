<template>
  <li
    class="message"
    :class="[
      { 'message--highlighted': msgId === 'highlighted-message' },
      { [`message--${animationId}`]: animationId },
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
      </div>
    </template>
    <div class="message__container">
      <header class="message__header">
        <div
          v-if="userBadges.length > 0"
          class="message__images">
          <template
            v-for="(badge, index) of userBadges"
            :key="`badge-${badge.description}-${index}`">
            <img
              :alt="badge.description"
              class="message__badge"
              :src="badge.imageUrl" />
          </template>
        </div>
        <span class="message__name">
          {{ displayName }}
          <template v-if="userName && displayName?.toLowerCase() !== userName.toLowerCase()">
            ({{ userName }})
          </template>
        </span>
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
    </div>
  </li>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRefs } from 'vue';
import type { IChat } from '@/common/interfaces/index.interface';
import { parseMessage, parseUserBadges } from '@/common/helpers/twitch-message.helper';

const props = defineProps<IChat>();
const { animationId, msgId } = toRefs(props);

const isGigantifiedEmoteMessage = msgId.value === 'gigantified-emote-message';
const messageParts = ref<Record<string, string | undefined>[]>([]);
const userBadges = ref<{ description: string; id: string; imageUrl: string; title: string }[]>([]);

const emotes = [
  '/emotes/bamboe1Butter.png',
  '/emotes/bamboe1Cool.png',
  '/emotes/bamboe1Cozy.png',
  '/emotes/bamboe1Dead.png',
  '/emotes/bamboe1Derp.png',
  '/emotes/bamboe1KEKW.png',
  '/emotes/bamboe1Love.png',
  '/emotes/bamboe1Lurk.gif',
  '/emotes/bamboe1Rage.png',
  '/emotes/bamboe1Sad.png',
  '/emotes/bamboe1Scared.png',
  '/emotes/bamboe1Sexy.png',
];

const durations = ref<number[]>(emotes.map(() => Number.parseFloat((Math.random() * 0.75 + 0.5).toFixed(2)))); // Random duration between 0.5 and 1.25 seconds
const delays = ref<number[]>(emotes.map(() => Number.parseFloat((Math.random() * 3).toFixed(2)))); // Random delay up to 3 seconds
const offsets = ref<number[]>(emotes.map(() => Number.parseFloat((Math.random() * 96).toFixed(2)))); // Random left offset between 0 and 96%
const rotations = ref<number[]>(emotes.map(() => Number.parseFloat((Math.random() * 20 - 10).toFixed(2)))); // Random rotation between -10 and 10 degrees
const sizes = ref<number[]>(emotes.map(() => Number.parseFloat((Math.random() * 0.75 + 0.25).toFixed(2)))); // Random size between 0.25 and 1.0

onMounted(() => {
  messageParts.value = parseMessage(props.emotes, props.text, 'dark', isGigantifiedEmoteMessage ? '3.0' : '2.0');

  if (props.userBadges) {
    userBadges.value = parseUserBadges(props.userBadges, props.availableBadges);
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/windows95.variables';

.message {
  position: relative;
  width: 100%;

  &:not(:last-of-type) {
    border-bottom: 1px solid #868a8e;
    box-shadow: 0 1px 0 #fff;
  }

  &__container {
    color: #000;
    display: grid;
    gap: 4px;
    grid-template-rows: 18px 1fr;
    justify-content: start;
    position: relative;
    width: 100%;
    z-index: 1;
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
    gap: 5px;
  }

  &__images {
    display: flex;
    gap: 2px;
  }

  &__text {
    text-align: left;
  }
}

.message__rainbow-eclipse {
  bottom: 10px;
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

.simmer {
  background: linear-gradient(90deg, #00ccad, #cc00b1);
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
  padding-right: calc(2px + #{$highlight-element-size});

  &::before {
    background-color: #755ebc;
    bottom: 0;
    content: '';
    position: absolute;
    right: 0;
    top: -9px;
    width: $highlight-element-size;
  }
}

.message--rainbow-eclipse {
  padding: 4px 4px 14px 4px;

  .message__container {
    background-color: #c3c3c3;
    padding: 6px;
  }
}

.message--simmer {
  padding: 30px 4px 4px 4px;

  .message__container {
    background-color: #c3c3c3;
    padding: 10px;
  }
}
</style>
