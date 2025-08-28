'use client';

import styles from './dashboard.module.css';
import { FaCalendarDay } from '@react-icons/all-files/fa/FaCalendarDay';
import { FaTable } from '@react-icons/all-files/fa/FaTable';
import { FaChair } from '@react-icons/all-files/fa/FaChair';
import { FaDollarSign } from '@react-icons/all-files/fa/FaDollarSign';

type Card = {
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'yellow' | 'purple';
  Icon: React.ComponentType<{ className?: string }>;
};

const cards: Card[] = [
  { label: 'Locações no mês', value: '12', color: 'blue', Icon: FaCalendarDay },
  { label: 'Mesas Disponíveis', value: '30', color: 'green', Icon: FaTable },
  {
    label: 'Cadeiras Disponíveis',
    value: '120',
    color: 'yellow',
    Icon: FaChair,
  },
  {
    label: 'Receita Mensal',
    value: 'R$ 8.540',
    color: 'purple',
    Icon: FaDollarSign,
  },
];

export default function StatsCards() {
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
