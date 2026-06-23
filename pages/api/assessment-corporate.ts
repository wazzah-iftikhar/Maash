import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMail, tableHtml } from '@/lib/mailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { org, contact, email, phone, partnerType, teamSize, message } = req.body

  const html = `
    <h2 style="font-family:Georgia,serif;color:#1A1A2E">Corporate Partnership Inquiry — Ma'aash</h2>
    ${tableHtml({ Organization: org, 'Contact Person': contact, Email: email, Phone: phone, 'Partnership Type': partnerType, 'Team Size': teamSize })}
    <h3 style="font-family:Georgia,serif;color:#1A1A2E;margin-top:20px">Requirements</h3>
    <p style="font-family:Inter,sans-serif;font-size:14px;line-height:1.7">${message}</p>
  `

  try {
    await sendMail(`[Ma'aash] Corporate Inquiry – ${org}`, html)
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false })
  }
}
