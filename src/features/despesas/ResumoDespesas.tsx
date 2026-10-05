'use client';
import Link from 'next/link';
import { FiPlus, FiDollarSign } from 'react-icons/fi';
import { useDespesas } from './DespesasContext';
import { resumoDespesas } from './model';
import { money } from '@/utils/presentation';
import styles from './despesas.module.css';
export default function ResumoDespesas({ periodo }: { periodo: string }) {
  const { despesas, carregando, erro, recarregar } = useDespesas();
  const resumo = resumoDespesas(despesas, periodo);
  return (
    <section
      className={`panel ${styles.summary}`}
      aria-labelledby="despesas-resumo"
    >
      <div className={styles.heading}>
        <div>
          <p className="eyebrow">CONTROLE DOS GASTOS</p>
          <h2 id="despesas-resumo">Despesas do mês</h2>
        </div>
        <FiDollarSign size={24} />
      </div>
      {erro ? (
        <div role="alert">
          <p>{erro}</p>
          <button type="button" className="secondary" onClick={recarregar}>
            Tentar carregar despesas
          </button>
        </div>
      ) : carregando ? (
        <p role="status">Consultando suas despesas…</p>
      ) : (
        <>
          <strong className={styles.total}>
            {money(resumo.totalCentavos / 100)}
          </strong>
          <div className={styles.categories}>
            {resumo.porTipo.map(tipo => (
              <div key={tipo.tipo}>
                <span>{tipo.label}</span>
                <strong>{money(tipo.centavos / 100)}</strong>
              </div>
            ))}
          </div>
        </>
      )}
      <p className={styles.hint}>
        Gastos registrados neste mês. Os valores dos aluguéis são contratados;
        este resumo não representa o lucro.
      </p>
      <div className={styles.actions}>
        <Link href="/Despesas?novo=1" className="primary">
          <FiPlus /> Registrar despesa
        </Link>
        <Link href="/Despesas" className="secondary">
          Ver despesas
        </Link>
      </div>
    </section>
  );
}
