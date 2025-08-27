'use client';

import styles from './layout.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: Props) {
  return (
    <>
      <div
        className={`${styles.backdrop} ${open ? styles.backdropShow : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}
        aria-hidden={!open}
      >
        <div className={styles.sbHeader}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>🪑</span>
            <span className={styles.brandText}>WDA Locação</span>
          </div>
          <button
            className={styles.iconBtn}
            onClick={onClose}
            aria-label="Fechar menu"
          >
            ✖
          </button>
        </div>

        <nav className={styles.navGroup}>
          <h3 className={styles.navTitle}>Menu</h3>
          <ul className={styles.navList}>
            <li>
              <button className={styles.navItem}>Dashboard</button>
            </li>
            <li>
              <button className={styles.navItem}>Lista de Locações</button>
            </li>
            <li>
              <button className={styles.navItem}>Estoque</button>
            </li>
            <li>
              <button className={styles.navItem}>Financeiro</button>
            </li>
            <li>
              <button className={styles.navItem}>Despesas</button>
            </li>
          </ul>
        </nav>

        <nav className={styles.navGroup}>
          <h3 className={styles.navTitle}>Configurações</h3>
          <ul className={styles.navList}>
            <li>
              <button className={styles.navItem}>Sair</button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
