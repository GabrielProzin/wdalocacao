import { describe, it, expect } from 'vitest';
import {
  criarForm,
  montarAluguel,
  calcularValorForm,
  validarEtapa,
} from './formService';
const valid = () => ({
  ...criarForm(),
  nomeCliente: 'Ana',
  telefoneCliente: '(62) 99999-1234',
  jogos: '2',
  forroQuantidade: '3',
  enderecoEntrega: 'Rua A, 20',
  dataEntrega: '2026-10-10',
});
describe('Cadastro de aluguéis', () => {
  it('preserva os preços e inclui centavos do frete', () => {
    expect(
      calcularValorForm({ ...valid(), frete: true, valorFrete: '12.75' })
    ).toBe(57.75);
  });
  it('salva datas e horários opcionais sem Date inválida ou NaN', () => {
    const record = montarAluguel(valid());
    expect(record.dataDevolucao).toBeNull();
    expect(record.horaEntrega).toBe('');
    expect(record.horaDevolucao).toBe('');
    expect(record.itens).toEqual({
      jogos: 2,
      mesaQuantidade: 2,
      cadeiraQuantidade: 8,
      forroQuantidade: 3,
    });
  });
  it('impede salvar quantidades fracionadas ou vazias', () => {
    expect(() => montarAluguel({ ...valid(), jogos: '1.5' })).toThrow();
    expect(() => montarAluguel({ ...valid(), jogos: '' })).toThrow();
  });
  it('não deixa a devolução anteceder a entrega no mesmo dia', () => {
    expect(
      validarEtapa(
        {
          ...valid(),
          horaEntrega: '18:00',
          dataDevolucao: '2026-10-10',
          horaDevolucao: '10:00',
        },
        1
      )
    ).toContain('depois');
  });
  it('ignora o frete desmarcado, preservando o modelo de dados', () => {
    const record = montarAluguel({ ...valid(), valorFrete: '20.25' });
    expect(record.valorFrete).toBe(0);
    expect(record.valor).toBe(45);
  });
  it('mantém todos os campos ao abrir um cadastro para edição', () => {
    const record = montarAluguel({
      ...valid(),
      frete: true,
      valorFrete: '12.75',
      dataDevolucao: '2026-10-12',
      horaEntrega: '09:00',
      horaDevolucao: '10:30',
      observacoes: 'Portão lateral',
      status: 'entregue',
    });
    const edited = montarAluguel(criarForm(record));
    expect(edited).toEqual(record);
  });
});
