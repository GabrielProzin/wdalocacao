export const tiposDespesa = {
  combustivel: 'Combustível',
  materiais: 'Compra de materiais',
  manutencao: 'Manutenção',
  outros: 'Outros',
} as const;
export type TipoDespesa = keyof typeof tiposDespesa;
export type Despesa = {
  id: string;
  tipo: TipoDespesa;
  valorCentavos: number;
  data: string;
  litros: number | null;
  observacao: string;
};
export type DespesaForm = {
  tipo: TipoDespesa | '';
  valor: string;
  data: string;
  litros: string;
  observacao: string;
};
export function hoje() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function novoForm(despesa?: Despesa): DespesaForm {
  return despesa
    ? {
        tipo: despesa.tipo,
        valor: (despesa.valorCentavos / 100).toFixed(2).replace('.', ','),
        data: despesa.data,
        litros: despesa.litros?.toString().replace('.', ',') ?? '',
        observacao: despesa.observacao,
      }
    : { tipo: '', valor: '', data: hoje(), litros: '', observacao: '' };
}
export function prepararDespesa(form: DespesaForm): Omit<Despesa, 'id'> {
  const valor = form.valor.trim();
  if (!/^\d+(?:[.,]\d{1,2})?$/.test(valor))
    throw new Error('Informe o valor gasto, por exemplo 50,00.');
  const valorCentavos = Math.round(Number(valor.replace(',', '.')) * 100);
  if (
    !Number.isSafeInteger(valorCentavos) ||
    valorCentavos <= 0 ||
    valorCentavos > 1_000_000_000
  )
    throw new Error(
      'Informe um valor maior que zero e de até R$ 10.000.000,00.'
    );
  if (!Object.hasOwn(tiposDespesa, form.tipo))
    throw new Error('Escolha o tipo da despesa.');
  const date = new Date(`${form.data}T12:00:00`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(form.data) ||
    !Number.isFinite(date.getTime()) ||
    date.getFullYear() !== Number(form.data.slice(0, 4)) ||
    date.getMonth() + 1 !== Number(form.data.slice(5, 7)) ||
    date.getDate() !== Number(form.data.slice(8, 10))
  )
    throw new Error('Informe uma data válida para a despesa.');
  let litros: number | null = null;
  if (form.tipo === 'combustivel' && form.litros.trim()) {
    if (!/^\d+(?:[.,]\d{1,3})?$/.test(form.litros.trim()))
      throw new Error(
        'Informe os litros, por exemplo 10,5, ou deixe em branco.'
      );
    litros = Number(form.litros.replace(',', '.'));
    if (!Number.isFinite(litros) || litros <= 0 || litros > 100000)
      throw new Error(
        'A quantidade de litros deve ser maior que zero e de até 100.000.'
      );
  }
  if (form.observacao.length > 200)
    throw new Error('Use até 200 caracteres na observação.');
  return {
    tipo: form.tipo as TipoDespesa,
    valorCentavos,
    data: form.data,
    litros,
    observacao: form.observacao.trim(),
  };
}
export function resumoDespesas(items: Despesa[], periodo: string) {
  const noMes = items.filter(item => item.data.startsWith(periodo + '-'));
  const totalCentavos = noMes.reduce(
    (sum, item) => sum + item.valorCentavos,
    0
  );
  const porTipo = Object.entries(tiposDespesa).map(([tipo, label]) => ({
    tipo,
    label,
    centavos: noMes
      .filter(item => item.tipo === tipo)
      .reduce((sum, item) => sum + item.valorCentavos, 0),
  }));
  return { totalCentavos, porTipo, noMes };
}
