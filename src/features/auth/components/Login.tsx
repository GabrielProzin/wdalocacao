'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/lib/auth';

function getAllowedUids() {
  const multi = (process.env.NEXT_PUBLIC_ALLOWED_UIDS ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const single = (process.env.NEXT_PUBLIC_ALLOWED_UID ?? '').trim();
  return [...multi, ...(single ? [single] : [])];
}

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const allowedUids = getAllowedUids();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, senha);
      if (!allowedUids.includes(cred.user.uid)) {
        await signOut(auth);
        setErr('Usuário não autorizado.');
        return;
      }
      router.replace('/');
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const code = error.code ?? '';
        if (code.includes('invalid-credential')) {
          setErr('E-mail ou senha inválidos.');
        } else if (code.includes('too-many-requests')) {
          setErr('Muitas tentativas. Tente em alguns minutos.');
        } else {
          setErr('Falha ao entrar. Tente novamente.');
        }
      } else {
        setErr('Falha inesperada. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoComplete="username"
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={e => setSenha(e.target.value)}
        autoComplete="current-password"
      />
      {err && <div>{err}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
