import { describe, it, expect } from 'vitest';
import {
  calcularDashboardStats,
  proximosCompromissos,
} from './dashboardService';
import {
  criarForm,
  montarAluguel,
} from '@/features/aluguel/services/formService';
import { Aluguel } from '@/features/aluguel/models/Aluguel';
function rental(date: string, status: Aluguel['status'] = 'pendente'): Aluguel {
  return {
    ...montarAluguel({
      ...criarForm(),
      nomeCliente: 'Ana',
      telefoneCliente: '(62) 99999-1234',
      jogos: '2',
      forroQuantidade: '3',
      enderecoEntrega: 'Rua A',
      dataEntrega: date,
      status,
    }),
    id: date,
  };
}
describe('Dashboard com dados reais', () => {
  it('separa o mês escolhido e o anterior, e conta estoque somente entregue', () => {
    const stats = calcularDashboardStats(
      [
        rental('2026-10-10'),
        rental('2026-10-12', 'entregue'),
        rental('2026-09-01', 'devolvido'),
      ],
      '2026-10'
    );
    expect(stats.receitaMensal).toBe(90);
    expect(stats.valorAnterior).toBe(45);
    expect(stats.locacoesNoMes).toBe(2);
    expect(stats.jogosEmUso).toBe(2);
    expect(stats.forrosEmUso).toBe(3);
    expect(stats.clientesNoMes).toBe(1);
  });
  it('atravessa a virada do ano e não inventa números sem registros', () => {
    const stats = calcularDashboardStats([], '2027-01');
    expect(stats.historico.map(p => p.key)).toEqual([
      '2026-08',
      '2026-09',
      '2026-10',
      '2026-11',
      '2026-12',
      '2027-01',
    ]);
    expect(stats.receitaMensal).toBe(0);
    expect(stats.jogosEmUso).toBe(0);
    expect(stats.ticketMedio).toBe(0);
  });
  it('inclui todo o histórico, sem truncar em 500 aluguéis', () => {
    expect(
      calcularDashboardStats(
        Array.from({ length: 501 }, () => rental('2026-10-10')),
        '2026-10'
      ).locacoesNoMes
    ).toBe(501);
  });
  it('separa atrasos, devoluções sem data e pedidos já concluídos', () => {
    const pending = rental('2026-10-01');
    const delivered = rental('2026-10-02', 'entregue');
    const done = rental('2026-10-03', 'devolvido');
    const agenda = proximosCompromissos(
      [delivered, done, pending],
      new Date(2026, 9, 5)
    );
    expect(agenda).toHaveLength(2);
    expect(agenda[0].atrasado).toBe(true);
    expect(agenda[1].tipo).toBe('Devolução');
    expect(agenda[1].data).toBeNull();
    expect(agenda[1].atrasado).toBe(false);
  });
});
