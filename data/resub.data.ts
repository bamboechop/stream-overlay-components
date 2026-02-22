import type { IResub } from '@/common/interfaces/index.interface';

export const resubDummy: IResub = {
  channel: 'bamboechop',
  color: '#ffac12',
  cumulativeMonths: 2,
  displayName: 'ResubDummy',
  emotes: {
    305054953: ['31-43'],
    emotesv2_097331d1b466434da9a5a59ec13a2a9b: ['45-56'],
  },
  id: 'abc-resub-dummy-123',
  months: 2,
  msgId: 'resub',
  msgType: 'resub',
  plan: 1,
  show: true,
  text: 'I am a resub dummy messages, yay!',
  timestamp: Date.now(),
  userId: 'resubdummyuser',
  userImage: 'https://picsum.photos/40',
  userName: 'resubdummyuser',
  viewerCount: 2,
};
