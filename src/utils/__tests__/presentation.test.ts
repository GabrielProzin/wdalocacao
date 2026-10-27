import { describe, expect, it } from 'vitest';
import { listaItens } from '../presentation';

describe('listaItens', () => {
  it('omite itens zerados e usa singular quando há um só', () => {
    expect(listaItens(4, 16, 0)).toBe('4 mesas · 16 cadeiras');
    expect(listaItens(1, 0, 1)).toBe('1 mesa · 1 forro');
  });

  it('avisa quando o pedido não tem itens', () => {
    expect(listaItens(0, 0, 0)).toBe('Nenhum item');
  });
});
