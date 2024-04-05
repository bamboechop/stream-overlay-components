<template>
  <div class="media-player-volume-control">
    <img
      alt=""
      class="media-player-volume-control__icon"
      src="/windows-95/loudspeaker.icon.png" />
    <div class="media-player-volume-control__slider-container">
      <label for="volume-slider">Low</label>
      <div class="media-player-volume-control__slider">
        <hr class="media-player-volume-control__input" />
        <IndicatorSvg class="media-player-volume-control__indicator" />
      </div>
      <label for="volume-slider">High</label>
    </div>
  </div>
</template>

<script lang="ts" setup>
// @ts-expect-error "cannot find module or its corresponding type declarations", I just want the icon ;_;
import IndicatorSvg from '@/assets/indicator-horizontal.svg?component';
</script>

<style lang="scss" scoped>
.media-player-volume-control {
  align-items: center;
  display: flex;
  gap: 8px;

  &__icon {
    height: 24px;
  }

  &__indicator {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  &__input {
    background-color: #7f7f7f;
    border-bottom: 1px solid #fff;
    border-top: 1px solid #7f7f7f;
    height: 3px;
    width: 129px;
  }

  &__slider {
    align-items: center;
    display: flex;
    position: relative;
  }

  &__slider-container {
    align-items: center;
    display: flex;
    gap: 4px;
  }
}
</style>
