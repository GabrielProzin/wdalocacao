import { Aluguel } from '../models/Aluguel';
import styles from '@/styles/rent/list/rentList.module.css';
import { formatarDataSimples } from '@/utils/firebaseDate';
import { formatarDistanciaLegivel } from '@/utils/aluguelUtils';
import {
  MdPhone,
  MdTableRestaurant,
  MdAttachMoney,
  MdLocationOn,
  MdKeyboardReturn,
} from 'react-icons/md';
import { FaTruckArrowRight } from 'react-icons/fa6';
import { GiRolledCloth, GiPathDistance } from 'react-icons/gi';
import Link from 'next/link';
import { montserrat, openSans } from '@/fonts/fonts';

type Props = {
  aluguel: Aluguel;
  onStatusChange: (id: string, novoStatus: Aluguel['status']) => void;
};

export default function AluguelCard({ aluguel, onStatusChange }: Props) {
  const getStatusClass = (status: Aluguel['status']) => {
    if (status === 'entregue') return styles.statusEntregue;
    if (status === 'devolvido') return styles.statusDevolvido;
    return styles.statusPendente;
  };

  return (
    <li className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.nomeContainer}>
          <h2 className={`${styles.nome} ${openSans.className}`}>
            {aluguel.nomeCliente}
          </h2>
        </div>
        <div className={styles.statusWrapper}>
          <select
            className={`${styles.statusSelect} ${getStatusClass(
              aluguel.status
            )}`}
            value={aluguel.status ?? 'pendente'}
            onChange={e =>
              onStatusChange(aluguel.id!, e.target.value as Aluguel['status'])
            }
          >
            <option value="pendente">Pendente</option>
            <option value="entregue">Entregue</option>
            <option value="devolvido">Devolvido</option>
          </select>
        </div>
      </div>

      <div className={styles.separator}></div>

      <div className={`${styles.infoGrid} ${openSans.className}`}>
        <MdPhone size={20} />
        <span>{aluguel.telefoneCliente}</span>
        <MdTableRestaurant size={20} />
        <span>
          Jogos: {aluguel.itens.jogos} / Cadeiras:{' '}
          {aluguel.itens.cadeiraQuantidade}
        </span>
        <GiRolledCloth size={20} />
        <span>Forros: {aluguel.itens.forroQuantidade}</span>
        <MdAttachMoney size={20} />
        <span>Total: R${aluguel.valor}</span>
        <MdLocationOn size={20} />
        <span>{aluguel.enderecoEntrega}</span>
        <GiPathDistance size={20} />
        <span>
          Distância: {formatarDistanciaLegivel(Number(aluguel.distanciaKM))}
        </span>
        <FaTruckArrowRight size={20} />
        <span>Entrega: {formatarDataSimples(aluguel.dataEntrega)}</span>
        {aluguel.dataDevolucao && (
          <>
            <MdKeyboardReturn size={20} />
            <span>Devolução: {formatarDataSimples(aluguel.dataDevolucao)}</span>
          </>
        )}
      </div>

      <div className={styles.cardFooter}>
        <button className={`${styles.detalhesBtn} ${montserrat.className}`}>
          <Link href={`/Aluguel/Edit/${aluguel.id}`}
          className={`${styles.dtlhBtn}`}>DETALHES</Link>
        </button>
      </div>
    </li>
  );
}
