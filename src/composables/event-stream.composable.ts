import { onBeforeUnmount, onMounted } from 'vue';
import type { IEventStreamAdBreakBeginData, IEventStreamChannelPointsAutomaticRewardRedemptionAddData, IEventStreamChannelUpdateData } from '@/common/interfaces/event-stream.interface';

const eventBus = new EventTarget();
let eventSource: EventSource | null = null;
const addedEventListeners = new Set<string>();
let isSetupComplete = false;

export function useEventStreamComposable() {
  function addEventSourceListener(eventName: string, handler: (event: MessageEvent) => void) {
    if (!eventSource || addedEventListeners.has(eventName)) {
      return;
    }
    eventSource.addEventListener(eventName, handler);
    addedEventListeners.add(eventName);
  }

  function eventSourceSetup() {
    if (eventSource) {
      return;
    }

    eventSource = new EventSource(`${import.meta.env.VITE_BAMBBOT_API_URL}/twitch/eventstream`);

    // Set up core event listeners
    addEventSourceListener('channel.update', (event) => {
      const detail = JSON.parse(event.data) as IEventStreamChannelUpdateData;
      eventBus.dispatchEvent(new CustomEvent('channel.update', { detail }));
    });

    addEventSourceListener('channel.ad_break.begin', (event) => {
      const detail = JSON.parse(event.data) as IEventStreamAdBreakBeginData;
      eventBus.dispatchEvent(new CustomEvent('channel.ad_break.begin', { detail }));
    });

    addEventSourceListener('channel.channel_points_automatic_reward_redemption.add', (event) => {
      const detail = JSON.parse(event.data) as IEventStreamChannelPointsAutomaticRewardRedemptionAddData;
      eventBus.dispatchEvent(new CustomEvent('channel.channel_points_automatic_reward_redemption.add', { detail }));
    });

    eventSource.onerror = (error) => {
      console.error(error);
      console.error('EventSource failed.');
      eventSource?.close();
      addedEventListeners.clear();
    };
  }

  // Only set up the lifecycle hooks once
  if (!isSetupComplete) {
    isSetupComplete = true;

    onMounted(() => {
      eventSourceSetup();
    });

    onBeforeUnmount(() => {
      eventSource?.close();
      addedEventListeners.clear();
      isSetupComplete = false;
    });
  }

  return {
    on: <T>(event: string, callback: (data: T) => void) => {
      const listener = ((e: CustomEvent<T>) => callback(e.detail)) as EventListener;
      eventBus.addEventListener(event, listener);
      return () => eventBus.removeEventListener(event, listener);
    },
    off: (event: string, callback: EventListener) => {
      eventBus.removeEventListener(event, callback);
    },
  };
}
