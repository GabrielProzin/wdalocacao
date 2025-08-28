'use client';

import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

export function Logout() {
  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);
    router.replace('/login');
  }

  return <button onClick={handleLogout}>Sair</button>;
}
