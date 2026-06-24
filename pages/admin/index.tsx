import Head from 'next/head'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/lib/adminAuth'
import { supabase } from '@/lib/supabase'

interface Counts {
  jobs: number
  hire_inquiries: number
  assessment_individual: number
  assessment_corporate: number
  cv_submissions: number
}

function StatCard({ label, count, icon }: { label: string; count: number; icon: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="text-2xl mb-3">{icon}</div>
      <div className="font-display text-3xl font-bold text-navy mb-1">{count}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}

export default function AdminDashboard() {
  const { loading, signOut } = useAdminAuth()
  const [counts, setCounts] = useState<Counts>({ jobs: 0, hire_inquiries: 0, assessment_individual: 0, assessment_corporate: 0, cv_submissions: 0 })

  useEffect(() => {
    if (loading) return
    Promise.all([
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('hire_inquiries').select('*', { count: 'exact', head: true }),
      supabase.from('assessment_individual').select('*', { count: 'exact', head: true }),
      supabase.from('assessment_corporate').select('*', { count: 'exact', head: true }),
      supabase.from('cv_submissions').select('*', { count: 'exact', head: true }),
    ]).then(([jobs, hire, indiv, corp, cv]) => {
      setCounts({
        jobs:                  jobs.count  ?? 0,
        hire_inquiries:        hire.count  ?? 0,
        assessment_individual: indiv.count ?? 0,
        assessment_corporate:  corp.count  ?? 0,
        cv_submissions:        cv.count    ?? 0,
      })
    })
  }, [loading])

  if (loading) return null

  return (
    <>
      <Head><title>Dashboard | Ma&apos;aash Admin</title></Head>
      <AdminLayout onSignOut={signOut}>
        <h1 className="font-display text-2xl text-navy mb-8">Dashboard</h1>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <StatCard label="Active Jobs"              count={counts.jobs}                  icon="💼" />
          <StatCard label="Hiring Inquiries"         count={counts.hire_inquiries}         icon="📋" />
          <StatCard label="Individual Assessments"   count={counts.assessment_individual}  icon="👤" />
          <StatCard label="Corporate Assessments"    count={counts.assessment_corporate}   icon="🏢" />
          <StatCard label="CV Submissions"           count={counts.cv_submissions}         icon="📄" />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-4 text-sm text-amber-800">
          <strong>Tip:</strong> Use the <strong>Jobs</strong> page to add or edit listings. Use <strong>Submissions</strong> to view all incoming inquiries and CVs.
        </div>
      </AdminLayout>
    </>
  )
}
