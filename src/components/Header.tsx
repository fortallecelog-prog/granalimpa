import { NavLink, Link } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { BanknoteIcon } from './icons'

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/simular', label: 'Nova simulação', end: false },
  { to: '/historico', label: 'Histórico', end: false },
]

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-content">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-fg">
            <BanknoteIcon width={18} height={18} />
          </span>
          <span className="text-lg tracking-tight">
            Grana <span className="text-brand">Limpa</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                [
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-soft text-brand'
                    : 'text-muted hover:bg-surface-2 hover:text-content',
                ].join(' ')
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
