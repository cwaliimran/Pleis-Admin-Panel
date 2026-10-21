import { Inter } from 'next/font/google';
import Providers from './providers';
import { metadata as appMetadata } from './metadata';
import './globals.css';
import 'react-phone-input-2/lib/style.css';

export const metadata = appMetadata;

const inter = Inter({
  variable: '--font-inter',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
