interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

class DataCache {
    private cache = new Map<string, CacheEntry<any>>();
    private maxSize = 100; // Maximum number of cache entries

    set<T>(key: string, data: T, ttl: number = 300000): void { // 5 minutes default TTL
        // Remove oldest entries if cache is full
        if (this.cache.size >= this.maxSize) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }

        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) {
            return null;
        }

        const now = Date.now();
        if (now - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    has(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) return false;

        const now = Date.now();
        if (now - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    clear(): void {
        this.cache.clear();
    }

    delete(key: string): boolean {
        return this.cache.delete(key);
    }

    // Get cache statistics
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            keys: Array.from(this.cache.keys())
        };
    }

    // Clean expired entries
    cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now - entry.timestamp > entry.ttl) {
                this.cache.delete(key);
            }
        }
    }
}

// Global cache instance
export const dataCache = new DataCache();

// Utility functions
export const getCacheKey = (prefix: string, filters: any): string => {
    return `${prefix}_${JSON.stringify(filters)}`;
};

export const withCache = async <T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
): Promise<T> => {
    // Try to get from cache first
    const cached = dataCache.get<T>(key);
    if (cached !== null) {
        return cached;
    }

    // Fetch new data
    const data = await fetcher();
    dataCache.set(key, data, ttl);
    return data;
};

// Auto cleanup every 5 minutes
setInterval(() => {
    dataCache.cleanup();
}, 300000);