<template>
  <div class="escape-from-duckov-death-counter">
    <img alt="" class="escape-from-duckov-death-counter__image" src="/death-counter/escape-from-duckov.png" />
    <div class="escape-from-duckov-death-counter__count">
      <Skull class="escape-from-duckov-death-counter__icon" :size="44" />
      <span class="escape-from-duckov-death-counter__text">
        Guenther starb bislang <span class="escape-from-duckov-death-counter__text-number">{{ count }}</span> Mal
      </span>
    </div>
    <DiedAgain />
    <Command />
  </div>
</template>

<script lang="ts" setup>
import { Skull } from 'lucide-vue-next';
import Command from './escape-from-duckov/Command.vue';
import DiedAgain from './escape-from-duckov/DiedAgain.vue';

defineProps<{ count: number }>();
</script>

<style lang="scss" scoped>
.escape-from-duckov-death-counter {
  display: flex;
  justify-content: end;
  position: relative;

  &__count {
    align-items: center;
    background-color: #f85566;
    border-radius: 29px;
    bottom: 0;
    color: #fff;
    display: flex;
    font-family: 'Round Corner Font Regular';
    font-size: 37px;
    gap: 11px;
    line-height: 1;
    padding: 13px 27px 13px 17px;
    position: absolute;
    right: 0;
  }

  &__icon {
    filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .25));
  }

  &__image {
    border-bottom-left-radius: 66px;
    border-bottom-right-radius: 66px;
    margin-right: 11px;
    height: 276px;
  }

  &__text {
    padding-top: 10px;
    text-shadow: 3px 3px 0 rgba(0, 0, 0, .25);
  }

  &__text-number {
    position: relative;

    &::after {
      background: #fff;
      border-radius: 9999px;
      bottom: 0;
      box-shadow: 3px 3px 0 rgba(0, 0, 0, .25);
      content: '';
      height: 4px;
      left: 0;
      opacity: .8;
      position: absolute;
      width: 100%;
    }
  }
}
</style>
