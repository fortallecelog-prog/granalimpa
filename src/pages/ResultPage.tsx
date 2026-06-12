import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { ChatBox } from '../components/ChatBox'
import { InsightsView } from '../components/InsightsView'
import { SimulationSummary } from '../components/SimulationSummary'
import { AlertIcon, ArrowLeftIcon, SparklesIcon } from '../components/icons'
import { gerarInsights } from '../services/gemini'
import { getSimulation, setInsights } from '../services/storage'
import type { Simulation } from '../types/simulation'

type Status = 'idle' | 'loading' | 'error'

export function ResultPage() {
  const { id = '' } = useParams()
  const [simulation, setSimulation] = useState<Simulation | undefined>(() => getSimulation(id))
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const requestedFor = useRef<string | null>(null) // evita chamadas duplicadas

  const generate = useCallback(async () => {
    const sim = getSimulation(id)
    if (!sim) return
    setStatus('loading')
    setError(null)
    try {
      const insights = await gerarInsights(sim.data)
      const updated = setInsights(id, insights) ?? { ...sim, insights }
      setSimulation(updated)
      setStatus('idle')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível gerar o diagnóstico.')
      setStatus('error')
    }
  }, [id])

  // Gera automaticamente na primeira vez (apenas se ainda não houver insights).
  useEffect(() => {
    const sim = getSimulation(id)
    if (!sim || sim.insights || requestedFor.current === id) return
    requestedFor.current = id
    void generate()
  }, [id, generate])

  if (!simulation) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <AlertIcon className="mx-auto text-warn" width={40} height={40} />
        <h1 className="mt-4 text-2xl font-bold text-content">Simulação não encontrada</h1>
        <p className="mt-2 text-muted">
          Não achamos uma simulação com o ID <code>{id}</code>. Ela pode ter sido removida.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button to="/simular">Fazer nova simulação</Button>
          <Button to="/historico" variant="secondary">
            Ver histórico
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex items-center justify-between gap-3">
        <Link to="/historico" className="inline-flex items-center gap-1 text-sm text-muted hover:text-content">
          <ArrowLeftIcon width={16} height={16} />
          Histórico
        </Link>
        <Button to="/simular" variant="secondary" size="sm">
          Nova simulação
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-content">Seu diagnóstico</h1>
        <p className="mt-1 text-muted">Resumo dos dados que você informou:</p>
        <div className="mt-4">
          <SimulationSummary data={simulation.data} />
        </div>
      </div>

      {status === 'loading' && (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-surface py-16 text-center">
          <SparklesIcon className="animate-pulse text-brand" width={32} height={32} />
          <p className="font-semibold text-content">Analisando suas finanças...</p>
          <p className="text-sm text-muted">Gerando seu diagnóstico personalizado.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-3xl border border-danger/30 bg-danger/5 p-6 text-center">
          <AlertIcon className="mx-auto text-danger" width={32} height={32} />
          <p className="mt-3 font-semibold text-content">Erro ao gerar o diagnóstico</p>
          <p className="mt-1 text-sm text-muted">{error}</p>
          <Button className="mt-4" onClick={generate}>
            Tentar novamente
          </Button>
        </div>
      )}

      {simulation.insights && status !== 'loading' && (
        <>
          <InsightsView insights={simulation.insights} />
          <ChatBox
            simulationId={simulation.id}
            data={simulation.data}
            initialMessages={simulation.chat}
          />
        </>
      )}
    </div>
  )
}
