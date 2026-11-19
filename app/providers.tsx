'use client';

import AuthProvider from '@/components/providers/AuthProvider';
import { ThemeProvider } from '@/components/templates/theme-provider';
import { store } from '@/store/store';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname]);

  return (
    <>
      <Toaster position="top-right" />
      <Provider store={store}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange={false}
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </Provider>
    </>
  );
}
