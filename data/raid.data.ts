import type { IRaid } from '@/common/interfaces/index.interface';

export const raidDummy: IRaid = {
  msgType: 'raid',
  show: true,
  timestamp: Date.now(),
  userId: 'raiddummyuser',
  userImage: 'https://placekitten.com/35/35',
  userName: 'RaidDummy',
  viewerCount: 2,
};
