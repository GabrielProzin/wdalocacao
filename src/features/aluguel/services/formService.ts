import { Aluguel } from '../models/Aluguel';
import {
  formatarData,
  parseLocalDate,
  parseLocalHour,
} from '@/utils/aluguelUtils';
export const PRECO_JOGO = 15;
export const PRECO_FORRO = 5;
export type AluguelFormData = {
  nomeCliente: string;
  telefoneCliente: string;
  jogos: string;
  forroQuantidade: string;
  enderecoEntrega: string;
  distanciaKM: string;
  frete: boolean;
  valorFrete: string;
  dataEntrega: string;
  horaEntrega: string;
  dataDevolucao: string;
  horaDevolucao: string;
  status: Aluguel['status'];
  observacoes: string;
};
export function criarForm(aluguel?: Aluguel): AluguelFormData {
  return {
    nomeCliente: aluguel?.nomeCliente ?? '',
    telefoneCliente: aluguel?.telefoneCliente ?? '',
    jogos: String(aluguel?.itens.jogos ?? 0),
    forroQuantidade: String(aluguel?.itens.forroQuantidade ?? 0),
    enderecoEntrega: aluguel?.enderecoEntrega ?? '',
    distanciaKM: String(aluguel?.distanciaKM ?? 0),
    frete: aluguel?.frete ?? false,
    valorFrete: String(aluguel?.valorFrete ?? 0),
    dataEntrega: formatarData(aluguel?.dataEntrega),
    horaEntrega: aluguel?.horaEntrega?.slice(0, 5) ?? '',
    dataDevolucao: formatarData(aluguel?.dataDevolucao),
    horaDevolucao: aluguel?.horaDevolucao?.slice(0, 5) ?? '',
    status: aluguel?.status ?? 'pendente',
    observacoes: aluguel?.observacoes ?? '',
  };
}
export function calcularValorForm(form: AluguelFormData) {
  return (
    Math.round(
      ((Number(form.jogos) || 0) * PRECO_JOGO +
        (Number(form.forroQuantidade) || 0) * PRECO_FORRO +
        (form.frete ? Number(form.valorFrete) || 0 : 0)) *
        100
    ) / 100
  );
}
export function validarEtapa(form: AluguelFormData, etapa: number): string {
  if (etapa === 0) {
    if (!form.nomeCliente.trim()) return 'Informe o nome do cliente.';
    if (!/^\d{10,11}$/.test(form.telefoneCliente.replace(/\D/g, '')))
      return 'Informe um telefone com DDD (10 ou 11 dígitos).';
    if (
      !Number.isInteger(Number(form.jogos)) ||
      Number(form.jogos) < 1 ||
      Number(form.jogos) > 100
    )
      return 'Escolha de 1 a 100 jogos.';
    if (
      !Number.isInteger(Number(form.forroQuantidade)) ||
      Number(form.forroQuantidade) < 0 ||
      Number(form.forroQuantidade) > 100
    )
      return 'A quantidade de forros deve estar entre 0 e 100.';
  }
  if (etapa === 1) {
    if (!form.enderecoEntrega.trim()) return 'Informe o endereço da entrega.';
    if (
      !form.distanciaKM.trim() ||
      !Number.isInteger(Number(form.distanciaKM)) ||
      Number(form.distanciaKM) < 0
    )
      return 'Informe a distância em metros, sem valores negativos.';
    if (
      !form.dataEntrega ||
      !Number.isFinite(parseLocalDate(form.dataEntrega).getTime())
    )
      return 'Informe uma data de entrega válida.';
    if (form.horaDevolucao && !form.dataDevolucao)
      return 'Informe a data de devolução para definir o horário.';
    if (form.dataDevolucao) {
      const entrega = new Date(
        `${form.dataEntrega}T${form.horaEntrega || '00:00'}`
      );
      const devolucao = new Date(
        `${form.dataDevolucao}T${form.horaDevolucao || '23:59'}`
      );
      if (!Number.isFinite(devolucao.getTime()) || devolucao < entrega)
        return 'A devolução deve acontecer depois da entrega.';
    }
    if (
      form.frete &&
      (!form.valorFrete.trim() ||
        !Number.isFinite(Number(form.valorFrete)) ||
        Number(form.valorFrete) < 0)
    )
      return 'Informe um valor de frete válido.';
  }
  return '';
}
export function montarAluguel(form: AluguelFormData): Omit<Aluguel, 'id'> {
  const error = validarEtapa(form, 0) || validarEtapa(form, 1);
  if (error) throw new Error(error);
  return {
    nomeCliente: form.nomeCliente.trim(),
    telefoneCliente: form.telefoneCliente,
    itens: {
      jogos: Number(form.jogos),
      mesaQuantidade: Number(form.jogos),
      cadeiraQuantidade: Number(form.jogos) * 4,
      forroQuantidade: Number(form.forroQuantidade),
    },
    valor: calcularValorForm(form),
    valorFrete: form.frete ? Number(form.valorFrete) : 0,
    dataEntrega: parseLocalDate(form.dataEntrega),
    horaEntrega: form.horaEntrega ? parseLocalHour(form.horaEntrega) : '',
    dataDevolucao: form.dataDevolucao
      ? parseLocalDate(form.dataDevolucao)
      : null,
    horaDevolucao: form.horaDevolucao ? parseLocalHour(form.horaDevolucao) : '',
    enderecoEntrega: form.enderecoEntrega.trim(),
    frete: form.frete,
    distanciaKM: Number(form.distanciaKM),
    status: form.status,
    observacoes: form.observacoes.trim(),
  };
}
