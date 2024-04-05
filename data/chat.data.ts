import type { IChat } from '@/common/interfaces/index.interface';

export const chatDummy: IChat = {
  availableBadges: {},
  color: '#0fda15',
  displayName: 'ChatDummy',
  emotes: {
    305054953: ['31-43'],
    emotesv2_097331d1b466434da9a5a59ec13a2a9b: ['45-56'],
  },
  id: 'abc-chat-dummy-123',
  msgType: 'chat',
  show: true,
  text: 'I am a chat dummy messages',
  timestamp: Date.now(),
  userBadges: {},
  userImage: 'https://placekitten.com/35/35',
  userName: 'chatdummyuser',
  viewerCount: 2,
};
