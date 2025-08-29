'use client';

import { useEffect, useRef } from 'react';
import styles from './rentals.module.css';

import { Aluguel } from '@/features/aluguel/models/Aluguel';
import { useAluguelForm } from '@/features/aluguel/hooks/useAluguelForm';
import { montserrat, openSans, poppins } from '@/fonts/fonts';
import { formatarDistanciaLegivel } from '@/utils/aluguelUtils';
import {
  formatarNome,
  formatarTelefone,
} from '@/features/validationFunctions/validationFunctions';

type RentalModalProps = {
  open: boolean;
  onClose: () => void;
  aluguel?: Aluguel;
  modo?: 'cadastro' | 'editar';
};

export default function RentalModal({
  open,
  onClose,
  aluguel,
  modo = 'cadastro',
}: RentalModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const{
    form,
    setForm,
    handleSubmit,
    calcularValor,
    mensagem,
  } useAluguelForm(aluguel, modo)

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

  const jogosNumero = parseInt(form.jogos, 10);
  const forrosNumero = parseInt(form.forroQuantidade, 10);
  const valorFreteNumero = parseInt(form.valorFrete, 10);
  const distanciaMetros = parseInt(form.distanciaKM, 10);

  const onConfirmar = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSubmit(e)
  }


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
          <div className={styles.formContainer}>
            <div className={styles.formRow}>
              <label>Cliente</label>
              <input type="text" placeholder="Nome:" />
            </div>

            <div className={styles.formRow}>
              <label>Telefone</label>
              <input type="tel" placeholder="Ex: (62) 91234-5678" />
            </div>

            <div className={styles.formRowTwoCols}>
              <div className={styles.field}>
                <label>Jogos</label>
                <input type="number" placeholder="Nº jogos" />
              </div>
              <div className={styles.field}>
                <label>Forros</label>
                <input type="number" placeholder="Nº forros" />
              </div>
            </div>

            <div className={styles.formRow}>
              <label>Endereço</label>
              <input type="text" placeholder="Ex: Rua multirão.." />
            </div>

            <div className={styles.formRow}>
              <label>Distância</label>
              <input type="text" placeholder="Ex: 1000 metros" />
            </div>

            <div className={styles.formRowInline}>
              <input id="incluirFrete" type="checkbox" />
              <label htmlFor="incluirFrete">Incluir frete?</label>
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
