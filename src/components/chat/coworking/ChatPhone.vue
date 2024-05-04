<template>
  <div class="chat-phone">
    <div class="chat-phone__power-button"></div>
    <div class="chat-phone__volume-button chat-phone__volume-button--up"></div>
    <div class="chat-phone__volume-button chat-phone__volume-button--down"></div>
    <div class="chat-phone__reflection">
      <div class="chat-phone__bezel">
        <div class="chat-phone__camera"></div>
        <div class="chat-phone__display">
          <ChatMessages />
        </div>
      </div>
      <div class="chat-phone__speaker"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ChatMessages from '@/components/chat/coworking/ChatMessages.vue';
</script>

<style lang="scss" scoped>
@use "sass:math";

$phone-height: 800px;

.chat-phone {
  background-color: #000;
  border-radius: 24px;
  border: 4px solid #aacc00;
  // box-shadow: 14px -12px 24px 12px rgba(0, 0, 0, 0.5);
  height: $phone-height;
  position: absolute;
  right: 120px;
  bottom: -400px;
  // transform: rotate(-1.5deg);
  width: math.div($phone-height * 9, 16);

  &__bezel {
    border-radius: 56px;
    border: 8px solid #000;
    display: flex;
    height: 100%;
    position: relative;

    &::after {
      background-color: #fff;
      height: 100%;
      left: 30%;
      opacity: .05;
      position: absolute;
      top: -20%;
      transform: rotate(10deg);
      width: 100%;
      z-index: 2;
    }
  }

  &__camera {
    background-image: radial-gradient(5px 5px, #1b1b1b, #343434);
    background-position: top left;
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 9px;
    box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.25);
    right: 16px;
    height: 12px;
    padding: 4px;
    position: absolute;
    top: -1px;
    width: 12px;
  }

  &__display {
    background-color: #0e0e10;
    border-radius: 12px;
    height: calc(100% - 18px);
    flex: 1 0 100%;
    margin-top: auto;
    position: relative;
    z-index: 2;
  }

  &__power-button,
  &__volume-button {
    background-image: linear-gradient(to right,
        #aacc00, #ddf85a 7%,
        #aacc00 15%, #d2ef3f 70%,
        #c4e61c 85%,
        #cbf400 93%, #aacc00);
    border-bottom: none;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    bottom: 100%;
    height: 4px;
    position: absolute;
  }

  &__power-button {
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    bottom: 100%;
    right: -47px;
    height: 4px;
    position: absolute;
    transform: rotate(90deg);
    top: 190px;
    width: 82px;
  }

  &__volume-button--down,
  &__volume-button--up {
    left: -35px;
    transform: rotate(-90deg);
    width: 58px;
  }

  &__volume-button--down {
    top: 145px;
  }

  &__volume-button--up {
    top: 225px;
  }

  &__reflection {
    height: 100%;
    overflow: hidden;
  }

  &__speaker {
    background: linear-gradient(45deg, #000000 25%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0) 75%, #000000 75%, #000000), #888;
    background-size: 2px 2px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.75), inset 0 0 2px rgba(0, 0, 0, 0.5);
    left: 50%;
    padding: 3px 0;
    position: absolute;
    transform: translateX(-50%);
    top: 0;
    width: 62px;
    z-index: 2;
  }
}
</style>
