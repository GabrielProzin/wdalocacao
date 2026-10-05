import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook } from '@testing-library/react';
import { useListaAlugueis } from './useListaAlugueis';
import { editarAluguel } from '../services/aluguelService';

vi.mock('./AlugueisContext', () => ({
  useAlugueis: () => ({
    alugueis: [],
    carregando: false,
    erro: '',
    recarregar: vi.fn(),
  }),
}));
vi.mock('../services/aluguelService', () => ({ editarAluguel: vi.fn() }));
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

describe('Atualização do status', () => {
  it('evita gravações duplicadas enquanto aguarda o banco', async () => {
    let concluir!: () => void;
    vi.mocked(editarAluguel).mockReturnValueOnce(
      new Promise<void>(resolve => {
        concluir = resolve;
      })
    );
    const { result } = renderHook(() => useListaAlugueis());
    let pending!: Promise<void>;
    await act(async () => {
      pending = result.current.atualizarStatus('teste', 'entregue');
      await result.current.atualizarStatus('teste', 'entregue');
    });
    expect(editarAluguel).toHaveBeenCalledExactlyOnceWith('teste', {
      status: 'entregue',
    });
    expect(result.current.loadingIds.has('teste')).toBe(true);
    await act(async () => {
      concluir();
      await pending;
    });
    expect(result.current.loadingIds.size).toBe(0);
    expect(result.current.erroAtualizacao).toBe(false);
  });
  it('mostra a causa da falha e permite tentar novamente', async () => {
    vi.mocked(editarAluguel)
      .mockRejectedValueOnce({ code: 'permission-denied' })
      .mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useListaAlugueis());
    await act(async () => {
      await result.current.atualizarStatus('teste', 'entregue');
    });
    expect(result.current.mensagem).toContain('permissão');
    expect(result.current.mensagem).not.toContain('conexão');
    expect(result.current.erroAtualizacao).toBe(true);
    expect(result.current.loadingIds.size).toBe(0);
    await act(async () => {
      await result.current.atualizarStatus('teste', 'entregue');
    });
    expect(result.current.erroAtualizacao).toBe(false);
    expect(editarAluguel).toHaveBeenCalledTimes(2);
  });
});
