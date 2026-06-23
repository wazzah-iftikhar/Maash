import type { NextApiRequest, NextApiResponse } from 'next'
import { sendMail, tableHtml } from '@/lib/mailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, occupation, email, phone, sections, message } = req.body

  const html = `
    <h2 style="font-family:Georgia,serif;color:#1A1A2E">Individual Assessment Request — Ma'aash</h2>
    ${tableHtml({ Name: name, Occupation: occupation, Email: email, Phone: phone, 'Sections Requested': sections })}
    <h3 style="font-family:Georgia,serif;color:#1A1A2E;margin-top:20px">Message</h3>
    <p style="font-family:Inter,sans-serif;font-size:14px;line-height:1.7">${message}</p>
  `

  try {
    await sendMail(`[Ma'aash] Assessment Request – ${name}`, html)
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false })
  }
}
