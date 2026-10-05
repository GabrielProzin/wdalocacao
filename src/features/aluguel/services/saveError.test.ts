import { describe, expect, it } from 'vitest';
import { mensagemErroAoSalvar, mensagemErroOperacao } from './saveError';

describe('mensagens do salvamento', () => {
  it('identifica a operação e não atribui erros de permissão à conexão', () => {
    for (const acao of ['excluir o aluguel', 'atualizar o status'] as const) {
      const mensagem = mensagemErroOperacao(
        { code: 'firestore/permission-denied' },
        acao
      );
      expect(mensagem).toContain(acao);
      expect(mensagem).not.toContain('conexão');
      expect(
        mensagemErroOperacao({ code: 'deadline-exceeded' }, acao)
      ).toContain('conexão');
    }
  });
  it('distingue permissão negada de falha de conexão', () => {
    expect(mensagemErroAoSalvar({ code: 'permission-denied' })).toContain(
      'permissão'
    );
    expect(mensagemErroAoSalvar({ code: 'permission-denied' })).not.toContain(
      'conexão'
    );
    expect(mensagemErroAoSalvar({ code: 'unavailable' })).toContain('conexão');
    expect(mensagemErroAoSalvar({ code: 'unauthenticated' })).toContain(
      'autenticada'
    );
    expect(mensagemErroAoSalvar(new Error('unknown'))).toContain(
      'Seus dados continuam aqui'
    );
  });
});
