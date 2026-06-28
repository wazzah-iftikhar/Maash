import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { getCvSignedUrl } from '@/services/cvService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  const supabaseUser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  const { data: { user } } = await supabaseUser.auth.getUser(token)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  const cvPath = typeof req.query.path === 'string' ? req.query.path : null
  if (!cvPath) return res.status(400).json({ error: 'Missing path' })

  try {
    const url = await getCvSignedUrl(cvPath)
    res.status(200).json({ url })
  } catch (e: any) {
    res.status(e.status ?? 500).json({ error: e.message })
  }
}
