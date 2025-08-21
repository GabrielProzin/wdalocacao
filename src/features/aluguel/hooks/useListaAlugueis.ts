import { useEffect, useMemo, useRef, useState } from 'react';
import {
  listarAlugueisPaginado,
  editarAluguel,
} from '../services/aluguelService';
import { Aluguel } from '../models/Aluguel';
import { DocumentSnapshot, DocumentData } from 'firebase/firestore';

const DEFAULT_STATUS: Aluguel['status'][] = [
  'pendente',
  'entregue',
  'devolvido',
];

export function useListaAlugueis(status?: Aluguel['status'][]) {
  const statusFilter = status ?? DEFAULT_STATUS;
  const statusKey = useMemo(
    () => (Array.isArray(statusFilter) ? statusFilter.join('|') : ''),
    [statusFilter]
  );

  const [alugueis, setAlugueis] = useState<Aluguel[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState('');
  const [cursor, setCursor] = useState<DocumentSnapshot<
    Aluguel,
    DocumentData
  > | null>(null);
  const [acabou, setAcabou] = useState(false);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

  const inFlight = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alugueisRef = useRef<Aluguel[]>([]);
  const lastFetchKeyRef = useRef<string | null>(null);
  const unmountedRef = useRef(false);

  useEffect(() => {
    alugueisRef.current = alugueis;
  }, [alugueis]);

  useEffect(() => {
    unmountedRef.current = false;
    if (lastFetchKeyRef.current === statusKey) return;
    lastFetchKeyRef.current = statusKey;

    (async () => {
      setCarregando(true);
      const { data, nextCursor } = await listarAlugueisPaginado({
        statusIn: statusFilter,
        pageSize: 50,
      });
      if (unmountedRef.current) return;

      setAlugueis(data);
      setCursor(nextCursor ?? null);
      setAcabou(!nextCursor);
      setCarregando(false);
    })();

    return () => {
      unmountedRef.current = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [statusKey, statusFilter]);

  const setLoadingFor = (id: string, on: boolean) =>
    setLoadingIds(prev => {
      const s = new Set(prev);
      if (on) {
        s.add(id);
      } else {
        s.delete(id);
      }
      return s;
    });

  const carregarMais = async () => {
    if (acabou || cursor == null) return;
    const { data, nextCursor } = await listarAlugueisPaginado({
      statusIn: statusFilter,
      pageSize: 50,
      cursor,
    });
    setAlugueis(prev => [...prev, ...data]);
    setCursor(nextCursor ?? null);
    setAcabou(!nextCursor);
  };

  const atualizarStatus = async (id: string, statusNovo: Aluguel['status']) => {
    setMensagem('');

    const atual = alugueisRef.current.find(a => a.id === id);
    if (!atual || atual.status === statusNovo) return;

    if (inFlight.current.has(id)) return;
    inFlight.current.add(id);
    setLoadingFor(id, true);

    const anterior = atual.status;
    setAlugueis(prev =>
      prev.map(a => (a.id === id ? { ...a, status: statusNovo } : a))
    );

    try {
      await editarAluguel(id, { status: statusNovo });
      setMensagem('✅ Status atualizado com sucesso!');
    } catch {
      setAlugueis(prev =>
        prev.map(a => (a.id === id ? { ...a, status: anterior } : a))
      );
      setMensagem('❌ Erro ao atualizar status.');
    } finally {
      inFlight.current.delete(id);
      setLoadingFor(id, false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setMensagem(''), 3000);
    }
  };

  return {
    alugueis,
    carregando,
    mensagem,
    atualizarStatus,
    loadingIds,
    carregarMais,
    acabou,
  };
}
