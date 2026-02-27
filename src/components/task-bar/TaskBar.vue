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
  width: max-content;
}
</style>
