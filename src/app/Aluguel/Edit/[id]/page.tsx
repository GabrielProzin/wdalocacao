'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAlugueis } from '@/features/aluguel/hooks/AlugueisContext';
import AluguelForm from '@/features/aluguel/components/AluguelForm';
export default function EditAluguelPage() {
  const { id } = useParams<{ id: string }>();
  const { alugueis, carregando, erro, recarregar } = useAlugueis();
  const aluguel = alugueis.find(a => a.id === id);
  if (carregando)
    return (
      <div className="skeleton" role="status" aria-label="Carregando aluguel" />
    );
  if (erro)
    return (
      <div className="state">
        <h2>Não foi possível abrir o aluguel.</h2>
        <p>{erro}</p>
        <button className="primary" onClick={recarregar}>
          Tentar novamente
        </button>
      </div>
    );
  if (!aluguel)
    return (
      <div className="state">
        <h2>Aluguel não encontrado.</h2>
        <p>O pedido pode ter sido excluído. Confira sua lista de aluguéis.</p>
        <Link className="primary" href="/Aluguel/List">
          Voltar à lista
        </Link>
      </div>
    );
  return <AluguelForm key={id} aluguel={aluguel} modo="editar" />;
}
