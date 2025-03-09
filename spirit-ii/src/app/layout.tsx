import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Spirit II',
  description: 'Spirit II application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
