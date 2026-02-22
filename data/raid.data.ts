import type { IRaid } from '@/common/interfaces/index.interface';

export const raidDummy: IRaid = {
  channel: 'bamboechop',
  msgType: 'raid',
  show: true,
  timestamp: Date.now(),
  userId: 'raiddummyuser',
  userImage: 'https://picsum.photos/40',
  userName: 'RaidDummy',
  viewerCount: 2,
};
