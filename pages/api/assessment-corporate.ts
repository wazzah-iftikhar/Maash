import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMail, tableHtml } from '@/lib/mailer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { validateAssessmentCorporate, safeBody } from '@/lib/validate'
import { checkRateLimit } from '@/lib/rateLimit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? 'unknown'
  if (!checkRateLimit(ip)) return res.status(429).json({ error: 'Too many requests. Please try again later.' })

  const data = validateAssessmentCorporate(safeBody(req.body))
  if (!data) return res.status(400).json({ error: 'Missing required fields.' })

  const { org, contact, email, phone, partnerType, teamSize, message } = data

  const { error: dbErr } = await supabaseAdmin.from('assessment_corporate').insert({
    org, contact, email, phone, partner_type: partnerType, team_size: teamSize, message,
  })
  if (dbErr) return res.status(500).json({ error: 'Failed to save your request. Please try again.' })

  const html = `
    <h2 style="font-family:Georgia,serif;color:#1A1A2E">Corporate Partnership Inquiry — Ma'aash</h2>
    ${tableHtml({ Organization: org, 'Contact Person': contact, Email: email, Phone: phone, 'Partnership Type': partnerType, 'Team Size': teamSize })}
    <h3 style="font-family:Georgia,serif;color:#1A1A2E;margin-top:20px">Requirements</h3>
    <p style="font-family:Inter,sans-serif;font-size:14px;line-height:1.7">${message}</p>
  `

  try { await sendMail(`[Ma'aash] Corporate Inquiry – ${org}`, html) } catch (_) {}

  res.status(200).json({ ok: true })
}
