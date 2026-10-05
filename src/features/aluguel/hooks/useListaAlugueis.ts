'use client';
import { useRef, useState } from 'react';
import { editarAluguel } from '../services/aluguelService';
import { Aluguel } from '../models/Aluguel';
import { useAlugueis } from './AlugueisContext';
import { mensagemErroOperacao } from '../services/saveError';
export function useListaAlugueis(status?: Aluguel['status'][]) {
  const data = useAlugueis();
  const [mensagem, setMensagem] = useState('');
  const [erroAtualizacao, setErroAtualizacao] = useState(false);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const inFlight = useRef(new Set<string>());
  async function atualizarStatus(id: string, statusNovo: Aluguel['status']) {
    if (inFlight.current.has(id)) return;
    if (!navigator.onLine) {
      setErroAtualizacao(true);
      setMensagem('Conecte-se à internet para atualizar o status.');
      return;
    }
    inFlight.current.add(id);
    setLoadingIds(new Set(inFlight.current));
    setMensagem('');
    try {
      await editarAluguel(id, { status: statusNovo });
      setErroAtualizacao(false);
      setMensagem(
        'Status atualizado. Seu dashboard já está atualizado também.'
      );
    } catch (error) {
      setErroAtualizacao(true);
      setMensagem(mensagemErroOperacao(error, 'atualizar o status'));
    } finally {
      inFlight.current.delete(id);
      setLoadingIds(new Set(inFlight.current));
    }
  }
  return {
    ...data,
    alugueis: data.alugueis.filter(a => !status || status.includes(a.status)),
    mensagem,
    erroAtualizacao,
    atualizarStatus,
    loadingIds,
  };
}
