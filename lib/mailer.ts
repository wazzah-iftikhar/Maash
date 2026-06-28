import nodemailer from 'nodemailer'
import { env } from './env'

const transporter = nodemailer.createTransport({
  host:   env.EMAIL_HOST,
  port:   env.EMAIL_PORT,
  secure: false,
  auth: {
    user: env.EMAIL_USER ?? '',
    pass: env.EMAIL_PASS ?? '',
  },
})

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

export async function sendMail(subject: string, html: string) {
  if (!env.EMAIL_USER) {
    console.log('[mailer] No EMAIL_USER set — skipping send:', subject)
    return
  }
  await transporter.sendMail({
    from:    `"Ma'aash Platform" <${env.EMAIL_USER}>`,
    to:      env.EMAIL_TO ?? env.EMAIL_USER,
    subject: escapeHtml(subject),
    html,
  })
}

export function tableHtml(data: Record<string, string>) {
  const rows = Object.entries(data)
    .map(([k, v]) => `<tr>
      <td style="padding:6px 12px;font-weight:600;background:#f5f4f1;border:1px solid #e2ddd5">${escapeHtml(k)}</td>
      <td style="padding:6px 12px;border:1px solid #e2ddd5">${escapeHtml(v || '—')}</td>
    </tr>`)
    .join('')
  return `<table style="border-collapse:collapse;width:100%;font-family:Inter,sans-serif;font-size:14px">${rows}</table>`
}
