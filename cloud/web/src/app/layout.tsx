/**
 * @format
 */

import '@/styles/globals.css';

import { cn } from '@/lib/utils';
import { CookiesProvider } from 'next-client-cookies/server';

export const metadata = {
  title: 'Robyn',
  description: '',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <head />
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <CookiesProvider>{children}</CookiesProvider>
      </body>
    </html>
  );
}
