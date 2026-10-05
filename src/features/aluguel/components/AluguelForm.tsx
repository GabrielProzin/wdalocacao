'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiUser,
  FiTruck,
  FiClipboard,
  FiCheckCircle,
  FiPackage,
} from 'react-icons/fi';
import { Aluguel } from '../models/Aluguel';
import { useAluguelForm } from '../hooks/useAluguelForm';
import {
  AluguelFormData,
  PRECO_JOGO,
  PRECO_FORRO,
  validarEtapa,
} from '../services/formService';
import {
  formatarNome,
  formatarTelefone,
} from '@/features/validationFunctions/validationFunctions';
import { money, fullDate, statusLabel } from '@/utils/presentation';
import { parseLocalDate, formatarDistanciaLegivel } from '@/utils/aluguelUtils';
import styles from './form.module.css';
const steps = [
  { title: 'Cliente e itens', Icon: FiUser },
  { title: 'Entrega', Icon: FiTruck },
  { title: 'Revisão', Icon: FiClipboard },
];
export default function AluguelForm({
  aluguel,
  modo = 'cadastro',
}: {
  aluguel?: Aluguel;
  modo?: 'cadastro' | 'editar';
}) {
  const {
    form,
    setForm,
    handleSubmit,
    mensagem,
    setMensagem,
    calcularValor,
    excluirAluguel,
    salvando,
    sucesso,
    reiniciar,
  } = useAluguelForm(aluguel, modo);
  const [step, setStep] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = deleteDialog.current;
    if (deleteOpen && !dialog?.open) dialog?.showModal();
    else if (!deleteOpen && dialog?.open) dialog.close();
  }, [deleteOpen]);
  const heading = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  function update<K extends keyof AluguelFormData>(
    key: K,
    value: AluguelFormData[K]
  ) {
    setForm(previous => ({ ...previous, [key]: value }));
    setMensagem('');
  }
  function move(next: number) {
    if (next > step) {
      if (!formRef.current?.reportValidity()) return;
      const error = validarEtapa(form, step);
      if (error) {
        setMensagem(error);
        return;
      }
    }
    setMensagem('');
    setStep(next);
    requestAnimationFrame(() => {
      heading.current?.focus();
      heading.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }
  async function submit(e: React.FormEvent) {
    if (step < 2) {
      e.preventDefault();
      move(step + 1);
    } else await handleSubmit(e);
  }
  const input = (
    id: Exclude<keyof AluguelFormData, 'frete' | 'status'>,
    label: string,
    type = 'text',
    extra: React.InputHTMLAttributes<HTMLInputElement> = {}
  ) => (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={String(form[id])}
        onChange={e => update(id, e.target.value)}
        {...extra}
      />
    </div>
  );
  if (sucesso)
    return (
      <div className={styles.success}>
        <span className={styles.successIcon}>
          <FiCheckCircle size={38} />
        </span>
        <p className="eyebrow">TUDO CERTO</p>
        <h1>
          {modo === 'editar' ? 'Alterações salvas!' : 'Aluguel cadastrado!'}
        </h1>
        <p>
          O aluguel de <strong>{form.nomeCliente}</strong> já está na sua lista.
          Agora é só acompanhar a entrega e a devolução.
        </p>
        <div className={styles.successSummary}>
          <span>
            {Number(form.jogos)} jogos · {Number(form.forroQuantidade)} forros
          </span>
          <strong>{money(calcularValor())}</strong>
        </div>
        <div className={styles.successActions}>
          <Link href="/Aluguel/List" className="primary">
            Ver meus aluguéis <FiArrowRight />
          </Link>
          {modo === 'cadastro' && (
            <button
              className="secondary"
              onClick={() => {
                reiniciar();
                setStep(0);
              }}
            >
              Cadastrar outro
            </button>
          )}
        </div>
      </div>
    );
  return (
    <>
      <Link href="/Aluguel/List" className={styles.back}>
        <FiArrowLeft /> Voltar aos aluguéis
      </Link>
      <div className="page-heading">
        <div>
          <p className="eyebrow">DO PEDIDO À DEVOLUÇÃO</p>
          <h1>{modo === 'editar' ? 'Editar aluguel' : 'Novo aluguel.'}</h1>
          <p>Um passo de cada vez. Todos os detalhes em um só lugar.</p>
        </div>
      </div>
      <ol className={styles.steps}>
        {steps.map(({ title, Icon }, index) => (
          <li
            key={title}
            className={
              index === step
                ? styles.current
                : index < step
                  ? styles.completed
                  : ''
            }
            aria-current={index === step ? 'step' : undefined}
          >
            <span>{index < step ? <FiCheck /> : <Icon />}</span>
            <div>
              <small>PASSO {index + 1}</small>
              <strong>{title}</strong>
            </div>
          </li>
        ))}
      </ol>
      <form ref={formRef} onSubmit={submit} className={styles.layout}>
        <div className={`panel ${styles.formPanel}`}>
          <div className={styles.formTitle}>
            <span className={styles.sectionIcon}>
              {step === 0 ? (
                <FiUser />
              ) : step === 1 ? (
                <FiTruck />
              ) : (
                <FiClipboard />
              )}
            </span>
            <div>
              <h2 ref={heading} tabIndex={-1}>
                {steps[step].title}
              </h2>
              <p>
                {step === 0
                  ? 'Para quem é o aluguel e o que vai junto?'
                  : step === 1
                    ? 'Onde e quando vamos entregar?'
                    : 'Confira os detalhes antes de confirmar.'}
              </p>
            </div>
          </div>
          {mensagem && (
            <p role="alert" className="error-box">
              {mensagem}
            </p>
          )}
          <fieldset disabled={salvando} className={styles.fields}>
            {step === 0 && (
              <>
                <div className={styles.field}>
                  <label htmlFor="nomeCliente">
                    Nome do cliente <span>*</span>
                  </label>
                  <input
                    id="nomeCliente"
                    name="nomeCliente"
                    autoComplete="name"
                    placeholder="Como o cliente se chama?"
                    value={form.nomeCliente}
                    onChange={e =>
                      update('nomeCliente', formatarNome(e.target.value))
                    }
                    maxLength={60}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="telefoneCliente">
                    Telefone <span>*</span>
                  </label>
                  <input
                    id="telefoneCliente"
                    name="telefoneCliente"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="(00) 90000-0000"
                    value={form.telefoneCliente}
                    onChange={e =>
                      update(
                        'telefoneCliente',
                        formatarTelefone(e.target.value)
                      )
                    }
                    maxLength={15}
                    required
                  />
                </div>
                <div className={styles.divider} />
                <div className={styles.subheading}>
                  <FiPackage />
                  <strong>Itens do aluguel</strong>
                </div>
                <div className={styles.twoCols}>
                  {input('jogos', 'Quantidade de jogos *', 'number', {
                    min: 1,
                    max: 100,
                    step: 1,
                    inputMode: 'numeric',
                    required: true,
                  })}
                  {input('forroQuantidade', 'Quantidade de forros', 'number', {
                    min: 0,
                    max: 100,
                    step: 1,
                    inputMode: 'numeric',
                  })}
                </div>
                <div className={styles.itemNote}>
                  <span>1 jogo = 1 mesa + 4 cadeiras</span>
                  <span>
                    Jogo {money(PRECO_JOGO)} · Forro {money(PRECO_FORRO)}
                  </span>
                </div>
                <div className={styles.hint}>
                  <FiCheckCircle /> {Number(form.jogos) || 0} mesas e{' '}
                  {(Number(form.jogos) || 0) * 4} cadeiras neste aluguel.
                </div>
              </>
            )}
            {step === 1 && (
              <>
                {input('enderecoEntrega', 'Endereço da entrega *', 'text', {
                  maxLength: 75,
                  required: true,
                  autoComplete: 'street-address',
                  placeholder: 'Rua, número, bairro e referência',
                })}
                {input('distanciaKM', 'Distância em metros *', 'number', {
                  min: 0,
                  step: 1,
                  inputMode: 'numeric',
                  required: true,
                })}
                <p className={styles.fieldHint}>
                  {formatarDistanciaLegivel(Number(form.distanciaKM) || 0)}
                </p>
                <label className={styles.checkRow}>
                  <input
                    type="checkbox"
                    checked={form.frete}
                    onChange={e => update('frete', e.target.checked)}
                  />
                  <span>
                    <strong>Incluir frete</strong>
                    <small>O valor será somado ao total do aluguel.</small>
                  </span>
                </label>
                {form.frete &&
                  input('valorFrete', 'Valor do frete (R$) *', 'number', {
                    min: 0,
                    step: 0.01,
                    inputMode: 'decimal',
                    required: true,
                  })}
                <div className={styles.divider} />
                <div className={styles.subheading}>
                  <FiTruck />
                  <strong>Entrega e devolução</strong>
                </div>
                <div className={`${styles.twoCols} ${styles.dateCols}`}>
                  {input('dataEntrega', 'Data de entrega *', 'date', {
                    required: true,
                  })}
                  {input('horaEntrega', 'Hora de entrega', 'time')}
                </div>
                <div className={`${styles.twoCols} ${styles.dateCols}`}>
                  {input('dataDevolucao', 'Data de devolução', 'date', {
                    min: form.dataEntrega || undefined,
                  })}
                  {input('horaDevolucao', 'Hora de devolução', 'time')}
                </div>
                <p className={styles.fieldHint}>
                  Você pode definir a devolução depois.
                </p>
              </>
            )}
            {step === 2 && (
              <>
                <div className={styles.review}>
                  <div>
                    <small>CLIENTE</small>
                    <strong>{form.nomeCliente}</strong>
                    <span>{form.telefoneCliente}</span>
                  </div>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => move(0)}
                  >
                    Editar
                  </button>
                </div>
                <div className={styles.review}>
                  <div>
                    <small>ENTREGA</small>
                    <strong>
                      {fullDate(parseLocalDate(form.dataEntrega))}
                      {form.horaEntrega && ` às ${form.horaEntrega}`}
                    </strong>
                    <span>{form.enderecoEntrega}</span>
                    <span>
                      Devolução:{' '}
                      {form.dataDevolucao
                        ? fullDate(parseLocalDate(form.dataDevolucao))
                        : 'A definir'}
                      {form.horaDevolucao && ` às ${form.horaDevolucao}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => move(1)}
                  >
                    Editar
                  </button>
                </div>
                <div className={styles.field}>
                  <label htmlFor="observacoes">Observações</label>
                  <textarea
                    id="observacoes"
                    rows={3}
                    maxLength={100}
                    placeholder="Algum detalhe para lembrar?"
                    value={form.observacoes}
                    onChange={e => update('observacoes', e.target.value)}
                  />
                  <small>{form.observacoes.length}/100 caracteres</small>
                </div>
                <div className={styles.field}>
                  <label htmlFor="status">Status do aluguel</label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={e =>
                      update('status', e.target.value as Aluguel['status'])
                    }
                  >
                    {Object.entries(statusLabel).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </fieldset>
          <div className={styles.actions}>
            <button
              type="button"
              disabled={salvando}
              className="secondary"
              onClick={() =>
                step === 0 ? router.push('/Aluguel/List') : move(step - 1)
              }
            >
              <FiArrowLeft />
              {step === 0 ? 'Cancelar' : 'Voltar'}
            </button>
            <button type="submit" disabled={salvando} className="primary">
              {salvando
                ? 'Salvando…'
                : step < 2
                  ? 'Continuar'
                  : modo === 'editar'
                    ? 'Salvar alterações'
                    : 'Confirmar aluguel'}
              {step < 2 ? <FiArrowRight /> : <FiCheck />}
            </button>
          </div>
          {modo === 'editar' && aluguel?.id && (
            <button
              type="button"
              className={styles.deleteButton}
              disabled={salvando}
              onClick={() => setDeleteOpen(true)}
            >
              Excluir este aluguel
            </button>
          )}
        </div>
        <aside className={styles.summary}>
          <div className={styles.summaryHeader}>
            <FiClipboard />
            <strong>Resumo do aluguel</strong>
          </div>
          <p className={styles.summaryHint}>Seu pedido, sem surpresas.</p>
          <div className={styles.summaryLine}>
            <span>
              {Number(form.jogos) || 0} jogos × {money(PRECO_JOGO)}
            </span>
            <strong>{money((Number(form.jogos) || 0) * PRECO_JOGO)}</strong>
          </div>
          <div className={styles.summaryLine}>
            <span>
              {Number(form.forroQuantidade) || 0} forros × {money(PRECO_FORRO)}
            </span>
            <strong>
              {money((Number(form.forroQuantidade) || 0) * PRECO_FORRO)}
            </strong>
          </div>
          <div className={styles.summaryLine}>
            <span>Frete</span>
            <strong>
              {form.frete ? money(Number(form.valorFrete)) : 'Não incluso'}
            </strong>
          </div>
          <div className={styles.total}>
            <span>Valor total</span>
            <strong>{money(calcularValor())}</strong>
          </div>
          <p className={styles.summaryFoot}>
            <FiCheckCircle /> O total é calculado automaticamente.
          </p>
        </aside>
      </form>
      {modo === 'editar' && aluguel?.id && (
        <dialog
          ref={deleteDialog}
          className={styles.deleteDialog}
          aria-labelledby="delete-title"
          aria-describedby="delete-description"
          onCancel={event => {
            if (salvando) event.preventDefault();
            else setDeleteOpen(false);
          }}
        >
          <h2 id="delete-title">Excluir este aluguel?</h2>
          <p id="delete-description">
            O aluguel de <strong>{form.nomeCliente}</strong> será excluído
            permanentemente. Essa ação não pode ser desfeita.
          </p>
          <div className={styles.deleteActions}>
            <button
              type="button"
              className="secondary"
              disabled={salvando}
              onClick={() => setDeleteOpen(false)}
            >
              Manter aluguel
            </button>
            <button
              type="button"
              className={styles.confirmDelete}
              disabled={salvando}
              onClick={async () => {
                await excluirAluguel(aluguel.id!);
                setDeleteOpen(false);
              }}
            >
              {salvando ? 'Excluindo…' : 'Excluir definitivamente'}
            </button>
          </div>
        </dialog>
      )}
    </>
  );
}
