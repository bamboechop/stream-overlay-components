import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEventStreamComposable } from './event-stream.composable';
import { useTwitchChat } from './twitch-chat.composable';
import { useTwitchStore } from '@/stores/twitch.store';
import type { IEventStreamChannelUpdateData } from '@/common/interfaces/event-stream.interface';

function areChannelsEqual(a: string[], b: string[]) {
  if (a.length !== b.length) {
    return false;
  }
  return a.every(channelA => b.includes(channelA));
}

export function useTwitchStreamInfoComposable() {
  const { initChat } = useTwitchChat();

  const twitchStore = useTwitchStore();
  const { category, streamTogetherChannels } = storeToRefs(twitchStore);
  const { getChannelInformation, processStreamTogetherChannels } = twitchStore;
  const { on } = useEventStreamComposable();

  onMounted(async () => {
    try {
      await getChannelInformation();

      on<IEventStreamChannelUpdateData>('channel.update', async (data) => {
        category.value = data.category_name;
        const previousStreamTogetherChannels = streamTogetherChannels.value.map(channel => channel);
        processStreamTogetherChannels(data.title);
        if (!areChannelsEqual(previousStreamTogetherChannels, streamTogetherChannels.value)) {
          await initChat();
        }
      });
    } catch (err) {
      console.error('Failed to get channel information:', err);
    }
  });
}
