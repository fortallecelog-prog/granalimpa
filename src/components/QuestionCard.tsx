import type { ReactNode } from 'react'

interface QuestionCardProps {
  title: string
  description?: string
  children: ReactNode
}

export function QuestionCard({ title, description, children }: QuestionCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold text-content sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 text-muted">{description}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}
