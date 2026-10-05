'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { observarDespesas, erroDespesa } from './despesaService';
import type { Despesa } from './model';
type Data = {
  despesas: Despesa[];
  carregando: boolean;
  erro: string;
  recarregar: () => void;
};
const Context = createContext<Data | null>(null);
export function DespesasProvider({ children }: { children: ReactNode }) {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  useEffect(() => {
    if (!online) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro('');
    return observarDespesas(
      items => {
        setDespesas(items);
        setCarregando(false);
      },
      error => {
        setErro(erroDespesa(error));
        setCarregando(false);
      }
    );
  }, [online, attempt]);
  return (
    <Context.Provider
      value={{
        despesas,
        carregando,
        erro: online
          ? erro
          : 'Você está sem conexão. Conecte-se à internet para consultar as despesas.',
        recarregar: () => setAttempt(value => value + 1),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useDespesas() {
  const data = useContext(Context);
  if (!data) throw new Error('useDespesas precisa de DespesasProvider');
  return data;
}
