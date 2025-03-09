import React from 'react';
import './globals.css';
import { TeamProvider } from '@/contexts/TeamContext';

export const metadata = {
  title: 'Spirit II',
  description: 'Spirit II Fantasy Cricket Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <TeamProvider>
          {children}
        </TeamProvider>
      </body>
    </html>
  );
}
