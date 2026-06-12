import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="flex min-h-svh flex-col bg-bg text-content">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-muted">
          Grana Limpa · Desenvolvido por Gabriel Couto
        </div>
      </footer>
    </div>
  )
}
