export type Aluguel = {
  id?: string;
  nomeCliente: string;
  telefoneCliente: string;
  itens: {
    jogos: number;
    mesaQuantidade: number;
    cadeiraQuantidade: number;
    forro?: boolean;
    forroQuantidade: number;
  };
  valor: number;
  frete?: boolean;
  distanciaKM?: number;
  valorFrete?: number;
  dataEntrega: Date | null;
  horaEntrega: string;
  dataDevolucao?: Date | null;
  horaDevolucao?: string;
  enderecoEntrega: string;
  status: 'pendente' | 'entregue' | 'devolvido';
  observacoes: string;
};
