import axios from 'axios';
import { useLocalStorage } from '@vueuse/core';
import { RequestCache } from '@/services/request-cache.service';

const token = useLocalStorage<string | null>('twitch-token', null);
const csrfToken = useLocalStorage<string | null>('csrf-token', null);
const lastValidatedAt = useLocalStorage<number>('twitch-token-validated-at', 0);

const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
const redirectUri = import.meta.env.VITE_TWITCH_REDIRECT_URI;

function applyAuthHeaders(value: string) {
  axios.defaults.headers.common = {
    ...axios.defaults.headers.common,
    'Authorization': `Bearer ${value}`,
    'Client-ID': clientId,
  };
}

function readTokenFromHash(): string | null {
  if (!window.location.hash) {
    return null;
  }

  const queryParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = queryParams.get('access_token');
  const state = queryParams.get('state');

  if (accessToken && state && csrfToken.value && state === csrfToken.value) {
    token.value = accessToken;
    csrfToken.value = null;
    return accessToken;
  }

  if (accessToken && csrfToken.value && state !== csrfToken.value) {
    throw new Error('CSRF token mismatch');
  }

  return null;
}

function redirectToOAuth() {
  csrfToken.value = Math.random().toString(36).substring(2, 15);
  window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=channel:read:ads&state=${csrfToken.value}`;
}

function buildConfig(config?: any) {
  const headers = {
    ...(config?.headers ?? {}),
  };

  if (token.value) {
    headers.Authorization = `Bearer ${token.value}`;
    headers['Client-ID'] = clientId;
  }

  return {
    ...config,
    headers,
  };
}

export function ensureAuthHeaders(): boolean {
  let currentToken = token.value;
  if (!currentToken) {
    currentToken = readTokenFromHash() ?? null;
  }

  if (!currentToken) {
    return false;
  }

  applyAuthHeaders(currentToken);
  return true;
}

export async function validateTokenWithTTL(ttlMs: number): Promise<boolean> {
  if (!ensureAuthHeaders()) {
    return false;
  }

  const now = Date.now();
  if (lastValidatedAt.value && now - lastValidatedAt.value < ttlMs) {
    return true;
  }

  try {
    await RequestCache.request('https://id.twitch.tv/oauth2/validate', {
      headers: {
        'Authorization': `Bearer ${token.value}`,
      },
      method: 'GET',
    }, 10);
    lastValidatedAt.value = now;
    return true;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      lastValidatedAt.value = 0;
      return false;
    }
    throw error;
  }
}

export async function twitchRequest<T>(
  url: string,
  config?: any,
  ttlSeconds: number = 10,
): Promise<T> {
  if (!ensureAuthHeaders()) {
    redirectToOAuth();
    throw new Error('TWITCH_TOKEN_MISSING');
  }

  const requestConfig = buildConfig(config);

  try {
    return await RequestCache.request<T>(url, requestConfig, ttlSeconds);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.debug(`[TwitchAuth] 401 for ${url}. Retrying with refreshed headers.`);
      ensureAuthHeaders();
      try {
        return await RequestCache.request<T>(url, buildConfig(config), ttlSeconds);
      } catch (retryError) {
        if (axios.isAxiosError(retryError) && retryError.response?.status === 401) {
          console.warn(`[TwitchAuth] Retry 401 for ${url}. Validating token.`);
          try {
            const isValid = await validateTokenWithTTL(0);
            if (!isValid) {
              console.warn('[TwitchAuth] Token invalid. Redirecting to OAuth.');
              redirectToOAuth();
            }
          } catch (validationError) {
            throw validationError;
          }
        }
        throw retryError;
      }
    }
    throw error;
  }
}
