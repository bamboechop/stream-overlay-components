<template>
  <div class="program-bottom-bar">
    <div class="program-bottom-bar__left"></div>
    <div class="program-bottom-bar__right">
      <!-- TODO make the div a textarea and figure out why it receives a huge padding all around the default value -->
      <template v-if="showViewers">
        {{ viewers }} Zuseher
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTwitchStore } from '@/stores/twitch.store';

withDefaults(defineProps<{ showViewers?: boolean }>(), { showViewers: false });

const store = useTwitchStore();
const { viewers } = storeToRefs(store);
</script>

<style lang="scss" scoped>
.program-bottom-bar {
  display: grid;
  grid-template-columns: 40% 60%;

  &__left,
  &__right {
    align-items: center;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #7f7f7f;
    border-right: 1px solid #fff;
    border-top: 1px solid #7f7f7f;
    color: #000;
    display: flex;
    padding: 0 5px;
  }
}
</style>
