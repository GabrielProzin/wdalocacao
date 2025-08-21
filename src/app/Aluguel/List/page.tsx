'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AluguelCard from '@/features/aluguel/components/AluguelCard';
import AluguelLoader from '@/features/aluguel/components/AluguelLoader';
import { useListaAlugueis } from '@/features/aluguel/hooks/useListaAlugueis';
import styles from '@/styles/rent/list/rentList.module.css';
import { montserrat, poppins } from '@/fonts/fonts';
import { Aluguel } from '@/features/aluguel/models/Aluguel';

const statusOptions = ['todos', 'pendente', 'entregue', 'devolvido'] as const;

const statusMap: Record<
  'todos' | 'pendente' | 'entregue' | 'devolvido',
  Aluguel['status'][]
> = {
  todos: ['pendente', 'entregue', 'devolvido'],
  pendente: ['pendente'],
  entregue: ['entregue'],
  devolvido: ['devolvido'],
};

export default function ListRentPage() {
  const [statusSelecionado, setStatusSelecionado] = useState<
    Aluguel['status'] | 'todos'
  >('todos');
  const [alugueisFiltrados, setAlugueisFiltrados] = useState<Aluguel[]>([]);

  const { alugueis, carregando, mensagem, atualizarStatus } = useListaAlugueis(
    statusMap[statusSelecionado]
  );

  useEffect(() => {
    if (alugueis) {
      const ordenados = [...alugueis].sort((a, b) => {
        const aDate = a.dataEntrega ? new Date(a.dataEntrega).getTime() : 0;
        const bDate = b.dataEntrega ? new Date(b.dataEntrega).getTime() : 0;
        return aDate - bDate;
      });
      setAlugueisFiltrados(ordenados);
    }
  }, [alugueis]);

  return (
    <>
      <main className={styles.container}>
        <div className={styles.pageContainer}>
          <h1 className={`${styles.title} ${poppins.className}`}>
            Lista de Aluguéis
          </h1>

          <div className={styles.filtros}>
            {statusOptions.map(opcao => (
              <button
                key={opcao}
                onClick={() => setStatusSelecionado(opcao)}
                className={`${styles.filtroBotao} ${
                  statusSelecionado === opcao ? styles.ativo : ''
                }`}
              >
                {opcao.charAt(0).toUpperCase() + opcao.slice(1)}
              </button>
            ))}
          </div>

          {mensagem && <p className={styles.mensagem}>{mensagem}</p>}

          {carregando ? (
            <AluguelLoader />
          ) : (
            <ul className={styles.lista}>
              {alugueisFiltrados.map(aluguel => (
                <AluguelCard
                  key={aluguel.id}
                  aluguel={aluguel}
                  onStatusChange={atualizarStatus}
                />
              ))}
            </ul>
          )}
        </div>
      </main>

      {!carregando && (
        <div className={styles.fixedFooter}>
          <Link
            href="/Aluguel/New"
            className={`${styles.footerButton} ${montserrat.className}`}
          >
            Cadastrar novo Aluguel
          </Link>
          <Link
            href="/"
            className={`${styles.footerButton} ${montserrat.className}`}
          >
            Voltar à tela inicial
          </Link>
        </div>
      )}
    </>
  );
}
