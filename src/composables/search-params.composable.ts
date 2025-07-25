import { computed } from 'vue';
import { useLocalStorage, useUrlSearchParams } from '@vueuse/core';
import type { TTheme } from '@/common/types/index.type';

export function useSearchParamsComposable() {
  const searchParams = useUrlSearchParams<{
    'active'?: 'true' | 'false';
    'chat-visible-timeout'?: string;
    'debug'?: 'true' | 'false';
    'gigantified-emote-volume'?: string;
    'mode'?: 'break' | 'end' | 'start';
    'message-debug'?: 'true' | 'false';
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

  return {
    active: searchParams.active === 'true',
    chatVisibleTimeoutInSeconds: searchParams['chat-visible-timeout'] ? Number.parseInt(searchParams['chat-visible-timeout'], 10) : 10,
    debug: searchParams.debug === 'true',
    gigantifiedEmoteVolume,
    messageDebug: searchParams['message-debug'] === 'true',
    mode: searchParams.mode,
    theme,
    themePath: theme.value.replace('-', ''),
    title: searchParams.title,
    url: searchParams.url,
    webcamAspectRatio: searchParams['webcam-aspect-ratio'] ?? '16/9',
  };
}
