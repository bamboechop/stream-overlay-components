import { storeToRefs } from 'pinia';
import { onBeforeUnmount, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { IEventStreamData } from '@/components/media-player/media-player.interface';
import { useTwitchStore } from '@/stores/twitch.store';

export function useTwitchStreamInfo() {
  let eventSource: EventSource | null = null;

  const route = useRoute();

  const store = useTwitchStore();
  const { getChannelInformation } = store;
  const { category } = storeToRefs(store);

  function eventSourceSetup() {
    eventSource = new EventSource(`${import.meta.env.VITE_BAMBBOT_API_URL}/twitch/eventstream`);

    eventSource.addEventListener('channel.update', (event) => {
      const data = JSON.parse(event.data) as IEventStreamData;
      category.value = data.category_name;
    });

    eventSource.onerror = (error) => {
      console.error(error);
      eventSource?.close();
    };
  }

  onMounted(async () => {
    if (route.name === 'Coworking Component') {
      eventSourceSetup();
    }
    await getChannelInformation();
  });

  onBeforeUnmount(() => {
    if (eventSource) {
      eventSource.close();
    }
  });
}
