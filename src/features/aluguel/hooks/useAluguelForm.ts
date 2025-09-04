import { useEffect, useState, type FormEvent } from 'react';
import { Aluguel } from '@/features/aluguel/models/Aluguel';
import {
  formatarData,
  parseLocalDate,
  parseLocalHour,
  intervaloJogo,
} from '@/utils/aluguelUtils';
import {
  cadastrarAluguel,
  editarAluguel,
  excluirAluguel,
} from '@/features/aluguel/services/aluguelService';
import { useRouter } from 'next/navigation';

// Estado controlado do formulário
export type AluguelFormState = {
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

// Tipo do retorno do hook
export type UseAluguelFormReturn = {
  form: AluguelFormState;
  setForm: React.Dispatch<React.SetStateAction<AluguelFormState>>;
  handleSubmit: (e: FormEvent) => Promise<void>;
  calcularValor: () => number;
  mensagem: string | null;
  excluirAluguel: (id: string) => Promise<void>;
};

export function useAluguelForm(
  aluguel?: Aluguel,
  modo: 'cadastro' | 'editar' = 'cadastro'
): UseAluguelFormReturn {
  const [form, setForm] = useState<AluguelFormState>({
    nomeCliente: '',
    telefoneCliente: '',
    jogos: '0',
    forroQuantidade: '0',
    enderecoEntrega: '',
    distanciaKM: '0',
    frete: false,
    valorFrete: '0',
    dataEntrega: '',
    horaEntrega: '',
    dataDevolucao: '',
    horaDevolucao: '',
    status: 'pendente',
    observacoes: '',
  });

  const [mensagem, setMensagem] = useState<string | null>(null);
  const router = useRouter();

  const PRECO_JOGO = 15;
  const PRECO_FORRO = 5;

  useEffect(() => {
    if (modo === 'editar' && aluguel) {
      setForm({
        nomeCliente: aluguel.nomeCliente,
        telefoneCliente: aluguel.telefoneCliente,
        jogos: aluguel.itens?.jogos?.toString() ?? '0',
        forroQuantidade: aluguel.itens?.forroQuantidade?.toString() ?? '0',
        enderecoEntrega: aluguel.enderecoEntrega ?? '',
        distanciaKM: aluguel.distanciaKM?.toString() ?? '0',
        frete: aluguel.frete ?? false,
        valorFrete: aluguel.valorFrete?.toString() ?? '0',
        dataEntrega: formatarData(aluguel.dataEntrega),
        horaEntrega: aluguel.horaEntrega?.substring(0, 5) ?? '',
        dataDevolucao: formatarData(aluguel.dataDevolucao),
        horaDevolucao: aluguel.horaDevolucao?.substring(0, 5) ?? '',
        status: aluguel.status ?? 'pendente',
        observacoes: aluguel.observacoes ?? '',
      });
    }
  }, [aluguel, modo]);

  const calcularValor = (): number => {
    const jogos = parseInt(form.jogos, 10);
    const forros = parseInt(form.forroQuantidade, 10);
    const freteValor = form.frete ? parseInt(form.valorFrete, 10) : 0;
    return jogos * PRECO_JOGO + forros * PRECO_FORRO + freteValor;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (!form.nomeCliente) {
        setMensagem('❌ Informe o nome do cliente.');
        return;
      }
      if (parseInt(form.jogos, 10) < 1) {
        setMensagem('❌ O número de jogos deve ser no mínimo 1');
        return;
      }

      const novoAluguel: Omit<Aluguel, 'id'> = {
        nomeCliente: form.nomeCliente,
        telefoneCliente: form.telefoneCliente,
        itens: {
          jogos: intervaloJogo(parseInt(form.jogos, 10)),
          mesaQuantidade: parseInt(form.jogos, 10),
          cadeiraQuantidade: parseInt(form.jogos, 10) * 4,
          forroQuantidade: parseInt(form.forroQuantidade, 10),
        },
        valor: calcularValor(),
        valorFrete: form.frete ? parseInt(form.valorFrete, 10) : 0,
        dataEntrega: parseLocalDate(form.dataEntrega),
        horaEntrega: parseLocalHour(form.horaEntrega),
        dataDevolucao: parseLocalDate(form.dataDevolucao),
        horaDevolucao: parseLocalHour(form.horaDevolucao),
        enderecoEntrega: form.enderecoEntrega,
        frete: form.frete,
        distanciaKM: parseInt(form.distanciaKM, 10),
        status: form.status,
        observacoes: form.observacoes,
      };

      if (modo === 'editar' && aluguel?.id) {
        await editarAluguel(aluguel.id, novoAluguel);
        setMensagem('✅ Aluguel atualizado com sucesso!');
      } else {
        await cadastrarAluguel(novoAluguel);
        setMensagem('✅ Aluguel cadastrado com sucesso!');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setMensagem('❌ Erro ao salvar aluguel.');
    }
  };

  const excluirAluguelHandler = async (id: string): Promise<void> => {
    if (!id) return;
    const ok = window.confirm(
      'Tem certeza que deseja realizar a exclusão desse aluguel?'
    );
    if (!ok) return;

    try {
      await excluirAluguel(id);
      setMensagem('✅ Aluguel excluído com sucesso!');
      setTimeout(() => {
        router.push('/Aluguel/List');
      }, 1000);
    } catch {
      setMensagem('❌ Erro ao excluir Aluguel!');
    }
  };

  return {
    form,
    setForm,
    handleSubmit,
    mensagem,
    calcularValor,
    excluirAluguel: excluirAluguelHandler,
  };
}
