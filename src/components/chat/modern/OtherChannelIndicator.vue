<template>
  <img
    :alt="channel"
    class="other-channel-indicator"
    :src="channelImage" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getStreamTogetherColor } from '@/common/helpers/twitch-message.helper';
import { useSearchParamsComposable } from '@/composables/search-params-composable.composable';
import { broadcasterInfo } from '@/composables/twitch-chat.composable';

const props = defineProps<{
  channel: string;
  channelImage: string;
}>();

const { streamTogetherChannels } = useSearchParamsComposable();

const channelBorderColor = ref<string>('');

if (props.channel !== broadcasterInfo.name) {
  channelBorderColor.value = getStreamTogetherColor(props.channel, streamTogetherChannels);
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
