import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy text-white/60">
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="font-display text-2xl font-bold text-white mb-3">
              Ma<span className="text-gold">'</span>aash
            </div>
            <p className="text-sm leading-relaxed">
              A boutique talent advisory and human capital platform. Connecting exceptional
              people with aligned opportunities — and equipping organizations to grow.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home',           href: '/' },
                { label: 'Open Roles',     href: '/jobs' },
                { label: 'Assessment',     href: '/assessment' },
                { label: 'Hire via Ma\'aash', href: '/#connect' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm hover:text-gold transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm">
              {['Talent Acquisition', 'Performance Assessment', 'Workforce Advisory', 'Career Coaching', 'HR Compliance'].map(s => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-5 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-white/35">
          <span>© {new Date().getFullYear()} Ma'aash. All rights reserved.</span>
          <span>Talent Advisory · Human Capital · Performance Intelligence</span>
        </div>
      </div>
    </footer>
  )
}
