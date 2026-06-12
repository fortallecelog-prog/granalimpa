import type { AIInsights, DiagnosticoItem, SimulationData } from '../types/simulation'
import { OBJETIVO_LABELS } from '../types/simulation'
import { formatBRL, formatPercent } from '../utils/currency'

/**
 * Diagnóstico financeiro calculado localmente (sem IA).
 * Usado como fallback quando a API key do Gemini não está configurada,
 * para que o app continue 100% funcional.
 */
export function gerarInsightsLocais(data: SimulationData): AIInsights {
  const { rendaMensal, gastosFixos, dividas, reservaInvestida, objetivo, prazoMeses } = data

  const sobra = rendaMensal - gastosFixos
  const taxaComprometimento = rendaMensal > 0 ? gastosFixos / rendaMensal : 1
  const taxaPoupanca = rendaMensal > 0 ? Math.max(0, sobra) / rendaMensal : 0
  const mesesReserva = gastosFixos > 0 ? reservaInvestida / gastosFixos : 0
  const dividaRenda = rendaMensal > 0 ? dividas / rendaMensal : 0

  const diagnostico: DiagnosticoItem[] = []
  let score = 100

  // Comprometimento da renda
  if (taxaComprometimento <= 0.5) {
    diagnostico.push({
      titulo: 'Gastos sob controle',
      texto: `Seus gastos fixos consomem ${formatPercent(taxaComprometimento)} da renda — abaixo da metade, o que é saudável e te dá margem para guardar dinheiro.`,
      nivel: 'bom',
    })
  } else if (taxaComprometimento <= 0.75) {
    score -= 15
    diagnostico.push({
      titulo: 'Gastos fixos elevados',
      texto: `Seus gastos fixos consomem ${formatPercent(taxaComprometimento)} da renda. O ideal é ficar abaixo de 50%. Vale revisar assinaturas e despesas recorrentes.`,
      nivel: 'atencao',
    })
  } else {
    score -= 30
    diagnostico.push({
      titulo: 'Orçamento no limite',
      texto: `Seus gastos fixos consomem ${formatPercent(taxaComprometimento)} da renda, sobrando muito pouco (${formatBRL(sobra)}/mês). Esse é o ponto mais urgente a atacar.`,
      nivel: 'critico',
    })
  }

  // Sobra mensal
  if (sobra < 0) {
    score -= 25
    diagnostico.push({
      titulo: 'Você está no vermelho',
      texto: `Suas despesas superam a renda em ${formatBRL(Math.abs(sobra))} por mês. É essencial reequilibrar isso antes de pensar em investir.`,
      nivel: 'critico',
    })
  } else if (taxaPoupanca >= 0.2) {
    diagnostico.push({
      titulo: 'Boa capacidade de poupança',
      texto: `Você consegue guardar cerca de ${formatBRL(sobra)} por mês (${formatPercent(taxaPoupanca)} da renda). Isso acelera qualquer objetivo.`,
      nivel: 'bom',
    })
  }

  // Reserva de emergência
  if (mesesReserva >= 6) {
    diagnostico.push({
      titulo: 'Reserva de emergência sólida',
      texto: `Sua reserva cobre cerca de ${mesesReserva.toFixed(1)} meses de gastos. Você está protegido contra imprevistos.`,
      nivel: 'bom',
    })
  } else if (mesesReserva >= 3) {
    score -= 10
    diagnostico.push({
      titulo: 'Reserva em construção',
      texto: `Sua reserva cobre ${mesesReserva.toFixed(1)} meses de gastos. O alvo é de 3 a 6 meses — você está no caminho, continue reforçando.`,
      nivel: 'atencao',
    })
  } else {
    score -= 20
    diagnostico.push({
      titulo: 'Reserva de emergência insuficiente',
      texto: `Sua reserva cobre apenas ${mesesReserva.toFixed(1)} meses de gastos. Antes de investir em coisas mais arriscadas, priorize formar de 3 a 6 meses de despesas.`,
      nivel: mesesReserva >= 1 ? 'atencao' : 'critico',
    })
  }

  // Dívidas
  if (dividas > 0) {
    if (dividaRenda > 6) {
      score -= 20
      diagnostico.push({
        titulo: 'Endividamento alto',
        texto: `Suas dívidas equivalem a ${dividaRenda.toFixed(1)}x sua renda mensal. Renegociar juros e quitar as dívidas mais caras deve ser prioridade.`,
        nivel: 'critico',
      })
    } else {
      score -= 8
      diagnostico.push({
        titulo: 'Dívidas a monitorar',
        texto: `Você tem ${formatBRL(dividas)} em dívidas (${dividaRenda.toFixed(1)}x a renda mensal). Mantenha um plano de quitação para não deixar os juros crescerem.`,
        nivel: 'atencao',
      })
    }
  }

  score = Math.max(5, Math.min(100, Math.round(score)))

  // Recomendações
  const recomendacoes: string[] = []
  if (sobra < 0) {
    recomendacoes.push('Liste todos os gastos do mês e corte ao menos 10% das despesas não essenciais para sair do vermelho.')
  }
  if (dividas > 0 && dividaRenda > 1) {
    recomendacoes.push('Concentre esforços em quitar primeiro a dívida com maior taxa de juros (efeito "bola de neve" ou "avalanche").')
  }
  if (mesesReserva < 6) {
    const alvo = gastosFixos * 6
    recomendacoes.push(`Construa uma reserva de emergência de ${formatBRL(alvo)} (6 meses de gastos) em uma aplicação de liquidez diária.`)
  }
  if (taxaComprometimento > 0.5) {
    recomendacoes.push('Revise assinaturas, plano de celular e contas recorrentes — pequenas trocas liberam fôlego no orçamento.')
  }
  if (sobra > 0) {
    recomendacoes.push(`Automatize a poupança: transfira ${formatBRL(Math.max(50, sobra * 0.7))} para seus objetivos assim que receber, antes de gastar.`)
  }
  recomendacoes.push(`Direcione seu foco ao objetivo "${OBJETIVO_LABELS[objetivo]}" e acompanhe a evolução todo mês.`)

  // Próximos passos (30 dias)
  const proximosPassos = [
    'Anote todas as suas despesas por 30 dias para enxergar para onde o dinheiro vai.',
    mesesReserva < 3
      ? 'Abra (ou reforce) uma reserva de emergência em conta com rendimento e liquidez diária.'
      : 'Defina um aporte mensal fixo e automático para o seu objetivo.',
    dividas > 0
      ? 'Liste suas dívidas com valor e taxa de juros, e negocie a mais cara ainda este mês.'
      : `Calcule quanto precisa guardar por mês para alcançar "${OBJETIVO_LABELS[objetivo]}" em ${prazoMeses} meses.`,
  ]

  const resumo =
    score >= 75
      ? `Sua saúde financeira está boa (${score}/100). Com pequenos ajustes você acelera o objetivo de ${OBJETIVO_LABELS[objetivo].toLowerCase()}.`
      : score >= 50
        ? `Sua saúde financeira é mediana (${score}/100). Há pontos importantes a ajustar, mas você tem condições de melhorar rápido.`
        : `Sua saúde financeira pede atenção (${score}/100). Vamos focar no essencial primeiro: equilibrar o orçamento e criar segurança.`

  return {
    resumo,
    scoreSaude: score,
    diagnostico,
    recomendacoes,
    proximosPassos,
    offline: true,
  }
}

/** Resposta de chat local (sem IA), simples e baseada nos dados. */
export function responderChatLocal(question: string, data: SimulationData): string {
  const sobra = data.rendaMensal - data.gastosFixos
  return (
    `Modo offline (sem a API do Gemini): respondo com base nos seus números.\n\n` +
    `Sobre "${question.trim()}": hoje você tem uma sobra mensal de ${formatBRL(sobra)} e ` +
    `${formatBRL(data.reservaInvestida)} guardados. ` +
    `Para uma resposta personalizada e mais profunda, configure a chave do Gemini no arquivo .env. ` +
    `Enquanto isso, um bom caminho é destinar parte dessa sobra ao seu objetivo todo mês, de forma automática.`
  )
}
