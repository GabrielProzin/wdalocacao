'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/auth';
import { getAllowedUids } from '../../auth/utils/allowedUids';
import { humanizeFirebaseError } from '../../auth/utils/errorMessages';
import { FirebaseError } from 'firebase/app';

type UseLoginReturn = {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};

export function useLogin(redirectTo: string = '/'): UseLoginReturn {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      const allowedUids = getAllowedUids();
      if (allowedUids.length > 0 && !allowedUids.includes(cred.user.uid)) {
        await signOut(auth);
        setErr('Usuário não autorizado.');
        return;
      }

      router.replace(redirectTo);
    } catch (err) {
      if (err instanceof FirebaseError) {
        console.log('[AUTH ERROR]', err.code, err.message);
      } else {
        console.log('[AUTH ERROR]', err);
      }
      setErr(humanizeFirebaseError(err));
    }
  }

  return { email, password, setEmail, setPassword, loading, error, onSubmit };
}
