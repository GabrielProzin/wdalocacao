'use client';

import { useEffect, useRef } from 'react';
import styles from './rentals.module.css';

export default function RentalModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={styles.modalBackdrop}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      onClick={e => e.currentTarget === e.target && onClose()}
    >
      <div ref={panelRef} tabIndex={-1} className={styles.modalPanel}>
        <div className={styles.modalHeader}>
          <h3 id="modalTitle" className={styles.modalTitle}>
            Novo Aluguel
          </h3>
          <button
            className={styles.iconBtn}
            onClick={onClose}
            aria-label="Fechar"
          >
            ✖
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.formRow}>
            <label>Cliente</label>
            <input type="text" placeholder="Nome:" />
          </div>

          <div className={styles.formRow}>
            <label>Telefone</label>
            <input type="tel" placeholder="Ex: (62) 91234-5678" />
          </div>

          <div className={styles.formRow}>
            <label>Jogos</label>
            <input type="number" placeholder="Nº jogos" />
            <label>Forros</label>
            <input type="number" placeholder="Nº forros" />
          </div>

          <div className={styles.formRow}>
            <label>Endereço</label>
            <input type="text" placeholder="Ex: Rua multirão.." />
          </div>

          <div className={styles.formRow}>
            <label>Distância </label>
            <input type="text" placeholder="Ex: 1000 metros" />
          </div>

          <div>
            <label>
              <input type="checkbox" />
              Incluir frete?
            </label>
          </div>

          <div className={styles.grid2}>
            <div className={styles.formRow}>
              <label>Data de Entrega</label>
              <input type="date" />
            </div>

            <div className={styles.formRow}>
              <label>Data de Devolução</label>
              <input type="date" />
            </div>
          </div>

          <div className={styles.formRow}>
            <label>Observações</label>
            <textarea rows={3} />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.ghostBtn} onClick={onClose}>
            Cancelar
          </button>
          <button className={styles.primaryBtn}>Confirmar Aluguel</button>
        </div>
      </div>
    </div>
  );
}
