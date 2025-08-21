'use client';

import { motion } from 'framer-motion';
import { MdEventSeat } from 'react-icons/md';
import styles from '@/styles/rent/list/rentList.module.css';

export default function AluguelLoader() {
  return (
    <div className={styles.loaderWrapper}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className={styles.loaderIcon}
      >
        <MdEventSeat />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 1 }}
        className={styles.loaderText}
      >
        Carregando lista...
      </motion.p>
    </div>
  );
}
