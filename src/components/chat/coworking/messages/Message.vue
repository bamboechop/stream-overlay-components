<template>
  <li class="message">
    <div
      class="message__info"
      :class="{ 'message__info--has-emote': messageParts.find(part => part.type === 'emote') }">
      <template v-if="userBadges.length > 0">
        <template
          v-for="(badge, index) of userBadges"
          :key="`badge-${badge.description}.${index}`">
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
          <img
            :alt="part.raw"
            class="message__emote"
            :src="part.value" />
        </template>
      </template>
    </span>
  </li>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { IChat } from '@/common/interfaces/index.interface';
import { parseMessage, parseUserBadges } from '@/common/helpers/twitch-message.helper';

const props = defineProps<IChat>();

const messageParts = ref<Record<string, string | undefined>[]>([]);
const userBadges = ref<{ description: string; id: string; imageUrl: string; title: string }[]>([]);

onMounted(() => {
  messageParts.value = parseMessage(props.emotes, props.text);

  if (props.userBadges) {
    userBadges.value = parseUserBadges(props.userBadges, props.availableBadges);
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/coworking.variables';

.message {
  display: flex;
  flex-direction: column;

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

  &__name {
    margin-top: 3px;
  }

  &__text {
    text-align: left;
  }
}
</style>
