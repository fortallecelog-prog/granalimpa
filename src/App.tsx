import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { SimulationPage } from './pages/SimulationPage'
import { ResultPage } from './pages/ResultPage'
import { HistoryPage } from './pages/HistoryPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="simular" element={<SimulationPage />} />
          <Route path="resultado/:id" element={<ResultPage />} />
          <Route path="historico" element={<HistoryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
