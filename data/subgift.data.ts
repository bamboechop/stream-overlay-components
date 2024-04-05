import type { ISubGift } from '@/common/interfaces/index.interface';

export const subgiftDummy: ISubGift = {
  id: 'abc-subgift-dummy-123',
  msgId: 'subgift',
  msgType: 'subgift',
  recipient: {
    displayName: 'SubgiftRecipientDummy',
    id: 'subgift-recipient-123',
    image: 'https://placekitten.com/35/35',
    userName: 'subgiftrecipientdummyuser',
  },
  sender: {
    displayName: 'SubgiftSenderDummy',
    id: 'subgift-sender-123',
    image: 'https://placekitten.com/35/35',
    userName: 'subgiftsenderdummyuser',
  },
  show: true,
  plan: 1,
  timestamp: Date.now(),
  viewerCount: 2,
};
