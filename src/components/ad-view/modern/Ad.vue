<template>
  <WindowFrame
    class="ad-window"
    :class="{ 'ad-window--visible': diffInSeconds < 10 * 60 && diffInSeconds >= 0 }"
    :style="adProgress !== null ? { '--duration': `${duration}s` } : {}">
    <div class="ad">
      <span class="ad__text">
        <template v-if="diffInSeconds > 0">
          Nächste geplante Werbepause in
        </template>
      </span>
      <span class="ad__time">
        {{ remainingTime }}
      </span>
    </div>
  </WindowFrame>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import WindowFrame from '@/components/desktop/WindowFrame.vue';
import { useTwitchStore } from '@/stores/twitch.store';
import { useStreamStatusStore } from '@/stores/stream-status.store';
import { useEventStreamComposable } from '@/composables/event-stream.composable';
import type { IEventStreamAdBreakBeginData } from '@/common/interfaces/event-stream.interface';

const streamStatusStore = useStreamStatusStore();
const { live } = storeToRefs(streamStatusStore);

const twitchStore = useTwitchStore();
const { adSchedule } = storeToRefs(twitchStore);
const { getAdSchedule } = twitchStore;

const diffInSeconds = ref(-1);
const remainingTime = ref('');
const adProgress = ref<number | null>(null);
const duration = ref<number>(0);

let adScheduleFetchInterval = 0;

function clearAdScheduleInterval() {
  if (adScheduleFetchInterval !== 0) {
    window.clearInterval(adScheduleFetchInterval);
    adScheduleFetchInterval = 0;
  }
}

function updateRemainingTime() {
  if (!adSchedule.value) {
    return;
  }
  const now = new Date();
  diffInSeconds.value = Math.max(0, Math.floor((adSchedule.value.nextTime - now.getTime()) / 1000));
  if (diffInSeconds.value === 0) {
    clearAdScheduleInterval();
  }

  const minutes = Math.floor(diffInSeconds.value / 60);
  const seconds = diffInSeconds.value % 60;
  const displaySeconds = minutes > 0 ? seconds.toString(10).padStart(2, '0') : seconds;

  if (minutes > 1) {
    remainingTime.value = `${minutes} Minuten und ${displaySeconds} Sekunden`;
  } else if (minutes === 1) {
    remainingTime.value = `${minutes} Minute und ${displaySeconds} Sekunden`;
  } else if (seconds > 1) {
    remainingTime.value = `${displaySeconds} Sekunden`;
  } else if (seconds === 1) {
    remainingTime.value = `${displaySeconds} Sekunde`;
  } else {
    remainingTime.value = 'Werbung beginnt jeden Moment.';
  }
}

watch(() => adSchedule.value, (newValue) => {
  clearAdScheduleInterval();
  adProgress.value = null;

  // check if newValue doesn't exist or if nextTime is a date in the past
  if (!newValue || newValue.nextTime < new Date().getTime()) {
    return;
  }

  updateRemainingTime();
  adScheduleFetchInterval = window.setInterval(updateRemainingTime, 1000);
});

watch(live, (newValue) => {
  if (!newValue) {
    clearAdScheduleInterval();
  }
});

const { on } = useEventStreamComposable();

onMounted(async () => {
  on<IEventStreamAdBreakBeginData>('channel.ad_break.begin', (data) => {
    diffInSeconds.value = 0;
    clearAdScheduleInterval();
    remainingTime.value = 'Werbung läuft, bis gleich.';

    // Initialize progress bar
    adProgress.value = 100;
    duration.value = data.duration_seconds;

    window.setTimeout(() => {
      diffInSeconds.value = -1;
      adProgress.value = null;
    }, data.duration_seconds * 1000);

    window.setTimeout(async () => {
      await getAdSchedule();
    }, (data.duration_seconds + 30) * 1000);
  });
});

onBeforeUnmount(() => {
  clearAdScheduleInterval();
});
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

@keyframes decreaseWidth {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.ad {
  align-items: center;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  padding: 4px;
  padding: $window-frame-padding * 2 $window-frame-padding * 4;

  &__text {
    font-size: 14px;
  }

  &__time {
    font-size: 20px;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
  }
}

.ad-window {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  bottom: -105%;
  position: fixed;
  right: 0;
  transition: bottom .5s ease-in-out;
  width: max-content;

  &::before {
    animation: none;
    background-color: #040079;
    bottom: 0;
    content: '';
    left: 0;
    opacity: 0.5;
    position: absolute;
    right: 0;
    top: 0;
    transform-origin: left;
    width: 100%;
    z-index: -1;
  }

  &[style*="--duration"] {
    &::before {
      animation: decreaseWidth var(--duration) linear forwards;
      will-change: transform;
    }
  }
}

.ad-window--visible {
  bottom: 0;
}
</style>
