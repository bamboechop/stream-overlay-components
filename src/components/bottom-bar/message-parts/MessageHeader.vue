<template>
  <header class="message-header">
    <span class="message-header__timestamp">{{ humanReadableTimestamp }}</span>
    <template v-if="userBadges.length > 0">
      <template
        v-for="(badge, index) of userBadges"
        :key="`badge-${badge.description}-${index}`">
        <img
          :alt="badge.description"
          class="message-header__badge"
          :src="badge.imageUrl" />
      </template>
    </template>
    <span class="message-header__name">
      {{ displayName }}
      <template v-if="userName && displayName?.toLowerCase() !== userName.toLowerCase()">
        ({{ userName }})
      </template>
    </span>
  </header>
</template>

<script lang="ts" setup>
import { darkenHex, parseMessage, parseUserBadges } from '@/common/helpers/twitch-message.helper';
import type { IBadge } from '@/common/interfaces/index.interface';
import type { Badges } from 'tmi.js';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  availableBadges: Record<string, IBadge[]>;
  color?: string;
  displayName?: string;
  msgType?: 'chat' | 'action';
  timestamp?: number;
  userBadges?: Badges;
  userName?: string;
}>();

const userBadges = ref<{ description: string; id: string; imageUrl: string; title: string }[]>([]);

const isActionOrChatMessage = computed(() => ['action', 'chat'].includes(props.msgType));

const humanReadableTimestamp = computed(() => {
  return new Date(props.timestamp ?? Date.now()).toLocaleTimeString('de', {
    hour: '2-digit',
    minute: '2-digit',
  });
});

const nameColor = computed(() => {
  if (isActionOrChatMessage.value && props.color) {
    return props.color;
  }
});

const strokeColor = computed(() => {
  if (isActionOrChatMessage.value && props.color) {
    return darkenHex(props.color);
  }
});

const timestampBackgroundColor = computed(() => {
  if (isActionOrChatMessage.value && props.color) {
    return darkenHex(props.color);
  }
});

onMounted(async () => {
  if (isActionOrChatMessage.value) {
    if (props.userBadges) {
      userBadges.value = parseUserBadges(props.userBadges, props.availableBadges);
    }
  }
});
</script>

<style lang="scss" scoped>
  .message-header {
    align-items: center;
    column-gap: 2px;
    display: flex;

  &__badge {
    aspect-ratio: 1 / 1;
    height: 16px;
    width: 16px;
  }

  &__name {
    color: v-bind(nameColor);
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    paint-order: stroke fill;
    -webkit-text-stroke: 1px v-bind(strokeColor);
  }

    &__timestamp {
    align-items: center;
    background-color: v-bind(timestampBackgroundColor);
    border-radius: 4px;
    color: #eee;
    display: flex;
    font-family: 'Geist Mono', monospace;
    font-size: 9px;
    font-weight: 600;
    height: 16px;
    justify-content: center;
    min-width: 32px;
    padding: 2px;
  }
}
</style>
