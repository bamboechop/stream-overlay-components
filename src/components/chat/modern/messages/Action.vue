<template>
  <li
    class="action"
    :class="{ 'action--me': isMeMessage }">
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
      <span
        class="action__name"
        :style="{ color }">
        <strong>{{ displayName }}</strong>
        <template v-if="displayName?.toLowerCase() !== userName?.toLowerCase()">
          ({{ userName }})
        </template>
      </span>
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
@use 'sass:math';

@import '@/assets/modern.variables';

.action {
  display: flex;
  flex-direction: column;
  text-align: left;

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
    float: left;
    gap: 4px;
    margin: -3px 4px 0 0;
  }

  &__info--has-emote {
    margin-top: -1px;
  }
}

.action--me {
  .action__text {
    color: #ededed;
    font-style: italic;
  }
}
</style>
