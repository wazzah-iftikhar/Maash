import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

export default function AdminCallback() {
  const router = useRouter()

  useEffect(() => {
    // Supabase puts tokens in the URL hash — getSession picks them up automatically
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace('/admin')
      } else {
        router.replace('/admin/login')
      }
    })
  }, [router])

  return (
    <div className="min-h-screen bg-[#0F1E3C] flex items-center justify-center">
      <div className="text-white/60 text-sm">Signing you in...</div>
    </div>
  )
}
