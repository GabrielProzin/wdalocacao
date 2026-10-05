import Protected from '@/features/auth/components/Protected';
import AppShell from '@/features/layout/AppShell';
import './globals.css';
import type { Viewport } from 'next';
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#167768',
};

export const metadata = {
  title: 'WDA Locação',
  description: 'Controle de cadastros de aluguel de mesas e cadeiras',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Protected>
          <AppShell>{children}</AppShell>
        </Protected>
      </body>
    </html>
  );
}
