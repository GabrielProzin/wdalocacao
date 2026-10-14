import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MonthlyChart, StatusChart } from './DashboardCharts';

afterEach(cleanup);
const historico = [0, 100, 800, 400, 1200, 300].map((valor, index) => ({
  key: `2026-${String(index + 5).padStart(2, '0')}`,
  label: ['mai', 'jun', 'jul', 'ago', 'set', 'out'][index],
  valor,
}));

describe('Gráficos da visão geral', () => {
  it('mostra valores reais e permite selecionar um mês com clique ou teclado', () => {
    render(<MonthlyChart historico={historico} receitaMensal={300} />);
    const september = screen.getByRole('button', {
      name: /setembro de 2026:/,
    });
    fireEvent.click(september);
    expect(september).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('setembro de 2026')).toBeInTheDocument();
    expect(screen.getByText('R$ 1.200,00')).toBeInTheDocument();
    fireEvent.focus(screen.getByRole('button', { name: /maio de 2026:/ }));
    expect(screen.getByText('maio de 2026')).toBeInTheDocument();
  });
  it('mostra período sem dados sem valores fictícios ou coordenadas inválidas', () => {
    const { container } = render(
      <MonthlyChart
        historico={historico.map(month => ({ ...month, valor: 0 }))}
        receitaMensal={0}
      />
    );
    expect(
      screen.getByText('Nenhum valor contratado nos meses exibidos.')
    ).toBeInTheDocument();
    expect(container.innerHTML).not.toMatch(/NaN|Infinity/);
  });
  it('mostra status e percentuais com contagens reais e trata mês vazio', () => {
    const { container, rerender } = render(
      <StatusChart
        status={{ pendente: 2, entregue: 1, devolvido: 1 }}
        total={4}
        ticketMedio={300}
      />
    );
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getAllByText('25%')).toHaveLength(2);
    expect(container.querySelectorAll('circle[stroke-dasharray]')).toHaveLength(
      3
    );
    rerender(
      <StatusChart
        status={{ pendente: 0, entregue: 0, devolvido: 0 }}
        total={0}
        ticketMedio={0}
      />
    );
    expect(
      screen.getByText('Nenhum aluguel no mês selecionado.')
    ).toBeInTheDocument();
    expect(container.querySelectorAll('circle[stroke-dasharray]')).toHaveLength(
      0
    );
  });
});
