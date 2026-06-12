export type Objetivo =
  | 'quitar-dividas'
  | 'reserva-emergencia'
  | 'investir-futuro'
  | 'comprar-bem'
  | 'aumentar-renda'

export const OBJETIVO_LABELS: Record<Objetivo, string> = {
  'quitar-dividas': 'Quitar dívidas',
  'reserva-emergencia': 'Criar reserva de emergência',
  'investir-futuro': 'Investir para o futuro',
  'comprar-bem': 'Comprar um bem (carro, casa...)',
  'aumentar-renda': 'Aumentar minha renda',
}

/** Respostas brutas do formulário de simulação. */
export interface SimulationData {
  rendaMensal: number
  gastosFixos: number
  dividas: number
  reservaInvestida: number
  objetivo: Objetivo
  prazoMeses: number
}

export type NivelDiagnostico = 'bom' | 'atencao' | 'critico'

export interface DiagnosticoItem {
  titulo: string
  texto: string
  nivel: NivelDiagnostico
}

/** Resultado gerado pela IA (ou pela heurística local de fallback). */
export interface AIInsights {
  resumo: string
  scoreSaude: number // 0 a 100
  diagnostico: DiagnosticoItem[]
  recomendacoes: string[]
  proximosPassos: string[]
  /** true quando gerado pela heurística local (sem a API do Gemini). */
  offline?: boolean
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/** Uma simulação completa persistida no localStorage. */
export interface Simulation {
  id: string
  createdAt: string
  data: SimulationData
  insights?: AIInsights
  chat: ChatMessage[]
}
