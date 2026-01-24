'use client';

import styles from '../dashboard.module.css';
import { FaCalendarDay } from '@react-icons/all-files/fa/FaCalendarDay';
import { FaTable } from '@react-icons/all-files/fa/FaTable';
import { FaChair } from '@react-icons/all-files/fa/FaChair';
import { FaDollarSign } from '@react-icons/all-files/fa/FaDollarSign';

type Props = {
  locacoesNoMes: number;
  mesasDisponiveis: number;
  cadeirasDisponiveis: number;
  receitaMensal: number;
};

export default function StatsCards({
  locacoesNoMes,
  mesasDisponiveis,
  cadeirasDisponiveis,
  receitaMensal,
}: Props) {
  const cards = [
    {
      label: 'Locações no mês',
      value: locacoesNoMes,
      color: 'blue',
      Icon: FaCalendarDay,
    },
    {
      label: 'Mesas Disponíveis',
      value: mesasDisponiveis,
      color: 'green',
      Icon: FaTable,
    },
    {
      label: 'Cadeiras Disponíveis',
      value: cadeirasDisponiveis,
      color: 'yellow',
      Icon: FaChair,
    },
    {
      label: 'Receita Mensal',
      value: `R$ ${(receitaMensal ?? 0).toLocaleString('pt-BR')}`,
      color: 'purple',
      Icon: FaDollarSign,
    },
  ] as const;

  return (
    <section className={styles.cardsGrid}>
      {cards.map(({ label, value, color, Icon }) => (
        <article key={label} className={styles.card}>
          <div>
            <p className={styles.cardLabel}>{label}</p>
            <h3 className={styles.cardValue}>{value}</h3>
          </div>
          <div className={`${styles.iconWrap} ${styles[color]}`}>
            <Icon className={styles.icon} />
          </div>
        </article>
      ))}
    </section>
  );
}
