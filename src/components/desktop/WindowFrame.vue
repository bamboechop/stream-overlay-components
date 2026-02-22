<template>
  <div
    class="window-frame"
    :class="{ 'window-frame--active': active }">
    <slot></slot>
    <template v-if="title">
      <template v-if="iconPath">
        <div class="window-frame__application-icon">
          <img
            :alt="title"
            class="window-frame__application-icon-image"
            :src="iconPath" />
        </div>
      </template>
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

const { active = false, iconPath, title } = defineProps<{ active?: boolean; iconPath?: string; title?: string }>();
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
  position: relative;
  transition: background 0.5s ease-in-out, border-color 0.5s ease-in-out;

  &__application-icon {
    aspect-ratio: 1;
    background: rgba(255, 255, 255, 0.9);
    border-bottom-right-radius: $window-frame-border-radius;
    border-bottom: 2px solid rgba(255, 255, 255, 0.9);
    border-right: 2px solid rgba(255, 255, 255, 0.9);
    border-top-left-radius: 2px;
    left: $window-frame-padding;
    padding: $window-frame-padding;
    position: absolute;
    top: $window-frame-padding;
  }

  &__application-icon-image {
    aspect-ratio: 1;
    max-width: 56px;
  }

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

  .window-frame__application-icon {
    background: rgba(170, 204, 0, 0.9);
    border-color: rgba(170, 204, 0, 0.9);
  }
}
</style>
