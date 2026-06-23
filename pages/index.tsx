import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import FormSuccess from '@/components/FormSuccess'

// ── Hero network SVG ──────────────────────────────────────
function HeroNetwork() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.14] pointer-events-none"
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="glow" cx="75%" cy="50%" r="40%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0B4F6C" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="900" cy="350" r="320" fill="url(#glow)" />
      <g stroke="#C9A84C" strokeWidth="0.9" strokeOpacity="0.7" fill="none">
        <line x1="800" y1="200" x2="960" y2="310" />
        <line x1="960" y1="310" x2="1060" y2="185" />
        <line x1="960" y1="310" x2="910" y2="460" />
        <line x1="800" y1="200" x2="700" y2="325" />
        <line x1="910" y1="460" x2="1060" y2="510" />
        <line x1="700" y1="325" x2="810" y2="465" />
        <line x1="810" y1="465" x2="910" y2="460" />
        <line x1="1060" y1="185" x2="1110" y2="330" />
        <line x1="1110" y1="330" x2="1060" y2="510" />
        <line x1="700" y1="325" x2="600" y2="420" />
        <line x1="600" y1="420" x2="810" y2="465" />
      </g>
      <g fill="#C9A84C">
        <circle cx="800" cy="200" r="5.5" fillOpacity="0.9" />
        <circle cx="960" cy="310" r="8.5" fillOpacity="1" />
        <circle cx="1060" cy="185" r="4.5" fillOpacity="0.8" />
        <circle cx="910" cy="460" r="6.5" fillOpacity="0.9" />
        <circle cx="700" cy="325" r="4.5" fillOpacity="0.8" />
        <circle cx="1060" cy="510" r="5" fillOpacity="0.85" />
        <circle cx="810" cy="465" r="4" fillOpacity="0.75" />
        <circle cx="1110" cy="330" r="3.5" fillOpacity="0.7" />
        <circle cx="600" cy="420" r="4" fillOpacity="0.7" />
      </g>
    </svg>
  )
}

// ── Service card ──────────────────────────────────────────
function ServiceCard({ icon, title, desc, tag }: { icon: React.ReactNode; title: string; desc: string; tag: string }) {
  return (
    <div className="card-hover p-7">
      <div className="w-12 h-12 rounded-lg bg-teal-light flex items-center justify-center mb-5">
        {icon}
      </div>
      <h3 className="font-display text-lg text-navy mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed mb-4">{desc}</p>
      <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-teal border border-teal px-2 py-0.5 rounded-sm">
        {tag}
      </span>
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────
function StatCard({ num, label }: { num: string; label: string }) {
  return (
    <div className="bg-white/6 border border-gold/20 rounded-lg p-6 backdrop-blur-sm">
      <div className="font-display text-3xl font-bold text-gold mb-1">{num}</div>
      <div className="text-xs text-white/55 leading-snug">{label}</div>
    </div>
  )
}

// ── Hiring inquiry form ───────────────────────────────────
function HiringForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const data = Object.fromEntries(new FormData(e.currentTarget))
    try {
      await fetch('/api/hire-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (_) {}
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="form-card">
      <h3 className="font-display text-xl text-navy mb-6">Hiring Inquiry Form</h3>

      {submitted ? (
        <FormSuccess message="Your inquiry has been received. We'll be in touch within 48 hours." />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label">Company Name &amp; Product / Service</label>
            <input name="company" required className="form-input" placeholder="e.g. TechCorp – B2B SaaS platform" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Country</label>
              <input name="country" required className="form-input" placeholder="e.g. Pakistan" />
            </div>
            <div>
              <label className="form-label">City</label>
              <input name="city" required className="form-input" placeholder="e.g. Lahore" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Work Mode</label>
              <select name="workMode" className="form-select">
                <option value="">Select...</option>
                <option>Onsite</option>
                <option>Hybrid</option>
                <option>Remote</option>
              </select>
            </div>
            <div>
              <label className="form-label">Salary Bracket</label>
              <input name="salary" className="form-input" placeholder="e.g. PKR 80K – 120K" />
            </div>
          </div>
          <div>
            <label className="form-label">Working Days &amp; Timings</label>
            <input name="schedule" className="form-input" placeholder="e.g. Mon–Fri, 9am–6pm (5 days/week)" />
          </div>
          <div>
            <label className="form-label">Job Description</label>
            <textarea
              name="jd"
              required
              className="form-textarea"
              placeholder="Paste or describe the role requirements, responsibilities, and ideal candidate profile..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Your Name</label>
              <input name="name" required className="form-input" placeholder="Full name" />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input name="email" type="email" required className="form-input" placeholder="work@company.com" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? 'Submitting...' : 'Submit Hiring Request'}
          </button>
        </form>
      )}
    </div>
  )
}

// ── Fade-up hook ──────────────────────────────────────────
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

// ── Page ──────────────────────────────────────────────────
export default function Home() {
  const s1 = useFadeUp(); const s2 = useFadeUp()
  const s3 = useFadeUp(); const s4 = useFadeUp()
  const s5 = useFadeUp(); const s6 = useFadeUp()

  return (
    <>
      <Head>
        <title>Ma'aash | Talent Advisory & Human Capital</title>
      </Head>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center px-6 bg-gradient-to-br from-navy via-[#0F2A4A] to-[#0B3D5C] overflow-hidden">
        <HeroNetwork />
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 py-20">

          {/* Left copy */}
          <div>
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-5">
              <span className="block w-10 h-px bg-gold" />
              Talent Advisory &amp; Human Capital
            </div>
            <h1 className="font-display text-5xl lg:text-6xl text-white leading-tight mb-6">
              Empowering Talent.<br />
              <span className="text-gold">Enhancing</span><br />
              Performance.
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
              Ma&apos;aash is a boutique talent intelligence firm connecting exceptional people
              with aligned opportunities — while equipping individuals and organizations
              with the insights needed to grow.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/jobs" className="btn-primary">Explore Open Roles</Link>
              <Link href="/assessment" className="btn-outline-white">Take Assessment</Link>
            </div>
          </div>

          {/* Right stats grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <StatCard num="C-Suite" label="to Blue Collar — all levels placed" />
            <StatCard num="360°"    label="Performance & personality insights" />
            <StatCard num="100%"    label="Confidential assessment results" />
            <StatCard num="4"       label="Modular assessment sections" />
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div ref={s1} className="fade-up grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Visual card */}
            <div className="relative hidden lg:block">
              <div className="bg-navy rounded-2xl p-10 text-white">
                <h3 className="font-display text-2xl text-gold mb-4">Our Mission</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  To contribute to the seamless integration and growth of employees, ensuring
                  alignment with organizational goals while fostering a positive, compliant,
                  and high-performance workplace culture.
                  <br /><br />
                  We believe talent is the most strategic asset an organization holds — and
                  that every professional deserves a clear understanding of their own operating
                  style and potential.
                </p>
              </div>
              <div className="absolute -bottom-5 -right-5 bg-gold rounded-xl px-6 py-4 text-navy">
                <div className="font-display text-2xl font-bold">Boutique</div>
                <div className="text-xs font-semibold">Advisory Quality</div>
              </div>
            </div>

            {/* Text */}
            <div>
              <div className="section-label">About Ma'aash</div>
              <h2 className="font-display text-4xl text-navy mb-4 leading-tight">
                A Talent Intelligence Partner Built for the Modern Workforce
              </h2>
              <div className="gold-rule" />
              <p className="text-muted text-sm leading-relaxed mb-6">
                Ma&apos;aash operates at the intersection of talent acquisition and human
                performance advisory. We bring deep expertise across the full employment
                spectrum — from frontline operators to board-level executives — with a
                commitment to precision, confidentiality, and lasting organizational fit.
              </p>
              <ul className="divide-y divide-border">
                {[
                  'Technical, Non-Technical, Blue, Grey, White & C-Suite Placements',
                  'Psychometric & Performance Assessment for Individuals',
                  'Human Capital Advisory for Growing Organizations',
                  'Workforce Culture Alignment & Compliance Support',
                  'Career Development Coaching & Talent Mapping',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 py-3 text-sm text-charcoal">
                    <span className="mt-1 w-5 h-5 rounded-full bg-teal flex items-center justify-center text-white text-[0.6rem] font-bold flex-shrink-0">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-24 px-6 bg-offwhite">
        <div className="max-w-6xl mx-auto">
          <div ref={s2} className="fade-up max-w-xl mb-14">
            <div className="section-label">Services</div>
            <h2 className="font-display text-4xl text-navy mb-3">What We Do</h2>
            <div className="gold-rule" />
            <p className="text-muted text-sm leading-relaxed">
              From sourcing to performance intelligence, Ma&apos;aash delivers across the full talent lifecycle.
            </p>
          </div>

          <div ref={s3} className="fade-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <ServiceCard
              tag="All Levels"
              title="Talent Acquisition"
              desc="End-to-end recruitment across all levels and industries. We identify, assess, and present candidates who fit both role requirements and organizational culture."
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B4F6C" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
            />
            <ServiceCard
              tag="Individuals & Teams"
              title="Human Performance Assessment"
              desc="Our proprietary modular assessment evaluates personality, emotional foundations, leadership behavior, and cognitive performance for actionable insights."
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B4F6C" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
            />
            <ServiceCard
              tag="Organizations"
              title="Workforce Advisory"
              desc="Strategic guidance for HR teams and leadership on talent planning, organizational design, culture alignment, and building high-performing teams."
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B4F6C" strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
            />
            <ServiceCard
              tag="Career Growth"
              title="Career Alignment Coaching"
              desc="Personalized sessions helping professionals understand their operating style, map career trajectories, and align their strengths with meaningful opportunities."
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B4F6C" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>}
            />
            <ServiceCard
              tag="HR & Compliance"
              title="HR Compliance & Culture"
              desc="Support in designing compliant people policies and fostering workplace cultures that retain top talent and uphold organizational values."
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B4F6C" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
            />
            <ServiceCard
              tag="Strategy"
              title="Talent Intelligence"
              desc="Market mapping, salary benchmarking, and talent landscape analysis to help organizations make data-informed decisions about their workforce strategy."
              icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0B4F6C" strokeWidth="1.8"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>}
            />
          </div>
        </div>
      </section>

      {/* ── INQUIRY ── */}
      <section id="connect" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div ref={s4} className="fade-up grid grid-cols-1 lg:grid-cols-5 gap-14 items-start">

            {/* Info col */}
            <div className="lg:col-span-2">
              <div className="section-label">Connect</div>
              <h2 className="font-display text-4xl text-navy mb-4 leading-tight">
                Partner with Ma&apos;aash for Your Talent Needs
              </h2>
              <div className="gold-rule" />
              <p className="text-muted text-sm leading-relaxed mb-6">
                Whether you&apos;re an organization looking for top talent or a professional
                seeking your next role, Ma&apos;aash is your advisory partner. Share your
                requirements and we&apos;ll respond within 48 hours.
              </p>
              <ul className="space-y-3">
                {['Talent Acquisition & Recruitment', 'Performance Assessment Services', 'Workforce & HR Advisory', 'Career Development'].map(item => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-charcoal">
                    <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Form col */}
            <div className="lg:col-span-3">
              <HiringForm />
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
