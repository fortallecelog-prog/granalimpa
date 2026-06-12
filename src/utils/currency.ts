/** Converte uma string de dígitos digitados em número, tratando os 2 últimos como centavos. */
export function digitsToNumber(raw: string): number {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return 0
  return Number(digits) / 100
}

/** Formata um número como moeda brasileira: 1234.5 -> "R$ 1.234,50". */
export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Formata um número sem o símbolo R$, para usar dentro do input. */
export function formatCurrencyInput(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Formata percentual: 0.42 -> "42%". */
export function formatPercent(value: number, digits = 0): string {
  return (value * 100).toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }) + '%'
}
