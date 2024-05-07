import { computed } from 'vue';
import { useLocalStorage, useUrlSearchParams } from '@vueuse/core';
import type { TTheme } from '@/common/types/index.type';

export function useSearchParamsComposable() {
  const searchParams = useUrlSearchParams<{
    'active'?: 'true' | 'false';
    'debug'?: 'true' | 'false';
    'message-debug'?: 'true' | 'false';
    'theme'?: TTheme;
  }>('history');

  const theme = computed(() => {
    const localStorageTheme = useLocalStorage<TTheme>('theme', import.meta.env.VITE_THEME);

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
    debug: searchParams.debug === 'true',
    messageDebug: searchParams['message-debug'] === 'true',
    theme,
  };
}
