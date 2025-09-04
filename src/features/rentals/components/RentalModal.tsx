'use client';

import { useEffect, useRef } from 'react';
import styles from '../rentals.module.css';

import { Aluguel } from '@/features/aluguel/models/Aluguel';
import { useAluguelForm } from '@/features/aluguel/hooks/useAluguelForm';
import {
  formatarNome,
  formatarTelefone,
} from '@/features/validationFunctions/validationFunctions';
import SummaryModal from './SummaryModal';

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

  const { form, setForm, handleSubmit, calcularValor, mensagem } =
    useAluguelForm(aluguel, modo);

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

  const stripLeadingZeros = (v: string) => v.replace(/^0+/, '') || '0';

  const onConfirmar = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(e);
  };

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
            {modo === 'editar' ? 'Editar Aluguel' : 'Novo Aluguel'}
          </h3>
          <button
            className={styles.iconBtn}
            onClick={onClose}
            aria-label="Fechar"
            type="button"
          >
            ✖
          </button>
        </div>

        <form onSubmit={onConfirmar}>
          <div className={styles.modalBody}>
            <div className={styles.formContainer}>
              <div className={styles.formRow}>
                <label>Cliente</label>
                <input
                  type="text"
                  placeholder="Nome:"
                  value={form.nomeCliente}
                  maxLength={60}
                  required
                  onChange={e =>
                    setForm({
                      ...form,
                      nomeCliente: formatarNome(e.target.value),
                    })
                  }
                />
              </div>

              <div className={styles.formRow}>
                <label>Telefone</label>
                <input
                  type="tel"
                  placeholder="Ex: (62) 91234-5678"
                  value={form.telefoneCliente}
                  onChange={e =>
                    setForm({
                      ...form,
                      telefoneCliente: formatarTelefone(e.target.value),
                    })
                  }
                  maxLength={15}
                  required
                />
              </div>

              <div className={styles.formRowTwoCols}>
                <div className={styles.field}>
                  <label>Jogos</label>
                  <input
                    type="number"
                    placeholder="Nº jogos"
                    min={0}
                    max={100}
                    value={form.jogos}
                    onChange={e =>
                      setForm({
                        ...form,
                        jogos: stripLeadingZeros(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Forros</label>
                  <input
                    type="number"
                    placeholder="Nº forros"
                    min={0}
                    max={100}
                    value={form.forroQuantidade}
                    onChange={e =>
                      setForm({
                        ...form,
                        forroQuantidade: stripLeadingZeros(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <label>Endereço</label>
                <input
                  type="text"
                  placeholder="Ex: Rua multirão.."
                  value={form.enderecoEntrega}
                  onChange={e =>
                    setForm({ ...form, enderecoEntrega: e.target.value })
                  }
                  maxLength={75}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label>Distância (m)</label>
                <input
                  type="text"
                  placeholder="Ex: 1000 metros"
                  value={form.distanciaKM}
                  onChange={e =>
                    setForm({
                      ...form,
                      distanciaKM: stripLeadingZeros(e.target.value),
                    })
                  }
                  required
                />
              </div>

              <div className={styles.formRowInline}>
                <input
                  id="incluirFrete"
                  type="checkbox"
                  checked={form.frete}
                  onChange={() => setForm({ ...form, frete: !form.frete })}
                />
                <label htmlFor="incluirFrete">Incluir frete?</label>
              </div>

              {form.frete && (
                <div className={styles.formRow}>
                  <label>Valor do frete</label>
                  <input
                    type="number"
                    value={form.valorFrete}
                    onChange={e =>
                      setForm({
                        ...form,
                        valorFrete: stripLeadingZeros(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              )}

              <div className={styles.grid2}>
                <div className={styles.formRow}>
                  <label>Data de Entrega</label>
                  <input
                    type="date"
                    value={form.dataEntrega}
                    onChange={e =>
                      setForm({ ...form, dataEntrega: e.target.value })
                    }
                    required
                  />
                </div>
                <div className={styles.formRow}>
                  <label>Data de Devolução</label>
                  <input
                    type="date"
                    value={form.dataDevolucao}
                    onChange={e =>
                      setForm({ ...form, dataDevolucao: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <label>Observações</label>
                <textarea
                  rows={3}
                  value={form.observacoes}
                  onChange={e =>
                    setForm({ ...form, observacoes: e.target.value })
                  }
                />
              </div>

              {mensagem && (
                <div className={styles.formRow}>
                  <p>{mensagem}</p>
                </div>
              )}
            </div>
          </div>

          {/* Resumo — usando exatamente seus nomes de variáveis */}
          <SummaryModal
            jogosNumero={jogosNumero}
            forrosNumero={forrosNumero}
            valorFreteNumero={valorFreteNumero}
            distanciaMetros={distanciaMetros}
            frete={form.frete}
            calcularValor={calcularValor}
          />

          <div className={styles.modalFooter}>
            <button type="button" className={styles.ghostBtn} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.primaryBtn}>
              {modo === 'editar' ? 'Salvar' : 'Confirmar Aluguel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
