import { OBJETIVO_LABELS, type SimulationData } from '../types/simulation'
import { formatBRL } from '../utils/currency'

export function SimulationSummary({ data }: { data: SimulationData }) {
  const sobra = data.rendaMensal - data.gastosFixos
  const items = [
    { label: 'Renda mensal', value: formatBRL(data.rendaMensal) },
    { label: 'Gastos fixos', value: formatBRL(data.gastosFixos) },
    {
      label: 'Sobra mensal',
      value: formatBRL(sobra),
      tone: sobra < 0 ? 'text-danger' : 'text-good',
    },
    { label: 'Dívidas', value: formatBRL(data.dividas) },
    { label: 'Guardado', value: formatBRL(data.reservaInvestida) },
    {
      label: 'Objetivo',
      value: `${OBJETIVO_LABELS[data.objetivo]} · ${data.prazoMeses} meses`,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((it) => (
        <div key={it.label} className="rounded-2xl border border-border bg-surface p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-muted">
            {it.label}
          </div>
          <div className={`mt-1 font-bold ${it.tone ?? 'text-content'}`}>{it.value}</div>
        </div>
      ))}
    </div>
  )
}
