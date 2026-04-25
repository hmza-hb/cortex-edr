export interface RateLimitStatus {
    success: boolean;
    remaining: number;
    resetAt: number;
}

interface WindowData {
    count: number;
    resetAt: number;
}

// In-memory store (WARNING: Not suitable for distributed deployments, but works for MVP/single instance)
const store = new Map<string, WindowData>();

/**
 * Basic memory-based sliding window rate limiter.
 * @param key Unique identifier (IP, email, etc)
 * @param limit Max requests per window
 * @param windowMs Window duration in milliseconds
 */
export function rateLimit(key: string, limit: number = 5, windowMs: number = 60000): RateLimitStatus {
    const now = Date.now();
    let data = store.get(key);

    if (!data || data.resetAt < now) {
        data = { count: 0, resetAt: now + windowMs };
    }

    data.count++;
    store.set(key, data);

    return {
        success: data.count <= limit,
        remaining: Math.max(0, limit - data.count),
        resetAt: data.resetAt
    };
}

/**
 * Clean up expired entries to prevent memory leaks
 */
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of Array.from(store.entries())) {
        if (data.resetAt < now) {
            store.delete(key);
        }
    }
}, 60000).unref?.();
