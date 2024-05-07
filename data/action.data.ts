import type { IAction } from '@/common/interfaces/index.interface';

export const actionDummy: IAction = {
  availableBadges: {},
  color: '#01c42d',
  displayName: 'ActionMeDummy',
  emotes: {
    305054953: ['31-43'],
    emotesv2_097331d1b466434da9a5a59ec13a2a9b: ['45-56'],
  },
  id: 'abc-action-me-dummy-123',
  msgType: 'action',
  show: true,
  text: 'Me messages dummy text',
  timestamp: Date.now(),
  userBadges: {},
  userId: 'abc-action-me-dummy-123',
  userImage: 'https://placebacon.net/40/40',
  userName: 'actionmedummyuser',
  viewerCount: 2,
};
