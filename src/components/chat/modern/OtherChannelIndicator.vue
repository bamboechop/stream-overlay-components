<template>
  <img
    :alt="channel"
    class="other-channel-indicator"
    :src="channelImage" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getStreamTogetherColor } from '@/common/helpers/twitch-message.helper';
import { broadcasterInfo } from '@/composables/twitch-chat.composable';

const props = defineProps<{
  channel: string;
  channelImage: string;
  streamTogetherChannels: string[];
}>();

const channelBorderColor = ref<string>('');

if (props.channel !== broadcasterInfo.name) {
  channelBorderColor.value = getStreamTogetherColor(props.channel, props.streamTogetherChannels);
}
</script>

<style lang="scss" scoped>
.other-channel-indicator {
  border-radius: 9999px;
  border: 2px solid v-bind(channelBorderColor);
  height: 24px;
  padding: 1px;
  width: 24px;
}
</style>
