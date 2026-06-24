import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Job } from '@/data/jobs'
import JobCard from '@/components/JobCard'
import JobModal from '@/components/JobModal'
import CVModal from '@/components/CVModal'

const ALL = ''

function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-border p-5 animate-pulse">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
        <div className="h-6 w-16 bg-gray-100 rounded" />
      </div>
      <div className="flex gap-2 mb-3">
        <div className="h-5 w-14 bg-gray-100 rounded" />
        <div className="h-5 w-20 bg-gray-100 rounded" />
        <div className="h-5 w-16 bg-gray-100 rounded" />
      </div>
      <div className="h-3 bg-gray-100 rounded w-full mb-1" />
      <div className="h-3 bg-gray-100 rounded w-4/5" />
    </div>
  )
}

export default function JobsPage() {
  const [jobs,    setJobs]    = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  const [country, setCountry] = useState(ALL)
  const [city,    setCity]    = useState(ALL)
  const [field,   setField]   = useState(ALL)
  const [comp,    setComp]    = useState(ALL)
  const [type,    setType]    = useState(ALL)
  const [mode,    setMode]    = useState(ALL)

  const [selected, setSelected] = useState<Job | null>(null)
  const [cvOpen,   setCvOpen]   = useState(false)

  useEffect(() => {
    fetch('/api/jobs')
      .then(r => r.json())
      .then(data => { setJobs(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const countries  = [...new Set(jobs.map(j => j.country))].sort()
  const cities     = [...new Set(jobs.map(j => j.city))].sort()
  const fields     = [...new Set(jobs.map(j => j.field))].sort()
  const compRanges = [...new Set(jobs.map(j => j.compRange))].sort()

  const filtered = jobs.filter(j =>
    (!country || j.country   === country) &&
    (!city    || j.city      === city)    &&
    (!field   || j.field     === field)   &&
    (!comp    || j.compRange === comp)    &&
    (!type    || j.type      === type)    &&
    (!mode    || j.mode      === mode)
  )

  const reset = () => {
    setCountry(ALL); setCity(ALL); setField(ALL)
    setComp(ALL);    setType(ALL); setMode(ALL)
  }

  return (
    <>
      <Head>
        <title>Open Roles | Ma&apos;aash</title>
        <meta name="description" content="Browse open roles across all industries and levels. Find opportunities that align with your expertise." />
      </Head>

      {/* Hero */}
      <div className="page-hero">
        <div className="inline-flex items-center gap-2 bg-gold/20 px-4 py-1.5 rounded-sm text-gold text-xs font-semibold uppercase tracking-widest mb-4">
          Career Opportunities
        </div>
        <h1>Open Roles</h1>
        <p>Discover opportunities aligned with your expertise and ambitions.</p>
      </div>

      {/* Layout */}
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-8 items-start">

        {/* ── Filter panel ── */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24">
          <div className="bg-offwhite border border-border rounded-xl p-6">
            <h3 className="font-display text-base text-navy mb-5 pb-4 border-b border-border">
              Filter Roles
            </h3>

            {[
              { label: 'Country',          value: country, set: setCountry, opts: countries  },
              { label: 'City',             value: city,    set: setCity,    opts: cities      },
              { label: 'Field / Industry', value: field,   set: setField,   opts: fields      },
              { label: 'Compensation',     value: comp,    set: setComp,    opts: compRanges  },
            ].map(({ label, value, set, opts }) => (
              <div key={label} className="mb-4">
                <label className="block text-[0.65rem] font-semibold uppercase tracking-widest text-muted mb-1.5">
                  {label}
                </label>
                <select
                  value={value}
                  onChange={e => set(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-border rounded text-sm text-charcoal bg-white outline-none focus:border-teal cursor-pointer disabled:opacity-50"
                >
                  <option value="">All</option>
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-[0.65rem] font-semibold uppercase tracking-widest text-muted mb-1.5">Job Type</label>
              <select value={type} onChange={e => setType(e.target.value)} disabled={loading} className="w-full px-3 py-2 border border-border rounded text-sm text-charcoal bg-white outline-none focus:border-teal cursor-pointer disabled:opacity-50">
                <option value="">All Types</option>
                <option>Permanent</option>
                <option>Contract</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-[0.65rem] font-semibold uppercase tracking-widest text-muted mb-1.5">Work Mode</label>
              <select value={mode} onChange={e => setMode(e.target.value)} disabled={loading} className="w-full px-3 py-2 border border-border rounded text-sm text-charcoal bg-white outline-none focus:border-teal cursor-pointer disabled:opacity-50">
                <option value="">All Modes</option>
                <option>Onsite</option>
                <option>Hybrid</option>
                <option>Remote</option>
              </select>
            </div>

            <button
              onClick={reset}
              disabled={loading}
              className="w-full py-2 text-xs font-semibold text-muted border border-border rounded hover:border-teal hover:text-teal transition-colors disabled:opacity-50"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* ── Jobs list ── */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <>
              <div className="h-4 bg-gray-100 rounded w-32 mb-5 animate-pulse" />
              <div className="flex flex-col gap-3">
                {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted mb-5">
                Showing <strong className="text-charcoal">{filtered.length}</strong> open role{filtered.length !== 1 ? 's' : ''}
              </p>

              {filtered.length === 0 ? (
                <div className="text-center py-16 text-muted">
                  <p className="mb-2">No roles match your current filters.</p>
                  <p className="text-sm">Try adjusting filters, or submit your CV to our talent pool below.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filtered.map(job => (
                    <JobCard key={job.id} job={job} onClick={setSelected} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Free CV banner ── */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <div className="bg-gradient-to-br from-navy to-teal rounded-xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-xl text-white mb-1">Don&apos;t See the Right Role?</h3>
            <p className="text-white/65 text-sm">Submit your CV to our talent pool. We&apos;ll reach out when a suitable opportunity arises.</p>
          </div>
          <button
            onClick={() => setCvOpen(true)}
            className="btn-primary whitespace-nowrap flex-shrink-0"
          >
            Submit Your CV
          </button>
        </div>
      </div>

      {/* Modals */}
      <JobModal
        job={selected}
        onClose={() => setSelected(null)}
        onApply={() => { setSelected(null); setCvOpen(true) }}
      />
      <CVModal open={cvOpen} onClose={() => setCvOpen(false)} />
    </>
  )
}
