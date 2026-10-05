import { Aluguel } from '@/features/aluguel/models/Aluguel';
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
