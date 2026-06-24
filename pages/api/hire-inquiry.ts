import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMail, tableHtml } from '@/lib/mailer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { validateHireInquiry } from '@/lib/validate'
import { checkRateLimit } from '@/lib/rateLimit'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? 'unknown'
  if (!checkRateLimit(ip)) return res.status(429).json({ error: 'Too many requests. Please try again later.' })

  const data = validateHireInquiry(req.body ?? {})
  if (!data) return res.status(400).json({ error: 'Missing required fields.' })

  const { company, country, city, workMode, salary, schedule, jd, name, email } = data

  await supabaseAdmin.from('hire_inquiries').insert({
    company, country, city, work_mode: workMode, salary, schedule, jd, name, email,
  })

  const html = `
    <h2 style="font-family:Georgia,serif;color:#1A1A2E">New Hiring Inquiry — Ma'aash</h2>
    ${tableHtml({ Company: company, Country: country, City: city, 'Work Mode': workMode, 'Salary Bracket': salary, Schedule: schedule, 'Contact Name': name, 'Contact Email': email })}
    <h3 style="font-family:Georgia,serif;color:#1A1A2E;margin-top:20px">Job Description</h3>
    <p style="font-family:Inter,sans-serif;font-size:14px;line-height:1.7;white-space:pre-wrap">${jd}</p>
  `

  try { await sendMail(`[Ma'aash] Hiring Inquiry – ${company}`, html) } catch (_) {}

  res.status(200).json({ ok: true })
}
