import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMail, tableHtml } from '@/lib/mailer'
import { supabaseAdmin } from '@/lib/supabase'
import { validateCvSubmit } from '@/lib/validate'
import { checkRateLimit } from '@/lib/rateLimit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? 'unknown'
  if (!checkRateLimit(ip)) return res.status(429).json({ error: 'Too many requests. Please try again later.' })

  const data = validateCvSubmit(req.body ?? {})
  if (!data) return res.status(400).json({ error: 'Missing required fields.' })

  const { name, email, phone, role, location, workMode, message } = data

  await supabaseAdmin.from('cv_submissions').insert({
    name, email, phone, role, location, work_mode: workMode, message,
  })

  const html = `
    <h2 style="font-family:Georgia,serif;color:#1A1A2E">New CV Submission — Ma'aash Talent Pool</h2>
    ${tableHtml({ Name: name, Email: email, Phone: phone, 'Role / Field': role, Location: location, 'Work Mode Preference': workMode })}
    <h3 style="font-family:Georgia,serif;color:#1A1A2E;margin-top:20px">Career Goals</h3>
    <p style="font-family:Inter,sans-serif;font-size:14px;line-height:1.7">${message}</p>
  `

  try { await sendMail(`[Ma'aash] CV Submission – ${name}`, html) } catch (_) {}

  res.status(200).json({ ok: true })
}
