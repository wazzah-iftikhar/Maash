import { sendMail } from '@/lib/mailer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { individualAssessmentEmail, corporateAssessmentEmail } from '@/lib/emailTemplates'
import type { AssessmentIndividualInput, AssessmentCorporateInput } from '@/lib/validate'

export async function submitIndividualAssessment(data: AssessmentIndividualInput) {
  const { name, occupation, email, phone, sections, message } = data

  const { error } = await supabaseAdmin.from('assessment_individual').insert({
    name, occupation, email, phone, sections, message,
  })
  if (error) throw new Error('Failed to save assessment request.')

  const { subject, html } = individualAssessmentEmail(data)
  try {
    await sendMail(subject, html)
  } catch (e) {
    console.error('[assessmentService] Failed to send individual assessment email:', e)
  }
}

export async function submitCorporateAssessment(data: AssessmentCorporateInput) {
  const { org, contact, email, phone, partnerType, teamSize, message } = data

  const { error } = await supabaseAdmin.from('assessment_corporate').insert({
    org, contact, email, phone, partner_type: partnerType, team_size: teamSize, message,
  })
  if (error) throw new Error('Failed to save corporate inquiry.')

  const { subject, html } = corporateAssessmentEmail(data)
  try {
    await sendMail(subject, html)
  } catch (e) {
    console.error('[assessmentService] Failed to send corporate assessment email:', e)
  }
}
