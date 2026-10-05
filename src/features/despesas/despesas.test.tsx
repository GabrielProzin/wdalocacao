import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DespesasPage from '@/app/Despesas/page';
import ResumoDespesas from './ResumoDespesas';
import { useDespesas } from './DespesasContext';
import { salvarDespesa, excluirDespesa } from './despesaService';
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('./DespesasContext', () => ({ useDespesas: vi.fn() }));
vi.mock('./despesaService', () => ({
  salvarDespesa: vi.fn(),
  excluirDespesa: vi.fn(),
  erroDespesa: () => 'Sem permissão para despesas.',
}));
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    },
  });
});
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});
const item = {
  id: 'teste',
  tipo: 'combustivel' as const,
  valorCentavos: 5025,
  litros: 10.5,
  observacao: 'Registro fictício',
  data: '2026-10-05',
};
function dados() {
  vi.mocked(useDespesas).mockReturnValue({
    despesas: [item],
    carregando: false,
    erro: '',
    recarregar: vi.fn(),
  });
}
describe('Tela de despesas', () => {
  it('não perde os dados quando o banco rejeita o cadastro e permite tentar de novo', async () => {
    dados();
    vi.mocked(salvarDespesa)
      .mockRejectedValueOnce({ code: 'permission-denied' })
      .mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    render(<DespesasPage />);
    await user.click(
      screen.getByRole('button', { name: 'Registrar despesa' })
    );
    await user.type(screen.getByLabelText('Valor gasto (R$) *'), '50,25');
    await user.selectOptions(
      screen.getByLabelText('Tipo da despesa *'),
      'combustivel'
    );
    await user.type(
      screen.getByLabelText('Quantidade de litros (opcional)'),
      '10,5'
    );
    await user.click(screen.getByRole('button', { name: 'Salvar despesa' }));
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Seus dados continuam aqui'
    );
    expect(screen.getByLabelText('Valor gasto (R$) *')).toHaveValue('50,25');
    await user.click(screen.getByRole('button', { name: 'Salvar despesa' }));
    expect(salvarDespesa).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('status')).toHaveTextContent(
      'registrada com sucesso'
    );
  });
  it('edita o mesmo documento e só exclui após confirmar, permitindo cancelar', async () => {
    dados();
    vi.mocked(salvarDespesa).mockResolvedValue(undefined);
    vi.mocked(excluirDespesa).mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<DespesasPage />);
    // O mês inicial deve refletir o registro que está sendo testado.
    fireEvent.change(screen.getByLabelText('Mês das despesas'), {
      target: { value: '2026-10' },
    });
    await user.click(screen.getByRole('button', { name: 'Editar' }));
    expect(screen.getByLabelText('Valor gasto (R$) *')).toHaveValue('50,25');
    await user.clear(screen.getByLabelText('Valor gasto (R$) *'));
    await user.type(screen.getByLabelText('Valor gasto (R$) *'), '60,50');
    await user.click(screen.getByRole('button', { name: 'Salvar alterações' }));
    expect(salvarDespesa).toHaveBeenCalledWith(
      expect.objectContaining({ valor: '60,50' }),
      'teste'
    );
    await user.click(
      screen.getByRole('button', { name: 'Excluir' })
    );
    expect(excluirDespesa).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Manter despesa' }));
    expect(excluirDespesa).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole('button', { name: 'Excluir' })
    );
    await user.click(
      screen.getByRole('button', { name: 'Excluir definitivamente' })
    );
    expect(excluirDespesa).toHaveBeenCalledExactlyOnceWith('teste');
  });
  it('não apresenta zero como gasto real se as regras negarem leitura', () => {
    vi.mocked(useDespesas).mockReturnValue({
      despesas: [],
      carregando: false,
      erro: 'Sem permissão.',
      recarregar: vi.fn(),
    });
    render(<ResumoDespesas periodo="2026-10" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Sem permissão');
    expect(screen.queryByText('R$ 0,00')).not.toBeInTheDocument();
  });
});
