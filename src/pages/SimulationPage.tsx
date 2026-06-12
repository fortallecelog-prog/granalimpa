import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { CurrencyInput } from '../components/CurrencyInput'
import { ProgressBar } from '../components/ProgressBar'
import { QuestionCard } from '../components/QuestionCard'
import { ArrowLeftIcon, ArrowRightIcon, SparklesIcon } from '../components/icons'
import { createSimulation } from '../services/storage'
import {
  OBJETIVO_LABELS,
  type Objetivo,
  type SimulationData,
} from '../types/simulation'

type CurrencyField = 'rendaMensal' | 'gastosFixos' | 'dividas' | 'reservaInvestida'

interface CurrencyStep {
  kind: 'currency'
  field: CurrencyField
  title: string
  description: string
}

interface ObjetivoStep {
  kind: 'objetivo'
  title: string
  description: string
}

type Step = CurrencyStep | ObjetivoStep

const steps: Step[] = [
  {
    kind: 'currency',
    field: 'rendaMensal',
    title: 'Qual é a sua renda mensal?',
    description: 'Some tudo o que entra por mês (salário, freelas, benefícios).',
  },
  {
    kind: 'currency',
    field: 'gastosFixos',
    title: 'Quanto você gasta por mês?',
    description: 'Seus gastos fixos: moradia, contas, alimentação, transporte etc.',
  },
  {
    kind: 'currency',
    field: 'dividas',
    title: 'Quanto você tem em dívidas?',
    description: 'O total que você deve hoje (cartão, empréstimos, financiamentos). Coloque 0 se não tiver.',
  },
  {
    kind: 'currency',
    field: 'reservaInvestida',
    title: 'Quanto você já tem guardado?',
    description: 'Reserva de emergência + investimentos. Coloque 0 se ainda não tiver.',
  },
  {
    kind: 'objetivo',
    title: 'Qual é o seu principal objetivo?',
    description: 'Escolha o que mais importa para você agora e em quanto tempo quer alcançar.',
  },
]

const initialData: SimulationData = {
  rendaMensal: 0,
  gastosFixos: 0,
  dividas: 0,
  reservaInvestida: 0,
  objetivo: 'reserva-emergencia',
  prazoMeses: 12,
}

export function SimulationPage() {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [data, setData] = useState<SimulationData>(initialData)

  const step = steps[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === steps.length - 1

  function setField<K extends keyof SimulationData>(key: K, value: SimulationData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  // Validação: a renda precisa ser > 0; as demais etapas podem ser 0.
  const canAdvance =
    step.kind === 'objetivo' ? data.prazoMeses > 0 : step.field !== 'rendaMensal' || data.rendaMensal > 0

  function next() {
    if (!canAdvance) return
    if (isLast) {
      const sim = createSimulation(data)
      navigate(`/resultado/${sim.id}`)
      return
    }
    setStepIndex((i) => i + 1)
  }

  function back() {
    if (isFirst) {
      navigate('/')
      return
    }
    setStepIndex((i) => i - 1)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <ProgressBar current={stepIndex + 1} total={steps.length} />

      <QuestionCard title={step.title} description={step.description}>
        {step.kind === 'currency' ? (
          <CurrencyInput
            key={step.field}
            value={data[step.field]}
            onChange={(v) => setField(step.field, v)}
            autoFocus
            onEnter={next}
          />
        ) : (
          <ObjetivoFields
            objetivo={data.objetivo}
            prazoMeses={data.prazoMeses}
            onObjetivo={(o) => setField('objetivo', o)}
            onPrazo={(m) => setField('prazoMeses', m)}
          />
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={back}>
            <ArrowLeftIcon />
            {isFirst ? 'Cancelar' : 'Voltar'}
          </Button>

          <Button onClick={next} disabled={!canAdvance}>
            {isLast ? (
              <>
                Gerar diagnóstico
                <SparklesIcon />
              </>
            ) : (
              <>
                Continuar
                <ArrowRightIcon />
              </>
            )}
          </Button>
        </div>
      </QuestionCard>

      {step.kind === 'currency' && step.field !== 'rendaMensal' && (
        <p className="mt-4 text-center text-sm text-muted">
          Não tem esse valor? Deixe em <strong>R$ 0,00</strong> e siga em frente.
        </p>
      )}
    </div>
  )
}

interface ObjetivoFieldsProps {
  objetivo: Objetivo
  prazoMeses: number
  onObjetivo: (o: Objetivo) => void
  onPrazo: (m: number) => void
}

function ObjetivoFields({ objetivo, prazoMeses, onObjetivo, onPrazo }: ObjetivoFieldsProps) {
  const opcoes = Object.entries(OBJETIVO_LABELS) as [Objetivo, string][]

  return (
    <div className="space-y-6">
      <div className="grid gap-2 sm:grid-cols-2">
        {opcoes.map(([value, label]) => {
          const active = objetivo === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => onObjetivo(value)}
              className={[
                'rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors cursor-pointer',
                active
                  ? 'border-brand bg-brand-soft text-brand'
                  : 'border-border bg-surface text-content hover:bg-surface-2',
              ].join(' ')}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-muted">
          Em quanto tempo? <span className="text-content font-semibold">{prazoMeses} meses</span>
        </label>
        <input
          type="range"
          min={1}
          max={60}
          step={1}
          value={prazoMeses}
          onChange={(e) => onPrazo(Number(e.target.value))}
          className="w-full accent-brand"
        />
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>1 mês</span>
          <span>5 anos</span>
        </div>
      </div>
    </div>
  )
}
