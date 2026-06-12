import { Button } from '../components/Button'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <p className="text-6xl font-extrabold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-bold text-content">Página não encontrada</h1>
      <p className="mt-2 text-muted">A página que você procura não existe ou foi movida.</p>
      <Button className="mt-6" to="/">
        Voltar ao início
      </Button>
    </div>
  )
}
