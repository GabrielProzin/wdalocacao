'use client';

import Link from 'next/link';
import { Aluguel } from '@/features/aluguel/models/Aluguel';
import { useAluguelForm } from '@/features/aluguel/hooks/useAluguelForm';
import styles from '@/styles/rent/rent.module.css';
import layout from '@/styles/layout.module.css';
import { montserrat, openSans, poppins } from '@/fonts/fonts';
import { formatarDistanciaLegivel } from '@/utils/aluguelUtils';
import {
  formatarNome,
  formatarTelefone,
} from '@/features/validationFunctions/validationFunctions';
type Props = {
  aluguel?: Aluguel;
  modo?: 'cadastro' | 'editar';
};

export default function AluguelForm({ aluguel, modo = 'cadastro' }: Props) {
  const {
    form,
    setForm,
    handleSubmit,
    mensagem,
    calcularValor,
    excluirAluguel,
  } = useAluguelForm(aluguel, modo);

  const jogosNumero = parseInt(form.jogos, 10);
  const forrosNumero = parseInt(form.forroQuantidade, 10);
  const valorFreteNumero = parseInt(form.valorFrete, 10);
  const distanciaMetros = parseInt(form.distanciaKM, 10);

  return (
    <main className={layout.mainPage}>
      <div className={styles.container}>
        <h1 className={`${styles.title} ${poppins.className}`}>
          {modo === 'editar' ? 'Editar Aluguel' : 'Cadastro de Aluguel'}
        </h1>

        <form
          onSubmit={handleSubmit}
          className={`${styles.form} ${openSans.className}`}
        >
          <label>Nome do cliente:</label>
          <input
            type="text"
            value={form.nomeCliente}
            onChange={e =>
              setForm({ ...form, nomeCliente: formatarNome(e.target.value) })
            }
            maxLength={60}
            required
            className={styles.input}
          />

          <label>Telefone:</label>
          <input
            type="tel"
            value={form.telefoneCliente}
            onChange={e =>
              setForm({
                ...form,
                telefoneCliente: formatarTelefone(e.target.value),
              })
            }
            maxLength={15}
            required
            className={styles.input}
          />

          <label>Jogos:</label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.jogos}
            onChange={e =>
              setForm({
                ...form,
                jogos: e.target.value.replace(/^0+/, '') || '0',
              })
            }
            required
            className={styles.input}
          />

          <label>Forros:</label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.forroQuantidade}
            onChange={e =>
              setForm({
                ...form,
                forroQuantidade: e.target.value.replace(/^0+/, '') || '0',
              })
            }
            className={styles.input}
          />

          <label>Endereço da entrega:</label>
          <input
            type="text"
            value={form.enderecoEntrega}
            onChange={e =>
              setForm({ ...form, enderecoEntrega: e.target.value })
            }
            maxLength={75}
            required
            className={styles.input}
          />

          <label>Distância (em metros):</label>
          <input
            type="text"
            value={form.distanciaKM}
            onChange={e =>
              setForm({
                ...form,
                distanciaKM: e.target.value.replace(/^0+/, '') || '0',
              })
            }
            className={styles.input}
            required
          />

          <label>
            <input
              type="checkbox"
              checked={form.frete}
              onChange={() => setForm({ ...form, frete: !form.frete })}
            />{' '}
            Incluir frete?
          </label>

          {form.frete && (
            <>
              <label>Valor do frete:</label>
              <div className={styles.inputWithPrefix}>
                <span className={styles.prefix}>R$</span>
                <input
                  type="number"
                  value={form.valorFrete}
                  onChange={e =>
                    setForm({
                      ...form,
                      valorFrete: e.target.value.replace(/^0+/, '') || '0',
                    })
                  }
                  required
                  className={styles.input}
                />
              </div>
            </>
          )}

          <label>Data de entrega:</label>
          <input
            type="date"
            value={form.dataEntrega}
            onChange={e => setForm({ ...form, dataEntrega: e.target.value })}
            required
            maxLength={8}
            className={styles.input}
          />

          <label>Hora de entrega:</label>
          <input
            type="time"
            value={form.horaEntrega}
            onChange={e => setForm({ ...form, horaEntrega: e.target.value })}
            className={styles.input}
          />

          <label>Data de devolução:</label>
          <input
            type="date"
            value={form.dataDevolucao}
            onChange={e => setForm({ ...form, dataDevolucao: e.target.value })}
            className={styles.input}
          />

          <label>Hora de devolução:</label>
          <input
            type="time"
            value={form.horaDevolucao}
            onChange={e => setForm({ ...form, horaDevolucao: e.target.value })}
            className={styles.input}
          />

          <label>Observações:</label>
          <textarea
            rows={3}
            maxLength={100}
            value={form.observacoes}
            onChange={e => setForm({ ...form, observacoes: e.target.value })}
            className={styles.input}
          />

          <label>Status:</label>
          <select
            value={form.status}
            onChange={e =>
              setForm({ ...form, status: e.target.value as Aluguel['status'] })
            }
            className={styles.input}
          >
            <option value="pendente">Pendente</option>
            <option value="entregue">Entregue</option>
            <option value="devolvido">Devolvido</option>
          </select>

          <p>
            Quantidade de jogos: {jogosNumero} = R$ {jogosNumero * 15} <br />
            Quantidade de forros: {forrosNumero} = R$ {forrosNumero * 5} <br />
            Distância: {formatarDistanciaLegivel(distanciaMetros)} <br />
            Valor Frete: {form.frete
              ? `R$ ${valorFreteNumero}`
              : 'Não incluso'}{' '}
            <br />
            <strong>💰 Valor total: R$ {calcularValor()}</strong>
          </p>

          {(modo === 'cadastro' || modo === 'editar') && (
            <button
              type="submit"
              className={`${styles.salvarCliente} ${montserrat.className}`}
            >
              {modo === 'cadastro' ? 'Cadastrar Aluguel' : 'Salvar Dados'}
            </button>
          )}

          {modo === 'editar' && (
            <button
              type="button"
              className={`${styles.btncExcluirAluguel} ${montserrat.className}`}
              onClick={() => excluirAluguel(aluguel!.id!)}
            >
              Excluir Aluguel
            </button>
          )}
          <Link href="/" className={`${styles.link} ${montserrat.className}`}>
            Voltar à tela inicial
          </Link>
          {mensagem && <p className={styles.mensagem}>{mensagem}</p>}
        </form>
      </div>
    </main>
  );
}
