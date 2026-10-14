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
  mesasAvulsas: string;
  cadeirasAvulsas: string;
  precoJogo: string;
  precoForro: string;
  precoMesa: string;
  precoCadeira: string;
  modoValor: 'automatico' | 'combinado';
  valorCombinado: string;
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
    mesasAvulsas: String(
      aluguel
        ? Math.max(0, aluguel.itens.mesaQuantidade - aluguel.itens.jogos)
        : 0
    ),
    cadeirasAvulsas: String(
      aluguel
        ? Math.max(0, aluguel.itens.cadeiraQuantidade - aluguel.itens.jogos * 4)
        : 0
    ),
    precoJogo: String(aluguel?.cobranca?.precoJogo ?? PRECO_JOGO),
    precoForro: String(aluguel?.cobranca?.precoForro ?? PRECO_FORRO),
    precoMesa: String(aluguel?.cobranca?.precoMesa ?? 0),
    precoCadeira: String(aluguel?.cobranca?.precoCadeira ?? 0),
    // O valor histórico não deve ser recalculado ao editar um registro antigo.
    modoValor:
      aluguel?.cobranca?.modo ?? (aluguel ? 'combinado' : 'automatico'),
    valorCombinado: String(
      aluguel?.cobranca?.valorCombinado ??
        (aluguel
          ? Math.max(
              0,
              aluguel.valor - (aluguel.frete ? (aluguel.valorFrete ?? 0) : 0)
            )
          : 0)
    ),
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
export const valorNumerico = (value: string) =>
  Number(value.trim().replace(',', '.'));
export const totalMesas = (form: AluguelFormData) =>
  Number(form.jogos) + Number(form.mesasAvulsas);
export const totalCadeiras = (form: AluguelFormData) =>
  Number(form.jogos) * 4 + Number(form.cadeirasAvulsas);
export function calcularValorForm(form: AluguelFormData) {
  const centavos = (value: string) =>
    Math.round((valorNumerico(value) || 0) * 100);
  const itens =
    form.modoValor === 'combinado'
      ? centavos(form.valorCombinado)
      : Number(form.jogos) * centavos(form.precoJogo) +
        Number(form.forroQuantidade) * centavos(form.precoForro) +
        Number(form.mesasAvulsas) * centavos(form.precoMesa) +
        Number(form.cadeirasAvulsas) * centavos(form.precoCadeira);
  return (itens + (form.frete ? centavos(form.valorFrete) : 0)) / 100;
}
export function validarPrecos(
  form: Pick<
    AluguelFormData,
    'precoJogo' | 'precoForro' | 'precoMesa' | 'precoCadeira'
  >
): string {
  const keys = [
    'precoJogo',
    'precoForro',
    'precoMesa',
    'precoCadeira',
  ] as const;
  for (const key of keys) {
    const value = valorNumerico(form[key]);
    if (
      !form[key].trim() ||
      !Number.isFinite(value) ||
      value < 0 ||
      value > 1000000 ||
      !/^\d+(?:[.,]\d{1,2})?$/.test(form[key].trim())
    )
      return 'Informe preços entre R$ 0 e R$ 1.000.000, com até duas casas decimais.';
  }
  return '';
}
export function validarEtapa(form: AluguelFormData, etapa: number): string {
  if (etapa === 0) {
    if (!form.nomeCliente.trim()) return 'Informe o nome do cliente.';
    if (!/^\d{10,11}$/.test(form.telefoneCliente.replace(/\D/g, '')))
      return 'Informe um telefone com DDD (10 ou 11 dígitos).';
    if (
      !Number.isInteger(Number(form.jogos)) ||
      !form.jogos.trim() ||
      Number(form.jogos) < 0 ||
      Number(form.jogos) > 100
    )
      return 'Escolha de 0 a 100 jogos.';
    for (const key of ['mesasAvulsas', 'cadeirasAvulsas'] as const) {
      if (
        !form[key].trim() ||
        !Number.isInteger(Number(form[key])) ||
        Number(form[key]) < 0 ||
        Number(form[key]) > 1000
      )
        return 'Informe quantidades avulsas inteiras entre 0 e 1000.';
    }
    if (
      !form.forroQuantidade.trim() ||
      !Number.isInteger(Number(form.forroQuantidade)) ||
      Number(form.forroQuantidade) < 0 ||
      Number(form.forroQuantidade) > 100
    )
      return 'A quantidade de forros deve estar entre 0 e 100.';
    if (
      !(
        Number(form.jogos) +
        Number(form.mesasAvulsas) +
        Number(form.cadeirasAvulsas) +
        Number(form.forroQuantidade)
      )
    )
      return 'Escolha pelo menos um item para o aluguel.';
    const erroPrecos = validarPrecos(form);
    if (erroPrecos) return erroPrecos;
    if (form.modoValor !== 'automatico' && form.modoValor !== 'combinado')
      return 'Escolha como calcular o valor.';
    if (
      form.modoValor === 'combinado' &&
      (!form.valorCombinado.trim() ||
        !/^\d+(?:[.,]\d{1,2})?$/.test(form.valorCombinado.trim()) ||
        !Number.isFinite(valorNumerico(form.valorCombinado)) ||
        valorNumerico(form.valorCombinado) <= 0 ||
        valorNumerico(form.valorCombinado) > 1000000)
    )
      return 'Informe um valor combinado maior que zero, com até duas casas decimais.';
    if (form.modoValor === 'automatico') {
      for (const [quantidade, preco] of [
        [form.jogos, form.precoJogo],
        [form.forroQuantidade, form.precoForro],
        [form.mesasAvulsas, form.precoMesa],
        [form.cadeirasAvulsas, form.precoCadeira],
      ]) {
        if (Number(quantidade) > 0 && valorNumerico(preco) <= 0)
          return 'Defina os preços dos itens no menu Configurações ou escolha um valor combinado.';
      }
    }
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
      mesaQuantidade: totalMesas(form),
      cadeiraQuantidade: totalCadeiras(form),
      forroQuantidade: Number(form.forroQuantidade),
    },
    valor: calcularValorForm(form),
    cobranca: {
      modo: form.modoValor,
      precoJogo: valorNumerico(form.precoJogo),
      precoForro: valorNumerico(form.precoForro),
      precoMesa: valorNumerico(form.precoMesa),
      precoCadeira: valorNumerico(form.precoCadeira),
      valorCombinado:
        form.modoValor === 'combinado' ? valorNumerico(form.valorCombinado) : 0,
    },
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
