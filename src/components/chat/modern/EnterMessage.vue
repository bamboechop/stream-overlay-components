<template>
  <div class="enter-message">
    <span class="enter-message__text">Nachricht <template v-if="viewers > 0">an {{ viewers }} Person<template v-if="viewers !== 1">en</template></template> schreiben</span>
    <SendHorizontal
      class="enter-message__icon"
      :size="18" />
  </div>
</template>

<script lang="ts" setup>
import { SendHorizontal } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { useTwitchStore } from '@/stores/twitch.store';

const store = useTwitchStore();
const { viewers } = storeToRefs(store);
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.enter-message {
  align-items: center;
  background-color: rgba(14, 14, 16, 0.5);
  border-radius: $window-frame-border-radius - $window-frame-padding;
  column-gap: 4px;
  display: grid;
  font-size: 14px;
  grid-template-columns: 1fr 18px;
  justify-content: space-between;
  padding: 8px;

  &__text {
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
