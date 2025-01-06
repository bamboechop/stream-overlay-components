export interface IEventStreamAdBreakBeginData {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  duration_seconds: number;
  is_automatic: boolean;
  requester_user_id: string;
  requester_user_login: string;
  requester_user_name: string;
  started_at: string;
}

export interface IEventStreamChannelUpdateData {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  category_id: string;
  category_name: string;
  content_classification_labels: string[];
  language: string;
  title: string;
}

export interface IEventStreamChannelPointsAutomaticRewardRedemptionAddData {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  id: string;
  message: {
    emotes: unknown;
    text: string;
  };
  redeemed_at: string;
  reward: {
    cost: number;
    type: 'celebration';
    unlocked_emote: unknown;
  };
  user_id: string;
  user_input: null;
  user_login: string;
  user_name: string;
}
