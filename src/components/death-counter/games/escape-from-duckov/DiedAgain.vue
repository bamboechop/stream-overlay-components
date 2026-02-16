<template>
  <div class="died-again">
    <BadgeQuestionMark class="died-again__icon" :size="25" />
    <span class="died-again__text">
      Erneut gestorben?
    </span>
  </div>
</template>

<script setup lang="ts">
import { BadgeQuestionMark } from 'lucide-vue-next';

</script>

<style lang="scss" scoped>
.died-again {
  align-items: center;
  animation: scale 60s infinite;
  background-color: #21a0c3;
  border-radius: 16px;
  color: #fff;
  display: flex;
  font-family: 'Round Corner Font Regular';
  font-size: 22px;
  gap: 5px;
  isolation: isolate;
  line-height: 1;
  padding: 6px 12px 7px 8px;
  position: absolute;
  right: 248px;
  top: 113px;
  transform-origin: center center;
  will-change: transform;
  z-index: 1;

  &__icon {
    filter: drop-shadow(1.5px 1.5px 0 rgba(0, 0, 0, .25));
  }
  
  &__text {
    padding-top: 4px;
    text-shadow: 1.5px 1.5px 0 rgba(0, 0, 0, .25);
    width: 147px;
  }
}

@keyframes scale {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.025);
  }
  50% {
    transform: scale(0.975);
  }
  75% {
    transform: scale(1.025);
  }
}
</style>
