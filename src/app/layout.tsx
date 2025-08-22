import Protected from '@/features/auth/components/Protected';

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
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#343541',
          minHeight: '100vh',
        }}
      >
        <Protected>{children}</Protected>
      </body>
    </html>
  );
}
