import axios from 'axios';

interface CacheEntry {
  promise: Promise<any>;
  timestamp: number;
  url: string;
}

interface StoredCacheInfo {
  timestamp: number;
  url: string;
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
  private static updateStoredCacheInfo(cacheKey: string, timestamp: number, url: string): void {
    try {
      const stored = this.getStoredCacheInfo();
      stored[cacheKey] = { timestamp, url };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
    } catch (error) {
      console.warn('Failed to update request cache in localStorage:', error);
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
        if (now - entry.timestamp <= maxAge) {
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
      console.debug(`[RequestCache] Cross-instance hit: ${config?.method || 'GET'} ${url}`);
      return Promise.reject(new Error('REQUEST_RECENTLY_MADE_BY_OTHER_INSTANCE'));
    }

    console.debug(`[RequestCache] Making new request: ${config?.method || 'GET'} ${url}`);

    const timestamp = Date.now();

    // IMMEDIATELY store in localStorage to prevent race conditions
    // This ensures other instances see the request is in progress
    this.updateStoredCacheInfo(cacheKey, timestamp, url);

    // Make actual request using axios
    const promise = axios(url, config).then(response => response.data);

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
