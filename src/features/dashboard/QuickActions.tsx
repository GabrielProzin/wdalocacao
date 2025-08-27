import styles from './dashboard.module.css';

export default function QuickActions({
  onNewRental,
}: {
  onNewRental: () => void;
}) {
  return (
    <section className={styles.actionsRow}>
      <button className={styles.primaryBtn} onClick={onNewRental}>
        Novo Aluguel
      </button>
    </section>
  );
}
