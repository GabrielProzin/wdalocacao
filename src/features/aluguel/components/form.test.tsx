import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AluguelForm from './AluguelForm';
import { cadastrarAluguel, excluirAluguel } from '../services/aluguelService';
import { criarForm, montarAluguel } from '../services/formService';
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));
vi.mock('../services/aluguelService', () => ({
  cadastrarAluguel: vi.fn(),
  editarAluguel: vi.fn(),
  excluirAluguel: vi.fn(),
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
afterAll(() => {
  Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
describe('Fluxo do cadastro', () => {
  it('só exclui o aluguel depois da confirmação e permite cancelar', async () => {
    vi.mocked(excluirAluguel).mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    const aluguel = {
      ...montarAluguel({
        ...criarForm(),
        nomeCliente: 'Ana',
        telefoneCliente: '62999991234',
        jogos: '1',
        enderecoEntrega: 'Rua A',
        dataEntrega: '2026-10-05',
      }),
      id: 'rental-test',
    };
    render(<AluguelForm aluguel={aluguel} modo="editar" />);
    await user.click(
      screen.getByRole('button', { name: 'Excluir este aluguel' })
    );
    expect(screen.getByRole('dialog')).toBeVisible();
    expect(excluirAluguel).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Manter aluguel' }));
    expect(excluirAluguel).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole('button', { name: 'Excluir este aluguel' })
    );
    await user.click(
      screen.getByRole('button', { name: 'Excluir definitivamente' })
    );
    expect(excluirAluguel).toHaveBeenCalledExactlyOnceWith('rental-test');
  });
  it('revisa sem salvar e preserva os campos se o banco falhar', async () => {
    vi.mocked(cadastrarAluguel).mockRejectedValueOnce(new Error('offline'));
    const user = userEvent.setup();
    render(<AluguelForm />);
    const fill = (label: string, value: string) =>
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    fill('Nome do cliente *', 'Ana');
    fill('Telefone *', '(62) 99999-1234');
    fill('Quantidade de jogos *', '2');
    fill('Quantidade de forros', '3');
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
    fill('Endereço da entrega *', 'Rua A, 20');
    fill('Data de entrega *', '2026-10-10');
    await user.click(screen.getByRole('checkbox'));
    fill('Valor do frete (R$) *', '12.75');
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(cadastrarAluguel).not.toHaveBeenCalled();
    expect(screen.getByText('R$ 57,75')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Confirmar aluguel' }));
    expect(cadastrarAluguel).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Seus dados continuam aqui'
    );
    await user.click(screen.getByRole('button', { name: 'Voltar' }));
    expect(screen.getByLabelText('Endereço da entrega *')).toHaveValue(
      'Rua A, 20'
    );
    expect(screen.getByLabelText('Valor do frete (R$) *')).toHaveValue(12.75);
  });
});
