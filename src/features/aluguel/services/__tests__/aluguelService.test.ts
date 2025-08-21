import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as repo from '../../repositories/aluguelRepository'
import { cadastrarAluguel, listarAlugueis, editarAluguel, buscarAluguelPorId, excluirAluguel } from '../aluguelService'
import type { Aluguel } from '../../models/Aluguel'

vi.mock('../../repositories/aluguelRepository', () => ({
  criarAluguel: vi.fn(),
  buscarAlugueis: vi.fn(),
  atualizarAluguel: vi.fn(),
  buscarAluguelPorId: vi.fn(),
  excluirAluguelPorId: vi.fn(),
}))

const sample: Omit<Aluguel, 'id'> = {
  nomeCliente: 'Fulano',
  telefoneCliente: '999999999',
  itens: { jogos: 1, mesaQuantidade: 1, cadeiraQuantidade: 4, forroQuantidade: 0 },
  valor: 50,
  frete: false,
  distanciaKM: 0,
  valorFrete: 0,
  dataEntrega: new Date(),
  horaEntrega: '10:00',
  dataDevolucao: new Date(),
  horaDevolucao: '12:00',
  enderecoEntrega: 'Rua A, 123',
  status: 'pendente',
  observacoes: ''
}

describe('aluguelService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('cadastrarAluguel delega para repo.criarAluguel', async () => {
    await cadastrarAluguel(sample)
    expect(repo.criarAluguel).toHaveBeenCalledWith(sample)
  })

  it('listarAlugueis delega para repo.buscarAlugueis', async () => {
    await listarAlugueis()
    expect(repo.buscarAlugueis).toHaveBeenCalled()
  })

  it('editarAluguel delega para repo.atualizarAluguel', async () => {
    await editarAluguel('abc', { status: 'entregue' } as Partial<Aluguel>)
    expect(repo.atualizarAluguel).toHaveBeenCalledWith('abc', { status: 'entregue' })
  })

  it('buscarAluguelPorId delega para repo.buscarAluguelPorId', async () => {
    await buscarAluguelPorId('xyz')
    expect(repo.buscarAluguelPorId).toHaveBeenCalledWith('xyz')
  })

  it('excluirAluguel delega para repo.excluirAluguelPorId', async () => {
    await excluirAluguel('xyz')
    expect(repo.excluirAluguelPorId).toHaveBeenCalledWith('xyz')
  })
})
