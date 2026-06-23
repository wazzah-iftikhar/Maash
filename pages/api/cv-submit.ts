import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMail, tableHtml } from '@/lib/mailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, phone, role, location, workMode, message } = req.body

  const html = `
    <h2 style="font-family:Georgia,serif;color:#1A1A2E">New CV Submission — Ma'aash Talent Pool</h2>
    ${tableHtml({ Name: name, Email: email, Phone: phone, 'Role / Field': role, Location: location, 'Work Mode Preference': workMode })}
    <h3 style="font-family:Georgia,serif;color:#1A1A2E;margin-top:20px">Career Goals</h3>
    <p style="font-family:Inter,sans-serif;font-size:14px;line-height:1.7">${message}</p>
  `

  try {
    await sendMail(`[Ma'aash] CV Submission – ${name}`, html)
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false })
  }
}
