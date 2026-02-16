<template>
  <div class="command">
    <CircleAlert class="command__icon" :size="30" />
    <span class="command__text">
      <span class="command__highlight">!tot</span> in den Chat
    </span>
  </div>
</template>

<script setup lang="ts">
import { CircleAlert } from 'lucide-vue-next';

</script>

<style lang="scss" scoped>
.command {
  align-items: center;
  animation: scale 90s infinite;
  background-color: #6dc54b;
  border-radius: 21px;
  color: #fff;
  display: flex;
  font-family: 'Round Corner Font Regular';
  font-size: 26px;
  gap: 8px;
  line-height: 1;
  padding: 10px 18px 10px 12px;
  position: absolute;
  right: 268px;
  top: 148px;
  transform-origin: center center;
  will-change: transform;

  &__icon {
    filter: drop-shadow(2px 2px 0 rgba(0, 0, 0, .25));
  }

  &__highlight {
    position: relative;

    &::after {
      background: #fff;
      border-radius: 9999px;
      bottom: -1px;
      box-shadow: 2px 2px 0 rgba(0, 0, 0, .25);
      content: '';
      height: 3px;
      left: 0;
      opacity: .8;
      position: absolute;
      width: 100%;
    }
  }
  
  &__text {
    text-shadow: 2px 2px 0 rgba(0, 0, 0, .25);
    width: 137px;
  }
}

@keyframes scale {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.9625);
  }
  50% {
    transform: scale(1.0375);
  }
  75% {
    transform: scale(0.9625);
  }
}
</style>
