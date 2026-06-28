import { Job } from '@/data/jobs'

interface JobCardProps {
  job: Job
  onClick: (job: Job) => void
}

export default function JobCard({ job, onClick }: JobCardProps) {
  return (
    <div
      className="card-hover p-6 cursor-pointer"
      onClick={() => onClick(job)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display text-lg text-navy font-semibold mb-0.5">{job.title}</h3>
          <p className="text-sm text-muted">{job.company}</p>
        </div>
        <span className="text-teal font-semibold text-sm whitespace-nowrap ml-4">{job.comp}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="badge-mode">{job.mode}</span>
        <span className="badge-type">{job.type}</span>
        <span className="badge-field">{job.field}</span>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {job.city}, {job.country}
        </span>
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
          {job.type}
        </span>
      </div>
    </div>
  )
}
