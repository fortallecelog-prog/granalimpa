import type { AIInsights, ChatMessage, Simulation, SimulationData } from '../types/simulation'
import { generateId } from '../utils/id'

const STORAGE_KEY = 'grana-limpa:simulations'

function readAll(): Simulation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Simulation[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(items: Simulation[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

/** Lista todas as simulações, mais recentes primeiro. */
export function getSimulations(): Simulation[] {
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

/** Busca uma simulação pelo ID. */
export function getSimulation(id: string): Simulation | undefined {
  return readAll().find((s) => s.id === id)
}

/** Cria e persiste uma nova simulação a partir dos dados do formulário. */
export function createSimulation(data: SimulationData): Simulation {
  const simulation: Simulation = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    data,
    chat: [],
  }
  const all = readAll()
  all.push(simulation)
  writeAll(all)
  return simulation
}

/** Atualiza (upsert) uma simulação existente. */
export function saveSimulation(simulation: Simulation): void {
  const all = readAll()
  const index = all.findIndex((s) => s.id === simulation.id)
  if (index >= 0) {
    all[index] = simulation
  } else {
    all.push(simulation)
  }
  writeAll(all)
}

/** Grava os insights da IA em uma simulação. */
export function setInsights(id: string, insights: AIInsights): Simulation | undefined {
  const all = readAll()
  const index = all.findIndex((s) => s.id === id)
  if (index < 0) return undefined
  all[index] = { ...all[index], insights }
  writeAll(all)
  return all[index]
}

/** Acrescenta mensagens ao histórico de chat de uma simulação. */
export function appendChat(id: string, messages: ChatMessage[]): Simulation | undefined {
  const all = readAll()
  const index = all.findIndex((s) => s.id === id)
  if (index < 0) return undefined
  all[index] = { ...all[index], chat: [...all[index].chat, ...messages] }
  writeAll(all)
  return all[index]
}

/** Remove uma simulação. */
export function deleteSimulation(id: string): void {
  writeAll(readAll().filter((s) => s.id !== id))
}
