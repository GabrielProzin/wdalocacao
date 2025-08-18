export const metadata = {
  title: 'WDA Locação',
  description: 'Controle de cadastros de aluguel de mesas e cadeiras',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0
}

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
          // backgroundColor: 'white',
          backgroundColor: '#343541',
          minHeight: '100vh',
        }}
      >
        {children}
        
      </body>
    </html>
  );
}
