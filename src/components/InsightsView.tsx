import type { AIInsights, NivelDiagnostico } from '../types/simulation'
import { AlertIcon, CheckIcon, SparklesIcon } from './icons'

const nivelStyles: Record<NivelDiagnostico, { box: string; badge: string; label: string }> = {
  bom: {
    box: 'border-good/30 bg-good/5',
    badge: 'bg-good/15 text-good',
    label: 'Bom',
  },
  atencao: {
    box: 'border-warn/30 bg-warn/5',
    badge: 'bg-warn/15 text-warn',
    label: 'Atenção',
  },
  critico: {
    box: 'border-danger/30 bg-danger/5',
    badge: 'bg-danger/15 text-danger',
    label: 'Crítico',
  },
}

function ScoreRing({ score }: { score: number }) {
  const tone = score >= 75 ? 'text-good' : score >= 50 ? 'text-warn' : 'text-danger'
  const radius = 52
  const circ = 2 * Math.PI * radius
  const offset = circ * (1 - score / 100)

  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} className="stroke-surface-2" strokeWidth="10" fill="none" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          className={`${tone} transition-all duration-700`}
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-extrabold ${tone}`}>{score}</span>
        <span className="text-xs text-muted">de 100</span>
      </div>
    </div>
  )
}

export function InsightsView({ insights }: { insights: AIInsights }) {
  return (
    <div className="space-y-6">
      {/* Resumo + score */}
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-border bg-surface p-6 sm:flex-row sm:p-8">
        <ScoreRing score={insights.scoreSaude} />
        <div className="text-center sm:text-left">
          <h2 className="flex items-center justify-center gap-2 text-xl font-bold text-content sm:justify-start">
            <SparklesIcon className="text-brand" />
            Saúde financeira
          </h2>
          <p className="mt-2 text-muted">{insights.resumo}</p>
        </div>
      </div>

      {/* Diagnóstico */}
      <section>
        <h3 className="mb-3 text-lg font-bold text-content">Diagnóstico</h3>
        <div className="grid gap-3">
          {insights.diagnostico.map((d, i) => {
            const s = nivelStyles[d.nivel] ?? nivelStyles.atencao
            return (
              <div key={i} className={`rounded-2xl border p-4 ${s.box}`}>
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-content">{d.titulo}</h4>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.badge}`}>
                    {s.label}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">{d.texto}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Recomendações */}
      <section className="rounded-3xl border border-border bg-surface p-6">
        <h3 className="mb-3 text-lg font-bold text-content">Recomendações</h3>
        <ul className="space-y-2">
          {insights.recomendacoes.map((r, i) => (
            <li key={i} className="flex gap-3 text-sm text-content">
              <CheckIcon width={18} height={18} className="mt-0.5 shrink-0 text-brand" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Próximos passos */}
      <section className="rounded-3xl border border-brand/30 bg-brand-soft/50 p-6">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-content">
          Próximos passos (30 dias)
        </h3>
        <ol className="space-y-3">
          {insights.proximosPassos.map((p, i) => (
            <li key={i} className="flex gap-3 text-sm text-content">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-fg">
                {i + 1}
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ol>
      </section>

      {insights.offline && (
        <p className="flex items-center justify-center gap-2 rounded-xl border border-warn/30 bg-warn/10 px-4 py-2 text-center text-sm text-warn">
          <AlertIcon width={16} height={16} />
          Gerado em modo offline (heurística local). Configure a chave do Gemini para análise com IA.
        </p>
      )}
    </div>
  )
}
