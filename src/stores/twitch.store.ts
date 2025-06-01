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

const streamTogetherChannels = ref<{ id: string | null; name: string }[]>([]);
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
    const response = await axios.get(`https://api.twitch.tv/helix/channels/ads?broadcaster_id=${import.meta.env.VITE_TWITCH_BROADCASTER_ID}`, {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Client-Id': import.meta.env.VITE_TWITCH_CLIENT_ID,
      },
    });
    if (response.status !== 200) {
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
      return;
    }
    adScheduleRetryCount = 0;
    const [information] = response.data.data;
    adSchedule.value = {
      duration: information.duration,
      nextTime: information.next_ad_at * 1000,
    };
  };

  const processStreamTogetherChannels = (title: string) => {
    streamTogetherChannels.value = (title?.match(/@\w+/g) || []).map((username: string) => ({ id: null, name: username.substring(1) }));
  };

  const getChannelInformation = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BAMBBOT_API_URL}/twitch/channel-information`);
    const { data } = response;
    if (data) {
      category.value = data.game_name;
      processStreamTogetherChannels(data.title);
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
