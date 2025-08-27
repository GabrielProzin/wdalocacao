'use client';

import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

export function Logout() {
  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);
<<<<<<< HEAD
    router.replace('/login'); // força redirecionar pro login
=======
    router.replace('/login');
>>>>>>> 9bfcbf4 (new home page test)
  }

  return <button onClick={handleLogout}>Sair</button>;
}
