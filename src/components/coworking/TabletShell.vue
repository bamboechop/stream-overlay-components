<template>
  <div class="tablet-shell">
    <div class="tablet-shell__button"></div>
    <div class="tablet-shell__reflection">
      <div class="tablet-shell__bezel">
        <div class="tablet-shell__camera"></div>
        <div class="tablet-shell__display"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:math";

$tablet-width: 1644px;

.tablet-shell {
  background-color: #000;
  border-radius: 64px;
  border: 8px solid #aacc00;
  box-shadow: 14px -12px 24px 12px rgba(0, 0, 0, 0.5);
  height: math.div($tablet-width * 9, 16);
  height: 960px;
  position: absolute;
  right: -60px;
  top: -20px;
  transform: rotate(-1.5deg);
  width: $tablet-width;

  &__bezel {
    border-radius: 56px;
    border: 64px solid #000;
    height: 100%;
    position: relative;

    &::after {
      background-color: #fff;
      height: 200%;
      left: 76%;
      opacity: .05;
      position: absolute;
      top: 0;
      transform: rotate(11deg);
      width: 100%;
      z-index: 2;
    }
  }

  &__button {
    background-image: linear-gradient(to right,
        #aacc00, #ddf85a 7%,
        #aacc00 15%, #d2ef3f 70%,
        #c4e61c 85%,
        #cbf400 93%, #aacc00);
    border-bottom: none;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    bottom: 100%;
    left: -41px;
    height: 7px;
    position: absolute;
    transform: rotate(-90deg);
    top: 100px;
    width: 60px;
  }

  &__camera {
    background-image: radial-gradient(5px 5px, #1b1b1b, #343434);
    background-position: top left;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 9px;
    box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.25);
    left: -40px; // 8px border of shell + half of 64px border of bezel + 1/4 of the width
    height: 16px;
    padding: 4px;
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    width: 16px;
  }

  &__display {
    background-color: #dd00f5;
    border-radius: 8px;
    height: 100%;
    position: relative;
    z-index: 2;
  }

  &__reflection {
    height: 100%;
    overflow: hidden;
  }
}
</style>
