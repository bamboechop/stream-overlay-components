<template>
  <WindowFrame class="task-bar-window">
    <div class="task-bar">
      <button class="task-bar__button">
        <img
          alt="Start"
          class="task-bar__icon task-bar__icon--start"
          src="/modern/task-bar/start-button.png" />
      </button>
    </div>
  </WindowFrame>
</template>

<script lang="ts" setup>
import WindowFrame from '@/components/desktop/WindowFrame.vue';
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
    height: 44px;
    justify-content: center;
    padding: 0;
    width: 44px;
  }

  &__button--active {
    height: 52px;
    position: relative;
    width: 52px;

    &::after {
      background-color: rgba(84, 97, 0, 0.75);
      border-radius: $window-frame-border-radius;
      bottom: -6px;
      content: '';
      height: 3px;
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
  border-bottom-left-radius: calc($window-frame-border-radius - $window-frame-padding);
  border-bottom-right-radius: 0;
  border-top-left-radius: 0;
  width: max-content;
}
</style>
