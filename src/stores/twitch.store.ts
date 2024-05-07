import { defineStore } from 'pinia';
import { ref } from 'vue';
import { resubDummy } from '@data/resub.data';
import { subscriptionDummy } from '@data/subscription.data';
import { subgiftDummy } from '@data/subgift.data';
import { actionDummy } from '@data/action.data';
import { chatDummy } from '@data/chat.data';
import { raidDummy } from '@data/raid.data';
import axios from 'axios';
import type { TMessage } from '@/common/types/index.type';

export const useTwitchStore = defineStore('Twitch Store', () => {
  const messages = ref<TMessage[]>([]);
  const category = ref('Media Player');
  const viewers = ref(0);

  const addDebugMessages = () => {
    messages.value.push(resubDummy, subscriptionDummy, subgiftDummy, actionDummy, ...chatDummy, raidDummy);
  };

  const addMessage = (message: TMessage) => {
    messages.value.push(message);
  };

  const clearMessages = () => {
    messages.value = [];
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

  const getChannelInformation = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BAMBBOT_API_TWITCH_URL}/channel-information`);
    const { data } = response;
    if (data) {
      category.value = data.game_name;
    }
  };

  const updateViewerCount = async (name: string) => {
    const response = await axios.get(`https://api.twitch.tv/helix/streams?user_login=${name}`);
    viewers.value = response.data.data?.[0]?.viewer_count ?? 0;
  };

  return {
    category,
    messages,
    viewers,
    addMessage,
    addDebugMessages,
    clearMessages,
    getChannelInformation,
    removeMessageByMessageId,
    removeMessagesByUserId,
    updateViewerCount,
  };
});
