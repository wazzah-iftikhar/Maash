import { env } from './env'

// ── In-memory fallback (single-instance / dev only) ───────
interface Entry { count: number; resetAt: number }
const store = new Map<string, Entry>()

function inMemoryCheck(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = store.get(ip)
  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

// ── Upstash (production-safe, works across instances) ─────
let upstashCheck: ((ip: string, limit: number, windowMs: number) => Promise<boolean>) | null = null

if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
  // Dynamically imported so missing env vars don't crash non-Upstash setups
  const { Redis } = require('@upstash/redis')
  const { Ratelimit } = require('@upstash/ratelimit')

  const redis = new Redis({
    url:   env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  })

  const limiters = new Map<string, InstanceType<typeof Ratelimit>>()

  upstashCheck = async (ip, limit, windowMs) => {
    const key = `${limit}:${windowMs}`
    if (!limiters.has(key)) {
      limiters.set(key, new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms`),
        prefix:  'maaash:rl',
      }))
    }
    const { success } = await limiters.get(key)!.limit(ip)
    return success
  }
} else {
  console.warn('[rateLimit] Upstash env vars not set — using in-memory fallback (not safe for multi-instance deployments)')
}

export async function checkRateLimit(ip: string, limit = 10, windowMs = 60_000): Promise<boolean> {
  if (upstashCheck) return upstashCheck(ip, limit, windowMs)
  return inMemoryCheck(ip, limit, windowMs)
}
