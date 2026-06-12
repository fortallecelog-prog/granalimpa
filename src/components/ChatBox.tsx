import { useState } from 'react'
import type { ChatMessage, SimulationData } from '../types/simulation'
import { perguntarChat } from '../services/gemini'
import { appendChat } from '../services/storage'
import { SendIcon, SparklesIcon } from './icons'

interface ChatBoxProps {
  simulationId: string
  data: SimulationData
  initialMessages: ChatMessage[]
}

const sugestoes = [
  'Por onde eu começo?',
  'Como monto minha reserva de emergência?',
  'Vale a pena investir agora?',
]

export function ChatBox({ simulationId, data, initialMessages }: ChatBoxProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function send(question: string) {
    const text = question.trim()
    if (!text || loading) return

    const userMsg: ChatMessage = { role: 'user', content: text }
    const history = messages
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const answer = await perguntarChat(data, history, text)
      const botMsg: ChatMessage = { role: 'assistant', content: answer }
      setMessages((m) => [...m, botMsg])
      appendChat(simulationId, [userMsg, botMsg])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao falar com a IA.')
      setMessages((m) => m.slice(0, -1)) // desfaz a mensagem do usuário
      setInput(text)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-3xl border border-border bg-surface p-6">
      <h3 className="flex items-center gap-2 text-lg font-bold text-content">
        <SparklesIcon className="text-brand" />
        Converse com o Grana Limpa
      </h3>
      <p className="mt-1 text-sm text-muted">
        Tire dúvidas sobre o seu diagnóstico e receba orientações personalizadas.
      </p>

      <div className="mt-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {sugestoes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm text-content transition-colors hover:bg-brand-soft hover:text-brand cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
          >
            <div
              className={[
                'max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm',
                m.role === 'user'
                  ? 'bg-brand text-brand-fg'
                  : 'border border-border bg-surface-2 text-content',
              ].join(' ')}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-border bg-surface-2 px-4 py-2.5 text-sm text-muted">
              <span className="inline-flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted" />
              </span>
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-danger">{error}</p>}

      <form
        className="mt-4 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          send(input)
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escreva sua pergunta..."
          className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-content outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Enviar"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-brand-fg transition-colors hover:bg-brand-strong disabled:opacity-50 cursor-pointer"
        >
          <SendIcon />
        </button>
      </form>
    </section>
  )
}
