export const formatarData = (data: Date | null | undefined): string => {
  if (!data) return '';
  const d = new Date(data);
  return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0];
};

export const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const parseLocalHour = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `${hh}:${mm}`;
};

export const formatarDistanciaLegivel = (metros: number): string => {
  if (metros < 1000) return `0.${metros.toString().padStart(3, '0')} mts`;
  const km = Math.floor(metros / 1000);
  const restante = metros % 1000;
  return restante === 0 ? `${km} km` : `${km} km e ${restante} mts`;
};

export const intervaloJogo = (jogos: number) => {
  if (jogos > 100)
    throw new Error('Número de jogos não pode ser maior que 100');
  return jogos;
};
