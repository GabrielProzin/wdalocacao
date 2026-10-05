'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/auth';
import { getAllowedUids } from '../utils/allowedUids';
import { humanizeFirebaseError } from '../utils/errorMessages';
export function useLogin(redirectTo = '/home') {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setErr] = useState<string | null>(null);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setErr(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      if (!getAllowedUids().includes(cred.user.uid)) {
        await signOut(auth);
        setErr('Esta conta não está autorizada a acessar o sistema.');
        return;
      }
      router.replace(redirectTo);
    } catch (err) {
      setErr(humanizeFirebaseError(err));
    } finally {
      setLoading(false);
    }
  }
  return { email, password, setEmail, setPassword, loading, error, onSubmit };
}
