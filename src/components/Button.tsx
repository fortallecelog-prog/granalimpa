import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'focus-visible:ring-brand focus-visible:ring-offset-bg ' +
  'disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none'

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-brand-fg hover:bg-brand-strong shadow-sm',
  secondary:
    'bg-surface text-content border border-border hover:bg-surface-2',
  ghost: 'bg-transparent text-content hover:bg-surface-2',
  danger: 'bg-transparent text-danger border border-danger/40 hover:bg-danger/10',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-13 px-7 text-lg',
}

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', fullWidth = false) {
  return [base, variants[variant], sizes[size], fullWidth ? 'w-full' : ''].join(' ')
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  /** Quando informado, renderiza um <Link> do react-router com o mesmo estilo. */
  to?: string
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  to,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = `${buttonClasses(variant, size, fullWidth)} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
