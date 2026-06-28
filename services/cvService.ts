import fs from 'fs'
import path from 'path'
import { sendMail } from '@/lib/mailer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { cvSubmissionEmail } from '@/lib/emailTemplates'
import type { File as FormidableFile } from 'formidable'

const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

export interface CvSubmitData {
  name: string; email: string; phone: string
  role: string; location: string; workMode: string; message: string
}

export async function uploadCvFile(file: FormidableFile, name: string): Promise<string> {
  if (!ALLOWED_MIME.has(file.mimetype ?? '')) {
    throw Object.assign(new Error('Invalid file type. Please upload a PDF, DOC, or DOCX.'), { status: 400 })
  }
  const ext = path.extname(file.originalFilename ?? file.newFilename ?? '.pdf')
  const storagePath = `${Date.now()}-${name.replace(/[^a-z0-9]/gi, '_')}${ext}`
  const buffer = fs.readFileSync(file.filepath)

  const { error } = await supabaseAdmin.storage
    .from('cvs')
    .upload(storagePath, buffer, { contentType: file.mimetype ?? 'application/octet-stream' })
  if (error) throw new Error('Failed to upload CV. Please try again.')

  return storagePath
}

export async function submitCv(data: CvSubmitData, cvPath: string | null) {
  const { name, email, phone, role, location, workMode, message } = data

  const { error } = await supabaseAdmin.from('cv_submissions').insert({
    name, email, phone, role, location, work_mode: workMode, message, cv_path: cvPath,
  })
  if (error) throw new Error('Failed to save your submission. Please try again.')

  let cvLink = ''
  if (cvPath) {
    const { data: signed } = await supabaseAdmin.storage
      .from('cvs')
      .createSignedUrl(cvPath, 60 * 60 * 24 * 7)
    if (signed?.signedUrl) cvLink = signed.signedUrl
  }

  const { subject, html } = cvSubmissionEmail({ name, email, phone, role, location, workMode, message }, cvLink)
  try {
    await sendMail(subject, html)
  } catch (e) {
    console.error('[cvService] Failed to send CV submission email:', e)
  }
}

export async function getCvSignedUrl(cvPath: string): Promise<string> {
  if (cvPath.includes('..') || cvPath.startsWith('/')) {
    throw Object.assign(new Error('Invalid path'), { status: 400 })
  }
  const { data, error } = await supabaseAdmin.storage
    .from('cvs')
    .createSignedUrl(cvPath, 60)
  if (error || !data?.signedUrl) throw new Error('Could not generate link')
  return data.signedUrl
}
