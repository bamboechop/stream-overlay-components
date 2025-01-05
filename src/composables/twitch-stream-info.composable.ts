import { storeToRefs } from 'pinia';
import { onBeforeUnmount, onMounted } from 'vue';
import { useTwitchStore } from '@/stores/twitch.store';
import { useEventStreamStore } from '@/stores/event-stream.store';
import type { IEventStreamChannelUpdateData } from '@/common/interfaces/event-stream.interface';

export function useTwitchStreamInfo() {
  const eventStreamStore = useEventStreamStore();
  const { eventSource } = storeToRefs(eventStreamStore);

  const store = useTwitchStore();
  const { getChannelInformation } = store;
  const { category } = storeToRefs(store);

  function eventSourceSetup() {
    eventSource.value = new EventSource(`${import.meta.env.VITE_BAMBBOT_API_URL}/twitch/eventstream`);

    eventSource.value.addEventListener('channel.update', (event) => {
      const data = JSON.parse(event.data) as IEventStreamChannelUpdateData;
      category.value = data.category_name;
    });

    eventSource.value.onerror = (error) => {
      console.error(error);
      eventSource.value?.close();
    };
  }

  onMounted(async () => {
    eventSourceSetup();
    await getChannelInformation();
  });

  onBeforeUnmount(() => {
    if (eventSource.value) {
      eventSource.value.close();
    }
  });
}
