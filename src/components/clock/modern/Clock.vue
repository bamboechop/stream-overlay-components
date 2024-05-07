<template>
  <WindowFrame class="clock-window-window">
    <div class="clock-window">
      <span class="clock-window__time">{{ time }}</span>
      <span class="clock-window__date">{{ date }}</span>
    </div>
  </WindowFrame>
</template>

<script lang="ts" setup>
import { useDateFormat, useNow } from '@vueuse/core';
import WindowFrame from '@/components/desktop/WindowFrame.vue';

const date = useDateFormat(useNow(), 'YYYY-MM-DD');
const time = useDateFormat(useNow(), 'HH:mm:ss');
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.clock-window {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: $window-frame-padding * 2 $window-frame-padding * 4;

  &__date {
    font-size: 16px;
    letter-spacing: -.5px;
  }

  &__time {
    font-size: 22px;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }
}

.clock-window-window {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  margin-left: auto;
  width: max-content;
}
</style>
