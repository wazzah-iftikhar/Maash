import type { NextApiRequest, NextApiResponse } from 'next'
import { validateAssessmentCorporate, safeBody } from '@/lib/validate'
import { checkRateLimit } from '@/lib/rateLimit'
import { submitCorporateAssessment } from '@/services/assessmentService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? 'unknown'
  if (!await checkRateLimit(ip)) return res.status(429).json({ error: 'Too many requests. Please try again later.' })

  const data = validateAssessmentCorporate(safeBody(req.body))
  if (!data) return res.status(400).json({ error: 'Missing required fields.' })

  try {
    await submitCorporateAssessment(data)
    res.status(200).json({ ok: true })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}
