import { computed } from 'vue';
import { useLocalStorage, useUrlSearchParams } from '@vueuse/core';
import type { TTheme } from '@/common/types/index.type';

export function useSearchParamsComposable() {
  const searchParams = useUrlSearchParams<{
    'active'?: 'true' | 'false';
    'chat-visible-timeout'?: string;
    'debug'?: 'true' | 'false';
    'mode'?: 'break' | 'end' | 'start';
    'message-debug'?: 'true' | 'false';
    'stream-together-channels'?: string;
    'theme'?: TTheme;
    'url'?: string;
  }>('history');
  const localStorageTheme = useLocalStorage<TTheme>('theme', import.meta.env.VITE_THEME);

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
    messageDebug: searchParams['message-debug'] === 'true',
    mode: searchParams.mode,
    streamTogetherChannels: searchParams['stream-together-channels'] && searchParams['stream-together-channels'].length > 0
      ? searchParams['stream-together-channels'].split(',')
      : [],
    theme,
    themePath: theme.value.replace('-', ''),
    url: searchParams.url,
  };
}
