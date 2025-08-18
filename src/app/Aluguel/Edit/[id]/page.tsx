'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { buscarAluguelPorId } from '@/features/aluguel/services/aluguelService';
import { Aluguel } from '@/features/aluguel/models/Aluguel';
import AluguelForm from '@/features/aluguel/components/AluguelForm';

export default function EditAluguelPage() {
  const { id } = useParams();
  const [aluguel, setAluguel] = useState<Aluguel | undefined>(undefined);

  useEffect(() => {
    const carregarAluguel = async () => {
      const dados = await buscarAluguelPorId(id as string);
      if (dados) setAluguel(dados);
    };
    carregarAluguel();
  }, [id]);

  return (
    <div>
      <AluguelForm aluguel={aluguel} modo="editar" />
    </div>
  );
}
