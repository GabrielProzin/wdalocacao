import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import DashboardPage from './page';
import { useAlugueis } from '@/features/aluguel/hooks/AlugueisContext';
import {
  criarForm,
  montarAluguel,
} from '@/features/aluguel/services/formService';
vi.mock('@/features/despesas/ResumoDespesas', () => ({ default: () => null }));
vi.mock('@/features/aluguel/hooks/AlugueisContext', () => ({
  useAlugueis: vi.fn(),
}));
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
describe('Dashboard', () => {
  it('apresenta os dados reais do mês, sem confundir valores com pagamentos', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 5));
    vi.mocked(useAlugueis).mockReturnValue({
      alugueis: [
        {
          ...montarAluguel({
            ...criarForm(),
            nomeCliente: 'Ana',
            telefoneCliente: '(62) 99999-1234',
            jogos: '2',
            forroQuantidade: '3',
            dataEntrega: '2026-10-10',
            enderecoEntrega: 'Rua A',
          }),
          id: 'a',
        },
      ],
      carregando: false,
      erro: '',
      recarregar: vi.fn(),
    });
    render(<DashboardPage />);
    expect(screen.getAllByText('R$ 45,00').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Ana')).toHaveLength(2);
    expect(screen.getByText(/não registra pagamentos/)).toBeInTheDocument();
    expect(screen.getByLabelText('Mês do dashboard')).toHaveValue('2026-10');
  });
  it('não apresenta zeros como resultado quando o banco nega acesso', () => {
    vi.mocked(useAlugueis).mockReturnValue({
      alugueis: [],
      carregando: false,
      erro: 'Acesso negado pelo Firestore.',
      recarregar: vi.fn(),
    });
    render(<DashboardPage />);
    expect(
      screen.getByText('Acesso negado pelo Firestore.')
    ).toBeInTheDocument();
    expect(screen.queryByText('R$ 0,00')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Tentar novamente' })
    ).toBeInTheDocument();
  });
});
