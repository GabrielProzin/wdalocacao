'use client';

import { useState } from 'react';
import Sidebar from '@/features/layout/Sidebar';
import Topbar from '@/features/layout/Topbar';
import StatsCards from '@/features/dashboard/StatsCards';
import QuickActions from '@/features/dashboard/QuickActions';
import RentalsTable from '@/features/rentals/RentalsTable';
import RentalModal from '@/features/rentals/RentalModal';
import styles from '@/features/layout/layout.module.css';

export default function PainelPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <Sidebar open={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.mainCol}>
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className={styles.mainArea}>
          <StatsCards />
          <QuickActions onNewRental={() => setModalOpen(true)} />
          <RentalsTable />
        </main>
      </div>
      <RentalModal open={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
