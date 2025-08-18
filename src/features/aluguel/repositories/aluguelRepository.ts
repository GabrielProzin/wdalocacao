import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  FirestoreDataConverter,
  DocumentSnapshot,
  getDocs,
  DocumentData,
  WithFieldValue,
  UpdateData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { Aluguel } from '../models/Aluguel';

const aluguelConverter: FirestoreDataConverter<Aluguel> = {
  toFirestore(a: WithFieldValue<Aluguel>): DocumentData {
    const copy: Partial<Aluguel> = { ...(a as Aluguel) };
    delete (copy as Partial<Aluguel>).id;

    const { dataEntrega, dataDevolucao, ...rest } = copy as Omit<Aluguel, 'id'>;

    return {
      ...rest,
      dataEntrega: dataEntrega
        ? Timestamp.fromDate(new Date(dataEntrega))
        : null,
      dataDevolucao: dataDevolucao
        ? Timestamp.fromDate(new Date(dataDevolucao))
        : null,
    };
  },

  fromFirestore(snap: QueryDocumentSnapshot): Aluguel {
    const d = snap.data() as DocumentData;

    const dataEntrega =
      d?.dataEntrega instanceof Timestamp
        ? d.dataEntrega.toDate()
        : d?.dataEntrega ?? null;

    const dataDevolucao =
      d?.dataDevolucao instanceof Timestamp
        ? d.dataDevolucao.toDate()
        : d?.dataDevolucao ?? null;

    const base = d as Omit<Aluguel, 'id' | 'dataEntrega' | 'dataDevolucao'>;

    return {
      id: snap.id,
      ...base,
      dataEntrega,
      dataDevolucao,
    };
  },
};

const aluguelCollection = collection(db, 'aluguel').withConverter(
  aluguelConverter
);

export async function criarAluguel(aluguel: Omit<Aluguel, 'id'>) {
  return addDoc(aluguelCollection, aluguel as Aluguel);
}

export async function buscarAlugueis(): Promise<Aluguel[]> {
  const pageSize = 50;
  const q = query(
    aluguelCollection,
    where('status', '==', 'pendente'),
    orderBy('dataEntrega', 'desc'),
    limit(pageSize)
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => d.data());
}

export type BuscarAlugueisOpts = {
  statusIn?: ('pendente' | 'entregue' | 'devolvido' | 'todos')[];
  pageSize?: number;
  cursor?: DocumentSnapshot<Aluguel> | null;
};

export async function buscarAlugueisPaginado({
  statusIn = ['pendente', 'entregue', 'devolvido'],
  pageSize = 50,
  cursor = null,
}: BuscarAlugueisOpts = {}): Promise<{
  data: Aluguel[];
  nextCursor: DocumentSnapshot<Aluguel> | null;
}> {
  const statusFiltro: Aluguel['status'][] = statusIn.includes('todos')
    ? ['pendente', 'entregue', 'devolvido']
    : (statusIn as Aluguel['status'][]);

  let qBase = query(
    aluguelCollection,
    where('status', 'in', statusFiltro),
    orderBy('dataEntrega', 'desc'),
    limit(pageSize)
  );

  if (cursor) {
    qBase = query(qBase, startAfter(cursor));
  }

  const snap = await getDocs(qBase);
  const data = snap.docs.map(d => d.data());
  const nextCursor =
    snap.docs.length === pageSize ? snap.docs[snap.docs.length - 1] : null;

  return { data, nextCursor };
}

export async function atualizarAluguel(
  id: string,
  parcial: UpdateData<Aluguel>
) {
  return updateDoc(doc(db, 'aluguel', id), parcial);
}

export async function buscarAluguelPorId(id: string): Promise<Aluguel | null> {
  const ref = doc(db, 'aluguel', id).withConverter(aluguelConverter);
  const aluguelDoc = await getDoc(ref);
  if (!aluguelDoc.exists()) return null;
  return aluguelDoc.data();
}

export async function excluirAluguelPorId(id: string) {
  return deleteDoc(doc(db, 'aluguel', id));
}
