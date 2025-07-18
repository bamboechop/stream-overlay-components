<template>
  <template v-if="streamTogetherChannels.length > 0 && Object.keys(channelImages).length > 0">
    <div class="stream-together-info-box">
      <p class="stream-together-info-box__heading">
        Ich streame gemeinsam mit
      </p>
      <template
        v-for="channel of streamTogetherChannels"
        :key="channel">
        <div class="stream-together-info-box__channel">
          <OtherChannelIndicator
            :channel="channel"
            :channel-image="channelImages[channel]"
            :stream-together-channels="streamTogetherChannels" />
          {{ channel }}
        </div>
      </template>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import OtherChannelIndicator from './OtherChannelIndicator.vue';
import { getUserImageByUserId } from '@/common/helpers/twitch-message.helper';
import { useTwitchStore } from '@/stores/twitch.store';

const twitchStore = useTwitchStore();
const { streamTogetherChannels, streamTogetherChannelIds } = storeToRefs(twitchStore);

const channelImages = ref<{ [username: string]: string }>({});

watch(() => streamTogetherChannelIds.value, async (newValue) => {
  if (Object.keys(newValue).length === 0) {
    return;
  }
  channelImages.value = {};
  const channelImagePromises = streamTogetherChannels.value.map(channel => newValue[channel] && getUserImageByUserId(newValue[channel])).filter(Boolean);

  const resolvedPromises = await Promise.all(channelImagePromises);
  for (let i = 0; i < resolvedPromises.length; i++) {
    channelImages.value[streamTogetherChannels.value[i]] = resolvedPromises[i];
  }
}, { deep: true, immediate: true });
</script>

<style lang="scss" scoped>
@import '@/assets/modern.variables';

.stream-together-info-box {
  background-color: #0e0e10;
  border-bottom-left-radius: $window-frame-border-radius - $window-frame-padding;
  border-bottom-right-radius: $window-frame-border-radius - $window-frame-padding;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 2;

  &__channel {
    align-items: center;
    column-gap: 4px;
    display: grid;
    font-size: 14px;
    grid-template-columns: 24px 1fr;
    justify-items: start;
  }

  &__heading {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    text-align: left;
  }
}
</style>
