import Head from 'next/head'
import { useState } from 'react'
import FormSuccess from '@/components/FormSuccess'


const MODULES = [
  {
    num: '01',
    title: 'Personality & Operating Style',
    topics: ['Social Energy & Interaction Preferences', 'Information Processing Style', 'Decision-Making Approach', 'Structure & Work Approach'],
  },
  {
    num: '02',
    title: 'Emotional Foundations & Performance Impact',
    topics: ['Early Influences on Work Behavior', 'Self-Regulation Under Stress', 'Resilience & Confidence Under Pressure'],
  },
  {
    num: '03',
    title: 'Relational Dynamics, Accountability & Leadership',
    topics: ['Authority Response & Leadership Style', 'Boundary Setting & Communication', 'Trust & Interpersonal Risk', 'Ownership & Accountability'],
  },
  {
    num: '04',
    title: 'Brain Function, Cognitive & Executive Performance',
    topics: ['Focus & Attention Management', 'Planning & Organization', 'Adaptability & Emotional Control', 'Goal Setting & Execution'],
  },
]

// ── Module card ───────────────────────────────────────────
function ModuleCard({
  mod, selected, onToggle,
}: {
  mod: typeof MODULES[0]
  selected: boolean
  onToggle: () => void
}) {
  return (
    <div
      onClick={onToggle}
      className={`relative bg-white rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
        selected ? 'border-teal bg-teal-light' : 'border-border hover:border-teal'
      }`}
    >
      {/* Check circle */}
      <div
        className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all text-white text-xs font-bold ${
          selected ? 'bg-teal border-teal' : 'border-border'
        }`}
      >
        {selected && '✓'}
      </div>

      <div className={`font-display text-4xl font-bold leading-none mb-4 transition-colors ${selected ? 'text-teal' : 'text-border'}`}>
        {mod.num}
      </div>
      <h3 className="font-display text-base text-navy mb-4 leading-snug pr-6">{mod.title}</h3>
      <ul className="space-y-1.5">
        {mod.topics.map(t => (
          <li key={t} className="flex items-start gap-2 text-xs text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}


// ── Individual form ───────────────────────────────────────
function IndividualForm({ selectedModules }: { selectedModules: number[] }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  const sectionLabel = selectedModules.length === 0
    ? 'None selected (specify in message)'
    : selectedModules.length === 4
    ? 'Full Assessment (all 4 sections)'
    : selectedModules.map(n => `Section ${n}`).join(', ')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const data = { ...Object.fromEntries(new FormData(e.currentTarget)), sections: sectionLabel }
    try {
      await fetch('/api/assessment-individual', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (_) {}
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="form-card">
      <h3 className="font-display text-xl text-navy mb-1">Individual Assessment Request</h3>
      <p className="text-sm text-muted mb-5 leading-relaxed">
        For professionals seeking self-awareness, career clarity, leadership insight, or personal development.
      </p>
      <p className="text-sm text-muted mb-5">Fill in your details below and we'll reach out to you directly.</p>
      {submitted ? (
        <FormSuccess message="Request received. We'll reach out within 48 hours to proceed." />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Full Name</label>
            <input name="name" required className="form-input" placeholder="Your full name" />
          </div>
          <div>
            <label className="form-label">Occupation / Role</label>
            <input name="occupation" required className="form-input" placeholder="e.g. Senior Manager, Engineer, Student" />
          </div>
          <div>
            <label className="form-label">Email Address</label>
            <input name="email" type="email" required className="form-input" placeholder="your@email.com" />
          </div>
          <div>
            <label className="form-label">Contact Number</label>
            <input name="phone" className="form-input" placeholder="+92 300 0000000" />
          </div>
          <div>
            <label className="form-label">Sections of Interest</label>
            <div className="form-input bg-teal-light border-teal text-teal font-medium text-sm">
              {sectionLabel}
            </div>
            <p className="text-[0.7rem] text-muted mt-1">Select sections above, or specify below.</p>
          </div>
          <div>
            <label className="form-label">Message or Query</label>
            <textarea
              name="message"
              className="form-textarea"
              placeholder="Tell us what you'd like to gain from this assessment, or any specific areas you want to explore..."
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? 'Submitting...' : 'Submit Assessment Request'}
          </button>
        </form>
      )}
    </div>
  )
}

// ── Corporate form ────────────────────────────────────────
function CorporateForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const data = Object.fromEntries(new FormData(e.currentTarget))
    try {
      await fetch('/api/assessment-corporate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (_) {}
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="form-card">
      <h3 className="font-display text-xl text-navy mb-1">Corporate Partnership Inquiry</h3>
      <p className="text-sm text-muted mb-5 leading-relaxed">
        For organizations seeking team assessments, talent advisory, office visits, or institutional collaboration.
      </p>
      <p className="text-sm text-muted mb-5">Fill in your details below and we'll reach out to you directly.</p>
      {submitted ? (
        <FormSuccess message="Inquiry received. Our advisory team will contact you shortly." />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Organization Name</label>
            <input name="org" required className="form-input" placeholder="Company or institution name" />
          </div>
          <div>
            <label className="form-label">Contact Person &amp; Title</label>
            <input name="contact" required className="form-input" placeholder="e.g. Sarah Ahmed – Head of HR" />
          </div>
          <div>
            <label className="form-label">Business Email</label>
            <input name="email" type="email" required className="form-input" placeholder="hr@company.com" />
          </div>
          <div>
            <label className="form-label">Contact Number</label>
            <input name="phone" className="form-input" placeholder="+92 300 0000000" />
          </div>
          <div>
            <label className="form-label">Nature of Partnership</label>
            <select name="partnerType" className="form-select">
              <option>Team Assessment Program</option>
              <option>Leadership Development Initiative</option>
              <option>Office Visit &amp; Presentation</option>
              <option>Talent Advisory Retainer</option>
              <option>Recruitment Collaboration</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="form-label">Team Size (approximate)</label>
            <select name="teamSize" className="form-select">
              <option>1–10 employees</option>
              <option>11–50 employees</option>
              <option>51–200 employees</option>
              <option>200+ employees</option>
            </select>
          </div>
          <div>
            <label className="form-label">Message / Requirements</label>
            <textarea
              name="message"
              className="form-textarea"
              placeholder="Describe what you're looking for, your organization's goals, and how Ma'aash can support you..."
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? 'Submitting...' : 'Submit Partnership Inquiry'}
          </button>
        </form>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────
export default function AssessmentPage() {
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const toggle = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const selectAll = () => setSelected(new Set([1, 2, 3, 4]))

  const summary = selected.size === 0
    ? 'No sections selected'
    : selected.size === 4
    ? 'Full assessment (all 4 sections) selected'
    : `${selected.size} section${selected.size > 1 ? 's' : ''} selected`

  return (
    <>
      <Head>
        <title>Human Performance Assessment | Ma'aash</title>
        <meta name="description" content="Book a modular self-awareness and performance assessment with Ma'aash. Confidential, professional, actionable insights." />
      </Head>

      {/* Hero */}
      <div className="page-hero pb-20">
        <div className="inline-flex items-center gap-2 bg-gold/20 px-4 py-1.5 rounded-sm text-gold text-xs font-semibold uppercase tracking-widest mb-4">
          Human Capital Intelligence
        </div>
        <h1>Human Operating Style &<br />Performance Assessment</h1>
        <p className="max-w-xl mx-auto">
          A professional framework to help you understand how you think, relate, lead, and perform.
        </p>
      </div>

      {/* Module selection */}
      <section className="py-16 px-6 bg-offwhite">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="section-label justify-center"><span className="w-0 !hidden" />Assessment Modules</div>
            <h2 className="font-display text-3xl text-navy mb-4">Choose Your Assessment Sections</h2>
            <div className="gold-rule mx-auto" />
            <p className="text-sm text-muted leading-relaxed mb-3">
              Our assessment spans four specialized modules. Select one, several, or all four sections.
              All results are personally reviewed and delivered by the Ma&apos;aash team.
            </p>
            <p className="text-sm text-muted leading-relaxed mb-4">
              There are no &ldquo;good&rdquo; or &ldquo;bad&rdquo; outcomes. All responses are strictly confidential
              and reviewed with professional care.
            </p>
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded px-4 py-2 text-xs text-amber-800 font-medium">
              ✦ Results are manually reviewed and sent to you personally by Ma&apos;aash — not auto-generated
            </div>
          </div>

          {/* Module grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {MODULES.map((mod, i) => (
              <ModuleCard
                key={mod.num}
                mod={mod}
                selected={selected.has(i + 1)}
                onToggle={() => toggle(i + 1)}
              />
            ))}
          </div>

          {/* Summary row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-border">
            <p className="text-sm text-teal font-medium">{summary}</p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={selectAll} className="btn-outline-dark text-sm px-4 py-2">
                Select All Sections
              </button>
              <a href="#request" className="btn-primary text-sm px-4 py-2">
                Request This Assessment ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Forms */}
      <section id="request" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="section-label justify-center"><span className="!hidden" />Get Started</div>
            <h2 className="font-display text-3xl text-navy mb-3">Request Your Assessment</h2>
            <div className="gold-rule mx-auto" />
            <p className="text-sm text-muted max-w-xl mx-auto">
              Complete a request below and our team will be in touch to schedule and deliver your personalized assessment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IndividualForm selectedModules={[...selected].sort()} />
            <CorporateForm />
          </div>
        </div>
      </section>
    </>
  )
}
