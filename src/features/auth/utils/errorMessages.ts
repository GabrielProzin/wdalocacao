import { FirebaseError } from 'firebase/app';

export function humanizeFirebaseError(err: unknown): string {
  if (!(err instanceof FirebaseError))
    return 'Falha ao entrar. Tente novamente.';

  switch (err.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/invalid-password':
      return 'E-mail ou senha inválidos.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
    case 'auth/network-request-failed':
      return 'Falha de rede. Verifique sua conexão.';
    default:
      return 'Falha ao entrar. Tente novamente.';
  }
}
