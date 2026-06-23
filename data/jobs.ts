export interface Job {
  id: number
  title: string
  company: string
  country: string
  city: string
  field: string
  type: 'Permanent' | 'Contract'
  mode: 'Onsite' | 'Hybrid' | 'Remote'
  comp: string
  compRange: string
  desc: string
  requirements: string[]
  postedDate: string
}

export const JOBS: Job[] = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'Confidential – FinTech',
    country: 'Pakistan', city: 'Karachi',
    field: 'Technology', type: 'Permanent', mode: 'Hybrid',
    comp: 'PKR 300K+', compRange: 'PKR 300K+',
    desc: 'We are seeking a highly skilled Senior Software Engineer to join a growing FinTech startup. You will architect and develop scalable backend services, mentor junior engineers, and collaborate closely with product and design teams to ship world-class financial products.',
    requirements: ['5+ years backend development (Node.js / Python)', 'Experience with microservices and AWS', 'Strong understanding of financial systems & APIs', 'Excellent communication and leadership skills'],
    postedDate: '2025-06-10',
  },
  {
    id: 2,
    title: 'HR Business Partner',
    company: 'Confidential – FMCG',
    country: 'Pakistan', city: 'Lahore',
    field: 'FMCG', type: 'Permanent', mode: 'Onsite',
    comp: 'PKR 150K – 300K', compRange: 'PKR 150K – 300K',
    desc: 'A leading FMCG organization is looking for a strategic HR Business Partner to support business leaders across multiple functions, drive talent programs, and lead organizational development initiatives at scale.',
    requirements: ['6+ years HR experience in FMCG or similar', 'Strong knowledge of Pakistan labour law', 'Proven track record in talent management & OD', 'MBA or HR certification preferred'],
    postedDate: '2025-06-12',
  },
  {
    id: 3,
    title: 'Chief Financial Officer',
    company: 'Confidential – Manufacturing',
    country: 'Pakistan', city: 'Islamabad',
    field: 'Finance', type: 'Permanent', mode: 'Onsite',
    comp: 'PKR 300K+', compRange: 'PKR 300K+',
    desc: 'An established manufacturing group seeks an experienced CFO to oversee financial operations, lead strategic financial planning, and drive cost optimization across multiple business units with a combined turnover exceeding PKR 2 billion.',
    requirements: ['15+ years in financial leadership roles', 'CA / CPA / ACCA qualified', 'Manufacturing sector experience preferred', 'Proven M&A, fundraising, or restructuring experience'],
    postedDate: '2025-06-08',
  },
  {
    id: 4,
    title: 'Digital Marketing Manager',
    company: 'Confidential – E-Commerce',
    country: 'UAE', city: 'Dubai',
    field: 'Retail', type: 'Permanent', mode: 'Hybrid',
    comp: 'USD 2K – 5K/mo', compRange: 'USD 2K – 5K/mo',
    desc: 'A fast-growing e-commerce brand in Dubai is looking for a data-driven Digital Marketing Manager to lead performance marketing, brand campaigns, and growth strategies across Meta, Google, TikTok, and email channels.',
    requirements: ['4+ years digital marketing experience', 'Expertise in Meta Ads, Google Ads, and SEO', 'Strong analytical mindset with a data-first approach', 'E-commerce or DTC brand background preferred'],
    postedDate: '2025-06-15',
  },
  {
    id: 5,
    title: 'Clinical Coordinator',
    company: 'Confidential – Healthcare',
    country: 'Saudi Arabia', city: 'Riyadh',
    field: 'Healthcare', type: 'Contract', mode: 'Onsite',
    comp: 'USD 2K – 5K/mo', compRange: 'USD 2K – 5K/mo',
    desc: 'A reputable healthcare facility in Riyadh is seeking a Clinical Coordinator to manage patient care coordination, liaise between clinical departments, and ensure quality care delivery standards are consistently maintained.',
    requirements: ['Nursing or allied health degree required', '3+ years in clinical coordination', 'HAAD / DHA or Saudi MOH license', 'Excellent interpersonal and organizational skills'],
    postedDate: '2025-06-05',
  },
  {
    id: 6,
    title: 'Production Supervisor',
    company: 'Confidential – Manufacturing',
    country: 'Pakistan', city: 'Karachi',
    field: 'Manufacturing', type: 'Permanent', mode: 'Onsite',
    comp: 'PKR 80K – 150K', compRange: 'PKR 80K – 150K',
    desc: 'A manufacturing company seeks an experienced production supervisor to oversee daily floor operations, manage shift teams, and ensure production targets, quality standards, and safety protocols are consistently met.',
    requirements: ['3+ years production supervision', 'Engineering or technical educational background', 'Strong team leadership and communication skills', 'Solid knowledge of quality control processes & ISO standards'],
    postedDate: '2025-06-18',
  },
  {
    id: 7,
    title: 'Senior Business Analyst',
    company: 'Confidential – Technology Consultancy',
    country: 'UK', city: 'London',
    field: 'Technology', type: 'Contract', mode: 'Remote',
    comp: 'USD 5K+/mo', compRange: 'USD 5K+/mo',
    desc: 'A UK-based technology consultancy is seeking a Senior Business Analyst for a 6-month contract to support a large-scale digital transformation project with a Tier 1 financial services client.',
    requirements: ['6+ years BA experience in enterprise environments', 'Financial services domain knowledge essential', 'Exceptional stakeholder management skills', 'Agile / Scrum certified (preferred)'],
    postedDate: '2025-06-01',
  },
  {
    id: 8,
    title: 'Accounts Manager – SME Portfolio',
    company: 'Confidential – Financial Services',
    country: 'Pakistan', city: 'Lahore',
    field: 'Finance', type: 'Permanent', mode: 'Hybrid',
    comp: 'PKR 80K – 150K', compRange: 'PKR 80K – 150K',
    desc: 'A financial services firm is hiring an Accounts Manager to manage a portfolio of SME clients, build strong relationships, and drive revenue growth within the small and medium enterprise segment across Lahore.',
    requirements: ['3+ years in SME banking, leasing, or financial services', 'Strong client relationship management skills', 'Target-driven mindset with a hunter mentality', 'Finance degree or CFA level 1 preferred'],
    postedDate: '2025-06-20',
  },
]

export const COUNTRIES  = [...new Set(JOBS.map(j => j.country))].sort()
export const CITIES     = [...new Set(JOBS.map(j => j.city))].sort()
export const FIELDS     = [...new Set(JOBS.map(j => j.field))].sort()
export const COMP_RANGES = [...new Set(JOBS.map(j => j.compRange))].sort()
