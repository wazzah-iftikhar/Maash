const MAX = {
  short:  200,
  medium: 1000,
  long:   5000,
}

function str(val: unknown, max: number): string {
  if (typeof val !== 'string') return ''
  return val.trim().slice(0, max)
}

function email(val: unknown): string {
  const s = str(val, MAX.short)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : ''
}

export interface HireInquiryInput {
  company: string; country: string; city: string; workMode: string
  salary: string; schedule: string; jd: string; name: string; email: string
}
export function validateHireInquiry(b: Record<string, unknown>): HireInquiryInput | null {
  const result = {
    company:  str(b.company, MAX.short),
    country:  str(b.country, MAX.short),
    city:     str(b.city, MAX.short),
    workMode: str(b.workMode, MAX.short),
    salary:   str(b.salary, MAX.short),
    schedule: str(b.schedule, MAX.short),
    jd:       str(b.jd, MAX.long),
    name:     str(b.name, MAX.short),
    email:    email(b.email),
  }
  if (!result.company || !result.name || !result.email || !result.jd) return null
  return result
}

export interface AssessmentIndividualInput {
  name: string; occupation: string; email: string; phone: string; sections: string; message: string
}
export function validateAssessmentIndividual(b: Record<string, unknown>): AssessmentIndividualInput | null {
  const result = {
    name:       str(b.name, MAX.short),
    occupation: str(b.occupation, MAX.short),
    email:      email(b.email),
    phone:      str(b.phone, MAX.short),
    sections:   str(b.sections, MAX.medium),
    message:    str(b.message, MAX.long),
  }
  if (!result.name || !result.email) return null
  return result
}

export interface AssessmentCorporateInput {
  org: string; contact: string; email: string; phone: string; partnerType: string; teamSize: string; message: string
}
export function validateAssessmentCorporate(b: Record<string, unknown>): AssessmentCorporateInput | null {
  const result = {
    org:         str(b.org, MAX.short),
    contact:     str(b.contact, MAX.short),
    email:       email(b.email),
    phone:       str(b.phone, MAX.short),
    partnerType: str(b.partnerType, MAX.short),
    teamSize:    str(b.teamSize, MAX.short),
    message:     str(b.message, MAX.long),
  }
  if (!result.org || !result.contact || !result.email) return null
  return result
}

export interface CvSubmitInput {
  name: string; email: string; phone: string; role: string; location: string; workMode: string; message: string
}
export function validateCvSubmit(b: Record<string, unknown>): CvSubmitInput | null {
  const result = {
    name:     str(b.name, MAX.short),
    email:    email(b.email),
    phone:    str(b.phone, MAX.short),
    role:     str(b.role, MAX.short),
    location: str(b.location, MAX.short),
    workMode: str(b.workMode, MAX.short),
    message:  str(b.message, MAX.long),
  }
  if (!result.name || !result.email) return null
  return result
}
