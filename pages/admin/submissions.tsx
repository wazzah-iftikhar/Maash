import Head from 'next/head'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { useAdminAuth } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase'

type Tab = 'hire' | 'individual' | 'corporate' | 'cv'

const TABS: { key: Tab; label: string; table: string }[] = [
  { key: 'hire',       label: 'Hiring Inquiries',       table: 'hire_inquiries' },
  { key: 'individual', label: 'Individual Assessments',  table: 'assessment_individual' },
  { key: 'corporate',  label: 'Corporate Assessments',   table: 'assessment_corporate' },
  { key: 'cv',         label: 'CV Submissions',          table: 'cv_submissions' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function HireTable({ rows }: { rows: any[] }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b"><tr>{['Date','Name','Email','Company','Location','Mode','Salary'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>)}</tr></thead>
      <tbody className="divide-y divide-gray-100">
        {rows.map(r => (
          <tr key={r.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(r.created_at)}</td>
            <td className="px-4 py-3 font-medium text-navy">{r.name}</td>
            <td className="px-4 py-3 text-gray-600">{r.email}</td>
            <td className="px-4 py-3 text-gray-600">{r.company}</td>
            <td className="px-4 py-3 text-gray-600">{r.city}, {r.country}</td>
            <td className="px-4 py-3 text-gray-600">{r.work_mode}</td>
            <td className="px-4 py-3 text-gray-600">{r.salary}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function IndividualTable({ rows }: { rows: any[] }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b"><tr>{['Date','Name','Email','Occupation','Phone','Sections'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>)}</tr></thead>
      <tbody className="divide-y divide-gray-100">
        {rows.map(r => (
          <tr key={r.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(r.created_at)}</td>
            <td className="px-4 py-3 font-medium text-navy">{r.name}</td>
            <td className="px-4 py-3 text-gray-600">{r.email}</td>
            <td className="px-4 py-3 text-gray-600">{r.occupation}</td>
            <td className="px-4 py-3 text-gray-600">{r.phone}</td>
            <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{r.sections}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CorporateTable({ rows }: { rows: any[] }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b"><tr>{['Date','Organization','Contact','Email','Phone','Partnership','Team Size'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>)}</tr></thead>
      <tbody className="divide-y divide-gray-100">
        {rows.map(r => (
          <tr key={r.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(r.created_at)}</td>
            <td className="px-4 py-3 font-medium text-navy">{r.org}</td>
            <td className="px-4 py-3 text-gray-600">{r.contact}</td>
            <td className="px-4 py-3 text-gray-600">{r.email}</td>
            <td className="px-4 py-3 text-gray-600">{r.phone}</td>
            <td className="px-4 py-3 text-gray-600">{r.partner_type}</td>
            <td className="px-4 py-3 text-gray-600">{r.team_size}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function CvTable({ rows }: { rows: any[] }) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b"><tr>{['Date','Name','Email','Phone','Role / Field','Location','Mode'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>)}</tr></thead>
      <tbody className="divide-y divide-gray-100">
        {rows.map(r => (
          <tr key={r.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(r.created_at)}</td>
            <td className="px-4 py-3 font-medium text-navy">{r.name}</td>
            <td className="px-4 py-3 text-gray-600">{r.email}</td>
            <td className="px-4 py-3 text-gray-600">{r.phone}</td>
            <td className="px-4 py-3 text-gray-600">{r.role}</td>
            <td className="px-4 py-3 text-gray-600">{r.location}</td>
            <td className="px-4 py-3 text-gray-600">{r.work_mode}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function AdminSubmissions() {
  const { loading, signOut } = useAdminAuth()
  const [tab,  setTab]  = useState<Tab>('hire')
  const [rows, setRows] = useState<any[]>([])
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (loading) return
    const t = TABS.find(t => t.key === tab)!
    setFetching(true)
    supabaseAdmin.from(t.table).select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setRows(data ?? []); setFetching(false) })
  }, [tab, loading])

  if (loading) return null

  return (
    <>
      <Head><title>Submissions | Ma&apos;aash Admin</title></Head>
      <AdminLayout onSignOut={signOut}>
        <h1 className="font-display text-2xl text-navy mb-6">Submissions</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === t.key ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          {fetching ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No submissions yet.</div>
          ) : (
            <>
              {tab === 'hire'       && <HireTable       rows={rows} />}
              {tab === 'individual' && <IndividualTable  rows={rows} />}
              {tab === 'corporate'  && <CorporateTable   rows={rows} />}
              {tab === 'cv'         && <CvTable          rows={rows} />}
            </>
          )}
        </div>
      </AdminLayout>
    </>
  )
}
