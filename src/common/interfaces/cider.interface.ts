export interface ICiderArtwork {
  url: string;
  width: number;
  height: number;
}

export interface ICiderPlaybackData {
  name: string;
  artistName: string;
  artwork: ICiderArtwork;
  currentPlaybackTime: number;
  currentPlaybackDuration: number;
  currentPlaybackTimeRemaining: number;
}

export interface ICiderPlaybackTimeData {
  currentPlaybackTime: number;
  currentPlaybackDuration: number;
  currentPlaybackTimeRemaining: number;
}

export interface ICiderPlaybackStateData {
  state: 'playing' | 'paused' | 'stopped';
  attributes?: ICiderPlaybackData;
}

export interface ICiderApiMessage {
  data: ICiderPlaybackData | ICiderPlaybackTimeData | ICiderPlaybackStateData;
  type: 'playbackStatus.nowPlayingItemDidChange' | 'playbackStatus.playbackTimeDidChange' | 'playbackStatus.playbackStateDidChange';
}
