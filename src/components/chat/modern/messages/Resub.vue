<template>
  <li
    class="resub"
    :class="{ 'resub--mounted': mounted }">
    <strong class="resub__name">{{ displayName }}</strong>
    <template v-if="userName && displayName?.toLowerCase() !== userName.toLowerCase()">
      <span class="resub__username"> ({{ userName }})</span>
    </template>
    pflegt seit {{ cumulativeMonths ? cumulativeMonths : months }} Monaten den Garten!
    <img
      :alt="COZY_EMOTE?.name"
      class="resub__emote"
      :src="COZY_EMOTE?.url" />
    <div class="resub__text">
      <template
        v-for="(part, index) of messageParts"
        :key="`resub-${part.value}-part-${index}`">
        <template v-if="part.type === 'text'">
          {{ part.value }}
        </template>
        <template v-if="part.type === 'emote'">
          <img
            :alt="part.raw"
            class="resub__emote"
            :src="part.value" />
        </template>
      </template>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { IResub } from '@/common/interfaces/index.interface';
import { parseMessage } from '@/common/helpers/twitch-message.helper';
import { EMOTES } from '@/common/constants/emotes.constant';

const props = defineProps<IResub & { messageIndex?: number; messageOffset?: number }>();

const messageParts = ref<Record<string, string | undefined>[]>([]);
const mounted = ref(false);

const COZY_EMOTE = EMOTES.find(emote => emote.name === 'bamboe1Cozy');

onMounted(() => {
  window.setTimeout(() => {
    mounted.value = true;
  }, 0);

  messageParts.value = parseMessage(props.emotes, props.text);
});
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.resub {
  background-color: rgba(255, 172, 18, 0.05);
  border: 2px solid #ffac12;
  border-radius: $window-frame-border-radius;
  bottom: 0;
  left: 0;
  padding: $window-frame-padding $window-frame-padding * 2;
  position: absolute;
  right: 0;
  text-align: left;
  transform: translateY(100%);
  transition: transform 400ms ease;
  width: 100%;

  &__badge {
    height: $badge-size;
    width: $badge-size;
  }

  &__emote {
    max-height: $emote-size;
    max-width: $emote-size;
    vertical-align: middle;
  }

  &__name {
    color: v-bind(color);
  }

  &__text {
    font-style: italic;
  }

  &__username {
    font-size: 12px;
  }
}

.resub--mounted {
  transform: translateY(calc(v-bind(messageOffset) * -1px));
}
</style>
