import { useState, useEffect } from 'react'
import { HiX } from 'react-icons/hi'
import FormSuccess from './FormSuccess'

interface CVModalProps {
  open: boolean
  onClose: () => void
}

export default function CVModal({ open, onClose }: CVModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    if (!open) return
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    try {
      await fetch('/api/cv-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    } catch (_) {}

    setLoading(false)
    setSubmitted(true)
    setTimeout(onClose, 2500)
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-navy/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-muted hover:text-navy">
          <HiX size={22} />
        </button>

        <h2 className="font-display text-2xl text-navy mb-1">Submit Your CV</h2>
        <p className="text-sm text-muted mb-6 leading-relaxed">
          We'll keep your profile on file and reach out personally when a suitable opportunity arises.
        </p>

        {submitted ? (
          <FormSuccess message="Profile received. We'll be in touch when a match arises." />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Full Name</label>
              <input name="name" required className="form-input" placeholder="Your name" />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input name="email" type="email" required className="form-input" placeholder="your@email.com" />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input name="phone" className="form-input" placeholder="+92 300 0000000" />
            </div>
            <div>
              <label className="form-label">Current Role / Field</label>
              <input name="role" required className="form-input" placeholder="e.g. Marketing Manager – 5 yrs exp" />
            </div>
            <div>
              <label className="form-label">Location</label>
              <input name="location" className="form-input" placeholder="City, Country" />
            </div>
            <div>
              <label className="form-label">Preferred Work Mode</label>
              <select name="workMode" className="form-select">
                <option>Open to all</option>
                <option>Onsite only</option>
                <option>Hybrid</option>
                <option>Remote only</option>
              </select>
            </div>
            <div>
              <label className="form-label">Career Goals / Message</label>
              <textarea name="message" className="form-textarea" placeholder="Briefly describe your background and what you're looking for..." />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Submitting...' : 'Submit Profile'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
