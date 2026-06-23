export interface DbJob {
  id: number
  title: string
  company: string
  country: string
  city: string
  field: string
  type: 'Permanent' | 'Contract'
  mode: 'Onsite' | 'Hybrid' | 'Remote'
  comp: string
  comp_range: string
  description: string
  requirements: string[]
  posted_date: string
  active: boolean
  created_at: string
}
