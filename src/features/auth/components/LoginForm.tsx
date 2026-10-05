'use client';
import { FiArrowRight, FiLock } from 'react-icons/fi';
import { useLogin } from '../hooks/useLogin';
import styles from './login.module.css';
export function LoginForm() {
  const { email, password, setEmail, setPassword, loading, error, onSubmit } =
    useLogin();
  return (
    <main className={styles.page}>
      <div className={styles.intro}>
        <span className={styles.brand}>w.</span>
        <p className="eyebrow">WDA LOCAÇÃO</p>
        <h1>
          Menos anotações.
          <br />
          Mais organização.
        </h1>
        <p>
          Do primeiro pedido à última cadeira devolvida.
          <br />
          Tudo no seu ritmo, em um só lugar.
        </p>
        <div className={styles.introBottom}>
          SIMPLES PARA USAR. FEITO PARA O SEU DIA.
        </div>
      </div>
      <div className={styles.card}>
        <span className={styles.smallBrand}>w.</span>
        <p className="eyebrow">BEM-VINDO DE VOLTA</p>
        <h2>Seu dia começa aqui.</h2>
        <p className={styles.subtitle}>Entre para cuidar dos seus aluguéis.</p>
        <form onSubmit={onSubmit}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="username"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="Sua senha"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && (
            <p role="alert" className="error-box">
              {error}
            </p>
          )}
          <button className="primary" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar no meu espaço'}
            <FiArrowRight />
          </button>
        </form>
        <p className={styles.foot}>
          <FiLock /> Acesso exclusivo e protegido.
        </p>
      </div>
    </main>
  );
}
