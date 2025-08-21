import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useListaAlugueis } from '../useListaAlugueis'
import * as service from '../../services/aluguelService'
import type { Aluguel } from '../../models/Aluguel'

vi.mock('../../services/aluguelService', () => ({
  listarAlugueisPaginado: vi.fn().mockResolvedValue({ alugueis: [], cursor: null }),
  editarAluguel: vi.fn().mockResolvedValue(undefined),
}))

const makeItem = (id: string): Aluguel => ({
  id,
  nomeCliente: 'X',
  telefoneCliente: '0',
  itens: { jogos: 1, mesaQuantidade: 1, cadeiraQuantidade: 1, forroQuantidade: 0 },
  valor: 10,
  frete: false,
  distanciaKM: 0,
  valorFrete: 0,
  dataEntrega: new Date(),
  horaEntrega: '10:00',
  dataDevolucao: null,
  horaDevolucao: undefined,
  enderecoEntrega: 'Rua',
  status: 'pendente',
  observacoes: ''
})

describe('useListaAlugueis', () => {
  beforeEach(() => vi.clearAllMocks())

  it('carrega lista inicial e atualiza status', async () => {
    ;(service.listarAlugueisPaginado as any).mockResolvedValueOnce({
      alugueis: [makeItem('1')],
      cursor: null
    })

    const { result } = renderHook(() => useListaAlugueis())
    // aguarda primeira renderização assíncrona
    await act(async () => {})

    expect(result.current.alugueis.length).toBe(1)

    await act(async () => {
      await result.current.atualizarStatus('1', 'entregue')
    })

    expect(service.editarAluguel).toHaveBeenCalledWith('1', { status: 'entregue' })
  })
})
