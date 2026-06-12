import type { AIInsights, ChatMessage, SimulationData } from '../types/simulation'
import { buildChatPrompt, buildInsightsPrompt } from './prompt'
import { gerarInsightsLocais, responderChatLocal } from './heuristics'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim()
const MODEL = import.meta.env.VITE_GEMINI_MODEL?.trim() || 'gemini-2.5-flash'
const ENDPOINT = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

/** Indica se a API key do Gemini está configurada. */
export function hasGeminiKey(): boolean {
  return Boolean(API_KEY)
}

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[]
  error?: { message?: string }
}

async function callGemini(prompt: string, asJson: boolean): Promise<string> {
  const res = await fetch(`${ENDPOINT(MODEL)}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        ...(asJson ? { responseMimeType: 'application/json' } : {}),
      },
    }),
  })

  const json = (await res.json()) as GeminiResponse
  if (!res.ok) {
    throw new Error(json.error?.message || `Erro ${res.status} na API do Gemini.`)
  }

  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? ''
  if (!text) throw new Error('A IA não retornou nenhuma resposta.')
  return text
}

/** Remove cercas de código markdown, caso o modelo as inclua. */
function stripCodeFence(text: string): string {
  return text
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/, '')
    .trim()
}

function parseInsights(text: string): AIInsights {
  const parsed = JSON.parse(stripCodeFence(text)) as Partial<AIInsights>
  return {
    resumo: parsed.resumo ?? '',
    scoreSaude: Math.max(0, Math.min(100, Math.round(parsed.scoreSaude ?? 0))),
    diagnostico: Array.isArray(parsed.diagnostico) ? parsed.diagnostico : [],
    recomendacoes: Array.isArray(parsed.recomendacoes) ? parsed.recomendacoes : [],
    proximosPassos: Array.isArray(parsed.proximosPassos) ? parsed.proximosPassos : [],
    offline: false,
  }
}

/**
 * Gera o diagnóstico financeiro. Usa o Gemini se houver API key;
 * caso contrário, cai na heurística local.
 */
export async function gerarInsights(data: SimulationData): Promise<AIInsights> {
  if (!hasGeminiKey()) {
    return gerarInsightsLocais(data)
  }
  const text = await callGemini(buildInsightsPrompt(data), true)
  return parseInsights(text)
}

/** Envia uma pergunta de acompanhamento. Usa o Gemini ou o fallback local. */
export async function perguntarChat(
  data: SimulationData,
  history: ChatMessage[],
  question: string,
): Promise<string> {
  if (!hasGeminiKey()) {
    return responderChatLocal(question, data)
  }
  return callGemini(buildChatPrompt(data, history, question), false)
}
