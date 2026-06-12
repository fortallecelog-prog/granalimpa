interface ProgressBarProps {
  current: number // etapa atual (1-based)
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100)

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-sm text-muted">
        <span className="font-medium">
          Etapa {current} de {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
