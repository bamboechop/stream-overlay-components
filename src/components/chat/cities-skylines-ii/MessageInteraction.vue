<template>
  <div class="message-interaction">
    {{ interactionCount }}
    <HeartSvg
      class="message-interaction__heart"
      :class="{ 'message-interaction__heart--filled': heartFilled }" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
// @ts-expect-error "cannot find module or its corresponding type declarations", I just want the icon ;_;
import HeartSvg from '@/assets/heart.svg?component';

const props = defineProps<{ viewerCount: number }>();

const heartFilled = Math.random() > 0.9;
const interactionCount = ref('0');

const count = Math.floor(Math.random() * (props.viewerCount + 1));
// noinspection TypeScriptValidateTypes - WebStorm seems to not be up2date for NumberFormat
interactionCount.value = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
}).format(heartFilled ? count + 1 : count);
</script>

<style lang="scss" scoped>
.message-interaction {
  align-items: center;
  color: #6f7984;
  display: flex;
  font-size: 16px;
  gap: 4px;
  justify-content: flex-end;

  &__heart {
    height: 19px;
  }

  &__heart--filled {
    color: #ff4646;
    fill: #ff4646;
  }
}
</style>
