'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/auth';
import { getAllowedUids } from '../../auth/utils/allowedUids';
import { humanizeFirebaseError } from '../../auth/utils/errorMessages';

type UseLoginReturn = {
  email: string;
  senha: string;
  setEmail: (v: string) => void;
  setSenha: (v: string) => void;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export function useLogin(redirectTo: string = '/'): UseLoginReturn {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, senha);

      const allowedUids = getAllowedUids();
      if (allowedUids.length > 0 && !allowedUids.includes(cred.user.uid)) {
        await signOut(auth);
        setErr('Usuário não autorizado.');
        return;
      }

      router.replace(redirectTo);
    } catch (err) {
      setErr(humanizeFirebaseError(err));
    } finally {
      setLoading(false);
    }
  }

  return { email, senha, setEmail, setSenha, loading, error, onSubmit };
}
