import { TrpcProvider } from '@web/contexts/TrpcContext';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

import { Providers } from '@web/components/Providers';
import { UserProvider } from './user/UserContext';

export const metadata: Metadata = {
  title: 'Sociable Spark',
  description: 'Get to know your community',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TrpcProvider>
      <UserProvider>
        <html className="bg-background text-foreground dark">
          <body>
            <Providers>
              <main>{children}</main>
              <Toaster />
            </Providers>
          </body>
        </html>
      </UserProvider>
    </TrpcProvider>
  );
}
