import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useEventStreamComposable } from './event-stream.composable';
import { useTwitchStore } from '@/stores/twitch.store';
import type { IEventStreamChannelUpdateData } from '@/common/interfaces/event-stream.interface';

export function useTwitchStreamInfoComposable() {
  const twitchStore = useTwitchStore();
  const { category } = storeToRefs(twitchStore);
  const { getChannelInformation } = twitchStore;
  const { on } = useEventStreamComposable();

  onMounted(async () => {
    try {
      await getChannelInformation();

      on<IEventStreamChannelUpdateData>('channel.update', (data) => {
        category.value = data.category_name;
      });
    } catch (err) {
      console.error('Failed to get channel information:', err);
    }
  });
}
