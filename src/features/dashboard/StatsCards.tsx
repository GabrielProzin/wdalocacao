import styles from './dashboard.module.css';

export default function StatsCards() {
  return (
    <section className={styles.cardsGrid}>
      {[
        { label: 'Aluguéis Hoje', value: '12' },
        { label: 'Mesas Disponíveis', value: '48' },
        { label: 'Cadeiras Disponíveis', value: '120' },
        { label: 'Receita Mensal', value: 'R$ 8.540' },
      ].map((c, i) => (
        <article key={i} className={styles.card}>
          <div>
            <p className={styles.cardLabel}>{c.label}</p>
            <h3 className={styles.cardValue}>{c.value}</h3>
          </div>
        </article>
      ))}
    </section>
  );
}
