import { tableHtml } from './mailer'
import type { AssessmentIndividualInput, AssessmentCorporateInput, HireInquiryInput, CvSubmitInput } from './validate'

const H2 = 'font-family:Georgia,serif;color:#1A1A2E'
const H3 = `${H2};margin-top:20px`
const P  = 'font-family:Inter,sans-serif;font-size:14px;line-height:1.7'

function section(heading: string, content: string) {
  return `<h3 style="${H3}">${heading}</h3><p style="${P}">${content}</p>`
}

export function individualAssessmentEmail(d: AssessmentIndividualInput) {
  return {
    subject: `[Ma'aash] Assessment Request – ${d.name}`,
    html: `
      <h2 style="${H2}">Individual Assessment Request — Ma'aash</h2>
      ${tableHtml({ Name: d.name, Occupation: d.occupation, Email: d.email, Phone: d.phone, 'Sections Requested': d.sections })}
      ${section('Message', d.message)}
    `,
  }
}

export function corporateAssessmentEmail(d: AssessmentCorporateInput) {
  return {
    subject: `[Ma'aash] Corporate Inquiry – ${d.org}`,
    html: `
      <h2 style="${H2}">Corporate Partnership Inquiry — Ma'aash</h2>
      ${tableHtml({ Organization: d.org, 'Contact Person': d.contact, Email: d.email, Phone: d.phone, 'Partnership Type': d.partnerType, 'Team Size': d.teamSize })}
      ${section('Requirements', d.message)}
    `,
  }
}

export function hireInquiryEmail(d: HireInquiryInput) {
  return {
    subject: `[Ma'aash] Hiring Inquiry – ${d.company}`,
    html: `
      <h2 style="${H2}">New Hiring Inquiry — Ma'aash</h2>
      ${tableHtml({ Company: d.company, Country: d.country, City: d.city, 'Work Mode': d.workMode, 'Salary Bracket': d.salary, Schedule: d.schedule, 'Contact Name': d.name, 'Contact Email': d.email })}
      ${section('Job Description', `<span style="white-space:pre-wrap">${d.jd}</span>`)}
    `,
  }
}

export function cvSubmissionEmail(d: CvSubmitInput, cvLink: string) {
  return {
    subject: `[Ma'aash] CV Submission – ${d.name}`,
    html: `
      <h2 style="${H2}">New CV Submission — Ma'aash Talent Pool</h2>
      ${tableHtml({ Name: d.name, Email: d.email, Phone: d.phone, 'Role / Field': d.role, Location: d.location, 'Work Mode Preference': d.workMode })}
      ${section('Career Goals', d.message)}
      ${cvLink ? `<p style="margin-top:16px"><a href="${cvLink}" style="color:#C9A84C">Download CV (link valid 7 days)</a></p>` : ''}
    `,
  }
}
