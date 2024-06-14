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
          <template v-if="displayName?.toLowerCase() !== userName?.toLowerCase()">
            ({{ userName }})
          </template>
        </span>
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
import { onMounted, ref, toRefs } from 'vue';
import type { IChat } from '@/common/interfaces/index.interface';
import { parseMessage, parseUserBadges } from '@/common/helpers/twitch-message.helper';

const props = defineProps<IChat>();
const { animationId, msgId } = toRefs(props);

const isGigantifiedEmoteMessage = msgId.value === 'gigantified-emote-message';
const messageParts = ref<Record<string, string | undefined>[]>([]);
const userBadges = ref<{ description: string; id: string; imageUrl: string; title: string }[]>([]);

onMounted(() => {
  messageParts.value = parseMessage(props.emotes, props.text, 'dark', isGigantifiedEmoteMessage ? '3.0' : '2.0');

  if (props.userBadges) {
    userBadges.value = parseUserBadges(props.userBadges, props.availableBadges);
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.message {
  position: relative;
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

  &__name {
    margin-top: 3px;
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
}

.message--highlighted {
  background-color: rgba(170, 204, 0, 0.05);
  border: 2px solid #aacc00;
  border-radius: $window-frame-border-radius;
  padding: $window-frame-padding $window-frame-padding * 2;
  width: 100%;
}

.message--rainbow-eclipse {
  padding: 4px;

  .message__container {
    background-color: rgba(14, 14, 16, 0.95);
    padding: 10px;
  }
}
</style>
