/** Gera um ID curto e único para identificar cada simulação. */
export function generateId(): string {
  const cryptoObj = globalThis.crypto
  if (cryptoObj?.randomUUID) {
    return cryptoObj.randomUUID().split('-')[0]
  }
  return (
    Math.random().toString(36).slice(2, 10) +
    Date.now().toString(36).slice(-4)
  )
}
