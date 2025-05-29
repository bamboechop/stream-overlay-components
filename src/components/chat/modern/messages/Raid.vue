<template>
  <li
    class="raid"
    :class="{ 'raid--mounted': mounted }">
    <div class="raid__info">
      <span class="raid__name">{{ userName }}</span> raidet uns mit {{ viewerCount }} Zusehern!
    </div>
    <span class="raid__text">
      Vielen Dank, wie war dein Stream?
      <img
        alt="bamboe1Love"
        class="raid__emote"
        src="/emotes/bamboe1Love.png" />
    </span>
  </li>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { IRaid } from '@/common/interfaces/index.interface';

defineProps<IRaid & { messageIndex?: number; messageOffset?: number }>();
const mounted = ref(false);

onMounted(() => {
  window.setTimeout(() => {
    mounted.value = true;
  }, 0);
});
</script>

<style lang="scss" scoped>
@use 'sass:math';

@import '@/assets/modern.variables';

.raid {
  background-color: rgba(255, 54, 155, 0.075);
  border: 2px solid #ff369b;
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

  &__emote {
    max-height: $emote-size;
    max-width: $emote-size;
    vertical-align: middle;
  }

  &__info {
    display: flex;
    float: left;
    gap: 4px;
  }

  &__name {
    color: #ff369b;
    font-weight: 700;
  }
}

.raid--mounted {
  transform: translateY(calc(v-bind(messageOffset) * -1px));
}
</style>
