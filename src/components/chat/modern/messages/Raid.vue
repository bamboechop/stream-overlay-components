<template>
  <li
    class="raid"
    :class="{ 'raid--mounted': mounted }">
    <div class="raid__text">
      💨🎐 Ein frischer Wind trägt <strong>{{ viewerCount > 1 ? `${viewerCount} Gäste` : 'einen Gast' }}</strong> in den Garten –
      willkommen, und danke für den Raid, <strong class="raid__name">{{ userName }}</strong>.
      <br />
      Wie war eure Reise?
      <img
        :alt="LOVE_EMOTE?.name"
        class="raid__emote"
        :src="LOVE_EMOTE?.url" />
    </div>
  </li>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { IRaid } from '@/common/interfaces/index.interface';
import { EMOTES } from '@/common/constants/emotes.constant';

defineProps<IRaid & { messageIndex?: number; messageOffset?: number }>();
const mounted = ref(false);

const LOVE_EMOTE = EMOTES.find(emote => emote.name === 'bamboe1Love');

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

  &__name {
    color: #ff369b;
    font-weight: 700;
  }
}

.raid--mounted {
  transform: translateY(calc(v-bind(messageOffset) * -1px));
}
</style>
