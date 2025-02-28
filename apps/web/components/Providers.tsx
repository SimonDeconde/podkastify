'use client';

import { HeroUIProvider } from '@heroui/react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>;
}
