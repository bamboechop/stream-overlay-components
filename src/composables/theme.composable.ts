import { computed } from 'vue';
import { useLocalStorage, useUrlSearchParams } from '@vueuse/core';
import type { TTheme } from '@/common/types/index.type';

export function useSearchParamsComposable() {
  const searchParams = useUrlSearchParams<{
    'amount-of-programs'?: string;
    'active'?: 'true' | 'false';
    'debug'?: 'true' | 'false';
    'mode'?: 'break' | 'end' | 'start';
    'message-debug'?: 'true' | 'false';
    'theme'?: TTheme;
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
    amountOfPrograms: searchParams['amount-of-programs'] ? Number.parseInt(searchParams['amount-of-programs'], 10) : 4,
    debug: searchParams.debug === 'true',
    messageDebug: searchParams['message-debug'] === 'true',
    mode: searchParams.mode,
    theme,
  };
}
