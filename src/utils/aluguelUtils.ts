export const formatarData = (data: Date | null | undefined): string => {
  if (!data) return '';
  const d = new Date(data);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const parseLocalHour = (timeStr: string): string => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `${hh}:${mm}`;
};

export const formatarDistanciaLegivel = (metros: number): string => {
  if (!Number.isFinite(metros) || metros < 0) return '0 m';
  if (metros < 1000) return `${metros} m`;
  const km = Math.floor(metros / 1000);
  const restante = metros % 1000;
  return restante === 0 ? `${km} km` : `${km} km e ${restante} m`;
};

export const intervaloJogo = (jogos: number) => {
  if (jogos > 100)
    throw new Error('Número de jogos não pode ser maior que 100');
  return jogos;
};
