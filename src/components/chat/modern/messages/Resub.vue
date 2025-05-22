<template>
  <li
    class="resub"
    :class="{ 'resub--mounted': mounted }">
    <div
      class="resub__info"
      :class="{ 'resub__info--has-emote': messageParts.find(part => part.type === 'emote') }">
      <span class="resub__name">
        <strong :style="{ color }">{{ displayName }}</strong>
        <template v-if="displayName?.toLowerCase() !== userName?.toLowerCase()">
          ({{ userName }})
        </template>
        ist seit {{ months }} Monaten mit einem Stufe {{ plan }} Abonnement dabei!
      </span>
    </div>
    <span class="resub__text">
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
    </span>
  </li>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { IResub } from '@/common/interfaces/index.interface';
import { parseMessage } from '@/common/helpers/twitch-message.helper';

const props = defineProps<IResub & { messageIndex?: number; messageOffset?: number }>();

const messageParts = ref<Record<string, string | undefined>[]>([]);
const mounted = ref(false);

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
  display: flex;
  flex-direction: column;
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

.resub--mounted {
  transform: translateY(calc(v-bind(messageOffset) * -1px));
}
</style>
