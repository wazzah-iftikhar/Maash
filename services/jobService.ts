import { sendMail } from '@/lib/mailer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { supabase } from '@/lib/supabase'
import { hireInquiryEmail } from '@/lib/emailTemplates'
import { JOBS as STATIC_JOBS } from '@/data/jobs'
import type { HireInquiryInput } from '@/lib/validate'
import type { Job } from '@/data/jobs'

export async function getActiveJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('active', true)
    .order('posted_date', { ascending: false })

  if (error || !data || data.length === 0) return STATIC_JOBS

  return data.map((r: any) => ({
    id:           r.id,
    title:        r.title,
    company:      r.company,
    country:      r.country,
    city:         r.city,
    field:        r.field,
    type:         r.type,
    mode:         r.mode,
    comp:         r.comp,
    compRange:    r.comp_range,
    desc:         r.description,
    requirements: r.requirements ?? [],
    postedDate:   r.posted_date,
  }))
}

export async function submitHireInquiry(data: HireInquiryInput) {
  const { company, country, city, workMode, salary, schedule, jd, name, email } = data

  const { error } = await supabaseAdmin.from('hire_inquiries').insert({
    company, country, city, work_mode: workMode, salary, schedule, jd, name, email,
  })
  if (error) throw new Error('Failed to save your inquiry. Please try again.')

  const { subject, html } = hireInquiryEmail(data)
  try {
    await sendMail(subject, html)
  } catch (e) {
    console.error('[jobService] Failed to send hire inquiry email:', e)
  }
}
