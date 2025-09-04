'use client';

import styles from '../rentals.module.css';
import { formatarDistanciaLegivel } from '@/utils/aluguelUtils';

type SummaryModalProps = {
  jogosNumero: number;
  forrosNumero: number;
  valorFreteNumero: number;
  distanciaMetros: number;
  frete: boolean;
  calcularValor: () => number;
};

export default function SummaryModal({
  jogosNumero,
  forrosNumero,
  valorFreteNumero,
  distanciaMetros,
  frete,
  calcularValor,
}: SummaryModalProps) {
  return (
    <div className={styles.summary}>
      <small>
        Quantidade de jogos: {jogosNumero} = R$ {jogosNumero * 15} <br />
        Quantidade de forros: {forrosNumero} = R$ {forrosNumero * 5} <br />
        Distância: {formatarDistanciaLegivel(distanciaMetros)} <br />
        Valor frete: {frete ? `R$ ${valorFreteNumero}` : 'Não incluso'} <br />
        <strong>Valor total: R$ {calcularValor()}</strong>
      </small>
    </div>
  );
}
