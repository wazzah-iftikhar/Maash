import Head from 'next/head'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAdminAuth } from '@/lib/adminAuth'
import { supabase } from '@/lib/supabase'
import { DbJob } from '@/types/database'

const EMPTY = {
  title: '', company: '', country: '', city: '', field: '',
  type: 'Permanent', mode: 'Onsite', comp: '', comp_range: '',
  description: '', requirements: '', active: true,
}

export default function AdminJobs() {
  const { loading, signOut } = useAdminAuth()
  const [jobs,      setJobs]      = useState<DbJob[]>([])
  const [fetching,  setFetching]  = useState(true)
  const [showForm,  setShowForm]  = useState(false)
  const [editing,   setEditing]   = useState<DbJob | null>(null)
  const [form,      setForm]      = useState<typeof EMPTY>({ ...EMPTY })
  const [saving,    setSaving]    = useState(false)

  const load = async () => {
    setFetching(true)
    const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
    setJobs(data ?? [])
    setFetching(false)
  }

  useEffect(() => { if (!loading) load() }, [loading])

  const openNew = () => {
    setEditing(null)
    setForm({ ...EMPTY })
    setShowForm(true)
  }

  const openEdit = (job: DbJob) => {
    setEditing(job)
    setForm({
      title: job.title, company: job.company, country: job.country, city: job.city,
      field: job.field, type: job.type, mode: job.mode, comp: job.comp,
      comp_range: job.comp_range, description: job.description,
      requirements: job.requirements.join('\n'), active: job.active,
    })
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      requirements: form.requirements.split('\n').map(r => r.trim()).filter(Boolean),
    }
    if (editing) {
      await supabase.from('jobs').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('jobs').insert({ ...payload, posted_date: new Date().toISOString().split('T')[0] })
    }
    setSaving(false)
    setShowForm(false)
    load()
  }

  const toggleActive = async (job: DbJob) => {
    await supabase.from('jobs').update({ active: !job.active }).eq('id', job.id)
    load()
  }

  const deleteJob = async (id: number) => {
    if (!confirm('Delete this job? This cannot be undone.')) return
    await supabase.from('jobs').delete().eq('id', id)
    load()
  }

  if (loading) return null

  return (
    <>
      <Head><title>Jobs | Ma&apos;aash Admin</title></Head>
      <AdminLayout onSignOut={signOut}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl text-navy">Job Listings</h1>
          <button onClick={openNew} className="btn-primary text-sm px-4 py-2">+ Add Job</button>
        </div>

        {fetching ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Title', 'Location', 'Field', 'Type', 'Mode', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-navy">{job.title}</div>
                      <div className="text-xs text-gray-400">{job.company}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{job.city}, {job.country}</td>
                    <td className="px-4 py-3 text-gray-600">{job.field}</td>
                    <td className="px-4 py-3 text-gray-600">{job.type}</td>
                    <td className="px-4 py-3 text-gray-600">{job.mode}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(job)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${job.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {job.active ? 'Live' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(job)} className="text-xs text-teal hover:underline">Edit</button>
                        <button onClick={() => deleteJob(job.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="font-display text-lg text-navy">{editing ? 'Edit Job' : 'Add New Job'}</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="form-label">Job Title</label>
                    <input required className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Senior Software Engineer" />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Company</label>
                    <input required className="form-input" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="e.g. Confidential – FinTech" />
                  </div>
                  <div>
                    <label className="form-label">Country</label>
                    <input required className="form-input" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="e.g. Pakistan" />
                  </div>
                  <div>
                    <label className="form-label">City</label>
                    <input required className="form-input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="e.g. Karachi" />
                  </div>
                  <div>
                    <label className="form-label">Field / Industry</label>
                    <input required className="form-input" value={form.field} onChange={e => setForm(f => ({ ...f, field: e.target.value }))} placeholder="e.g. Technology" />
                  </div>
                  <div>
                    <label className="form-label">Compensation</label>
                    <input required className="form-input" value={form.comp} onChange={e => setForm(f => ({ ...f, comp: e.target.value, comp_range: e.target.value }))} placeholder="e.g. PKR 150K – 300K" />
                  </div>
                  <div>
                    <label className="form-label">Job Type</label>
                    <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                      <option>Permanent</option>
                      <option>Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Work Mode</label>
                    <select className="form-select" value={form.mode} onChange={e => setForm(f => ({ ...f, mode: e.target.value }))}>
                      <option>Onsite</option>
                      <option>Hybrid</option>
                      <option>Remote</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Description</label>
                    <textarea required className="form-textarea" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the role..." />
                  </div>
                  <div className="col-span-2">
                    <label className="form-label">Requirements (one per line)</label>
                    <textarea className="form-textarea" rows={4} value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} placeholder={"5+ years experience\nStrong communication skills"} />
                  </div>
                  <div className="col-span-2 flex items-center gap-3">
                    <input type="checkbox" id="active" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="w-4 h-4 accent-teal" />
                    <label htmlFor="active" className="text-sm text-charcoal">Publish immediately (visible on site)</label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Job'}</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-outline-dark">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminLayout>
    </>
  )
}
