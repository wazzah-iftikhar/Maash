import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  // Verify the caller is an authenticated admin via Bearer token
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

  // Prevent path traversal
  if (cvPath.includes('..') || cvPath.startsWith('/')) {
    return res.status(400).json({ error: 'Invalid path' })
  }

  const { data, error } = await supabaseAdmin.storage
    .from('cvs')
    .createSignedUrl(cvPath, 60) // 60 seconds — enough to open the download

  if (error || !data?.signedUrl) return res.status(500).json({ error: 'Could not generate link' })

  res.status(200).json({ url: data.signedUrl })
}
