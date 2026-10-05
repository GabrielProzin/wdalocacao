import { Aluguel } from '@/features/aluguel/models/Aluguel';
import { eventDate } from '@/utils/presentation';
export const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
export function calcularDashboardStats(
  alugueis: Aluguel[],
  periodo = monthKey(new Date())
) {
  const [year, month] = periodo.split('-').map(Number);
  const selected = new Date(year, month - 1, 1);
  const previous = monthKey(new Date(year, month - 2, 1));
  const records = alugueis.filter(
    a => a.dataEntrega && monthKey(a.dataEntrega) === periodo
  );
  const value = (items: Aluguel[]) =>
    items.reduce((sum, a) => sum + (Number(a.valor) || 0), 0);
  const receitaMensal = value(records);
  const valorAnterior = value(
    alugueis.filter(a => a.dataEntrega && monthKey(a.dataEntrega) === previous)
  );
  const emUso = alugueis.filter(a => a.status === 'entregue');
  const historico = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(
      selected.getFullYear(),
      selected.getMonth() - 5 + i,
      1
    );
    const key = monthKey(date);
    return {
      key,
      label: date
        .toLocaleDateString('pt-BR', { month: 'short' })
        .replace('.', ''),
      valor: value(
        alugueis.filter(a => a.dataEntrega && monthKey(a.dataEntrega) === key)
      ),
    };
  });
  return {
    locacoesNoMes: records.length,
    receitaMensal,
    valorAnterior,
    ticketMedio: records.length ? receitaMensal / records.length : 0,
    clientesNoMes: new Set(
      records.map(
        a =>
          a.telefoneCliente.replace(/\D/g, '') ||
          a.nomeCliente.trim().toLowerCase()
      )
    ).size,
    ativos: alugueis.filter(a => a.status !== 'devolvido').length,
    jogosEmUso: emUso.reduce((s, a) => s + (Number(a.itens.jogos) || 0), 0),
    forrosEmUso: emUso.reduce(
      (s, a) => s + (Number(a.itens.forroQuantidade) || 0),
      0
    ),
    status: {
      pendente: records.filter(a => a.status === 'pendente').length,
      entregue: records.filter(a => a.status === 'entregue').length,
      devolvido: records.filter(a => a.status === 'devolvido').length,
    },
    historico,
  };
}
export function proximosCompromissos(alugueis: Aluguel[], agora = new Date()) {
  return alugueis
    .filter(a => a.status !== 'devolvido')
    .map(a => {
      const entrega = a.status === 'pendente';
      const data = eventDate(
        entrega ? a.dataEntrega : a.dataDevolucao,
        entrega ? a.horaEntrega : a.horaDevolucao
      );
      return {
        aluguel: a,
        tipo: entrega ? 'Entrega' : 'Devolução',
        data,
        atrasado: !!data && data.getTime() < agora.getTime(),
      };
    })
    .sort(
      (a, b) =>
        (a.data?.getTime() ?? Infinity) - (b.data?.getTime() ?? Infinity)
    );
}
