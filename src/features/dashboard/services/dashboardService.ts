import { Aluguel } from '@/features/aluguel/models/Aluguel';

type DashboardStats = {
  locacoesNoMes: number;
  receitaMensal: number;
  mesasDisponiveis: number;
  cadeirasDisponiveis: number;
};

// 🔧 ajuste esses totais conforme seu estoque real
const TOTAL_MESAS = 30;
const TOTAL_CADEIRAS = 120;

export function calcularDashboardStats(alugueis: Aluguel[]): DashboardStats {
  const agora = new Date();
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();

  let locacoesNoMes = 0;
  let receitaMensal = 0;
  let mesasEmUso = 0;
  let cadeirasEmUso = 0;

  alugueis.forEach(aluguel => {
    if (!aluguel.dataEntrega) return;

    const dataEntrega = new Date(aluguel.dataEntrega);

    const ehMesAtual =
      dataEntrega.getMonth() === mesAtual &&
      dataEntrega.getFullYear() === anoAtual;

    if (ehMesAtual) {
      locacoesNoMes += 1;
      receitaMensal += Number(aluguel.valor) || 0;
    }

    const aluguelAtivo =
      aluguel.status === 'pendente' || aluguel.status === 'entregue';

    if (aluguelAtivo) {
      mesasEmUso += Number(aluguel.itens.jogos) || 0;
      cadeirasEmUso += Number(aluguel.itens.cadeiraQuantidade) || 0;
    }
  });

  return {
    locacoesNoMes,
    receitaMensal,
    mesasDisponiveis: Math.max(TOTAL_MESAS - mesasEmUso, 0),
    cadeirasDisponiveis: Math.max(TOTAL_CADEIRAS - cadeirasEmUso, 0),
  };
}
