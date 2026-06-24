import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { JOBS as STATIC_JOBS } from '@/data/jobs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('active', true)
    .order('posted_date', { ascending: false })

  if (error || !data || data.length === 0) {
    return res.status(200).json(STATIC_JOBS)
  }

  const jobs = data.map((r: any) => ({
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

  res.status(200).json(jobs)
}
