import type { TProgramId } from '@/common/types/index.type';

export interface IProgram {
  active: boolean;
  iconPath: string;
  id: TProgramId;
  text: string;
}
