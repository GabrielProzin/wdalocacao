'use client';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Aluguel } from '../models/Aluguel';
import { observarAlugueis } from '../repositories/aluguelRepository';
type RentalData = {
  alugueis: Aluguel[];
  carregando: boolean;
  erro: string;
  recarregar: () => void;
};
const Context = createContext<RentalData | null>(null);
export function AlugueisProvider({ children }: { children: ReactNode }) {
  const [alugueis, setAlugueis] = useState<Aluguel[]>([]);
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
    return observarAlugueis(
      data => {
        setAlugueis(data);
        setCarregando(false);
      },
      error => {
        setErro(
          error.code === 'permission-denied'
            ? 'Esta conta não tem permissão para consultar os aluguéis. Peça ajuda para liberar o acesso.'
            : 'Não foi possível carregar os aluguéis. Verifique sua conexão e tente novamente.'
        );
        setCarregando(false);
      }
    );
  }, [attempt, online]);
  return (
    <Context.Provider
      value={{
        alugueis,
        carregando,
        erro: online
          ? erro
          : 'Você está sem conexão. Conecte-se à internet para consultar seus aluguéis.',
        recarregar: () => setAttempt(value => value + 1),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAlugueis() {
  const context = useContext(Context);
  if (!context)
    throw new Error('useAlugueis deve ser usado dentro de AlugueisProvider');
  return context;
}
