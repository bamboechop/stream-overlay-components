import axios from 'axios';

interface CacheEntry {
  promise: Promise<any>;
  timestamp: number;
  url: string;
}

interface StoredCacheInfo {
  timestamp: number;
  url: string;
  status: 'in_progress' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export class RequestCache {
  private static cache = new Map<string, CacheEntry>();
  private static readonly STORAGE_KEY = 'stream-overlay-request-cache';
  private static cleanupInterval: number | null = null;

  /**
   * Generates a cache key from URL and optional config parameters
   */
  private static getCacheKey(url: string, config?: any): string {
    if (!config) {
      return url;
    }

    // Include relevant config parts in the key (headers, params, etc.)
    const relevantConfig = {
      headers: config.headers,
      params: config.params,
      method: config.method || 'GET',
    };

    return `${url}:${JSON.stringify(relevantConfig)}`;
  }

  /**
   * Get stored cache info from localStorage to coordinate across browser instances
   */
  private static getStoredCacheInfo(): Record<string, StoredCacheInfo> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  /**
   * Update localStorage with cache info for cross-instance coordination
   */
  private static updateStoredCacheInfo(
    cacheKey: string,
    timestamp: number,
    url: string,
    status: 'in_progress' | 'completed' | 'failed' = 'in_progress',
    result?: any,
    error?: string,
  ): void {
    try {
      const stored = this.getStoredCacheInfo();
      stored[cacheKey] = { timestamp, url, status, result, error };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
    } catch (error) {
      console.warn('Failed to update request cache in localStorage:', error);
    }
  }

  private static removeStoredCacheInfo(cacheKey: string): void {
    try {
      const stored = this.getStoredCacheInfo();
      if (stored[cacheKey]) {
        delete stored[cacheKey];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
      }
    } catch (error) {
      console.warn('Failed to remove request cache entry from localStorage:', error);
    }
  }

  /**
   * Check if a request was made recently by any browser instance
   */
  private static isRequestRecentInAnyInstance(cacheKey: string, ttlSeconds: number): boolean {
    const stored = this.getStoredCacheInfo();
    const entry = stored[cacheKey];

    if (!entry) {
      return false;
    }

    return Date.now() - entry.timestamp < ttlSeconds * 1000;
  }

  /**
   * Wait for a cross-instance request to complete and return its result
   */
  private static async waitForCrossInstanceResult<T>(
    cacheKey: string,
    url: string,
    maxWaitMs: number = 5000,
  ): Promise<T> {
    const startTime = Date.now();
    const pollInterval = 100; // Check every 100ms

    return new Promise((resolve, reject) => {
      const poll = () => {
        const elapsed = Date.now() - startTime;

        if (elapsed > maxWaitMs) {
          reject(new Error(`Timeout waiting for cross-instance request: ${url}`));
          return;
        }

        const stored = this.getStoredCacheInfo();
        const entry = stored[cacheKey];

        if (!entry) {
          // Entry disappeared, might have been cleaned up
          reject(new Error(`Cross-instance request entry disappeared: ${url}`));
          return;
        }

        if (entry.status === 'completed') {
          console.debug(`[RequestCache] Cross-instance result received: GET ${url}`);
          resolve(entry.result);
          return;
        }

        if (entry.status === 'failed') {
          reject(new Error(entry.error || `Cross-instance request failed: ${url}`));
          return;
        }

        // Still in progress, keep polling
        setTimeout(poll, pollInterval);
      };

      poll();
    });
  }

  /**
   * Clean up expired cache entries from both memory and localStorage
   */
  private static cleanup(): void {
    const now = Date.now();
    const maxAge = 60 * 1000; // Clean up entries older than 1 minute

    // Clean memory cache
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > maxAge) {
        this.cache.delete(key);
      }
    }

    // Clean localStorage cache
    try {
      const stored = this.getStoredCacheInfo();
      const cleaned: Record<string, StoredCacheInfo> = {};

      for (const [key, entry] of Object.entries(stored)) {
        // Keep entries that are either recent or still in progress
        const isRecent = now - entry.timestamp <= maxAge;
        const isInProgress = entry.status === 'in_progress' && now - entry.timestamp <= 10000; // Keep in-progress up to 10 seconds

        if (isRecent || isInProgress) {
          cleaned[key] = entry;
        }
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cleaned));
    } catch (error) {
      console.warn('Failed to clean up request cache in localStorage:', error);
    }
  }

  /**
   * Start periodic cleanup if not already running
   */
  private static ensureCleanupRunning(): void {
    if (this.cleanupInterval === null) {
      this.cleanupInterval = window.setInterval(() => {
        this.cleanup();
      }, 30000); // Clean up every 30 seconds
    }
  }

  /**
   * Make any cached HTTP request (supports all methods)
   */
  static async request<T = any>(
    url: string,
    config?: any,
    ttlSeconds: number = 10,
  ): Promise<T> {
    this.ensureCleanupRunning();

    // Random delay to prevent race conditions when multiple instances
    // check the cache simultaneously (especially common in OBS browser sources)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 10)); // 10-60ms

    const cacheKey = this.getCacheKey(url, config);
    const cached = this.cache.get(cacheKey);

    // Check memory cache first
    if (cached && Date.now() - cached.timestamp < ttlSeconds * 1000) {
      console.debug(`[RequestCache] Memory hit: ${config?.method || 'GET'} ${url}`);
      return cached.promise;
    }

    // Check if request was made recently by any instance
    if (this.isRequestRecentInAnyInstance(cacheKey, ttlSeconds)) {
      console.debug(`[RequestCache] Cross-instance hit detected, waiting for result: ${config?.method || 'GET'} ${url}`);
      return this.waitForCrossInstanceResult<T>(cacheKey, url);
    }

    console.debug(`[RequestCache] Making new request: ${config?.method || 'GET'} ${url}`);

    const timestamp = Date.now();

    // IMMEDIATELY store in localStorage to prevent race conditions
    // This ensures other instances see the request is in progress
    this.updateStoredCacheInfo(cacheKey, timestamp, url, 'in_progress');

    // Make actual request using axios
    const promise = axios(url, config)
      .then((response) => {
        const result = response.data;
        // Store successful result in localStorage for other instances
        this.updateStoredCacheInfo(cacheKey, timestamp, url, 'completed', result);
        return result;
      })
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          this.cache.delete(cacheKey);
          this.removeStoredCacheInfo(cacheKey);
          throw error;
        }
        // Store error in localStorage for other instances
        const errorMessage = error.message || 'Request failed';
        this.updateStoredCacheInfo(cacheKey, timestamp, url, 'failed', undefined, errorMessage);
        throw error;
      });

    // Store in memory cache
    this.cache.set(cacheKey, {
      promise,
      timestamp,
      url,
    });

    return promise;
  }

  /**
   * Clear all cached requests (useful for testing or manual refresh)
   */
  static clearCache(): void {
    this.cache.clear();
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear request cache from localStorage:', error);
    }
    console.debug('[RequestCache] Cache cleared');
  }

  /**
   * Get cache statistics for debugging
   */
  static getStats(): {
    memoryCacheSize: number;
    localStorageCacheSize: number;
    memoryEntries: Array<{ url: string; age: number }>;
  } {
    const now = Date.now();
    const memoryEntries = Array.from(this.cache.values()).map(entry => ({
      url: entry.url,
      age: Math.round((now - entry.timestamp) / 1000),
    }));

    const stored = this.getStoredCacheInfo();

    return {
      memoryCacheSize: this.cache.size,
      localStorageCacheSize: Object.keys(stored).length,
      memoryEntries,
    };
  }
}

// Export a default instance for convenience
export default RequestCache;
