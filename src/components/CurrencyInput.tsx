import { useId } from 'react'
import { digitsToNumber, formatCurrencyInput } from '../utils/currency'

interface CurrencyInputProps {
  value: number
  onChange: (value: number) => void
  label?: string
  placeholder?: string
  autoFocus?: boolean
  onEnter?: () => void
}

/**
 * Input com máscara monetária brasileira. O usuário digita apenas números
 * e os dois últimos dígitos viram centavos automaticamente.
 */
export function CurrencyInput({
  value,
  onChange,
  label,
  autoFocus,
  onEnter,
}: CurrencyInputProps) {
  const id = useId()
  const display = value > 0 ? formatCurrencyInput(value) : ''

  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-muted">
          {label}
        </label>
      )}
      <div className="flex items-center rounded-2xl border border-border bg-surface focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30">
        <span className="pl-4 text-lg font-semibold text-muted">R$</span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoFocus={autoFocus}
          value={display}
          placeholder="0,00"
          onChange={(e) => onChange(digitsToNumber(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onEnter?.()
          }}
          className="w-full bg-transparent px-3 py-4 text-2xl font-bold text-content outline-none placeholder:text-muted/50"
        />
      </div>
    </div>
  )
}
