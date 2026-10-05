'use client';
import { ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getAllowedUids } from '../utils/allowedUids';
export default function Protected({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const pathname = usePathname();
  const router = useRouter();
  const allowed = !!user && getAllowedUids().includes(user.uid);
  const login = pathname.startsWith('/login');
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => {
    if (user === undefined) return;
    if (login && allowed) router.replace('/home');
    if (!login && !allowed) router.replace('/login');
    if (user && !allowed) void signOut(auth);
  }, [user, allowed, login, router]);
  if (user === undefined || (!login && !allowed) || (login && allowed))
    return (
      <div
        className="state"
        role="status"
        style={{ maxWidth: 400, margin: '15vh auto' }}
      >
        Preparando seu espaço…
      </div>
    );
  return children;
}
