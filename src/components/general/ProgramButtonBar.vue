<template>
  <div class="program-button-bar">
    <template
      v-for="button of buttons"
      :key="button.title">
      <button
        class="program-button-bar__button"
        :style="`--keyboard-shortcut-width: ${button.keyboardShortcutWidth}`"
        type="button">
        {{ button.title }}
      </button>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const buttons = ref([
  { keyboardShortcutWidth: '6px', title: 'File' },
  { keyboardShortcutWidth: '7px', title: 'View' },
  { keyboardShortcutWidth: '7px', title: 'Play' },
  { keyboardShortcutWidth: '7px', title: 'Navigate' },
  { keyboardShortcutWidth: '6px', title: 'Favorites' },
  { keyboardShortcutWidth: '7px', title: 'Help' },
]);
</script>

<style lang="scss" scoped>
.program-button-bar {
  display: flex;
  justify-self: start;

  &__button {
    appearance: none;
    background-color: transparent;
    border: 0;
    color: #000;
    font-family: inherit;
    font-size: inherit;
    height: 18px;
    position: relative;

    &::before {
      background-color: #000;
      bottom: 3px;
      content: '';
      height: 1px;
      position: absolute;
      width: var(--keyboard-shortcut-width);
    }
  }
}
</style>
