import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMail, tableHtml } from '@/lib/mailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { company, country, city, workMode, salary, schedule, jd, name, email } = req.body

  const html = `
    <h2 style="font-family:Georgia,serif;color:#1A1A2E">New Hiring Inquiry — Ma'aash</h2>
    ${tableHtml({ Company: company, Country: country, City: city, 'Work Mode': workMode, 'Salary Bracket': salary, 'Schedule': schedule, 'Contact Name': name, 'Contact Email': email })}
    <h3 style="font-family:Georgia,serif;color:#1A1A2E;margin-top:20px">Job Description</h3>
    <p style="font-family:Inter,sans-serif;font-size:14px;line-height:1.7;white-space:pre-wrap">${jd}</p>
  `

  try {
    await sendMail(`[Ma'aash] Hiring Inquiry – ${company}`, html)
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false })
  }
}
