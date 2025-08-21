type FirestoreTimestamp = {
  seconds: number;
  nanoseconds: number;
};

export function converterTimestampParaDate(
  timestamp: FirestoreTimestamp | null | undefined
): Date | null {
  if (!timestamp || typeof timestamp.seconds !== 'number') return null;
  return new Date(timestamp.seconds * 1000);
}

export function formatarDataHoraCompletaComHoraStr(
  data: Date | null,
  hora: string | undefined
): string {
  if (!data) return 'Data inválida';

  const novaData = new Date(data);

  if (hora) {
    const [h, m] = hora.split(':').map(Number);
    novaData.setHours(h);
    novaData.setMinutes(m);
  }

  return novaData.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatarDataSimples(data: Date | null): string {
  if (!data) return 'Data inválida';
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
