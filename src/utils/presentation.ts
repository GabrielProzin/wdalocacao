import { Aluguel } from '@/features/aluguel/models/Aluguel';
// Mostra só o que vai no pedido: "4 mesas · 16 cadeiras", sem "0 forros".
export function listaItens(mesas: number, cadeiras: number, forros: number) {
  const partes = (
    [
      [mesas, 'mesa', 'mesas'],
      [cadeiras, 'cadeira', 'cadeiras'],
      [forros, 'forro', 'forros'],
    ] as const
  )
    .map(([n, um, varios]) => [Number(n) || 0, um, varios] as const)
    .filter(([n]) => n > 0)
    .map(([n, um, varios]) => `${n} ${n === 1 ? um : varios}`);
  return partes.length ? partes.join(' · ') : 'Nenhum item';
}
export function resumoItens(a: Aluguel) {
  return listaItens(
    a.itens.mesaQuantidade,
    a.itens.cadeiraQuantidade,
    a.itens.forroQuantidade
  );
}
export const compactMoney = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value || 0);
export const money = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    value || 0
  );
export const dateLabel = (value: Date | null | undefined) =>
  value
    ? new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
      }).format(value)
    : 'Sem data';
export const fullDate = (value: Date | null | undefined) =>
  value ? new Intl.DateTimeFormat('pt-BR').format(value) : 'Não definida';
export const statusLabel: Record<Aluguel['status'], string> = {
  pendente: 'Pendente',
  entregue: 'Entregue',
  devolvido: 'Devolvido',
};
export function eventDate(date: Date | null | undefined, time = '') {
  if (!date) return null;
  const result = new Date(date);
  const [hour, minute] = (time || '23:59').split(':').map(Number);
  result.setHours(hour || 0, minute || 0, 0, 0);
  return result;
}
