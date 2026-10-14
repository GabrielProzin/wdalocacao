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
  it('permite 40 cadeiras sem mesas por um valor combinado de R$ 300', () => {
    const record = montarAluguel({
      ...valid(),
      jogos: '0',
      forroQuantidade: '0',
      cadeirasAvulsas: '40',
      modoValor: 'combinado',
      valorCombinado: '300,00',
    });
    expect(record.valor).toBe(300);
    expect(record.itens).toEqual({
      jogos: 0,
      mesaQuantidade: 0,
      cadeiraQuantidade: 40,
      forroQuantidade: 0,
    });
    expect(montarAluguel(criarForm(record))).toEqual(record);
  });
  it('calcula jogos, itens avulsos, forros e frete com preços personalizados', () => {
    const record = montarAluguel({
      ...valid(),
      precoJogo: '20,50',
      precoForro: '6,25',
      mesasAvulsas: '2',
      precoMesa: '10',
      cadeirasAvulsas: '3',
      precoCadeira: '2,50',
      frete: true,
      valorFrete: '12.75',
    });
    expect(record.valor).toBe(100);
    expect(record.itens.mesaQuantidade).toBe(4);
    expect(record.itens.cadeiraQuantidade).toBe(11);
    expect(montarAluguel(criarForm(record))).toEqual(record);
  });
  it('soma o frete ao valor combinado e mantém o valor sem frete quando desmarcado', () => {
    const form = {
      ...valid(),
      modoValor: 'combinado' as const,
      valorCombinado: '300',
      valorFrete: '20.25',
    };
    expect(montarAluguel({ ...form, frete: true }).valor).toBe(320.25);
    expect(montarAluguel(form).valor).toBe(300);
  });
  it('mantém o valor contratado de aluguéis antigos durante a edição', () => {
    const record = montarAluguel({
      ...valid(),
      frete: true,
      valorFrete: '12.75',
    });
    delete record.cobranca;
    record.valor = 312.75;
    const edited = montarAluguel(criarForm(record));
    expect(edited.valor).toBe(312.75);
    expect(edited.cobranca?.modo).toBe('combinado');
  });
  it('rejeita pedido vazio, quantidades inválidas, preço ausente e valor combinado inválido', () => {
    expect(() =>
      montarAluguel({ ...valid(), jogos: '0', forroQuantidade: '0' })
    ).toThrow();
    expect(() =>
      montarAluguel({ ...valid(), cadeirasAvulsas: '1.5' })
    ).toThrow();
    expect(() => montarAluguel({ ...valid(), precoJogo: '-1' })).toThrow();
    expect(() => montarAluguel({ ...valid(), precoForro: '1,234' })).toThrow();
    expect(() =>
      montarAluguel({ ...valid(), cadeirasAvulsas: '40', precoCadeira: '0' })
    ).toThrow();
    expect(() =>
      montarAluguel({ ...valid(), modoValor: 'combinado', valorCombinado: '0' })
    ).toThrow();
  });
});
