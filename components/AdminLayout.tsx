import Link from 'next/link'
import { useRouter } from 'next/router'

const NAV = [
  { href: '/admin',             label: 'Dashboard',   icon: '▦' },
  { href: '/admin/jobs',        label: 'Jobs',         icon: '💼' },
  { href: '/admin/submissions', label: 'Submissions',  icon: '📥' },
]

export default function AdminLayout({
  children,
  onSignOut,
}: {
  children: React.ReactNode
  onSignOut: () => void
}) {
  const { pathname } = useRouter()

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0F1E3C] flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <div className="font-display text-white text-lg font-semibold">Ma&apos;aash</div>
          <div className="text-[0.65rem] text-white/40 uppercase tracking-widest mt-0.5">Admin Panel</div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-gold text-navy font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                }`}
              >
                <span>{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/50 hover:text-white hover:bg-white/8 transition-colors"
          >
            <span>→</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
