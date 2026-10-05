'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiSearch, FiPackage, FiRefreshCw } from 'react-icons/fi';
import AluguelCard from '@/features/aluguel/components/AluguelCard';
import { useListaAlugueis } from '@/features/aluguel/hooks/useListaAlugueis';
import { Aluguel } from '@/features/aluguel/models/Aluguel';
import { monthKey } from '@/features/dashboard/services/dashboardService';
import { statusLabel } from '@/utils/presentation';
import styles from '@/features/aluguel/components/list.module.css';
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
export default function ListRentPage() {
  const [status, setStatus] = useState<Aluguel['status'] | 'todos'>('todos');
  const [search, setSearch] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [sort, setSort] = useState('recentes');
  const {
    alugueis,
    carregando,
    erro,
    recarregar,
    mensagem,
    erroAtualizacao,
    atualizarStatus,
    loadingIds,
  } = useListaAlugueis();
  const filtered = alugueis
    .filter(
      a =>
        (status === 'todos' || a.status === status) &&
        (!periodo ||
          (!!a.dataEntrega && monthKey(a.dataEntrega) === periodo)) &&
        normalize(
          `${a.nomeCliente} ${a.telefoneCliente} ${a.enderecoEntrega}`
        ).includes(normalize(search.trim()))
    )
    .sort((a, b) =>
      sort === 'recentes'
        ? (b.dataEntrega?.getTime() ?? 0) - (a.dataEntrega?.getTime() ?? 0)
        : (a.dataEntrega?.getTime() ?? Infinity) -
          (b.dataEntrega?.getTime() ?? Infinity)
    );
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">TUDO NO SEU CONTROLE</p>
          <h1>Seus aluguéis.</h1>
          <p>Encontre um pedido, acompanhe a entrega e conclua a devolução.</p>
        </div>
        <Link href="/Aluguel/New" className="primary">
          <FiPlus size={18} /> Novo aluguel
        </Link>
      </div>
      <div className={`panel ${styles.filters}`}>
        <div className={styles.filterTop}>
          <label className={styles.search}>
            <FiSearch />
            <input
              aria-label="Buscar aluguéis"
              placeholder="Buscar por cliente, telefone ou endereço"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </label>
          <input
            aria-label="Filtrar por mês de entrega"
            type="month"
            value={periodo}
            onChange={e => setPeriodo(e.target.value)}
          />
          {periodo && (
            <button className="text-button" onClick={() => setPeriodo('')}>
              Limpar mês
            </button>
          )}
        </div>
        <div className={styles.filterBottom}>
          <div className={styles.tabs} aria-label="Filtrar por status">
            {(['todos', 'pendente', 'entregue', 'devolvido'] as const).map(
              value => (
                <button
                  key={value}
                  aria-pressed={status === value}
                  className={status === value ? styles.selectedTab : ''}
                  onClick={() => setStatus(value)}
                >
                  {value === 'todos' ? 'Todos' : statusLabel[value]}
                  <span>
                    {
                      alugueis.filter(
                        a => value === 'todos' || a.status === value
                      ).length
                    }
                  </span>
                </button>
              )
            )}
          </div>
          <select
            aria-label="Ordenar aluguéis"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="recentes">Mais recentes</option>
            <option value="entrega">Data de entrega</option>
          </select>
        </div>
      </div>
      {mensagem && (
        <p
          role={erroAtualizacao ? 'alert' : 'status'}
          className={erroAtualizacao ? 'error-box' : 'success-box'}
        >
          {mensagem}
        </p>
      )}
      {erro ? (
        <div className="state">
          <FiRefreshCw size={30} />
          <h2>Não conseguimos carregar a lista.</h2>
          <p>{erro}</p>
          <button className="primary" onClick={recarregar}>
            Tentar novamente
          </button>
        </div>
      ) : carregando ? (
        <div
          className={styles.cards}
          role="status"
          aria-label="Carregando aluguéis"
        >
          {[1, 2, 3].map(i => (
            <div className="skeleton" key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="state">
          <FiPackage size={34} />
          <h2>
            {alugueis.length
              ? 'Nenhum aluguel encontrado.'
              : 'Seu primeiro aluguel começa aqui.'}
          </h2>
          <p>
            {alugueis.length
              ? 'Tente outro nome, mês ou status.'
              : 'Cadastre um aluguel para organizar suas entregas e acompanhar o negócio.'}
          </p>
          {alugueis.length ? (
            <button
              className="secondary"
              onClick={() => {
                setStatus('todos');
                setSearch('');
                setPeriodo('');
              }}
            >
              Limpar filtros
            </button>
          ) : (
            <Link className="primary" href="/Aluguel/New">
              <FiPlus /> Novo aluguel
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className={styles.resultCount}>
            {filtered.length}{' '}
            {filtered.length === 1
              ? 'aluguel encontrado'
              : 'aluguéis encontrados'}
          </div>
          <ul className={styles.cards}>
            {filtered.map(a => (
              <AluguelCard
                key={a.id}
                aluguel={a}
                onStatusChange={atualizarStatus}
                salvando={loadingIds.has(a.id!)}
              />
            ))}
          </ul>
        </>
      )}
    </>
  );
}
