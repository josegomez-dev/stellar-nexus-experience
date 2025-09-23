import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { config } from '@/lib/config';
import { suppressHydrationWarning } from '@/lib/suppress-hydration';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: config.app.name,
  description: `Experience the future of decentralized work with ${config.app.name} on the Stellar blockchain. Master trustless escrow management with our interactive demo suite.`,
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Suppress hydration warnings in development
  if (config.development.isDevelopment) {
    suppressHydrationWarning();
  }

  return (
    <html lang='en' className='scroll-smooth'>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
