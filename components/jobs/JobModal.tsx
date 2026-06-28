import { useEffect } from 'react'
import { Job } from '@/data/jobs'
import { HiX } from 'react-icons/hi'

interface JobModalProps {
  job: Job | null
  onClose: () => void
  onApply: () => void
}

export default function JobModal({ job, onClose, onApply }: JobModalProps) {
  useEffect(() => {
    if (!job) return
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [job, onClose])

  if (!job) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-navy/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-8 max-w-xl w-full max-h-[85vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted hover:text-navy transition-colors"
          aria-label="Close"
        >
          <HiX size={22} />
        </button>

        <h2 className="font-display text-2xl text-navy mb-1">{job.title}</h2>
        <p className="text-sm text-muted mb-4">{job.company}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="badge-mode">{job.mode}</span>
          <span className="badge-type">{job.type}</span>
          <span className="badge-field">{job.field}</span>
        </div>

        <div className="flex flex-wrap gap-5 text-sm text-muted mb-6">
          <span>📍 {job.city}, {job.country}</span>
          <span className="text-teal font-semibold">{job.comp}</span>
        </div>

        <p className="text-sm text-charcoal leading-relaxed mb-5">{job.desc}</p>

        <h4 className="font-display text-base text-navy mb-3">Requirements</h4>
        <ul className="space-y-2 mb-7">
          {job.requirements.map((r, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
              {r}
            </li>
          ))}
        </ul>

        <button onClick={onApply} className="btn-primary w-full justify-center">
          Apply / Submit CV
        </button>
      </div>
    </div>
  )
}
