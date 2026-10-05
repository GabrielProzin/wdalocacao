import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { prepararDespesa, type Despesa, type DespesaForm } from './model';

const despesas = collection(db, 'despesas');
export function observarDespesas(
  onData: (items: Despesa[]) => void,
  onError: (error: unknown) => void
) {
  return onSnapshot(
    despesas,
    { includeMetadataChanges: true },
    snapshot => {
      if (snapshot.empty && snapshot.metadata.fromCache) return;
      onData(
        snapshot.docs.map(item => ({ ...item.data(), id: item.id }) as Despesa)
      );
    },
    onError
  );
}
export async function salvarDespesa(form: DespesaForm, id?: string) {
  const dados = prepararDespesa(form);
  if (id) await updateDoc(doc(despesas, id), dados);
  else await addDoc(despesas, dados);
}
export async function excluirDespesa(id: string) {
  await deleteDoc(doc(despesas, id));
}

export function erroDespesa(error: unknown) {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : '';
  if (code.endsWith('permission-denied'))
    return 'Esta conta não tem permissão para acessar as despesas. Peça ajuda para liberar o acesso.';
  if (code.endsWith('unauthenticated'))
    return 'Sua sessão terminou. Entre novamente para continuar.';
  if (code.endsWith('unavailable') || code.endsWith('deadline-exceeded'))
    return 'Não foi possível acessar o sistema. Confira sua conexão e tente novamente.';
  return 'Não foi possível concluir a operação. Tente novamente.';
}
