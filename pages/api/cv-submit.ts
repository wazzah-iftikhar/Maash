import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm, File as FormidableFile, Fields, Files } from 'formidable'
import fs from 'fs'
import path from 'path'
import { sendMail, tableHtml } from '@/lib/mailer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { checkRateLimit } from '@/lib/rateLimit'

export const config = { api: { bodyParser: false } }

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])
const MAX_FILE_BYTES = 5 * 1024 * 1024

function str(val: unknown, max: number): string {
  if (typeof val !== 'string') return ''
  return val.trim().slice(0, max)
}
function emailStr(val: unknown): string {
  const s = str(val, 200)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : ''
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? 'unknown'
  if (!checkRateLimit(ip)) return res.status(429).json({ error: 'Too many requests. Please try again later.' })

  const form = new IncomingForm({ maxFileSize: MAX_FILE_BYTES, keepExtensions: true })

  let fields: Fields<string>
  let files: Files<string>

  try {
    ;[fields, files] = await new Promise((resolve, reject) =>
      form.parse(req, (err, f, v) => (err ? reject(err) : resolve([f, v])))
    )
  } catch {
    return res.status(400).json({ error: 'Invalid form data or file too large.' })
  }

  const get = (k: string) => {
    const v = fields[k]
    return Array.isArray(v) ? v[0] : v ?? ''
  }

  const name     = str(get('name'), 200)
  const email    = emailStr(get('email'))
  const phone    = str(get('phone'), 200)
  const role     = str(get('role'), 200)
  const location = str(get('location'), 200)
  const workMode = str(get('workMode'), 200)
  const message  = str(get('message'), 5000)

  if (!name || !email || !role) return res.status(400).json({ error: 'Missing required fields.' })

  // Handle optional CV file upload
  let cvPath: string | null = null
  const cvFile = files['cv']
  const file: FormidableFile | undefined = Array.isArray(cvFile) ? cvFile[0] : (cvFile as FormidableFile | undefined)

  if (file && file.size > 0) {
    if (!ALLOWED_MIME.has(file.mimetype ?? '')) {
      return res.status(400).json({ error: 'Invalid file type. Please upload a PDF, DOC, or DOCX.' })
    }

    const ext = path.extname(file.originalFilename ?? file.newFilename ?? '.pdf')
    const storagePath = `${Date.now()}-${name.replace(/[^a-z0-9]/gi, '_')}${ext}`
    const buffer = fs.readFileSync(file.filepath)

    const { error: uploadErr } = await supabaseAdmin.storage
      .from('cvs')
      .upload(storagePath, buffer, { contentType: file.mimetype ?? 'application/octet-stream' })

    if (uploadErr) return res.status(500).json({ error: 'Failed to upload CV. Please try again.' })

    cvPath = storagePath
  }

  const { error: dbErr } = await supabaseAdmin.from('cv_submissions').insert({
    name, email, phone, role, location, work_mode: workMode, message, cv_path: cvPath,
  })
  if (dbErr) return res.status(500).json({ error: 'Failed to save your submission. Please try again.' })

  // Generate a 7-day signed URL for the email notification only
  let emailCvLink = ''
  if (cvPath) {
    const { data: signed } = await supabaseAdmin.storage
      .from('cvs')
      .createSignedUrl(cvPath, 60 * 60 * 24 * 7)
    if (signed?.signedUrl) emailCvLink = signed.signedUrl
  }

  const html = `
    <h2 style="font-family:Georgia,serif;color:#1A1A2E">New CV Submission — Ma'aash Talent Pool</h2>
    ${tableHtml({ Name: name, Email: email, Phone: phone, 'Role / Field': role, Location: location, 'Work Mode Preference': workMode })}
    <h3 style="font-family:Georgia,serif;color:#1A1A2E;margin-top:20px">Career Goals</h3>
    <p style="font-family:Inter,sans-serif;font-size:14px;line-height:1.7">${message}</p>
    ${emailCvLink ? `<p style="margin-top:16px"><a href="${emailCvLink}" style="color:#C9A84C">Download CV (link valid 7 days)</a></p>` : ''}
  `

  try { await sendMail(`[Ma'aash] CV Submission – ${name}`, html) } catch (_) {}

  res.status(200).json({ ok: true })
}
