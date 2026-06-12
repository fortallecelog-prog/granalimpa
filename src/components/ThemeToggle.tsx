import { useTheme } from '../context/theme-context'
import { MoonIcon, SunIcon } from './icons'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      title={isDark ? 'Tema claro' : 'Tema escuro'}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-content transition-colors hover:bg-surface-2 cursor-pointer"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
