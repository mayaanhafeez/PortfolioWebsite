import { Redis } from "@upstash/redis";

const LIMIT = 10;
const WINDOW_SECS = 60;

let redis;

function getRedis() {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

export async function checkRateLimit(ip) {
  const window = Math.floor(Date.now() / (WINDOW_SECS * 1000));
  const key = `ai-chat:${ip}:${window}`;
  const r = getRedis();

  try {
    const count = await r.incr(key);
    if (count === 1) await r.expire(key, WINDOW_SECS);
    return { allowed: count <= LIMIT, remaining: Math.max(0, LIMIT - count) };
  } catch {
    // fail open — Redis unavailable, don't block requests
    return { allowed: true, remaining: LIMIT };
  }
}
