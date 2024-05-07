<template>
  <li
    class="message"
    :class="{ 'message--highlighted': msgId === 'highlighted-message' }">
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
        <template v-if="displayName?.toLowerCase() !== userName?.toLowerCase()">
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
          <img
            :alt="part.raw"
            class="message__emote"
            :src="part.value" />
        </template>
      </template>
    </main>
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
@import '@/assets/windows95.variables';

.message {
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
  }

  &__images {
    display: flex;
    gap: 2px;
  }

  &__text {
    text-align: left;
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
</style>
