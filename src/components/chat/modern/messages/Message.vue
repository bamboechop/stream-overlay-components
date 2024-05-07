<template>
  <li
    class="message"
    :class="{ 'message--highlighted': msgId === 'highlighted-message' }">
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
import { onMounted, ref, toRefs } from 'vue';
import type { IChat } from '@/common/interfaces/index.interface';
import { parseMessage, parseUserBadges } from '@/common/helpers/twitch-message.helper';

const props = defineProps<IChat>();
const { msgId } = toRefs(props);

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
@import '@/assets/modern.variables';

.message {
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

  &__name {
    margin-top: 3px;
  }
}

.message--highlighted {
  background-color: rgba(170, 204, 0, 0.05);
  border: 2px solid #aacc00;
  border-radius: $window-frame-border-radius;
  padding: $window-frame-padding $window-frame-padding * 2;
  width: 100%;
}
</style>
