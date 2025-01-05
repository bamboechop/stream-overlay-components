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
