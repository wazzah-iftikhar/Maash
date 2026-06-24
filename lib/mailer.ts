import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
  port:   Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
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
  if (!process.env.EMAIL_USER) {
    console.log('[MAIL]', subject)
    return
  }
  await transporter.sendMail({
    from:    `"Ma'aash Platform" <${process.env.EMAIL_USER}>`,
    to:      process.env.EMAIL_TO || process.env.EMAIL_USER,
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
