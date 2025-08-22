'use client';

import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/auth';
import { FaUser, FaLock } from 'react-icons/fa';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const ALLOWED_UID = process.env.NEXT_PUBLIC_ALLOWED_UID!;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const cred = await signInWithEmailAndPassword(auth, username, password);
      const uid = cred.user.uid;

      if (uid === ALLOWED_UID) {
        router.push('/');
        console.log('voce conseguiu!');
      } else {
        await signOut(auth);
        console.log('Conta não autorizada para este sistema.');
      }
    } catch {
      console.log('Falha ao entrar. Verifique e-mail e senha.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Acesse o sistema</h1>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <FaUser className="icon" />
        </div>
        <div>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};
