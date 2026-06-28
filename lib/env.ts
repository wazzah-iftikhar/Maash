import { z } from 'zod'

const schema = z.object({
  // Supabase — required
  NEXT_PUBLIC_SUPABASE_URL:      z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY:     z.string().min(1),

  // Email — required in production
  EMAIL_HOST: z.string().default('smtp.gmail.com'),
  EMAIL_PORT: z.coerce.number().default(587),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_TO:   z.string().optional(),

  // Upstash — optional (falls back to in-memory rate limiting if absent)
  UPSTASH_REDIS_REST_URL:   z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
})

function parseEnv() {
  const result = schema.safeParse(process.env)
  if (!result.success) {
    const missing = result.error.issues.map(i => `  ${i.path.join('.')}: ${i.message}`).join('\n')
    throw new Error(`Invalid environment variables:\n${missing}`)
  }
  return result.data
}

// Validated once — throws at import time on the server if env is misconfigured.
export const env = parseEnv()
