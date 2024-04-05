import type { IAction } from '@/common/interfaces/index.interface';

export const actionDummy: IAction[] = [
  {
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
    userImage: 'https://placekitten.com/35/35',
    userName: 'actionmedummyuser',
    viewerCount: 2,
  },
  {
    availableBadges: {},
    color: '#01c42d',
    displayName: 'ActionHighlightDummy',
    emotes: {
      305054953: ['31-43'],
      emotesv2_097331d1b466434da9a5a59ec13a2a9b: ['45-56'],
    },
    id: 'abc-action-highlight-dummy-123',
    msgId: 'highlighted-message',
    msgType: 'action',
    show: true,
    text: 'Highlight messages dummy text',
    timestamp: Date.now(),
    userBadges: {},
    userImage: 'https://placekitten.com/35/35',
    userName: 'actionhighlightdummyuser',
    viewerCount: 2,
  },
];
