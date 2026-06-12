import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { ArrowRightIcon, HistoryIcon, TrashIcon, WalletIcon } from '../components/icons'
import { deleteSimulation, getSimulations } from '../services/storage'
import { OBJETIVO_LABELS, type Simulation } from '../types/simulation'
import { formatBRL } from '../utils/currency'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function HistoryPage() {
  const [items, setItems] = useState<Simulation[]>(() => getSimulations())

  function handleDelete(id: string) {
    deleteSimulation(id)
    setItems(getSimulations())
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <HistoryIcon className="mx-auto text-muted" width={40} height={40} />
        <h1 className="mt-4 text-2xl font-bold text-content">Nenhuma simulação ainda</h1>
        <p className="mt-2 text-muted">
          Faça sua primeira simulação para receber um diagnóstico financeiro personalizado.
        </p>
        <Button className="mt-6" to="/simular">
          Começar simulação
          <ArrowRightIcon />
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-content">Histórico</h1>
          <p className="mt-1 text-muted">
            {items.length} {items.length === 1 ? 'simulação salva' : 'simulações salvas'} neste navegador.
          </p>
        </div>
        <Button to="/simular" size="sm">
          Nova
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((sim) => {
          const sobra = sim.data.rendaMensal - sim.data.gastosFixos
          return (
            <div
              key={sim.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-colors hover:bg-surface-2"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <WalletIcon />
              </span>

              <Link to={`/resultado/${sim.id}`} className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-content">
                    {OBJETIVO_LABELS[sim.data.objetivo]}
                  </span>
                  {sim.insights && (
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold text-brand">
                      Score {sim.insights.scoreSaude}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 truncate text-sm text-muted">
                  Renda {formatBRL(sim.data.rendaMensal)} · Sobra {formatBRL(sobra)} ·{' '}
                  {formatDate(sim.createdAt)}
                </div>
              </Link>

              <button
                type="button"
                onClick={() => handleDelete(sim.id)}
                aria-label="Excluir simulação"
                title="Excluir"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger cursor-pointer"
              >
                <TrashIcon width={18} height={18} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
