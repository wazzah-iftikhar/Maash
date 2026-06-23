import Head from 'next/head'
import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { Job } from '@/data/jobs'
import { JOBS as STATIC_JOBS } from '@/data/jobs'
import { supabase } from '@/lib/supabase'
import JobCard from '@/components/JobCard'
import JobModal from '@/components/JobModal'
import CVModal from '@/components/CVModal'

const ALL = ''

interface Props { jobs: Job[] }

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('active', true)
    .order('posted_date', { ascending: false })

  if (error || !data || data.length === 0) {
    return { props: { jobs: STATIC_JOBS } }
  }

  const jobs: Job[] = data.map((r: any) => ({
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

  return { props: { jobs } }
}

export default function JobsPage({ jobs }: Props) {
  const [country, setCountry] = useState(ALL)
  const [city,    setCity]    = useState(ALL)
  const [field,   setField]   = useState(ALL)
  const [comp,    setComp]    = useState(ALL)
  const [type,    setType]    = useState(ALL)
  const [mode,    setMode]    = useState(ALL)

  const [selected, setSelected] = useState<Job | null>(null)
  const [cvOpen,   setCvOpen]   = useState(false)

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
                  className="w-full px-3 py-2 border border-border rounded text-sm text-charcoal bg-white outline-none focus:border-teal cursor-pointer"
                >
                  <option value="">All</option>
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-[0.65rem] font-semibold uppercase tracking-widest text-muted mb-1.5">Job Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 border border-border rounded text-sm text-charcoal bg-white outline-none focus:border-teal cursor-pointer">
                <option value="">All Types</option>
                <option>Permanent</option>
                <option>Contract</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-[0.65rem] font-semibold uppercase tracking-widest text-muted mb-1.5">Work Mode</label>
              <select value={mode} onChange={e => setMode(e.target.value)} className="w-full px-3 py-2 border border-border rounded text-sm text-charcoal bg-white outline-none focus:border-teal cursor-pointer">
                <option value="">All Modes</option>
                <option>Onsite</option>
                <option>Hybrid</option>
                <option>Remote</option>
              </select>
            </div>

            <button
              onClick={reset}
              className="w-full py-2 text-xs font-semibold text-muted border border-border rounded hover:border-teal hover:text-teal transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* ── Jobs list ── */}
        <div className="flex-1 min-w-0">
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
