'use client';
import Link from 'next/link';
import {
  FiMapPin,
  FiCalendar,
  FiArrowUpRight,
  FiPhone,
  FiCheck,
  FiTruck,
} from 'react-icons/fi';
import { Aluguel } from '../models/Aluguel';
import { money, fullDate, statusLabel, eventDate } from '@/utils/presentation';
import { formatarDistanciaLegivel } from '@/utils/aluguelUtils';
import styles from './list.module.css';
export default function AluguelCard({
  aluguel: a,
  onStatusChange,
  salvando = false,
}: {
  aluguel: Aluguel;
  onStatusChange: (id: string, status: Aluguel['status']) => void;
  salvando?: boolean;
}) {
  const next = a.status === 'pendente' ? 'entregue' : 'devolvido';
  const date = eventDate(
    a.status === 'pendente' ? a.dataEntrega : a.dataDevolucao,
    a.status === 'pendente' ? a.horaEntrega : a.horaDevolucao
  );
  const overdue =
    a.status !== 'devolvido' && date && date.getTime() < Date.now();
  return (
    <li className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.initial}>
          {a.nomeCliente.charAt(0).toUpperCase()}
        </span>
        <div className={styles.client}>
          <h2>{a.nomeCliente}</h2>
          <a href={`tel:${a.telefoneCliente.replace(/\D/g, '')}`}>
            <FiPhone size={10} />
            {a.telefoneCliente}
          </a>
        </div>
        <span className={`badge ${a.status}`}>
          <i className="badge-dot" />
          {statusLabel[a.status]}
        </span>
      </div>
      <div className={styles.itemRow}>
        <span>
          <strong>{a.itens.jogos}</strong> jogos
        </span>
        <span>
          <strong>{a.itens.cadeiraQuantidade}</strong> cadeiras
        </span>
        <span>
          <strong>{a.itens.forroQuantidade}</strong> forros
        </span>
      </div>
      <div className={styles.cardInfo}>
        <p>
          <FiMapPin />
          <span>{a.enderecoEntrega}</span>
        </p>
        <p>
          <FiCalendar />
          <span>
            Entrega: <strong>{fullDate(a.dataEntrega)}</strong> {a.horaEntrega}
          </span>
        </p>
        <p>
          <FiCalendar />
          <span>
            Devolução: <strong>{fullDate(a.dataDevolucao)}</strong>{' '}
            {a.horaDevolucao}
          </span>
        </p>
      </div>
      {overdue && (
        <p className={styles.overdue}>
          {a.status === 'pendente' ? 'Entrega' : 'Devolução'} em atraso. Confira
          o status deste pedido.
        </p>
      )}
      <details className={styles.details}>
        <summary>Mais informações</summary>
        <p>Distância: {formatarDistanciaLegivel(Number(a.distanciaKM) || 0)}</p>
        <p>Frete: {a.frete ? money(a.valorFrete || 0) : 'Não incluso'}</p>
        {a.observacoes && <p>Observações: {a.observacoes}</p>}
      </details>
      <div className={styles.cardBottom}>
        <div>
          <small>VALOR TOTAL</small>
          <strong>{money(a.valor)}</strong>
        </div>
        <Link className="secondary" href={`/Aluguel/Edit/${a.id}`}>
          Editar <FiArrowUpRight />
        </Link>
      </div>
      {a.status !== 'devolvido' && (
        <button
          className={styles.advanceStatus}
          disabled={salvando}
          onClick={() => a.id && onStatusChange(a.id, next)}
        >
          {salvando ? (
            'Atualizando…'
          ) : a.status === 'pendente' ? (
            <>
              <FiTruck /> Marcar como entregue
            </>
          ) : (
            <>
              <FiCheck /> Concluir devolução
            </>
          )}
        </button>
      )}
    </li>
  );
}
