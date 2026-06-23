interface FormSuccessProps {
  message?: string
}

export default function FormSuccess({ message = "Your submission has been received. We'll be in touch within 48 hours." }: FormSuccessProps) {
  return (
    <div className="mt-4 p-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
      ✓ {message}
    </div>
  )
}
