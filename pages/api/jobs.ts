import type { NextApiRequest, NextApiResponse } from 'next'
import { checkRateLimit } from '@/lib/rateLimit'
import { getActiveJobs } from '@/services/jobService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? 'unknown'
  if (!await checkRateLimit(ip, 30, 60_000)) return res.status(429).json({ error: 'Too many requests.' })

  try {
    const jobs = await getActiveJobs()
    res.status(200).json(jobs)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}
