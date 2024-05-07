import { onMounted, ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import axios from 'axios';
import type {
  AnonSubMysteryGiftUserstate,
  ChatUserstate,
  DeleteUserstate,
  SubGiftUpgradeUserstate,
  SubGiftUserstate,
  SubMethods,
  SubMysteryGiftUserstate,
  SubUserstate,
  TimeoutUserstate,
} from 'tmi.js';
import {
  client as tmiClient,
} from 'tmi.js';
import { storeToRefs } from 'pinia';
import type {
  IAction,
  IChat,
  IRaid,
  IResub,
  ISubGift,
  ISubscription,
  ITwitchBadgeResponse,
} from '@/common/interfaces/index.interface';
import { getUserIdByUserName, getUserImageByUserId, parsePlan } from '@/common/helpers/twitch-message.helper';
import { useTwitchStore } from '@/stores/twitch.store';
import type { TTheme } from '@/common/types/index.type';
import { useSearchParamsComposable } from '@/composables/theme.composable';

export async function useTwitchChat(theme?: TTheme) {
  const broadcaster = {
    id: import.meta.env.VITE_TWITCH_BROADCASTER_ID,
    name: import.meta.env.VITE_TWITCH_BROADCASTER_NAME,
  };

  const { debug, messageDebug } = useSearchParamsComposable();

  const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_TWITCH_REDIRECT_URI;

  const loading = ref(true);

  let userImage = 'https://placebacon.net/40/40';

  const store = useTwitchStore();
  const { viewers } = storeToRefs(store);
  const {
    addMessage,
    addDebugMessages,
    clearMessages,
    removeMessageByMessageId,
    removeMessagesByUserId,
    updateViewerCount,
  } = store;
  const token = useLocalStorage<string>('twitch-token', null);

  async function initTwitch(retry = false): Promise<void> {
    try {
      if (!token.value) {
        if (window.location.hash) {
          const queryParams = new URLSearchParams(window.location.hash.split('#')[1]);
          if (queryParams.get('access_token')) {
            token.value = queryParams.get('access_token');
          }
        } else {
          // TODO generate a random string and use it as state param to prevent CSRF
          // https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#implicit-grant-flow
          window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=`;
          return;
        }
      }

      axios.defaults.headers.common = {
        'Authorization': `Bearer ${token.value}`,
        'Client-ID': clientId,
      };

      const [chatBadgesResponse, globalChatBadgesResponse] = await Promise.all([
        axios.get<ITwitchBadgeResponse>(`https://api.twitch.tv/helix/chat/badges?broadcaster_id=${broadcaster.id}`),
        axios.get<ITwitchBadgeResponse>('https://api.twitch.tv/helix/chat/badges/global'),
      ]);

      const availableBadges: Record<string, { description: string; id: string; imageUrl: string; title: string }[]> = {};
      for (const set of [...globalChatBadgesResponse.data.data, ...chatBadgesResponse.data.data]) {
        availableBadges[set.set_id] = [];
        for (const version of set.versions) {
          availableBadges[set.set_id].push({
            description: version.description,
            id: version.id,
            imageUrl: version.image_url_1x,
            title: version.title,
          });
        }
      }

      const channels = [broadcaster.name];
      if (debug) {
        channels.push(import.meta.env.VITE_TWITCH_DEBUG_CHANNEL);
      }
      // eslint-disable-next-line new-cap
      const client = new tmiClient({
        channels,
        options: { debug },
      });

      if (!client) {
        console.error('No client!');
        return;
      }

      await client.connect();

      client.on('action', async (_channel: string, userstate: ChatUserstate, message: string, self: boolean) => {
        if (self) {
          return;
        }
        const {
          badges: userBadges,
          color,
          'display-name': displayName,
          emotes,
          id,
          'msg-id': msgId,
          'tmi-sent-ts': timestamp,
          'user-id': userId,
          username: userName,
        } = userstate;

        if (!userId) {
          return;
        }

        if (theme === 'cities-skylines-ii') {
          userImage = await getUserImageByUserId(userId);
        }

        addMessage({
          availableBadges,
          color,
          displayName,
          emotes,
          id,
          msgId,
          msgType: 'action',
          show: true,
          text: message,
          timestamp: timestamp ? Number.parseInt(timestamp, 10) : undefined,
          userBadges,
          userId,
          userImage,
          userName,
          viewerCount: viewers.value,
        } as IAction);
      });

      client.on('anonsubmysterygift', (_channel: string, numbOfSubs: number, methods: SubMethods, userstate: AnonSubMysteryGiftUserstate) => {
        console.info('anonsubmysterygift', { _channel, numbOfSubs, methods, userstate });
      });

      // test with stesi
      client.on('cheer', async (_channel: string, userstate: ChatUserstate, message: string) => {
        console.info('cheer', { _channel, userstate, message });
      });

      client.on('chat', async (_channel: string, userstate: ChatUserstate, message: string, self: boolean) => {
        if (self) {
          return;
        }

        const {
          badges: userBadges,
          color,
          'display-name': displayName,
          emotes,
          id,
          'msg-id': msgId = undefined,
          'tmi-sent-ts': timestamp,
          'user-id': userId,
          username: userName,
        } = userstate;

        if (!userId) {
          return;
        }

        if (theme === 'cities-skylines-ii') {
          userImage = await getUserImageByUserId(userId);
        }

        addMessage({
          availableBadges,
          color,
          displayName,
          emotes,
          id,
          msgId,
          msgType: 'chat',
          show: true,
          text: message,
          timestamp: timestamp ? Number.parseInt(timestamp, 10) : undefined,
          userBadges,
          userId,
          userImage,
          userName,
          viewerCount: viewers.value,
        } as IChat);
      });

      client.on('clearchat', (_channel: string) => {
        clearMessages();
      });

      client.on('disconnected', (reason: string) => {
        console.info('disconnected', { reason });
        // TODO implement reconnect
        // maybe show a short messages in visual chat as well
        // how about a little "connected to chat" text in the bottom left box of the Windows 95 themes?
      });

      client.on('giftpaidupgrade', (_channel: string, username: string, sender: string, userstate: SubGiftUpgradeUserstate) => {
        console.info('giftpaidupgrade', { _channel, username, sender, userstate });
      });

      client.on('messagedeleted', (_channel: string, _username: string, _deletedMessage: string, userstate: DeleteUserstate) => {
        if (userstate['target-msg-id']) {
          removeMessageByMessageId(userstate['target-msg-id']);
        }
      });

      client.on('raided', async (_channel: string, username: string, viewers: number) => {
        const userId = await getUserIdByUserName(username);
        if (theme === 'cities-skylines-ii') {
          if (userId) {
            userImage = await getUserImageByUserId(userId);
          }
        }

        addMessage({
          msgType: 'raid',
          show: true,
          timestamp: Date.now(),
          userId,
          userImage,
          userName: username,
          viewerCount: viewers,
        } as IRaid);
      });

      client.on('resub', async (_channel: string, _username: string, months: number, message: string, userstate: SubUserstate, _methods: SubMethods) => {
        const {
          color,
          'display-name': displayName,
          emotes,
          id,
          'msg-id': msgId,
          'msg-param-cumulative-months': subCumulativeMonthsString,
          'msg-param-sub-plan': subPlanString,
          'tmi-sent-ts': timestamp,
          'user-id': userId,
          username: userName,
        } = userstate;

        if (!userId) {
          return;
        }

        if (theme === 'cities-skylines-ii') {
          userImage = await getUserImageByUserId(userId);
        }

        addMessage({
          color,
          cumulativeMonths: Number.parseInt(subCumulativeMonthsString as string, 10),
          displayName,
          emotes,
          id,
          months,
          msgId,
          msgType: 'resub',
          plan: parsePlan(subPlanString),
          show: true,
          text: message,
          timestamp: timestamp ? Number.parseInt(timestamp, 10) : undefined,
          userId,
          userImage,
          userName,
          viewerCount: viewers.value,
        } as IResub);
      });

      client.on('subgift', async (_channel: string, _username: string, _streakMonths: number, _recipient: string, _methods: SubMethods, userstate: SubGiftUserstate) => {
        const {
          'display-name': senderDisplayName,
          id,
          'login': senderUserName,
          'msg-id': msgId,
          'msg-param-sub-plan': subPlanString,
          'msg-param-recipient-display-name': recipientDisplayName,
          'msg-param-recipient-id': recipientId,
          'msg-param-recipient-user-name': recipientUserName,
          'tmi-sent-ts': timestamp,
          'user-id': senderId,
        } = userstate;

        if (!recipientId || !senderId) {
          return;
        }

        let recipientImage, senderImage;
        if (theme === 'cities-skylines-ii') {
          [recipientImage, senderImage] = await Promise.all([
            getUserImageByUserId(recipientId),
            getUserImageByUserId(senderId),
          ]);
        }

        addMessage({
          id,
          msgId,
          msgType: 'subgift',
          recipient: {
            displayName: recipientDisplayName,
            id: recipientId,
            image: recipientImage ?? userImage,
            userName: recipientUserName,
          },
          sender: {
            displayName: senderDisplayName,
            id: senderId,
            image: senderImage ?? userImage,
            userName: senderUserName,
          },
          show: true,
          plan: parsePlan(subPlanString),
          timestamp: timestamp ? Number.parseInt(timestamp, 10) : undefined,
          viewerCount: viewers.value,
        } as ISubGift);
      });

      client.on('submysterygift', (_channel: string, username: string, numbOfSubs: number, methods: SubMethods, userstate: SubMysteryGiftUserstate) => {
        console.info('submysterygift', { _channel, username, numbOfSubs, userstate, methods });
        /*
         * userstate["msg-param-sender-count"]: Boolean or String - The total numbers of giftsubs username has given in channel
         */
      });

      client.on('subscription', async (_channel: string, _username: string, _methods: SubMethods, _message: string, userstate: SubUserstate) => {
        const {
          color,
          'display-name': displayName,
          emotes,
          id,
          'msg-id': msgId,
          'msg-param-cumulative-months': subCumulativeMonthsString,
          'msg-param-sub-plan': subPlanString,
          'tmi-sent-ts': timestamp,
          'user-id': userId,
          username: userName,
        } = userstate;

        if (!userId) {
          return;
        }

        if (theme === 'cities-skylines-ii') {
          userImage = await getUserImageByUserId(userId);
        }

        addMessage({
          color,
          displayName,
          emotes,
          id,
          msgId,
          msgType: 'subscription',
          show: true,
          subCumulativeMonthsString,
          plan: parsePlan(subPlanString),
          timestamp: timestamp ? Number.parseInt(timestamp, 10) : undefined,
          userId,
          userImage,
          userName,
          viewerCount: viewers.value,
        } as ISubscription);
      });

      client.on('timeout', (_channel: string, _username: string, _reason: string, _duration: number, userstate: TimeoutUserstate) => {
        if (userstate['target-user-id']) {
          removeMessagesByUserId(userstate['target-user-id']);
        }
      });

      loading.value = false;
    } catch (err) {
      if ((err as { code: string }).code === 'ERR_BAD_REQUEST' && !retry) {
        token.value = null;
        await initTwitch(true);
        return;
      }
      console.info('retry failed, see error below');
      console.error(err);
    }
  }

  onMounted(async () => {
    await initTwitch();

    if (messageDebug) {
      addDebugMessages();
    }

    window.setInterval(async () => {
      await updateViewerCount(broadcaster.name);
    }, 1000 * 60);
    await updateViewerCount(broadcaster.name);
  });

  return {
    loading,
  };
}
