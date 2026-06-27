import { useState, useEffect } from 'react'
import { HiX } from 'react-icons/hi'
import FormSuccess from './FormSuccess'

interface CVModalProps {
  open: boolean
  onClose: () => void
}

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const ACCEPTED_EXT = '.pdf,.doc,.docx'
const MAX_SIZE_MB = 5

export default function CVModal({ open, onClose }: CVModalProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [fileError, setFileError] = useState('')
  const [error, setError]         = useState('')
  const [fileName, setFileName]   = useState('')

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileError('')
    setFileName('')
    if (!file) return
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError('Please upload a PDF, DOC, or DOCX file.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`File must be under ${MAX_SIZE_MB}MB.`)
      e.target.value = ''
      return
    }
    setFileName(file.name)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (fileError) return
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const res = await fetch('/api/cv-submit', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong. Please try again.'); setLoading(false); return }
    } catch (_) {
      setError('Network error. Please try again.')
      setLoading(false)
      return
    }

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
            <div>
              <label className="form-label">
                Attach CV <span className="text-muted font-normal">(optional — PDF, DOC, DOCX · max 5MB)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-navy/20 bg-white text-sm text-navy group-hover:border-gold group-hover:text-gold transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
                  </svg>
                  {fileName ? 'Change file' : 'Choose file'}
                </span>
                {fileName && <span className="text-sm text-muted truncate max-w-[180px]">{fileName}</span>}
                <input
                  type="file"
                  name="cv"
                  accept={ACCEPTED_EXT}
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
              {fileError && <p className="text-red-500 text-xs mt-1">{fileError}</p>}
            </div>
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            <button type="submit" disabled={loading || !!fileError} className="btn-primary w-full justify-center">
              {loading ? 'Submitting...' : 'Submit Profile'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
