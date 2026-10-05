'use client';
import { useRef, useState } from 'react';
import { Aluguel } from '../models/Aluguel';
import {
  cadastrarAluguel,
  editarAluguel,
  excluirAluguel,
} from '../services/aluguelService';
import {
  criarForm,
  calcularValorForm,
  montarAluguel,
} from '../services/formService';
import { useRouter } from 'next/navigation';
import {
  mensagemErroAoSalvar,
  mensagemErroOperacao,
} from '../services/saveError';
export function useAluguelForm(
  aluguel?: Aluguel,
  modo: 'cadastro' | 'editar' = 'cadastro'
) {
  const [form, setForm] = useState(() => criarForm(aluguel));
  const [mensagem, setMensagem] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const busy = useRef(false);
  const router = useRouter();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy.current || sucesso) return;
    if (!navigator.onLine) {
      setMensagem('Você está sem conexão. Conecte-se à internet para salvar.');
      return;
    }
    setMensagem('');
    let dados;
    try {
      dados = montarAluguel(form);
    } catch (error) {
      setMensagem(error instanceof Error ? error.message : 'Confira os dados.');
      return;
    }
    if (modo === 'editar' && !aluguel?.id) {
      setMensagem('Aluguel não encontrado. Volte à lista.');
      return;
    }
    busy.current = true;
    setSalvando(true);
    try {
      if (modo === 'editar' && aluguel?.id)
        await editarAluguel(aluguel.id, dados);
      else await cadastrarAluguel(dados);
      setSucesso(true);
    } catch (error) {
      setMensagem(mensagemErroAoSalvar(error));
    } finally {
      busy.current = false;
      setSalvando(false);
    }
  }
  async function excluirAluguelHandler(id: string) {
    if (!navigator.onLine) {
      setMensagem('Conecte-se à internet para excluir o aluguel.');
      return;
    }
    // A confirmação é exibida pelo formulário, antes de chamar este handler.
    if (busy.current || modo !== 'editar' || id !== aluguel?.id) return;
    busy.current = true;
    setSalvando(true);
    setMensagem('');
    try {
      await excluirAluguel(id);
      router.replace('/Aluguel/List');
    } catch (error) {
      setMensagem(mensagemErroOperacao(error, 'excluir o aluguel'));
    } finally {
      busy.current = false;
      setSalvando(false);
    }
  }
  function reiniciar() {
    setForm(criarForm());
    setSucesso(false);
    setMensagem('');
  }
  return {
    form,
    setForm,
    handleSubmit,
    mensagem,
    setMensagem,
    calcularValor: () => calcularValorForm(form),
    excluirAluguel: excluirAluguelHandler,
    salvando,
    sucesso,
    reiniciar,
  };
}
