<template>
  <li
    class="action"
    :class="[
      { 'action--me': isMeMessage },
      { 'action--mounted': mounted },
    ]">
    <div
      class="action__info"
      :class="{ 'action__info--has-emote': messageParts.find(part => part.type === 'emote') }">
      <template v-if="userBadges.length > 0">
        <template
          v-for="(badge, index) of userBadges"
          :key="`badge-${badge.description}-${index}`">
          <img
            :alt="badge.description"
            class="action__badge"
            :src="badge.imageUrl" />
        </template>
      </template>
      <div class="action__name-container">
        <strong class="action__name">{{ displayName }}</strong>
        <template v-if="userName && displayName?.toLowerCase() !== userName.toLowerCase()">
          ({{ userName }})
        </template>
      </div>
    </div>
    <span class="action__text">
      <template
        v-for="(part, index) of messageParts"
        :key="`action-${part.value}-part-${index}`">
        <template v-if="part.type === 'text'">
          {{ part.value }}
        </template>
        <template v-if="part.type === 'emote'">
          <img
            :alt="part.raw"
            class="action__emote"
            :src="part.value" />
        </template>
      </template>
    </span>
  </li>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { IAction, IBadge } from '@/common/interfaces/index.interface';
import { parseMessage, parseUserBadges } from '@/common/helpers/twitch-message.helper';
import { BOT_ACCOUNT_USERNAMES } from '@/common/constants/bot-accounts.constant';

const props = defineProps<IAction & { messageIndex?: number; messageOffset?: number }>();

const isMeMessage = ref(false);
const messageParts = ref<Record<string, string | undefined>[]>([]);
const userBadges = ref<IBadge[]>([]);
const mounted = ref(false);

onMounted(() => {
  window.setTimeout(() => {
    mounted.value = true;
  }, 0);

  messageParts.value = parseMessage(props.emotes, props.text);

  if (props.userName) {
    isMeMessage.value = !(BOT_ACCOUNT_USERNAMES.includes(props.userName.toLowerCase()));
  }

  if (props.userBadges) {
    userBadges.value = parseUserBadges(props.userBadges, props.availableBadges);
  }
});
</script>

<style lang="scss" scoped>
@use 'sass:math';

@import '@/assets/modern.variables';

.action {
  bottom: 0;
  display: flex;
  flex-direction: column;
  left: 0;
  position: absolute;
  right: 0;
  text-align: left;
  transform: translateY(100%);
  transition: transform 400ms ease;

  &__badge {
    height: $badge-size;
    width: $badge-size;
  }

  &__emote {
    max-height: $emote-size;
    max-width: $emote-size;
    vertical-align: middle;
  }

  &__info {
    align-items: end;
    display: flex;
    gap: 4px;
  }

  &__name {
    color: v-bind(color);
    font-size: 16px;
  }

  &__name-container {
    font-size: 12px;
    height: $badge-size; // both height and line-height are set to $badge-size to align the name with the badges
    line-height: $badge-size;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.action--mounted {
  transform: translateY(calc(v-bind(messageOffset) * -1px));
}

.action--me {
  .action__text {
    color: #ededed;
    font-style: italic;
  }
}
</style>
