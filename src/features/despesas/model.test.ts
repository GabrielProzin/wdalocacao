import { describe, expect, it } from 'vitest';
import { novoForm, prepararDespesa, resumoDespesas } from './model';
const valid = () => ({
  ...novoForm(),
  tipo: 'combustivel' as const,
  valor: '50,25',
  litros: '10,5',
  data: '2026-10-05',
});
describe('Despesas', () => {
  it('grava valores em centavos e aceita vírgula ou ponto, sem arredondar entradas inválidas', () => {
    expect(prepararDespesa(valid())).toMatchObject({
      valorCentavos: 5025,
      litros: 10.5,
    });
    expect(prepararDespesa({ ...valid(), valor: '0.29' }).valorCentavos).toBe(
      29
    );
    for (const valor of ['0', '-1', 'NaN', '10,123', '1.000,00', '10000000.01'])
      expect(() => prepararDespesa({ ...valid(), valor })).toThrow();
  });
  it('valida a data e os litros e ignora litros em outros tipos', () => {
    expect(() => prepararDespesa({ ...valid(), data: '2026-02-30' })).toThrow();
    expect(() => prepararDespesa({ ...valid(), litros: '-1' })).toThrow();
    expect(prepararDespesa({ ...valid(), litros: '' }).litros).toBeNull();
    expect(
      prepararDespesa({ ...valid(), tipo: 'materiais' }).litros
    ).toBeNull();
  });
  it('preserva todos os dados na edição e soma só o mês selecionado', () => {
    const item = { ...prepararDespesa(valid()), id: 'a' };
    expect(prepararDespesa(novoForm(item))).toEqual(prepararDespesa(valid()));
    const resumo = resumoDespesas(
      [
        item,
        { ...item, id: 'b', valorCentavos: 29 },
        { ...item, id: 'c', data: '2026-09-30' },
      ],
      '2026-10'
    );
    expect(resumo.totalCentavos).toBe(5054);
    expect(resumo.porTipo[0].centavos).toBe(5054);
    expect(resumo.noMes).toHaveLength(2);
  });
});
