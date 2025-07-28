import { defineStore } from 'pinia';
import { ref } from 'vue';
import { resubDummy } from '@data/resub.data';
import { subscriptionDummy } from '@data/subscription.data';
import { subgiftDummy } from '@data/subgift.data';
import { actionDummy } from '@data/action.data';
import { chatDummy } from '@data/chat.data';
import { raidDummy } from '@data/raid.data';
import axios from 'axios';
import { useLocalStorage } from '@vueuse/core';
import type { TMessage } from '@/common/types/index.type';
import { getUserIdByUserName } from '@/common/helpers/twitch-message.helper';
import { RequestCache } from '@/services/request-cache.service';

const streamTogetherChannels = ref<string[]>([]);
const streamTogetherChannelIds = ref<{ [channel: string]: string }>({});
const token = useLocalStorage<string>('twitch-token', null);

export const useTwitchStore = defineStore('Twitch Store', () => {
  const adSchedule = ref<{ duration: number; nextTime: number } | null>(null);
  const category = ref('Media Player');
  const messages = ref<TMessage[]>([]);
  const viewers = ref(0);

  const addDebugMessages = () => {
    messages.value.push(resubDummy, subscriptionDummy, subgiftDummy, actionDummy, ...chatDummy, raidDummy);
  };

  const addMessage = (message: TMessage) => {
    messages.value.push(message);
  };

  const clearMessages = (channel: string) => {
    messages.value = messages.value.filter(message => message.channel !== channel);
  };

  const removeMessageByMessageId = (id: string) => {
    messages.value = messages.value.filter((message) => {
      if (!('id' in message)) {
        return message;
      }
      return message.id !== id;
    });
  };

  const removeMessagesByUserId = (userId: string) => {
    messages.value = messages.value.filter((message) => {
      if (!('userId' in message)) {
        return message;
      }
      return message.userId !== userId;
    });
  };

  let adScheduleRetryCount = 0;
  const getAdSchedule = async () => {
    try {
      const data = await RequestCache.request(`https://api.twitch.tv/helix/channels/ads?broadcaster_id=${import.meta.env.VITE_TWITCH_BROADCASTER_ID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Client-Id': import.meta.env.VITE_TWITCH_CLIENT_ID,
        },
      }, 10);

      adScheduleRetryCount = 0;
      const [information] = data.data;
      adSchedule.value = {
        duration: information.duration,
        nextTime: information.next_ad_at * 1000,
      };
    } catch (error) {
      // If another instance recently made this request, silently skip
      if (error instanceof Error && error.message === 'REQUEST_RECENTLY_MADE_BY_OTHER_INSTANCE') {
        return;
      }

      // Handle HTTP errors with retry logic
      adSchedule.value = null;
      if (adScheduleRetryCount < 5) {
        adScheduleRetryCount++;
        window.setTimeout(async () => {
          await getAdSchedule();
        }, 5000); // try again in 5 seconds
      } else if (adScheduleRetryCount === 5) {
        // eslint-disable-next-line no-alert
        window.alert('Ad Schedule fetching failed five times!');
      }
    }
  };

  const processStreamTogetherChannels = async (title: string) => {
    streamTogetherChannels.value = (title?.match(/@\w+/g) || []).map((username: string) => username.substring(1));
    streamTogetherChannelIds.value = {};
    for (const channel of streamTogetherChannels.value) {
      const channelId = await getUserIdByUserName(channel);
      if (channelId) {
        streamTogetherChannelIds.value[channel] = channelId;
      }
    }
  };

  const getChannelInformation = async () => {
    try {
      const data = await RequestCache.request(`${import.meta.env.VITE_BAMBBOT_API_URL}/twitch/channel-information`, {
        method: 'GET',
      }, 10);

      if (data) {
        category.value = data.game_name;
        processStreamTogetherChannels(data.title);
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'REQUEST_RECENTLY_MADE_BY_OTHER_INSTANCE') {
        return;
      }
      throw error;
    }
  };

  const updateViewerCount = async (name: string) => {
    const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${name}`);
    viewers.value = response.data.data?.[0]?.viewer_count ?? 0;
  };

  return {
    adSchedule,
    category,
    messages,
    streamTogetherChannels,
    streamTogetherChannelIds,
    viewers,
    addMessage,
    addDebugMessages,
    clearMessages,
    getAdSchedule,
    getChannelInformation,
    processStreamTogetherChannels,
    removeMessageByMessageId,
    removeMessagesByUserId,
    updateViewerCount,
  };
}, {
  share: {
    enable: false,
  },
});
