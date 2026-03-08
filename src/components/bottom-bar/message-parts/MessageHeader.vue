<template>
  <header class="message-header">
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
import { getReadableStrokeColor, parseUserBadges } from '@/common/helpers/twitch-message.helper';
import type { IBadge } from '@/common/interfaces/index.interface';
import type { Badges } from 'tmi.js';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  availableBadges: Record<string, IBadge[]>;
  color?: string;
  displayName?: string;
  msgType?: 'chat' | 'action';
  userBadges?: Badges;
  userName?: string;
}>();

const userBadges = ref<{ description: string; id: string; imageUrl: string; title: string }[]>([]);

const isActionOrChatMessage = computed(() => props.msgType === 'action' || props.msgType === 'chat');

const nameColor = computed(() => {
  if (isActionOrChatMessage.value && props.color) {
    return props.color;
  }
});

const strokeColor = computed(() => {
  if (isActionOrChatMessage.value && props.color) {
    return getReadableStrokeColor(props.color);
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
    font-size: 16px;
    font-weight: 500;
    paint-order: stroke fill;
    -webkit-text-stroke: 4px v-bind(strokeColor);
  }
}
</style>
