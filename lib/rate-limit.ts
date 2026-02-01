/**
 * Simple in-memory token-bucket rate limiter.
 *
 * Limitations:
 * - State is lost on server restart / redeployment.
 * - Not shared across multiple serverless instances.
 * Suitable for basic abuse prevention on a single-instance deploy.
 */

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, Bucket>();

const CLEANUP_INTERVAL = 60_000; // 1 min
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (now - bucket.lastRefill > windowMs * 2) {
      buckets.delete(key);
    }
  }
}

/**
 * Returns `true` if the request is allowed, `false` if rate-limited.
 *
 * @param key      - Identifier (e.g. IP address)
 * @param limit    - Max tokens per window
 * @param windowMs - Window size in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 60_000,
): boolean {
  cleanup(windowMs);

  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = { tokens: limit - 1, lastRefill: now };
    buckets.set(key, bucket);
    return true;
  }

  // Refill tokens based on elapsed time
  const elapsed = now - bucket.lastRefill;
  const refill = Math.floor((elapsed / windowMs) * limit);
  if (refill > 0) {
    bucket.tokens = Math.min(limit, bucket.tokens + refill);
    bucket.lastRefill = now;
  }

  if (bucket.tokens > 0) {
    bucket.tokens -= 1;
    return true;
  }

  return false;
}
