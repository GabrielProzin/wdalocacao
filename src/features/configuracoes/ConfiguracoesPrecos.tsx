'use client';

import { useEffect, useState } from 'react';
import { FiSettings, FiCheck } from 'react-icons/fi';
import {
  PRECO_JOGO,
  PRECO_FORRO,
  validarPrecos,
} from '@/features/aluguel/services/formService';
import {
  lerPrecosPadrao,
  salvarPrecosPadrao,
  PrecosPadrao,
} from '@/features/aluguel/services/precosPadrao';
import styles from './configuracoes.module.css';

const campos = [
  ['precoJogo', 'Preço do jogo (R$)'],
  ['precoForro', 'Preço do forro (R$)'],
  ['precoMesa', 'Preço da mesa avulsa (R$)'],
  ['precoCadeira', 'Preço da cadeira avulsa (R$)'],
] as const;

export default function ConfiguracoesPrecos() {
  const [precos, setPrecos] = useState<PrecosPadrao>({
    precoJogo: String(PRECO_JOGO),
    precoForro: String(PRECO_FORRO),
    precoMesa: '0',
    precoCadeira: '0',
  });
  const [erro, setErro] = useState('');
  const [salvo, setSalvo] = useState(false);
  useEffect(() => {
    const stored = lerPrecosPadrao();
    if (stored) setPrecos(stored);
  }, []);

  function salvar(event: React.FormEvent) {
    event.preventDefault();
    setSalvo(false);
    const error = validarPrecos(precos);
    if (error) {
      setErro(error);
      return;
    }
    try {
      salvarPrecosPadrao(precos);
      setErro('');
      setSalvo(true);
    } catch {
      setErro(
        'Não foi possível salvar os preços neste navegador. Tente novamente.'
      );
    }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <h1>Configurações</h1>
          <p>Defina os preços usados nos próximos aluguéis.</p>
        </div>
      </div>
      <form className={`panel ${styles.panel}`} onSubmit={salvar}>
        <div className={styles.heading}>
          <FiSettings size={24} />
          <div>
            <h2>Preços dos itens</h2>
            <p>1 jogo corresponde a 1 mesa e 4 cadeiras.</p>
          </div>
        </div>
        {erro && (
          <p role="alert" className="error-box">
            {erro}
          </p>
        )}
        <div className={styles.grid}>
          {campos.map(([key, label]) => (
            <div className={styles.field} key={key}>
              <label htmlFor={key}>{label}</label>
              <input
                id={key}
                name={key}
                value={precos[key]}
                inputMode="decimal"
                maxLength={10}
                required
                onChange={event => {
                  setPrecos(previous => ({
                    ...previous,
                    [key]: event.target.value,
                  }));
                  setErro('');
                  setSalvo(false);
                }}
              />
            </div>
          ))}
        </div>
        <p className={styles.note}>
          O cálculo automático usa estes preços. Deixe um preço em zero se
          preferir definir um valor combinado para esse item.
        </p>
        <p className={styles.note}>
          Os preços são guardados neste navegador. Alterações valem para novos
          cadastros e não modificam os aluguéis já registrados.
        </p>
        <button type="submit" className="primary">
          <FiCheck /> Salvar preços
        </button>
        {salvo && (
          <p role="status" className={styles.success}>
            Preços salvos! Os próximos cadastros neste navegador usarão esses
            valores.
          </p>
        )}
      </form>
    </>
  );
}
