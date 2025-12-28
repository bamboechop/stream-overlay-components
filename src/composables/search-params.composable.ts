import { computed } from 'vue';
import { useLocalStorage, useUrlSearchParams } from '@vueuse/core';
import type { TTheme } from '@/common/types/index.type';

export function useSearchParamsComposable() {
  const searchParams = useUrlSearchParams<{
    'active'?: 'true' | 'false';
    'chat-visible-timeout'?: string;
    'ciderDuration'?: string;
    'ciderHideAlbumArt'?: 'true' | 'false';
    'debug'?: 'true' | 'false';
    'gigantified-emote-volume'?: string;
    'mode'?: 'break' | 'end' | 'start';
    'message-debug'?: 'true' | 'false';
    'scene'?: 'desktop' | 'ingame';
    'theme'?: TTheme;
    'title'?: string;
    'url'?: string;
    'webcam-aspect-ratio'?: '1' | '16:9';
  }>('history');
  const localStorageTheme = useLocalStorage<TTheme>('theme', import.meta.env.VITE_THEME);

  const gigantifiedEmoteVolume = computed(() => {
    const param = searchParams['gigantified-emote-volume'];
    if (!param) {
      return 1;
    }
    const value = Number.parseFloat(param);
    if (Number.isNaN(value)) {
      return 1;
    }
    // If the value is already a decimal (less than or exactly 1), use it directly
    // Otherwise, treat it as a percentage and divide by 100
    const normalizedValue = value <= 1 ? value : value / 100;
    // make sure volume value is between 0 and 1
    return Math.min(Math.max(normalizedValue, 0), 1);
  });

  const theme = computed(() => {
    if (searchParams.theme) {
      if (localStorageTheme.value !== searchParams.theme) {
        localStorageTheme.value = searchParams.theme;
      }
    } else if (!localStorageTheme.value) {
      localStorageTheme.value = import.meta.env.VITE_THEME;
    }
    return localStorageTheme.value;
  });

  const musicPlayerDuration = computed(() => {
    const param = searchParams.ciderDuration;
    if (!param) {
      return 0;
    }
    const value = Number.parseInt(param, 10);
    return Number.isNaN(value) ? 0 : value;
  });

  return {
    active: searchParams.active === 'true',
    chatVisibleTimeoutInSeconds: searchParams['chat-visible-timeout'] ? Number.parseInt(searchParams['chat-visible-timeout'], 10) : 10,
    debug: searchParams.debug === 'true',
    gigantifiedEmoteVolume,
    hideAlbumArt: searchParams.ciderHideAlbumArt === 'true',
    messageDebug: searchParams['message-debug'] === 'true',
    mode: searchParams.mode,
    musicPlayerDuration,
    scene: searchParams.scene ?? 'desktop',
    theme,
    themePath: theme.value.replace('-', ''),
    title: searchParams.title,
    url: searchParams.url,
    webcamAspectRatio: searchParams['webcam-aspect-ratio'] ?? '16/9',
  };
}
