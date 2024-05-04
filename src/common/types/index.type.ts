import type { IAction, IChat, IMessage, IRaid, IResub, ISubGift, ISubscription } from '../interfaces/index.interface.ts';

export type TTheme = 'cities-skylines-ii' | 'modern' | 'windows-95';
export type TMessage = IAction | IChat | IRaid | IResub | ISubGift | ISubscription;
export type TRaidMessage = Pick<IMessage, 'msgType' | 'show' | 'timestamp' | 'userImage' | 'userName' | 'viewerCount'>;
export type TTwitchPlan = 1 | 2 | 3 | 'Prime';
