import type { ChatMessage, SimulationData } from '../types/simulation'
import { OBJETIVO_LABELS } from '../types/simulation'
import { formatBRL } from '../utils/currency'

/** Descreve os dados da simulação em texto, para injetar no prompt. */
export function descreverSimulacao(data: SimulationData): string {
  const sobra = data.rendaMensal - data.gastosFixos
  return [
    `- Renda mensal: ${formatBRL(data.rendaMensal)}`,
    `- Gastos fixos mensais: ${formatBRL(data.gastosFixos)}`,
    `- Sobra mensal estimada: ${formatBRL(sobra)}`,
    `- Dívidas totais: ${formatBRL(data.dividas)}`,
    `- Reserva/investimentos atuais: ${formatBRL(data.reservaInvestida)}`,
    `- Objetivo principal: ${OBJETIVO_LABELS[data.objetivo]}`,
    `- Prazo desejado para o objetivo: ${data.prazoMeses} meses`,
  ].join('\n')
}

/** Monta o prompt que pede um diagnóstico financeiro em JSON estruturado. */
export function buildInsightsPrompt(data: SimulationData): string {
  return `Você é o "Grana Limpa", um educador financeiro brasileiro, didático, acolhedor e direto.
Analise a situação financeira da pessoa abaixo e gere um diagnóstico personalizado.

DADOS DA PESSOA:
${descreverSimulacao(data)}

REGRAS:
- Fale em português do Brasil, em tom claro e encorajador, sem jargão difícil.
- Seja específico: cite os números da pessoa quando fizer sentido.
- Não invente dados que não foram informados.
- O campo "scoreSaude" é um inteiro de 0 a 100 representando a saúde financeira geral.
- "diagnostico": 3 a 5 itens. Cada "nivel" deve ser "bom", "atencao" ou "critico".
- "recomendacoes": 3 a 5 ações práticas e priorizadas.
- "proximosPassos": 3 passos concretos para os próximos 30 dias.

Responda APENAS com um JSON válido, sem texto antes ou depois, neste formato exato:
{
  "resumo": "string (2-3 frases)",
  "scoreSaude": 0,
  "diagnostico": [{ "titulo": "string", "texto": "string", "nivel": "bom|atencao|critico" }],
  "recomendacoes": ["string"],
  "proximosPassos": ["string"]
}`
}

/** Monta o prompt do chat de acompanhamento, com o contexto da simulação e o histórico. */
export function buildChatPrompt(
  data: SimulationData,
  history: ChatMessage[],
  question: string,
): string {
  const historico = history
    .map((m) => `${m.role === 'user' ? 'Pessoa' : 'Grana Limpa'}: ${m.content}`)
    .join('\n')

  return `Você é o "Grana Limpa", um educador financeiro brasileiro. Continue ajudando a pessoa
com base na simulação dela. Responda de forma curta, prática e em português do Brasil.

SITUAÇÃO FINANCEIRA:
${descreverSimulacao(data)}

${historico ? `CONVERSA ATÉ AGORA:\n${historico}\n` : ''}
PERGUNTA DA PESSOA:
${question}

Responda apenas com o texto da sua resposta (sem JSON, sem markdown de cabeçalho).`
}
