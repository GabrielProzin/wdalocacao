'use client';
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import {
  FiGrid,
  FiList,
  FiPlus,
  FiLogOut,
  FiArrowUpRight,
  FiDollarSign,
} from 'react-icons/fi';
import { auth } from '@/lib/auth';
import { AlugueisProvider } from '@/features/aluguel/hooks/AlugueisContext';
import styles from './shell.module.css';
import { DespesasProvider } from '@/features/despesas/DespesasContext';
const nav = [
  { href: '/home', label: 'Visão geral', Icon: FiGrid },
  { href: '/Aluguel/List', label: 'Aluguéis', Icon: FiList },
  { href: '/Aluguel/New', label: 'Novo aluguel', Icon: FiPlus },
  { href: '/Despesas', label: 'Despesas', Icon: FiDollarSign },
];
export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState('');
  if (pathname.startsWith('/login')) return children;
  async function logout() {
    setLeaving(true);
    try {
      await signOut(auth);
      router.replace('/login');
    } catch {
      setError('Não foi possível sair. Tente novamente.');
      setLeaving(false);
    }
  }
  return (
    <AlugueisProvider>
      <DespesasProvider>
        <div className={styles.shell}>
          <aside className={styles.sidebar}>
            <Link href="/home" className={styles.brand}>
              <span className={styles.mark}>w.</span>
              <span>
                WDA<span className={styles.brandSub}>LOCAÇÃO</span>
              </span>
            </Link>
            <p className={styles.navCaption}>SEU ESPAÇO DE TRABALHO</p>
            <nav aria-label="Navegação principal">
              {nav.map(({ href, label, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={pathname === href ? 'page' : undefined}
                  className={`${styles.navLink} ${pathname === href ? styles.active : ''}`}
                >
                  <Icon size={19} />
                  {label}
                  {pathname === href && <span className={styles.activeDot} />}
                </Link>
              ))}
            </nav>
            <div className={styles.sidebarBottom}>
              <div className={styles.tip}>
                <FiArrowUpRight size={22} />
                <h3>
                  Mais organização.
                  <br />
                  Mais tranquilidade.
                </h3>
                <p>Seus aluguéis, do primeiro contato à devolução.</p>
              </div>
              <span className={styles.account}>
                Uso exclusivo · WDA Locação
              </span>
              <button
                className={styles.logout}
                onClick={logout}
                disabled={leaving}
              >
                <FiLogOut />
                {leaving ? 'Saindo…' : 'Sair da conta'}
              </button>
            </div>
          </aside>
          <div className={styles.workspace}>
            <header className={styles.header}>
              <Link href="/home" className={styles.mobileBrand}>
                <span className={styles.mark}>w.</span>
                <strong>WDA Locação</strong>
              </Link>
              <div className={styles.breadcrumb}>
                WDA Locação <span>/</span>{' '}
                {pathname.startsWith('/Despesas')
                  ? 'Despesas'
                  : pathname.includes('/New')
                    ? 'Novo aluguel'
                    : pathname.includes('/Edit')
                      ? 'Editar aluguel'
                      : pathname.includes('/List')
                        ? 'Aluguéis'
                        : 'Visão geral'}
              </div>
              <div className={styles.headerRight}>
                <span className={styles.headerNote}>
                  Um dia organizado começa aqui.
                </span>
                <button
                  className={styles.mobileLogout}
                  onClick={logout}
                  disabled={leaving}
                  aria-label="Sair da conta"
                >
                  <FiLogOut size={18} />
                </button>
                <span className={styles.avatar} aria-hidden="true">
                  W
                </span>
              </div>
            </header>
            <main className={styles.content}>
              {error && (
                <p role="alert" className="error-box">
                  {error}
                </p>
              )}
              {children}
            </main>
            <footer className={styles.footer}>
              WDA Locação <span>Feito para simplificar o seu dia.</span>
            </footer>
          </div>
          <nav className={styles.mobileNav} aria-label="Navegação no celular">
            {nav.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? 'page' : undefined}
                className={pathname === href ? styles.mobileActive : ''}
              >
                <Icon size={21} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </DespesasProvider>
    </AlugueisProvider>
  );
}
