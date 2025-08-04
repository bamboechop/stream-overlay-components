<template>
  <div
    class="music-player"
    :class="{ 'music-player--visible': isVisible }">
    <template v-if="!hideAlbumArt && currentTrack.albumArt">
      <img
        :alt="`Album art for ${currentTrack.name} by ${currentTrack.artist}`"
        class="music-player__album-art"
        :src="currentTrack.albumArt" />
    </template>
    <div class="music-player__song-info-box">
      <template v-if="currentTrack.albumArt">
        <div class="music-player__background-art">
          <img
            alt=""
            class="music-player__background-image"
            :src="currentTrack.albumArt" />
        </div>
      </template>
      <div class="music-player__song-info">
        <div class="music-player__song-name">
          {{ currentTrack.name }}
        </div>
        <div class="music-player__song-artist">
          {{ currentTrack.artist }}
        </div>
        <div class="music-player__times">
          <span>{{ formatTime(currentTrack.currentPlaybackTime) }}</span>
          <span>-{{ formatTime(currentTrack.currentPlaybackTimeRemaining) }}</span>
        </div>
        <div class="music-player__progress">
          <div
            class="music-player__progress-bar"
            :style="{ width: `${progressPercentage}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useCiderComposable } from '@/composables/cider.composable';
import { useSearchParamsComposable } from '@/composables/search-params.composable';
import type { ICiderApiMessage, ICiderArtwork, ICiderPlaybackData, ICiderPlaybackStateData, ICiderPlaybackTimeData } from '@/common/interfaces/cider.interface';

const { musicPlayerDuration, hideAlbumArt } = useSearchParamsComposable();
const cider = useCiderComposable();

const isVisible = ref(false);
const visibilityTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const currentTrack = ref({
  albumArt: '',
  artist: '',
  currentPlaybackDuration: 0,
  currentPlaybackTime: 0,
  currentPlaybackTimeRemaining: 0,
  name: '',
});

const progressPercentage = computed(() => {
  if (currentTrack.value.currentPlaybackDuration === 0) {
    return 0;
  }
  return (currentTrack.value.currentPlaybackTime / currentTrack.value.currentPlaybackDuration) * 100;
});

function formatTime(timeInSeconds: number): string {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.trunc(timeInSeconds - minutes * 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function getAlbumArtUrl(artwork: ICiderArtwork): string {
  return artwork.url.replace('{w}', '180').replace('{h}', '180');
}

function setVisibility(visible: boolean) {
  isVisible.value = visible;

  if (visibilityTimeout.value) {
    clearTimeout(visibilityTimeout.value);
    visibilityTimeout.value = null;
  }

  if (visible && musicPlayerDuration.value > 0) {
    visibilityTimeout.value = setTimeout(() => {
      setVisibility(false);
    }, musicPlayerDuration.value * 1000);
  }
}

function updateSongInfo(data: ICiderPlaybackData) {
  const albumArtUrl = getAlbumArtUrl(data.artwork);

  setTimeout(() => {
    currentTrack.value.albumArt = albumArtUrl;
  }, 250);

  setTimeout(() => {
    currentTrack.value.name = data.name;
    currentTrack.value.artist = data.artistName;
  }, 500);
}

function updateProgressBar(data: ICiderPlaybackTimeData) {
  currentTrack.value.currentPlaybackTime = data.currentPlaybackTime;
  currentTrack.value.currentPlaybackDuration = data.currentPlaybackDuration;
  currentTrack.value.currentPlaybackTimeRemaining = data.currentPlaybackTimeRemaining;
}

function updatePlaybackState(data: ICiderPlaybackStateData) {
  switch (data.state) {
    case 'paused':
    case 'stopped':
      setVisibility(false);
      break;
    case 'playing':
      if (data.attributes) {
        updateSongInfo(data.attributes);
        setTimeout(() => {
          setVisibility(true);
        }, 500);
      }
      break;
  }
}

onMounted(() => {
  cider.on<ICiderApiMessage>('API:Playback', (message) => {
    switch (message.type) {
      case 'playbackStatus.nowPlayingItemDidChange':
        updateSongInfo(message.data as ICiderPlaybackData);
        updatePlaybackState({ attributes: message.data as ICiderPlaybackData, state: 'playing' });
        break;
      case 'playbackStatus.playbackTimeDidChange':
        updateProgressBar(message.data as ICiderPlaybackTimeData);
        break;
      case 'playbackStatus.playbackStateDidChange':
        updatePlaybackState(message.data as ICiderPlaybackStateData);
        break;
    }
  });
});
</script>

<style lang="scss" scoped>
.music-player {
  --corner-radius: 10px;
  --album-art-size: 100px;

  column-gap: 8px;
  display: flex;
  height: var(--album-art-size);
  opacity: 0;
  transition: all 0.5s ease-in-out;

  &__album-art {
    aspect-ratio: 1;
    border-radius: var(--corner-radius);
    flex-shrink: 0;
    object-fit: cover;
    overflow: hidden;
    width: var(--album-art-size);
  }

  &__background-art {
    border-radius: var(--corner-radius);
    height: 100%;
    opacity: 0.9;
    overflow: hidden;
    position: absolute;
    width: 100%;
  }

  &__background-image {
    filter: blur(20px);
    left: 50%;
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 140%;
  }

  &__background-image-back {
    filter: blur(20px);
    position: absolute;
    width: 140%;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: -1;
  }

  &__progress {
    background-color: #1F1F1F;
    border-radius: 9999px;
    margin-top: 6px;
  }

  &__progress-bar {
    background-color: #ffffff;
    border-radius: 9999px;
    height: 6px;
    transition: width .5s ease;
  }

  &__song-artist {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    white-space: nowrap;
  }

  &__song-name {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }

  &__song-info {
    background: rgba(0, 0, 0, 0.35);
    border-radius: var(--corner-radius);
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    padding: 0px 20px;
    position: relative;
  }

  &__song-info-box {
    color: white;
    position: relative;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
    width: 100%;
  }

  &__times {
    display: flex;
    flex-direction: row;
    font-size: 14px;
    font-weight: 700;
    justify-content: space-between;
  }
}

.music-player--visible {
  opacity: 1;
}
</style>
