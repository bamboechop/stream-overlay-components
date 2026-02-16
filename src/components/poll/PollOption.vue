<template>
  <div
    class="poll-window__option"
    :class="{ 'poll-window__option--winner': isWinner }">
    <h2 class="poll-window__option-title">
      {{ choice.title }}
    </h2>
    <div class="poll-window__option-bottom">
      <span class="poll-window__option-votes">
        {{ displayedVotes }} {{ voteText }}
      </span>
      <span class="poll-window__option-percent">
        {{ displayedPercent }}%
      </span>
    </div>
    <div class="poll-window__option-bar-bg">
      <div
        class="poll-window__option-bar-fill"
        :style="{ width: `${displayedPercentBar}%` }"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { TwitchEventSubNotificationChannelPollChoiceDto } from '@/common/interfaces/event-stream.interface';

defineProps<{
  choice: TwitchEventSubNotificationChannelPollChoiceDto;
  displayedVotes: number;
  displayedPercent: number;
  displayedPercentBar: number;
  isWinner: boolean;
  voteText: string;
}>();
</script>

<style lang="scss" scoped>
.poll-window__option {
  background-color: rgba(0,0,0,0.15);
  border-radius: 12px;
  border: 2px solid rgba(255,255,255,0.2);
  box-shadow: 0 0 24px 4px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: 12px 16px;
  position: relative;
  transition: border-color 0.5s, flex-grow 0.5s, opacity 0.5s, padding 0.5s;
  z-index: 1;
}

.poll-window__option--winner {
  background: linear-gradient(90deg, rgba(255,215,90,0.10) 0%, rgba(255,215,90,0.18) 100%), rgba(0,0,0,0.15);
  box-shadow: 0 0 16px 2px rgba(255,215,90,0.18);
  border-color: #ffd700;

  .poll-window__option-title {
    color: #ffd700;
    text-shadow: 0 1px 4px rgba(255,215,90,0.25);
  }

  .poll-window__option-percent {
    color: #ffd700;
  }

  .poll-window__option-bar-fill {
    background-color: rgba(255, 215, 0, 0.15);
  }
}

.poll-window__option-bar-bg {
  background-color: rgba(255,255,255,0.08);
  border-radius: 10px;
  bottom: 0;
  left: 0;
  overflow: hidden;
  position: absolute;
  right: 0;
  top: 0;
  z-index: -1;
}

.poll-window__option-bar-fill {
  background-color: #0c0d38;
  border-radius: 10px 0 0 10px;
  bottom: 0;
  left: 0;
  opacity: 0.7;
  position: absolute;
  top: 0;
  transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
}

.poll-window__option-bottom {
  align-items: end;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.poll-window__option-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.25;
  margin: 0;
}
</style>
