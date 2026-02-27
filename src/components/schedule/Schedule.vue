<template>
  <WindowFrame
    :active="active"
    class="schedule-window"
    :icon-path="programInformation['schedule'].iconPath"
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
import { useProgramInformationComposable } from '@/composables/program-information.composable';

defineProps<{ active?: boolean }>();

const { programInformation } = useProgramInformationComposable();
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.schedule {
  background-color: #0e0e10;
  border-radius: $window-frame-border-radius - $window-frame-padding;
  color: #fff;
  padding-top: 39px;
}

.schedule-image {
  border-radius: $window-frame-border-radius - $window-frame-padding;
  display: block;
  zoom: 0.375;
}

.schedule-window {
  width: max-content;
}
</style>
