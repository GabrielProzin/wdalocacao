'use client';

import { FaUser, FaLock } from 'react-icons/fa6';
import { useLogin } from '../hooks/useLogin';
import styles from '@/styles/loginPage/loginPage.module.css';
import { poppins } from '../../../fonts/fonts';
import { Profiler, type ProfilerOnRenderCallback } from 'react';

export function LoginForm() {
  const { email, password, setEmail, setPassword, loading, onSubmit } =
<<<<<<< HEAD
    useLogin('/');
=======
    useLogin('/home');
>>>>>>> 9bfcbf4 (new home page test)

  const onRender: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    console.log({
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
    });
  };

  return (
    <Profiler id="Login" onRender={onRender}>
      <div className={styles.page}>
        <div className={styles.container}>
          <form onSubmit={onSubmit}>
            <h1 className={`${styles.title} ${poppins.className}`}>
              WDA Locação
            </h1>

            <div className={styles.inputField}>
              <input
                type="email"
                className={styles.input}
                placeholder="E-mail:"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <FaUser className={styles.icon} />
            </div>

            <div className={styles.inputField}>
              <input
                type="password"
                className={styles.input}
                placeholder="Senha:"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <FaLock className={styles.icon} />
            </div>

            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? 'Entrando...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </Profiler>
  );
}
