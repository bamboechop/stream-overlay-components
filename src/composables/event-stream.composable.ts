import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { IEventStreamAdBreakBeginData, IEventStreamChannelPointsAutomaticRewardRedemptionAddData, IEventStreamChannelUpdateData } from '@/common/interfaces/event-stream.interface';

const eventBus = new EventTarget();
let eventSource: EventSource | null = null;
const eventListeners = new Map<string, (event: MessageEvent) => void>();
let isSetupComplete = false;
let reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null;
const isConnecting = ref(false);
const reconnectDelay = 5000;
const maxReconnectAttempts = 5;
let reconnectAttempts = 0;

export function useEventStreamComposable() {
  function removeAllEventSourceListeners() {
    if (!eventSource) {
      return;
    }
    eventListeners.forEach((handler, eventName) => {
      eventSource?.removeEventListener(eventName, handler);
    });
    eventListeners.clear();
  }

  function addEventSourceListener(eventName: string, handler: (event: MessageEvent) => void) {
    if (!eventSource || eventListeners.has(eventName)) {
      return;
    }
    eventSource.addEventListener(eventName, handler);
    eventListeners.set(eventName, handler);
  }

  function scheduleReconnect() {
    if (reconnectTimeoutId) {
      clearTimeout(reconnectTimeoutId);
    }
    isConnecting.value = false;

    if (reconnectAttempts >= maxReconnectAttempts) {
      // eslint-disable-next-line no-alert
      window.alert('Connection to the event stream failed five times!');
      reconnectAttempts = 0;
      return;
    }

    reconnectTimeoutId = setTimeout(() => {
      reconnectTimeoutId = null;
      eventSourceSetup();
    }, reconnectDelay);
  }

  function eventSourceSetup() {
    if ((eventSource && eventSource.readyState !== EventSource.CLOSED) || isConnecting.value || reconnectTimeoutId) {
      return;
    }

    isConnecting.value = true;

    removeAllEventSourceListeners();
    eventSource?.close();

    try {
      eventSource = new EventSource(`${import.meta.env.VITE_BAMBBOT_API_URL}/twitch/eventstream`);
      isConnecting.value = false;

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

      eventSource.onopen = () => {
        isConnecting.value = false;
        reconnectAttempts = 0;
      };

      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        removeAllEventSourceListeners();
        eventSource?.close();
        eventSource = null;
        reconnectAttempts++;
        scheduleReconnect();
      };
    } catch (error) {
      console.error('Failed to create EventSource:', error);
      eventSource = null;
      isConnecting.value = false;
      reconnectAttempts++;
      scheduleReconnect();
    }
  }

  if (!isSetupComplete) {
    isSetupComplete = true;

    onMounted(() => {
      eventSourceSetup();
    });

    onBeforeUnmount(() => {
      if (reconnectTimeoutId) {
        clearTimeout(reconnectTimeoutId);
        reconnectTimeoutId = null;
      }
      removeAllEventSourceListeners();
      eventSource?.close();
      eventSource = null;
      isSetupComplete = false;
      isConnecting.value = false;
      reconnectAttempts = 0;
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
    isConnecting,
  };
}
