<template>
  <WindowFrame
    :active="active"
    class="schedule-window"
    title="Streamplan">
    <div class="schedule">
      <img
        alt="Streamplan"
        class="schedule-image"
        src="https://bamboechop.at/schedule.png" />
    </div>
  </WindowFrame>
</template>

<script lang="ts" setup>
import WindowFrame from '@/components/desktop/WindowFrame.vue';

defineProps<{ active?: boolean }>();
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.schedule {
  background-color: #0e0e10;
  border-radius: $window-frame-border-radius - $window-frame-padding;
  color: #fff;
}

.schedule-window {
  width: max-content;
}
</style>
