<template>
  <section
    class="timer-view"
    :class="{ 'timer-view--visible': totalSeconds > 0 }">
    <Timer
      ref="timerElement"
      :total-seconds />
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Timer from '@/components/timer/Timer.vue';
import { useEventStreamComposable } from '@/composables/event-stream.composable';

const { on } = useEventStreamComposable();

const totalSeconds = ref(0);

const timerElement = ref<InstanceType<typeof Timer>>();

onMounted(() => {
  on('overlay.timer.add', (value: number) => {
    totalSeconds.value += value;
  });

  on('overlay.timer.pause', () => {
    timerElement.value?.pause();
  });

  on('overlay.timer.reset', () => {
    timerElement.value?.pause();
    totalSeconds.value = 0;
  });

  on('overlay.timer.start', () => {
    timerElement.value?.start();
  });
});
</script>

<style lang="scss" scoped>
.timer-view {
  background-color: rgba(0, 0, 0, 0.5);
  border-bottom-left-radius: 16px;
  border-top-left-radius: 16px;
  margin-left: auto;
  opacity: 0;
  padding: 16px;
  pointer-events: none;
  transition: opacity 0.3s ease-in-out;
  user-select: none;
  width: max-content;

  &--visible {
    opacity: 1;
  }
}
</style>
