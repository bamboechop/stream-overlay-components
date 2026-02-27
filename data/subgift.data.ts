import type { ISubGift } from '@/common/interfaces/index.interface';

export const subgiftDummy: ISubGift = {
  channel: 'bamboechop',
  id: 'abc-subgift-dummy-123',
  msgId: 'subgift',
  msgType: 'subgift',
  recipient: {
    displayName: 'SubgiftRecipientDummy',
    id: 'subgift-recipient-123',
    image: 'https://picsum.photos/40',
    userName: 'subgiftrecipientdummyuser',
  },
  sender: {
    displayName: 'SubgiftSenderDummy',
    id: 'subgift-sender-123',
    image: 'https://picsum.photos/40',
    userName: 'subgiftsenderdummyuser',
  },
  show: true,
  plan: 1,
  timestamp: Date.now(),
  viewerCount: 2,
};
