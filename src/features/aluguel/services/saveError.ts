export function mensagemErroOperacao(
  error: unknown,
  acao: 'salvar o aluguel' | 'excluir o aluguel' | 'atualizar o status'
): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code).replace(/^firestore\//, '')
      : '';
  return code === 'permission-denied'
    ? `Esta conta não tem permissão para ${acao}. Peça ajuda para liberar o acesso.`
    : code === 'unauthenticated'
      ? `Sua sessão não está autenticada. Entre novamente para ${acao}.`
      : code === 'unavailable' || code === 'deadline-exceeded'
        ? 'Não foi possível acessar o sistema agora. Confira sua conexão e tente novamente.'
        : `Não foi possível ${acao}. Tente novamente.`;
}

export function mensagemErroAoSalvar(error: unknown): string {
  return (
    mensagemErroOperacao(error, 'salvar o aluguel') +
    ' Seus dados continuam aqui.'
  );
}
