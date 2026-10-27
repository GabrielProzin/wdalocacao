'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  FiPlus,
  FiArrowUpRight,
  FiArrowRight,
  FiDollarSign,
  FiCalendar,
  FiPackage,
  FiActivity,
  FiTruck,
  FiRotateCcw,
  FiRefreshCw,
} from 'react-icons/fi';
import { useAlugueis } from '@/features/aluguel/hooks/AlugueisContext';
import {
  calcularDashboardStats,
  monthKey,
  proximosCompromissos,
} from './services/dashboardService';
import {
  money,
  dateLabel,
  statusLabel,
  resumoItens,
  listaItens,
} from '@/utils/presentation';
import styles from './overview.module.css';
import ResumoDespesas from '@/features/despesas/ResumoDespesas';
import { MonthlyChart, StatusChart } from './components/DashboardCharts';
export default function DashboardPage() {
  const { alugueis, carregando, erro, recarregar } = useAlugueis();
  const [periodo, setPeriodo] = useState(() => monthKey(new Date()));
  const stats = calcularDashboardStats(alugueis, periodo);
  const agenda = proximosCompromissos(alugueis);
  const recentes = [...alugueis]
    .sort(
      (a, b) =>
        (b.dataEntrega?.getTime() ?? 0) - (a.dataEntrega?.getTime() ?? 0)
    )
    .slice(0, 5);
  const variation =
    stats.valorAnterior > 0
      ? ((stats.receitaMensal - stats.valorAnterior) / stats.valorAnterior) *
        100
      : null;
  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Visão geral</h1>
          <p>{hojeExtenso()}</p>
        </div>
        <Link href="/Aluguel/New" className="primary">
          <FiPlus size={18} /> Novo aluguel
        </Link>
      </div>
      <div className={styles.periodRow}>
        <div>
          <span
            className={styles.liveDot}
            style={erro ? { background: '#b35243' } : undefined}
          />
          <span>Números do mês</span>
          <small>
            {erro
              ? 'Conexão indisponível'
              : carregando
                ? 'Consultando seus aluguéis'
                : 'Atualizada com seus aluguéis'}
          </small>
        </div>
        <label className={styles.period}>
          <FiCalendar />
          <span className="visually-hidden">Mês do dashboard</span>
          <input
            aria-label="Mês do dashboard"
            type="month"
            value={periodo}
            onChange={e => e.target.value && setPeriodo(e.target.value)}
          />
        </label>
      </div>
      {erro ? (
        <div className="state">
          <FiRefreshCw size={32} />
          <h2>Vamos tentar de novo?</h2>
          <p>{erro}</p>
          <button className="primary" onClick={recarregar}>
            Tentar novamente
          </button>
        </div>
      ) : carregando ? (
        <div
          className={styles.statsGrid}
          role="status"
          aria-label="Carregando dashboard"
        >
          {[1, 2, 3, 4].map(i => (
            <div className="skeleton" key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className={styles.statsGrid}>
            <div className={`${styles.stat} ${styles.featured}`}>
              <div>
                <span>Valor dos aluguéis no mês</span>
                <FiDollarSign />
              </div>
              <strong>{money(stats.receitaMensal)}</strong>
              <small>
                {variation !== null
                  ? `${variation >= 0 ? '+' : ''}${variation.toFixed(0)}% em relação ao mês anterior`
                  : 'Valores contratados, incluindo frete'}
              </small>
            </div>
            <div className={styles.stat}>
              <div>
                <span>Aluguéis no mês</span>
                <FiCalendar />
              </div>
              <strong>{stats.locacoesNoMes.toString().padStart(2, '0')}</strong>
              <small>
                {stats.clientesNoMes}{' '}
                {stats.clientesNoMes === 1
                  ? 'cliente no período'
                  : 'clientes no período'}
              </small>
            </div>
            <div className={styles.stat}>
              <div>
                <span>Aluguéis em aberto</span>
                <FiActivity />
              </div>
              <strong>{stats.ativos.toString().padStart(2, '0')}</strong>
              <small>Pendentes e entregues · todos os meses</small>
            </div>
            <div className={styles.stat}>
              <div>
                <span>Jogos em uso agora</span>
                <FiPackage />
              </div>
              <strong>{stats.jogosEmUso.toString().padStart(2, '0')}</strong>
              <small>
                Em aluguéis entregues ·{' '}
                {listaItens(
                  stats.mesasEmUso,
                  stats.cadeirasEmUso,
                  stats.forrosEmUso
                )}
              </small>
            </div>
          </div>
          <div className={styles.bottomGrid}>
            <section className="panel">
              <div className="section-heading">
                <div>
                  <h2>Próximos compromissos</h2>
                  <p className={styles.caption}>
                    Entregas e devoluções que precisam de você
                  </p>
                </div>
                <span className={styles.countPill}>{agenda.length}</span>
              </div>
              {agenda.length === 0 ? (
                <div className={styles.empty}>
                  <FiCheckCircleIcon />
                  <strong>Tudo em dia por aqui.</strong>
                  <p>Novos compromissos aparecem ao cadastrar um aluguel.</p>
                </div>
              ) : (
                <div className={styles.agenda}>
                  {agenda
                    .slice(0, 4)
                    .map(({ aluguel, tipo, data, atrasado }) => (
                      <Link
                        href={`/Aluguel/Edit/${aluguel.id}`}
                        key={aluguel.id}
                        className={styles.agendaRow}
                      >
                        <div
                          className={`${styles.eventIcon} ${tipo === 'Devolução' ? styles.returnIcon : ''}`}
                        >
                          {tipo === 'Entrega' ? <FiTruck /> : <FiRotateCcw />}
                        </div>
                        <div className={styles.eventInfo}>
                          <strong>{aluguel.nomeCliente}</strong>
                          <span>
                            {tipo} · {resumoItens(aluguel)}
                          </span>
                        </div>
                        <div className={styles.eventDate}>
                          <strong>
                            {data ? dateLabel(data) : 'A definir'}
                          </strong>
                          <small className={atrasado ? styles.overdue : ''}>
                            {atrasado
                              ? 'Atrasado'
                              : (tipo === 'Entrega'
                                  ? aluguel.horaEntrega
                                  : aluguel.horaDevolucao) || 'Sem horário'}
                          </small>
                        </div>
                        <FiArrowUpRight className="muted" />
                      </Link>
                    ))}
                </div>
              )}
              <Link href="/Aluguel/List" className="text-button">
                Ver todos os aluguéis <FiArrowRight />
              </Link>
            </section>
            <section className="panel">
              <div className="section-heading">
                <h2>Seus aluguéis</h2>
                <Link href="/Aluguel/List" className={styles.smallLink}>
                  Ver lista <FiArrowUpRight />
                </Link>
              </div>
              {recentes.length === 0 ? (
                <div className={styles.empty}>
                  <FiPackage size={26} />
                  <strong>Seu primeiro aluguel começa aqui.</strong>
                  <p>Cadastre um pedido para acompanhar seus números.</p>
                  <Link href="/Aluguel/New" className="primary">
                    <FiPlus /> Novo aluguel
                  </Link>
                </div>
              ) : (
                <div className={styles.recentList}>
                  {recentes.map(a => (
                    <Link
                      key={a.id}
                      href={`/Aluguel/Edit/${a.id}`}
                      className={styles.recentRow}
                    >
                      <span className={styles.initial}>
                        {a.nomeCliente.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <strong>{a.nomeCliente}</strong>
                        <small>
                          {dateLabel(a.dataEntrega)} · {resumoItens(a)}
                        </small>
                      </div>
                      <div className={styles.recentValue}>
                        <strong>{money(a.valor)}</strong>
                        <span className={`badge ${a.status}`}>
                          {statusLabel[a.status]}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
          <div className={styles.analyticsGrid}>
            <MonthlyChart
              historico={stats.historico}
              receitaMensal={stats.receitaMensal}
            />
            <StatusChart
              status={stats.status}
              total={stats.locacoesNoMes}
              ticketMedio={stats.ticketMedio}
            />
          </div>
        </>
      )}
      <ResumoDespesas periodo={periodo} />
    </>
  );
}
function hojeExtenso() {
  const texto = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
function FiCheckCircleIcon() {
  return <FiCalendar size={26} />;
}
