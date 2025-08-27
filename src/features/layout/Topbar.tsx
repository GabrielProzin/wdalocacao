'use client';

import styles from './layout.module.css';

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.topLeft}>
        <button
          className={styles.iconBtn}
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          ☰
        </button>
        <h1 className={styles.topTitle}>Painel</h1>
      </div>

      <div className={styles.topRight}>
        <a
          href="/perfil"
          className={styles.userBox}
          aria-label="Perfil do usuário"
        >
          <div className={styles.userIcon}>W</div>
          <span className={styles.userName}>Wemerson Dias</span>
        </a>
      </div>
    </header>
  );
}
