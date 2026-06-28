import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm, File as FormidableFile, Fields, Files } from 'formidable'
import { checkRateLimit } from '@/lib/rateLimit'
import { uploadCvFile, submitCv } from '@/services/cvService'

export const config = { api: { bodyParser: false } }

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
  if (!await checkRateLimit(ip)) return res.status(429).json({ error: 'Too many requests. Please try again later.' })

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

  const get = (k: string) => { const v = fields[k]; return Array.isArray(v) ? v[0] : v ?? '' }

  const name     = str(get('name'), 200)
  const email    = emailStr(get('email'))
  const phone    = str(get('phone'), 200)
  const role     = str(get('role'), 200)
  const location = str(get('location'), 200)
  const workMode = str(get('workMode'), 200)
  const message  = str(get('message'), 5000)

  if (!name || !email || !role) return res.status(400).json({ error: 'Missing required fields.' })

  let cvPath: string | null = null
  const cvFile = files['cv']
  const file: FormidableFile | undefined = Array.isArray(cvFile) ? cvFile[0] : (cvFile as FormidableFile | undefined)

  if (file && file.size > 0) {
    try {
      cvPath = await uploadCvFile(file, name)
    } catch (e: any) {
      return res.status(e.status ?? 500).json({ error: e.message })
    }
  }

  try {
    await submitCv({ name, email, phone, role, location, workMode, message }, cvPath)
    res.status(200).json({ ok: true })
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}
