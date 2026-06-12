import { Button } from '../components/Button'
import {
  AlertIcon,
  ArrowRightIcon,
  HistoryIcon,
  SparklesIcon,
  WalletIcon,
} from '../components/icons'
import { hasGeminiKey } from '../services/gemini'

const features = [
  {
    icon: WalletIcon,
    title: 'Simulação em etapas',
    text: 'Responda algumas perguntas simples sobre renda, gastos, dívidas e objetivos.',
  },
  {
    icon: SparklesIcon,
    title: 'Diagnóstico com IA',
    text: 'A IA analisa seus números e gera um diagnóstico, recomendações e próximos passos.',
  },
  {
    icon: HistoryIcon,
    title: 'Histórico e chat',
    text: 'Tudo fica salvo no seu navegador. Volte quando quiser e tire dúvidas com a IA.',
  },
]

export function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-10 text-center sm:py-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-muted">
          <SparklesIcon width={16} height={16} className="text-brand" />
          Educador financeiro com IA
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-content sm:text-6xl">
          Deixe sua <span className="text-brand">grana limpa</span> e
          organizada
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
          Faça uma simulação rápida da sua vida financeira e receba um diagnóstico
          personalizado, com recomendações práticas e os próximos passos para
          alcançar seus objetivos.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button to="/simular" size="lg">
            Começar simulação
            <ArrowRightIcon />
          </Button>
          <Button to="/historico" size="lg" variant="secondary">
            Ver histórico
          </Button>
        </div>

        {!hasGeminiKey() && (
          <p className="mx-auto mt-6 max-w-xl rounded-xl border border-warn/30 bg-warn/10 px-4 py-3 text-sm text-warn">
            <AlertIcon width={16} height={16} className="mr-1.5 inline align-text-bottom" />
            Modo offline: sem a chave do Gemini, o diagnóstico é gerado por uma
            heurística local. Configure o{' '}
            <code className="rounded bg-warn/15 px-1 font-mono">.env</code> para
            usar a IA.
          </p>
        )}
      </section>

      <section className="grid w-full gap-4 sm:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-border bg-surface p-6 text-left"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <f.icon />
            </span>
            <h3 className="mt-4 text-lg font-bold text-content">{f.title}</h3>
            <p className="mt-1 text-sm text-muted">{f.text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
