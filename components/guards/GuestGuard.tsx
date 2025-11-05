'use client';

import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * GuestGuard - Protects authentication pages (login, register, etc.)
 * Redirects authenticated users to their appropriate dashboard
 * Only allows unauthenticated users (guests) to access wrapped pages
 */
export default function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.userSlice.user);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      // Check if user is authenticated with valid token and project key
      const isAuthenticated = user && user.token && user.key === process.env.NEXT_PUBLIC_PROJECT_KEY;

      if (isAuthenticated) {
        // Redirect to appropriate dashboard based on user role
        const redirectPath = user.role === 'admin' ? '/super-admin' : '/organizer';
        router.replace(redirectPath);
        return;
      }

      // User is not authenticated, allow access to guest pages
      setIsChecking(false);
    };

    checkAuthStatus();
  }, [user, router]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center dark:bg-black">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900 dark:border-gray-100"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Render children only for unauthenticated users
  return <>{children}</>;
}
