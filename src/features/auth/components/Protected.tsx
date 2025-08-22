'use client';

import { ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

function getAllowedUids() {
  const multi = (process.env.NEXT_PUBLIC_ALLOWED_UIDS ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const single = (process.env.NEXT_PUBLIC_ALLOWED_UID ?? '').trim();
  return [...multi, ...(single ? [single] : [])];
}

export default function Protected({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const allowedUids = getAllowedUids();

    const unsub = onAuthStateChanged(auth, async user => {
      const isLogin = pathname?.startsWith('/login');

      if (isLogin) {
        if (user && allowedUids.includes(user.uid)) {
          setReady(true);
          router.replace('/');
        } else {
          setReady(true);
        }
        return;
      }

      if (!user) {
        setReady(true);
        router.replace('/login');
        return;
      }

      if (!allowedUids.includes(user.uid)) {
        await signOut(auth);
        setReady(true);
        router.replace('/login');
        return;
      }

      setReady(true);
    });

    return () => unsub();
  }, [pathname, router]);

  if (!ready) return <div style={{ padding: 16 }}>Carregando…</div>;
  return <>{children}</>;
}
