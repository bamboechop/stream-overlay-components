<template>
  <li class="resub">
    <header class="resub__header">
      <span class="resub__name">{{ displayName }}</span>
      <template v-if="userName && displayName?.toLowerCase() !== userName.toLowerCase()">
        ({{ userName }})
      </template>
      ist seit {{ months }} Monaten mit einem Stufe {{ plan }} Abonnement dabei!
    </header>
    <template v-if="messageParts.length > 0">
      <main class="resub__text">
        <template
          v-for="(part, index) of messageParts"
          :key="`message-${part.value}-part-${index}`">
          <template v-if="part.type === 'text'">
            <span>{{ part.value }}</span>
          </template>
          <template v-if="part.type === 'emote'">
            <img
              :alt="part.raw"
              class="resub__emote"
              :src="part.value" />
          </template>
        </template>
      </main>
    </template>
  </li>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { IResub } from '@/common/interfaces/index.interface';
import { parseMessage } from '@/common/helpers/twitch-message.helper';

const props = defineProps<IResub>();

const messageParts = ref<Record<string, string | undefined>[]>([]);

onMounted(() => {
  messageParts.value = parseMessage(props.emotes, props.text);
});
</script>

<style lang="scss" scoped>
@import '@/assets/windows95.variables';

.resub {
  color: #000;
  display: grid;
  gap: 4px;
  grid-template-rows: 18px 1fr;
  justify-content: start;
  padding-right: calc(2px + #{$highlight-element-size});
  position: relative;
  width: 100%;

  &::before {
    background-color: #ffac12;
    bottom: 0;
    content: '';
    position: absolute;
    right: 0;
    top: -9px;
    width: $highlight-element-size;
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid #868a8e;
    box-shadow: 0 1px 0 #fff;
  }

  &__emote {
    max-height: $emote-size;
    max-width: $emote-size;
  }

  &__header {
    text-align: left;
  }

  &__images {
    display: flex;
    gap: 2px;
  }

  &__name {
    text-decoration: underline;
  }

  &__text {
    text-align: left;
  }
}
</style>
