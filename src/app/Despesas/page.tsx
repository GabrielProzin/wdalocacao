'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiPlus, FiDollarSign, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useDespesas } from '@/features/despesas/DespesasContext';
import {
  novoForm,
  resumoDespesas,
  tiposDespesa,
  type Despesa,
  type DespesaForm,
} from '@/features/despesas/model';
import {
  salvarDespesa,
  excluirDespesa,
  erroDespesa,
} from '@/features/despesas/despesaService';
import { money } from '@/utils/presentation';
import styles from '@/features/despesas/despesas.module.css';
function DespesasContent() {
  const search = useSearchParams();
  const { despesas, carregando, erro, recarregar } = useDespesas();
  const [aberto, setAberto] = useState(search.get('novo') === '1');
  const [editando, setEditando] = useState<string>();
  const [form, setForm] = useState<DespesaForm>(() => novoForm());
  const [periodo, setPeriodo] = useState(() => novoForm().data.slice(0, 7));
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const [mensagem, setMensagem] = useState('');
  const [falha, setFalha] = useState('');
  const [apagando, setApagando] = useState<Despesa | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (aberto) {
      title.current?.focus();
      title.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, [aberto, editando]);
  useEffect(() => {
    if (apagando) dialog.current?.showModal();
    else dialog.current?.close();
  }, [apagando]);
  function abrir(item?: Despesa) {
    setForm(novoForm(item));
    setEditando(item?.id);
    setAberto(true);
    setFalha('');
    setMensagem('');
  }
  function update<K extends keyof DespesaForm>(key: K, value: DespesaForm[K]) {
    setForm(current => ({ ...current, [key]: value }));
  }
  async function salvar(event: React.FormEvent) {
    event.preventDefault();
    if (inFlight.current) return;
    setFalha('');
    setMensagem('');
    if (!navigator.onLine) {
      setFalha(
        'Você está sem conexão. Seus dados continuam aqui; conecte-se à internet para salvar.'
      );
      return;
    }
    inFlight.current = true;
    setBusy(true);
    try {
      await salvarDespesa(form, editando);
      setMensagem(
        `Despesa ${editando ? 'atualizada' : 'registrada'} com sucesso!`
      );
      setPeriodo(form.data.slice(0, 7));
      setAberto(false);
      setEditando(undefined);
      setForm(novoForm());
    } catch (error) {
      setFalha(
        (error instanceof Error && !('code' in error)
          ? error.message
          : erroDespesa(error)) + ' Seus dados continuam aqui.'
      );
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  async function confirmarExclusao() {
    if (!apagando || inFlight.current) return;
    if (!navigator.onLine) {
      setFalha('Conecte-se à internet para excluir a despesa.');
      setApagando(null);
      return;
    }
    const id = apagando.id;
    inFlight.current = true;
    setBusy(true);
    setFalha('');
    setMensagem('');
    try {
      await excluirDespesa(id);
      setMensagem('Despesa excluída.');
      if (editando === id) {
        setAberto(false);
        setEditando(undefined);
      }
    } catch (error) {
      setFalha(erroDespesa(error));
    } finally {
      setApagando(null);
      inFlight.current = false;
      setBusy(false);
    }
  }
  const resumo = resumoDespesas(despesas, periodo);
  const lista = [...resumo.noMes].sort(
    (a, b) => b.data.localeCompare(a.data) || a.id.localeCompare(b.id)
  );
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">CADA GASTO NO SEU LUGAR</p>
          <h1>Suas despesas.</h1>
          <p>Combustível, materiais e outros gastos do negócio.</p>
        </div>
        <button className="primary" disabled={busy} onClick={() => abrir()}>
          <FiPlus /> Registrar despesa
        </button>
      </div>
      {mensagem && (
        <p role="status" className={styles.success}>
          {mensagem}
        </p>
      )}
      {falha && (
        <p role="alert" className="error-box">
          {falha}
        </p>
      )}
      {aberto && (
        <form className={`panel ${styles.form}`} onSubmit={salvar}>
          <h2 ref={title} tabIndex={-1}>
            {editando ? 'Editar despesa' : 'Registrar despesa'}
          </h2>
          <p className={styles.hint}>
            Preencha o valor e o tipo. A data já vem com o dia de hoje.
          </p>
          <fieldset disabled={busy} className={styles.fields}>
            <label>
              Valor gasto (R$) *
              <input
                inputMode="decimal"
                type="text"
                placeholder="Ex.: 50,00"
                required
                maxLength={16}
                value={form.valor}
                onChange={e => update('valor', e.target.value)}
              />
            </label>
            <label>
              Tipo da despesa *
              <select
                required
                value={form.tipo}
                onChange={e =>
                  update('tipo', e.target.value as DespesaForm['tipo'])
                }
              >
                <option value="">Escolha o tipo</option>
                {Object.entries(tiposDespesa).map(([tipo, label]) => (
                  <option value={tipo} key={tipo}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Data da despesa *
              <input
                type="date"
                required
                value={form.data}
                onChange={e => update('data', e.target.value)}
              />
            </label>
            {form.tipo === 'combustivel' && (
              <label>
                Quantidade de litros (opcional)
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex.: 10,5"
                  maxLength={12}
                  value={form.litros}
                  onChange={e => update('litros', e.target.value)}
                />
              </label>
            )}
            <label>
              Observação (opcional)
              <textarea
                rows={3}
                maxLength={200}
                placeholder="Ex.: Compra de 4 cadeiras"
                value={form.observacao}
                onChange={e => update('observacao', e.target.value)}
              />
            </label>
          </fieldset>
          <div className={styles.actions}>
            <button className="primary" disabled={busy}>
              {busy
                ? 'Salvando…'
                : editando
                  ? 'Salvar alterações'
                  : 'Salvar despesa'}
            </button>
            <button
              type="button"
              className="secondary"
              disabled={busy}
              onClick={() => {
                setAberto(false);
                setFalha('');
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
      <section className={`panel ${styles.summary}`}>
        <div className={styles.heading}>
          <h2>Despesas registradas</h2>
          <label>
            Mês das despesas
            <input
              type="month"
              value={periodo}
              onChange={e => e.target.value && setPeriodo(e.target.value)}
            />
          </label>
        </div>
        {erro ? (
          <div role="alert">
            <p>{erro}</p>
            <button className="secondary" onClick={recarregar}>
              Tentar novamente
            </button>
          </div>
        ) : carregando ? (
          <p role="status">Consultando suas despesas…</p>
        ) : (
          <>
            <p className={styles.hint}>Total do mês</p>
            <strong className={styles.total}>
              {money(resumo.totalCentavos / 100)}
            </strong>
            {lista.length === 0 ? (
              <div className="state">
                <FiDollarSign size={32} />
                <h3>Nenhuma despesa neste mês.</h3>
                <p>Seus gastos aparecem aqui depois de registrar.</p>
              </div>
            ) : (
              <ul className={styles.list}>
                {lista.map(item => (
                  <li key={item.id}>
                    <div className={styles.heading}>
                      <div>
                        <h3>{tiposDespesa[item.tipo]}</h3>
                        <p className={styles.hint}>
                          {item.data.split('-').reverse().join('/')}
                          {item.litros !== null &&
                            ` · ${item.litros.toLocaleString('pt-BR')} litros`}
                        </p>
                      </div>
                      <strong>{money(item.valorCentavos / 100)}</strong>
                    </div>
                    {item.observacao && (
                      <p className={styles.note}>{item.observacao}</p>
                    )}
                    <div className={styles.actions}>
                      <button
                        className="secondary"
                        disabled={busy}
                        onClick={() => abrir(item)}
                      >
                        <FiEdit2 /> Editar
                      </button>
                      <button
                        className={styles.delete}
                        disabled={busy}
                        onClick={() => {
                          setFalha('');
                          setApagando(item);
                        }}
                      >
                        <FiTrash2 /> Excluir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="excluir-despesa"
        onCancel={e => {
          if (busy) e.preventDefault();
          else setApagando(null);
        }}
      >
        <h2 id="excluir-despesa">Excluir esta despesa?</h2>
        <p>
          {apagando &&
            `${tiposDespesa[apagando.tipo]} · ${money(apagando.valorCentavos / 100)} · ${apagando.data.split('-').reverse().join('/')}`}
        </p>
        <p>A exclusão é permanente e não pode ser desfeita.</p>
        <div className={styles.actions}>
          <button
            className="secondary"
            disabled={busy}
            onClick={() => setApagando(null)}
          >
            Manter despesa
          </button>
          <button
            className={styles.delete}
            disabled={busy}
            onClick={confirmarExclusao}
          >
            {busy ? 'Excluindo…' : 'Excluir definitivamente'}
          </button>
        </div>
      </dialog>
    </>
  );
}
export default function DespesasPage() {
  return (
    <Suspense fallback={<p role="status">Preparando suas despesas…</p>}>
      <DespesasContent />
    </Suspense>
  );
}
