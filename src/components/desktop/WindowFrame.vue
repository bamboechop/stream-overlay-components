<template>
  <div
    class="window-frame"
    :class="{ 'window-frame--active': active }">
    <slot></slot>
    <template v-if="title">
      <div class="window-frame__bottom-bar">
        {{ title }}
        <div class="window-frame__buttons">
          <button
            class="window-frame__button"
            title="Minimize"
            type="button">
            <Minimize :size="16" />
          </button>
          <button
            class="window-frame__button"
            title="Maximize"
            type="button">
            <Maximize :size="16" />
          </button>
          <button
            class="window-frame__button"
            title="Close"
            type="button">
            <X :size="16" />
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { Maximize, Minimize, X } from 'lucide-vue-next';

withDefaults(defineProps<{ active?: boolean; title?: string }>(), { active: false });
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.window-frame {
  background: rgba(255, 255, 255, 0.75);
  border-radius: $window-frame-border-radius;
  border: 1px solid rgba(255, 255, 255, 0.75);
  display: flex;
  flex-direction: column;
  gap: $window-frame-padding;
  padding: $window-frame-padding;

  &__bottom-bar {
    align-items: center;
    display: flex;
    font-weight: 700;
    justify-content: space-between;
    margin: 0 0 0 $window-frame-padding * 2;
  }

  &__button {
    appearance: none;
    background-color: transparent;
    border: none;
    display: flex;
    padding: 0;
  }

  &__button:first-of-type {
    margin-right: 2px;
  }

  &__buttons {
    display: flex;
    flex-direction: row;
    gap: 6px;
    padding: $window-frame-padding;
  }
}

.window-frame--active {
  background: rgba(170, 204, 0, 0.75);
  border-color: rgba(170, 204, 0, 0.75);
}
</style>
