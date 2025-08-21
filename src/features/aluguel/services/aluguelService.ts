import type { DocumentSnapshot } from 'firebase/firestore';
import { Aluguel } from '../models/Aluguel';
import * as repo from '../repositories/aluguelRepository';

export const cadastrarAluguel = async (aluguel: Omit<Aluguel, 'id'>) => {
  return repo.criarAluguel(aluguel);
};

export const listarAlugueis = async (): Promise<Aluguel[]> => {
  return repo.buscarAlugueis();
};

export type ListarAlugueisPaginadoOpts = {
  statusIn?: Aluguel['status'][];
  pageSize?: number;
  cursor?: DocumentSnapshot<Aluguel> | null;
};

export const listarAlugueisPaginado = async (
  opts?: ListarAlugueisPaginadoOpts
): Promise<{
  data: Aluguel[];
  nextCursor: DocumentSnapshot<Aluguel> | null;
}> => {
  return repo.buscarAlugueisPaginado(opts);
};

export const editarAluguel = async (id: string, parcial: Partial<Aluguel>) => {
  return repo.atualizarAluguel(id, parcial);
};

export const buscarAluguelPorId = async (
  id: string
): Promise<Aluguel | null> => {
  return repo.buscarAluguelPorId(id);
};

export const excluirAluguel = async (id: string) => {
  return repo.excluirAluguelPorId(id);
};
