import type { IRaid } from '@/common/interfaces/index.interface';

export const raidDummy: IRaid = {
  msgType: 'raid',
  show: true,
  timestamp: Date.now(),
  userId: 'raiddummyuser',
  userImage: 'https://placebacon.net/40/40',
  userName: 'RaidDummy',
  viewerCount: 2,
};
