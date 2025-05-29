import type { Badges } from 'tmi.js';
import type { TTwitchPlan } from '../types/index.type.ts';

export interface ITwitchBadgeResponse {
  data: {
    set_id: string;
    versions: {
      click_action: string | null;
      click_url: string | null;
      description: string;
      id: string;
      image_url_1x: string;
      image_url_2x: string;
      image_url_4x: string;
      title: string;
    }[];
  }[];
}

export interface IBadge {
  description: string;
  id: string;
  imageUrl: string;
  title: string;
}

export interface IAction {
  availableBadges: Record<string, IBadge[]>;
  channel: string;
  color?: string;
  displayName?: string;
  emotes?: { [emoteid: string]: string[] };
  id?: string;
  msgType: 'action';
  show: boolean;
  text: string;
  timestamp?: number;
  userBadges?: Badges;
  userId: string;
  userImage: string;
  userName?: string;
  viewerCount: number;
}

export interface IChat {
  animationId?: 'cosmic-abyss' | 'rainbow-eclipse' | 'simmer';
  availableBadges: Record<string, IBadge[]>;
  channel: string;
  channelImage?: string;
  color?: string;
  displayName?: string;
  emotes?: { [emoteid: string]: string[] };
  id?: string;
  msgId?: 'gigantified-emote-message' | 'highlighted-message';
  msgType: 'chat';
  show: boolean;
  text: string;
  timestamp?: number;
  userBadges?: Badges;
  userId: string;
  userImage: string;
  userName?: string;
  viewerCount: number;
}

export interface IRaid {
  channel: string;
  id?: string;
  msgType: 'raid';
  show: boolean;
  timestamp: number;
  userId: string;
  userImage: string;
  userName: string;
  viewerCount: number;
}

export interface IResub {
  channel: string;
  color?: string;
  cumulativeMonths?: number;
  displayName?: string;
  emotes?: { [emoteid: string]: string[] };
  id?: string;
  months: number;
  msgId?: 'resub';
  msgType: 'resub';
  plan?: TTwitchPlan;
  show: boolean;
  text: string;
  timestamp?: number;
  userId: string;
  userImage: string;
  userName?: string;
  viewerCount: number;
}

interface ISubGiftUser {
  displayName?: string;
  id: string;
  image: string;
  userName?: string;
};

export interface ISubGift {
  channel: string;
  id?: string;
  msgId?: 'subgift';
  msgType: 'subgift';
  recipient: ISubGiftUser;
  sender: ISubGiftUser;
  show: boolean;
  plan?: TTwitchPlan;
  timestamp?: number;
  viewerCount: number;
}

export interface ISubscription {
  channel: string;
  color?: string;
  displayName?: string;
  emotes?: { [emoteid: string]: string[] };
  id?: string;
  msgId?: 'sub';
  msgType: 'subscription';
  plan?: TTwitchPlan;
  show: boolean;
  timestamp?: number;
  userId: string;
  userImage: string;
  userName?: string;
  viewerCount: number;
}

export interface IMessage {
  animationId?: 'cosmic-abyss' | 'rainbow-eclipse' | 'simmer';
  availableBadges: Record<string, IBadge[]>;
  color?: string;
  displayName?: string;
  emotes?: { [emoteid: string]: string[] };
  id?: string;
  msgId?: 'gigantified-emote-message' | 'highlighted-message' | 'resub' | 'sub' | 'subgift'; // TODO check screenshots and set accordingly
  msgType: 'action' | 'chat' | 'raid' | 'resub' | 'sub' | 'subgift' | 'whisper'; // action = /me bla | chat = regular messages
  show: boolean;
  subCumulativeMonthsString?: boolean | string; // TODO refactor to always be a number - true => 1, otherwise parse string to number
  subPlanString?: '1000' | '2000' | '3000' | 'Prime'; // TODO refactor to always be "Prime" or 1, 2, 3
  text: string;
  timestamp?: number;
  userBadges?: Badges;
  userId?: string;
  userImage: string;
  userName?: string;
  viewerCount: number;
}
