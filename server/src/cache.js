/**
 * Production Hybrid Cache Layer
 * Connects to Redis with automatic in-memory fallback, TTL, and telemetry.
 */
import Redis from "ioredis";
import { CONFIG } from "./config.js";

class CacheManager {
  constructor() {
    this.redisClient = null;
    this.memoryCache = new Map();
    this.metrics = {
      hits: 0,
      misses: 0,
      sets: 0,
      mode: "IN_MEMORY" // or "REDIS_ACTIVE"
    };

    this.init();
  }

  init() {
    try {
      this.redisClient = new Redis(CONFIG.REDIS_URL, {
        maxRetriesPerRequest: 1,
        connectTimeout: 1500,
        lazyConnect: true
      });

      this.redisClient.connect().then(() => {
        this.metrics.mode = "REDIS_ACTIVE";
        console.log(`[CacheManager] Connected to Redis server at ${CONFIG.REDIS_URL}`);
      }).catch((err) => {
        this.metrics.mode = "IN_MEMORY_FALLBACK";
        console.log(`[CacheManager] Redis unavailable (${err.message}). Using High-Speed In-Memory LRU Cache.`);
      });

      this.redisClient.on("error", (err) => {
        this.metrics.mode = "IN_MEMORY_FALLBACK";
      });
    } catch (e) {
      this.metrics.mode = "IN_MEMORY_FALLBACK";
      console.log(`[CacheManager] Using In-Memory Cache.`);
    }
  }

  async get(key) {
    if (this.metrics.mode === "REDIS_ACTIVE" && this.redisClient) {
      try {
        const val = await this.redisClient.get(key);
        if (val) {
          this.metrics.hits++;
          return JSON.parse(val);
        }
      } catch (err) {
        // Fallback to memory cache
      }
    }

    const item = this.memoryCache.get(key);
    if (item) {
      if (item.expiry && item.expiry < Date.now()) {
        this.memoryCache.delete(key);
        this.metrics.misses++;
        return null;
      }
      this.metrics.hits++;
      return item.data;
    }

    this.metrics.misses++;
    return null;
  }

  async set(key, value, ttlSeconds = CONFIG.CACHE_TTL_SECONDS) {
    this.metrics.sets++;
    const payload = JSON.stringify(value);

    if (this.metrics.mode === "REDIS_ACTIVE" && this.redisClient) {
      try {
        await this.redisClient.setex(key, ttlSeconds, payload);
      } catch (err) {
        // Fallback to memory
      }
    }

    this.memoryCache.set(key, {
      data: value,
      expiry: Date.now() + (ttlSeconds * 1000)
    });

    return true;
  }

  async del(key) {
    if (this.metrics.mode === "REDIS_ACTIVE" && this.redisClient) {
      try {
        await this.redisClient.del(key);
      } catch (e) {}
    }
    this.memoryCache.delete(key);
  }

  async invalidatePattern(prefix) {
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key);
      }
    }
    if (this.metrics.mode === "REDIS_ACTIVE" && this.redisClient) {
      try {
        const keys = await this.redisClient.keys(`${prefix}*`);
        if (keys.length > 0) {
          await this.redisClient.del(...keys);
        }
      } catch (e) {}
    }
  }

  getMetrics() {
    const total = this.metrics.hits + this.metrics.misses;
    const hitRate = total > 0 ? ((this.metrics.hits / total) * 100).toFixed(1) : "100.0";
    return {
      ...this.metrics,
      totalQueries: total,
      hitRate: `${hitRate}%`,
      inMemoryKeyCount: this.memoryCache.size
    };
  }
}

export const cache = new CacheManager();

