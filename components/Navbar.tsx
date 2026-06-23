import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { HiMenu, HiX } from 'react-icons/hi'

const NAV_LINKS = [
  { label: 'Home',          href: '/' },
  { label: 'Opportunities', href: '/jobs' },
  { label: 'Assessment',    href: '/assessment' },
]

export default function Navbar() {
  const router  = useRouter()
  const [open,     setOpen]     = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setOpen(false) }, [router.pathname])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy/98 shadow-xl' : 'bg-navy/95'
      } backdrop-blur-md border-b border-gold/20`}
    >
      <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <LogoMark />
          <span className="font-display text-2xl font-bold text-white tracking-wide">
            Ma<span className="text-gold">'</span>aash
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-xs font-semibold uppercase tracking-widest transition-colors duration-200 ${
                  router.pathname === href ? 'text-gold' : 'text-white/75 hover:text-gold'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/#connect" className="btn-primary text-xs px-5 py-2.5">
              Connect
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="md:hidden text-white p-1"
          aria-label="Toggle menu"
        >
          {open ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-navy border-t border-white/10 px-6 py-5 flex flex-col gap-5">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-semibold uppercase tracking-widest ${
                router.pathname === href ? 'text-gold' : 'text-white/75'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link href="/#connect" className="btn-primary text-sm self-start">
            Connect
          </Link>
        </div>
      )}
    </nav>
  )
}

function LogoMark() {
  return (
    <svg width="36" height="36" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="19" cy="19" r="17.5" stroke="#C9A84C" strokeWidth="1.5"/>
      <circle cx="19" cy="12" r="4" fill="#C9A84C"/>
      <circle cx="10" cy="26" r="3" fill="rgba(201,168,76,0.6)"/>
      <circle cx="28" cy="26" r="3" fill="rgba(201,168,76,0.6)"/>
      <line x1="19" y1="16" x2="10" y2="23.2" stroke="#C9A84C" strokeWidth="1.3" strokeOpacity="0.75"/>
      <line x1="19" y1="16" x2="28" y2="23.2" stroke="#C9A84C" strokeWidth="1.3" strokeOpacity="0.75"/>
      <line x1="10" y1="26" x2="28" y2="26" stroke="#C9A84C" strokeWidth="1.3" strokeOpacity="0.4"/>
    </svg>
  )
}
