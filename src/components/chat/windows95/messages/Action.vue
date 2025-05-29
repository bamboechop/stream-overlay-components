<template>
  <li
    class="action"
    :class="{ 'action--me': isMeMessage }">
    <header class="action__header">
      <template v-if="userBadges.length > 0">
        <div class="action__images">
          <template
            v-for="(badge, index) of userBadges"
            :key="`badge-${badge.description}-${index}`">
            <img
              :alt="badge.description"
              class="action__badge"
              :src="badge.imageUrl" />
          </template>
        </div>
      </template>
      <span class="action__name">
        {{ displayName }}
        <template v-if="userName && displayName?.toLowerCase() !== userName.toLowerCase()">
          ({{ userName }})
        </template>
      </span>
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
  </li>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { IAction, IBadge } from '@/common/interfaces/index.interface';
import { parseMessage, parseUserBadges } from '@/common/helpers/twitch-message.helper';
import { BOT_ACCOUNT_USERNAMES } from '@/common/constants/bot-accounts.constant';

const props = defineProps<IAction>();

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
});
</script>

<style lang="scss" scoped>
@import '@/assets/windows95.variables';

.action {
  color: #000;
  display: grid;
  gap: 4px;
  grid-template-rows: 18px 1fr;
  justify-content: start;
  position: relative;
  width: 100%;

  &:not(:last-of-type) {
    border-bottom: 1px solid #868a8e;
    box-shadow: 0 1px 0 #fff;
  }

  &__emote {
    max-height: $emote-size;
    max-width: $emote-size;
  }

  &__header {
    align-items: center;
    display: flex;
    gap: 5px;
    overflow: hidden;
  }

  &__images {
    display: flex;
    gap: 2px;
  }

  &__name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__text {
    text-align: left;
  }
}

.action--me {
  padding-right: 32px;

  &::before {
    content: '/me';
    font-size: 18px;
    opacity: .5;
    right: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
