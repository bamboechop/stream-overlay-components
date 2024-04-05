<template>
  <div class="status-and-time-panel">
    <div class="status-and-time-panel__status">
      <template v-for="path of statusIconPaths">
        <img
          alt=""
          class="status-and-time-panel__icon"
          :src="path" />
      </template>
    </div>
    <span class="status-and-time-panel__time">{{ time }}</span>
  </div>
</template>

<script lang="ts" setup>
import { useDateFormat, useNow } from '@vueuse/core';

const time = useDateFormat(useNow(), 'HH:mm');
const statusIconPaths = ['/windows-95/network.png', '/windows-95/loudspeaker.png', '/windows-95/microphone.png'];
</script>

<style lang="scss" scoped>
.status-and-time-panel {
  align-items: center;
  border-bottom: 1px solid #fff;
  border-left: 1px solid #7f7f7f;
  border-right: 1px solid #fff;
  border-top: 1px solid #7f7f7f;
  color: inherit;
  display: flex;
  font-family: inherit;
  font-size: inherit;
  gap: 4px;
  height: 100%;
  justify-content: space-between;
  line-height: 1;
  padding: 2px 4px;

  &__status {
    display: grid;
    flex: 0 1 auto;
    gap: 1px;
    grid-template-columns: repeat(4, 1fr) min-content;
  }

  &__time {
    flex: 0 0 min-content;
    margin-top: 3px;
  }
}
</style>
