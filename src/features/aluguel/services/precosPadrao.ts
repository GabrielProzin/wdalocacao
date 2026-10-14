import { AluguelFormData, validarPrecos } from './formService';

const CHAVE = 'wda.precos-padrao.v1';
const campos = [
  'precoJogo',
  'precoForro',
  'precoMesa',
  'precoCadeira',
] as const;
export type PrecosPadrao = Pick<AluguelFormData, (typeof campos)[number]>;

export function lerPrecosPadrao(): PrecosPadrao | null {
  try {
    const raw = localStorage.getItem(CHAVE);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !campos.every(key => typeof data[key] === 'string'))
      return null;
    if (validarPrecos(data)) return null;
    return Object.fromEntries(
      campos.map(key => [key, data[key]])
    ) as PrecosPadrao;
  } catch {
    return null;
  }
}

export function salvarPrecosPadrao(form: PrecosPadrao) {
  const erro = validarPrecos(form);
  if (erro) throw new Error(erro);
  localStorage.setItem(
    CHAVE,
    JSON.stringify(Object.fromEntries(campos.map(key => [key, form[key]])))
  );
}
