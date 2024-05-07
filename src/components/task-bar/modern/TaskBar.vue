<template>
  <WindowFrame class="task-bar-window">
    <div class="task-bar">
      <button class="task-bar__button">
        <img
          alt="Start"
          class="task-bar__icon task-bar__icon--start"
          src="/modern/task-bar/start-button.png" />
      </button>
      <template
        v-for="program of programs"
        :key="`task-bar-program-${program.text}`">
        <button
          class="task-bar__button"
          :class="[
            { 'task-bar__button--active': program.active },
          ]"
          :title="program.text"
          type="button">
          <img
            :alt="program.text"
            class="task-bar__icon"
            :src="program.iconPath" />
        </button>
      </template>
    </div>
  </WindowFrame>
</template>

<script lang="ts" setup>
import WindowFrame from '@/components/desktop/WindowFrame.vue';
import type { IProgram } from '@/components/task-bar/task-bar.interface';

defineProps<{ programs: IProgram[] }>();
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.task-bar {
  align-items: end;
  display: flex;
  gap: 16px;
  height: 100%;
  padding: 0 $window-frame-padding $window-frame-padding $window-frame-padding;

  &__button {
    align-items: center;
    appearance: none;
    background-color: transparent;
    border: none;
    display: flex;
    height: 40px;
    justify-content: center;
    padding: 0;
    width: 40px;
  }

  &__button--active {
    height: 48px;
    position: relative;
    width: 48px;

    &::after {
      background-color: rgba(84, 97, 0, 0.75);
      border-radius: $window-frame-border-radius;
      bottom: -7px;
      content: '';
      height: 4px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
    }
  }

  &__icon {
    height: 100%;
    width: 100%;
  }

  &__icon:not(&__icon--start) {
    border-radius: $window-frame-border-radius;
  }
}

.task-bar-window {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 0;
  height: 64px;
  width: max-content;
}
</style>
