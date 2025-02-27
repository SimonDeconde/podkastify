import { TrpcProvider } from '@web/contexts/TrpcContext';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

import { Providers } from '@web/components/Providers';
import { UserProvider } from './user/UserContext';

export const metadata: Metadata = {
  title: 'Podkastify',
  description: 'Listen to your Youtube videos!',
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
