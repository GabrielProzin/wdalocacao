'use client';

import { useEffect, useState } from 'react';
import StatsCards from './components/StatsCards';
import QuickActions from './components/QuickActions';
import { buscarAlugueisPaginado } from '@/features/aluguel/repositories/aluguelRepository';
import { calcularDashboardStats } from './services/dashboardService';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    locacoesNoMes: 0,
    receitaMensal: 0,
    mesasDisponiveis: 0,
    cadeirasDisponiveis: 0,
  });

  useEffect(() => {
    async function carregarDashboard() {
      const { data: alugueis } = await buscarAlugueisPaginado({
        statusIn: ['pendente', 'entregue', 'devolvido'],
        pageSize: 500, // seguro para dashboard
      });

      const dados = calcularDashboardStats(alugueis);
      setStats(dados);
      setLoading(false);
    }

    carregarDashboard();
  }, []);

  if (loading) {
    return <p>Carregando dashboard...</p>;
  }

  return (
    <>
      <StatsCards {...stats} />
      <QuickActions onNewRental={() => (window.location.href = '/Aluguel')} />
    </>
  );
}
