import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import ConfiguracoesPrecos from './ConfiguracoesPrecos';
import { lerPrecosPadrao } from '@/features/aluguel/services/precosPadrao';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe('Configurações de preços', () => {
  it('salva os preços fora do aluguel e restaura ao abrir novamente', () => {
    render(<ConfiguracoesPrecos />);
    fireEvent.change(screen.getByLabelText('Preço da cadeira avulsa (R$)'), {
      target: { value: '7,50' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar preços' }));
    expect(screen.getByRole('status')).toHaveTextContent('Preços salvos');
    expect(lerPrecosPadrao()?.precoCadeira).toBe('7,50');
    cleanup();
    render(<ConfiguracoesPrecos />);
    expect(screen.getByLabelText('Preço da cadeira avulsa (R$)')).toHaveValue(
      '7,50'
    );
  });
  it('rejeita preços negativos sem sobrescrever os preços salvos', () => {
    render(<ConfiguracoesPrecos />);
    fireEvent.click(screen.getByRole('button', { name: 'Salvar preços' }));
    fireEvent.change(screen.getByLabelText('Preço do jogo (R$)'), {
      target: { value: '-1' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar preços' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(lerPrecosPadrao()?.precoJogo).toBe('15');
  });
});
