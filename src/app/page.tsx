import styles from './../styles/homePage/homePage.module.css';
import Link from 'next/link';
import { poppins, openSans, montserrat } from '../fonts/fonts';
//import { Logout } from '@/features/auth/components/Logout';

export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={`${styles.title} ${poppins.className}`}>
          Sistema de Locação
        </h1>
        <p className={`${styles.subtitle} ${openSans.className}`}>
          Escolha uma das opções abaixo
        </p>

        <div className={styles.actions}>
          <Link
            href="/Aluguel/New"
            className={`${styles.btn} ${styles.btnSecondary} ${montserrat.className}`}
          >
            <span className={styles.btnText}> Cadastrar novo aluguel</span>
          </Link>
          <Link
            href="Aluguel/List"
            className={`${styles.btn} ${styles.btnSecondary} ${montserrat.className}`}
          >
            <span className={styles.btnText}> Lista de Aluguel</span>
          </Link>
          {/* <Logout /> */}
        </div>
      </div>
    </main>
  );
}
